'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Pause, ExternalLink, Zap, Brain, Terminal, GitBranch, Bell, Clock, BarChart2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Workflow } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDuration, formatPercent } from '@/lib/utils'

const STATUS_BADGE: Record<string, { variant: 'default' | 'success' | 'warning' | 'danger' | 'muted'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  paused: { variant: 'warning', label: 'Paused' },
  completed: { variant: 'muted', label: 'Completed' },
  failed: { variant: 'danger', label: 'Failed' },
  pending: { variant: 'default', label: 'Pending' },
}

const NODE_ICONS: Record<string, React.ElementType> = {
  trigger: Zap,
  'ai-agent': Brain,
  'code-exec': Terminal,
  condition: GitBranch,
  notification: Bell,
}

interface WorkflowListProps {
  workflows: Workflow[]
  compact?: boolean
}

export function WorkflowList({ workflows, compact = false }: WorkflowListProps) {
  return (
    <div className="space-y-3">
      {workflows.map((workflow, i) => {
        const statusBadge = STATUS_BADGE[workflow.status] ?? STATUS_BADGE.pending

        return (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            className="group relative rounded-xl border border-[rgba(99,102,241,0.15)] bg-[#0f0f1a] p-4 hover:border-[rgba(99,102,241,0.35)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)] shrink-0 mt-0.5">
                <Zap className="w-5 h-5 text-indigo-400" />
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-sm text-slate-100 truncate">{workflow.name}</h3>
                  <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                  {workflow.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="muted">{tag}</Badge>
                  ))}
                </div>
                <p className="text-xs text-slate-500 truncate mb-3">{workflow.description}</p>

                {/* Node type icons */}
                <div className="flex items-center gap-1.5 mb-3">
                  {Array.from(new Set(workflow.nodes.map(n => n.type))).slice(0, 5).map(type => {
                    const Icon = NODE_ICONS[type] ?? Zap
                    return (
                      <div
                        key={type}
                        className="flex items-center justify-center w-5 h-5 rounded bg-[#13131f] border border-[rgba(99,102,241,0.15)]"
                        title={type}
                      >
                        <Icon className="w-2.5 h-2.5 text-slate-400" />
                      </div>
                    )
                  })}
                  <span className="text-[10px] text-slate-600 ml-1">{workflow.nodes.length} nodes</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    {workflow.runCount} runs
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart2 className="w-3 h-3" />
                    {formatPercent(workflow.successRate)} success
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(workflow.avgDuration)} avg
                  </span>
                  {workflow.lastRun && (
                    <span className="hidden sm:flex items-center gap-1">
                      Last: {formatDistanceToNow(new Date(workflow.lastRun), { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon-sm" variant="ghost">
                  {workflow.status === 'active' ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                </Button>
                <Link href={`/workflows/${workflow.id}`}>
                  <Button size="icon-sm" variant="ghost">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
