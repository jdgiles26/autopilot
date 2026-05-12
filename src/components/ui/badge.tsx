'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide transition-all',
  {
    variants: {
      variant: {
        default: 'bg-[rgba(99,102,241,0.15)] text-indigo-300 border border-[rgba(99,102,241,0.3)]',
        success: 'bg-[rgba(16,185,129,0.15)] text-emerald-300 border border-[rgba(16,185,129,0.3)]',
        warning: 'bg-[rgba(245,158,11,0.15)] text-amber-300 border border-[rgba(245,158,11,0.3)]',
        danger: 'bg-[rgba(239,68,68,0.15)] text-red-300 border border-[rgba(239,68,68,0.3)]',
        secondary: 'bg-[rgba(6,182,212,0.15)] text-cyan-300 border border-[rgba(6,182,212,0.3)]',
        muted: 'bg-[rgba(148,163,184,0.1)] text-slate-400 border border-[rgba(148,163,184,0.2)]',
        purple: 'bg-[rgba(139,92,246,0.15)] text-violet-300 border border-[rgba(139,92,246,0.3)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
