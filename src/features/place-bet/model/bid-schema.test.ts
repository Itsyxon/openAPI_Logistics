import { describe, expect, it } from 'vitest'
import { createBidSchema, type BidLimits } from './bid-schema'

const DOWN: BidLimits = {
  min: 80000,
  max: 120000,
  step: 500,
  start: 120000,
  available: 118000,
  aucType: 'Down',
}

const UP: BidLimits = {
  min: 65000,
  max: 140000,
  step: 1000,
  start: 65000,
  available: 71000,
  aucType: 'Up',
}

const FIX: BidLimits = {
  min: null,
  max: null,
  step: null,
  start: 48000,
  available: 48000,
  aucType: 'FixPrice',
}

function check(limits: BidLimits, price: unknown) {
  return createBidSchema(limits).safeParse({ price })
}

function message(limits: BidLimits, price: unknown) {
  const result = check(limits, price)
  return result.success ? null : result.error.issues[0]?.message
}

describe('схема ставки', () => {
  it('требует цену: пустое поле приходит как NaN', () => {
    expect(message(DOWN, Number.NaN)).toBe('Введите цену')
    expect(message(DOWN, undefined)).toBe('Введите цену')
  })

  it('не пропускает ноль и отрицательные значения', () => {
    expect(message(DOWN, 0)).toBe('Цена должна быть больше 0')
    expect(message(DOWN, -500)).toBe('Цена должна быть больше 0')
  })

  it('проверяет минимум и максимум из detail DTO', () => {
    expect(message(DOWN, 79500)).toContain('Не меньше')
    expect(message(DOWN, 120500)).toContain('Не больше')
  })

  it('требует кратность шагу', () => {
    expect(message(DOWN, 117999)).toContain('кратна шагу')
    expect(check(DOWN, 118000).success).toBe(true)
    expect(check(DOWN, 117500).success).toBe(true)
  })

  it('на понижение не даёт поставить выше доступной цены', () => {
    expect(message(DOWN, 118500)).toContain('не выше')
  })

  it('на повышение не даёт поставить ниже доступной цены', () => {
    expect(message(UP, 70000)).toContain('не ниже')
    expect(check(UP, 71000).success).toBe(true)
  })

  it('без min/max/step проверяет только положительность', () => {
    expect(check(FIX, 48000).success).toBe(true)
    expect(check(FIX, 12345).success).toBe(true)
    expect(message(FIX, 0)).toBe('Цена должна быть больше 0')
  })
})
