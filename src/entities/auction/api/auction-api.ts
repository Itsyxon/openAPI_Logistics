import { httpRequest } from '@/shared/api/http-client'
import type {
  AuctionListRequest,
  AuctionListResponseBase,
} from '@/shared/api/types/auction-list'
import type { AuctionShowResponse } from '@/shared/api/types/auction-show'

export function listAuctions(body: AuctionListRequest, signal?: AbortSignal) {
  return httpRequest<AuctionListResponseBase>('/auctions/list', {
    method: 'POST',
    body,
    signal,
  })
}

export function getAuction(auctionUuid: string, signal?: AbortSignal) {
  return httpRequest<AuctionShowResponse>(`/auctions/${auctionUuid}`, {
    signal,
  })
}
