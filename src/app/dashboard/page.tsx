'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { MetricsGrid } from '@/components/dashboard/MetricsGrid'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { SystemStatus } from '@/components/dashboard/SystemStatus'
import { WorkflowList } from '@/components/workflow/WorkflowList'
import { TypewriterText } from '@/components/animations/TypewriterText'
import { GlowPulse } from '@/components/animations/GlowPulse'
import { Zap, ArrowRight, Plus } from 'lucide-react'
import Link from 'next/link'
import type { Workflow } from '@/types'

const TAGLINES = [
  'orchestrating complex software life-cycles',
  'executing autonomous AI workflows',
  'resolving dependencies in real-time',
  'generating production-ready pipelines',
]

export default function DashboardPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    /**
     * Fetches recent workflows from the API and updates the workflows state.
     *
     * On error, sets workflows to an empty array. Completes by setting isLoading to false.
     */
    async function loadWorkflows() {
      try {
        const response = await fetch('/api/workflows', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`Failed to load workflows (${response.status})`)
        }

        const data = await response.json() as { workflows?: Workflow[] }
        if (isMounted) {
          setWorkflows(data.workflows ?? [])
        }
      } catch {
        if (isMounted) {
          setWorkflows([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadWorkflows()

    return () => {
      isMounted = false
    }
  }, [])

  const recentWorkflows = workflows.slice(0, 5)

  return (
    <AppShell
      title="Dashboard"
      breadcrumbs={[{ label: 'Dashboard' }]}
    >
      <div className="relative z-10 p-6 space-y-8 max-w-[1600px] mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative rounded-2xl overflow-hidden border border-[rgba(99,102,241,0.2)] bg-[#0f0f1a] p-8"
          style={{ boxShadow: '0 0 60px rgba(99,102,241,0.08), 0 0 120px rgba(6,182,212,0.04)' }}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <div className="absolute -top-20 left-1/4 w-80 h-80 rounded-full bg-indigo-600/5 blur-3xl pointer-events-none" />
          <div className="absolute -top-20 right-1/4 w-60 h-60 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <GlowPulse color="#6366f1" size={56} intensity="strong">
                <Zap className="w-7 h-7 text-indigo-300" />
              </GlowPulse>
              <div>
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                  Autopilot{' '}
                  <span className="gradient-text">Command Center</span>
                </h1>
                <p className="text-slate-400 mt-1 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
                  <TypewriterText
                    texts={TAGLINES}
                    className="text-slate-400"
                    prefix="Autonomously "
                  />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/workflows" className="btn btn-ghost text-sm">
                View All Workflows
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/workflows" className="btn btn-primary text-sm">
                <Plus className="w-4 h-4" />
                New Workflow
              </Link>
            </div>
          </div>
        </motion.div>

        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4"
          >
            Platform Overview
          </motion.h2>
          <MetricsGrid workflows={workflows} />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Recent Workflows
              </h2>
              <Link
                href="/workflows"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {isLoading ? (
              <div className="rounded-xl border border-[rgba(99,102,241,0.15)] bg-[#0f0f1a] px-4 py-6 text-sm text-slate-500">
                Loading workflows...
              </div>
            ) : recentWorkflows.length > 0 ? (
              <WorkflowList workflows={recentWorkflows} compact />
            ) : (
              <div className="rounded-xl border border-[rgba(99,102,241,0.15)] bg-[#0f0f1a] px-4 py-6 text-sm text-slate-500">
                No workflows yet. Create one from the Workflows page or the AI playground.
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                System Status
              </h2>
              <SystemStatus />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                Live Activity
              </h2>
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
