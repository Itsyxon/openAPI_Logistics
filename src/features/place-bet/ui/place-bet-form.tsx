import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Gavel, Loader2, TriangleAlert } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { formatMoney } from '@/shared/lib/format'
import type { AuctionShowResponse } from '@/shared/api/types/auction-show'
import { createBidSchema, type BidValues } from '../model/bid-schema'
import { describeBetError } from '../model/describe-bet-error'
import { usePlaceBet } from '../model/use-place-bet'

interface Props {
  auction: AuctionShowResponse
  onDone: () => void
}

export function PlaceBetForm({ auction, onDone }: Props) {
  const { price, can_set_bet: canSetBet, your } = auction.trading
  const limits = {
    min: price.min,
    max: price.max,
    step: price.step,
    start: price.start,
    available: price.available,
    aucType: auction.main.auc_type,
  }

  const form = useForm<BidValues>({
    resolver: zodResolver(createBidSchema(limits)),
    defaultValues: { price: price.available ?? price.current ?? 0 },
    mode: 'onSubmit',
  })

  const mutation = usePlaceBet(auction.main.order_uid)

  if (!canSetBet) {
    return (
      <div className='flex items-start gap-3 rounded-md border border-dashed p-4'>
        <TriangleAlert className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
        <div>
          <p className='text-sm font-medium'>Ставку сделать нельзя</p>
          <p className='mt-0.5 text-sm text-muted-foreground'>
            Организатор закрыл приём ставок по этой заявке.
          </p>
        </div>
      </div>
    )
  }

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values.price, {
      onSuccess: () => {
        toast.success(your.bet ? 'Ставка изменена' : 'Ставка принята')
        onDone()
      },
      onError: (error) => {
        const described = describeBetError(error)

        for (const fieldError of described.fieldErrors) {
          if (fieldError.field === 'price') {
            form.setError('price', { message: fieldError.message })
          }
        }

        const unknownFields = described.fieldErrors.filter(
          (fieldError) => fieldError.field !== 'price',
        )

        toast.error(
          unknownFields.length > 0
            ? unknownFields.map((item) => `${item.field}: ${item.message}`).join('; ')
            : described.message,
        )
      },
    })
  })

  const error = form.formState.errors.price

  return (
    <form onSubmit={onSubmit} className='space-y-4' noValidate>
      <div className='space-y-2'>
        <Label htmlFor='bid-price' className='eyebrow'>
          Ваша цена, ₽
        </Label>
        <Input
          id='bid-price'
          type='number'
          inputMode='decimal'
          step={price.step ?? 'any'}
          autoFocus
          aria-invalid={error ? true : undefined}
          aria-describedby='bid-hint'
          className='num h-14 text-2xl font-semibold'
          {...form.register('price', { valueAsNumber: true })}
        />
        <p id='bid-hint' className='text-xs text-muted-foreground'>
          {hint(limits)}
        </p>
        {error ? (
          <p role='alert' className='text-sm text-destructive'>
            {error.message}
          </p>
        ) : null}
      </div>

      <div className='flex flex-col gap-2 sm:flex-row-reverse'>
        <Button
          type='submit'
          disabled={mutation.isPending}
          className='gap-2 sm:flex-1'
        >
          {mutation.isPending ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <Gavel className='size-4' />
          )}
          {your.bet ? 'Изменить ставку' : 'Сделать ставку'}
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={onDone}
          className='sm:flex-1'
        >
          Отмена
        </Button>
      </div>
    </form>
  )
}

function hint(limits: {
  min: number | null
  max: number | null
  step: number | null
  available: number | null
}) {
  const parts: string[] = []
  if (limits.available !== null)
    parts.push(`доступная цена ${formatMoney(limits.available)} ₽`)
  if (limits.step !== null) parts.push(`шаг ${formatMoney(limits.step)} ₽`)
  if (limits.min !== null && limits.max !== null) {
    parts.push(
      `диапазон ${formatMoney(limits.min)}—${formatMoney(limits.max)} ₽`,
    )
  }
  return parts.length > 0 ? parts.join(' · ') : 'Ограничений по цене нет'
}
