import type { ReactNode } from 'react'
import { Box, Snowflake, Truck, Weight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { formatNumber } from '@/shared/lib/format'
import type { AuctionListItem } from '@/shared/api/types/auction-list'
import { AuctionTypeMark } from './auction-type-mark'
import { AuctionStatusChip, TradingStatusChip } from './status-chip'
import { RouteRail } from './route-rail'
import { PriceMeter } from './price-meter'
import { TradingCountdown, TradingWindowBar } from './trading-window'

interface Props {
  auction: AuctionListItem
  vatMode?: 'with' | 'without'
  action?: ReactNode
  overlayLink?: ReactNode
  onIntent?: () => void
  className?: string
}

export function AuctionStrip({
  auction,
  vatMode = 'with',
  action,
  overlayLink,
  onIntent,
  className,
}: Props) {
  const { main, trading, route, cargo, organizer } = auction
  const hasBet = trading.your?.bet ?? false

  return (
    <article
      onMouseEnter={onIntent}
      onFocusCapture={onIntent}
      onTouchStart={onIntent}
      className={cn(
        'group relative overflow-hidden rounded-md border bg-card',
        'transition-[border-color,box-shadow,transform] duration-200 motion-reduce:transition-none',
        'hover:border-primary/45 hover:shadow-[0_1px_0_var(--primary)] motion-safe:hover:-translate-y-px',
        hasBet && 'border-primary/40',
        className,
      )}
    >
      <span aria-hidden className="perforation absolute inset-y-2 left-2 w-px" />
      {overlayLink}

      <div className="grid gap-4 py-4 pl-7 pr-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-6">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="num text-sm font-semibold tracking-tight">№ {main.cargo_num}</span>
            <AuctionTypeMark type={main.auc_type} />
            <span aria-hidden className="hidden h-3 w-px bg-border sm:block" />
            <AuctionStatusChip status={trading.status} />
            <TradingStatusChip status={trading.status_mobile} className="ml-auto lg:ml-0" />
            {hasBet ? (
              <span className="rounded-sm bg-primary/12 px-1.5 py-0.5 font-display text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-primary">
                моя ставка
              </span>
            ) : null}
          </div>

          <RouteRail
            loadCity={route.load.city}
            loadDate={route.load.date}
            loadAddress={route.load.address || undefined}
            unloadCity={route.unload.city}
            unloadDate={route.unload.date}
            unloadAddress={route.unload.address || undefined}
          />

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 text-foreground">
              <Box className="size-3.5 text-muted-foreground" />
              {cargo.name}
            </span>
            <span className="num inline-flex items-center gap-1.5">
              <Weight className="size-3.5" />
              {formatNumber(cargo.weight, ' т')}
            </span>
            <span className="num inline-flex items-center gap-1.5">
              {formatNumber(cargo.volume, ' м³')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="size-3.5" />
              {cargo.body_type}
            </span>
            {cargo.temp_from || cargo.temp_to ? (
              <span className="num inline-flex items-center gap-1.5">
                <Snowflake className="size-3.5" />
                {cargo.temp_from}…{cargo.temp_to} °C
              </span>
            ) : null}
            <span className="truncate">{organizer.organization_name}</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 border-t pt-3 lg:min-w-56 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <PriceMeter
            current={trading.price?.current ?? null}
            currentNoVat={trading.price?.current_no_vat ?? null}
            vatMode={vatMode}
            pricePerKm={main.price_per_km}
            measurement={trading.bid_measurement_type}
          />
          <div className="relative z-10 flex flex-col items-end gap-2">
            <TradingCountdown stopTime={trading.stop_time} />
            {action}
          </div>
        </div>
      </div>

      <TradingWindowBar startTime={trading.start_time} stopTime={trading.stop_time} />
    </article>
  )
}
