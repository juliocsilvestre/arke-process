import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const AuthLayout = () => {
  return (
    <main className="h-svh w-dvw flex items-center justify-center bg-primary">
      <Outlet />
      {process.env.NODE_ENV !== 'production' && <TanStackRouterDevtools position="bottom-right" />}
    </main>
  )
}
