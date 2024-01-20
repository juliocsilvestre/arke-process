import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@utils/styles'

const _baseStyle = 'px-4 py-1 text-sm rounded-full w-fit inline-flex'

const badgeVariants = cva(_baseStyle, {
  variants: {
    variant: {
      success: 'bg-success-100 text-success-600',
      error: 'bg-error-100 text-error-600',
      secondary: 'bg-secondary-100 text-secondary-600 ',
    },
    size: {
      sm: 'px-2 py-0 text-[10px]',
      md: 'px-3 py-1',
      lg: 'px-4 py-1.5 text-lg',
    },
  },
  defaultVariants: {
    variant: 'success',
    size: 'md',
  },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge, badgeVariants }
