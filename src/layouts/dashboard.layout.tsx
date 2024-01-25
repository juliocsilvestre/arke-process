import { Sidebar } from '@/components/Sidebar'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const DashboardLayout = () => (
  <main className="flex">
    <Sidebar>
      <div className="w-screen lg:pl-72">
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </Sidebar>
    <TanStackRouterDevtools position="bottom-right" />
  </main>
)
