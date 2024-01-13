import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const AuthLayout = () => {
  return (
    <div className="bg-white text-purple">
      <h1>Auth</h1>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
