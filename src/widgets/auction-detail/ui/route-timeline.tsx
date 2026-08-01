import { MapPin, PackageOpen, Phone } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { formatDateTime } from '@/shared/lib/format'
import type { RoutePoint } from '@/shared/api/types/auction-show'
import { OPERATION_TYPE_LABEL } from '@/entities/auction'
import { EmptyNote } from './detail-section'

interface Props {
  points: RoutePoint[]
  hideAddressAndContacts: boolean
}

export function RouteTimeline({ points, hideAddressAndContacts }: Props) {
  if (points.length === 0) return <EmptyNote>Точки маршрута не указаны</EmptyNote>

  return (
    <ol className="space-y-0">
      {points.map((point, index) => {
        const last = index === points.length - 1
        const loading = point.op_type === 'Loading'

        return (
          <li key={`${point.row_num}-${index}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border-2 bg-background',
                  loading ? 'border-primary text-primary' : 'border-rail text-muted-foreground',
                )}
              >
                {loading ? (
                  <PackageOpen className="size-3" />
                ) : (
                  <MapPin className="size-3" />
                )}
              </span>
              {!last ? (
                <span className="my-1 w-px flex-1 bg-[repeating-linear-gradient(to_bottom,var(--rail)_0_3px,transparent_3px_7px)]" />
              ) : null}
            </div>

            <div className={cn('min-w-0 flex-1', last ? 'pb-0' : 'pb-6')}>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="eyebrow">{OPERATION_TYPE_LABEL[point.op_type]}</span>
                <span className="num text-[0.7rem] text-muted-foreground">
                  {formatDateTime(point.start_date)} — {formatDateTime(point.end_date)}
                </span>
              </div>

              <p className="mt-0.5 font-display text-lg font-semibold leading-tight">
                {point.location.city_full_name || point.location.city_name}
              </p>

              {hideAddressAndContacts ? (
                <p className="mt-1 text-xs italic text-muted-foreground">
                  Адрес и контакты скрыты организатором
                </p>
              ) : (
                <>
                  {point.location.loading_address ? (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {point.location.loading_address}
                    </p>
                  ) : null}
                  {point.contact.name || point.contact.phone ? (
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="size-3" />
                      {point.contact.name}
                      {point.contact.phone ? (
                        <span className="num">{point.contact.phone}</span>
                      ) : null}
                    </p>
                  ) : null}
                </>
              )}

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>{point.cargo.name}</span>
                <span className="num">{point.cargo.weight} т</span>
                <span className="num">{point.cargo.volume} м³</span>
                {point.cargo.package_amount ? (
                  <span className="num">
                    {point.cargo.package_amount} × {point.cargo.package_name}
                  </span>
                ) : null}
                {point.cargo.oversized ? <span className="text-up">негабарит</span> : null}
              </div>

              {point.comment ? (
                <p className="mt-2 border-l-2 border-border pl-3 text-xs text-muted-foreground">
                  {point.comment}
                </p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
