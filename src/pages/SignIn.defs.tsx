import { CPF_REGEXP } from '@utils/constants'
import * as z from 'zod'

export const SignInSchema = z.object({
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

export type SignInBody = z.infer<typeof SignInSchema>
export type SigninBodyKeys = keyof SignInBody
