import { formatNumber } from '@/shared/lib/format'
import type { AuctionShowCargo } from '@/shared/api/types/auction-show'
import { DataRow, DetailSection } from './detail-section'
import {
  formatDocs,
  formatLoadingTypes,
  formatTemperature,
  yesNo,
} from '../lib/requirements'

interface Props {
  cargo: AuctionShowCargo
  hidePrice: boolean
}

export function CargoSection({ cargo, hidePrice }: Props) {
  return (
    <DetailSection title="Груз и требования к ТС">
      <div className="grid gap-x-8 sm:grid-cols-2">
        <dl>
          <DataRow label="Тип кузова" value={cargo.body_type} />
          <DataRow label="Количество машин" value={cargo.truck_count} mono />
          <DataRow
            label="Расстояние"
            value={cargo.distance ? `${cargo.distance} км` : '—'}
            mono
          />
          <DataRow
            label="Стоимость груза"
            value={hidePrice ? 'скрыта' : `${cargo.price} ₽`}
            mono
          />
          <DataRow
            label="Температура"
            value={formatTemperature(cargo.temp_from, cargo.temp_to)}
            mono
          />
          <DataRow label="Международная" value={yesNo(cargo.is_international)} />
        </dl>

        <dl>
          <DataRow label="Тип ТС" value={cargo.car.type} />
          <DataRow label="Грузоподъёмность" value={formatNumber(cargo.car.weight, ' т')} mono />
          <DataRow label="Объём" value={formatNumber(cargo.car.volume, ' м³')} mono />
          <DataRow
            label="Габариты"
            value={`${formatNumber(cargo.car.length)} × ${formatNumber(cargo.car.width)} × ${formatNumber(cargo.car.height)} м`}
            mono
          />
          <DataRow label="Загрузка" value={formatLoadingTypes(cargo.loading_types)} />
          <DataRow label="Документы" value={formatDocs(cargo.docs)} />
        </dl>
      </div>
    </DetailSection>
  )
}
