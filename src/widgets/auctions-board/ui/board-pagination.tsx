import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'
import type { AuctionListMeta } from '@/shared/api/types/auction-list'

interface Props {
  meta: AuctionListMeta
  onPageChange: (page: number) => void
}

export function BoardPagination({ meta, onPageChange }: Props) {
  if (meta.last_page <= 1) return null

  const pages = pageWindow(meta.current_page, meta.last_page)

  return (
    <nav className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-between">
      <p className="num text-xs text-muted-foreground">
        {meta.from}–{meta.to} из {meta.total}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          disabled={meta.current_page <= 1}
          onClick={() => onPageChange(meta.current_page - 1)}
          aria-label="Предыдущая страница"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {pages.map((page, index) =>
          page === null ? (
            <span key={`gap-${index}`} className="px-1 text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === meta.current_page ? 'page' : undefined}
              className={cn(
                'num size-9 rounded-md border text-sm transition-colors',
                page === meta.current_page
                  ? 'border-primary bg-primary/12 font-semibold text-foreground'
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
              )}
            >
              {page}
            </button>
          ),
        )}

        <Button
          variant="ghost"
          size="icon"
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onPageChange(meta.current_page + 1)}
          aria-label="Следующая страница"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  )
}

function pageWindow(current: number, last: number): (number | null)[] {
  if (last <= 7) return Array.from({ length: last }, (_, index) => index + 1)

  const pages = new Set([1, last, current, current - 1, current + 1])
  const sorted = [...pages].filter((page) => page >= 1 && page <= last).sort((a, b) => a - b)

  const result: (number | null)[] = []
  let previous = 0
  for (const page of sorted) {
    if (previous && page - previous > 1) result.push(null)
    result.push(page)
    previous = page
  }
  return result
}
