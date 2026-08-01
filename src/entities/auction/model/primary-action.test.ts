import { describe, expect, it } from 'vitest'
import { resolvePrimaryAction } from './primary-action'

const OPEN = { canSetBet: true, hasBet: false, hideBetsHistory: false, status: 'Auction' } as const

describe('выбор основного действия карточки', () => {
  it('предлагает сделать ставку, когда торги открыты и своей ставки нет', () => {
    expect(resolvePrimaryAction(OPEN)).toEqual({
      kind: 'bid',
      label: 'Сделать ставку',
      disabled: false,
    })
  })

  it('предлагает изменить ставку, когда своя ставка уже есть', () => {
    expect(resolvePrimaryAction({ ...OPEN, hasBet: true })).toMatchObject({
      kind: 'edit-bid',
      label: 'Изменить ставку',
    })
  })

  it('ставка важнее истории: can_set_bet перевешивает скрытую историю', () => {
    expect(resolvePrimaryAction({ ...OPEN, hideBetsHistory: true }).kind).toBe('bid')
  })

  it('ведёт к ставкам, когда торговать нельзя, но история открыта', () => {
    expect(
      resolvePrimaryAction({ ...OPEN, canSetBet: false, status: 'DeterminateWinner' }),
    ).toMatchObject({ kind: 'view-bets', disabled: false })
  })

  it('показывает завершённые торги как просмотр ставок', () => {
    expect(
      resolvePrimaryAction({ ...OPEN, canSetBet: false, status: 'Finished' }).kind,
    ).toBe('view-bets')
  })

  it('блокирует действие, когда торговать нельзя и история скрыта', () => {
    expect(
      resolvePrimaryAction({
        canSetBet: false,
        hasBet: false,
        hideBetsHistory: true,
        status: 'Stopped',
      }),
    ).toEqual({ kind: 'unavailable', label: 'Ставки недоступны', disabled: true })
  })

  it('блокирует действие на этапе планирования без своей ставки', () => {
    expect(
      resolvePrimaryAction({
        canSetBet: false,
        hasBet: false,
        hideBetsHistory: false,
        status: 'Planning',
      }).disabled,
    ).toBe(true)
  })

  it('даёт посмотреть ставки, если своя ставка есть даже на остановленных торгах', () => {
    expect(
      resolvePrimaryAction({
        canSetBet: false,
        hasBet: true,
        hideBetsHistory: false,
        status: 'Stopped',
      }).kind,
    ).toBe('view-bets')
  })
})
