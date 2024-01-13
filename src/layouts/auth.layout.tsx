import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const AuthLayout = () => {
  return (
    <main className="h-svh w-dvw bg-primary text-purple">
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </main>
  )
}
