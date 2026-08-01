import type {
  AuctionShowResponse,
  RoutePoint,
} from '@/shared/api/types/auction-show'
import type { BetItem } from '@/shared/api/types/bet'
import type {
  AuctionStatus,
  AuctionType,
  BidMeasurementType,
  PaymentDelayType,
} from '@/shared/api/types/enums'
import { MOCK_CITIES, type MockCity } from '@/shared/config/cities'
import { withoutVat } from './current-user'

export interface AuctionRecord {
  show: AuctionShowResponse
  list: {
    priority_sort: number
    is_assembly: boolean
    is_available: boolean
    is_accredited: boolean
    is_hide_organization: boolean
    consignor: string
    consignee: string
    incoterms: string
    cargo_name: string
    cargo_weight: number
    cargo_volume: number
  }
  bets: BetItem[]
}

export interface AuctionSeed {
  id: number
  order_uid: string
  cargo_num: string
  auc_type: AuctionType
  status: AuctionStatus
  bid_measurement_type: BidMeasurementType
  load_city_gc_id: number
  unload_city_gc_id: number
  load_at: string
  unload_at: string
  start_time: string
  stop_time: string
  cargo_name: string
  cargo_weight: number
  cargo_volume: number
  body_type: string
  car_type: string
  distance: number | null
  price_start: number
  price_min: number | null
  price_max: number | null
  price_step: number | null
  can_set_bet: boolean
  hide_bets_history: boolean
  hide_places: boolean
  hide_points_address_and_contacts: boolean
  no_view_cargo_price: boolean
  is_available: boolean
  is_accredited: boolean
  is_favorite: boolean
  allow_counter_bets: boolean
  organizer_name: string
  organizer_inn: string
  organizer_id: number
  payment_form: string
  payment_delay: number | null
  payment_delay_type: PaymentDelayType
  payment_condition: string | null
  contacts_hidden: boolean
  truck_count: number
  is_international: boolean
  assembly_num: string | null
  temp_from: number | null
  temp_to: number | null
}

function city(gcId: number): MockCity {
  const found = MOCK_CITIES.find((item) => item.gc_id === gcId)
  if (!found) throw new Error(`Unknown mock city gc_id: ${gcId}`)
  return found
}

function routePoint(
  rowNum: number,
  opType: 'Loading' | 'Unloading',
  place: MockCity,
  address: string,
  startDate: string,
  endDate: string,
  seed: AuctionSeed,
): RoutePoint {
  return {
    row_num: rowNum,
    op_type: opType,
    start_date: startDate,
    end_date: endDate,
    comment: opType === 'Loading' ? 'Пропуск оформляется на КПП' : null,
    contractor: seed.organizer_name,
    contractor_inn: seed.organizer_inn,
    location: {
      city_name: place.name,
      city_full_name: place.full_name,
      city_gc_id: place.gc_id,
      loading_address: address,
      lon: place.lon,
      lat: place.lat,
    },
    cargo: {
      name: seed.cargo_name,
      package_name: 'Паллета',
      weight: seed.cargo_weight.toFixed(3),
      volume: seed.cargo_volume.toFixed(3),
      length: '0',
      width: '0',
      height: '0',
      oversized: false,
      package_amount: opType === 'Loading' ? 12 : null,
    },
    contact: {
      name: seed.hide_points_address_and_contacts ? '' : 'Петров Пётр',
      phone: seed.hide_points_address_and_contacts ? '' : '+77777777777',
    },
  }
}

export function createAuctionRecord(seed: AuctionSeed): AuctionRecord {
  const loadCity = city(seed.load_city_gc_id)
  const unloadCity = city(seed.unload_city_gc_id)

  const available =
    seed.price_step === null ? seed.price_start : nextAvailable(seed)

  const show: AuctionShowResponse = {
    main: {
      id: seed.id,
      cargo_num: seed.cargo_num,
      cargo_date: seed.load_at,
      order_uid: seed.order_uid,
      auc_type: seed.auc_type,
      created_at: seed.start_time,
    },
    organizer: {
      subscriber_id: 98,
      subscriber_code: '12345',
      infobase_code: 'RU_Cargo_01',
      organization_name: seed.organizer_name,
      organization_inn: seed.organizer_inn,
      organization_kpp: '770301001',
      organization_id: seed.organizer_id,
    },
    contacts: seed.contacts_hidden
      ? []
      : [
          {
            name: 'Смирнова Ольга Петровна',
            phone: '+77777777777',
            work_phone: '+77777777770',
            uid: `c0ffee00-0000-4000-8000-${String(seed.id).padStart(12, '0')}`,
            email: 'logistics@example.com',
          },
        ],
    cargo: {
      price: seed.no_view_cargo_price ? '0' : String(seed.price_start),
      currency: 643,
      is_international: seed.is_international,
      distance: seed.distance,
      truck_count: seed.truck_count,
      body_type: seed.body_type,
      temp_from: seed.temp_from,
      temp_to: seed.temp_to,
      conics: null,
      belts: 6,
      adr: null,
      coupling: false,
      air_pass: null,
      low_loader: false,
      additional_load: false,
      containered: false,
      container_type: null,
      container_size: null,
      loading_types: { side: true, top: false, rear: true, full: false },
      docs: { tir: false, cmr: seed.is_international, t1: false, med: true },
      car: {
        type: seed.car_type,
        weight: 20,
        volume: 82,
        width: 2.4,
        length: 13.6,
        height: 2.7,
      },
    },
    trading: {
      status: seed.status,
      status_mobile: 'NotParticipating',
      start_time: seed.start_time,
      stop_time: seed.stop_time,
      bid_measurement_type: seed.bid_measurement_type,
      can_set_bet: seed.can_set_bet,
      allow_counter_bets: seed.allow_counter_bets,
      hide_bets_history: seed.hide_bets_history,
      hide_places: seed.hide_places,
      no_view_cargo_price: seed.no_view_cargo_price,
      hide_points_address_and_contacts: seed.hide_points_address_and_contacts,
      is_bidder: false,
      is_favorite: seed.is_favorite,
      is_last_bet_with_vat: null,
      red_bet_with_vat: false,
      red_bet_no_vat: false,
      send_deal_before_load: false,
      chat_id: null,
      price: {
        start: seed.price_start,
        start_no_vat: withoutVat(seed.price_start),
        current: seed.price_start,
        current_no_vat: withoutVat(seed.price_start),
        available,
        available_no_vat: available === null ? null : withoutVat(available),
        min: seed.price_min,
        min_no_vat: seed.price_min === null ? null : withoutVat(seed.price_min),
        max: seed.price_max,
        max_no_vat: seed.price_max === null ? null : withoutVat(seed.price_max),
        step: seed.price_step,
        step_no_vat:
          seed.price_step === null ? null : withoutVat(seed.price_step),
        price_per_km:
          seed.distance && seed.distance > 0
            ? Math.round((seed.price_start / seed.distance) * 100) / 100
            : 0,
      },
      your: {
        bet: false,
        last_bet: null,
        last_bet_with_vat: null,
        win: false,
      },
      settings: {
        prolong_after_bet: 10,
        winner_confirm: 1,
        winner_counter_mode: null,
        transmission_time_in: 24,
        coefficient: 10,
      },
    },
    payment: {
      condition: seed.payment_condition,
      condition_predefined:
        seed.payment_condition === null ? null : 'ПоОригиналамНакладных',
      form: seed.payment_form,
      delay: seed.payment_delay,
      delay_type: seed.payment_delay_type,
      currency_code: '643',
      prepay: '0',
    },
    assembly: {
      num: seed.assembly_num,
      date: seed.assembly_num === null ? null : seed.start_time,
    },
    routes: [
      routePoint(
        1,
        'Loading',
        loadCity,
        'Транспортная 9',
        seed.load_at,
        seed.load_at,
        seed,
      ),
      routePoint(
        2,
        'Unloading',
        unloadCity,
        'Складская 41',
        seed.unload_at,
        seed.unload_at,
        seed,
      ),
    ],
    admitted_organizations: [
      {
        id: 14,
        inn: '9616244307',
        is_main: true,
        name: 'ООО Перевозчик',
        full_name: 'Общество с ограниченной ответственностью «Перевозчик»',
        site: null,
        subscriber_id: 13,
        subscriber_code: '54321',
        subscriber_role: null,
        infobase_code: 'RU_Cargo_01',
        infobase_address: null,
        nalog_key: null,
        hide_me: false,
        current_vat_rate: '20',
      },
    ],
    hide_bets_history: seed.hide_bets_history,
  }

  return {
    show,
    list: {
      priority_sort: 0,
      is_assembly: seed.assembly_num !== null,
      is_available: seed.is_available,
      is_accredited: seed.is_accredited,
      is_hide_organization: false,
      consignor: seed.organizer_name,
      consignee: 'ООО Получатель',
      incoterms: '',
      cargo_name: seed.cargo_name,
      cargo_weight: seed.cargo_weight,
      cargo_volume: seed.cargo_volume,
    },
    bets: [],
  }
}

function nextAvailable(seed: AuctionSeed): number | null {
  if (seed.price_step === null) return seed.price_start
  if (seed.auc_type === 'Up') return seed.price_start + seed.price_step
  if (seed.auc_type === 'FixPrice') return seed.price_start
  return seed.price_start - seed.price_step
}
