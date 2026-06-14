'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas'
import type { Workflow } from '@/types'
import {
  Play, Pause, Settings, Clock, CheckCircle2,
  Activity, ArrowLeft, Tag, BarChart2,
} from 'lucide-react'
import { formatRelativeTime, formatDuration, formatPercent } from '@/lib/utils'

const STATUS_COLOR: Record<string, string> = {
  active: '#10b981',
  paused: '#f59e0b',
  completed: '#6366f1',
  failed: '#ef4444',
  pending: '#94a3b8',
}

export default function WorkflowDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadWorkflow() {
      try {
        const response = await fetch(`/api/workflows/${id}`, { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`Failed to load workflow (${response.status})`)
        }

        const data = await response.json() as Workflow
        if (isMounted) {
          setWorkflow(data)
        }
      } catch {
        if (isMounted) {
          setWorkflow(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadWorkflow()

    return () => {
      isMounted = false
    }
  }, [id])

  const handleRun = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 3000)
  }

  return (
    <AppShell
      title={workflow?.name ?? 'Workflow'}
      breadcrumbs={[
        { label: 'Workflows', href: '/workflows' },
        { label: workflow?.name ?? id },
      ]}
    >
      <div className="relative z-10 flex flex-col h-full">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 px-6 py-3 border-b border-[rgba(99,102,241,0.15)] bg-[#0a0a12]/80 backdrop-blur-sm shrink-0"
        >
          <Link
            href="/workflows"
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="h-5 w-px bg-[rgba(99,102,241,0.2)]" />

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                background: STATUS_COLOR[workflow?.status ?? 'pending'] ?? '#94a3b8',
                boxShadow: `0 0 8px ${STATUS_COLOR[workflow?.status ?? 'pending'] ?? '#94a3b8'}`,
              }}
            />
            <h1 className="text-sm font-semibold text-slate-100 truncate">
              {workflow?.name ?? (isLoading ? 'Loading workflow…' : 'Workflow not found')}
            </h1>
            {workflow && (
              <div className="flex items-center gap-1.5 ml-2">
                {workflow.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[rgba(99,102,241,0.1)] text-indigo-400 border border-[rgba(99,102,241,0.2)]"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {workflow && (
            <>
              <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{workflow.runCount} runs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{formatPercent(workflow.successRate)} success</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{formatDuration(workflow.avgDuration)} avg</span>
                </div>
                {workflow.lastRun && (
                  <div className="flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Last: {formatRelativeTime(workflow.lastRun)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="btn btn-primary text-xs h-8 px-3"
                >
                  {isRunning ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Running…
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      Run
                    </>
                  )}
                </button>
                <button className="btn btn-ghost text-xs h-8 px-3">
                  <Pause className="w-3.5 h-3.5" />
                  Pause
                </button>
                <button className="btn btn-ghost text-xs h-8 px-2.5">
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex-1 min-h-0"
        >
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Loading workflow...
            </div>
          ) : workflow ? (
            <WorkflowCanvas workflow={workflow} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-md rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[#0f0f1a] p-6 text-center">
                <h2 className="text-lg font-semibold text-slate-100">Workflow not found</h2>
                <p className="mt-2 text-sm text-slate-400">
                  The workflow with id <span className="font-mono text-slate-200">{id}</span> does not exist in local storage.
                </p>
                <Link href="/workflows" className="btn btn-primary mt-4 inline-flex">
                  Back to Workflows
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AppShell>
  )
}
