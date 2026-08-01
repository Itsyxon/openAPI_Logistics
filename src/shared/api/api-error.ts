import type { ProblemDetail, ValidationError, ValidationProblem } from './types/problem'
import { isValidationProblem } from './types/problem'

export class ApiError extends Error {
  readonly status: number
  readonly problem: ProblemDetail | null

  constructor(status: number, problem: ProblemDetail | null, fallbackMessage: string) {
    super(problem?.message ?? fallbackMessage)
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
  }

  get code() {
    return this.problem?.code ?? null
  }

  get validationErrors(): ValidationError[] {
    if (!this.problem || !isValidationProblem(this.problem)) return []
    return (this.problem as ValidationProblem).errors
  }

  get isValidation() {
    return this.status === 422
  }

  get isUnauthorized() {
    return this.status === 401
  }

  get isNotFound() {
    return this.status === 404
  }

  get isUnavailable() {
    return this.status === 503
  }
}
