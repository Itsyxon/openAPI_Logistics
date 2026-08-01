import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export function DetailSection({
  title,
  aside,
  children,
  className,
}: {
  title: string
  aside?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('rounded-md border bg-card', className)}>
      <header className="flex items-center justify-between gap-3 border-b px-4 py-2.5">
        <h2 className="eyebrow">{title}</h2>
        {aside}
      </header>
      <div className="px-4 py-4">{children}</div>
    </section>
  )
}

export function DataRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-dashed py-1.5 last:border-0">
      <dt className="shrink-0 text-xs text-muted-foreground">{label}</dt>
      <dd className={cn('text-right text-sm', mono && 'num')}>{value}</dd>
    </div>
  )
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="text-sm italic text-muted-foreground">{children}</p>
}
