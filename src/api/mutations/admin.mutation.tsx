import { queryClient } from '@/routes'
import { useMutation } from '@tanstack/react-query'
import { api } from '../api'
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

export const useUpdateAdmin = () => {
  const mutation = useMutation({
    mutationFn: (adminData: { name?: string; email?: string; cpf?: string; password?: string; id: string }) => {
      return api.put(`/admins/${adminData.id}`, adminData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(indexAdminsQueryOption({ page: '1', q: '' }))
    },
  })

  return { ...mutation }
}

export const useDeleteAdmin = () => {
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return api.delete(`/admins/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(indexAdminsQueryOption({ page: '1', q: '' }))
    },
  })

  return { ...mutation }
}
