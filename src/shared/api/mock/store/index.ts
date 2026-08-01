import type { AuctionListRequest } from '@/shared/api/types/auction-list'
import type { AuctionShowResponse } from '@/shared/api/types/auction-show'
import { createSeedRecords } from '../fixtures'
import type { AuctionRecord } from '../record'
import { createBet, recompute, resetBetSequence, seedRivalBets } from './bets'
import { listAuctions } from './query'

let records: AuctionRecord[] = []

export function resetStore() {
  resetBetSequence()
  records = createSeedRecords()

  seedRivalBets(records[0], [118500, 119000])
  seedRivalBets(records[1], [70000])
  seedRivalBets(records[3], [48000])
  seedRivalBets(records[5], [172000, 173500])
  seedRivalBets(records[7], [56000])

  const cancelled = createBet(records[0], 121000, {
    subscriber_id: 33,
    organization_id: 55,
    organization_inn: '7701600011',
    organization_name: 'ООО Резерв',
    contact_name: 'Егоров Егор',
    contact_phone: '+77777777779',
  })
  cancelled.is_rejected = true
  cancelled.cancel_reason = 'Ставка отозвана перевозчиком'
  records[0].bets.push(cancelled)

  records.forEach(recompute)
}

export function findRecord(auctionUuid: string) {
  return records.find((record) => record.show.main.order_uid === auctionUuid) ?? null
}

export function getAuctionFromStore(auctionUuid: string): AuctionShowResponse | null {
  return findRecord(auctionUuid)?.show ?? null
}

export function listAuctionsFromStore(filters: AuctionListRequest) {
  return listAuctions(records, filters)
}

export { countParticipants, listBetsFromStore, placeBet, validateBet } from './bets'
export { toListItem } from './projection'

resetStore()
