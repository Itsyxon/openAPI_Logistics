import { CURRENT_SESSION, VAT_RATE } from '@/shared/config/session'

export const CURRENT_USER = {
  subscriber_id: CURRENT_SESSION.subscriberId,
  organization_id: CURRENT_SESSION.organizationId,
  organization_inn: CURRENT_SESSION.organizationInn,
  organization_name: CURRENT_SESSION.organizationName,
  contact_name: CURRENT_SESSION.contactName,
  contact_phone: CURRENT_SESSION.contactPhone,
}

export function withoutVat(priceWithVat: number) {
  return Math.round((priceWithVat / (1 + VAT_RATE / 100)) * 100) / 100
}
