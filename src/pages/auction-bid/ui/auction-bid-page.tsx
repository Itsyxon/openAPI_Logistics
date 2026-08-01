import { useNavigate, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/shared/ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { formatMoney } from '@/shared/lib/format'
import {
  AuctionStatusChip,
  AuctionTypeMark,
  RouteRail,
  TradingCountdown,
  auctionQueryOptions,
} from '@/entities/auction'
import { PlaceBetForm } from '@/features/place-bet'
import { ErrorState } from '@/shared/ui/error-state'

export function AuctionBidPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid/bid' })
  const navigate = useNavigate()
  const query = useQuery(auctionQueryOptions(auctionUuid))

  const close = () => {
    void navigate({ to: '/auctions/$auctionUuid', params: { auctionUuid } })
  }

  const auction = query.data
  const load = auction?.routes.find((point) => point.op_type === 'Loading') ?? auction?.routes[0]
  const unload =
    auction?.routes.find((point) => point.op_type === 'Unloading') ?? auction?.routes.at(-1)

  return (
    <Dialog open onOpenChange={(next) => (next ? undefined : close())}>
      <DialogContent className="max-h-[92svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {auction ? `Ставка по заявке № ${auction.main.cargo_num}` : 'Ставка'}
          </DialogTitle>
          <DialogDescription>
            {auction
              ? 'Проверьте условия и укажите цену. Ставка сразу уйдёт организатору.'
              : 'Загружаем условия торгов'}
          </DialogDescription>
        </DialogHeader>

        {query.isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : null}

        {query.isError ? (
          <ErrorState error={query.error} onRetry={() => void query.refetch()} />
        ) : null}

        {auction && load && unload ? (
          <div className="space-y-5">
            <div className="rounded-md border bg-muted/40 p-3">
              <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <AuctionTypeMark type={auction.main.auc_type} />
                <AuctionStatusChip status={auction.trading.status} />
                <TradingCountdown stopTime={auction.trading.stop_time} className="ml-auto" />
              </div>

              <RouteRail
                loadCity={load.location.city_name}
                loadDate={load.start_date}
                unloadCity={unload.location.city_name}
                unloadDate={unload.start_date}
              />

              <div className="mt-3 flex items-baseline justify-between border-t pt-3">
                <span className="eyebrow">Текущая цена</span>
                <span className="num text-lg font-semibold">
                  {formatMoney(auction.trading.price.current)} ₽
                </span>
              </div>
            </div>

            <PlaceBetForm auction={auction} onDone={close} />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
