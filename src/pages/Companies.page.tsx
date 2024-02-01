import { useDebounceSearch } from '@/hooks/useDebounceSearch'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@components/ui/Form'
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useCreateCompany, useUpdateCompany } from '@/api/mutations/companies.mutation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { SlideOver, SlideOverFooter } from '@/components/ui/Slideover'
import { NAVIGATION } from '@/utils/constants'
import { maskCNPJ } from '@/utils/strings'

import { indexCompaniesQueryOptions } from '@/api/queries/companies.query'
import { DataTable } from '@/components/ui/DataTable'
import { checkError } from '@/utils/errors'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  Company,
  CompanyBodyKeys,
  CreateCompanyBody,
  CreateCompanySchema,
  DeleteCompanyButton,
  companiesColumns,
} from './Companies.defs'

export const CompaniesPage = (): JSX.Element => {
  const { latestLocation, navigate } = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [queryString, setQueryString] = useState('')
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null)

  const form = useForm<CreateCompanyBody>({
    resolver: zodResolver(CreateCompanySchema),
    defaultValues: {
      name: '',
      cnpj: '',
    },
  })

  const { mutateAsync: createCompany } = useCreateCompany()
  const { mutateAsync: updateCompany } = useUpdateCompany()

  const filterByDebouncedSearchTerm = (debouncedSearchTerm: string) => {
    navigate({ params: '', search: (prev) => ({ ...prev, q: debouncedSearchTerm }) })
  }

  useDebounceSearch({ searchTerm: queryString, callback: filterByDebouncedSearchTerm })

  const search = useSearch({ from: '/dashboard-layout/dashboard/fornecedores' }) as { q: string; page: string }

  const options = indexCompaniesQueryOptions(search)
  const { data: companies } = useSuspenseQuery(options)

  const onCreateCompany = useCallback(
    async (values: CreateCompanyBody): Promise<void> => {
      try {
        if (companyToEdit) {
          await updateCompany({ ...values, id: companyToEdit.id })
        } else {
          await createCompany(values)
        }

        form.reset()
        handleOnClose()
        toast.success(
          <p>
            O fornecedor <strong>{values.name}</strong> foi {companyToEdit ? 'atualizado' : 'criado'} com sucesso!
          </p>,
        )
      } catch (error: unknown) {
        const errors = checkError<CompanyBodyKeys>(error)
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
    [companyToEdit],
  )

  const handleOnClose = () => {
    form.reset()
    setCompanyToEdit(null)
    setIsOpen(false)
  }

  useEffect(() => {
    if (companyToEdit) {
      form.setValue('name', companyToEdit.name)
      form.setValue('cnpj', companyToEdit.cnpj)
    }
  }, [companyToEdit])

  return (
    <section className="bg-gray-50 min-h-screen overflow-y-auto p-4 md:p-10">
      <div className="mx-auto flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-4xl text-primary font-bold">
          {NAVIGATION.find((n) => n.href === latestLocation.pathname)?.name ?? ''}
        </h1>

        <Button variant="default" size="sm" className="mt-4" onClick={() => setIsOpen(true)}>
          <PlusIcon className="h-6 w-6" aria-hidden="true" />
          Novo fornecedor
        </Button>
      </div>

      <section className="mt-[30px]">
        <DataTable
          columns={companiesColumns}
          data={companies?.data.companies.data ?? []}
          count={companies?.data.companies_count}
          onQueryChange={(query) => setQueryString(query)}
          pages={companies?.data.companies.meta.last_page ?? 1}
          currentPage={companies?.data.companies.meta.current_page ?? 1}
          actions={(company) => {
            return (
              <div className="flex gap-2">
                <Button
                  size="icon"
                  onClick={() => {
                    setCompanyToEdit(company)
                    setIsOpen(true)
                  }}
                >
                  <PencilSquareIcon className="w-5" />
                </Button>
                <DeleteCompanyButton company={company} />
              </div>
            )
          }}
        />
      </section>

      <SlideOver
        title={companyToEdit ? 'Editar fornecedor' : 'Novo fornecedor'}
        subtitle={`Preencha os campos abaixo para ${companyToEdit ? 'editar o' : 'criar um novo'} fornecedor.`}
        isOpen={isOpen}
        close={handleOnClose}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCreateCompany)} className="h-full flex flex-col gap-2 justify-between">
            <div className="px-5 py-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name" label="Nome" isrequired />
                    <FormControl>
                      <Input id="name" placeholder="Insira seu nome" {...field} size="lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="cnpj" label="CNPJ" isrequired />
                    <FormControl>
                      <Input
                        id="cnpj"
                        placeholder="Insira seu CNPJ"
                        {...field}
                        size="lg"
                        onBlur={(event) => {
                          if (event.target.value) {
                            form.trigger('cnpj')
                          }
                        }}
                        onChange={(event) => {
                          const cnpj = maskCNPJ(event.target.value)
                          form.setValue('cnpj', cnpj)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SlideOverFooter>
              <div className="flex flex-shrink-0 justify-end px-4 py-4 bg-white gap-2">
                <Button type="button" variant="outline" onClick={handleOnClose}>
                  Cancelar
                </Button>
                <Button variant="default" type="submit">
                  {companyToEdit ? 'Salvar' : 'Criar fornecedor'}
                </Button>
              </div>
            </SlideOverFooter>
          </form>
        </Form>
      </SlideOver>
    </section>
  )
}
