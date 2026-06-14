'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Workflow } from '@/types'

interface Metric {
  label: string
  value: number
  unit?: string
  change?: number
  changeType?: 'increase' | 'decrease'
  icon: React.ReactNode
  color: string
  glowColor: string
  format?: (n: number) => string
}

interface MetricsGridProps {
  workflows?: Workflow[]
}

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const frameRef = useRef<number>(0)
  const startRef = useRef<number>(0)

  useEffect(() => {
    const start = performance.now()
    startRef.current = start

    const animate = (now: number) => {
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return count
}

interface MetricCardProps {
  metric: Metric
  index: number
}

function MetricCard({ metric, index }: MetricCardProps) {
  const count = useCountUp(metric.value, 2000 + index * 200)
  const displayValue = metric.format ? metric.format(count) : count.toString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#0f0f1a] p-5 overflow-hidden cursor-default group"
      style={{ boxShadow: `0 0 0 1px transparent` }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${metric.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
        style={{ background: `linear-gradient(90deg, transparent, ${metric.color}, transparent)` }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg"
            style={{
              background: `${metric.glowColor}`,
              boxShadow: `0 0 16px ${metric.glowColor}`,
            }}
          >
            {metric.icon}
          </div>
          {metric.change !== undefined && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                metric.changeType === 'increase'
                  ? 'text-emerald-400 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)]'
                  : 'text-red-400 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]'
              )}
            >
              {metric.changeType === 'increase' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(metric.change)}%
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span
              className="text-3xl font-bold tabular-nums"
              style={{ color: metric.color }}
            >
              {displayValue}
            </span>
            {metric.unit && (
              <span className="text-sm text-slate-400">{metric.unit}</span>
            )}
          </div>
          <p className="text-sm text-slate-400 font-medium">{metric.label}</p>
        </div>
      </div>
    </motion.div>
  )
}

function buildMetrics(workflows: Workflow[] = []): Metric[] {
  const activeWorkflows = workflows.filter(workflow => workflow.status === 'active').length
  const completedRuns = workflows.reduce((sum, workflow) => sum + workflow.runCount, 0)
  const averageSuccessRate = workflows.length > 0
    ? workflows.reduce((sum, workflow) => sum + workflow.successRate, 0) / workflows.length
    : 0
  const averageExecutionSeconds = workflows.length > 0
    ? workflows.reduce((sum, workflow) => sum + workflow.avgDuration, 0) / workflows.length / 1000
    : 0

  return [
    {
      label: 'Active Workflows',
      value: activeWorkflows,
      color: '#818cf8',
      glowColor: 'rgba(99,102,241,0.15)',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: 'Tasks Completed',
      value: completedRuns,
      color: '#34d399',
      glowColor: 'rgba(16,185,129,0.15)',
      format: (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString(),
      icon: (
        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Success Rate',
      value: Math.round(averageSuccessRate),
      unit: '%',
      color: '#22d3ee',
      glowColor: 'rgba(6,182,212,0.15)',
      icon: (
        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: 'Avg Execution',
      value: Math.round(averageExecutionSeconds),
      unit: 's',
      color: '#fbbf24',
      glowColor: 'rgba(245,158,11,0.15)',
      icon: (
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]
}

export function MetricsGrid({ workflows = [] }: MetricsGridProps) {
  const metrics = buildMetrics(workflows)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((metric, i) => (
        <MetricCard key={metric.label} metric={metric} index={i} />
      ))}
    </div>
  )
}
