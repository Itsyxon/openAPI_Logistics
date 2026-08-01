import { queryOptions } from '@tanstack/react-query'
import { listBets } from '../api/bet-api'

export const betKeys = {
  root: ['bets'] as const,
  list: (uuid: string, all: boolean) => [...betKeys.root, 'list', uuid, all] as const,
}

export function betsQueryOptions(uuid: string, all = false) {
  return queryOptions({
    queryKey: betKeys.list(uuid, all),
    queryFn: ({ signal }) => listBets(uuid, all, signal),
  })
}
