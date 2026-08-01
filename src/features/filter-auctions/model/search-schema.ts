import { z } from 'zod'
import { AUCTION_TYPES, TRADING_STATUSES } from '@/shared/api/types/enums'
import { DEFAULT_PER_PAGE } from '@/shared/config/api'

const AUCTION_STATUS_CODES = [1, 2, 3, 4, 5, 6, 7, 8] as const

function isStatusCode(value: number): boolean {
  return (AUCTION_STATUS_CODES as readonly number[]).includes(value)
}

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional()
  .catch(undefined)

const money = z.coerce
  .number()
  .nonnegative()
  .finite()
  .optional()
  .catch(undefined)

export const auctionsSearchSchema = z.object({
  page: z.coerce.number().int().min(1).optional().catch(1),
  per_page: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .catch(DEFAULT_PER_PAGE),

  cargo_num: z.string().trim().max(50).optional().catch(undefined),
  status: z.array(z.enum(TRADING_STATUSES)).optional().catch(undefined),
  statuses: z
    .array(z.coerce.number().int().refine(isStatusCode))
    .optional()
    .catch(undefined),
  auc_type: z.array(z.enum(AUCTION_TYPES)).optional().catch(undefined),

  load_city: z.string().trim().max(80).optional().catch(undefined),
  unload_city: z.string().trim().max(80).optional().catch(undefined),

  load_date_from: isoDate,
  load_date_to: isoDate,

  is_available: z.boolean().optional().catch(undefined),
  is_bidder: z.boolean().optional().catch(undefined),

  price_from: money,
  price_to: money,
})

export type AuctionsSearch = z.infer<typeof auctionsSearchSchema>

export interface NormalizedSearch extends AuctionsSearch {
  page: number
  per_page: number
  status: NonNullable<AuctionsSearch['status']>
  statuses: NonNullable<AuctionsSearch['statuses']>
  auc_type: NonNullable<AuctionsSearch['auc_type']>
}

export const EMPTY_SEARCH: AuctionsSearch = {}

export function validateAuctionsSearch(input: unknown): AuctionsSearch {
  const parsed = auctionsSearchSchema.safeParse(input)
  return parsed.success ? parsed.data : EMPTY_SEARCH
}

export function normalizeSearch(search: AuctionsSearch): NormalizedSearch {
  return {
    ...search,
    page: search.page ?? 1,
    per_page: search.per_page ?? DEFAULT_PER_PAGE,
    status: search.status ?? [],
    statuses: search.statuses ?? [],
    auc_type: search.auc_type ?? [],
  }
}
