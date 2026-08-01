import type { ReactNode } from 'react'
import type { AuctionShowResponse } from '@/shared/api/types/auction-show'
import { DetailSection } from './detail-section'
import { DetailHeader } from './detail-header'
import { RouteTimeline } from './route-timeline'
import { CargoSection } from './cargo-section'
import { OrganizerSection } from './organizer-section'
import { PaymentSection } from './payment-section'
import { RestrictionsSection } from './restrictions-section'
import { TradingPanel } from './trading-panel'

interface Props {
  auction: AuctionShowResponse
  action?: ReactNode
}

export function AuctionDetail({ auction, action }: Props) {
  const { main, trading, organizer, contacts, cargo, payment, routes, assembly } = auction

  return (
    <div className="space-y-4">
      <DetailHeader main={main} trading={trading} assembly={assembly} action={action} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="space-y-4">
          <DetailSection title="Маршрут">
            <RouteTimeline
              points={routes}
              hideAddressAndContacts={trading.hide_points_address_and_contacts}
            />
          </DetailSection>

          <CargoSection cargo={cargo} hidePrice={trading.no_view_cargo_price} />

          <OrganizerSection
            organizer={organizer}
            contacts={contacts}
            contactsHidden={trading.hide_points_address_and_contacts}
          />

          <PaymentSection payment={payment} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4">
          <DetailSection title="Параметры торгов">
            <TradingPanel trading={trading} />
          </DetailSection>

          <RestrictionsSection trading={trading} />
        </aside>
      </div>
    </div>
  )
}
