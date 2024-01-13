import { RootRoute, Route, Router } from '@tanstack/react-router'
import { AuthLayout } from './layouts/auth.layout'
import { Test } from './components/Test'

const rootRoute = new RootRoute({
  component: AuthLayout,
})

const indexRoute = new Route({ getParentRoute: () => rootRoute, path: '/', component: Test})

const routeTree = rootRoute.addChildren([indexRoute])

export const router = new Router({ routeTree, defaultPreload: 'intent', defaultStaleTime: 5000 })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

