import { Badge } from '@/components/ui/Badge'
import { WORKER_STATUS_MAPPER } from '@/utils/constants'
import { ColumnDef } from '@tanstack/react-table'
import { z } from 'zod'
import { Admin } from './Admins.defs'
import { Worker } from './Workers.defs'

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
      return (
        <Badge variant={WORKER_STATUS_MAPPER[worker.status].color}>{WORKER_STATUS_MAPPER[worker.status].label}</Badge>
      )
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

export const ReplacementSchema = z.object({
  event_id: z.string(),
  event_day_id: z.string(),
  new_worker_id: z.string(),
  worker_id: z.string(),
})

export type ReplacementBody = z.infer<typeof ReplacementSchema>
export type ReplacementKeys = keyof ReplacementBody

export type Replacement = {
  admin_id: string
  created_at: string
  event_day_id: string
  id: string
  newWorker: Worker
  new_worker_id: string
  replacedBy: Admin
  worker: Worker
  worker_id: string
}
