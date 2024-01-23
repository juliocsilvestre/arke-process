import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '../api'
import { Pagination } from '@/utils/types'

export const getCompanies = async (pagination?: Pagination) => {
  // Construct the base path with optional query parameters
  const path = '/companies'
  const queryParams = new URLSearchParams({
    q: pagination?.q || '', // Use empty string if q is not provided
    page: pagination?.page || '1', // Use empty string if page is not provided
  })

  // Combine the base path with query parameters
  const url = `${path}?${queryParams.toString()}`

  // Perform the API request
  return await api.get(url)
}

export const indexCompaniesQueryOptions = (pagination?: Pagination) =>
  queryOptions({
    queryKey: ['companies', pagination],
    queryFn: () => getCompanies(pagination),
  })

export const useIndexCompanies = (pagination?: Pagination) => {
  return useQuery(indexCompaniesQueryOptions(pagination))
}
