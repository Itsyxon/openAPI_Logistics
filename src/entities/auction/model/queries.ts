import { queryOptions } from '@tanstack/react-query'
import type { AuctionListRequest } from '@/shared/api/types/auction-list'
import { getAuction, listAuctions } from '../api/auction-api'

export const auctionKeys = {
  root: ['auctions'] as const,
  list: (request: AuctionListRequest) =>
    [...auctionKeys.root, 'list', request] as const,
  detail: (uuid: string) => [...auctionKeys.root, 'detail', uuid] as const,
}

export function auctionsQueryOptions(request: AuctionListRequest) {
  return queryOptions({
    queryKey: auctionKeys.list(request),
    queryFn: ({ signal }) => listAuctions(request, signal),
  })
}

export function auctionQueryOptions(uuid: string) {
  return queryOptions({
    queryKey: auctionKeys.detail(uuid),
    queryFn: ({ signal }) => getAuction(uuid, signal),
  })
}
