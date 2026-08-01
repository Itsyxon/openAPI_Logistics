import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type VatMode = 'with' | 'without'

interface BetsViewState {
  vatMode: VatMode
  showCancelled: boolean
  setVatMode: (mode: VatMode) => void
  toggleCancelled: () => void
}

export const useBetsViewStore = create<BetsViewState>()(
  persist(
    (set) => ({
      vatMode: 'with',
      showCancelled: false,
      setVatMode: (vatMode) => set({ vatMode }),
      toggleCancelled: () => set((state) => ({ showCancelled: !state.showCancelled })),
    }),
    { name: 'auctions:bets-view' },
  ),
)
