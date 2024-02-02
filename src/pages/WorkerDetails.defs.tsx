import { CEP_REGEXP, CPF_REGEXP, PHONE_REGEXP, UF, UF_LIST, WORKER_STATUS, WorkerStatus } from '@/utils/constants'
import { z } from 'zod'

export const EditWorkerSchema = z.object({
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
  issuing_agency: z.string(),
  issuing_state: z.nativeEnum(UF_LIST),
  issuing_date: z.string(),
  emergency_name: z.string(),
  emergency_number: z.string().refine(
    (v) => {
      return PHONE_REGEXP.test(v.toString())
    },
    { message: 'Celular inválido' },
  ),
  status: z.nativeEnum(WORKER_STATUS),
  company_id: z.string().uuid({ message: 'Empresa inválida.' }).min(1, { message: 'Empresa inválida.' }),
  street: z.string().min(2, { message: 'Rua deve conter pelo menos 2 caracteres.' }),
  complement: z.string(),
  number: z.number().min(1, { message: 'Número inválido.' }),
  picture: z.any(),
  city: z.string().min(2, { message: 'Cidade inválida.' }),
  uf: z.nativeEnum(UF_LIST) || z.string(),
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
  issuing_state: UF
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
    rg: worker?.data.rg,
    phone_number: worker?.data.phone_number,
    email: worker?.data.email,
    picture: worker?.data.picture_url,
    status: worker?.data.status,
    issuing_agency: worker?.data.issuing_agency,
    issuing_state: worker?.data.issuing_state,
    issuing_date: worker?.data.issuing_date,
    emergency_name: worker?.data.emergency_name,
    emergency_number: worker?.data.emergency_number,
    role: worker?.data.role,
    company_id: worker?.data.company?.id,
    street: worker?.data.address.street,
    complement: worker?.data.address.complement,
    number: worker?.data.address.number,
    cep: worker?.data.address.cep,
    neighborhood: worker?.data.address.neighborhood,
    city: worker?.data.address.city,
    uf: worker?.data.address.uf,
  }

  return initialValues
}
