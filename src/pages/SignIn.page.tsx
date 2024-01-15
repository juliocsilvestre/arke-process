import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@components/ui/Form'
import { Input } from '@components/ui/Input'
import { Label } from '@components/ui/Label'

import { maskCPF } from '@/utils/strings'
import Logo from '../assets/carvalogo.svg'

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
    <div className="w-[400px] mx-4 md:mx-0 py-[45px] px-8 rounded-lg bg-white flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitSignIn)} className="space-y-5">
          <div className="flex items-center justify-center mb-8 max-w-[70%] mx-auto">
            <img src={Logo} alt="Carvalheira, Criando Memórias" />
          </div>
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="cpf" label="CPF" />
                <FormControl>
                  <Input
                    id="cpf"
                    placeholder="Insira seu CPF"
                    {...field}
                    size="md"
                    onChange={(event) => {
                      const cpf = maskCPF(event.target.value)
                      form.setValue('cpf', cpf)
                    }}
                  />
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
                  <Input id="password" type="password" placeholder="••••••••••" {...field} size="md" />
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
