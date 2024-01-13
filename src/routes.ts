import { RootRoute, Route, Router } from '@tanstack/react-router'
import { AuthLayout } from './layouts/auth.layout'
import { Auth } from './components/Test'
import { DashboardLayout } from './layouts/dashboard.layout'
import { TestDashboard } from './components/TestDashboard'

const rootRoute = new RootRoute()

const authLayout = new Route({
  getParentRoute: () => rootRoute,
  component: AuthLayout,
  id: 'auth-layout',
})

const authRoute = new Route({
  getParentRoute: () => authLayout,
  component: Auth,
  path: '/',
})

const dashboardLayout = new Route({
  getParentRoute: () => rootRoute,
  component: DashboardLayout,
  id: 'dashboard-layout',
})

const dashboardRoute = new Route({
  getParentRoute: () => dashboardLayout,
  component: TestDashboard,
  path: '/dashboard',
})

const routeTree = rootRoute.addChildren([
  authLayout.addChildren([authRoute]),
  dashboardLayout.addChildren([dashboardRoute]),
])

export const router = new Router({ routeTree, defaultPreload: 'intent', defaultStaleTime: 5000 })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
