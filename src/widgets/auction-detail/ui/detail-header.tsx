import type { ReactNode } from 'react'
import { formatDateFull, formatDateTime } from '@/shared/lib/format'
import type { AuctionShowMain, AuctionShowTrading, Assembly } from '@/shared/api/types/auction-show'
import {
  AUCTION_TYPE_LABEL,
  AuctionStatusChip,
  AuctionTypeMark,
  TradingCountdown,
} from '@/entities/auction'

interface Props {
  main: AuctionShowMain
  trading: AuctionShowTrading
  assembly: Assembly
  action?: ReactNode
}

export function DetailHeader({ main, trading, assembly, action }: Props) {
  return (
    <header className="relative overflow-hidden rounded-md border bg-card px-5 py-5">
      <span aria-hidden className="perforation absolute inset-y-3 left-2 w-px" />

      <div className="flex flex-wrap items-start justify-between gap-4 pl-4">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <AuctionTypeMark type={main.auc_type} />
            <span className="text-xs text-muted-foreground">
              {AUCTION_TYPE_LABEL[main.auc_type]}
            </span>
            <span aria-hidden className="h-3 w-px bg-border" />
            <AuctionStatusChip status={trading.status} />
          </div>

          <h1 className="num font-display text-3xl font-bold leading-none tracking-tight">
            № {main.cargo_num}
          </h1>

          <p className="text-xs text-muted-foreground">
            создана {formatDateFull(main.created_at)}
            {assembly.num ? ` · сборка ${assembly.num}` : ''}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <TradingCountdown stopTime={trading.stop_time} />
          <p className="num text-[0.7rem] text-muted-foreground">
            {formatDateTime(trading.start_time)} — {formatDateTime(trading.stop_time)}
          </p>
          {action}
        </div>
      </div>
    </header>
  )
}
