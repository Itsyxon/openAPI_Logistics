import { cn } from '@/shared/lib/utils'
import { formatDateTime } from '@/shared/lib/format'

interface Props {
  loadCity: string
  loadDate: string
  loadAddress?: string
  unloadCity: string
  unloadDate: string
  unloadAddress?: string
  distance?: number | null
  className?: string
}

export function RouteRail({
  loadCity,
  loadDate,
  loadAddress,
  unloadCity,
  unloadDate,
  unloadAddress,
  distance,
  className,
}: Props) {
  return (
    <div className={cn('flex items-stretch gap-3', className)}>
      <div className='flex flex-col items-center pt-1.5'>
        <span className='size-2 rounded-full border-2 border-primary bg-background' />
        <span className='my-1 w-px flex-1 bg-[repeating-linear-gradient(to_bottom,var(--rail)_0_3px,transparent_3px_7px)]' />
        <span className='size-2 rounded-full bg-rail' />
      </div>

      <div className='grid flex-1 gap-2 sm:grid-cols-2 sm:gap-6'>
        <RoutePoint city={loadCity} date={loadDate} address={loadAddress} />
        <div className='hidden sm:block sm:relative'>
          {distance ? (
            <span className='absolute -top-3 left-0 num text-[0.68rem] text-muted-foreground'>
              {distance} км
            </span>
          ) : null}
          <RoutePoint
            city={unloadCity}
            date={unloadDate}
            address={unloadAddress}
          />
        </div>
        <div className='sm:hidden'>
          <RoutePoint
            city={unloadCity}
            date={unloadDate}
            address={unloadAddress}
          />
        </div>
      </div>
    </div>
  )
}

function RoutePoint({
  city,
  date,
  address,
}: {
  city: string
  date: string
  address?: string
}) {
  return (
    <div className='min-w-0'>
      <p className='truncate font-display text-lg font-semibold leading-tight'>
        {city}
      </p>
      <p className='num text-[0.7rem] text-muted-foreground'>
        {formatDateTime(date)}
      </p>
      {address ? (
        <p className='truncate text-xs text-muted-foreground'>{address}</p>
      ) : null}
    </div>
  )
}
