import { Sidebar } from '@/components/Sidebar'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const DashboardLayout = () => {
  return (
    <div className="flex">
      {/* <aside className="bg-black text-white w-40 flex justify-center items-center">
        <h1>Dashboard</h1>
      </aside> */}
      <Sidebar />
      {/* <Outlet /> */}
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
