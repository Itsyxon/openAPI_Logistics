import { describe, expect, it } from 'vitest'
import { normalizeSearch, validateAuctionsSearch } from './search-schema'
import { countActiveFilters, searchToListRequest } from './to-request'

function build(input: Record<string, unknown>) {
  return searchToListRequest(normalizeSearch(validateAuctionsSearch(input)))
}

describe('сборка запроса списка', () => {
  it('на пустых фильтрах отправляет только пагинацию', () => {
    const request = build({})

    expect(request.page).toBe(1)
    expect(request.per_page).toBe(20)

    const meaningful = Object.entries(request).filter(([, value]) => value !== undefined)
    expect(meaningful.map(([key]) => key).sort()).toEqual(['page', 'per_page'])
  })

  it('не отправляет пустые массивы вместо отсутствующих фильтров', () => {
    const request = build({ auc_type: [], statuses: [], status: [] })

    expect(request.auc_type).toBeUndefined()
    expect(request.statuses).toBeUndefined()
    expect(request.status).toBeUndefined()
  })

  it('разворачивает дату погрузки в границы суток', () => {
    const request = build({ load_date_from: '2026-07-01', load_date_to: '2026-07-31' })

    expect(request.load_date_from).toBe('2026-07-01T00:00:00')
    expect(request.load_date_to).toBe('2026-07-31T23:59:59')
  })

  it('кладёт цену в поля контракта current_price_from/to', () => {
    const request = build({ price_from: 50000, price_to: 150000 })

    expect(request.current_price_from).toBe(50000)
    expect(request.current_price_to).toBe(150000)
  })

  it('пустую строку номера заявки не отправляет', () => {
    expect(build({ cargo_num: '' }).cargo_num).toBeUndefined()
    expect(build({ cargo_num: '00000001059' }).cargo_num).toBe('00000001059')
  })

  it('переносит булевы фильтры как есть, включая false', () => {
    const request = build({ is_available: false, is_bidder: true })

    expect(request.is_available).toBe(false)
    expect(request.is_bidder).toBe(true)
  })
})

describe('счётчик активных фильтров', () => {
  function count(input: Record<string, unknown>) {
    return countActiveFilters(normalizeSearch(validateAuctionsSearch(input)))
  }

  it('пагинация фильтром не считается', () => {
    expect(count({ page: 5, per_page: 50 })).toBe(0)
  })

  it('считает каждую группу один раз', () => {
    expect(count({ load_date_from: '2026-07-01', load_date_to: '2026-07-31' })).toBe(1)
    expect(count({ price_from: 1, price_to: 2 })).toBe(1)
  })

  it('суммирует разные группы', () => {
    expect(
      count({
        cargo_num: '105',
        auc_type: ['Down'],
        load_city: 'Москва',
        is_bidder: true,
      }),
    ).toBe(4)
  })
})
