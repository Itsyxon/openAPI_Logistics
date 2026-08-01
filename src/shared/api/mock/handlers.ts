import { delay, http, HttpResponse } from 'msw'
import { API_BASE_URL, MOCK_LATENCY_MS } from '@/shared/config/api'
import type { AuctionListRequest } from '@/shared/api/types/auction-list'
import type { SetBetRequest } from '@/shared/api/types/bet'
import type { ProblemDetail, ValidationError } from '@/shared/api/types/problem'
import {
  findRecord,
  listAuctionsFromStore,
  listBetsFromStore,
  placeBet,
  validateBet,
} from './store'

const PROBLEM_HEADERS = { 'Content-Type': 'application/problem+json' }

function traceId() {
  return Math.random().toString(16).slice(2).padEnd(16, '0').slice(0, 16)
}

function problem(status: number, body: Omit<ProblemDetail, 'trace_id'>) {
  return HttpResponse.json(
    { ...body, trace_id: traceId() },
    { status, headers: PROBLEM_HEADERS },
  )
}

function notFound(message: string) {
  return problem(404, { code: 'resource_not_found', title: 'Не найдено', message })
}

function validationFailed(errors: ValidationError[]) {
  return HttpResponse.json(
    {
      code: 'validation_failed',
      title: 'Ошибка валидации',
      message: 'Запрос содержит некорректные поля',
      trace_id: traceId(),
      errors,
    },
    { status: 422, headers: PROBLEM_HEADERS },
  )
}

function validateListRequest(body: AuctionListRequest): ValidationError[] {
  const errors: ValidationError[] = []

  if (body.page !== undefined && (!Number.isInteger(body.page) || body.page < 1)) {
    errors.push({ field: 'page', message: 'Значение должно быть не меньше 1', code: 'min_value' })
  }

  if (body.per_page !== undefined) {
    if (!Number.isInteger(body.per_page) || body.per_page < 1) {
      errors.push({
        field: 'per_page',
        message: 'Значение должно быть не меньше 1',
        code: 'min_value',
      })
    } else if (body.per_page > 100) {
      errors.push({
        field: 'per_page',
        message: 'Значение должно быть не больше 100',
        code: 'max_value',
      })
    }
  }

  return errors
}

export const handlers = [
  http.post(`*${API_BASE_URL}/auctions/list`, async ({ request }) => {
    await delay(MOCK_LATENCY_MS)

    const body = (await request.json().catch(() => ({}))) as AuctionListRequest
    const errors = validateListRequest(body)
    if (errors.length > 0) return validationFailed(errors)

    return HttpResponse.json(listAuctionsFromStore(body))
  }),

  http.get(`*${API_BASE_URL}/auctions/:auctionUuid/bets`, async ({ params, request }) => {
    await delay(MOCK_LATENCY_MS)

    const record = findRecord(String(params.auctionUuid))
    if (!record) return notFound('Аукцион не найден')

    const all = new URL(request.url).searchParams.get('all') === 'true'

    return HttpResponse.json({ bets: listBetsFromStore(record, all) })
  }),

  http.post(`*${API_BASE_URL}/auctions/:auctionUuid/bets`, async ({ params, request }) => {
    await delay(MOCK_LATENCY_MS)

    const record = findRecord(String(params.auctionUuid))
    if (!record) return notFound('Аукцион не найден')

    const body = (await request.json().catch(() => null)) as SetBetRequest | null
    if (!body || typeof body !== 'object') {
      return validationFailed([
        { field: 'price', message: 'Поле обязательно для заполнения', code: 'required' },
      ])
    }

    const errors = validateBet(record, body.price)
    if (errors.length > 0) return validationFailed(errors)

    placeBet(record, body.price)

    return new HttpResponse(null, { status: 200 })
  }),

  http.get(`*${API_BASE_URL}/auctions/:auctionUuid`, async ({ params }) => {
    await delay(MOCK_LATENCY_MS)

    const record = findRecord(String(params.auctionUuid))
    if (!record) return notFound('Аукцион не найден')

    return HttpResponse.json(record.show)
  }),
]
