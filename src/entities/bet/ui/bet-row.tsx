import { Ban, Crown, Repeat2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { formatDateTime, formatMoney, formatMoneyPrecise } from '@/shared/lib/format'
import type { BetItem } from '@/shared/api/types/bet'

interface Props {
  bet: BetItem
  showPlace: boolean
  vatMode: 'with' | 'without'
  isOwn?: boolean
}

export function BetRow({ bet, showPlace, vatMode, isOwn = false }: Props) {
  const primary = vatMode === 'with' ? bet.price_with_vat : bet.price_no_vat
  const secondary = vatMode === 'with' ? bet.price_no_vat : bet.price_with_vat
  const secondaryLabel = vatMode === 'with' ? 'без НДС' : 'с НДС'

  return (
    <li
      className={cn(
        'relative flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors',
        bet.is_rejected && 'opacity-60',
        isOwn ? 'border-primary/45 bg-primary/6' : 'bg-card',
      )}
    >
      <span
        className={cn(
          'num flex size-8 shrink-0 items-center justify-center rounded-sm border text-sm font-semibold',
          bet.is_win && !bet.is_rejected
            ? 'border-winner/50 bg-winner/12 text-winner'
            : 'text-muted-foreground',
        )}
      >
        {bet.is_rejected ? <Ban className="size-3.5" /> : showPlace ? (bet.place ?? '—') : '·'}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="truncate text-sm font-medium">{bet.organization_name}</span>
          {isOwn ? (
            <span className="rounded-sm bg-primary/15 px-1.5 font-display text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-primary">
              моя
            </span>
          ) : null}
          {bet.is_win && !bet.is_rejected ? (
            <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-winner">
              <Crown className="size-3" />
              победитель
            </span>
          ) : null}
          {bet.is_counter ? (
            <span className="inline-flex items-center gap-1 text-[0.68rem] text-muted-foreground">
              <Repeat2 className="size-3" />
              встречная
            </span>
          ) : null}
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-[0.7rem] text-muted-foreground">
          <span className="num">ИНН {bet.organization_inn}</span>
          <span className="num">{formatDateTime(bet.created_at)}</span>
        </div>

        {bet.is_rejected ? (
          <p className="mt-1 text-xs text-losing">
            Ставка отменена{bet.cancel_reason ? `: ${bet.cancel_reason}` : ''}
          </p>
        ) : null}
      </div>

      <div className="shrink-0 text-right">
        <p className="num text-base font-semibold leading-tight">
          {formatMoney(primary)}
          <span className="ml-1 text-xs font-normal text-muted-foreground">₽</span>
        </p>
        <p className="num text-[0.7rem] text-muted-foreground">
          {formatMoneyPrecise(secondary)} {secondaryLabel}
        </p>
      </div>
    </li>
  )
}
