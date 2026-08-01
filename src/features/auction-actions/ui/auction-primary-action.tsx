import { Link } from '@tanstack/react-router'
import { Gavel, ListOrdered, Lock, PenLine } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import type { PrimaryAction } from '@/entities/auction'

const ICON = {
  bid: Gavel,
  'edit-bid': PenLine,
  'view-bets': ListOrdered,
  unavailable: Lock,
}

interface Props {
  action: PrimaryAction
  auctionUuid: string
  size?: 'sm' | 'default'
}

export function AuctionPrimaryAction({ action, auctionUuid, size = 'sm' }: Props) {
  const Icon = ICON[action.kind]

  if (action.disabled) {
    return (
      <Button variant="outline" size={size} disabled className="gap-2">
        <Icon className="size-4" />
        {action.label}
      </Button>
    )
  }

  const isBid = action.kind === 'bid' || action.kind === 'edit-bid'

  return (
    <Button asChild size={size} variant={isBid ? 'default' : 'outline'} className="gap-2">
      <Link
        to={isBid ? '/auctions/$auctionUuid/bid' : '/auctions/$auctionUuid'}
        params={{ auctionUuid }}
        search={isBid ? {} : { tab: 'bets' as const }}
      >
        <Icon className="size-4" />
        {action.label}
      </Link>
    </Button>
  )
}
