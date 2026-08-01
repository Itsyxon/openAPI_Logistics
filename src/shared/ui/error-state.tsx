import { RotateCw, Unplug } from 'lucide-react'
import { ApiError } from '@/shared/api/api-error'
import { Button } from './button'
import { StatePanel } from './state-panel'

interface Props {
  error: unknown
  title?: string
  onRetry?: () => void
}

export function ErrorState({ error, title = 'Не удалось загрузить данные', onRetry }: Props) {
  const problem = error instanceof ApiError ? error.problem : null

  return (
    <StatePanel
      tone="danger"
      icon={Unplug}
      title={title}
      description={
        <>
          <p>{problem?.message ?? 'Сервис не ответил. Попробуйте повторить запрос.'}</p>
          {problem?.trace_id ? (
            <p className="num mt-2 text-[0.7rem]">trace {problem.trace_id}</p>
          ) : null}
        </>
      }
      action={
        onRetry ? (
          <Button variant="outline" onClick={onRetry} className="gap-2">
            <RotateCw className="size-4" />
            Повторить
          </Button>
        ) : null
      }
    />
  )
}
