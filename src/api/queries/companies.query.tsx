import { Pagination } from '@/utils/types'
import { infiniteQueryOptions, queryOptions, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { api } from '../api'

export const getCompanies = async (pagination?: Pagination) => {
  // Construct the base path with optional query parameters
  const path = '/companies'
  const queryParams = new URLSearchParams({
    q: pagination?.q || '', // Use empty string if q is not provided
    page: pagination?.page || '1', // Use empty string if page is not provided
    limit: pagination?.limit || '10',
  })

  // Combine the base path with query parameters
  const url = `${path}?${queryParams.toString()}`

  // Perform the API request
  return await api.get(url)
}

export const infiniteCompaniesQueryOptions = (isComboboxOpen: boolean, pagination?: Pagination) => {
  return infiniteQueryOptions({
    queryKey: ['infinite-companies', pagination],
    queryFn: async () => await getCompanies(pagination),
    initialPageParam: 1,
    enabled: isComboboxOpen,
    select: (data) => {
      return {
        companies: [...data.pages[0].data.companies.data],
        currentPage: data.pages[0].data.companies.meta.current_page,
        nextPage: data.pages[0].data.companies.meta.next_page_url,
        lastPage: data.pages[0].data.companies.meta.last_page,
      }
    },
    getNextPageParam: (nextPage) => {
      return nextPage.data.companies.meta.next_page_url
        ? nextPage.data.companies.meta.next_page_url.split('/page=')[1]
        : null
    },
    getPreviousPageParam: (previousPage) => {
      return previousPage.data.companies.meta.previous_page
        ? previousPage.data.companies.meta.previous_page.split('/page=')[1]
        : null
    },
    refetchOnWindowFocus: false,
  })
}

export const useInfiniteCompanies = (isComboboxOpen: boolean, pagination?: Pagination) => {
  return useInfiniteQuery(infiniteCompaniesQueryOptions(isComboboxOpen, pagination))
}

export const indexCompaniesQueryOptions = (pagination?: Pagination) =>
  queryOptions({
    queryKey: ['companies', pagination],
    queryFn: () => getCompanies(pagination),
    refetchOnWindowFocus: false,
  })

export const useIndexCompanies = (pagination?: Pagination) => {
  return useQuery(indexCompaniesQueryOptions(pagination))
}
