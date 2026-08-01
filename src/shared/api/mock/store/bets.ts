import type { BetItem } from '@/shared/api/types/bet'
import type { ValidationError } from '@/shared/api/types/problem'
import { CURRENT_USER, withoutVat } from '../current-user'
import type { AuctionRecord } from '../record'

const EPSILON = 0.001

let betSequence = 1

export function resetBetSequence() {
  betSequence = 1
}

function ascending(record: AuctionRecord) {
  return record.show.main.auc_type !== 'Up'
}

function activeBets(record: AuctionRecord) {
  return record.bets.filter((bet) => !bet.is_rejected)
}

function sortBets(record: AuctionRecord, bets: BetItem[]) {
  const direction = ascending(record) ? 1 : -1
  return [...bets].sort(
    (a, b) => direction * (a.price_with_vat - b.price_with_vat) || a.id - b.id,
  )
}

function computeAvailable(record: AuctionRecord, current: number): number | null {
  const { price } = record.show.trading
  if (price.step === null) return current

  const next =
    record.show.main.auc_type === 'Up'
      ? current + price.step
      : record.show.main.auc_type === 'FixPrice'
        ? current
        : current - price.step

  if (price.min !== null && next < price.min) return price.min
  if (price.max !== null && next > price.max) return price.max
  return next
}

export function recompute(record: AuctionRecord) {
  const trading = record.show.trading
  const ranked = sortBets(record, activeBets(record))

  ranked.forEach((bet, index) => {
    bet.place = index + 1
    bet.is_win = index === 0
  })
  record.bets
    .filter((bet) => bet.is_rejected)
    .forEach((bet) => {
      bet.place = null
      bet.is_win = false
    })

  const best = ranked[0]
  const current = best ? best.price_with_vat : (trading.price.start ?? 0)

  trading.price.current = current
  trading.price.current_no_vat = withoutVat(current)

  const available = computeAvailable(record, current)
  trading.price.available = available
  trading.price.available_no_vat = available === null ? null : withoutVat(available)

  const mine = ranked.filter((bet) => bet.subscriber_id === CURRENT_USER.subscriber_id)
  const myBest = mine[0] ?? null

  trading.is_bidder = mine.length > 0
  trading.your.bet = mine.length > 0
  trading.your.last_bet = myBest ? myBest.price_no_vat : null
  trading.your.last_bet_with_vat = myBest ? myBest.price_with_vat : null
  trading.your.win = myBest ? myBest.is_win : false
  trading.is_last_bet_with_vat = myBest ? record.show.payment.form.includes('с НДС') : null

  if (!myBest) {
    trading.status_mobile = 'NotParticipating'
  } else if (myBest.is_win) {
    trading.status_mobile =
      trading.status === 'Finished' || trading.status === 'WaitDeal' ? 'Winner' : 'Leading'
  } else {
    trading.status_mobile = 'Losing'
  }
}

interface BetAuthor {
  subscriber_id: number
  organization_id: number
  organization_inn: string
  organization_name: string
  contact_name: string
  contact_phone: string
}

export function createBet(record: AuctionRecord, priceWithVat: number, author: BetAuthor): BetItem {
  const withVatPayment = record.show.payment.form.includes('с НДС')

  return {
    id: betSequence++,
    created_at: new Date().toISOString().replace('Z', ''),
    auction_id: record.show.main.id,
    subscriber_id: author.subscriber_id,
    contact_name: author.contact_name,
    contact_phone: author.contact_phone,
    price_with_vat: priceWithVat,
    price_no_vat: withoutVat(priceWithVat),
    organization_id: author.organization_id,
    organization_inn: author.organization_inn,
    organization_name: author.organization_name,
    transporter_comment: null,
    is_rejected: false,
    is_counter: false,
    place: null,
    is_win: false,
    run_number: 0,
    cancel_reason: '',
    price_info: {
      price_with_vat: priceWithVat,
      price_no_vat: withoutVat(priceWithVat),
      payment_type: record.show.payment.form,
      vat_rate: withVatPayment ? '20' : '0',
    },
  }
}

export function seedRivalBets(record: AuctionRecord, prices: number[]) {
  prices.forEach((price, index) => {
    record.bets.push(
      createBet(record, price, {
        subscriber_id: 20 + index,
        organization_id: 40 + index,
        organization_inn: `77016${String(index).padStart(5, '0')}`,
        organization_name: index === 0 ? 'ООО ТрансЛайн' : 'ООО АвтоПуть',
        contact_name: index === 0 ? 'Сидоров Сергей' : 'Гусев Артём',
        contact_phone: '+77777777778',
      }),
    )
  })
}

export function listBetsFromStore(record: AuctionRecord, all: boolean) {
  if (record.show.trading.hide_bets_history) return []

  const ranked = sortBets(record, activeBets(record))
  if (!all) return ranked

  return ranked.concat(record.bets.filter((bet) => bet.is_rejected))
}

export function validateBet(record: AuctionRecord, price: unknown): ValidationError[] {
  const trading = record.show.trading

  if (!trading.can_set_bet) {
    return [
      {
        field: 'price',
        message: 'Ставки по этому аукциону сейчас недоступны',
        code: 'bet_not_allowed',
      },
    ]
  }

  if (typeof price !== 'number' || !Number.isFinite(price)) {
    return [{ field: 'price', message: 'Цена должна быть числом', code: 'invalid_type' }]
  }

  if (price <= 0) {
    return [{ field: 'price', message: 'Цена должна быть больше 0', code: 'min_value' }]
  }

  const errors: ValidationError[] = []
  const { min, max, step, available } = trading.price

  if (min !== null && price < min - EPSILON) {
    errors.push({
      field: 'price',
      message: `Значение должно быть не меньше ${min}`,
      code: 'min_value',
    })
  }

  if (max !== null && price > max + EPSILON) {
    errors.push({
      field: 'price',
      message: `Значение должно быть не больше ${max}`,
      code: 'max_value',
    })
  }

  if (errors.length > 0) return errors

  if (available !== null && record.show.main.auc_type === 'Down' && price > available + EPSILON) {
    errors.push({
      field: 'price',
      message: `Ставка должна быть не выше доступной цены ${available}`,
      code: 'not_improving',
    })
  }

  if (available !== null && record.show.main.auc_type === 'Up' && price < available - EPSILON) {
    errors.push({
      field: 'price',
      message: `Ставка должна быть не ниже доступной цены ${available}`,
      code: 'not_improving',
    })
  }

  if (errors.length > 0) return errors

  if (step !== null && step > 0 && trading.price.start !== null) {
    const diff = Math.abs(trading.price.start - price)
    const deviation = Math.abs(diff - Math.round(diff / step) * step)
    if (deviation > EPSILON) {
      errors.push({
        field: 'price',
        message: `Цена должна быть кратна шагу ${step}`,
        code: 'step_mismatch',
      })
    }
  }

  return errors
}

export function placeBet(record: AuctionRecord, price: number) {
  record.bets.push(
    createBet(record, price, {
      subscriber_id: CURRENT_USER.subscriber_id,
      organization_id: CURRENT_USER.organization_id,
      organization_inn: CURRENT_USER.organization_inn,
      organization_name: CURRENT_USER.organization_name,
      contact_name: CURRENT_USER.contact_name,
      contact_phone: CURRENT_USER.contact_phone,
    }),
  )
  recompute(record)
}

export function countParticipants(record: AuctionRecord) {
  return new Set(activeBets(record).map((bet) => bet.subscriber_id)).size
}
