import { cn } from '@/shared/lib/utils'
import type { AuctionStatus, TradingStatus } from '@/shared/api/types/enums'
import {
  AUCTION_STATUS_LABEL,
  TRADING_STATUS_LABEL,
  TRADING_STATUS_TONE,
  isTradingOpen,
} from '../model/labels'

export function AuctionStatusChip({
  status,
  className,
}: {
  status: AuctionStatus
  className?: string
}) {
  const open = isTradingOpen(status)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium',
        open ? 'text-foreground' : 'text-muted-foreground',
        className,
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          open ? 'bg-primary' : 'bg-rail',
          open && 'motion-safe:animate-pulse',
        )}
      />
      {AUCTION_STATUS_LABEL[status]}
    </span>
  )
}

export function TradingStatusChip({
  status,
  className,
}: {
  status: TradingStatus
  className?: string
}) {
  if (status === 'NotParticipating') {
    return (
      <span className={cn('text-xs text-muted-foreground', className)}>
        {TRADING_STATUS_LABEL[status]}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-sm border border-current/25 px-1.5 py-0.5',
        'font-display text-[0.72rem] font-semibold uppercase tracking-[0.1em]',
        TRADING_STATUS_TONE[status],
        className,
      )}
    >
      {TRADING_STATUS_LABEL[status]}
    </span>
  )
}
