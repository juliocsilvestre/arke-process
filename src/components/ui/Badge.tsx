import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@utils/styles'

const _baseStyle = 'px-4 py-1 text-sm rounded-full w-fit inline-flex'

const badgeVariants = cva(_baseStyle, {
  variants: {
    variant: {
      success: 'bg-success-100 text-success-600',
      error: 'bg-error-100 text-error-600',
      secondary: 'bg-secondary-100 text-secondary-600 ',
    },
  },
  defaultVariants: {
    variant: 'success',
  },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
