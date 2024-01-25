import { NotFoundRoute, Route, Router, redirect, rootRouteWithContext } from '@tanstack/react-router'

import { AuthLayout } from '@layouts/auth.layout'
import { DashboardLayout } from '@layouts/dashboard.layout'

import { QueryClient } from '@tanstack/react-query'
import { indexCompaniesQueryOptions } from './api/queries/companies.query'
import { indexWorkersQueryOptions } from './api/queries/workers.query'
import { indexEventsQueryOption, indexWorkersPerEventDayQueryOptions } from './api/queries/events.query'
import { Loading } from './components/ui/Loading'
import { PublicLayout } from './layouts/public.layout'
import { NotFoundPage } from './pages/404.page'
import { AdminsPage } from './pages/Admins.page'
import { CompaniesPage } from './pages/Companies.page'
import { EventsPage } from './pages/Events.page'
import { ReportsPage } from './pages/Reports.page'
import { SignIn } from './pages/SignIn.page'
import { WorkersPage } from './pages/Workers.page'
import { useAuthStore } from './store/auth.store'
import { EventDetailsPage } from './pages/EventDetails.page'
import { indexAdminsQueryOption } from './api/queries/admin.query'
import { ClockPage } from './pages/Clock.page'

const rootRoute = rootRouteWithContext<{
  queryClient: QueryClient
}>()()

const authLayout = new Route({
  id: 'auth-layout',
  getParentRoute: () => rootRoute,
  component: AuthLayout,
})

const dashboardLayout = new Route({
  id: 'dashboard-layout',
  getParentRoute: () => rootRoute,
})

const publicLayout = new Route({
  id: 'public-layout',
  getParentRoute: () => rootRoute,
  component: PublicLayout,
})

const authRoute = new Route({
  getParentRoute: () => authLayout,
  component: SignIn,
  path: '/',
  pendingComponent: Loading,
  beforeLoad: async () => {
    const isUserAuthenticated = useAuthStore.getState().isAuthenticated

    if (isUserAuthenticated) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
})

const dashboardRoute = new Route({
  getParentRoute: () => dashboardLayout,
  component: DashboardLayout,
  path: 'dashboard',
  beforeLoad: async () => {
    const isUserAuthenticated = useAuthStore.getState().isAuthenticated

    if (!isUserAuthenticated) {
      throw redirect({
        to: '/',
      })
    }
  },
})

const adminsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  component: AdminsPage,
  path: 'administradores',
  // TODO: force loading or fetch lists...
  validateSearch: (search: { q: string; page: number }): { q: string; page: string } => {
    return {
      q: search.q ?? '',
      page: String(search.page || 1),
    }
  },
  loaderDeps(opts) {
    return { q: opts.search.q, page: opts.search.page }
  },

  loader: async ({ context: { queryClient }, deps: { page, q } }) => {
    const options = indexAdminsQueryOption({ page, q })
    return queryClient.ensureQueryData(options)
  },
})

const workersRoute = new Route({
  getParentRoute: () => dashboardRoute,
  component: WorkersPage,
  path: 'funcionarios',
  validateSearch: (search: { q: string; page: number }): { q: string; page: string } => {
    return {
      q: search.q ?? '',
      page: String(search.page || 1),
    }
  },
  loaderDeps(opts) {
    return { q: opts.search.q, page: opts.search.page }
  },

  loader: async ({ context: { queryClient }, deps: { page, q } }) => {
    const options = indexWorkersQueryOptions({ page, q })
    return queryClient.ensureQueryData(options)
  },
})

const companiesRoute = new Route({
  getParentRoute: () => dashboardRoute,
  component: CompaniesPage,
  path: 'fornecedores',
  validateSearch: (search: { q: string; page: number }): { q: string; page: string } => {
    return {
      q: search.q ?? '',
      page: String(search.page || 1),
    }
  },
  loaderDeps(opts) {
    return { q: opts.search.q, page: opts.search.page }
  },

  loader: async ({ context: { queryClient }, deps: { page, q } }) => {
    const options = indexCompaniesQueryOptions({ page, q })
    return queryClient.ensureQueryData(options)
  },
})

const eventsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'eventos',
})

const eventsPageRoute = new Route({
  getParentRoute: () => eventsRoute,
  path: '/',
  component: EventsPage,
  validateSearch: (search: { q: string; page: number }): { q: string; page: string } => {
    return {
      q: search.q ?? '',
      page: String(search.page || 1),
    }
  },
  loaderDeps(opts) {
    return { q: opts.search.q, page: opts.search.page }
  },

  loader: async ({ context: { queryClient }, deps: { page, q } }) => {
    const options = indexEventsQueryOption({ page, q })
    return queryClient.ensureQueryData(options)
  },
})

const eventDetailsRoute = new Route({
  getParentRoute: () => eventsRoute,
  path: '$id/dias/$day',
  component: EventDetailsPage,
  validateSearch: (search: { q: string; page: number }): { q: string; page: string } => {
    return {
      q: search.q ?? '',
      page: String(search.page || 1),
    }
  },
  loaderDeps(opts) {
    return { q: opts.search.q, page: opts.search.page }
  },
  loader: async ({ context: { queryClient }, deps: { page, q }, params }) => {
    return queryClient.ensureQueryData(
      indexWorkersPerEventDayQueryOptions({ eventId: params.id, eventDayId: params.day, page, q }),
    )
  },
})

const eventDayClockRoute = new Route({
  getParentRoute: () => eventsRoute,
  component: ClockPage,
  path: '$id/dias/$day/relogio',
})

const reportsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  component: ReportsPage,
  path: 'relatorios',
})

const publicRoute = new Route({
  getParentRoute: () => publicLayout,
  // TODO: Create public component
  path: '/public',
})

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: NotFoundPage,
})

const routeTree = rootRoute.addChildren([
  authLayout.addChildren([authRoute]),
  dashboardLayout.addChildren([
    dashboardRoute.addChildren([
      adminsRoute,
      workersRoute,
      companiesRoute,
      eventsRoute.addChildren([eventsPageRoute, eventDetailsRoute, eventDayClockRoute]),
      reportsRoute,
    ]),
  ]),
  publicLayout.addChildren([publicRoute]),
])

export const queryClient = new QueryClient()

export const router = new Router({
  context: {
    queryClient,
  },
  routeTree,
  notFoundRoute,
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
