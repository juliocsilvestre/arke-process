import { RouterProvider } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'

import '@styles/globals.css'
import '@styles/tailwind.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './routes'

// biome-ignore lint/style/noNonNullAssertion: This element will always exist.
const rootElement = document.getElementById('app')!

export const queryClient = new QueryClient()

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}
