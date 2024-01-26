import { useAttachWorkerToAnEventDay } from '@/api/mutations/events.mutation'
import { getSingleEvent, indexWorkersPerEventDayQueryOptions } from '@/api/queries/events.query'
import { indexWorkersQueryOptions } from '@/api/queries/workers.query'
import {
  AttachWorkerToEventDayBody,
  AttachWorkerToEventDayKeys,
  AttachWorkerToEventDaySchema,
} from '@/pages/EventDetails.defs'
import { EventDay } from '@/pages/Events.defs'
import { Worker } from '@/pages/Workers.defs'
import { queryClient } from '@/routes'
import { checkError } from '@/utils/errors'
import { cn } from '@/utils/styles'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Form, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import { Button } from './ui/Button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/Command'
import { FormField, FormItem } from './ui/Form'
import { Label } from './ui/Label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover'
import { SlideOver, SlideOverFooter } from './ui/Slideover'

interface AttachWorkerToEventDaySlideoverProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  eventId: string
  eventDayId: string
}

export const AttachWorkerToEventDaySlideover = ({
  isOpen,
  setIsOpen,
  eventId,
  eventDayId,
}: AttachWorkerToEventDaySlideoverProps): JSX.Element => {
  const [queryString, setQueryString] = useState('')
  const [isWorkersComboBoxOpen, setIsWorkersComboBoxOpen] = useState(false)

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

  const { mutateAsync: doAttachWorkersToAnEventDay } = useAttachWorkerToAnEventDay()
  const handleAttachWorkerToEventDay = useCallback(
    async (data: AttachWorkerToEventDayBody) => {
      try {
        await doAttachWorkersToAnEventDay(data)

        queryClient.invalidateQueries(indexWorkersPerEventDayQueryOptions({ eventId, eventDayId, page: '1', q: '' }))
        form.reset()
        toast.success(`${data.workers_id.length} funcionários adicionados ao dia com sucesso!`)
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
    [doAttachWorkersToAnEventDay, form, eventDayId],
  )

  const options = indexWorkersQueryOptions({ page: '1', q: queryString })
  const { data: allWorkersData } = useQuery(options)

  const allWorkers = allWorkersData?.data.workers.data as Worker[]

  return (
    <SlideOver
      title="Adicionar funcionários ao dia"
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
                            ? allWorkers.find((worker) => worker.id === field.value[0])?.full_name
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
                          {allWorkers?.map((worker: Worker) => (
                            <CommandItem
                              value={JSON.stringify([
                                worker.full_name,
                                worker.cpf,
                                worker.role,
                                worker.company?.name,
                                worker.rg,
                              ])}
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

                                form.setValue('eventId', eventId)
                                form.setValue('event_day_id', eventDayId)
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
                                  <span className="text-xs text-gray-500 group-hover:text-white">({worker.cpf})</span>
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
                Adicionar funcionários ao dia
              </Button>
            </div>
          </SlideOverFooter>
        </form>
      </Form>
    </SlideOver>
  )
}
