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

const dialogVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-50 hover:bg-primary-700',
      destructive: 'bg-error-500 text-white hover:bg-error-600',
      secondary: 'bg-secondary-500 text-gray-800 hover:bg-secondary-500 hover:text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface ConfirmationModalProps extends VariantProps<typeof dialogVariants> {
  children: ReactNode
  title: ReactNode
  description: ReactNode
  onAction: () => void
  actionButtonLabel: string
}
export const ConfirmationModal = ({
  children,
  title,
  description,
  actionButtonLabel,
  variant,
  onAction,
}: ConfirmationModalProps): JSX.Element => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="border-gray-300 text-gray-500 hover:bg-gray-500 hover:text-white"
            onClick={(event) => event.stopPropagation()}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.stopPropagation()
              onAction()
            }}
            className={cn(dialogVariants({ variant }))}
          >
            {actionButtonLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
