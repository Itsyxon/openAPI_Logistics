import { useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { auctionsQueryOptions } from '@/entities/auction'
import {
  AuctionFilters,
  EMPTY_SEARCH,
  countActiveFilters,
  normalizeSearch,
  searchToListRequest,
  type AuctionsSearch,
} from '@/features/filter-auctions'
import { VatModeSwitch } from '@/features/bets-view'
import { AuctionsBoard } from '@/widgets/auctions-board'

export function AuctionsPage() {
  const rawSearch = useSearch({ from: '/auctions' })
  const navigate = useNavigate({ from: '/auctions' })

  const search = normalizeSearch(rawSearch)
  const query = useQuery(auctionsQueryOptions(searchToListRequest(search)))

  const patch = (next: Partial<AuctionsSearch>) => {
    void navigate({
      search: (prev) => ({ ...prev, ...next, page: next.page }),
      replace: true,
    })
  }

  const reset = () => {
    void navigate({ search: () => ({ ...EMPTY_SEARCH }), replace: true })
  }

  const total = query.data?.meta.total

  return (
    <div className='space-y-5'>
      <header className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <p className='eyebrow'>Торговая площадка</p>
          <h1 className='font-display text-3xl font-bold leading-none tracking-tight'>
            Аукционы на перевозку
          </h1>
        </div>
        <div className='flex items-center gap-3'>
          {total !== undefined ? (
            <p className='num text-sm text-muted-foreground'>{total} в выборке</p>
          ) : null}
          <VatModeSwitch />
        </div>
      </header>

      <AuctionFilters value={search} onChange={patch} onReset={reset} />

      <AuctionsBoard
        query={query}
        perPage={search.per_page}
        hasFilters={countActiveFilters(search) > 0}
        onResetFilters={reset}
        onPageChange={(page) => patch({ page })}
      />
    </div>
  )
}
