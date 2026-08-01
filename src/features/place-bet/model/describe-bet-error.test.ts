import { describe, expect, it } from 'vitest'
import { ApiError } from '@/shared/api/api-error'
import type { ValidationProblem } from '@/shared/api/types/problem'
import { describeBetError } from './describe-bet-error'

describe('разбор ошибки ставки', () => {
  it('вытаскивает все ошибки полей из 422', () => {
    const problem: ValidationProblem = {
      code: 'validation_failed',
      title: 'Ошибка валидации',
      message: 'Запрос содержит некорректные поля',
      errors: [
        { field: 'price', message: 'Цена должна быть кратна шагу 500', code: 'step_mismatch' },
        { field: 'other', message: 'Что-то ещё', code: 'custom' },
      ],
    }
    const error = new ApiError(422, problem, 'fallback')

    const described = describeBetError(error)

    expect(described.isValidation).toBe(true)
    expect(described.fieldErrors).toHaveLength(2)
    expect(described.message).toBe('Цена должна быть кратна шагу 500')
  })

  it('переводит 404 в понятный текст', () => {
    const error = new ApiError(
      404,
      { code: 'resource_not_found', title: 'Не найдено', message: 'Аукцион не найден' },
      'fallback',
    )

    expect(describeBetError(error)).toMatchObject({
      message: 'Аукцион больше не доступен',
      isValidation: false,
      fieldErrors: [],
    })
  })

  it('переводит 503 в сообщение о недоступности', () => {
    const error = new ApiError(503, null, 'Сервис временно недоступен')
    expect(describeBetError(error).message).toContain('временно недоступен')
  })

  it('на сетевой ошибке даёт общий текст', () => {
    expect(describeBetError(new TypeError('Failed to fetch'))).toEqual({
      message: 'Не удалось отправить ставку',
      fieldErrors: [],
      isValidation: false,
    })
  })

  it('на 422 без списка errors не падает', () => {
    const error = new ApiError(
      422,
      { code: 'validation_failed', title: 'Ошибка', message: 'Некорректные поля' },
      'fallback',
    )

    const described = describeBetError(error)
    expect(described.fieldErrors).toEqual([])
    expect(described.message).toBe('Некорректные поля')
  })
})
