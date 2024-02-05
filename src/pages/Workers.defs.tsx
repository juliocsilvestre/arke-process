import { Badge } from '@/components/ui/Badge'
import { CEP_REGEXP, CPF_REGEXP, PHONE_REGEXP, UF_LIST, WORKER_STATUS, WORKER_STATUS_MAPPER } from '@/utils/constants'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { z } from 'zod'
import { Company } from './Companies.defs'

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

export const CreateWorkerSchemaWithOptionalFields = z.object({
  ...CreateWorkerSchema.shape,
  cpf: z
    .string()
    .refine(
      (v) => {
        return CPF_REGEXP.test(v.toString())
      },
      { message: 'CPF inválido' },
    )
    .optional(),
  rg: z.string().optional(),
  email: z.union([z.string().email({ message: 'Email inválido.' }), z.literal('')]).optional(),
  issuing_agency: z.string().optional(),
  issuing_state: z.nativeEnum(UF_LIST).optional(),
  issuing_date: z.string().optional(),
})

export type CreateWorkerBody = z.infer<typeof CreateWorkerSchema>
export type WorkerBodyKeys = keyof CreateWorkerBody

export type BulkWorkerBodyKeys = z.infer<typeof CreateWorkerSchemaWithOptionalFields>

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
  issuing_agency: '',
  issuing_state: 'AC',
  issuing_date: '',
  emergency_name: '',
  emergency_number: '',
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
  Número: string
  RG: string
  Rua: string
  UF: string
  'URL da foto': string
  'E-mail': string
  'Nome completo': string
  'Orgão emissor': string
  'Local de emissão': string
  'Data de emissão': string
  'Nome do contato de emergência': string
  'Telefone celular do contato de emergência': string
  'Telefone/Whatsapp': string
}

export interface Worker {
  id: string
  full_name: string
  cpf: string
  rg: string
  email: string
  issuing_agency: string
  issuing_state: string
  issuing_date: string
  emergency_name: string
  emergency_number: string
  phone_number: string
  picture_url: string
  status: string

  company: Company
  company_id: string
  role: string

  admin_id: string
  created_at: string
  updated_at: string
}

export interface CreateWorkerRow {
  full_name: string
  cpf?: string
  rg?: string
  email?: string
  phone_number: string
  picture_url: string
  role: string
  status: string
  issuing_agency?: string
  issuing_state?: string
  issuing_date?: string
  emergency_name: string
  emergency_number: string
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
      picture_url: row['URL da foto'],
      role: row.Cargo,
      status: WORKER_STATUS.active,
      issuing_agency: row['Orgão emissor'],
      issuing_state: row['Local de emissão'],
      issuing_date: row['Data de emissão'] ? format(row['Data de emissão'], 'yyyy-MM-dd') : undefined,
      emergency_name: row['Nome do contato de emergência'],
      emergency_number: row['Telefone celular do contato de emergência'],

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

export const workersColumns: ColumnDef<Worker>[] = [
  {
    accessorKey: 'full_name',
    header: 'Nome completo',
  },
  {
    accessorKey: 'cpf',
    header: 'CPF',
  },
  {
    accessorKey: 'company_id',
    header: 'Fornecedor',
    cell: ({ row }) => {
      const worker = row.original

      return <span>{worker.company?.name ?? '-'}</span>
    },
  },
  {
    accessorKey: 'role',
    header: 'Cargo',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const worker = row.original

      return (
        <Badge variant={WORKER_STATUS_MAPPER[worker.status].color}>{WORKER_STATUS_MAPPER[worker.status].label}</Badge>
      )
    },
  },
]
