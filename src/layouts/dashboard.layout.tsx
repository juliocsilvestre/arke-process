import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const DashboardLayout = () => {
  return (
    <div className="flex">
      <aside className="bg-black text-white w-40 flex justify-center items-center">
        <h1>Dashboard</h1>
      </aside>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
