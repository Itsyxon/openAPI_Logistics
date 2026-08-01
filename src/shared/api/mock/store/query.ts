import type {
  AuctionListItem,
  AuctionListRequest,
  AuctionListResponseBase,
} from '@/shared/api/types/auction-list'
import { AUCTION_STATUS_CODE, TRADING_STATUS_CODE } from '@/shared/api/types/enums'
import { DEFAULT_PER_PAGE } from '@/shared/config/api'
import type { AuctionRecord } from '../record'
import { toListItem } from './projection'

function matchesFilters(record: AuctionRecord, filters: AuctionListRequest) {
  const item = toListItem(record)
  const { main, trading, route, cargo } = item

  if (filters.cargo_num && !main.cargo_num.includes(filters.cargo_num.trim())) return false
  if (filters.auc_type?.length && !filters.auc_type.includes(main.auc_type)) return false
  if (filters.status?.length && !filters.status.includes(trading.status_mobile)) return false

  if (filters.statuses?.length) {
    const code = AUCTION_STATUS_CODE[trading.status]
    if (!filters.statuses.includes(code)) return false
  }

  if (filters.mobile_statuses?.length) {
    const code = TRADING_STATUS_CODE[trading.status_mobile]
    if (!filters.mobile_statuses.includes(code)) return false
  }

  if (filters.load_city && route.load.city !== filters.load_city) return false
  if (filters.unload_city && route.unload.city !== filters.unload_city) return false
  if (filters.load_gc_id !== undefined && route.load.city_gc_id !== filters.load_gc_id) return false
  if (filters.unload_gc_id !== undefined && route.unload.city_gc_id !== filters.unload_gc_id) {
    return false
  }

  if (filters.load_date_from && route.load.date < filters.load_date_from) return false
  if (filters.load_date_to && route.load.date > filters.load_date_to) return false
  if (filters.unload_date_from && route.unload.date < filters.unload_date_from) return false
  if (filters.unload_date_to && route.unload.date > filters.unload_date_to) return false

  if (filters.is_available !== undefined && trading.is_available !== filters.is_available) {
    return false
  }
  if (filters.is_bidder !== undefined && trading.is_bidder !== filters.is_bidder) return false
  if (filters.is_favorite !== undefined && trading.is_favorite !== filters.is_favorite) return false

  const current = trading.price?.current ?? 0
  if (filters.current_price_from != null && current < filters.current_price_from) return false
  if (filters.current_price_to != null && current > filters.current_price_to) return false

  const perKm = main.price_per_km ?? 0
  if (filters.price_per_km_from != null && perKm < filters.price_per_km_from) return false
  if (filters.price_per_km_to != null && perKm > filters.price_per_km_to) return false

  if (filters.weight_from !== undefined && cargo.weight < filters.weight_from) return false
  if (filters.weight_to !== undefined && cargo.weight > filters.weight_to) return false
  if (filters.volume_from !== undefined && cargo.volume < filters.volume_from) return false
  if (filters.volume_to !== undefined && cargo.volume > filters.volume_to) return false

  if (filters.body_types?.length && !filters.body_types.includes(cargo.body_type)) return false
  if (filters.auction_ids?.length && !filters.auction_ids.includes(main.id)) return false

  if (filters.customer && !item.organizer.organization_name.includes(filters.customer)) return false
  if (filters.customer_ids?.length && !filters.customer_ids.includes(item.organizer.organization_id)) {
    return false
  }

  if (
    filters.is_international_shipment !== undefined &&
    cargo.is_international !== filters.is_international_shipment
  ) {
    return false
  }

  return true
}

function sortItems(items: AuctionListItem[], filters: AuctionListRequest) {
  const entries = Object.entries(filters.sort ?? {})

  if (entries.length === 0) {
    const direction = filters.is_oldest ? 1 : -1
    return [...items].sort(
      (a, b) => direction * a.main.created_at.localeCompare(b.main.created_at),
    )
  }

  return [...items].sort((a, b) => {
    for (const [field, order] of entries) {
      const direction = order === 'asc' ? 1 : -1
      const left = sortValue(a, field)
      const right = sortValue(b, field)
      if (left === right) continue
      if (typeof left === 'number' && typeof right === 'number') return direction * (left - right)
      return direction * String(left).localeCompare(String(right))
    }
    return 0
  })
}

function sortValue(item: AuctionListItem, field: string): string | number {
  switch (field) {
    case 'start_time':
      return item.trading.start_time
    case 'stop_time':
      return item.trading.stop_time
    case 'current_price':
      return item.trading.price?.current ?? 0
    case 'price_per_km':
      return item.main.price_per_km ?? 0
    case 'created_at':
      return item.main.created_at
    default:
      return item.main.id
  }
}

export function listAuctions(
  records: AuctionRecord[],
  filters: AuctionListRequest,
): AuctionListResponseBase {
  const matched = records.filter((record) => matchesFilters(record, filters))
  const items = sortItems(matched.map(toListItem), filters)

  const perPage = Math.max(1, filters.per_page ?? DEFAULT_PER_PAGE)
  const lastPage = Math.max(1, Math.ceil(items.length / perPage))
  const page = Math.min(Math.max(1, filters.page ?? 1), lastPage)
  const offset = (page - 1) * perPage
  const pageItems = items.slice(offset, offset + perPage)

  return {
    data: pageItems,
    meta: {
      current_page: page,
      from: items.length === 0 ? 0 : offset + 1,
      last_page: lastPage,
      per_page: perPage,
      to: offset + pageItems.length,
      total: items.length,
    },
  }
}
