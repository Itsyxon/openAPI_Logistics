import { ArrowDownRight, ArrowUpRight, Equal, FileText } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { AuctionType } from '@/shared/api/types/enums'
import { AUCTION_TYPE_LABEL, AUCTION_TYPE_MARK } from '../model/labels'

const ICON = {
  Down: ArrowDownRight,
  Up: ArrowUpRight,
  FixPrice: Equal,
  Request: FileText,
  Unknown: FileText,
}

const TONE: Record<AuctionType, string> = {
  Down: 'text-down',
  Up: 'text-up',
  FixPrice: 'text-muted-foreground',
  Request: 'text-muted-foreground',
  Unknown: 'text-muted-foreground',
}

interface Props {
  type: AuctionType
  className?: string
}

export function AuctionTypeMark({ type, className }: Props) {
  const Icon = ICON[type]

  return (
    <span
      className={cn('inline-flex items-center gap-1.5', TONE[type], className)}
      title={AUCTION_TYPE_LABEL[type]}
    >
      <Icon className='size-3.5 shrink-0' strokeWidth={2.5} />
      <span className='font-display text-xs font-bold uppercase tracking-[0.14em]'>
        {AUCTION_TYPE_MARK[type]}
      </span>
    </span>
  )
}
