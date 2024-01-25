import { queryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { api } from '../api'
import { Pagination } from '@/utils/types'

export const useGetAddresByCep = (cep: string) => {
  const query = useQuery({
    queryKey: ['address', cep],
    queryFn: async () => {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      return data
    },
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
  })

  // Combine the base path with query parameters
  const url = `${path}?${queryParams.toString()}`

  // Perform the API request
  return await api.get(url)
}

export const indexWorkersQueryOptions = (pagination?: Pagination) =>
  queryOptions({
    queryKey: ['workers', pagination],
    queryFn: () => getWorkers(pagination),
  })

export const useIndexWorkers = (pagination?: Pagination) => {
  return useQuery(indexWorkersQueryOptions(pagination))
}

export const getSingleWorkerQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['worker', 'single', id],
    queryFn: () => getSingleWorker(id),
  })

export const getSingleWorker = async (id: string) => {
  return await api.get(`/workers/${id}`)
}

export const useSingleWorker = (id: string) => {
  const worker = useQuery(getSingleWorkerQueryOptions(id))

  return { worker }
}
