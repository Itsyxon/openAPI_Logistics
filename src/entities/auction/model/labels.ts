import type {
  AuctionStatus,
  AuctionType,
  BidMeasurementType,
  OperationType,
  PaymentDelayType,
  TradingStatus,
} from '@/shared/api/types/enums'

export const AUCTION_TYPE_LABEL: Record<AuctionType, string> = {
  Request: 'Заявочный',
  Up: 'На повышение',
  Down: 'На понижение',
  FixPrice: 'Фикс. цена',
  Unknown: 'Неизвестно',
}

export const AUCTION_TYPE_MARK: Record<AuctionType, string> = {
  Request: 'REQ',
  Up: 'UP',
  Down: 'DOWN',
  FixPrice: 'FIX',
  Unknown: '—',
}

export const AUCTION_STATUS_LABEL: Record<AuctionStatus, string> = {
  Planning: 'Планирование',
  Auction: 'Торги идут',
  DeterminateWinner: 'Определение победителя',
  WaitDeal: 'Ожидание сделки',
  InProgress: 'В работе',
  Finished: 'Завершён',
  Stopped: 'Остановлен',
  Canceled: 'Отменён',
  Unknown: 'Неизвестно',
}

export const TRADING_STATUS_LABEL: Record<TradingStatus, string> = {
  NotParticipating: 'Не участвую',
  Leading: 'Лидирую',
  Losing: 'Перебит',
  OnPending: 'На рассмотрении',
  Confirmed: 'Подтверждён',
  ChoosingWinner: 'Выбор победителя',
  Winner: 'Победитель',
  Accepted: 'Принят',
  Unknown: 'Неизвестно',
}

export const BID_MEASUREMENT_LABEL: Record<BidMeasurementType, string> = {
  PerRoute: 'за рейс',
  PerKm: 'за км',
  Unknown: '',
}

export const OPERATION_TYPE_LABEL: Record<OperationType, string> = {
  Loading: 'Погрузка',
  Unloading: 'Выгрузка',
  Unknown: 'Точка маршрута',
}

export const PAYMENT_DELAY_LABEL: Record<PaymentDelayType, string> = {
  CalendarDays: 'календарных дней',
  WorkDays: 'рабочих дней',
  Unknown: 'дней',
}

export const TRADING_STATUS_TONE: Record<TradingStatus, string> = {
  NotParticipating: 'text-muted-foreground',
  Leading: 'text-leading',
  Losing: 'text-losing',
  OnPending: 'text-muted-foreground',
  Confirmed: 'text-leading',
  ChoosingWinner: 'text-muted-foreground',
  Winner: 'text-winner',
  Accepted: 'text-leading',
  Unknown: 'text-muted-foreground',
}

const OPEN_STATUSES: AuctionStatus[] = ['Auction', 'DeterminateWinner']

export function isTradingOpen(status: AuctionStatus) {
  return OPEN_STATUSES.includes(status)
}
