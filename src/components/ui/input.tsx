import { SIZE } from '@/utils/constants'
import { cn } from '@utils/styles'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

type _InputSize = (typeof SIZE)[keyof typeof SIZE]

const _baseStyle =
  'flex w-full rounded-lg border text-sm placeholder:opacity-50 focus-visible:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100'

const inputVariants = cva(_baseStyle, {
  variants: {
    variant: {
      default: 'border-primary-500 bg-white text-gray-600 placeholder:text-primary-600',
      disabled: 'disabled:cursor-not-allowed disabled:opacity-50',
      error: 'border-error-500 bg-white text-error-500 placeholder:text-error-500 focus-visible:ring-error-100',
      file: 'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      negative: 'border-white bg-primary text-white placeholder:text-white focus-visible:text-white',
    },
    size: {
      xs: 'px-2 py-1',
      sm: 'px-3 py-1',
      md: 'px-3 py-1.5',
      lg: 'px-3 py-2.5',
      xl: 'px-4 py-3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'lg',
  },
})

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  size?: _InputSize
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, variant, size, ...props }, ref) => {
  return <input type={type} className={cn(inputVariants({ variant, size, className }))} ref={ref} {...props} />
})
Input.displayName = 'Input'

export { Input }
