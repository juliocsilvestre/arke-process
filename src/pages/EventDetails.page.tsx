import { getSingleEvent } from '@/api/queries/events.query'
import { DataTable } from '@/components/ui/DataTable'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouteContext } from '@tanstack/react-router'
import { workersByEventDayColumns } from './EventDetails.defs'

export const EventDetailsPage = () => {
  const eventId = useParams({
    from: '/dashboard-layout/dashboard/eventos/$id',
    select: (params) => params.id,
  })

  const formatEventPeriod = (day: string) => {
    const date = new Date(day)
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  const routerContext = useRouteContext({
    from: '/dashboard-layout/dashboard/eventos/$id',
  })

  const { data: event } = useQuery({ queryKey: ['event', eventId], queryFn: () => getSingleEvent(eventId) })

  const startDate = event?.data.days[0].date
  const endDate = event?.data.days.at(-1).date

  return (
    <section className="bg-gray-50 min-h-screen overflow-y-auto p-4 md:p-10">
      <div className="mx-auto flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-4xl text-primary font-bold">{event?.data.name}</h1>
      </div>
      <div className="details mt-[30px]">
        <p className="text-gray-600 text-sm">
          <span className="font-bold">Começo:</span> {formatEventPeriod(startDate)}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-bold">Fim:</span> {formatEventPeriod(endDate)}
        </p>
      </div>
      <div className="mt-[30px]">
        <Tabs>
          <TabsList>
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {event?.data.days.map((day: any, index: number) => (
              <TabsTrigger value={day.id} key={day.id}>{`Dia ${index + 1}`}</TabsTrigger>
            ))}
          </TabsList>
          {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
          {event?.data.days.map((day: any) => (
            <TabsContent value={day.id} key={day.id}>
              <TabsList>
                <TabsTrigger value={`working-${day.id}`} key={`working-${day.id}`}>
                  Trabalhando
                </TabsTrigger>
                <TabsTrigger value={`assign-${day.id}`} key={`assign-${day.id}`}>
                  Adicionar
                </TabsTrigger>
              </TabsList>
            </TabsContent>
          ))}
          {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
          {event?.data.days.map((day: any) => (
            <div key={`content-${day.id}`}>
              <TabsContent value={`working-${day.id}`} key={`working-${day.id}`}>
                <DataTable columns={workersByEventDayColumns} data={[]} count={0} />
              </TabsContent>
              <TabsContent value={`assign-${day.id}`} key={`assign-${day.id}`}>
                <p>Adicionar</p>
              </TabsContent>
            </div>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
