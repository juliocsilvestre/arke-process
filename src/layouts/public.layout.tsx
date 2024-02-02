import { Footer } from '@/components/Footer'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const PublicLayout = (): JSX.Element => {
  return (
    <main className="flex">
      {/* TODO: Add public header */}
      <aside className="bg-black text-white w-40 flex justify-center items-center">
        <h1>Public</h1>
      </aside>
      <Outlet />
      {process.env.NODE_ENV !== 'production' && <TanStackRouterDevtools position="bottom-right" />}
      <Footer />
    </main>
  )
}
