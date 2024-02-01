import { infiniteQueryOptions, queryOptions, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { Pagination } from '@/utils/types'
import { api } from '../api'

export const useGetAddresByCep = (cep: string) => {
  const query = useQuery({
    queryKey: ['address', cep],
    queryFn: async () => {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      return data
    },
    refetchOnWindowFocus: false,
    enabled: cep.length === 9,
  })

  return { ...query }
}

export const getWorkers = async (pagination?: Pagination) => {
  // Construct the base path with optional query parameters
  const path = '/workers'
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

export const infiniteWorkersQueryOptions = (isComboboxOpen: boolean, pagination?: Pagination) => {
  return infiniteQueryOptions({
    queryKey: ['infinite-workers', pagination],
    queryFn: async () => await getWorkers(pagination),
    initialPageParam: 1,
    enabled: isComboboxOpen,
    select: (data) => {
      return {
        workers: [...data.pages[0].data.workers.data],
        currentPage: data.pages[0].data.workers.meta.current_page,
        nextPage: data.pages[0].data.workers.meta.next_page_url,
        lastPage: data.pages[0].data.workers.meta.last_page,
      }
    },
    getNextPageParam: (nextPage) => {
      return nextPage.data.workers.meta.next_page_url
        ? nextPage.data.workers.meta.next_page_url.split('/page=')[1]
        : null
    },
    getPreviousPageParam: (previousPage) => {
      return previousPage.data.workers.meta.previous_page
        ? previousPage.data.workers.meta.previous_page.split('/page=')[1]
        : null
    },
    refetchOnWindowFocus: false,
  })
}

export const useInfiniteWorkers = (isComboboxOpen: boolean, pagination?: Pagination) => {
  return useInfiniteQuery(infiniteWorkersQueryOptions(isComboboxOpen, pagination))
}

export const indexWorkersQueryOptions = (pagination?: Pagination) =>
  queryOptions({
    queryKey: ['workers', pagination],
    queryFn: () => getWorkers(pagination),
    refetchOnWindowFocus: false,
  })

export const useIndexWorkers = (pagination?: Pagination) => {
  return useQuery(indexWorkersQueryOptions(pagination))
}

export const getSingleWorkerQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['worker', 'single', id],
    queryFn: () => getSingleWorker(id),
    enabled: !!id,
  })

export const getSingleWorker = async (id: string) => {
  return await api.get(`/workers/${id}`)
}

export const useSingleWorker = (id: string) => {
  const worker = useQuery(getSingleWorkerQueryOptions(id))

  return { worker }
}

export const useGetQRCode = (workerId: string) => {
  const query = useQuery({
    queryKey: ['worker', 'qrcode', workerId],
    queryFn: async () => {
      const { data } = await api.get(`/workers/${workerId}/qrcode`)
      return data
    },
    refetchOnWindowFocus: false,
  })

  return { ...query }
}
