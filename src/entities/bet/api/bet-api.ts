import { httpRequest } from '@/shared/api/http-client'
import type { BetListResponse, SetBetRequest } from '@/shared/api/types/bet'

export function listBets(auctionUuid: string, all?: boolean, signal?: AbortSignal) {
  return httpRequest<BetListResponse>(`/auctions/${auctionUuid}/bets`, {
    query: { all },
    signal,
  })
}

export function setBet(auctionUuid: string, payload: SetBetRequest, signal?: AbortSignal) {
  return httpRequest<void>(`/auctions/${auctionUuid}/bets`, {
    method: 'POST',
    body: payload,
    signal,
  })
}
