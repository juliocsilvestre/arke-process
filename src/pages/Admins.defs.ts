import { CPF_REGEXP } from '@/utils/constants'
import { z } from 'zod'

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Nome deve conter pelo menos 2 caracteres.' })
    .max(50, { message: 'Nome deve conter no máximo 50 caracteres.' }),
  email: z.union([z.string().email({ message: 'Email inválido.' }), z.literal('')]),
  cpf: z.string().refine(
    (v) => {
      console.log(v, CPF_REGEXP.test(v.toString()))
      return CPF_REGEXP.test(v.toString())
    },
    { message: 'CPF inválido' },
  ),
  password: z.string().min(10, {
    message: 'A senha deve conter pelo menos 10 caracteres.',
  }),
})

export type SignUpBody = z.infer<typeof SignUpSchema>
