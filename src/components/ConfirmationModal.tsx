import { VariantProps, cva } from 'class-variance-authority'
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
import { ReactNode } from 'react'
import { cn } from '@/utils/styles'

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
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-300 text-gray-500 hover:bg-gray-500 hover:text-white">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAction} className={cn(dialogVariants({ variant }))}>
            {actionButtonLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
