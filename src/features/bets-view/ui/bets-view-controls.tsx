import { EyeOff } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useBetsViewStore, type VatMode } from '../model/bets-view-store'

const MODES: { value: VatMode; label: string }[] = [
  { value: 'with', label: 'с НДС' },
  { value: 'without', label: 'без НДС' },
]

export function VatModeSwitch({ className }: { className?: string }) {
  const vatMode = useBetsViewStore((state) => state.vatMode)
  const setVatMode = useBetsViewStore((state) => state.setVatMode)

  return (
    <div
      role="group"
      aria-label="Показывать цены"
      className={cn('inline-flex rounded-md border p-0.5', className)}
    >
      {MODES.map((mode) => (
        <button
          key={mode.value}
          type="button"
          onClick={() => setVatMode(mode.value)}
          aria-pressed={vatMode === mode.value}
          className={cn(
            'rounded-sm px-2 py-0.5 text-xs transition-colors',
            vatMode === mode.value
              ? 'bg-primary/15 font-medium text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}

export function ShowCancelledToggle({ className }: { className?: string }) {
  const showCancelled = useBetsViewStore((state) => state.showCancelled)
  const toggleCancelled = useBetsViewStore((state) => state.toggleCancelled)

  return (
    <button
      type="button"
      onClick={toggleCancelled}
      aria-pressed={showCancelled}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors',
        showCancelled
          ? 'border-primary/45 bg-primary/10 text-foreground'
          : 'text-muted-foreground hover:text-foreground',
        className,
      )}
    >
      <EyeOff className="size-3.5" />
      Отменённые
    </button>
  )
}
