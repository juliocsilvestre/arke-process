import { RootRoute, Route, Router } from '@tanstack/react-router'
import { AuthLayout } from './layouts/auth.layout'
import { Auth } from './components/Test'
import { DashboardLayout } from './layouts/dashboard.layout'
import { TestDashboard } from './components/TestDashboard'

const rootRoute = new RootRoute()

// const layoutRoute = new Route({
//   getParentRoute: () => rootRoute,
//   id: 'layout',
// })

const authLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  component: AuthLayout,
  id: 'auth-layout',
})

const authRoute = new Route({
  getParentRoute: () => authLayoutRoute,
  component: Auth,
  path: '/',
})

const dashboardLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  component: DashboardLayout,
  id: 'dashboard-layout',
})

const dashboardRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  component: TestDashboard,
  path: '/dashboard',
})

const routeConfig = rootRoute.addChildren([
  authLayoutRoute.addChildren([authRoute]),
  dashboardLayoutRoute.addChildren([dashboardRoute]),
])

// const indexRoute = new Route({ getParentRoute: () => rootRoute, path: '/', component: Test})

const routeTree = routeConfig

export const router = new Router({ routeTree, defaultPreload: 'intent', defaultStaleTime: 5000 })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
