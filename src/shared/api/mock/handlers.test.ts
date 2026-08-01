import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'
import type { AuctionListResponseBase } from '@/shared/api/types/auction-list'
import type { AuctionShowResponse } from '@/shared/api/types/auction-show'
import type { BetListResponse } from '@/shared/api/types/bet'
import type { ValidationProblem } from '@/shared/api/types/problem'
import { server } from './node'
import { resetStore } from './store'

const ORIGIN = 'http://localhost'
const DOWN_AUCTION = '3a05d045-0e67-4f85-b20a-de81d18bb001'
const FIXED_PRICE_AUCTION = '3a05d045-0e67-4f85-b20a-de81d18bb004'
const PLANNING_AUCTION = '3a05d045-0e67-4f85-b20a-de81d18bb005'
const HIDDEN_HISTORY_AUCTION = '3a05d045-0e67-4f85-b20a-de81d18bb006'
const MISSING_AUCTION = '00000000-0000-4000-8000-000000000000'

function api(path: string) {
  return `${ORIGIN}/api/v1${path}`
}

function listAuctions(body: Record<string, unknown> = {}) {
  return fetch(api('/auctions/list'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function setBet(uuid: string, price: unknown) {
  return fetch(api(`/auctions/${uuid}/bets`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price }),
  })
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(() => resetStore())

describe('POST /auctions/list', () => {
  it('возвращает конверт data + meta по схеме', async () => {
    const response = await listAuctions({ page: 1, per_page: 5 })
    expect(response.status).toBe(200)

    const body = (await response.json()) as AuctionListResponseBase
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data.length).toBeLessThanOrEqual(5)
    expect(body.meta).toMatchObject({
      current_page: 1,
      per_page: 5,
    })
    expect(body.meta.total).toBeGreaterThan(0)
    expect(body.meta.last_page).toBe(Math.ceil(body.meta.total / 5))
  })

  it('отдаёт элемент со всеми секциями AuctionListItem', async () => {
    const body = (await (
      await listAuctions({ per_page: 1 })
    ).json()) as AuctionListResponseBase
    const item = body.data[0]

    expect(Object.keys(item).sort()).toEqual(
      ['cargo', 'main', 'organizer', 'payment', 'route', 'trading'].sort(),
    )
    expect(typeof item.main.order_uid).toBe('string')
    expect(typeof item.trading.status).toBe('string')
    expect(item.trading.price).not.toBeNull()
  })

  it('фильтрует по cargo_num и auc_type', async () => {
    const byNum = (await (
      await listAuctions({ cargo_num: '00000001059' })
    ).json()) as AuctionListResponseBase
    expect(byNum.meta.total).toBe(1)
    expect(byNum.data[0].main.cargo_num).toBe('00000001059')

    const byType = (await (
      await listAuctions({ auc_type: ['FixPrice'] })
    ).json()) as AuctionListResponseBase
    expect(byType.data.every((item) => item.main.auc_type === 'FixPrice')).toBe(
      true,
    )
  })

  it('отвечает 422 с ValidationProblem на per_page больше 100', async () => {
    const response = await listAuctions({ per_page: 101 })

    expect(response.status).toBe(422)
    expect(response.headers.get('content-type')).toContain(
      'application/problem+json',
    )

    const problem = (await response.json()) as ValidationProblem
    expect(problem.code).toBe('validation_failed')
    expect(problem.errors[0]).toMatchObject({
      field: 'per_page',
      code: 'max_value',
    })
  })
})

describe('GET /auctions/{auctionUuid}', () => {
  it('возвращает детальный DTO со всеми обязательными полями', async () => {
    const response = await fetch(api(`/auctions/${DOWN_AUCTION}`))
    expect(response.status).toBe(200)

    const body = (await response.json()) as AuctionShowResponse
    for (const key of [
      'main',
      'organizer',
      'contacts',
      'cargo',
      'trading',
      'payment',
      'assembly',
      'routes',
      'admitted_organizations',
    ]) {
      expect(body).toHaveProperty(key)
    }
    expect(body.main.order_uid).toBe(DOWN_AUCTION)
    expect(body.routes.length).toBeGreaterThan(0)
  })

  it('отвечает 404 problem+json на неизвестный uuid', async () => {
    const response = await fetch(api(`/auctions/${MISSING_AUCTION}`))

    expect(response.status).toBe(404)
    expect(response.headers.get('content-type')).toContain(
      'application/problem+json',
    )

    const problem = await response.json()
    expect(problem).toMatchObject({
      code: 'resource_not_found',
      title: 'Не найдено',
    })
  })
})

describe('GET /auctions/{auctionUuid}/bets', () => {
  it('возвращает конверт bets', async () => {
    const body = (await (
      await fetch(api(`/auctions/${DOWN_AUCTION}/bets`))
    ).json()) as BetListResponse

    expect(Array.isArray(body.bets)).toBe(true)
    expect(body.bets.length).toBeGreaterThan(0)
    expect(body.bets[0].place).toBe(1)
  })

  it('скрывает отменённые ставки без all и показывает с all=true', async () => {
    const withoutAll = (await (
      await fetch(api(`/auctions/${DOWN_AUCTION}/bets`))
    ).json()) as BetListResponse
    const withAll = (await (
      await fetch(api(`/auctions/${DOWN_AUCTION}/bets?all=true`))
    ).json()) as BetListResponse

    expect(withoutAll.bets.some((bet) => bet.is_rejected)).toBe(false)
    const rejected = withAll.bets.find((bet) => bet.is_rejected)
    expect(rejected).toBeDefined()
    expect(rejected?.cancel_reason).not.toBe('')
    expect(rejected?.place).toBeNull()
  })

  it('отдаёт пустой список при hide_bets_history', async () => {
    const detail = (await (
      await fetch(api(`/auctions/${HIDDEN_HISTORY_AUCTION}`))
    ).json()) as AuctionShowResponse
    expect(detail.hide_bets_history).toBe(true)

    const body = (await (
      await fetch(api(`/auctions/${HIDDEN_HISTORY_AUCTION}/bets`))
    ).json()) as BetListResponse
    expect(body.bets).toEqual([])
  })

  it('отвечает 404 на неизвестный аукцион', async () => {
    const response = await fetch(api(`/auctions/${MISSING_AUCTION}/bets`))
    expect(response.status).toBe(404)
  })
})

describe('POST /auctions/{auctionUuid}/bets', () => {
  it('принимает ставку без тела ответа и меняет состояние стора', async () => {
    const before = (await (
      await fetch(api(`/auctions/${DOWN_AUCTION}`))
    ).json()) as AuctionShowResponse
    expect(before.trading.your.bet).toBe(false)
    expect(before.trading.status_mobile).toBe('NotParticipating')

    const price = before.trading.price.available!
    const response = await setBet(DOWN_AUCTION, price)

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('')

    const after = (await (
      await fetch(api(`/auctions/${DOWN_AUCTION}`))
    ).json()) as AuctionShowResponse
    expect(after.trading.price.current).toBe(price)
    expect(after.trading.your.bet).toBe(true)
    expect(after.trading.your.last_bet_with_vat).toBe(price)
    expect(after.trading.status_mobile).toBe('Leading')
    expect(after.trading.is_bidder).toBe(true)

    const bets = (await (
      await fetch(api(`/auctions/${DOWN_AUCTION}/bets`))
    ).json()) as BetListResponse
    expect(bets.bets[0].price_with_vat).toBe(price)
    expect(bets.bets[0].place).toBe(1)
    expect(bets.bets[0].is_win).toBe(true)
  })

  it('отражает новую ставку в списке аукционов', async () => {
    const before = (await (
      await listAuctions({ cargo_num: '00000001059' })
    ).json()) as AuctionListResponseBase
    const priceBefore = before.data[0].trading.price!.current

    const detail = (await (
      await fetch(api(`/auctions/${DOWN_AUCTION}`))
    ).json()) as AuctionShowResponse
    await setBet(DOWN_AUCTION, detail.trading.price.available!)

    const after = (await (
      await listAuctions({ cargo_num: '00000001059' })
    ).json()) as AuctionListResponseBase
    expect(after.data[0].trading.price!.current).toBeLessThan(priceBefore)
    expect(after.data[0].trading.your!.bet).toBe(true)
    expect(after.data[0].trading.status_mobile).toBe('Leading')
  })

  it('запрещает ставку при can_set_bet = false', async () => {
    const response = await setBet(PLANNING_AUCTION, 90000)

    expect(response.status).toBe(422)
    const problem = (await response.json()) as ValidationProblem
    expect(problem.errors[0]).toMatchObject({
      field: 'price',
      code: 'bet_not_allowed',
    })
  })

  it('отклоняет цену меньше или равную нулю', async () => {
    const response = await setBet(DOWN_AUCTION, 0)

    expect(response.status).toBe(422)
    const problem = (await response.json()) as ValidationProblem
    expect(problem.errors[0]).toMatchObject({
      field: 'price',
      code: 'min_value',
    })
  })

  it('отклоняет цену вне диапазона min/max', async () => {
    const tooLow = (await (
      await setBet(DOWN_AUCTION, 1000)
    ).json()) as ValidationProblem
    expect(tooLow.errors[0].code).toBe('min_value')

    const tooHigh = (await (
      await setBet(DOWN_AUCTION, 999999)
    ).json()) as ValidationProblem
    expect(tooHigh.errors[0].code).toBe('max_value')
  })

  it('отклоняет цену, не кратную шагу', async () => {
    const detail = (await (
      await fetch(api(`/auctions/${DOWN_AUCTION}`))
    ).json()) as AuctionShowResponse
    const offStep = detail.trading.price.available! - 1

    const problem = (await (
      await setBet(DOWN_AUCTION, offStep)
    ).json()) as ValidationProblem
    expect(problem.errors[0].code).toBe('step_mismatch')
  })

  it('не даёт ухудшить цену на аукционе на понижение', async () => {
    const detail = (await (
      await fetch(api(`/auctions/${DOWN_AUCTION}`))
    ).json()) as AuctionShowResponse
    const worse = detail.trading.price.current! + detail.trading.price.step!

    const problem = (await (
      await setBet(DOWN_AUCTION, worse)
    ).json()) as ValidationProblem
    expect(problem.errors[0].code).toBe('not_improving')
  })

  it('принимает ставку на FixPrice без шага и границ', async () => {
    const detail = (await (
      await fetch(api(`/auctions/${FIXED_PRICE_AUCTION}`))
    ).json()) as AuctionShowResponse
    expect(detail.trading.price.step).toBeNull()

    const response = await setBet(
      FIXED_PRICE_AUCTION,
      detail.trading.price.current!,
    )
    expect(response.status).toBe(200)
  })

  it('отвечает 404 на неизвестный аукцион', async () => {
    const response = await setBet(MISSING_AUCTION, 1000)
    expect(response.status).toBe(404)
  })
})
