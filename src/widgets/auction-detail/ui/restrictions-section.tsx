import type { AuctionShowTrading } from '@/shared/api/types/auction-show'
import { DataRow, DetailSection } from './detail-section'
import { yesNo } from '../lib/requirements'

const RESTRICTIONS: { label: string; key: keyof AuctionShowTrading }[] = [
  { label: 'История ставок', key: 'hide_bets_history' },
  { label: 'Места участников', key: 'hide_places' },
  { label: 'Адреса и контакты', key: 'hide_points_address_and_contacts' },
  { label: 'Стоимость груза', key: 'no_view_cargo_price' },
]

export function RestrictionsSection({ trading }: { trading: AuctionShowTrading }) {
  return (
    <DetailSection title="Ограничения">
      <dl>
        <DataRow label="Можно делать ставку" value={yesNo(trading.can_set_bet)} />
        {RESTRICTIONS.map((item) => (
          <DataRow
            key={item.key}
            label={item.label}
            value={
              trading[item.key] ? (
                <span className="text-muted-foreground">скрыто</span>
              ) : (
                'доступно'
              )
            }
          />
        ))}
      </dl>
    </DetailSection>
  )
}
