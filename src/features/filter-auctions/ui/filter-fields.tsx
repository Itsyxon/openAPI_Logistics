import type { ReactNode } from 'react'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { cn } from '@/shared/lib/utils'
import { MOCK_CITIES } from '@/shared/config/cities'

const ANY = '__any__'

export function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'h-9 cursor-pointer whitespace-nowrap rounded-md border px-3 text-sm transition-colors',
        active
          ? 'border-primary bg-primary/12 text-foreground'
          : 'border-border text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

export function CitySelect({
  label,
  value,
  onChange,
}: {
  label: string
  value: string | undefined
  onChange: (value: string | undefined) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="eyebrow">{label}</Label>
      <Select
        value={value ?? ANY}
        onValueChange={(next) => onChange(next === ANY ? undefined : next)}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Любой</SelectItem>
          {MOCK_CITIES.map((city) => (
            <SelectItem key={city.gc_id} value={city.name}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function DateField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string | undefined
  onChange: (value: string | undefined) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type="date"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value || undefined)}
        className="num"
      />
    </div>
  )
}

export function MoneyField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number | undefined
  onChange: (value: number | undefined) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type="number"
        min={0}
        inputMode="numeric"
        value={value ?? ''}
        onChange={(event) =>
          onChange(event.target.value === '' ? undefined : Number(event.target.value))
        }
        className="num"
      />
    </div>
  )
}

export function FieldGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="eyebrow">{legend}</p>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  )
}
