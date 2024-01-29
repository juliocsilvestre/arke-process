import { cn } from '@/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/AlertDialog'
import { useIndexReplacementsPerEventDayQuery } from '@/api/queries/events.query'
import { useParams } from '@tanstack/react-router'
import { Replacement } from '@/pages/EventDetails.defs'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid'
import { Badge } from './ui/Badge'

const dialogVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-50 hover:bg-primary-700',
      destructive: 'bg-error-500 text-white hover:bg-error-600',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface ClockEntryModalProps extends VariantProps<typeof dialogVariants> {
  children: ReactNode
  title: ReactNode
  description?: ReactNode
  onAction?: () => void
  actionButtonLabel?: string
}
export const ClockEntryModal = ({
  children,
  title,
  description,
  actionButtonLabel,
  variant,
  onAction,
}: ClockEntryModalProps): JSX.Element => {
  const { id, day } = useParams({ from: '/dashboard-layout/dashboard/eventos/$id/dias/$day' })
  const { data } = useIndexReplacementsPerEventDayQuery({ eventDayId: day, eventId: id })

  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-[650px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold text-2xl text-primary-700">{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>

        <ul className="py-4 px-2 rounded-lg border border-gray-300 max-h-[400px] overflow-y-auto flex flex-col gap-2">
          {data?.data.replacements.data.map((replacement: Replacement) => (
            <li key={replacement.id} className="flex items-center gap-4 p-2">
              <div className="flex flex-col items-center justify-center">
                <time className="text-xs font-medium text-gray-400">
                  {new Date(replacement.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </time>
                <span className="text-xs text-gray-400">{replacement.replacedBy.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-md text-error-700">
                  {' '}
                  <Badge variant="error" size="md">
                    Sai
                  </Badge>{' '}
                  {replacement.worker.full_name}
                </p>{' '}
                <ArrowsRightLeftIcon className="w-6 text-gray-500" />{' '}
                <p className="text-md text-success-700">
                  {replacement.newWorker.full_name}{' '}
                  <Badge variant="success" size="md">
                    Entra
                  </Badge>
                </p>
              </div>
            </li>
          ))}
        </ul>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-300 text-gray-500 hover:bg-gray-500 hover:text-white">
            Fechar
          </AlertDialogCancel>
          {onAction && (
            <AlertDialogAction onClick={onAction} className={cn(dialogVariants({ variant }))}>
              {actionButtonLabel}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
