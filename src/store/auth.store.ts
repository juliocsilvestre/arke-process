import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface User {
  name: string
  cpf: string
}

interface AuthState {
  user: User
  isAuthenticated: boolean
  setUser: (user: User) => void
  removeUser: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: {
          name: '',
          cpf: '',
        },
        isAuthenticated: false,
        setUser: (user: User) => set({ user, isAuthenticated: true }),
        removeUser: () => set({ user: { name: '', cpf: '' }, isAuthenticated: false }),
      }),
      {
        name: 'auth-store',
      },
    ),
  ),
)

export const setUser = useAuthStore.getState().setUser
export const removeUser = useAuthStore.getState().removeUser
