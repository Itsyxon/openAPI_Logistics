import { describe, expect, it } from 'vitest'
import { normalizeSearch, validateAuctionsSearch } from './search-schema'

describe('валидация search params', () => {
  it('подставляет безопасные значения вместо мусора', () => {
    const search = normalizeSearch(
      validateAuctionsSearch({ page: 'abc', per_page: 999, price_from: 'нет' }),
    )

    expect(search.page).toBe(1)
    expect(search.per_page).toBe(20)
    expect(search.price_from).toBeUndefined()
  })

  it('отбрасывает неизвестные значения enum-ов, не роняя разбор', () => {
    const search = normalizeSearch(
      validateAuctionsSearch({ auc_type: ['Down', 'Teleport'], statuses: [2, 42] }),
    )

    expect(search.auc_type).toEqual([])
    expect(search.statuses).toEqual([])
  })

  it('сохраняет корректные значения', () => {
    const search = normalizeSearch(
      validateAuctionsSearch({
        page: 3,
        auc_type: ['Down', 'Up'],
        statuses: [2],
        status: ['Leading'],
        cargo_num: '00000001059',
        load_city: 'Москва',
        load_date_from: '2026-07-01',
        is_available: true,
        price_to: 150000,
      }),
    )

    expect(search).toMatchObject({
      page: 3,
      auc_type: ['Down', 'Up'],
      statuses: [2],
      status: ['Leading'],
      cargo_num: '00000001059',
      load_city: 'Москва',
      load_date_from: '2026-07-01',
      is_available: true,
      price_to: 150000,
    })
  })

  it('на полностью пустом входе даёт рабочие значения по умолчанию', () => {
    const search = normalizeSearch(validateAuctionsSearch({}))

    expect(search.page).toBe(1)
    expect(search.per_page).toBe(20)
    expect(search.status).toEqual([])
    expect(search.auc_type).toEqual([])
  })

  it('игнорирует некорректный формат даты', () => {
    const search = normalizeSearch(validateAuctionsSearch({ load_date_from: '01.07.2026' }))
    expect(search.load_date_from).toBeUndefined()
  })
})
