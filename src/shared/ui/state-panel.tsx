import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface Props {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
  description?: ReactNode
  action?: ReactNode
  tone?: 'neutral' | 'danger'
  className?: string
}

export function StatePanel({
  icon: Icon,
  title,
  description,
  action,
  tone = 'neutral',
  className,
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-md border px-6 py-14 text-center',
        tone === 'danger'
          ? 'border-destructive/30 bg-destructive/5'
          : 'border-dashed bg-card/50',
        className,
      )}
    >
      <Icon
        className={cn('size-8', tone === 'danger' ? 'text-destructive' : 'text-rail')}
        strokeWidth={1.5}
      />
      <p className="mt-4 font-display text-xl font-semibold">{title}</p>
      {description ? (
        <div className="mt-1 max-w-md text-sm text-muted-foreground">{description}</div>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
