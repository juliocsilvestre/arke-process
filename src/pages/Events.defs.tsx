import { ColumnDef } from '@tanstack/react-table'
import { Tooltip } from 'react-tooltip'
import { z } from 'zod'

import { formatDate } from '@utils/constants'
import { Button } from '@/components/ui/Button'
import { TrashIcon } from '@heroicons/react/24/solid'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { useDeleteEvent } from '@/api/mutations/events.mutation'


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

const _DeleteEventButton = ({ event }: { event: Event }) => {
  const { mutateAsync: deleteEvent } = useDeleteEvent()

  const onDeleteEvent = async (event: Event): Promise<void> => {
    try {
      await deleteEvent(event.id)
      toast.success(<p>O evento "{event.name}" foi excluído com sucesso!</p>)
    } catch (error: unknown) {
      if (!(error instanceof AxiosError)) return
      console.error(error.response?.data.message)
    }
  }

  return (
    <ConfirmationModal
      title={
        <span>
          Você tem certeza de que deseja apagar <strong>"{event.name}"</strong>?
        </span>
      }
      description="Esta ação não pode ser desfeita. Isso excluirá permanentemente o evento e seus dias."
      variant={'destructive'}
      actionButtonLabel="Apagar"
      onAction={() => void onDeleteEvent(event)}
    >
      <Button
        data-tooltip-id={`delete-event-${event.id}`}
        data-tooltip-content={`Apagar "${event.name}"`}
        variant="destructive"
        size="icon"
      >
        <TrashIcon className="w-4 h-4" />
      </Button>
      <Tooltip id={`delete-event-${event.id}`} place="top" />
    </ConfirmationModal>
  )
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
  {
    header: 'Ações',
    id: 'actions',
    cell: ({ row }) => {
      const event = row.original

      return (
        <div className="flex justify-start">
          <_DeleteEventButton event={event} />
        </div>
      )
    },
  },
]
