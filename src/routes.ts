import { NotFoundRoute, Route, Router, redirect, rootRouteWithContext } from '@tanstack/react-router'

import { AuthLayout } from '@layouts/auth.layout'
import { DashboardLayout } from '@layouts/dashboard.layout'

import { QueryClient } from '@tanstack/react-query'
import { indexCompaniesQueryOptions } from './api/queries/companies.query'
import { indexWorkersQueryOption } from './api/queries/workers.query'
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
  loader: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1200))
  },
  pendingComponent: Loading,
})

const workersRoute = new Route({
  getParentRoute: () => dashboardRoute,
  component: WorkersPage,
  path: 'funcionarios',
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(indexCompaniesQueryOptions)
    queryClient.ensureQueryData(indexWorkersQueryOption)
  },
})

const companiesRoute = new Route({
  getParentRoute: () => dashboardRoute,
  component: CompaniesPage,
  path: 'fornecedores',
})

const eventsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  component: EventsPage,
  path: 'eventos',
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
    dashboardRoute.addChildren([adminsRoute, workersRoute, companiesRoute, eventsRoute, reportsRoute]),
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
