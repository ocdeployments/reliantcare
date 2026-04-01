import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'amber' | 'navy' | 'royal' | 'muted'
}

const variants = {
  amber: 'bg-[#FEF3C7] text-[#B45309]',
  navy: 'bg-[#1A2B4A] text-white',
  royal: 'bg-[#1E3A8A] text-white',
  muted: 'bg-[#F2F0EC] text-[#4B5563]',
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'amber', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    />
  )
)
Badge.displayName = 'Badge'

export { Badge }
