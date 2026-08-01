import { cn } from '@/shared/lib/utils'
import { formatMoney, formatNumber } from '@/shared/lib/format'
import type { BidMeasurementType } from '@/shared/api/types/enums'
import { BID_MEASUREMENT_LABEL } from '../model/labels'

interface Props {
  current: number | null
  currentNoVat?: number | null
  vatMode?: 'with' | 'without'
  pricePerKm?: number | null
  step?: number | null
  measurement?: BidMeasurementType | null
  hidden?: boolean
  align?: 'left' | 'right'
  className?: string
}

export function PriceMeter({
  current,
  currentNoVat,
  vatMode = 'with',
  pricePerKm,
  step,
  measurement,
  hidden = false,
  align = 'right',
  className,
}: Props) {
  const withoutVat = vatMode === 'without' && currentNoVat !== undefined
  const shown = withoutVat ? currentNoVat : current
  if (hidden) {
    return (
      <div className={cn(align === 'right' && 'text-right', className)}>
        <p className='eyebrow'>Цена</p>
        <p className='mt-0.5 text-sm text-muted-foreground'>
          скрыта организатором
        </p>
      </div>
    )
  }

  return (
    <div className={cn(align === 'right' && 'text-right', className)}>
      <p className='eyebrow'>
        Текущая цена{withoutVat ? ' без НДС' : ''}
      </p>
      <p className='num mt-0.5 text-2xl font-semibold leading-none tracking-tight'>
        {formatMoney(shown)}
        <span className='ml-1 text-sm font-normal text-muted-foreground'>
          ₽
        </span>
      </p>
      <div
        className={cn(
          'mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[0.7rem] text-muted-foreground',
          align === 'right' && 'justify-end',
        )}
      >
        {pricePerKm ? (
          <span className='num'>{formatNumber(pricePerKm, ' ₽/км')}</span>
        ) : null}
        {step ? <span className='num'>шаг {formatMoney(step)} ₽</span> : null}
        {measurement && measurement !== 'Unknown' ? (
          <span>{BID_MEASUREMENT_LABEL[measurement]}</span>
        ) : null}
      </div>
    </div>
  )
}
