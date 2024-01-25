import { DataTable } from '@/components/ui/DataTable'
import { useDebounce } from '@uidotdev/usehooks'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { useParams, useRouter, useSearch } from '@tanstack/react-router'
import { EventDay, workersByEventDayColumns } from './EventDetails.defs'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { PlusIcon } from 'lucide-react'
import { ClockIcon } from '@heroicons/react/24/outline'
import { getSingleEvent, indexWorkersPerEventDayQueryOptions } from '@/api/queries/events.query'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { AttachWorkerToEventDaySlideover } from '@/components/AttachUserToEventDaySlideover'

export const EventDetailsPage = () => {
  const { navigate } = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [queryString, setQueryString] = useState('')
  const debouncedSearchTerm = useDebounce(queryString, 1000)
  const { day: eventDayId, id: eventId } = useParams({ from: '/dashboard-layout/dashboard/eventos/$id/dias/$day' })
  const search = useSearch({ from: '/dashboard-layout/dashboard/eventos/$id/dias/$day' }) as {
    q: string
    page: string
  }
  const formatEventPeriod = (day: string) => {
    const date = new Date(day)
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: '2-digit' })
  }

  const { data: event } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getSingleEvent(eventId),
    refetchOnWindowFocus: false,
  })

  const startDate = event?.data.days?.[0].date
  const endDate = event?.data.days?.at?.(-1)?.date

  const options = indexWorkersPerEventDayQueryOptions({ eventDayId, eventId, page: search.page, q: search.q })
  const { data: workersData } = useSuspenseQuery(options)

  const workers = workersData?.data.workers.data

  useEffect(() => {
    navigate({
      to: '/dashboard/eventos/$id/dias/$day',
      params: { id: eventId, day: eventDayId },
      search: { page: '1', q: debouncedSearchTerm },
    })
  }, [debouncedSearchTerm])

  return (
    <section className="bg-gray-50 min-h-screen overflow-y-auto p-4 md:p-10">
      <div className="mx-auto flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-4xl text-primary font-bold">{event?.data.name}</h1>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => {
              navigate({
                to: '/dashboard/eventos/$id/dias/$day/relogio',
                params: { id: eventId, day: activeDayId },
              })
            }}
            disabled={!eventDayId}
          >
            <ClockIcon className="h-6 w-6" aria-hidden="true" />
            Registro de Presença
          </Button>

          <Button variant="default" size="sm" className="mt-4" onClick={() => setIsOpen(true)} disabled={!eventDayId}>
            <PlusIcon className="h-6 w-6" aria-hidden="true" />
            Adicionar funcionários
          </Button>
        </div>
      </div>
      <div className="details mt-[30px]">
        <p className="text-gray-600 text-sm">
          <span className="font-bold">Começo:</span> {formatEventPeriod(startDate as unknown as string)}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-bold">Fim:</span> {formatEventPeriod(endDate as unknown as string)}
        </p>
      </div>
      <div className="mt-[30px]">
        <Tabs value={eventDayId}>
          <TabsList>
            {event?.data.days.map((day: EventDay, index: number) => (
              <TabsTrigger
                value={day.id}
                key={day.id}
                onClick={() => {
                  navigate({
                    to: '/dashboard/eventos/$id/dias/$day',
                    params: { id: eventId, day: day.id },
                    search: { page: '1', q: '' },
                  })
                }}
              >{`Dia ${index + 1}`}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <DataTable
        columns={workersByEventDayColumns}
        data={workers ?? []}
        count={workersData?.data.workers_count}
        currentPage={workersData?.data.workers.meta.current_page}
        pages={workersData?.data.workers.meta.last_page}
        onQueryChange={(q) => {
          setQueryString(q)
        }}
      />

      <AttachWorkerToEventDaySlideover
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        eventId={eventId}
        eventDayId={eventDayId}
      />
    </section>
  )
}
