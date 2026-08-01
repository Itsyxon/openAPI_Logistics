import { API_BASE_URL } from '@/shared/config/api'
import { ApiError } from './api-error'
import type { ProblemDetail } from './types/problem'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  query?: Record<string, string | number | boolean | undefined | null>
  signal?: AbortSignal
}

const STATUS_FALLBACK: Record<number, string> = {
  401: 'Требуется авторизация',
  404: 'Ресурс не найден',
  422: 'Запрос содержит некорректные поля',
  503: 'Сервис временно недоступен',
}

function buildUrl(path: string, query?: RequestOptions['query']) {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue
      url.searchParams.set(key, String(value))
    }
  }

  return url
}

async function readProblem(response: Response): Promise<ProblemDetail | null> {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('json')) return null

  try {
    return (await response.json()) as ProblemDetail
  } catch {
    return null
  }
}

export async function httpRequest<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { method = 'GET', body, query, signal } = options

  const response = await fetch(buildUrl(path, query), {
    method,
    signal,
    headers: {
      Accept: 'application/json, application/problem+json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    const problem = await readProblem(response)
    throw new ApiError(
      response.status,
      problem,
      STATUS_FALLBACK[response.status] ??
        `Запрос завершился ошибкой ${response.status}`,
    )
  }

  if (response.status === 204) return undefined as TResponse

  const text = await response.text()
  if (!text) return undefined as TResponse

  return JSON.parse(text) as TResponse
}
