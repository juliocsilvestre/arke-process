import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '../api'

export const getCompanies = async () => await api.get('/companies')
export const indexCompaniesQueryOptions = queryOptions({
  queryKey: ['companies'],
  queryFn: getCompanies,
})
export const useIndexCompanies = () => {
  const companies = useQuery(indexCompaniesQueryOptions)

  return { companies }
}
