import * as LabelPrimitive from '@radix-ui/react-label'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@utils/styles'
import { SIZE } from '@/utils/constants'

type _LabelSize = (typeof SIZE)[keyof typeof SIZE]

const _baseStyle = 'text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'

const labelVariants = cva(_baseStyle, {
  variants: {
    variant: {
      default: 'text-primary-700',
      disabled: 'text-gray-300 disabled:cursor-not-allowed disabled:opacity-50',
      error: 'border-error-500 text-error-500 placeholder:text-error-500 focus-visible:ring-error-100',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
      xl: 'text-md',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'lg',
  },
})

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  size?: _LabelSize
  isRequired?: boolean
  label?: string
}

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, variant, size, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ variant, size, className }))} {...props}>
      {props.label}
      {props.isRequired && <span className="text-md text-error-500">*</span>}
    </LabelPrimitive.Root>
  ),
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
