import type { AuctionShowPayment } from '@/shared/api/types/auction-show'
import { PAYMENT_DELAY_LABEL } from '@/entities/auction'
import { DataRow, DetailSection } from './detail-section'

export function PaymentSection({ payment }: { payment: AuctionShowPayment }) {
  return (
    <DetailSection title="Условия оплаты">
      <dl>
        <DataRow label="Форма оплаты" value={payment.form} />
        <DataRow label="Условие" value={payment.condition ?? '—'} />
        <DataRow
          label="Отсрочка"
          value={
            payment.delay === null
              ? '—'
              : `${payment.delay} ${PAYMENT_DELAY_LABEL[payment.delay_type]}`
          }
          mono
        />
        <DataRow label="Предоплата" value={payment.prepay ?? '—'} mono />
        <DataRow label="Валюта" value={payment.currency_code} mono />
      </dl>
    </DetailSection>
  )
}
