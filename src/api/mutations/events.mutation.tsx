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
      queryClient.invalidateQueries(indexEventsQueryOption({ page: '1', q: '' }))
    },
  })

  return { ...mutation }
}

export const useAttachWorkerToAnEventDay = () => {
  const mutation = useMutation({
    mutationFn: (assignement: { eventId: string; workers_id: string[]; event_day_id: string }) => {
      return api.post(`/events/${assignement.eventId}/attach`, {
        workers_id: assignement.workers_id,
        event_day_id: assignement.event_day_id,
      })
    },
  })

  return { ...mutation }
}

export const useClockWorkerOnEventDay = () => {
  const mutation = useMutation({
    mutationFn: (assignement: { event_day_id: string; worker_id: string }) => {
      return api.post('/workers/clocks', {
        event_day_id: assignement.event_day_id,
        worker_id: assignement.worker_id,
      })
    },
  })

  return { ...mutation }
}
