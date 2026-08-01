import { Link, useRouter } from '@tanstack/react-router'
import { useQueryClient, type UseQueryResult } from '@tanstack/react-query'
import type { AuctionListResponseBase } from '@/shared/api/types/auction-list'
import {
  AuctionStrip,
  auctionQueryOptions,
  resolvePrimaryAction,
} from '@/entities/auction'
import { ErrorState } from '@/shared/ui/error-state'
import { useBetsViewStore } from '@/features/bets-view'
import { AuctionPrimaryAction } from '@/features/auction-actions'
import { BoardEmpty } from './board-empty'
import { BoardPagination } from './board-pagination'
import { BoardSkeleton } from './board-skeleton'

interface Props {
  query: UseQueryResult<AuctionListResponseBase>
  hasFilters: boolean
  perPage: number
  onResetFilters: () => void
  onPageChange: (page: number) => void
}

export function AuctionsBoard({
  query,
  hasFilters,
  perPage,
  onResetFilters,
  onPageChange,
}: Props) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const vatMode = useBetsViewStore((state) => state.vatMode)

  const { data } = query

  if (query.isPending) return <BoardSkeleton rows={Math.min(perPage, 5)} />
  if (query.isError) {
    return (
      <ErrorState
        error={query.error}
        title="Список не загрузился"
        onRetry={() => void query.refetch()}
      />
    )
  }
  if (!data || data.data.length === 0) {
    return <BoardEmpty hasFilters={hasFilters} onReset={onResetFilters} />
  }

  const prefetch = (auctionUuid: string) => {
    void queryClient.prefetchQuery(auctionQueryOptions(auctionUuid))
    void router.preloadRoute({
      to: '/auctions/$auctionUuid',
      params: { auctionUuid },
    })
  }

  return (
    <div className="space-y-3">
      <ol className="space-y-3">
        {data.data.map((auction, index) => {
          const uuid = auction.main.order_uid
          const action = resolvePrimaryAction({
            canSetBet: auction.trading.can_set_bet,
            hasBet: auction.trading.your?.bet ?? false,
            hideBetsHistory: false,
            status: auction.trading.status,
          })

          return (
            <li
              key={uuid}
              className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1"
              style={{
                animationDuration: '260ms',
                animationDelay: `${Math.min(index, 6) * 35}ms`,
                animationFillMode: 'both',
              }}
            >
              <AuctionStrip
                auction={auction}
                vatMode={vatMode}
                onIntent={() => prefetch(uuid)}
                action={<AuctionPrimaryAction action={action} auctionUuid={uuid} />}
                overlayLink={
                  <Link
                    to="/auctions/$auctionUuid"
                    params={{ auctionUuid: uuid }}
                    aria-label={`Открыть заявку № ${auction.main.cargo_num}`}
                    className="absolute inset-0 z-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  />
                }
              />
            </li>
          )
        })}
      </ol>

      <BoardPagination meta={data.meta} onPageChange={onPageChange} />
    </div>
  )
}
