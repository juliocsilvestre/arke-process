import { useMutation } from '@tanstack/react-query'
import { api } from '../api'
import { queryClient } from '@/routes'
import { indexAdminsQueryOption } from '../queries/admin.query'

export const useCreateAdmin = () => {
  const mutation = useMutation({
    mutationFn: (adminData: { name: string; email: string; cpf: string; password: string }) => {
      return api.post('/admins', adminData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(indexAdminsQueryOption({ page: '1', q: '' }))
    },
  })

  return { ...mutation }
}
