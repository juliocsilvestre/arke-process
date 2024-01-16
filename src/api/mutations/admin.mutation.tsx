import { useMutation } from '@tanstack/react-query'
import { api } from '../api'

export const useCreateAdmin = () => {
  const mutation = useMutation({
    mutationFn: (adminData: { name: string; email: string; cpf: string; password: string }) => {
      return api.post('/admins', adminData)
    },
  })

  return { ...mutation }
}
