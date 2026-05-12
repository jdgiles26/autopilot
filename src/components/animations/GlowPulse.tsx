'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlowPulseProps {
  className?: string
  color?: string
  size?: number
  intensity?: 'low' | 'medium' | 'high' | 'strong'
  children?: React.ReactNode
}

export function GlowPulse({ className, color = '#6366f1', size = 80, intensity = 'medium', children }: GlowPulseProps) {
  const opacities: Record<string, number[]> = {
    low: [0.1, 0.25, 0.1],
    medium: [0.2, 0.45, 0.2],
    high: [0.3, 0.65, 0.3],
    strong: [0.4, 0.75, 0.4],
  }

  const [o1, o2, o3] = opacities[intensity] ?? opacities.medium

  if (children) {
    return (
      <div className={cn('relative flex items-center justify-center', className)} style={{ width: size, height: size }}>
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
          animate={{ opacity: [o1, o2, o3], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full" style={{ background: `${color}20` }}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={cn('rounded-full pointer-events-none', className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
      animate={{ opacity: [o1, o2, o3], scale: [0.9, 1.1, 0.9] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

interface OrbitSpinnerProps {
  size?: number
  className?: string
}

export function OrbitSpinner({ size = 40, className }: OrbitSpinnerProps) {
  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent"
        style={{ borderTopColor: '#6366f1' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full border-2 border-transparent"
        style={{
          inset: size * 0.15,
          borderTopColor: '#06b6d4',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
      />
      <div
        className="absolute rounded-full bg-indigo-500"
        style={{
          width: size * 0.15,
          height: size * 0.15,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  )
}
