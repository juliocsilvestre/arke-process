import { CEP_REGEXP, CPF_REGEXP, PHONE_REGEXP, UF_LIST, WORKER_STATUS } from '@/utils/constants'
import { z } from 'zod'

export const CreateWorkerSchema = z.object({
  full_name: z.string().min(2, { message: 'Nome deve conter pelo menos 2 caracteres.' }),
  email: z.union([z.string().email({ message: 'Email inválido.' }), z.literal('')]),
  cpf: z.string().refine(
    (v) => {
      return CPF_REGEXP.test(v.toString())
    },
    { message: 'CPF inválido' },
  ),
  rg: z.string(),
  phone_number: z.string().refine(
    (v) => {
      return PHONE_REGEXP.test(v.toString())
    },
    { message: 'Celular inválido' },
  ),
  role: z.string().min(2, { message: 'Cargo inválido.' }),
  status: z.nativeEnum(WORKER_STATUS),
  company_id: z.string().uuid({ message: 'Empresa inválida.' }).min(1, { message: 'Empresa inválida.' }),
  street: z.string().min(2, { message: 'Rua deve conter pelo menos 2 caracteres.' }),
  complement: z.string(),
  number: z.number().min(1, { message: 'Número inválido.' }),
  picture: z.any(),
  city: z.string().min(2, { message: 'Cidade inválida.' }),
  uf: z.nativeEnum(UF_LIST),
  cep: z.string().refine(
    (v) => {
      return CEP_REGEXP.test(v.toString())
    },
    {
      message: 'CEP inválido',
    },
  ),
  neighborhood: z.string().min(2, { message: 'Bairro inválido.' }),
})

export type CreateWorkerBody = z.infer<typeof CreateWorkerSchema>

export const workerInitialValues: CreateWorkerBody = {
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
}

export interface WorkerSheet {
  Bairro: string
  CEP: string
  CPF: string
  Cargo: string
  Cidade: string
  Complemento: string
  'E-mail': string
  'Nome completo': string
  Número: string
  RG: string
  Rua: string
  'Telefone/Whatsapp': string
  UF: string
}

export interface CreateWorkerRow {
  full_name: string
  cpf: string
  rg: string
  email: string
  phone_number: string
  picture_url: string
  role: string
  status: string
  address: {
    street: string
    complement: string
    cep: string
    city: string
    neighborhood: string
    number: string
    uf: string
  }
}

export const workersSheetMapper = (sheet: WorkerSheet[]): CreateWorkerRow[] => {
  return sheet.map((row) => {
    return {
      full_name: row['Nome completo'],
      cpf: row.CPF,
      rg: row.RG,
      email: row['E-mail'],
      phone_number: row['Telefone/Whatsapp'],
      picture_url: '',
      role: row.Cargo,
      status: WORKER_STATUS.active,
      address: {
        street: row.Rua,
        complement: row.Complemento,
        cep: row.CEP,
        city: row.Cidade,
        neighborhood: row.Bairro,
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        number: row['Número'],
        uf: row.UF,
      },
    }
  })
}
