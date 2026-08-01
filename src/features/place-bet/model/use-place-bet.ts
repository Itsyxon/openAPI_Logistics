import { useMutation, useQueryClient } from '@tanstack/react-query'
import { auctionKeys } from '@/entities/auction'
import { betKeys, setBet } from '@/entities/bet'

export function usePlaceBet(auctionUuid: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (price: number) => setBet(auctionUuid, { price }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: auctionKeys.root }),
        queryClient.invalidateQueries({ queryKey: betKeys.root }),
      ]),
  })
}
