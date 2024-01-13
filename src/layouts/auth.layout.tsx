import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const AuthLayout = () => {
  return (
    <div className="bg-gradient-to-r from-green-700 to-lime-600 text-white">
      <h1>Auth</h1>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
