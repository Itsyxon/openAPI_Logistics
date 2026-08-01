import { useQuery } from '@tanstack/react-query'
import { Lock, Users } from 'lucide-react'
import { Skeleton } from '@/shared/ui/skeleton'
import { plural } from '@/shared/lib/format'
import { CURRENT_SESSION } from '@/shared/config/session'
import { StatePanel } from '@/shared/ui/state-panel'
import {
  BetRow,
  betsQueryOptions,
  countParticipants,
  isOwnBet,
  sortForDisplay,
} from '@/entities/bet'
import { ShowCancelledToggle, VatModeSwitch, useBetsViewStore } from '@/features/bets-view'
import { ErrorState } from '@/shared/ui/error-state'

interface Props {
  auctionUuid: string
  hideBetsHistory: boolean
  hidePlaces: boolean
}

export function BetsPanel({ auctionUuid, hideBetsHistory, hidePlaces }: Props) {
  const vatMode = useBetsViewStore((state) => state.vatMode)
  const showCancelled = useBetsViewStore((state) => state.showCancelled)

  const query = useQuery({
    ...betsQueryOptions(auctionUuid, showCancelled),
    enabled: !hideBetsHistory,
  })

  if (hideBetsHistory) {
    return (
      <StatePanel
        icon={Lock}
        title="История ставок скрыта"
        description="Организатор закрыл историю торгов по этой заявке. Своя ставка видна в параметрах торгов."
      />
    )
  }

  if (query.isPending) return <BetsSkeleton />
  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} />
  }

  const bets = query.data?.bets ?? []
  const participants = countParticipants(bets)

  if (bets.length === 0) {
    return (
      <div className="space-y-3">
        <BetsToolbar participants={0} />
        <StatePanel
          icon={Users}
          title="Ставок пока нет"
          description="Никто ещё не торговался по этой заявке. Сделайте первую ставку и займите первое место."
        />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <BetsToolbar participants={participants} />

      <ol className="space-y-2">
        {sortForDisplay(bets).map((bet) => (
          <BetRow
            key={bet.id}
            bet={bet}
            vatMode={vatMode}
            showPlace={!hidePlaces}
            isOwn={isOwnBet(bet, CURRENT_SESSION.subscriberId)}
          />
        ))}
      </ol>

      {hidePlaces ? (
        <p className="text-xs text-muted-foreground">
          Организатор скрыл места участников — показан только порядок ставок.
        </p>
      ) : null}
    </div>
  )
}

function BetsToolbar({ participants }: { participants: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="inline-flex items-center gap-2 text-sm">
        <Users className="size-4 text-muted-foreground" />
        <span className="num font-semibold">{participants}</span>
        <span className="text-muted-foreground">
          {plural(participants, 'участник', 'участника', 'участников')}
        </span>
      </p>

      <div className="flex items-center gap-2">
        <ShowCancelledToggle />
        <VatModeSwitch />
      </div>
    </div>
  )
}

function BetsSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-7 w-40" />
      </div>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-md border px-3 py-2.5">
          <Skeleton className="size-8 rounded-sm" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <div className="space-y-1.5 text-right">
            <Skeleton className="ml-auto h-4 w-24" />
            <Skeleton className="ml-auto h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
