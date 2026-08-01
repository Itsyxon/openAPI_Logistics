import { cn } from '@/shared/lib/utils'
import { formatMoney, formatMoneyPrecise } from '@/shared/lib/format'
import type { AuctionShowTrading } from '@/shared/api/types/auction-show'
import { BID_MEASUREMENT_LABEL, TradingStatusChip } from '@/entities/auction'
import { DataRow } from './detail-section'

interface Props {
  trading: AuctionShowTrading
}

export function TradingPanel({ trading }: Props) {
  const { price, your } = trading
  const hidden = trading.no_view_cargo_price

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Текущая цена</p>
          <p className="num mt-1 text-4xl font-semibold leading-none tracking-tight">
            {hidden ? '—' : formatMoney(price.current)}
            {hidden ? null : (
              <span className="ml-1.5 text-lg font-normal text-muted-foreground">₽</span>
            )}
          </p>
          {!hidden && price.current_no_vat !== null ? (
            <p className="num mt-1 text-xs text-muted-foreground">
              {formatMoneyPrecise(price.current_no_vat)} ₽ без НДС
            </p>
          ) : null}
        </div>

        <div className="text-right">
          <p className="eyebrow">Доступная цена</p>
          <p className="num mt-1 text-2xl font-semibold leading-none text-primary">
            {hidden ? '—' : formatMoney(price.available)}
          </p>
          {price.price_per_km ? (
            <p className="num mt-1 text-xs text-muted-foreground">
              {formatMoneyPrecise(price.price_per_km)} ₽/км
            </p>
          ) : null}
        </div>
      </div>

      {!hidden ? <PriceScale min={price.min} max={price.max} current={price.current} /> : null}

      <dl>
        <DataRow label="Минимум" value={hidden ? '—' : `${formatMoney(price.min)} ₽`} mono />
        <DataRow label="Максимум" value={hidden ? '—' : `${formatMoney(price.max)} ₽`} mono />
        <DataRow label="Шаг ставки" value={hidden ? '—' : `${formatMoney(price.step)} ₽`} mono />
        <DataRow
          label="Единица измерения"
          value={BID_MEASUREMENT_LABEL[trading.bid_measurement_type] || '—'}
        />
        <DataRow
          label="Встречные ставки"
          value={trading.allow_counter_bets ? 'Разрешены' : 'Запрещены'}
        />
        {trading.settings.prolong_after_bet ? (
          <DataRow
            label="Продление после ставки"
            value={`${trading.settings.prolong_after_bet} мин`}
            mono
          />
        ) : null}
      </dl>

      <div className="rounded-md border border-dashed p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">Моя ставка</p>
          <TradingStatusChip status={trading.status_mobile} />
        </div>
        {your.bet ? (
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="num text-xl font-semibold">
              {formatMoney(your.last_bet_with_vat)} ₽
            </span>
            {your.last_bet !== null ? (
              <span className="num text-xs text-muted-foreground">
                {formatMoneyPrecise(your.last_bet)} ₽ без НДС
              </span>
            ) : null}
            {your.win ? (
              <span className="font-display text-xs font-semibold uppercase tracking-[0.1em] text-winner">
                лучшая ставка
              </span>
            ) : null}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Вы ещё не делали ставку</p>
        )}
      </div>
    </div>
  )
}

function PriceScale({
  min,
  max,
  current,
}: {
  min: number | null
  max: number | null
  current: number | null
}) {
  if (min === null || max === null || current === null || max <= min) return null

  const position = Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100))

  return (
    <div>
      <div className="relative h-1.5 rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary/35"
          style={{ width: `${position}%` }}
        />
        <span
          className={cn(
            'absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full',
            'border-2 border-primary bg-background',
          )}
          style={{ left: `${position}%` }}
        />
      </div>
      <div className="num mt-1.5 flex justify-between text-[0.7rem] text-muted-foreground">
        <span>{formatMoney(min)}</span>
        <span>{formatMoney(max)}</span>
      </div>
    </div>
  )
}
