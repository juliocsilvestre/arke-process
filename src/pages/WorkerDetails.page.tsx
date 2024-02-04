import { useActivateWorker, useBanishWorker, useEditWorker } from '@/api/mutations/workers.mutation'
import { useIndexCompanies } from '@/api/queries/companies.query'
import { getSingleWorkerQueryOptions, useGetAddresByCep } from '@/api/queries/workers.query'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/Command'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { SlideOver, SlideOverFooter } from '@/components/ui/Slideover'
import { queryClient } from '@/routes'
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE, UF_LIST, WORKER_STATUS, WORKER_STATUS_MAPPER } from '@/utils/constants'
import { checkError } from '@/utils/errors'
import { maskCEP, maskCPF, maskPhoneNumber } from '@/utils/strings'
import { cn } from '@/utils/styles'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@components/ui/Select'
import { ArrowPathIcon, CheckBadgeIcon, NoSymbolIcon, PaperClipIcon, UserIcon } from '@heroicons/react/24/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { Check, ChevronsUpDown, EditIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Company } from './Companies.defs'
import { EditWorkerBody, EditWorkerSchema, SingleWorkerResponse, editWorkerInitialValues } from './WorkerDetails.defs'
import { WorkerBodyKeys } from './Workers.defs'

export const WorkerDetailsPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [picturePreview, setPicturePreview] = useState<File | null>(null)
  const [previewImageURL, setPreviewImageURL] = useState<string>('')
  const [isCompanySelectOpen, setIsCompanySelectOpen] = useState(false)

  const workerId = useParams({
    from: '/dashboard-layout/dashboard/funcionarios/$id',
    select: (params) => params.id,
  })

  const { data: worker } = useQuery(getSingleWorkerQueryOptions(workerId))
  const { mutateAsync: editWorker } = useEditWorker(workerId)

  const { data: companies } = useIndexCompanies()

  const form = useForm<EditWorkerBody>({
    resolver: zodResolver(EditWorkerSchema),
    defaultValues: editWorkerInitialValues(worker as SingleWorkerResponse),
  })

  const onEditWorker = useCallback(
    async (values: EditWorkerBody): Promise<void> => {
      try {
        await editWorker({
          ...values,
          picture: picturePreview,
        })
        form.reset()
        handleOnClose()
        toast.success(
          <p>
            O funcionário <strong>{values.full_name}</strong> foi editado com sucesso!
          </p>,
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
    [picturePreview, form],
  )

  useEffect(() => {
    if (picturePreview instanceof File) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImageURL(reader.result as string)
      }
      reader.readAsDataURL(picturePreview)
    } else {
      setPreviewImageURL(worker?.data.picture_url)
    }
  }, [picturePreview])

  const { data } = useGetAddresByCep(form.watch('cep'))

  const cep = form.watch('cep')

  const handleOnClose = () => {
    setIsOpen(false)
    setPicturePreview(null)
    setPreviewImageURL('')
    form.reset()
  }

  useEffect(() => {
    if (cep.length !== 9) return

    if (Object.keys(data ?? {})?.length > 0) {
      form.setValue('street', data.logradouro)
      form.setValue('neighborhood', data.bairro)
      form.setValue('city', data.localidade)
      form.setValue('uf', data.uf)
    }
  }, [cep, data, form, worker])

  const { mutateAsync: doBanishWorker } = useBanishWorker()
  const { mutateAsync: doActivateWorker } = useActivateWorker()

  const handleBanishWorker = useCallback(async () => {
    try {
      if (worker?.data.id) {
        await doBanishWorker({ workerId })
        toast.success(
          <p>
            O funcionário <strong>{worker?.data.full_name}</strong> foi banido com sucesso!
          </p>,
        )

        queryClient.invalidateQueries(getSingleWorkerQueryOptions(workerId))
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(`Erro ao banir o funcionário: ${error.response?.data.message}`)
      }
    }
  }, [worker?.data])

  const handleActivateWorker = useCallback(async () => {
    try {
      if (worker?.data.id) {
        await doActivateWorker(workerId)
        toast.success(
          <p>
            O funcionário <strong>{worker?.data.full_name}</strong> foi reativado com sucesso!
          </p>,
        )

        queryClient.invalidateQueries(getSingleWorkerQueryOptions(workerId))
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(`Erro ao reativar o funcionário: ${error.response?.data.message}`)
      }
    }
  }, [worker?.data])

  return (
    <section className="bg-gray-50 min-h-screen overflow-y-auto p-4 md:p-10">
      <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center">
        <div className="flex flex-col justify-center items-center  md:flex-row md:justify-start md:items-center">
          <Avatar className="w-[136px] h-[136px]">
            <AvatarImage src={worker?.data.picture_url} />
            <AvatarFallback>
              {worker?.data.full_name
                .split(' ')
                .map((name: string[]) => name[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="mt-[8px] md:ml-[16px] md:mt-0">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <h1 className="text-center md:text-left text-3xl text-primary font-bold">{worker?.data.full_name}</h1>
                {worker?.data.status && WORKER_STATUS_MAPPER[worker.data.status] && (
                  <Badge variant={WORKER_STATUS_MAPPER[worker.data.status].color}>
                    {WORKER_STATUS_MAPPER[worker.data.status].label}
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="md:ml-[16px] text-primary-700 hover:text-primary-500 hover:bg-transparent focus-visible:ring-primary-600"
                onClick={() => setIsOpen(true)}
                disabled={!workerId}
              >
                <EditIcon className="h-7 w-7" aria-hidden="true" />
              </Button>
            </div>
            <h3 className="text-center md:text-left text-lg text-gray-500">
              {worker?.data.role} em <span>{worker?.data.company?.name}</span>
            </h3>
          </div>
        </div>

        {worker?.data.status === WORKER_STATUS.active ? (
          <Button variant="destructive" className="mt-4" onClick={handleBanishWorker}>
            <NoSymbolIcon className="h-6 w-6" aria-hidden="true" />
            Banir
          </Button>
        ) : (
          <Button variant="default" className="mt-4" onClick={handleActivateWorker}>
            <ArrowPathIcon className="h-6 w-6" aria-hidden="true" />
            Reativar
          </Button>
        )}
      </div>
      <div className="worker-body mt-[32px]">
        <div className="worker-body__header">
          <h2 className="text-center md:text-left text-2xl text-primary font-bold">Dados Pessoais</h2>
          <div className="grid grid-cols-1 justify-items-center md:justify-items-start md:grid-cols-2 2xl:grid-cols-3 gap-y-4 gap-x-3 mt-[16px]">
            <div className="md:text-left worker-detail-field">
              <Label
                label="Nome Completo"
                className="inline mr-[4px] md:mr-0 md:block text-lg text-primary-600 font-semibold"
              />
              <span className="text-gray-600 font-normal">{worker?.data.full_name}</span>
            </div>
            <div className="md:text-left worker-detail-field">
              <Label label="CPF" className="inline mr-[4px] md:mr-0 md:block text-lg text-primary-600 font-semibold" />
              <span className="text-gray-600 font-normal">{worker?.data.cpf}</span>
            </div>
            <div className="md:text-left worker-detail-field">
              <Label
                label="E-mail"
                className="inline mr-[4px] md:mr-0 md:block text-lg text-primary-600 font-semibold"
              />
              <span className="text-gray-600 font-normal">{worker?.data.email}</span>
            </div>
            <div className="md:text-left worker-detail-field">
              <Label label="RG" className="inline mr-[4px] md:mr-0 md:block text-lg text-primary-600 font-semibold" />
              <span className="text-gray-600 font-normal">{worker?.data.rg}</span>
            </div>
            <div className="md:text-left worker-detail-field">
              <Label
                label="Telefone"
                className="inline mr-[4px] md:mr-0 md:block text-lg text-primary-600 font-semibold"
              />
              <span className="text-gray-600 font-normal">{worker?.data.phone_number}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="worker-body mt-[32px]">
        <div className="worker-body__header">
          <h2 className="text-center md:text-left text-2xl text-primary font-bold">Endereço</h2>
          <div className="grid grid-cols-1 justify-items-center md:justify-items-start md:grid-cols-2 2xl:grid-cols-3 gap-y-2 gap-x-3 mt-[16px]">
            <div className="md:text-left worker-detail-field">
              <Label label="Rua" className="inline mr-[4px] md:mr-0 md:block text-lg text-primary-600 font-semibold" />
              <span className="text-gray-600 font-normal">{worker?.data.address.street}</span>
            </div>
            <div className="md:text-left worker-detail-field">
              <Label
                label="Complemento"
                className="inline mr-[4px] md:mr-0 md:block text-lg text-primary-600 font-semibold"
              >
                Complemento:
              </Label>
              <span className="text-gray-600 font-normal">{worker?.data.address.complement}</span>
            </div>
            <div className="md:text-left worker-detail-field">
              <Label label="UF" className="inline mr-[4px] md:mr-0 md:block text-lg text-primary-600 font-semibold" />
              <span className="text-gray-600 font-normal">{worker?.data.address.uf}</span>
            </div>
            <div className="md:text-left worker-detail-field">
              <Label label="CEP" className="inline mr-[4px] md:mr-0 md:block text-lg text-primary-600 font-semibold" />
              <span className="text-gray-600 font-normal">{worker?.data.address.cep}</span>
            </div>
            <div className="md:text-left worker-detail-field">
              <Label
                label="Bairro"
                className="inline mr-[4px] md:mr-0 md:block text-lg text-primary-600 font-semibold"
              />
              <span className="text-gray-600 font-normal">{worker?.data.address.neighborhood}</span>
            </div>
            <div className="md:text-left worker-detail-field">
              <Label
                label="Cidade"
                className="inline mr-[4px] md:mr-0 md:block text-lg text-primary-600 font-semibold"
              />
              <span className="text-gray-600 font-normal">{worker?.data.address.city}</span>
            </div>
          </div>
        </div>
      </div>
      <SlideOver
        title="Editar funcionário"
        subtitle="Edite os dados do funcionário."
        isOpen={isOpen}
        classNames="max-w-4xl"
        close={handleOnClose}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEditWorker)} className="h-full flex flex-col gap-2 justify-between">
            <div className="px-5 py-6 flex flex-col">
              <div className="flex flex-row gap-10">
                <div className="flex flex-col items-center">
                  <div className="w-full !shrink-0">
                    {previewImageURL || picturePreview ? (
                      <img
                        src={previewImageURL ?? picturePreview ?? ''}
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
                            label={picturePreview || previewImageURL ? 'Trocar foto' : 'Fazer upload de foto'}
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
                        <FormItem className="w-[100%]">
                          <Label htmlFor="full_name" label="Nome Completo" isrequired />
                          <FormControl>
                            <Input id="full_name" placeholder="Insira o nome completo" {...field} size="md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem className="w-[50%]">
                          <Label htmlFor="cpf" label="CPF" isrequired />
                          <FormControl>
                            <Input
                              id="cpf"
                              placeholder="Insira seu CPF"
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
                    <FormField
                      control={form.control}
                      name="rg"
                      render={({ field }) => (
                        <FormItem className="w-[50%]">
                          <Label htmlFor="rg" label="RG" isrequired />
                          <FormControl>
                            <Input
                              id="rg"
                              placeholder="Insira seu RG"
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
                  </div>

                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-[60%]">
                          <Label htmlFor="email" label="E-mail" />
                          <FormControl>
                            <Input id="email" placeholder="Insira seu e-mail" {...field} size="md" />
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
                              placeholder="Insira seu celular/whatsapp"
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
                                ? companies?.data.companies.data.find((company: Company) => company.id === field.value)
                                    ?.name
                                : 'Fornecedor'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[420px] p-0">
                          <Command className="w-full">
                            <CommandInput placeholder="Fornecedor..." className="w-full" />
                            <CommandEmpty>Fornecedor não encontrado.</CommandEmpty>
                            <CommandGroup>
                              {companies?.data.companies.data.map((company: Company) => (
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
                  Salvar
                </Button>
              </div>
            </SlideOverFooter>
          </form>
        </Form>
      </SlideOver>
    </section>
  )
}
