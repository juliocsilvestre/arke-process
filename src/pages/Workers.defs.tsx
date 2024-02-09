import { Badge } from '@/components/ui/Badge'
import { CEP_REGEXP, CPF_REGEXP, PHONE_REGEXP, UF_LIST, WORKER_STATUS, WORKER_STATUS_MAPPER } from '@/utils/constants'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { z } from 'zod'
import { Company } from './Companies.defs'

export const CreateWorkerSchema = z.object({
  full_name: z.string().min(2, { message: 'Nome deve conter pelo menos 2 caracteres.' }),
  cpf: z.string().refine(
    (v) => {
      return CPF_REGEXP.test(v.toString())
    },
    { message: 'CPF inválido' },
  ),
  rg: z.any(),
  role: z.string().min(2, { message: 'Cargo inválido.' }),
  status: z.nativeEnum(WORKER_STATUS),
  company_id: z.string().uuid({ message: 'Empresa inválida.' }).min(1, { message: 'Empresa inválida.' }),

  email: z.optional(z.string().email({ message: 'Email inválido.' })),
  phone_number: z.any(),
  issuing_agency: z.optional(z.string()),
  issuing_state: z.optional(z.nativeEnum(UF_LIST)),
  issuing_date: z.optional(z.string()),
  emergency_name: z.optional(z.string()),
  emergency_number: z.optional(
    z.string().refine(
      (v) => {
        return PHONE_REGEXP.test(v.toString()) || v === ''
      },
      { message: 'Celular inválido' },
    ),
  ),
  street: z.string().optional(),
  complement: z.string().optional(),
  number: z.union([z.number().optional(), z.literal('')]),
  picture: z.any(),
  city: z.union([z.optional(z.string().min(2, { message: 'Cidade inválida.' })), z.literal('')]),
  uf: z.optional(z.nativeEnum(UF_LIST)),
  cep: z.union([
    z.optional(
      z.string().refine(
        (v) => {
          return CEP_REGEXP.test(v.toString()) || ''
        },
        {
          message: 'CEP inválido',
        },
      ),
    ),
    z.literal(''),
  ]),
  neighborhood: z.optional(z.string().min(2, { message: 'Bairro inválido.' })),
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
  email: z.optional(z.string().email({ message: 'Email inválido.' })),
  issuing_agency: z.optional(z.string()),
  issuing_state: z.optional(z.nativeEnum(UF_LIST)),
  issuing_date: z.string().optional(),
})

export type CreateWorkerBody = z.infer<typeof CreateWorkerSchema>
export type WorkerBodyKeys = keyof CreateWorkerBody

export type BulkWorkerBodyKeys = z.infer<typeof CreateWorkerSchemaWithOptionalFields>

export const workerInitialValues: CreateWorkerBody = {
  full_name: '',
  cpf: '',
  rg: undefined,
  company_id: '',
  role: '',
  status: 'active',

  phone_number: undefined,

  picture: undefined,
  email: undefined,
  issuing_agency: undefined,
  issuing_state: undefined,
  issuing_date: undefined,
  emergency_name: undefined,
  emergency_number: undefined,
  street: undefined,
  complement: undefined,
  cep: undefined,
  city: undefined,
  neighborhood: undefined,
  number: undefined,
  uf: undefined,
}

export interface WorkerSheet {
  Bairro: string
  CEP: string
  CPF: string
  Cargo: string
  Cidade: string
  Complemento: string
  Número: string
  RG: string | undefined
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
  rg: string | undefined
  email: string
  issuing_agency: string
  issuing_state: string | undefined
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
