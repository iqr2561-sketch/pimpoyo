import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean // permite usar <Button asChild><Link/></Button> sin error de tipos
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary:
        'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:to-violet-600 focus:ring-indigo-400 shadow-md shadow-blue-900/20',
      secondary:
        'bg-white/10 text-white border border-white/20 hover:bg-white/20 focus:ring-indigo-300',
      outline:
        'border border-slate-300 text-slate-900 bg-white hover:bg-slate-50 focus:ring-indigo-400',
      ghost:
        'text-slate-200 hover:bg-white/10 focus:ring-indigo-300 border border-transparent',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }


