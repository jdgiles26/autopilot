'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Sparkles,
  Play,
} from 'lucide-react'
import type { ActivityItem } from '@/types'

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'workflow_run',
    title: 'Customer Onboarding AI',
    description: 'Completed successfully in 3.2s',
    timestamp: new Date(Date.now() - 60000 * 2).toISOString(),
    severity: 'success',
  },
  {
    id: '2',
    type: 'ai_generation',
    title: 'Workflow Generated',
    description: 'AI created "Email Classifier" from natural language',
    timestamp: new Date(Date.now() - 60000 * 8).toISOString(),
    severity: 'info',
  },
  {
    id: '3',
    type: 'error',
    title: 'Data Pipeline Orchestrator',
    description: 'Connection timeout to PostgreSQL replica',
    timestamp: new Date(Date.now() - 60000 * 15).toISOString(),
    severity: 'error',
  },
  {
    id: '4',
    type: 'workflow_run',
    title: 'Code Review Automation',
    description: 'Processed 47 files, 3 issues flagged',
    timestamp: new Date(Date.now() - 60000 * 22).toISOString(),
    severity: 'success',
  },
  {
    id: '5',
    type: 'workflow_created',
    title: 'New Workflow Created',
    description: '"Incident Response Bot" deployed to production',
    timestamp: new Date(Date.now() - 60000 * 45).toISOString(),
    severity: 'info',
  },
  {
    id: '6',
    type: 'workflow_run',
    title: 'Content Generation Pipeline',
    description: 'Generated 12 blog posts, published 10',
    timestamp: new Date(Date.now() - 60000 * 60).toISOString(),
    severity: 'success',
  },
  {
    id: '7',
    type: 'error',
    title: 'AI Rate Limit Hit',
    description: 'OpenAI API rate limit reached, queued 3 runs',
    timestamp: new Date(Date.now() - 60000 * 90).toISOString(),
    severity: 'warning',
  },
]

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Sparkles,
}

const COLORS = {
  success: { icon: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  error: { icon: '#f87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  warning: { icon: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  info: { icon: '#818cf8', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITIES)

  // Simulate new activities arriving
  useEffect(() => {
    const timer = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: 'workflow_run',
        title: ['Customer Onboarding AI', 'Code Review Automation', 'Incident Response Bot'][Math.floor(Math.random() * 3)],
        description: `Completed in ${(Math.random() * 5 + 1).toFixed(1)}s`,
        timestamp: new Date().toISOString(),
        severity: Math.random() > 0.2 ? 'success' : 'error',
      }
      setActivities(prev => [newActivity, ...prev.slice(0, 19)])
    }, 8000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#0f0f1a] p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-100">Activity Feed</h3>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
          <span className="text-xs text-slate-500">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence initial={false}>
          {activities.map((activity, i) => {
            const severity = activity.severity ?? 'info'
            const Icon = ICONS[severity]
            const colors = COLORS[severity]

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, delay: i === 0 ? 0 : 0 }}
                className="flex gap-3 p-3 rounded-lg border transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                style={{
                  background: i === 0 ? colors.bg : 'transparent',
                  borderColor: i === 0 ? colors.border : 'transparent',
                }}
              >
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
                  style={{ background: colors.bg }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: colors.icon }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-200 truncate">{activity.title}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{activity.description}</p>
                  <p className="text-[10px] text-slate-600 mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
