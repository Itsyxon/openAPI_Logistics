import { EyeOff, Mail, Phone } from 'lucide-react'
import type { AuctionShowOrganizer, Contact } from '@/shared/api/types/auction-show'
import { DataRow, DetailSection, EmptyNote } from './detail-section'

interface Props {
  organizer: AuctionShowOrganizer
  contacts: Contact[]
  contactsHidden: boolean
}

export function OrganizerSection({ organizer, contacts, contactsHidden }: Props) {
  return (
    <DetailSection title="Организатор">
      <dl>
        <DataRow label="Организация" value={organizer.organization_name} />
        <DataRow label="ИНН" value={organizer.organization_inn} mono />
        <DataRow label="КПП" value={organizer.organization_kpp} mono />
        <DataRow label="Код абонента" value={organizer.subscriber_code} mono />
      </dl>

      <div className="mt-4">
        <p className="eyebrow mb-2">Контакты</p>
        {contactsHidden ? (
          <p className="inline-flex items-center gap-2 text-sm italic text-muted-foreground">
            <EyeOff className="size-4" />
            Контакты скрыты организатором
          </p>
        ) : contacts.length === 0 ? (
          <EmptyNote>Контакты не указаны</EmptyNote>
        ) : (
          <ul className="space-y-2">
            {contacts.map((contact, index) => (
              <ContactRow key={contact.uid ?? index} contact={contact} />
            ))}
          </ul>
        )}
      </div>
    </DetailSection>
  )
}

function ContactRow({ contact }: { contact: Contact }) {
  return (
    <li className="text-sm">
      <p className="font-medium">{contact.name ?? 'Без имени'}</p>
      <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
        {contact.phone ? (
          <span className="num inline-flex items-center gap-1.5">
            <Phone className="size-3" />
            {contact.phone}
          </span>
        ) : null}
        {contact.work_phone ? <span className="num">{contact.work_phone}</span> : null}
        {contact.email ? (
          <span className="inline-flex items-center gap-1.5">
            <Mail className="size-3" />
            {contact.email}
          </span>
        ) : null}
      </div>
    </li>
  )
}
