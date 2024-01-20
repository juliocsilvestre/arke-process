import { indexCompaniesQueryOptions } from '@/api/queries/companies.query'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CEP_REGEXP, CPF_REGEXP, PHONE_REGEXP, UF_LIST, WORKER_STATUS, WORKER_STATUS_MAPPER } from '@/utils/constants'
import { QrCodeIcon } from '@heroicons/react/24/solid'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
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

export interface Worker {
  id: string
  full_name: string
  cpf: string
  rg: string
  email: string
  phone_number: string
  picture_url: string
  status: string

  company_id: string
  role: string

  admin_id: string
  created_at: string
  updated_at: string
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

      const { data: companies } = useQuery(indexCompaniesQueryOptions)
      const companyName = companies?.data.companies?.data.find(
        (company: Company) => company.id === worker.company_id,
      )?.name

      return <span>{companyName}</span>
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

      return <Badge variant={WORKER_STATUS_MAPPER[worker.status].color}>{worker.status}</Badge>
    },
  },
  {
    header: 'Ações',
    id: 'actions',
    cell: ({ row }) => {
      const worker = row.original

      return (
        <div className="flex justify-start">
          {/* TODO: create actions */}
          <Button
            size="icon"
            onClick={(event) => {
              event.stopPropagation()
              // TODO: Generate QR CODE
              console.log('QR CODE')
            }}
          >
            <QrCodeIcon className="w-6 h-6" />
          </Button>
        </div>
      )
    },
  },
]
