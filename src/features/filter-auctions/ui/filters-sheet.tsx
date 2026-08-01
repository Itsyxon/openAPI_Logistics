import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet'
import { AUCTION_TYPES, TRADING_STATUSES } from '@/shared/api/types/enums'
import {
  AUCTION_STATUS_LABEL,
  AUCTION_TYPE_LABEL,
  TRADING_STATUS_LABEL,
} from '@/entities/auction'
import type { AuctionsSearch, NormalizedSearch } from '../model/search-schema'
import { CheckGroup } from './check-group'
import { CitySelect, DateField, FieldGroup, MoneyField } from './filter-fields'

const AUCTION_STATUS_OPTIONS = [
  { value: 1, label: AUCTION_STATUS_LABEL.Planning },
  { value: 2, label: AUCTION_STATUS_LABEL.Auction },
  { value: 3, label: AUCTION_STATUS_LABEL.DeterminateWinner },
  { value: 4, label: AUCTION_STATUS_LABEL.WaitDeal },
  { value: 5, label: AUCTION_STATUS_LABEL.InProgress },
  { value: 6, label: AUCTION_STATUS_LABEL.Finished },
  { value: 7, label: AUCTION_STATUS_LABEL.Stopped },
  { value: 8, label: AUCTION_STATUS_LABEL.Canceled },
]

const TRADING_STATUS_OPTIONS = TRADING_STATUSES.filter((item) => item !== 'Unknown').map(
  (value) => ({ value, label: TRADING_STATUS_LABEL[value] }),
)

const AUCTION_TYPE_OPTIONS = AUCTION_TYPES.filter((item) => item !== 'Unknown').map((value) => ({
  value,
  label: AUCTION_TYPE_LABEL[value],
}))

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: NormalizedSearch
  activeCount: number
  onChange: (patch: Partial<AuctionsSearch>) => void
  onReset: () => void
}

export function FiltersSheet({
  open,
  onOpenChange,
  value,
  activeCount,
  onChange,
  onReset,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="size-4" />
          Фильтры
          {activeCount > 0 ? (
            <span className="num rounded-sm bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Фильтры</SheetTitle>
          <SheetDescription>Параметры сохраняются в адресе страницы</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
          <CheckGroup
            legend="Тип аукциона"
            options={AUCTION_TYPE_OPTIONS}
            selected={value.auc_type}
            onToggle={(auc_type) => onChange({ auc_type })}
            columns={2}
          />

          <CheckGroup
            legend="Статус аукциона"
            options={AUCTION_STATUS_OPTIONS}
            selected={value.statuses}
            onToggle={(statuses) => onChange({ statuses })}
          />

          <CheckGroup
            legend="Мой торговый статус"
            options={TRADING_STATUS_OPTIONS}
            selected={value.status}
            onToggle={(status) => onChange({ status })}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <CitySelect
              label="Город погрузки"
              value={value.load_city}
              onChange={(load_city) => onChange({ load_city })}
            />
            <CitySelect
              label="Город выгрузки"
              value={value.unload_city}
              onChange={(unload_city) => onChange({ unload_city })}
            />
          </div>

          <FieldGroup legend="Дата погрузки">
            <DateField
              label="от"
              value={value.load_date_from}
              onChange={(load_date_from) => onChange({ load_date_from })}
            />
            <DateField
              label="до"
              value={value.load_date_to}
              onChange={(load_date_to) => onChange({ load_date_to })}
            />
          </FieldGroup>

          <FieldGroup legend="Текущая цена, ₽">
            <MoneyField
              label="от"
              value={value.price_from}
              onChange={(price_from) => onChange({ price_from })}
            />
            <MoneyField
              label="до"
              value={value.price_to}
              onChange={(price_to) => onChange({ price_to })}
            />
          </FieldGroup>
        </div>

        <SheetFooter className="flex-row gap-2 border-t">
          <Button variant="ghost" onClick={onReset} className="flex-1">
            Сбросить всё
          </Button>
          <SheetClose asChild>
            <Button className="flex-1">Показать</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
