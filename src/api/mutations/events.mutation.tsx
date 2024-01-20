import { CreateEventBody } from '@/pages/Events.defs'
import { queryClient } from '@/routes'
import { useMutation } from '@tanstack/react-query'
import { eachDayOfInterval } from 'date-fns'
import { api } from '../api'
import { indexEventsQueryOption } from '../queries/events.query'

export const useCreateEvent = () => {
  const mutation = useMutation({
    mutationFn: (event: CreateEventBody) => {
      const arrayOfDates = eachDayOfInterval({
        start: event.dates.from,
        end: event.dates.to,
      })

      return api.post('/events', { ...event, dates: arrayOfDates })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(indexEventsQueryOption)
    },
  })

  return { ...mutation }
}
