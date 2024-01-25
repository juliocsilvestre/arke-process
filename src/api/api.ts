import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'
import { toast } from 'sonner'
import { router } from '@/routes'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status || null

    if (status === 401) {
      console.warn(status)
      useAuthStore.getState().removeUser()
      router.navigate({ to: '/' })
      toast.info('Sua sessão expirou, faça login novamente.')
    }
    return Promise.reject(err)
  },
)
