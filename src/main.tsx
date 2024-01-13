import { RouterProvider } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'

import '@styles/tailwind.css'

import { router } from './routes'

// biome-ignore lint/style/noNonNullAssertion: This element will always exist.
const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(<RouterProvider router={router} />)
}
