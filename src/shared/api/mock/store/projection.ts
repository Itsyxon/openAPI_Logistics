import type { AuctionListItem } from '@/shared/api/types/auction-list'
import type { AuctionRecord } from '../record'

export function toListItem(record: AuctionRecord): AuctionListItem {
  const { show, list } = record
  const load = show.routes.find((point) => point.op_type === 'Loading') ?? show.routes[0]
  const unload = show.routes.find((point) => point.op_type === 'Unloading') ?? show.routes[1]
  const trading = show.trading

  return {
    main: {
      id: show.main.id,
      cargo_num: show.main.cargo_num,
      cargo_date: show.main.cargo_date,
      auc_type: show.main.auc_type,
      order_uid: show.main.order_uid,
      created_at: show.main.created_at,
      priority_sort: list.priority_sort,
      is_assembly: list.is_assembly,
      price_per_km: trading.price.price_per_km,
    },
    organizer: {
      subscriber_id: show.organizer.subscriber_id,
      organization_id: show.organizer.organization_id,
      organization_name: show.organizer.organization_name,
      organization_inn: show.organizer.organization_inn,
      organization_kpp: show.organizer.organization_kpp,
      is_hide_organization: list.is_hide_organization,
    },
    route: {
      load: {
        city: load.location.city_name,
        address: trading.hide_points_address_and_contacts ? '' : load.location.loading_address,
        date: load.start_date,
        city_gc_id: load.location.city_gc_id,
        points_count: 1,
      },
      unload: {
        city: unload.location.city_name,
        address: trading.hide_points_address_and_contacts ? '' : unload.location.loading_address,
        date: unload.start_date,
        city_gc_id: unload.location.city_gc_id,
        points_count: 1,
      },
    },
    cargo: {
      name: list.cargo_name,
      weight: list.cargo_weight,
      volume: list.cargo_volume,
      body_type: show.cargo.body_type,
      truck_count: show.cargo.truck_count,
      is_cargo: true,
      is_international: show.cargo.is_international,
      containered: show.cargo.containered,
      incoterms: list.incoterms,
      conics: show.cargo.conics ?? 0,
      belts: show.cargo.belts ?? 0,
      adr: show.cargo.adr ?? 0,
      coupling: show.cargo.coupling ?? false,
      air_pass: show.cargo.air_pass ?? false,
      low_loader: show.cargo.low_loader ?? false,
      additional_load: show.cargo.additional_load ?? false,
      temp_from: show.cargo.temp_from ?? 0,
      temp_to: show.cargo.temp_to ?? 0,
      loading_types: show.cargo.loading_types,
      docs: show.cargo.docs,
      car: {
        type: show.cargo.car.type,
        weight: show.cargo.car.weight ?? 0,
        volume: show.cargo.car.volume ?? 0,
        width: show.cargo.car.width ?? 0,
        length: show.cargo.car.length ?? 0,
        height: show.cargo.car.height ?? 0,
      },
    },
    trading: {
      status: trading.status,
      status_mobile: trading.status_mobile,
      start_time: trading.start_time,
      stop_time: trading.stop_time,
      bid_measurement_type: trading.bid_measurement_type,
      can_set_bet: trading.can_set_bet,
      allow_counter_bets: trading.allow_counter_bets,
      hide_points_address_and_contacts: trading.hide_points_address_and_contacts,
      direction: '',
      comment: '',
      is_bidder: trading.is_bidder,
      is_available: list.is_available,
      is_accredited: list.is_accredited,
      is_favorite: trading.is_favorite,
      price: {
        start: trading.price.start ?? 0,
        current: trading.price.current ?? 0,
        current_no_vat: trading.price.current_no_vat ?? 0,
      },
      your: {
        bet: trading.your.bet,
        last_bet: trading.your.last_bet_with_vat,
      },
      red_bet_with_vat: trading.red_bet_with_vat,
      red_bet_no_vat: trading.red_bet_no_vat,
      is_last_bet_with_vat: trading.is_last_bet_with_vat ?? false,
    },
    payment: {
      form: show.payment.form,
      currency_code: show.payment.currency_code,
      consignor: list.consignor,
      consignee: list.consignee,
    },
  }
}
