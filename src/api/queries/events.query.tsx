import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '../api'
import { Pagination } from '@/utils/types'

export const getEvents = async (pagination?: Pagination) => {
  // Construct the base path with optional query parameters
  const path = '/events'
  const queryParams = new URLSearchParams({
    q: pagination?.q || '', // Use empty string if q is not provided
    page: pagination?.page || '1', // Use empty string if page is not provided
  })

  // Combine the base path with query parameters
  const url = `${path}?${queryParams.toString()}`

  // Perform the API request
  return await api.get(url)
}

export const indexEventsQueryOption = (pagination?: Pagination) =>
  queryOptions({
    queryKey: ['events', pagination],
    queryFn: () => getEvents(pagination),
    refetchOnWindowFocus: false,
  })

export const useIndexEvents = (pagination?: Pagination) => {
  return useQuery(indexEventsQueryOption(pagination))
}

export const getSingleEvent = async (id: string) => {
  return await api.get(`/events/${id}`)
}

export const useSingleEvent = (id: string) => {
  const event = useQuery({
    queryKey: ['eventDetail', id],
    queryFn: () => getSingleEvent(id),
    refetchOnWindowFocus: false,
  })

  return { event }
}
