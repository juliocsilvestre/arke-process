import { getSingleEvent } from '@/api/queries/events.query'
import { DataTable } from '@/components/ui/DataTable'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouteContext, useRouter } from '@tanstack/react-router'
import {
  AttachWorkerToEventDayBody,
  AttachWorkerToEventDayKeys,
  AttachWorkerToEventDaySchema,
  EventDay,
  workersByEventDayColumns,
} from './EventDetails.defs'
import { SlideOver, SlideOverFooter } from '@/components/ui/Slideover'
import { useCallback, useEffect, useState } from 'react'
import { Form, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Check, ChevronsUpDown, PlusIcon } from 'lucide-react'
import { Label } from '@/components/ui/Label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { cn } from '@/utils/styles'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/Command'
import { indexWorkersQueryOptions } from '@/api/queries/workers.query'
import { FormField, FormItem } from '@/components/ui/Form'
import { Worker } from '@/pages/Workers.defs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { useAttachWorkerToAnEventDay } from '@/api/mutations/events.mutation'
import { checkError } from '@/utils/errors'
import { toast } from 'sonner'
import { ClockIcon } from '@heroicons/react/24/outline'

export const EventDetailsPage = () => {
  const { navigate } = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isWorkersComboBoxOpen, setIsWorkersComboBoxOpen] = useState(false)
  const [queryString, setQueryString] = useState('')

  const eventId = useParams({
    from: '/dashboard-layout/dashboard/eventos/$id',
    select: (params) => params.id,
  })

  const formatEventPeriod = (day: string) => {
    const date = new Date(day)
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: '2-digit' })
  }

  const { data: event } = useQuery({ queryKey: ['event', eventId], queryFn: () => getSingleEvent(eventId) })

  const days = event?.data.days as EventDay[]

  const form = useForm<AttachWorkerToEventDayBody>({
    resolver: zodResolver(AttachWorkerToEventDaySchema),
    defaultValues: {
      eventId: days?.[0].event_id,
      event_day_id: '',
      workers_id: [],
    },
  })

  const startDate = days?.[0].date
  const endDate = days?.at?.(-1)?.date

  const [activeDayId, setActiveDayId] = useState<string>('')

  useEffect(() => {
    if (event) {
      setActiveDayId(days[0].id)
    }
  }, [event])

  const selectedDay = days?.findIndex((day) => day.id === activeDayId)

  const { data: workersData } = useQuery(indexWorkersQueryOptions({ page: '1', q: queryString }))

  const workers = workersData?.data.workers.data as Worker[]
  const { mutateAsync: doAttachWorkersToAnEventDay } = useAttachWorkerToAnEventDay()

  const handleAttachWorkerToEventDay = useCallback(
    async (data: AttachWorkerToEventDayBody) => {
      try {
        await doAttachWorkersToAnEventDay(data)
        form.reset()
        toast.success(`${data.workers_id.length} funcionários adicionados ao dia ${selectedDay + 1} com sucesso!`)
      } catch (error: unknown) {
        const errors = checkError<AttachWorkerToEventDayKeys>(error)
        if (Array.isArray(errors) && errors.length > 0) {
          for (const e of errors) {
            form.setError(e.field, { message: e.message })
            toast.error(
              <p>
                Alguma coisa deu errado com o campo <strong>{e.field}</strong>: <strong>{e.message}</strong>
              </p>,
            )
          }
        } else if (typeof errors === 'string') {
          toast.error(errors)
        }
      }
    },
    [doAttachWorkersToAnEventDay, form, selectedDay],
  )

  // update form's event day id everytime activeDayId changes
  useEffect(() => {
    form.setValue('event_day_id', activeDayId)
    form.setValue('eventId', event?.data.id)
  }, [activeDayId])

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
              navigate({ to: '/dashboard/eventos/$id/dias/$day/relogio', params: { id: eventId, day: activeDayId } })
            }}
            disabled={!activeDayId}
          >
            <ClockIcon className="h-6 w-6" aria-hidden="true" />
            Registro de Presença do dia {selectedDay + 1}
          </Button>

          <Button variant="default" size="sm" className="mt-4" onClick={() => setIsOpen(true)} disabled={!activeDayId}>
            <PlusIcon className="h-6 w-6" aria-hidden="true" />
            Adicionar funcionários ao dia {selectedDay + 1}
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
        <Tabs value={activeDayId}>
          <TabsList>
            {event?.data.days.map((day: EventDay, index: number) => (
              <TabsTrigger value={day.id} key={day.id} onClick={() => setActiveDayId(day.id)}>{`Dia ${
                index + 1
              }`}</TabsTrigger>
            ))}
          </TabsList>
          {event?.data.days.map((day: EventDay) => (
            <TabsContent value={day.id} key={day.id}>
              <DataTable columns={workersByEventDayColumns} data={[]} count={0} />
            </TabsContent>
          ))}
        </Tabs>

        <SlideOver
          title={`Adicionar funcionários ao dia ${selectedDay + 1}`}
          subtitle="Selecione o dia e os funcionários que deseja adicionar ao dia."
          isOpen={isOpen}
          close={() => setIsOpen(false)}
          classNames="max-w-4xl"
        >
          <Form {...form} className=" h-[100%]">
            <form className="h-full flex flex-col gap-2 justify-between">
              <div className="px-5 py-6">
                <FormField
                  control={form.control}
                  name="workers_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Label label="Funcionários" isrequired />
                      <Popover open={isWorkersComboBoxOpen} onOpenChange={setIsWorkersComboBoxOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            size="select"
                            className={cn(
                              'w-full justify-between border-slate-200 hover:bg-transparent text-gray-600 hover:text-gray-600',
                              !field.value.length && 'opacity-50 text-muted-foreground',
                            )}
                          >
                            {field.value.length > 1
                              ? 'Mais de um funcionário selecionado'
                              : field.value.length === 1
                                ? workers.find((worker) => worker.id === field.value[0])?.full_name
                                : 'Selecione um ou mais funcionários'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[850px] p-0">
                          <Command className="w-full">
                            <CommandInput
                              placeholder="Funcionário..."
                              className="w-full"
                              onValueChange={(s) => {
                                setQueryString(s)
                              }}
                            />
                            <CommandEmpty>Funcionário não encontrado.</CommandEmpty>
                            <CommandGroup>
                              {workers?.map((worker: Worker) => (
                                <CommandItem
                                  value={worker.full_name}
                                  key={worker.id}
                                  className={cn(
                                    'group cursor-pointer flex gap-2',
                                    field.value.includes(worker.id) && 'bg-success-500/10 text-gray-800',
                                  )}
                                  onSelect={() => {
                                    if (field.value.includes(worker.id)) {
                                      form.setValue(
                                        'workers_id',
                                        field.value.filter((workerId) => workerId !== worker.id),
                                      )
                                      return
                                    }

                                    form.setValue('workers_id', [...field.value, worker.id])
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.value.includes(worker.id) ? 'opacity-100' : 'opacity-0',
                                    )}
                                  />
                                  <Avatar>
                                    <AvatarImage src={worker.picture_url} />
                                    <AvatarFallback>
                                      {worker.full_name
                                        .split(' ')
                                        .map((name) => name[0])
                                        .join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span>
                                      <strong>{worker.full_name}</strong>{' '}
                                      <span className="text-xs text-gray-500 group-hover:text-white">
                                        ({worker.cpf})
                                      </span>
                                    </span>
                                    <span className="text-xs">
                                      {worker.role} em {worker.company?.name}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>

              <SlideOverFooter>
                <div className="flex flex-shrink-0 justify-end px-4 py-4 bg-white gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    variant="default"
                    type="button"
                    onClick={form.handleSubmit((data) => handleAttachWorkerToEventDay(data))}
                  >
                    Adicionar funcionários ao dia {selectedDay + 1}
                  </Button>
                </div>
              </SlideOverFooter>
            </form>
          </Form>
        </SlideOver>
      </div>
    </section>
  )
}
