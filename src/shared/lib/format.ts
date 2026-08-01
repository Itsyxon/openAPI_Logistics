const dateOnly = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short' })
const dateFull = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})
const dateTime = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})
const money = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
const money2 = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 })

export function formatDate(iso: string) {
  return dateOnly.format(new Date(iso))
}

export function formatDateFull(iso: string) {
  return dateFull.format(new Date(iso))
}

export function formatDateTime(iso: string) {
  return dateTime.format(new Date(iso))
}

export function formatMoney(value: number | null | undefined) {
  if (value === null || value === undefined) return '—'
  return money.format(value)
}

export function formatMoneyPrecise(value: number | null | undefined) {
  if (value === null || value === undefined) return '—'
  return money2.format(value)
}

export function formatNumber(value: number | null | undefined, suffix = '') {
  if (value === null || value === undefined) return '—'
  return `${money2.format(value)}${suffix}`
}

export function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

export function timeLeft(stopIso: string, now = Date.now()) {
  const diff = new Date(stopIso).getTime() - now
  if (diff <= 0) return null

  const totalMinutes = Math.floor(diff / 60_000)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) return `${days} ${plural(days, 'день', 'дня', 'дней')} ${hours} ч`
  if (hours > 0) return `${hours} ч ${String(minutes).padStart(2, '0')} мин`
  return `${minutes} мин`
}

export function windowProgress(startIso: string, stopIso: string, now = Date.now()) {
  const start = new Date(startIso).getTime()
  const stop = new Date(stopIso).getTime()
  if (!Number.isFinite(start) || !Number.isFinite(stop) || stop <= start) return 0
  return Math.min(1, Math.max(0, (now - start) / (stop - start)))
}
