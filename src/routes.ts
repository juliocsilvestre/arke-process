import { RootRoute, Route, Router } from '@tanstack/react-router'

import { AuthLayout } from '@layouts/auth.layout'
import { DashboardLayout } from '@layouts/dashboard.layout'

import { Auth } from '@components/Test'
import { TestDashboard } from '@components/TestDashboard'
import { PublicLayout } from './layouts/public.layout'

const rootRoute = new RootRoute()

const authLayout = new Route({
  id: 'auth-layout',
  getParentRoute: () => rootRoute,
  component: AuthLayout,
})

const dashboardLayout = new Route({
  id: 'dashboard-layout',
  getParentRoute: () => rootRoute,
  component: DashboardLayout,
})

const publicLayout = new Route({
  id: 'public-layout',
  getParentRoute: () => rootRoute,
  component: PublicLayout,
})

const authRoute = new Route({
  getParentRoute: () => authLayout,
  component: Auth,
  path: '/',
})

const dashboardRoute = new Route({
  getParentRoute: () => dashboardLayout,
  component: TestDashboard,
  path: '/dashboard',
})

const publicRoute = new Route({
  getParentRoute: () => publicLayout,
  component: TestDashboard,
  path: '/public',
})

const routeTree = rootRoute.addChildren([
  authLayout.addChildren([authRoute]),
  dashboardLayout.addChildren([dashboardRoute]),
  publicLayout.addChildren([publicRoute]),
])

export const router = new Router({ routeTree, defaultPreload: 'intent', defaultStaleTime: 5000 })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
