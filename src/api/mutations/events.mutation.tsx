import { CreateEventBody } from '@/pages/Events.defs'
import { useMutation } from '@tanstack/react-query'
import { eachDayOfInterval } from 'date-fns'
import { api } from '../api'

export const useCreateEvent = () => {
  const mutation = useMutation({
    mutationFn: (event: CreateEventBody) => {
      const arrayOfDates = eachDayOfInterval({
        start: event.dates.from,
        end: event.dates.to,
      })

      return api.post('/events', { ...event, dates: arrayOfDates })
    },
  })

  return { ...mutation }
}
