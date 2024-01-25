import { ColumnDef } from '@tanstack/react-table'
import { z } from 'zod'
import { formatDate } from '@utils/constants'

export const CreateEventSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Nome deve conter pelo menos 2 caracteres.' })
    .max(50, { message: 'Nome deve conter no máximo 50 caracteres.' }),
  dates: z.object({
    from: z.date(),
    to: z.date(),
  }),
})

export type CreateEventBody = z.infer<typeof CreateEventSchema>

export type EventDay = {
  id: string
  event_id: string
  date: Date
  created_at: Date
  updated_at: Date
}

export interface Event {
  id: string
  name: string
  admin_id: string
  start_date: Date
  finish_date: Date
  days: EventDay[]
  created_at: Date
  updated_at: Date
  deleted_at: Date
}

export const eventsColumns: ColumnDef<Event>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'created_at',
    header: 'Criado em',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return formatDate(date)
    },
  },
  {
    accessorKey: 'first_day',
    header: 'Data de início',
    cell: ({ row }) => {
      const event = row.original

      const date = new Date(event?.start_date ?? null)
      return formatDate(date)
    },
  },
  {
    accessorKey: 'finish_day',
    header: 'Data de fim',
    cell: ({ row }) => {
      const event = row.original
      const date = new Date(event?.finish_date ?? null)
      return formatDate(date)
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Atualizado em',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updated_at'))
      return formatDate(date)
    },
  },
  // TODO: add actions
  // {
  //   header: 'Ações',
  //   id: 'actions',
  //   cell: ({ row }) => {
  //     const company = row.original

  //     return (
  //       <div className="flex justify-start">
  //         <_DeleteCompanyButton company={company} />
  //       </div>
  //     )
  //   },
  // },
]
