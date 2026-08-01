import type { AuctionListRequest } from '@/shared/api/types/auction-list'
import type { NormalizedSearch } from './search-schema'

function endOfDay(date: string) {
  return `${date}T23:59:59`
}

function startOfDay(date: string) {
  return `${date}T00:00:00`
}

export function searchToListRequest(search: NormalizedSearch): AuctionListRequest {
  return {
    page: search.page,
    per_page: search.per_page,
    cargo_num: search.cargo_num || undefined,
    status: search.status.length > 0 ? search.status : undefined,
    statuses: search.statuses.length > 0 ? search.statuses : undefined,
    auc_type: search.auc_type.length > 0 ? search.auc_type : undefined,
    load_city: search.load_city || undefined,
    unload_city: search.unload_city || undefined,
    load_date_from: search.load_date_from ? startOfDay(search.load_date_from) : undefined,
    load_date_to: search.load_date_to ? endOfDay(search.load_date_to) : undefined,
    is_available: search.is_available,
    is_bidder: search.is_bidder,
    current_price_from: search.price_from ?? undefined,
    current_price_to: search.price_to ?? undefined,
  }
}

export function countActiveFilters(search: NormalizedSearch) {
  let count = 0
  if (search.cargo_num) count += 1
  if (search.status.length > 0) count += 1
  if (search.statuses.length > 0) count += 1
  if (search.auc_type.length > 0) count += 1
  if (search.load_city) count += 1
  if (search.unload_city) count += 1
  if (search.load_date_from || search.load_date_to) count += 1
  if (search.is_available !== undefined) count += 1
  if (search.is_bidder !== undefined) count += 1
  if (search.price_from !== undefined || search.price_to !== undefined) count += 1
  return count
}
