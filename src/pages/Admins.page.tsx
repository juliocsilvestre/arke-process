import { useCreateAdmin } from '@/api/mutations/admin.mutation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { SlideOver, SlideOverFooter } from '@/components/ui/Slideover'
import { NAVIGATION } from '@/utils/constants'
import { maskCPF } from '@/utils/strings'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@components/ui/Form'
import { PlusIcon } from '@heroicons/react/24/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CreateAdminBody, CreateAdminSchema } from './Admins.defs'

export const AdminsPage = (): JSX.Element => {
  const { latestLocation } = useRouter()

  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<CreateAdminBody>({
    resolver: zodResolver(CreateAdminSchema),
    defaultValues: {
      name: '',
      cpf: '',
      email: '',
      password: '',
    },
  })

  const { mutateAsync: createAdmin } = useCreateAdmin()

  const onSignUp = async (values: CreateAdminBody): Promise<void> => {
    try {
      await createAdmin(values)
      form.reset()
      handleOnClose()
      toast.success(
        <p>
          O administrador <strong>{values.name}</strong> foi criado com sucesso!
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
  }

  return (
    <section className="bg-gray-50 min-h-screen overflow-y-auto p-4 md:p-10">
      <div className="mx-auto flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-4xl text-primary font-bold">
          {NAVIGATION.find((n) => n.href === latestLocation.pathname)?.name ?? ''}
        </h1>

        <Button variant="default" size="sm" className="mt-4" onClick={() => setIsOpen(true)}>
          <PlusIcon className="h-6 w-6" aria-hidden="true" />
          Novo administrador
        </Button>
      </div>

      <section className="mt-[14%]">
        <div className="w-full h-[500px] bg-gray-200">,</div>
      </section>

      <SlideOver
        title="Novo administrador"
        subtitle="Administradores podem gerenciar eventos, funcionários, fornecedores e muito mais."
        isOpen={isOpen}
        close={handleOnClose}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSignUp)} className="h-full flex flex-col gap-2 justify-between">
            <div className="px-5 py-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name" label="Nome" isRequired />
                    <FormControl>
                      <Input id="name" placeholder="Insira seu nome" {...field} size="lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
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
                name="cpf"
                render={({ field }) => (
                  <FormItem>
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password" label="Senha" isRequired />
                    <FormControl>
                      <Input id="password" type="password" placeholder="••••••••••" {...field} size="lg" />
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
                  Criar administrador
                </Button>
              </div>
            </SlideOverFooter>
          </form>
        </Form>
      </SlideOver>
    </section>
  )
}
