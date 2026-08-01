import type { BetItem } from '@/shared/api/types/bet'

export function activeBets(bets: BetItem[]) {
  return bets.filter((bet) => !bet.is_rejected)
}

export function countParticipants(bets: BetItem[]) {
  return new Set(activeBets(bets).map((bet) => bet.subscriber_id)).size
}

export function sortForDisplay(bets: BetItem[]) {
  return [...bets].sort((a, b) => {
    if (a.is_rejected !== b.is_rejected) return a.is_rejected ? 1 : -1
    if (a.place !== null && b.place !== null) return a.place - b.place
    if (a.place !== null) return -1
    if (b.place !== null) return 1
    return b.id - a.id
  })
}

export function isOwnBet(bet: BetItem, subscriberId: number) {
  return bet.subscriber_id === subscriberId
}
