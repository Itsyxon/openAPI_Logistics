import { describe, expect, it } from 'vitest'
import type { BetItem } from '@/shared/api/types/bet'
import { activeBets, countParticipants, isOwnBet, sortForDisplay } from './selectors'

function bet(overrides: Partial<BetItem>): BetItem {
  return {
    id: 1,
    created_at: '2026-07-29T10:00:00',
    auction_id: 1236,
    subscriber_id: 20,
    contact_name: 'Тест',
    contact_phone: '+77777777777',
    price_with_vat: 100000,
    price_no_vat: 83333.33,
    organization_id: 40,
    organization_inn: '7701600000',
    organization_name: 'ООО Тест',
    transporter_comment: null,
    is_rejected: false,
    is_counter: false,
    place: null,
    is_win: false,
    run_number: 0,
    cancel_reason: '',
    price_info: {
      price_with_vat: 100000,
      price_no_vat: 83333.33,
      payment_type: 'Безналичная с НДС',
      vat_rate: '20',
    },
    ...overrides,
  }
}

describe('селекторы ставок', () => {
  it('отделяет отменённые ставки', () => {
    const bets = [bet({ id: 1 }), bet({ id: 2, is_rejected: true })]
    expect(activeBets(bets).map((item) => item.id)).toEqual([1])
  })

  it('считает участников по уникальным абонентам, без отменённых', () => {
    const bets = [
      bet({ id: 1, subscriber_id: 20 }),
      bet({ id: 2, subscriber_id: 20 }),
      bet({ id: 3, subscriber_id: 21 }),
      bet({ id: 4, subscriber_id: 99, is_rejected: true }),
    ]
    expect(countParticipants(bets)).toBe(2)
  })

  it('на пустом списке даёт ноль участников', () => {
    expect(countParticipants([])).toBe(0)
  })

  it('сортирует по месту, отменённые уводит в конец', () => {
    const bets = [
      bet({ id: 1, place: 2 }),
      bet({ id: 2, is_rejected: true, place: null }),
      bet({ id: 3, place: 1 }),
    ]
    expect(sortForDisplay(bets).map((item) => item.id)).toEqual([3, 1, 2])
  })

  it('ставки без места ставит после тех, у кого место есть', () => {
    const bets = [bet({ id: 1, place: null }), bet({ id: 2, place: 1 })]
    expect(sortForDisplay(bets).map((item) => item.id)).toEqual([2, 1])
  })

  it('не мутирует исходный массив', () => {
    const bets = [bet({ id: 1, place: 2 }), bet({ id: 2, place: 1 })]
    sortForDisplay(bets)
    expect(bets.map((item) => item.id)).toEqual([1, 2])
  })

  it('узнаёт собственную ставку по абоненту', () => {
    expect(isOwnBet(bet({ subscriber_id: 13 }), 13)).toBe(true)
    expect(isOwnBet(bet({ subscriber_id: 20 }), 13)).toBe(false)
  })
})
