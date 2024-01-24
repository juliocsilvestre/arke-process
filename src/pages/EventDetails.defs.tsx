import { indexCompaniesQueryOptions } from '@/api/queries/companies.query'
import { Badge } from '@/components/ui/Badge'
import { WORKER_STATUS_MAPPER } from '@/utils/constants'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Company } from './Companies.defs'
import { z } from 'zod'

export type EventDay = {
  id: string
  event_id: string
  date: Date
  created_at: string
  updated_at: string
}

interface EventDayWithWorkers {
  id: string
  event_id: string
  full_name: string
  cpf: string
  company_id: string
  role: string
  status: string
}

export const workersByEventDayColumns: ColumnDef<EventDayWithWorkers>[] = [
  {
    accessorKey: 'full_name',
    header: 'Nome completo',
  },
  {
    accessorKey: 'company_id',
    header: 'Fornecedor',
    cell: ({ row }) => {
      const worker = row.original
      const { data: companies } = useQuery(indexCompaniesQueryOptions({ page: '1', q: '' }))
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
]

export const AttachWorkerToEventDaySchema = z.object({
  eventId: z.string(),
  workers_id: z.array(z.string()),
  event_day_id: z.string(),
})

export type AttachWorkerToEventDayBody = z.infer<typeof AttachWorkerToEventDaySchema>
export type AttachWorkerToEventDayKeys = keyof AttachWorkerToEventDayBody
