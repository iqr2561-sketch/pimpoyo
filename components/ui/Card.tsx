import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 p-6',
          className
        )}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
        )}
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export { Card }


