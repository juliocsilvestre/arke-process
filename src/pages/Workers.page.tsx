import { api } from '@/api/api'
import { useCreateWorker, useCreateWorkersBulk, useDeleteWorker, useEditWorker } from '@/api/mutations/workers.mutation'
import { infiniteCompaniesQueryOptions } from '@/api/queries/companies.query'
import { indexWorkersQueryOptions, useGetAddresByCep, useSingleWorker } from '@/api/queries/workers.query'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { BraceletPDF } from '@/components/ui/Bracelet.pdf'
import { Button } from '@/components/ui/Button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/Command'
import { DataTable } from '@/components/ui/DataTable'
import { DropZone } from '@/components/ui/DropZone'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { SlideOver, SlideOverFooter } from '@/components/ui/Slideover'
import { useDebounceSearch } from '@/hooks/useDebounceSearch'
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE, NAVIGATION, UF_LIST } from '@/utils/constants'
import { checkError } from '@/utils/errors'
import { maskCEP, maskCPF, maskDate, maskPhoneNumber } from '@/utils/strings'
import { cn } from '@/utils/styles'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@components/ui/Form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@components/ui/Select'
import { PaperClipIcon, PencilSquareIcon, PlusIcon, QrCodeIcon, TrashIcon, UserIcon } from '@heroicons/react/24/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { pdf } from '@react-pdf/renderer'
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useRouter, useSearch } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { format, parse } from 'date-fns'
import { Check, ChevronsUpDown } from 'lucide-react'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Tooltip } from 'react-tooltip'
import { toast } from 'sonner'
import * as xlsx from 'xlsx'
import { Company } from './Companies.defs'
import {
  CreateWorkerBody,
  CreateWorkerRow,
  CreateWorkerSchema,
  Worker,
  WorkerBodyKeys,
  WorkerSheet,
  workerInitialValues,
  workersColumns,
  workersSheetMapper,
} from './Workers.defs'

export type UploadFileProps = {
  e?: ChangeEvent<HTMLInputElement>
  f?: File
}

export const WorkersPage = (): JSX.Element => {
  const { latestLocation, navigate } = useRouter()
  const [picturePreview, setPicturePreview] = useState<File | null>(null)
  const [previewImageURL, setPreviewImageURL] = useState<string>('')
  const [isCompanySelectOpen, setIsCompanySelectOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSpreadsheetManagerOpen, setIsSpreadsheetManagerOpen] = useState(false)
  const [workersToUpload, setWorkersToUpload] = useState<CreateWorkerRow[]>([])
  const [companyToBulkUpload, setCompanyToBulkUpload] = useState<string>('')
  const [isBulkComboBoxOpen, setIsBulkComboBoxOpen] = useState(false)
  const [queryString, setQueryString] = useState('')
  const [tableQueryString, setTableQueryString] = useState('')
  const [workerToEdit, setWorkerToEdit] = useState<Worker | null>(null)
  const [, setHasMoreData] = useState(false)
  const [companiesPage, setCompaniesPage] = useState('1')
  const [companies, setCompanies] = useState<Company[]>([])

  const hasComboboxVisible = isOpen || isSpreadsheetManagerOpen

  const { comboboxParameters } = useDebounceSearch({
    searchTerm: queryString,
    isComboboxOpen: hasComboboxVisible,
  })

  const {
    data: pages,
    fetchNextPage,
    fetchPreviousPage,
  } = useInfiniteQuery(
    infiniteCompaniesQueryOptions(hasComboboxVisible, {
      page: companiesPage,
      q: comboboxParameters.debouncedSearchTerm,
      limit: '20',
    }),
  )

  useEffect(() => {
    setCompaniesPage('1')
  }, [comboboxParameters.debouncedSearchTerm])

  const form = useForm<CreateWorkerBody>({
    resolver: zodResolver(CreateWorkerSchema),
    defaultValues: workerInitialValues,
  })

  const { mutateAsync: createWorker } = useCreateWorker()
  const { mutateAsync: createWorkersBulk } = useCreateWorkersBulk()

  const onCreateWorkersBulk = useCallback(async () => {
    try {
      await createWorkersBulk({ workers: workersToUpload, company_id: companyToBulkUpload })
      handleOnClose()
      toast.success(<p>{workersToUpload.length} funcionários foram criados com sucesso!</p>)
    } catch (error: unknown) {
      const errors = checkError<WorkerBodyKeys>(error)
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
  }, [workersToUpload, companyToBulkUpload, createWorkersBulk])

  const { mutateAsync: updateWorker } = useEditWorker(workerToEdit?.id)

  const onCreateWorker = useCallback(
    async (values: CreateWorkerBody): Promise<void> => {
      try {
        const date = format(parse(values.issuing_date, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')

        if (workerToEdit) {
          await updateWorker({ ...values, issuing_date: date })
        } else {
          await createWorker({ ...values, issuing_date: date })
          form.reset()
        }

        handleOnClose()
        toast.success(
          Array.isArray(values) && values.length > 0 ? (
            <p>{values.length} funcionários foram criados com sucesso!</p>
          ) : (
            <p>
              O funcionário <strong>{values.full_name}</strong> foi {workerToEdit ? 'atualizado' : 'criado'} com
              sucesso!
            </p>
          ),
        )
      } catch (error: unknown) {
        const errors = checkError<WorkerBodyKeys>(error)
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
    [picturePreview, form, createWorker, workerToEdit, updateWorker],
  )

  const handleOnClose = () => {
    setIsOpen(false)
    setPicturePreview(null)
    setPreviewImageURL('')
    setWorkerToEdit(null)
    form.reset()
  }

  useEffect(() => {
    if (!isOpen || !isSpreadsheetManagerOpen) {
      setQueryString('')
      setCompaniesPage('1')
    }
  }, [isOpen, isSpreadsheetManagerOpen])

  useEffect(() => {
    if (pages?.companies) {
      // biome-ignore lint/correctness/noUnsafeOptionalChaining: <explanation>
      setCompanies([...pages?.companies])
    }
  }, [pages?.companies])

  useEffect(() => {
    if (pages?.currentPage < pages?.lastPage) {
      setHasMoreData(pages?.nextPage !== null)
    } else {
      setHasMoreData(false)
    }
  }, [pages?.nextPage])

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
        setCompaniesPage((page) => (parseInt(page) + 1).toString())
      } catch (error) {
        toast.error('Erro ao buscar fornecedores. Tente novamente.')
      }
    } else if (pages?.currentPage > 1 && isScrolledToTop(scrollTop)) {
      try {
        fetchPreviousPage()
        setCompaniesPage((page) => (parseInt(page) - 1).toString())
      } catch (error) {
        toast.error('Erro ao buscar fornecedores. Tente novamente.')
      }
    }
  }

  useEffect(() => {
    if (picturePreview instanceof File) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImageURL(reader.result as string)
      }
      reader.readAsDataURL(picturePreview)
    }
  }, [picturePreview])

  const { data } = useGetAddresByCep(form.watch('cep'))

  const cep = form.watch('cep')
  useEffect(() => {
    if (cep.length !== 9) return

    if (Object.keys(data ?? {})?.length > 0) {
      form.setValue('street', data.logradouro)
      form.setValue('neighborhood', data.bairro)
      form.setValue('city', data.localidade)
      form.setValue('uf', data.uf)
    }
  }, [cep, data, form])

  const readUploadFile = ({ e, f }: UploadFileProps) => {
    e?.preventDefault()
    const file = e?.target.files?.[0] ?? f
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e?.target?.result

        const workbook = xlsx.read(data, {
          type: 'array',
          cellDates: true,
          dateNF: 'DD/MM/YYYY',
          cellNF: false,
          cellText: true,
          raw: true,
        })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        const json = xlsx.utils.sheet_to_json(worksheet, { raw: true, dateNF: 'DD/MM/YYYY' })
        const serializedJson = workersSheetMapper(json as WorkerSheet[])
        const workersWithParsedIssuingDate = serializedJson.map((worker) => {
          return {
            ...worker,
            issuing_date: format(worker.issuing_date, 'yyyy-MM-dd'),
          }
        })

        setWorkersToUpload(workersWithParsedIssuingDate)
      }

      reader.readAsArrayBuffer(file)
    }
  }

  const filterByDebouncedSearchTerm = (debouncedSearchTerm: string) => {
    navigate({ params: '', search: (prev) => ({ ...prev, q: debouncedSearchTerm }) })
  }

  useDebounceSearch({ searchTerm: tableQueryString, callback: filterByDebouncedSearchTerm })

  const search = useSearch({ from: '/dashboard-layout/dashboard/funcionarios/' }) as { q: string; page: string }

  const options = indexWorkersQueryOptions(search)
  const { data: workers } = useSuspenseQuery(options)

  const { worker: workerData } = useSingleWorker(workerToEdit?.id ?? '')
  const singleWorkerToEdit = workerData.data?.data

  useEffect(() => {
    if (singleWorkerToEdit) {
      form.setValue('full_name', singleWorkerToEdit.full_name)
      form.setValue('cpf', singleWorkerToEdit.cpf)
      form.setValue('rg', singleWorkerToEdit.rg)
      form.setValue('issuing_agency', singleWorkerToEdit.issuing_agency)
      form.setValue('issuing_state', singleWorkerToEdit.issuing_state as keyof typeof UF_LIST)
      form.setValue(
        'issuing_date',
        format(parse(singleWorkerToEdit.issuing_date, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy'),
      )
      form.setValue('email', singleWorkerToEdit.email)
      form.setValue('phone_number', singleWorkerToEdit.phone_number)
      form.setValue('company_id', singleWorkerToEdit.company_id)
      form.setValue('role', singleWorkerToEdit.role)
      form.setValue('emergency_name', singleWorkerToEdit.emergency_name)
      form.setValue('emergency_number', singleWorkerToEdit.emergency_number)
      form.setValue('cep', singleWorkerToEdit.address.cep)
      form.setValue('street', singleWorkerToEdit.address.street)
      form.setValue('number', singleWorkerToEdit.address.number)
      form.setValue('neighborhood', singleWorkerToEdit.address.neighborhood)
      form.setValue('complement', singleWorkerToEdit.address.complement)
      form.setValue('city', singleWorkerToEdit.address.city)
      form.setValue('uf', singleWorkerToEdit.address.uf)
    }
  }, [singleWorkerToEdit])

  return (
    <section className="bg-gray-50 min-h-screen overflow-y-auto p-4 md:p-10">
      <div className="mx-auto flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-4xl text-primary font-bold">
          {NAVIGATION.find((n) => n.href === latestLocation.pathname)?.name ?? ''}
        </h1>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="mt-4" onClick={() => setIsSpreadsheetManagerOpen(true)}>
            <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
            Importar funcionários
          </Button>
          <Button variant="default" size="sm" className="mt-4" onClick={() => setIsOpen(true)}>
            <PlusIcon className="h-6 w-6" aria-hidden="true" />
            Novo funcionário
          </Button>
        </div>
      </div>

      <section className="mt-[30px]">
        <DataTable
          columns={workersColumns}
          data={workers?.data.workers.data ?? []}
          count={workers?.data.workers_count}
          onRowClick={({ id }) =>
            navigate({
              to: '/dashboard/funcionarios/$id',
              params: { id },
            })
          }
          onQueryChange={(query) => setTableQueryString(query)}
          pages={workers?.data.workers.meta.last_page ?? 1}
          currentPage={workers?.data.workers.meta.current_page ?? 1}
          actions={(worker: Worker) => {
            return (
              <div className="flex justify-start gap-2">
                <Button
                  size="icon"
                  onClick={async (event) => {
                    event.preventDefault()
                    event.stopPropagation()

                    const getQRCode = async (workerId: string) => {
                      const { data } = await api.get(`/workers/${workerId}/qrcode`)
                      return data as string
                    }

                    const generatePdfDocument = async (qrCode: string) => {
                      const blob = await pdf(<BraceletPDF qrcode={qrCode} worker={worker} />).toBlob()

                      const url = URL.createObjectURL(blob)
                      const iframe = document.createElement('iframe')
                      iframe.src = url
                      iframe.style.display = 'none'
                      document.body.appendChild(iframe)
                      iframe.contentWindow?.print()
                    }

                    const qrCode = await getQRCode(worker.id)

                    generatePdfDocument(qrCode)
                  }}
                >
                  <QrCodeIcon className="w-6 h-6" />
                </Button>
                <Button
                  size="icon"
                  onClick={(event) => {
                    event.stopPropagation()
                    setWorkerToEdit(worker)
                    setIsOpen(true)
                  }}
                >
                  <PencilSquareIcon className="w-5" />
                </Button>
                <_DeleteEventButton worker={worker} />
              </div>
            )
          }}
        />
      </section>

      <SlideOver
        title="Importar funcionários de uma planilha"
        subtitle="Se o fornecedor não estiver cadastrado, cadastre-o primeiro."
        isOpen={isSpreadsheetManagerOpen}
        close={() => setIsSpreadsheetManagerOpen(false)}
      >
        <div className="flex flex-col gap-2 p-4 h-[calc(100svh_-_247px)]">
          <Label label="Fornecedor" isrequired />
          <Popover open={isBulkComboBoxOpen} onOpenChange={setIsBulkComboBoxOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                size="select"
                className={cn(
                  'w-full justify-between border-slate-200 hover:bg-transparent text-gray-600 hover:text-gray-600',
                  !companyToBulkUpload && 'opacity-50 text-muted-foreground',
                )}
              >
                {companyToBulkUpload
                  ? companies.find((company: Company) => company.id === companyToBulkUpload)?.name
                  : 'Selecione um fornecedor'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[420px] p-0">
              <Command className="w-full">
                <CommandInput
                  placeholder="Fornecedor..."
                  className="w-full"
                  onValueChange={(s) => {
                    setQueryString(s)
                  }}
                />
                <CommandEmpty searchTarget="fornecedor">Fornecedor não encontrado.</CommandEmpty>
                <CommandGroup onScroll={(event) => handleScroll(event.target)}>
                  {companies.map((company: Company) => (
                    <CommandItem
                      value={company.name}
                      key={company.id}
                      onSelect={() => {
                        setCompanyToBulkUpload(company.id)
                        setIsBulkComboBoxOpen(false)
                      }}
                    >
                      <Check
                        className={cn('mr-2 h-4 w-4', company.id === companyToBulkUpload ? 'opacity-100' : 'opacity-0')}
                      />
                      {company.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <DropZone readFile={readUploadFile} />
        </div>

        <div className="w-full flex justify-center">
          <Button
            variant="secondary"
            className="mx-auto mb-4"
            onClick={async () => {
              await api
                .get(`${import.meta.env.VITE_API_URL.replace('v1/', '')}/planilha-modelo.xlsx`, {
                  responseType: 'blob',
                })
                .then((response) => {
                  const url = window.URL.createObjectURL(new Blob([response.data]))
                  const link = document.createElement('a')
                  link.href = url
                  link.setAttribute('download', 'planilha-modelo.xlsx')
                  document.body.appendChild(link)
                  link.click()
                })
            }}
          >
            Baixe o modelo de planilha clicando aqui
          </Button>
        </div>
        <SlideOverFooter>
          <div className="flex flex-shrink-0 justify-end px-4 py-1 bg-white gap-2">
            <Button type="button" variant="outline" onClick={() => setIsSpreadsheetManagerOpen(false)}>
              Cancelar
            </Button>
            <Button variant="default" type="button" onClick={onCreateWorkersBulk}>
              Criar funcionários
            </Button>
          </div>
        </SlideOverFooter>
      </SlideOver>

      <SlideOver
        title={workerToEdit ? 'Editar funcionário' : 'Novo funcionário'}
        subtitle={`Preencha os campos abaixo para ${workerToEdit ? 'editar o' : 'criar um novo'} funcionário.`}
        isOpen={isOpen}
        classNames="max-w-4xl"
        close={handleOnClose}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCreateWorker)} className="h-full flex flex-col gap-2 justify-between">
            <div className="px-5 py-6 flex flex-col">
              <div className="flex flex-row gap-10">
                <div className="flex flex-col items-center">
                  <div className="w-full !shrink-0">
                    {previewImageURL || workerToEdit?.picture_url ? (
                      <img
                        src={previewImageURL || workerToEdit?.picture_url}
                        alt="Foto do funcionário"
                        className="mx-auto w-[200px] h-[200px] object-cover object-center rounded-full border border-solid border-primary-500 mb-1 shadow-lg !shrink-0"
                      />
                    ) : (
                      <div className="relative flex mx-auto w-[200px] h-[200px] object-cover object-center rounded-full border border-solid border-primary-500 mb-1 shadow-lg bg-gray-200 !shrink-0">
                        <UserIcon
                          className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-20 w-20 text-gray-500"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="picture"
                    render={({ field }) => (
                      <FormItem className="w-[100%]">
                        <div className="flex items-center justify-center gap-1">
                          <PaperClipIcon className="w-5 text-primary-700" />
                          <Label
                            htmlFor="picture"
                            label={picturePreview ?? workerToEdit?.picture_url ? 'Trocar foto' : 'Fazer upload de foto'}
                            className="italic font-normal"
                          />
                        </div>
                        <FormControl>
                          <Input
                            id="picture"
                            placeholder="Insira a foto"
                            {...field}
                            type="file"
                            size="md"
                            className="h-[42px] hidden"
                            onChange={(event) => {
                              const picture = event.target.files?.[0]
                              if (picture) {
                                if (picture.size > MAX_FILE_SIZE) {
                                  form.setError('picture', {
                                    message: 'Tamanho máximo de 2MB.',
                                  })
                                  return
                                }

                                if (!ACCEPTED_IMAGE_TYPES.includes(picture.type)) {
                                  form.setError('picture', {
                                    message: 'Tipo de arquivo inválido.',
                                  })

                                  return
                                }
                                form.clearErrors('picture')

                                setPicturePreview(picture)
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-center" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-[70%]">
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem className="w-[60%]">
                          <Label htmlFor="full_name" label="Nome Completo" isrequired />
                          <FormControl>
                            <Input id="full_name" placeholder="Insira o nome completo" {...field} size="md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem className="w-[40%]">
                          <Label htmlFor="cpf" label="CPF" isrequired />
                          <FormControl>
                            <Input
                              id="cpf"
                              placeholder="Insira o CPF"
                              {...field}
                              size="md"
                              onBlur={(event) => {
                                if (event.target.value) {
                                  form.trigger('cpf')
                                }
                              }}
                              onChange={(event) => {
                                const cpf = maskCPF(event.target.value)
                                form.setValue('cpf', cpf)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="rg"
                      render={({ field }) => (
                        <FormItem className="w-[30%]">
                          <Label htmlFor="rg" label="RG" isrequired />
                          <FormControl>
                            <Input
                              id="rg"
                              placeholder="Insira o RG"
                              {...field}
                              size="md"
                              onBlur={(event) => {
                                if (event.target.value) {
                                  form.trigger('rg')
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="issuing_agency"
                      render={({ field }) => (
                        <FormItem className="w-[25%]">
                          <Label htmlFor="issuing_agency" label="Órgão expedidor" isrequired />
                          <FormControl>
                            <Input id="issuing_agency" placeholder="ex: SDS" {...field} size="md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="issuing_state"
                      render={({ field }) => (
                        <FormItem className="w-[10%]">
                          <Label htmlFor="issuing_state" label="UF" isrequired />
                          <FormControl>
                            <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="UF" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {Object.values(UF_LIST).map((uf) => (
                                    <SelectItem key={uf} value={uf}>
                                      {uf}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="issuing_date"
                      render={({ field }) => (
                        <FormItem className="w-[25%]">
                          <Label htmlFor="issuing_date" label="Data de emissão" isrequired />
                          <FormControl>
                            <Input
                              id="issuing_date"
                              placeholder="DD/MM/YYYY"
                              {...field}
                              size="md"
                              onBlur={(event) => {
                                if (event.target.value) {
                                  form.trigger('issuing_date')
                                }
                              }}
                              onChange={(event) => {
                                const date = maskDate(event.target.value)
                                form.setValue('issuing_date', date)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-[60%]">
                          <Label htmlFor="email" label="E-mail" />
                          <FormControl>
                            <Input id="email" placeholder="Insira o e-mail" {...field} size="md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem className="w-[40%]">
                          <Label htmlFor="phone_number" label="Celular/Whatsapp" isrequired />
                          <FormControl>
                            <Input
                              id="phone_number"
                              placeholder="Insira o celular/whatsapp"
                              {...field}
                              size="md"
                              onBlur={(event) => {
                                if (event.target.value) {
                                  form.trigger('phone_number')
                                }
                              }}
                              onChange={(event) => {
                                const phoneNumber = maskPhoneNumber(event.target.value)
                                form.setValue('phone_number', phoneNumber)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="company_id"
                  render={({ field }) => (
                    <FormItem className="w-[50%]">
                      <Label htmlFor="company_id" label="Fornecedor" isrequired />
                      <Popover open={isCompanySelectOpen} onOpenChange={setIsCompanySelectOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
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
                                ? companies.find((company: Company) => company.id === field.value)?.name
                                : 'Fornecedor'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[420px] p-0">
                          <Command className="w-full">
                            <CommandInput
                              placeholder="Fornecedor..."
                              className="w-full"
                              onValueChange={(s) => {
                                setQueryString(s)
                              }}
                            />
                            <CommandEmpty searchTarget="fornecedor">Fornecedor não encontrado.</CommandEmpty>
                            <CommandGroup onScroll={(event) => handleScroll(event.target)}>
                              {companies.map((company: Company) => (
                                <CommandItem
                                  value={company.name}
                                  key={company.id}
                                  onSelect={() => {
                                    form.setValue('company_id', company.id)
                                    setIsCompanySelectOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      company.id === field.value ? 'opacity-100' : 'opacity-0',
                                    )}
                                  />
                                  {company.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="w-[50%]">
                      <Label htmlFor="role" label="Função" isrequired />
                      <FormControl>
                        <Input id="role" placeholder="Insira a função" {...field} size="md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="emergency_name"
                  render={({ field }) => (
                    <FormItem className="w-[40%]">
                      <Label htmlFor="emergency_name" label="Nome do contato de emergência" isrequired />
                      <FormControl>
                        <Input id="emergency_name" placeholder="Insira o nome" {...field} size="md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergency_number"
                  render={({ field }) => (
                    <FormItem className="w-[40%]">
                      <Label htmlFor="emergency_number" label="Número do contato de emergência" isrequired />
                      <FormControl>
                        <Input
                          id="emergency_number"
                          placeholder="Insira o celular/whatsapp"
                          {...field}
                          size="md"
                          onBlur={(event) => {
                            if (event.target.value) {
                              form.trigger('emergency_number')
                            }
                          }}
                          onChange={(event) => {
                            const phoneNumber = maskPhoneNumber(event.target.value)
                            form.setValue('emergency_number', phoneNumber)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <h4 className="text-2xl text-primary font-bold">Endereço</h4> */}
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem className="w-[20%]">
                      <Label htmlFor="cep" label="CEP" isrequired />
                      <FormControl>
                        <Input
                          id="cep"
                          placeholder="Insira o CEP"
                          {...field}
                          size="md"
                          onBlur={(event) => {
                            if (event.target.value) {
                              form.trigger('cep')

                              // TODO: fetch address by CEP
                            }
                          }}
                          onChange={(event) => {
                            const cep = maskCEP(event.target.value)
                            form.setValue('cep', cep)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className="w-[70%]">
                      <Label htmlFor="street" label="Rua" isrequired />
                      <FormControl>
                        <Input id="street" placeholder="Insira a rua" {...field} size="md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem className="w-[20%]">
                      <Label htmlFor="number" label="Número" isrequired />
                      <FormControl>
                        <Input
                          id="number"
                          placeholder="Insira o número"
                          {...field}
                          size="md"
                          value={field.value === 0 ? '' : field.value}
                          onChange={
                            // remove non-numeric characters
                            (event) => {
                              const n = event.target.value.replace(/\D/g, '')
                              form.setValue('number', Number(n))
                            }
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem className="w-[30%]">
                      <Label htmlFor="neighborhood" label="Bairro" isrequired />
                      <FormControl>
                        <Input id="neighborhood" placeholder="Insira o bairro" {...field} size="md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem className="w-[40%]">
                      <Label htmlFor="complement" label="Complemento" />
                      <FormControl>
                        <Input id="complement" placeholder="Insira o complemento" {...field} size="md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="w-[30%]">
                      <Label htmlFor="city" label="Cidade" isrequired />
                      <FormControl>
                        <Input id="city" placeholder="Insira a cidade" {...field} size="md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="uf"
                  render={({ field }) => (
                    <FormItem className="w-[10%]">
                      <Label htmlFor="uf" label="UF" isrequired />
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="UF" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {Object.values(UF_LIST).map((uf) => (
                                <SelectItem key={uf} value={uf}>
                                  {uf}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <SlideOverFooter>
              <div className="flex flex-shrink-0 justify-end px-4 py-1 bg-white gap-2">
                <Button type="button" variant="outline" onClick={handleOnClose}>
                  Cancelar
                </Button>
                <Button variant="default" type="submit">
                  {workerToEdit ? 'Salvar' : 'Criar funcionário'}
                </Button>
              </div>
            </SlideOverFooter>
          </form>
        </Form>
      </SlideOver>
    </section>
  )
}

const _DeleteEventButton = ({ worker }: { worker: Worker }) => {
  const { mutateAsync: deleteWorker } = useDeleteWorker()

  const onDeleteWorker = async (worker: Worker): Promise<void> => {
    try {
      await deleteWorker(worker.id)
      toast.success(<p>O funcionário "{worker.full_name}" foi excluído com sucesso!</p>)
    } catch (error: unknown) {
      if (!(error instanceof AxiosError)) return
      console.error(error.response?.data.message)
    }
  }

  return (
    <ConfirmationModal
      title={
        <span>
          Você tem certeza de que deseja apagar <strong>"{worker.full_name}"</strong>?
        </span>
      }
      description="Esta ação não pode ser desfeita. Isso excluirá permanentemente o funcionário."
      variant={'destructive'}
      actionButtonLabel="Apagar"
      onAction={() => void onDeleteWorker(worker)}
    >
      <Button
        data-tooltip-id={`delete-worker-${worker.id}`}
        data-tooltip-content={`Apagar "${worker.full_name}"`}
        variant="destructive"
        size="icon"
      >
        <TrashIcon className="w-4 h-4" />
      </Button>
      <Tooltip id={`delete-worker-${worker.id}`} place="top" />
    </ConfirmationModal>
  )
}
