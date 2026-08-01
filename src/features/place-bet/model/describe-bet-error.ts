import { ApiError } from '@/shared/api/api-error'
import type { ValidationError } from '@/shared/api/types/problem'

export interface BetErrorDescription {
  message: string
  fieldErrors: ValidationError[]
  isValidation: boolean
}

const FALLBACK = 'Не удалось отправить ставку'

export function describeBetError(error: unknown): BetErrorDescription {
  if (!(error instanceof ApiError)) {
    return { message: FALLBACK, fieldErrors: [], isValidation: false }
  }

  if (error.isValidation) {
    const fieldErrors = error.validationErrors
    return {
      message: fieldErrors[0]?.message ?? error.message,
      fieldErrors,
      isValidation: true,
    }
  }

  if (error.isNotFound) {
    return { message: 'Аукцион больше не доступен', fieldErrors: [], isValidation: false }
  }

  if (error.isUnavailable) {
    return {
      message: 'Сервис торгов временно недоступен, попробуйте ещё раз',
      fieldErrors: [],
      isValidation: false,
    }
  }

  return { message: error.message || FALLBACK, fieldErrors: [], isValidation: false }
}
