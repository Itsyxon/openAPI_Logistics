import type { Docs, LoadingTypes } from '@/shared/api/types/auction-show'

const DASH = '—'

export function formatLoadingTypes(types: LoadingTypes) {
  const labels = [
    types.side && 'боковая',
    types.top && 'верхняя',
    types.rear && 'задняя',
    types.full && 'полная',
  ].filter(Boolean)

  return labels.length > 0 ? labels.join(', ') : DASH
}

export function formatDocs(docs: Docs) {
  const labels = [
    docs.tir && 'TIR',
    docs.cmr && 'CMR',
    docs.t1 && 'T1',
    docs.med && 'медкнижка',
  ].filter(Boolean)

  return labels.length > 0 ? labels.join(', ') : DASH
}

export function formatTemperature(from: number | null, to: number | null) {
  if (from === null && to === null) return DASH
  return `${from ?? DASH}…${to ?? DASH} °C`
}

export function yesNo(value: boolean) {
  return value ? 'Да' : 'Нет'
}
