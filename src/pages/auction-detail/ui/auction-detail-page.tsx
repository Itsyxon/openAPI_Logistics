import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { auctionQueryOptions, resolvePrimaryAction } from '@/entities/auction'
import { AuctionDetail } from '@/widgets/auction-detail'
import { ErrorState } from '@/shared/ui/error-state'
import { AuctionPrimaryAction } from '@/features/auction-actions'
import { BetsPanel } from '@/widgets/bets-panel'
import type { DetailTab } from '../model/detail-search'

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid' })
  const { tab } = useSearch({ from: '/auctions/$auctionUuid' })
  const navigate = useNavigate({ from: '/auctions/$auctionUuid' })

  const query = useQuery(auctionQueryOptions(auctionUuid))
  const activeTab: DetailTab = tab ?? 'info'

  return (
    <div className='space-y-4'>
      <Button asChild variant='ghost' size='sm' className='-ml-2 gap-2'>
        <Link to='/auctions'>
          <ArrowLeft className='size-4' />К списку аукционов
        </Link>
      </Button>

      {query.isPending ? <DetailSkeleton /> : null}

      {query.isError ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : null}

      {query.data ? (
        <Tabs
          value={activeTab}
          onValueChange={(next) =>
            void navigate({
              search: {
                tab: next === 'info' ? undefined : (next as DetailTab),
              },
              replace: true,
            })
          }
        >
          <TabsList>
            <TabsTrigger value='info'>Заявка</TabsTrigger>
            <TabsTrigger value='bets'>Ставки</TabsTrigger>
          </TabsList>

          <TabsContent value='info' className='mt-4'>
            <AuctionDetail
              auction={query.data}
              action={
                <AuctionPrimaryAction
                  size='default'
                  auctionUuid={auctionUuid}
                  action={resolvePrimaryAction({
                    canSetBet: query.data.trading.can_set_bet,
                    hasBet: query.data.trading.your.bet,
                    hideBetsHistory: query.data.trading.hide_bets_history,
                    status: query.data.trading.status,
                  })}
                />
              }
            />
          </TabsContent>

          <TabsContent value='bets' className='mt-4'>
            <BetsPanel
              auctionUuid={auctionUuid}
              hideBetsHistory={query.data.trading.hide_bets_history}
              hidePlaces={query.data.trading.hide_places}
            />
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className='space-y-4' aria-busy='true'>
      <div className='rounded-md border bg-card px-5 py-5'>
        <Skeleton className='h-3 w-24' />
        <Skeleton className='mt-3 h-8 w-56' />
        <Skeleton className='mt-2 h-3 w-40' />
      </div>
      <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]'>
        <div className='space-y-4'>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className='rounded-md border bg-card'>
              <div className='border-b px-4 py-2.5'>
                <Skeleton className='h-3 w-28' />
              </div>
              <div className='space-y-2 px-4 py-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-2/3' />
              </div>
            </div>
          ))}
        </div>
        <div className='rounded-md border bg-card'>
          <div className='border-b px-4 py-2.5'>
            <Skeleton className='h-3 w-32' />
          </div>
          <div className='space-y-3 px-4 py-4'>
            <Skeleton className='h-10 w-40' />
            <Skeleton className='h-1.5 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
          </div>
        </div>
      </div>
    </div>
  )
}
