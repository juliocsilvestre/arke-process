import { cn } from '@/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'

const _baseStyle = 'p-4 text-center fixed bottom-0 w-full'

const footerVariants = cva(_baseStyle, {
  variants: {
    variant: {
      default: 'bg-yellow-300 text-primary',
      purple: 'bg-primary text-secondary',
      white: 'bg-white text-primary',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface FooterProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof footerVariants> {}

const Footer = React.forwardRef<HTMLElement, FooterProps>(({ className, variant, ...props }, ref) => {
  const year = new Date().getFullYear()

  return (
    <footer className={cn(footerVariants({ variant, className }))} ref={ref} {...props}>
      <p>© {year} Init1. Todos os direitos reservados.</p>
    </footer>
  )
})

Footer.displayName = 'Footer'

export { Footer }
