export const AUCTION_TYPES = ['Request', 'Up', 'Down', 'FixPrice', 'Unknown'] as const
export type AuctionType = (typeof AUCTION_TYPES)[number]

export const AUCTION_STATUSES = [
  'Planning',
  'Auction',
  'DeterminateWinner',
  'WaitDeal',
  'InProgress',
  'Finished',
  'Stopped',
  'Canceled',
  'Unknown',
] as const
export type AuctionStatus = (typeof AUCTION_STATUSES)[number]

export const TRADING_STATUSES = [
  'NotParticipating',
  'Leading',
  'Losing',
  'OnPending',
  'Confirmed',
  'ChoosingWinner',
  'Winner',
  'Accepted',
  'Unknown',
] as const
export type TradingStatus = (typeof TRADING_STATUSES)[number]

export const BID_MEASUREMENT_TYPES = ['PerRoute', 'PerKm', 'Unknown'] as const
export type BidMeasurementType = (typeof BID_MEASUREMENT_TYPES)[number]

export const OPERATION_TYPES = ['Loading', 'Unloading', 'Unknown'] as const
export type OperationType = (typeof OPERATION_TYPES)[number]

export const PAYMENT_DELAY_TYPES = ['CalendarDays', 'WorkDays', 'Unknown'] as const
export type PaymentDelayType = (typeof PAYMENT_DELAY_TYPES)[number]

export const AUCTION_STATUS_CODE: Record<AuctionStatus, number> = {
  Planning: 1,
  Auction: 2,
  DeterminateWinner: 3,
  WaitDeal: 4,
  InProgress: 5,
  Finished: 6,
  Stopped: 7,
  Canceled: 8,
  Unknown: 0,
}

export const TRADING_STATUS_CODE: Record<TradingStatus, number> = {
  NotParticipating: 1,
  Leading: 2,
  Losing: 3,
  Winner: 4,
  Confirmed: 5,
  OnPending: 6,
  ChoosingWinner: 7,
  Accepted: 8,
  Unknown: 0,
}
