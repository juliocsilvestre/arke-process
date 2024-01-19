import { useMutation } from '@tanstack/react-query'
import { api } from '../api'

export const useCreateCompany = () => {
  const mutation = useMutation({
    mutationFn: (company: { name: string; cnpj: string }) => {
      return api.post('/companies', company)
    },
  })

  return { ...mutation }
}
