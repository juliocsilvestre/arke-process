import { CEP_REGEXP, CPF_REGEXP, PHONE_REGEXP, UF, UF_LIST, WORKER_STATUS, WorkerStatus } from '@/utils/constants'
import { z } from 'zod'

export const EditWorkerSchema = z.object({
  full_name: z.string().min(2, { message: 'Nome deve conter pelo menos 2 caracteres.' }),
  cpf: z.string().refine(
    (v) => {
      return CPF_REGEXP.test(v.toString())
    },
    { message: 'CPF inválido' },
  ),
  rg: z.any(),
  role: z.string().min(2, { message: 'Cargo inválido.' }),

  email: z.string().optional(),
  phone_number: z.optional(
    z.string().refine(
      (v) => {
        return PHONE_REGEXP.test(v.toString()) || v === ''
      },
      { message: 'Celular inválido' },
    ),
  ),
  issuing_agency: z.string().optional(),
  issuing_state: z.optional(z.nativeEnum(UF_LIST)),
  issuing_date: z.string().optional(),
  emergency_name: z.string().optional(),
  emergency_number: z.optional(
    z.string().refine(
      (v) => {
        return PHONE_REGEXP.test(v.toString())
      },
      { message: 'Celular inválido' },
    ),
  ),
  status: z.nativeEnum(WORKER_STATUS),
  company_id: z.string().uuid({ message: 'Empresa inválida.' }).min(1, { message: 'Empresa inválida.' }),
  street: z.optional(z.string().min(2, { message: 'Rua deve conter pelo menos 2 caracteres.' })),
  complement: z.string().optional(),
  number: z.optional(z.number().min(1, { message: 'Número inválido.' })),
  picture: z.any(),
  city: z.optional(z.string().min(2, { message: 'Cidade inválida.' })),
  uf: z.optional(z.nativeEnum(UF_LIST)),
  cep: z.optional(
    z.string().refine(
      (v) => {
        return CEP_REGEXP.test(v.toString())
      },
      {
        message: 'CEP inválido',
      },
    ),
  ),
  neighborhood: z.optional(z.string().min(2, { message: 'Bairro inválido.' })),
})
export type EditWorkerBody = z.infer<typeof EditWorkerSchema>

export interface WorkerDetails {
  id: string | undefined
  full_name: string | undefined
  email: string | undefined
  cpf: string | undefined
  rg: string | undefined
  role: string | undefined
  phone_number: string | undefined
  picture_url: string | undefined
  status: WorkerStatus | undefined
  company_id: string | undefined
  admin_id: string | undefined
  issuing_agency: string | undefined
  issuing_state: UF | undefined
  issuing_date: string | undefined
  emergency_name: string | undefined
  emergency_number: string | undefined
  created_at: string | undefined
  updated_at: string | undefined
  company: {
    id: string | undefined
    cnpj: string | undefined
    name: string | undefined
    admin_id: string | undefined
    created_at: string | undefined
    updated_at: string | undefined
  }
  address: {
    id: string | undefined
    cep: string | undefined
    city: string | undefined
    uf: UF
    neighborhood: string | undefined
    street: string | undefined
    number: number | undefined
    complement: string | undefined
    worker_id: string | undefined
    created_at: string | undefined
    updated_at: string | undefined
  }
}

export interface SingleWorkerResponse {
  data: WorkerDetails
}

export const editWorkerInitialValues = (worker: SingleWorkerResponse) => {
  const initialValues = {
    full_name: worker?.data.full_name,
    cpf: worker?.data.cpf,
    rg: worker?.data.rg ?? undefined,
    phone_number: worker?.data.phone_number ?? undefined,
    email: worker?.data.email ?? undefined,
    picture: worker?.data.picture_url,
    status: worker?.data.status,
    issuing_agency: worker?.data.issuing_agency,
    issuing_state: worker?.data.issuing_state ?? undefined,
    issuing_date: worker?.data.issuing_date,
    emergency_name: worker?.data.emergency_name,
    emergency_number: worker?.data.emergency_number,
    role: worker?.data.role,
    company_id: worker?.data.company?.id,
    street: worker?.data?.address?.street,
    complement: worker?.data?.address?.complement,
    number: worker?.data?.address?.number,
    cep: worker?.data?.address?.cep,
    neighborhood: worker?.data?.address?.neighborhood,
    city: worker?.data?.address?.city,
    uf: worker?.data?.address?.uf,
  }

  return initialValues
}
