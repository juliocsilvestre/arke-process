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
      queryClient.invalidateQueries(indexCompaniesQueryOptions({ page: '1', q: '' }))
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
      queryClient.invalidateQueries(indexCompaniesQueryOptions({ page: '1', q: '' }))
    },
  })

  return { ...mutation }
}

export const useUpdateCompany = () => {
  const mutation = useMutation({
    mutationFn: (company: { id:string; name: string; cnpj: string }) => {
      return api.put(`/companies/${company.id}`, { name: company.name, cnpj: company.cnpj })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(indexCompaniesQueryOptions({ page: '1', q: '' }))
    },
  })

  return { ...mutation }
}