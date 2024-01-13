import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const DashboardLayout = () => {
  return (
    <div className="bg-gradient-to-r from-green-700 to-lime-600 text-white">
      <aside className="bg-gradient-to-r from-red-700 to-lime-600 text-white">
        <h1>Dashboard</h1>
      </aside>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
