import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-[14px] text-[#1A1A1A] placeholder-[#9CA3AF] transition-colors',
        'focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/[0.2]',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
