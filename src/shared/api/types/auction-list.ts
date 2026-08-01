import type { AuctionStatus, AuctionType, BidMeasurementType, TradingStatus } from './enums'

export type SortDirection = 'asc' | 'desc'

export interface AuctionListRequest {
  page?: number
  per_page?: number
  is_oldest?: boolean
  sort?: Record<string, SortDirection> | null
  status?: TradingStatus[]
  mobile_statuses?: number[]
  statuses?: number[]
  cargo_num?: string
  weight_from?: number
  weight_to?: number
  volume_from?: number
  volume_to?: number
  body_types?: string[]
  form_type?: string | null
  is_international_shipment?: boolean
  load_city?: string
  load_gc_id?: number
  load_range?: number
  unload_city?: string
  unload_gc_id?: number
  unload_range?: number
  load_date_from?: string
  load_date_to?: string
  unload_date_from?: string
  unload_date_to?: string
  create_date_from?: string
  create_date_to?: string
  start_time_from?: string
  start_time_to?: string
  stop_time_from?: string
  stop_time_to?: string
  is_available?: boolean
  is_favorite?: boolean
  is_bidder?: boolean
  customer?: string
  customer_ids?: number[]
  contractor?: string | null
  auction_ids?: number[]
  replace_external_pads?: boolean | null
  current_price_from?: number | null
  current_price_to?: number | null
  price_per_km_from?: number | null
  price_per_km_to?: number | null
  auc_type?: AuctionType[]
}

export interface AuctionListMeta {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface AuctionListItemMain {
  id: number
  cargo_num: string
  cargo_date: string
  auc_type: AuctionType
  order_uid: string
  created_at: string
  priority_sort: number
  is_assembly: boolean
  price_per_km: number | null
}

export interface AuctionListItemOrganizer {
  subscriber_id: number
  organization_id: number
  organization_name: string
  organization_inn: string
  organization_kpp: string
  is_hide_organization: boolean
}

export interface AuctionListItemRoutePoint {
  city: string
  address: string
  date: string
  city_gc_id: number
  points_count: number
}

export interface AuctionListItemRoute {
  load: AuctionListItemRoutePoint
  unload: AuctionListItemRoutePoint
}

export interface AuctionListItemCargoLoadingType {
  side: boolean
  top: boolean
  rear: boolean
  full: boolean
}

export interface AuctionListItemCargoDocs {
  tir: boolean
  cmr: boolean
  t1: boolean
  med: boolean
}

export interface AuctionListItemCargoCar {
  type: string
  weight: number
  volume: number
  width: number
  length: number
  height: number
}

export interface AuctionListItemCargo {
  name: string
  weight: number
  volume: number
  body_type: string
  truck_count: number
  is_cargo: boolean
  is_international: boolean
  containered: boolean
  incoterms: string
  conics: number
  belts: number
  adr: number
  coupling: boolean
  air_pass: boolean
  low_loader: boolean
  additional_load: boolean
  temp_from: number
  temp_to: number
  loading_types: AuctionListItemCargoLoadingType
  docs: AuctionListItemCargoDocs
  car: AuctionListItemCargoCar | null
}

export interface AuctionListItemTradingPrice {
  start: number
  current: number
  current_no_vat: number
}

export interface AuctionListItemTradingYour {
  bet: boolean
  last_bet: number | null
}

export interface AuctionListItemTrading {
  status: AuctionStatus
  status_mobile: TradingStatus
  start_time: string
  stop_time: string
  bid_measurement_type: BidMeasurementType | null
  can_set_bet: boolean
  allow_counter_bets: boolean
  hide_points_address_and_contacts: boolean
  direction: string
  comment: string
  is_bidder: boolean
  is_available: boolean
  is_accredited: boolean
  is_favorite: boolean
  price: AuctionListItemTradingPrice | null
  your: AuctionListItemTradingYour | null
  red_bet_with_vat: boolean
  red_bet_no_vat: boolean
  is_last_bet_with_vat: boolean
}

export interface AuctionListItemPayment {
  form: string
  currency_code: string
  consignor: string
  consignee: string
}

export interface AuctionListItem {
  main: AuctionListItemMain
  organizer: AuctionListItemOrganizer
  route: AuctionListItemRoute
  cargo: AuctionListItemCargo
  trading: AuctionListItemTrading
  payment: AuctionListItemPayment
}

export interface AuctionListResponseBase {
  data: AuctionListItem[]
  meta: AuctionListMeta
}
