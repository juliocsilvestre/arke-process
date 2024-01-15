import * as z from 'zod'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import CarvaLogo from '../assets/carvalogo.svg'
import { Label } from '@components/ui/Label'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/Form'

import { TrashIcon } from '@heroicons/react/24/solid'

const CPF_REGEXP = /^(\d{3}.?\d{3}.?\d{3}-?\d{2})$/

const SignInSchema = z.object({
  cpf: z.string().refine(
    (cpf) => {
      return CPF_REGEXP.test(cpf.toString())
    },
    {
      message: 'Credenciais inválidas',
    },
  ),
  password: z.string().min(10, {
    message: 'Credenciais inválidas',
  }),
})

export const SignIn = () => {
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      cpf: '',
      password: '',
    },
  })

  const onSubmitSignIn = (values: z.infer<typeof SignInSchema>) => {
    console.log(values)
  }
  return (
    <div className="w-[490px] py-[60px] px-10 rounded-lg bg-white flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitSignIn)} className="space-y-8">
          <div className="flex items-center justify-center mb-8">
            <CarvaLogo />
          </div>
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="cpf" label="CPF" />
                <FormControl>
                  <Input id="cpf" placeholder="Insira seu CPF" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="password" label="Senha" />
                <FormControl>
                  <Input id="password" placeholder="••••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="secondary" size="lg" className="w-full">
            Entrar
          </Button>
        </form>
      </Form>
    </div>
  )
}
