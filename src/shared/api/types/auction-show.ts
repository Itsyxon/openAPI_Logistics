import type {
  AuctionStatus,
  AuctionType,
  BidMeasurementType,
  OperationType,
  PaymentDelayType,
  TradingStatus,
} from './enums'

export interface AuctionShowMain {
  id: number
  cargo_num: string
  cargo_date: string
  order_uid: string
  auc_type: AuctionType
  created_at: string
}

export interface AuctionShowOrganizer {
  subscriber_id: number
  subscriber_code: string
  infobase_code: string
  organization_name: string
  organization_inn: string
  organization_kpp: string
  organization_id: number
}

export interface Contact {
  name: string | null
  phone: string | null
  work_phone: string | null
  uid: string | null
  email: string | null
}

export interface LoadingTypes {
  side: boolean
  top: boolean
  rear: boolean
  full: boolean
}

export interface Docs {
  tir: boolean
  cmr: boolean
  t1: boolean
  med: boolean
}

export interface CarRequirements {
  type: string
  weight: number | null
  volume: number | null
  width: number | null
  length: number | null
  height: number | null
}

export interface AuctionShowCargo {
  price: string
  currency: number | null
  is_international: boolean
  distance: number | null
  truck_count: number
  body_type: string
  temp_from: number | null
  temp_to: number | null
  conics: number | null
  belts: number | null
  adr: number | null
  coupling: boolean | null
  air_pass: boolean | null
  low_loader: boolean | null
  additional_load: boolean | null
  containered: boolean
  container_type: string | null
  container_size: string | null
  loading_types: LoadingTypes
  docs: Docs
  car: CarRequirements
}

export interface AuctionShowTradingPrice {
  start: number | null
  start_no_vat: number | null
  current: number | null
  current_no_vat: number | null
  available: number | null
  available_no_vat: number | null
  min: number | null
  min_no_vat: number | null
  max: number | null
  max_no_vat: number | null
  step: number | null
  step_no_vat: number | null
  price_per_km: number
}

export interface AuctionShowTradingYour {
  bet: boolean
  last_bet: number | null
  last_bet_with_vat: number | null
  win: boolean
}

export interface AuctionShowTradingSettings {
  prolong_after_bet: number | null
  winner_confirm: number | null
  winner_counter_mode: number | null
  transmission_time_in: number | null
  coefficient: number | null
}

export interface AuctionShowTrading {
  status: AuctionStatus
  status_mobile: TradingStatus
  start_time: string
  stop_time: string
  bid_measurement_type: BidMeasurementType
  can_set_bet: boolean
  allow_counter_bets: boolean
  hide_bets_history: boolean
  hide_places: boolean
  no_view_cargo_price: boolean
  hide_points_address_and_contacts: boolean
  is_bidder: boolean
  is_favorite: boolean
  is_last_bet_with_vat: boolean | null
  red_bet_with_vat: boolean
  red_bet_no_vat: boolean
  send_deal_before_load: boolean
  chat_id: string | null
  price: AuctionShowTradingPrice
  your: AuctionShowTradingYour
  settings: AuctionShowTradingSettings
}

export interface AuctionShowPayment {
  condition: string | null
  condition_predefined: string | null
  form: string
  delay: number | null
  delay_type: PaymentDelayType
  currency_code: string
  prepay: string | null
}

export interface Assembly {
  num: string | null
  date: string | null
}

export interface RoutePointLocation {
  city_name: string
  city_full_name: string
  city_gc_id: number
  loading_address: string
  lon: number
  lat: number
}

export interface RoutePointCargo {
  name: string
  package_name: string
  weight: string
  volume: string
  length: string
  width: string
  height: string
  oversized: boolean
  package_amount: number | null
}

export interface RoutePointContact {
  name: string
  phone: string
}

export interface RoutePoint {
  row_num: number
  op_type: OperationType
  start_date: string
  end_date: string
  comment: string | null
  contractor: string
  contractor_inn: string
  location: RoutePointLocation
  cargo: RoutePointCargo
  contact: RoutePointContact
}

export interface AdmittedOrganization {
  id: number
  inn: string
  is_main: boolean
  name: string
  full_name: string
  site: string | null
  subscriber_id: number
  subscriber_code: string
  subscriber_role: string | null
  infobase_code: string
  infobase_address: string | null
  nalog_key: string | null
  hide_me: boolean
  current_vat_rate: string | null
}

export interface AuctionShowResponse {
  main: AuctionShowMain
  organizer: AuctionShowOrganizer
  contacts: Contact[]
  cargo: AuctionShowCargo
  trading: AuctionShowTrading
  payment: AuctionShowPayment
  assembly: Assembly
  routes: RoutePoint[]
  admitted_organizations: AdmittedOrganization[]
  hide_bets_history: boolean
}
