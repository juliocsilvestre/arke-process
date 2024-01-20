import { queryClient } from '@/routes'
import { useMutation } from '@tanstack/react-query'
import { api } from '../api'
import { indexCompaniesQueryOptions } from '../queries/companies.query'

export const useCreateCompany = () => {
  const mutation = useMutation({
    mutationFn: (company: { name: string; cnpj: string }) => {
      return api.post('/companies', company)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(indexCompaniesQueryOptions)
    },
  })

  return { ...mutation }
}


export const useDeleteCompany = () => {
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return api.delete(`/companies/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(indexCompaniesQueryOptions)
    },
  })

  return { ...mutation }
}