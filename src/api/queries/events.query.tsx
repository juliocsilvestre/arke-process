import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '../api'

export const getEvents = async () => await api.get('/events')
export const indexEventsQueryOption = queryOptions({
  queryKey: ['events'],
  queryFn: getEvents,
})
export const useIndexEvents = () => {
  const events = useQuery(indexEventsQueryOption)

  return { events }
}

export const getSingleEvent = async (id: string) => {
  return await api.get(`/events/${id}`)
}

export const useSingleEvent = (id: string) => {
  const event = useQuery({ queryKey: ['eventDetail', id], queryFn: () => getSingleEvent(id) })

  return { event }
}
