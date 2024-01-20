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
