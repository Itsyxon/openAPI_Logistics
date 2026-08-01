import { z } from 'zod'

export const DETAIL_TABS = ['info', 'bets'] as const

export type DetailTab = (typeof DETAIL_TABS)[number]

export const detailSearchSchema = z.object({
  tab: z.enum(DETAIL_TABS).optional().catch(undefined),
})

export type DetailSearch = z.infer<typeof detailSearchSchema>

export function validateDetailSearch(input: unknown): DetailSearch {
  const parsed = detailSearchSchema.safeParse(input)
  return parsed.success ? parsed.data : {}
}
