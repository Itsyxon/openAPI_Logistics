import { Checkbox } from '@/shared/ui/checkbox'
import { Label } from '@/shared/ui/label'

interface Option<T> {
  value: T
  label: string
}

interface Props<T extends string | number> {
  legend: string
  options: Option<T>[]
  selected: T[]
  onToggle: (value: T[]) => void
  columns?: 1 | 2
}

export function CheckGroup<T extends string | number>({
  legend,
  options,
  selected,
  onToggle,
  columns = 1,
}: Props<T>) {
  return (
    <fieldset className="space-y-2">
      <legend className="eyebrow mb-2">{legend}</legend>
      <div className={columns === 2 ? 'grid grid-cols-2 gap-x-3 gap-y-2' : 'space-y-2'}>
        {options.map((option) => {
          const id = `${legend}-${option.value}`
          const checked = selected.includes(option.value)

          return (
            <div key={String(option.value)} className="flex items-center gap-2">
              <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={() =>
                  onToggle(
                    checked
                      ? selected.filter((item) => item !== option.value)
                      : [...selected, option.value],
                  )
                }
              />
              <Label htmlFor={id} className="cursor-pointer text-sm font-normal">
                {option.label}
              </Label>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
