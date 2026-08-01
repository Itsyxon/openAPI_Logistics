import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router'
import {
  validateAuctionsSearch,
  type AuctionsSearch,
} from '@/features/filter-auctions'
import { AuctionsPage } from '@/pages/auctions'
import { AuctionDetailPage, validateDetailSearch, type DetailSearch } from '@/pages/auction-detail'
import { AuctionBidPage } from '@/pages/auction-bid'
import { RootLayout } from './root-layout'
import { NotFound } from './not-found'

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/auctions' })
  },
})

const auctionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions',
  validateSearch: (input: Partial<AuctionsSearch>): AuctionsSearch =>
    validateAuctionsSearch(input),
  component: AuctionsPage,
})

const auctionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions/$auctionUuid',
  validateSearch: (input: Partial<DetailSearch>): DetailSearch =>
    validateDetailSearch(input),
  component: AuctionDetailPage,
})

const auctionBidRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions/$auctionUuid/bid',
  component: AuctionBidPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  auctionsRoute,
  auctionDetailRoute,
  auctionBidRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
