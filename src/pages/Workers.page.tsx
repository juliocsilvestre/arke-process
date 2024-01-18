import { useCreateWorker } from '@/api/mutations/workers.mutation'
import { indexCompaniesQueryOptions } from '@/api/queries/companies.query'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { SlideOver, SlideOverFooter } from '@/components/ui/Slideover'
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE, NAVIGATION, UF_LIST } from '@/utils/constants'
import { maskCEP, maskCPF, maskPhoneNumber } from '@/utils/strings'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@components/ui/Form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@components/ui/Select'
import { PlusIcon, UserIcon } from '@heroicons/react/24/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Company } from './Companies.defs'
import { CreateWorkerBody, CreateWorkerSchema } from './Workers.defs'

export const WorkersPage = (): JSX.Element => {
  const { latestLocation } = useRouter()
  const [picturePreview, setPicturePreview] = useState<File | null>(null)
  const [previewImageURL, setPreviewImageURL] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<CreateWorkerBody>({
    resolver: zodResolver(CreateWorkerSchema),
    defaultValues: {
      full_name: '',
      cpf: '',
      rg: '',
      email: '',
      phone_number: '',
      picture: '',
      company_id: '',
      role: '',
      status: 'active',
      street: '',
      complement: '',
      cep: '',
      city: '',
      neighborhood: '',
      number: 0,
      uf: 'AC',
    },
  })

  const { mutateAsync: createWorker } = useCreateWorker()

  const onCreateCompany = useCallback(
    async (values: CreateWorkerBody): Promise<void> => {
      try {
        console.log('@@@PREVIEW', picturePreview)
        if (picturePreview instanceof File) {
          await createWorker({ ...values, picture: picturePreview })
          form.reset()
          handleOnClose()
          toast.success(
            Array.isArray(values) && values.length > 0 ? (
              <p>{values.length} funcionários foram criados com sucesso!</p>
            ) : (
              <p>
                O funcionário <strong>{values.full_name}</strong> foi criado com sucesso!
              </p>
            ),
          )
        }
      } catch (error: unknown) {
        if (!(error instanceof AxiosError)) return

        // biome-ignore lint/correctness/noUnsafeOptionalChaining: <explanation>
        for (const e of error.response?.data.errors) {
          console.error(e)
          form.setError(e.field, { message: e.message })
          toast.error(
            <p>
              Alguma coisa deu errado com o campo <strong>{e.field}</strong>: <strong>{e.message}</strong>
            </p>,
          )
        }
      }
    },
    [picturePreview, form, createWorker],
  )

  const handleOnClose = () => {
    setIsOpen(false)
    form.reset()
  }

  const { data: companies } = useQuery(indexCompaniesQueryOptions)

  useEffect(() => {
    // transform File into URL to use on <img> component
    console.log(picturePreview)

    if (picturePreview instanceof File) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImageURL(reader.result as string)
      }
      reader.readAsDataURL(picturePreview)
    }
  }, [picturePreview])
  return (
    <section className="bg-gray-50 min-h-screen overflow-y-auto p-4 md:p-10">
      <div className="mx-auto flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-4xl text-primary font-bold">
          {NAVIGATION.find((n) => n.href === latestLocation.pathname)?.name ?? ''}
        </h1>

        <Button variant="default" size="sm" className="mt-4" onClick={() => setIsOpen(true)}>
          <PlusIcon className="h-6 w-6" aria-hidden="true" />
          Novo funcionário
        </Button>
      </div>

      <section className="mt-[14%]">
        <div className="w-full h-[500px] bg-gray-200">,</div>
      </section>

      <SlideOver
        title="Novo funcionário"
        subtitle="Preencha os campos abaixo para criar um novo funcionário."
        isOpen={isOpen}
        classNames="max-w-4xl"
        close={handleOnClose}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCreateCompany)} className="h-full flex flex-col gap-2 justify-between">
            <div className="px-5 py-6 flex flex-col gap-y-5">
              <h4 className="text-2xl text-primary font-bold">Dados pessoais</h4>

              <div className="flex flex-row-reverse gap-2">
                <div className="flex flex-col items-center">
                  {previewImageURL ? (
                    <img
                      src={previewImageURL}
                      alt="Foto do funcionário"
                      className="mx-auto w-[185px] h-[185px] object-cover object-center rounded-full border border-solid border-primary-500 mb-1 shadow-lg"
                    />
                  ) : (
                    <div className="relative mx-auto w-[185px] h-[185px] object-cover object-center rounded-full border border-solid border-primary-500 mb-1 shadow-lg bg-gray-200">
                      <UserIcon
                        className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-20 w-20 text-gray-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="picture"
                    render={({ field }) => (
                      <FormItem className="w-[100%]">
                        <Label htmlFor="picture" label="Foto" />
                        <FormControl>
                          <Input
                            id="picture"
                            placeholder="Insira a foto"
                            {...field}
                            type="file"
                            size="md"
                            className="h-[42px]"
                            onChange={(event) => {
                              const picture = event.target.files?.[0]
                              if (picture) {
                                if (picture.size > MAX_FILE_SIZE) {
                                  form.setError('picture', {
                                    message: 'O arquivo deve ter no máximo 2MB.',
                                  })
                                  return
                                }

                                if (!ACCEPTED_IMAGE_TYPES.includes(picture.type)) {
                                  form.setError('picture', {
                                    message: 'O arquivo deve ser uma imagem.',
                                  })

                                  return
                                }
                                form.clearErrors('picture')

                                setPicturePreview(picture)
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-[80%]">
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem className="w-[100%]">
                          <Label htmlFor="full_name" label="Nome Completo" isRequired />
                          <FormControl>
                            <Input id="full_name" placeholder="Insira o nome completo" {...field} size="lg" />
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
                          <Label htmlFor="cpf" label="CPF" isRequired />
                          <FormControl>
                            <Input
                              id="cpf"
                              placeholder="Insira seu CPF"
                              {...field}
                              size="lg"
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
                          <Label htmlFor="rg" label="RG" isRequired />
                          <FormControl>
                            <Input
                              id="rg"
                              placeholder="Insira seu RG"
                              {...field}
                              size="lg"
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
                            <Input id="email" placeholder="Insira seu e-mail" {...field} size="lg" />
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
                          <Label htmlFor="phone_number" label="Celular/Whatsapp" isRequired />
                          <FormControl>
                            <Input
                              id="phone_number"
                              placeholder="Insira seu celular/whatsapp"
                              {...field}
                              size="lg"
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
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="company_id"
                      render={({ field }) => (
                        <FormItem className="w-[50%]">
                          <Label htmlFor="company_id" label="Empresa" isRequired />
                          <FormControl>
                            <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Empresa" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {companies?.data.companies.data.map((company: Company) => (
                                    <SelectItem key={company.id} value={company.id}>
                                      {company.name}
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
                      name="role"
                      render={({ field }) => (
                        <FormItem className="w-[50%]">
                          <Label htmlFor="role" label="Função" isRequired />
                          <FormControl>
                            <Input id="role" placeholder="Insira a função" {...field} size="lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <h4 className="text-2xl text-primary font-bold">Endereço</h4>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem className="w-[20%]">
                      <Label htmlFor="cep" label="CEP" isRequired />
                      <FormControl>
                        <Input
                          id="cep"
                          placeholder="Insira o CEP"
                          {...field}
                          size="lg"
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
                      <Label htmlFor="street" label="Rua" isRequired />
                      <FormControl>
                        <Input id="street" placeholder="Insira a rua" {...field} size="lg" />
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
                      <Label htmlFor="number" label="Número" isRequired />
                      <FormControl>
                        <Input
                          id="number"
                          placeholder="Insira o número"
                          {...field}
                          size="lg"
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
                      <Label htmlFor="neighborhood" label="Bairro" isRequired />
                      <FormControl>
                        <Input id="neighborhood" placeholder="Insira o bairro" {...field} size="lg" />
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
                        <Input id="complement" placeholder="Insira o complemento" {...field} size="lg" />
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
                      <Label htmlFor="city" label="Cidade" isRequired />
                      <FormControl>
                        <Input id="city" placeholder="Insira a cidade" {...field} size="lg" />
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
                      <Label htmlFor="uf" label="UF" isRequired />
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
            {/* <div className="relative px-4">
              <p className="absolute top-[50%] translate-y-[-50%] bg-white px-2 z-40 left-[50%] translate-x-[-50%]">
                Ou
              </p>
              <Separator className="absolute top-[50%] translate-y-[-50%]" />
            </div> */}

            <SlideOverFooter>
              <div className="flex flex-shrink-0 justify-end px-4 py-4 bg-white gap-2">
                <Button type="button" variant="outline" onClick={handleOnClose}>
                  Cancelar
                </Button>
                <Button variant="default" type="submit">
                  Criar funcionário
                </Button>
              </div>
            </SlideOverFooter>
          </form>
        </Form>
      </SlideOver>
    </section>
  )
}
