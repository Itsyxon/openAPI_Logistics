export interface ProblemDetail {
  code: string
  title: string
  message: string
  trace_id?: string | null
}

export interface ValidationError {
  field: string
  message: string
  code?: string | null
}

export interface ValidationProblem extends ProblemDetail {
  errors: ValidationError[]
}

export function isValidationProblem(problem: ProblemDetail): problem is ValidationProblem {
  return Array.isArray((problem as ValidationProblem).errors)
}
