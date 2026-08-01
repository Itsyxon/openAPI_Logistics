import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import type { AuctionsSearch, NormalizedSearch } from '../model/search-schema'
import { countActiveFilters } from '../model/to-request'
import { ToggleChip } from './filter-fields'
import { FiltersSheet } from './filters-sheet'

interface Props {
  value: NormalizedSearch
  onChange: (patch: Partial<AuctionsSearch>) => void
  onReset: () => void
}

export function AuctionFilters({ value, onChange, onReset }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const activeCount = countActiveFilters(value)

  const toggleFlag = (key: 'is_available' | 'is_bidder') => {
    onChange({ [key]: value[key] === true ? undefined : true })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value.cargo_num ?? ''}
            onChange={(event) => onChange({ cargo_num: event.target.value || undefined })}
            placeholder="Номер заявки"
            className="num pl-9"
            inputMode="numeric"
          />
        </div>

        <div className="flex items-center gap-2">
          <ToggleChip
            active={value.is_available === true}
            onClick={() => toggleFlag('is_available')}
          >
            Доступные
          </ToggleChip>
          <ToggleChip active={value.is_bidder === true} onClick={() => toggleFlag('is_bidder')}>
            Мои ставки
          </ToggleChip>

          <FiltersSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            value={value}
            activeCount={activeCount}
            onChange={onChange}
            onReset={onReset}
          />
        </div>
      </div>

      {activeCount > 0 ? (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3.5" />
          Сбросить фильтры ({activeCount})
        </button>
      ) : null}
    </div>
  )
}
