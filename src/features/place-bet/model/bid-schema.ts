import { z } from 'zod'
import type { AuctionType } from '@/shared/api/types/enums'

export interface BidLimits {
  min: number | null
  max: number | null
  step: number | null
  start: number | null
  available: number | null
  aucType: AuctionType
}

const EPSILON = 0.001

export function createBidSchema(limits: BidLimits) {
  return z.object({
    price: z
      .number({ error: 'Введите цену' })
      .finite('Введите корректное число')
      .positive('Цена должна быть больше 0')
      .superRefine((price, ctx) => {
        if (limits.min !== null && price < limits.min - EPSILON) {
          ctx.addIssue({
            code: 'custom',
            message: `Не меньше ${limits.min.toLocaleString('ru-RU')} ₽`,
          })
          return
        }

        if (limits.max !== null && price > limits.max + EPSILON) {
          ctx.addIssue({
            code: 'custom',
            message: `Не больше ${limits.max.toLocaleString('ru-RU')} ₽`,
          })
          return
        }

        if (limits.available !== null && limits.aucType === 'Down' && price > limits.available + EPSILON) {
          ctx.addIssue({
            code: 'custom',
            message: `Ставка должна быть не выше ${limits.available.toLocaleString('ru-RU')} ₽`,
          })
          return
        }

        if (limits.available !== null && limits.aucType === 'Up' && price < limits.available - EPSILON) {
          ctx.addIssue({
            code: 'custom',
            message: `Ставка должна быть не ниже ${limits.available.toLocaleString('ru-RU')} ₽`,
          })
          return
        }

        if (limits.step !== null && limits.step > 0 && limits.start !== null) {
          const diff = Math.abs(limits.start - price)
          const deviation = Math.abs(diff - Math.round(diff / limits.step) * limits.step)
          if (deviation > EPSILON) {
            ctx.addIssue({
              code: 'custom',
              message: `Цена должна быть кратна шагу ${limits.step.toLocaleString('ru-RU')} ₽`,
            })
          }
        }
      }),
  })
}

export type BidValues = { price: number }
