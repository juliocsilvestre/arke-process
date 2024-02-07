import { useReplaceWorkerOnEventDay } from '@/api/mutations/events.mutation'
import { getSingleEvent, indexWorkersPerEventDayQueryOptions } from '@/api/queries/events.query'
import { infiniteWorkersQueryOptions } from '@/api/queries/workers.query'
import { useDebounceSearch } from '@/hooks/useDebounceSearch'
import { ReplacementBody, ReplacementKeys, ReplacementSchema } from '@/pages/EventDetails.defs'
import { EventDay } from '@/pages/Events.defs'
import { Worker } from '@/pages/Workers.defs'
import { queryClient } from '@/routes'
import { WORKER_STATUS } from '@/utils/constants'
import { checkError } from '@/utils/errors'
import { cn } from '@/utils/styles'
import { ArrowsUpDownIcon, UserIcon } from '@heroicons/react/24/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Form, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/Command'
import { FormField, FormItem } from './ui/Form'
import { Label } from './ui/Label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover'
import { SlideOver, SlideOverFooter } from './ui/Slideover'

interface AttachWorkerToEventDaySlideoverProps {
  eventId: string
  eventDayId: string
  workerToReplace: Worker | null
  onClose: () => void
}

export const ReplacementSlideover = ({
  workerToReplace,
  eventId,
  eventDayId,
  onClose,
}: AttachWorkerToEventDaySlideoverProps): JSX.Element => {
  const [queryString, setQueryString] = useState('')
  const [newWorker, setNewWorker] = useState<Worker | null>(null)
  const [workersPage, setWorkersPage] = useState('1')
  const [workers, setWorkers] = useState<Worker[]>([])
  const [hasMoreData, setHasMoreData] = useState(false)
  const [isWorkersComboBoxOpen, setIsWorkersComboBoxOpen] = useState(false)

  const {
    comboboxParameters: { debouncedSearchTerm },
  } = useDebounceSearch({
    searchTerm: queryString,
    isComboboxOpen: isWorkersComboBoxOpen,
  })

  useEffect(() => {
    // biome-ignore lint/complexity/noExtraBooleanCast: <explanation>
    if (!Boolean(workerToReplace)) {
      setQueryString('')
      setWorkersPage('1')
    }
  }, [Boolean(workerToReplace)])

  const {
    data: pages,
    fetchNextPage,
    fetchPreviousPage,
    isFetching,
  } = useInfiniteQuery(
    infiniteWorkersQueryOptions(
      Boolean(workerToReplace),
      { page: workersPage, q: debouncedSearchTerm, limit: '20' },
      { status: WORKER_STATUS.active },
    ),
  )

  useEffect(() => {
    if (pages?.workers) {
      // biome-ignore lint/correctness/noUnsafeOptionalChaining: <explanation>
      setWorkers([...pages?.workers] as Worker[])
    }
  }, [pages?.workers])

  useEffect(() => {
    if (pages?.currentPage < pages?.lastPage) {
      setHasMoreData(pages?.nextPage !== null)
    } else {
      setHasMoreData(false)
    }
  }, [pages?.nextPage, pages?.currentPage, pages?.lastPage])

  useEffect(() => {
    setWorkersPage('1')
  }, [debouncedSearchTerm])

  const isScrolledToBottom = (offsetHeight: number, scrollTop: number, scrollHeight: number) => {
    return offsetHeight + scrollTop >= scrollHeight
  }

  const isScrolledToTop = (scrollTop: number) => {
    return scrollTop <= 0
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleScroll = (target: any) => {
    const { offsetHeight, scrollTop, scrollHeight } = target
    if (pages?.nextPage && isScrolledToBottom(offsetHeight, scrollTop, scrollHeight)) {
      try {
        fetchNextPage()
        setWorkersPage((page) => String(Number(page) + 1))
      } catch (error) {
        toast.error('Erro ao buscar funcionários. Tente novamente.')
      }
    } else if (pages?.currentPage > 1 && isScrolledToTop(scrollTop)) {
      try {
        fetchPreviousPage()
        setWorkersPage((page) => (Number(page) > 1 ? String(Number(page) - 1) : '1'))
      } catch (error) {
        toast.error('Erro ao buscar funcionários. Tente novamente.')
      }
    }
  }

  const { data: event } = useQuery({ queryKey: ['event', eventId], queryFn: () => getSingleEvent(eventId) })
  const days = event?.data.days as EventDay[]

  const form = useForm<ReplacementBody>({
    resolver: zodResolver(ReplacementSchema),
    defaultValues: {
      event_id: days?.[0].event_id,
      event_day_id: '',
      new_worker_id: '',
      worker_id: workerToReplace?.id,
    },
  })

  const { mutateAsync: doReplaceWorker } = useReplaceWorkerOnEventDay()
  const handleReplaceWorker = async (data: ReplacementBody) => {
    try {
      await doReplaceWorker(data)
      queryClient.invalidateQueries(indexWorkersPerEventDayQueryOptions({ eventId, eventDayId, page: '1', q: '' }))
      form.reset()
      toast.success('funcionário substituído com sucesso!')
    } catch (error: unknown) {
      const errors = checkError<ReplacementKeys>(error)
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
  }

  const newWorkerId = form.watch('new_worker_id')

  useEffect(() => {
    if (newWorkerId) {
      const w = workers.find((worker) => worker.id === newWorkerId)

      if (w) {
        setNewWorker(w)
      }
    }
  }, [newWorkerId])

  return (
    <SlideOver
      title={`Substituir ${workerToReplace?.full_name}`}
      subtitle="Selecione o substituto."
      isOpen={Boolean(workerToReplace)}
      close={onClose}
      classNames="max-w-4xl"
    >
      <Form {...form} className="h-[100%]">
        <form className="h-full flex flex-col gap-2 justify-between">
          <div className="px-5 py-6">
            <section>
              <div className="flex items-center p-4 gap-4 opacity-70">
                <Avatar className="w-[136px] h-[136px]">
                  <AvatarImage src={workerToReplace?.picture_url} className="object-cover object-center" />
                  <AvatarFallback>{workerToReplace?.full_name.split(' ').map((name) => name[0])}</AvatarFallback>
                </Avatar>

                <div>
                  <Badge variant="error" className="mb-2">
                    Sai
                  </Badge>
                  <h3 className="text-2xl text-primary-700 font-bold">{workerToReplace?.full_name}</h3>
                  <p className="text-gray-500">
                    {workerToReplace?.role} na <strong>{workerToReplace?.company?.name}</strong>
                  </p>
                </div>
              </div>

              <ArrowsUpDownIcon className="w-20 ml-11 text-primary-700" />

              <div className="flex items-center p-4 gap-4">
                {newWorker?.picture_url ? (
                  <Avatar className="w-[136px] h-[136px]">
                    <AvatarImage src={newWorker?.picture_url} className="object-cover object-center" />
                    <AvatarFallback>{newWorker?.full_name.split(' ').map((name) => name[0])}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="relative flex w-[136px] h-[136px] object-cover object-center rounded-full border border-solid border-primary-500 mb-1 shadow-lg bg-gray-200 !shrink-0">
                    <UserIcon
                      className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-20 w-20 text-gray-500"
                      aria-hidden="true"
                    />
                  </div>
                )}

                <div>
                  <Badge className="mb-2">Entra</Badge>
                  <h3 className="text-2xl text-primary-700 font-bold">
                    {newWorker?.full_name ?? 'Aguardando escolha...'}
                  </h3>
                  <p className="text-gray-500">
                    {newWorker ? (
                      <p>
                        {newWorker?.role} na <strong>{newWorker?.company?.name}</strong>
                      </p>
                    ) : (
                      'Aguardando escolha...'
                    )}
                  </p>
                </div>
              </div>
            </section>

            <FormField
              control={form.control}
              name="new_worker_id"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-10">
                  <Label label="Funcionários" isrequired />
                  <Popover open={isWorkersComboBoxOpen} onOpenChange={setIsWorkersComboBoxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        size="select"
                        className={cn(
                          'w-full justify-between border-slate-200 hover:bg-transparent text-gray-600 hover:text-gray-600',
                          !field.value && 'opacity-50 text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? workers?.find((worker) => worker.id === field.value)?.full_name
                          : 'Selecione um funcionário'}
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
                        <CommandEmpty searchTarget="Funcionário">Funcionário não encontrado.</CommandEmpty>
                        <CommandGroup
                          onScroll={(event) => {
                            if (!hasMoreData) return
                            handleScroll(event.target)
                          }}
                        >
                          {workers?.map((worker: Worker) => (
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
                                if (workerToReplace) {
                                  form.setValue('event_id', eventId)
                                  form.setValue('event_day_id', eventDayId)
                                  form.setValue('new_worker_id', worker.id)
                                  form.setValue('worker_id', workerToReplace.id)
                                }
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
                        {!hasMoreData && !isFetching && workers?.length > 0 && (
                          <div className="w-full flex justify-center items-center my-[32px]">
                            <strong>Sem mais resultados...</strong>
                            <Button
                              type="button"
                              variant="ghost"
                              className="hover:bg-transparent p-[.5rem]"
                              onClick={() => setWorkersPage('1')}
                            >
                              Voltar para o ínicio da lista
                            </Button>
                          </div>
                        )}
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>

          <SlideOverFooter>
            <div className="flex flex-shrink-0 justify-end px-4 py-4 bg-white gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button variant="default" type="button" onClick={form.handleSubmit(handleReplaceWorker)}>
                Substituir funcionário {workerToReplace?.full_name}
              </Button>
            </div>
          </SlideOverFooter>
        </form>
      </Form>
    </SlideOver>
  )
}
