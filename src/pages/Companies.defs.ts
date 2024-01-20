import { CNPJ_REGEXP } from '@/utils/constants'
import { z } from 'zod'

export const CreateCompanySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Nome deve conter pelo menos 2 caracteres.' })
    .max(50, { message: 'Nome deve conter no máximo 50 caracteres.' }),
  cnpj: z.string().refine(
    (v) => {
      return CNPJ_REGEXP.test(v.toString())
    },
    { message: 'CNPJ inválido.' },
  ),
})

export type CreateCompanyBody = z.infer<typeof CreateCompanySchema>
export type CompanyBodyKeys = keyof CreateCompanyBody

export interface Company {
  id: string
  name: string
  cnpj: string
  admin_id: string
  created_at: string
  updated_at: string
}
