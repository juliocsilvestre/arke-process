import { CPF_REGEXP } from '@utils/constants'
import * as z from 'zod'

export const CreateAdminSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome deve conter pelo menos 3 caracteres.' })
    .max(50, { message: 'Nome deve conter no máximo 50 caracteres.' }),
  email: z.union([z.string().email(), z.literal('')]),
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

export type CreateAdminBody = z.infer<typeof CreateAdminSchema>
