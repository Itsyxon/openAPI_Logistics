import { cn } from '@/shared/lib/utils'
import { timeLeft, windowProgress } from '@/shared/lib/format'

interface Props {
  startTime: string
  stopTime: string
  className?: string
}

export function TradingWindowBar({ startTime, stopTime, className }: Props) {
  const progress = windowProgress(startTime, stopTime)
  const left = timeLeft(stopTime)
  const closing = left !== null && progress > 0.75

  return (
    <div className={cn('absolute inset-x-0 bottom-0 h-0.5 overflow-hidden', className)}>
      <div
        className={cn(
          'h-full transition-[width] duration-500 motion-reduce:transition-none',
          left === null ? 'bg-rail' : closing ? 'bg-losing' : 'bg-primary',
        )}
        style={{ width: `${Math.round((left === null ? 1 : progress) * 100)}%` }}
      />
    </div>
  )
}

export function TradingCountdown({ stopTime, className }: { stopTime: string; className?: string }) {
  const left = timeLeft(stopTime)

  if (left === null) {
    return <span className={cn('num text-xs text-muted-foreground', className)}>торги закрыты</span>
  }

  return (
    <span className={cn('num text-xs text-foreground', className)}>
      осталось <span className="font-semibold">{left}</span>
    </span>
  )
}
