import { describe, expect, it } from 'vitest'
import { formatMoney, plural, timeLeft, windowProgress } from './format'

describe('склонение', () => {
  it('склоняет по правилам русского языка', () => {
    const форма = (n: number) => plural(n, 'участник', 'участника', 'участников')

    expect(форма(1)).toBe('участник')
    expect(форма(2)).toBe('участника')
    expect(форма(5)).toBe('участников')
    expect(форма(11)).toBe('участников')
    expect(форма(21)).toBe('участник')
    expect(форма(112)).toBe('участников')
    expect(форма(0)).toBe('участников')
  })
})

describe('денежный формат', () => {
  it('на null и undefined отдаёт прочерк, а не NaN', () => {
    expect(formatMoney(null)).toBe('—')
    expect(formatMoney(undefined)).toBe('—')
  })

  it('форматирует ноль как ноль, а не как пустое значение', () => {
    expect(formatMoney(0)).toBe('0')
  })
})

describe('остаток времени торгов', () => {
  const now = new Date('2026-07-29T12:00:00Z').getTime()

  function at(offsetMinutes: number) {
    return new Date(now + offsetMinutes * 60_000).toISOString()
  }

  it('на прошедшем времени возвращает null', () => {
    expect(timeLeft(at(-1), now)).toBeNull()
    expect(timeLeft(at(0), now)).toBeNull()
  })

  it('показывает минуты, часы и дни', () => {
    expect(timeLeft(at(45), now)).toBe('45 мин')
    expect(timeLeft(at(125), now)).toBe('2 ч 05 мин')
    expect(timeLeft(at(60 * 30), now)).toBe('1 день 6 ч')
  })
})

describe('прогресс окна торгов', () => {
  const start = '2026-07-29T10:00:00Z'
  const stop = '2026-07-29T12:00:00Z'

  it('считает долю прошедшего времени', () => {
    expect(windowProgress(start, stop, new Date('2026-07-29T11:00:00Z').getTime())).toBe(0.5)
  })

  it('зажимает значение в границы 0..1', () => {
    expect(windowProgress(start, stop, new Date('2026-07-29T09:00:00Z').getTime())).toBe(0)
    expect(windowProgress(start, stop, new Date('2026-07-29T20:00:00Z').getTime())).toBe(1)
  })

  it('не делит на ноль на вырожденном окне', () => {
    expect(windowProgress(stop, start, now())).toBe(0)
    expect(windowProgress(start, start, now())).toBe(0)
  })
})

function now() {
  return new Date('2026-07-29T11:00:00Z').getTime()
}
