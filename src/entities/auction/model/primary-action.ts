import type { AuctionStatus } from '@/shared/api/types/enums'
import { isTradingOpen } from './labels'

export type PrimaryActionKind = 'bid' | 'edit-bid' | 'view-bets' | 'unavailable'

export interface PrimaryAction {
  kind: PrimaryActionKind
  label: string
  disabled: boolean
}

interface Input {
  canSetBet: boolean
  hasBet: boolean
  hideBetsHistory: boolean
  status: AuctionStatus
}

export function resolvePrimaryAction({
  canSetBet,
  hasBet,
  hideBetsHistory,
  status,
}: Input): PrimaryAction {
  if (canSetBet) {
    return hasBet
      ? { kind: 'edit-bid', label: 'Изменить ставку', disabled: false }
      : { kind: 'bid', label: 'Сделать ставку', disabled: false }
  }

  if (!hideBetsHistory && (hasBet || isTradingOpen(status) || status === 'Finished')) {
    return { kind: 'view-bets', label: 'Смотреть ставки', disabled: false }
  }

  return { kind: 'unavailable', label: 'Ставки недоступны', disabled: true }
}
