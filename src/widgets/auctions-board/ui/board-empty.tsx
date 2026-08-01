import { PackageSearch } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { StatePanel } from '@/shared/ui/state-panel'

interface Props {
  hasFilters: boolean
  onReset: () => void
}

export function BoardEmpty({ hasFilters, onReset }: Props) {
  return (
    <StatePanel
      icon={PackageSearch}
      title="Ни одного аукциона"
      description={
        hasFilters
          ? 'По выбранным фильтрам ничего не нашлось. Снимите часть условий и попробуйте снова.'
          : 'Здесь появятся заявки, как только организаторы откроют торги.'
      }
      action={
        hasFilters ? (
          <Button variant="outline" onClick={onReset}>
            Сбросить фильтры
          </Button>
        ) : null
      }
    />
  )
}
