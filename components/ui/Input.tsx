import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  align?: 'left' | 'center' | 'right'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, align = 'left', ...props }, ref) => {
    const alignClasses =
      align === 'center'
        ? 'text-center placeholder:text-center'
        : align === 'right'
          ? 'text-right placeholder:text-right'
          : 'text-left placeholder:text-left'

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-800 mb-1">
            {label}
          </label>
        )}
        <input
          className={cn(
            'w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-slate-300',
            alignClasses,
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }


