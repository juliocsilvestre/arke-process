import { Badge } from '@/components/ui/Badge'
import { WORKER_STATUS_MAPPER } from '@/utils/constants'
import { ColumnDef } from '@tanstack/react-table'
import { Worker } from './Workers.defs'
import { z } from 'zod'

export type EventDay = {
  id: string
  event_id: string
  date: Date
  created_at: string
  updated_at: string
}

export const workersByEventDayColumns: ColumnDef<Worker>[] = [
  {
    accessorKey: 'full_name',
    header: 'Nome completo',
  },
  {
    accessorKey: 'company_id',
    header: 'Fornecedor',
    cell: ({ row }) => {
      const worker = row.original

      return <span>{worker.company?.name}</span>
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
