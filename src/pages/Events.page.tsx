import { useDebounceSearch } from '@/hooks/useDebounceSearch'
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useRouter, useSearch } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useCreateEvent, useUpdateEvent } from '@/api/mutations/events.mutation'
import { Button } from '@components/ui/Button'
import { Calendar } from '@components/ui/Calendar'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@components/ui/Form'
import { Input } from '@components/ui/Input'
import { Label } from '@components/ui/Label'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/Popover'
import { SlideOver, SlideOverFooter } from '@components/ui/Slideover'
import { NAVIGATION } from '@utils/constants'
import { cn } from '@utils/styles'

import { indexEventsQueryOption } from '@/api/queries/events.query'
import { DataTable } from '@/components/ui/DataTable'
import { useSuspenseQuery } from '@tanstack/react-query'
import _ from 'lodash'
import { CreateEventBody, CreateEventSchema, Event, EventDay, eventsColumns } from './Events.defs'

export const EventsPage = (): JSX.Element => {
  const { latestLocation } = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [queryString, setQueryString] = useState('')
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null)

  const form = useForm<CreateEventBody>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      name: '',
      dates: {
        from: undefined,
        to: undefined,
      },
    },
  })

  const { mutateAsync: createEvent } = useCreateEvent()

  const filterByDebouncedSearchTerm = (debouncedSearchTerm: string) => {
    navigate({ params: '', search: (prev) => ({ ...prev, q: debouncedSearchTerm }) })
  }

  useDebounceSearch({ searchTerm: queryString, callback: filterByDebouncedSearchTerm })

  const search = useSearch({ from: '/dashboard-layout/dashboard/eventos/' }) as {
    q: string
    page: string
  }
  const options = indexEventsQueryOption(search)
  const { data: events } = useSuspenseQuery(options)

  const navigate = useNavigate()
  const { mutateAsync: doUpdateEvent } = useUpdateEvent()

  const onCreateEvent = async (values: CreateEventBody): Promise<void> => {
    try {
      if (eventToEdit) {
        await doUpdateEvent({ ...values, id: eventToEdit.id })
      } else {
        await createEvent(values)
      }
      form.reset()
      handleOnClose()
      toast.success(
        <p>
          O evento <strong>{values.name}</strong> foi {eventToEdit ? 'atualizado' : 'criado'} com sucesso!
        </p>,
      )
    } catch (error: unknown) {
      if (!(error instanceof AxiosError)) return
      console.error(error.response?.data.errors)

      // biome-ignore lint/correctness/noUnsafeOptionalChaining: <explanation>
      for (const e of error.response?.data.errors) {
        form.setError(e.field, { message: e.message })
        toast.error(
          <p>
            Alguma coisa deu errado com o campo <strong>{e.field}</strong>: <strong>{e.message}</strong>
          </p>,
        )
      }
    }
  }

  const handleOnClose = () => {
    setIsOpen(false)
    form.reset()
    setEventToEdit(null)
  }
  const disabledDays = [{ before: new Date() }]

  useEffect(() => {
    if (eventToEdit) {
      form.setValue('name', eventToEdit.name)
      form.setValue('dates', {
        from: new Date(eventToEdit.start_date),
        to: new Date(eventToEdit.finish_date),
      })
    }
  }, [eventToEdit])

  return (
    <section className="bg-gray-50 min-h-screen overflow-y-auto p-4 md:p-10">
      <div className="mx-auto flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-4xl text-primary font-bold">
          {NAVIGATION.find((n) => n.href === latestLocation.pathname)?.name ?? ''}
        </h1>
        <Button variant="default" size="sm" className="mt-4" onClick={() => setIsOpen(true)}>
          <PlusIcon className="h-6 w-6" aria-hidden="true" />
          Novo evento
        </Button>
      </div>

      <section className="mt-[30px]">
        <DataTable
          columns={eventsColumns}
          data={events?.data.events.data ?? []}
          count={events?.data.events_count}
          onQueryChange={(query) => setQueryString(query)}
          pages={events?.data.events.meta.last_page ?? 1}
          currentPage={events?.data.events.meta.current_page ?? 1}
          onRowClick={({ id, days }) => {
            const sortedDates = _.sortBy(days, (d: EventDay) => new Date(d.date))

            navigate({
              to: '/dashboard/eventos/$id/dias/$day',
              params: { id, day: sortedDates?.at?.(0)?.id ?? 'undefined' },
              search: { page: '1', q: '' },
            })
          }}
          actions={(e) => {
            return (
              <div className="flex justify-start gap-2">
                <Button
                  size="icon"
                  onClick={(event) => {
                    event.stopPropagation()
                    setEventToEdit(e)
                    setIsOpen(true)
                  }}
                >
                  <PencilSquareIcon className="w-5" />
                </Button>
                {/* <DeleteEventButton event={e} /> */}
              </div>
            )
          }}
        />
      </section>

      <SlideOver
        title={eventToEdit ? 'Editar evento' : 'Novo evento'}
        subtitle={`Preencha os campos abaixo para ${eventToEdit ? 'editar o' : 'criar um novo'} evento.`}
        isOpen={isOpen}
        close={handleOnClose}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCreateEvent)} className="h-full flex flex-col gap-2 justify-between">
            <div className="px-5 py-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name" label="Nome" isrequired />
                    <FormControl>
                      <Input id="name" placeholder="Insira o nome do evento" {...field} size="lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!eventToEdit && (
                <FormField
                  control={form.control}
                  name="dates"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="dates" label="Dias do evento" isrequired />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant="outline"
                            className={cn(
                              'w-[300px] justify-start text-left font-normal !border-slate-200 text-gray-600 hover:bg-white hover:text-gray-600 focus-visible:!border-primary-700',
                              !field.value?.from && !field.value?.to && '!opacity-50',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, 'LLL dd, y')} - {format(field.value.to, 'LLL dd, y')}
                                </>
                              ) : (
                                format(field.value.from, 'LLL dd, y')
                              )
                            ) : (
                              <span>Escolha uma data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 " align="start">
                          <Calendar
                            locale={ptBR}
                            initialFocus
                            mode="range"
                            defaultMonth={field.value?.from}
                            selected={field.value}
                            onSelect={field.onChange}
                            numberOfMonths={1}
                            disabled={disabledDays}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <SlideOverFooter>
              <div className="flex flex-shrink-0 justify-end px-4 py-4 bg-white gap-2">
                <Button type="button" variant="outline" onClick={handleOnClose}>
                  Cancelar
                </Button>
                <Button variant="default" type="submit">
                  {eventToEdit ? 'Salvar' : 'Criar evento'}
                </Button>
              </div>
            </SlideOverFooter>
          </form>
        </Form>
      </SlideOver>
    </section>
  )
}
