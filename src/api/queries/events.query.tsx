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
  const event = useQuery({ queryKey: ['eventDetail', id], queryFn: () => getSingleEvent(id) })

  return { event }
}

export const getWorkersPerEventDay = async ({
  eventDayId,
  eventId,
  page,
  q,
}: { eventId: string; eventDayId: string; page?: string; q?: string }) => {
  // Construct the base path with optional query parameters
  const path = `/events/${eventId}/days/${eventDayId}/workers`
  const queryParams = new URLSearchParams({
    q: q || '', // Use empty string if q is not provided
    page: page || '1', // Use empty string if page is not provided
  })

  // Combine the base path with query parameters
  const url = `${path}?${queryParams.toString()}`

  // Perform the API request
  return await api.get(url)
}

export const indexWorkersPerEventDayQueryOptions = (props: {
  eventId: string
  eventDayId: string
  page?: string
  q?: string
}) =>
  queryOptions({
    queryKey: ['workersPerEventDay', props],
    queryFn: () => getWorkersPerEventDay(props),
    refetchOnWindowFocus: false,
  })

export const useIndexWorkersPerEventDayQuery = (props: {
  eventId: string
  eventDayId: string
  pagination?: Pagination
}) => {
  return useQuery(indexWorkersPerEventDayQueryOptions(props))
}
