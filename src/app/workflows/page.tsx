'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { WorkflowList } from '@/components/workflow/WorkflowList'
import { CreateWorkflowModal } from '@/components/workflow/CreateWorkflowModal'
import type { Workflow } from '@/types'
import { Plus, Search, Filter, Zap, CheckCircle2, PauseCircle, XCircle } from 'lucide-react'

const STATUS_FILTERS = [
  { label: 'All', value: 'all', icon: Filter },
  { label: 'Active', value: 'active', icon: Zap },
  { label: 'Completed', value: 'completed', icon: CheckCircle2 },
  { label: 'Paused', value: 'paused', icon: PauseCircle },
  { label: 'Failed', value: 'failed', icon: XCircle },
]

export default function WorkflowsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

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

  const filtered = workflows.filter(workflow => {
    const searchTerm = search.toLowerCase()
    const matchesSearch =
      !searchTerm ||
      workflow.name.toLowerCase().includes(searchTerm) ||
      workflow.description.toLowerCase().includes(searchTerm) ||
      workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleWorkflowCreated = async (workflow: Workflow) => {
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      })

      if (!response.ok) {
        throw new Error(`Failed to create workflow (${response.status})`)
      }

      const createdWorkflow = await response.json() as Workflow
      setWorkflows(prev => [createdWorkflow, ...prev])
      setShowCreate(false)
    } catch {
      setWorkflows(prev => [workflow, ...prev])
      setShowCreate(false)
    }
  }

  return (
    <AppShell
      title="Workflows"
      breadcrumbs={[{ label: 'Workflows' }]}
    >
      <div className="relative z-10 p-6 space-y-6 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Workflows</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {workflows.length} total · {workflows.filter(workflow => workflow.status === 'active').length} active
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            Create Workflow
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search workflows, tags…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#13131f] border border-[rgba(99,102,241,0.15)]">
            {STATUS_FILTERS.map(filter => {
              const Icon = filter.icon
              const isActive = statusFilter === filter.value

              return (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {filter.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {isLoading ? (
            <div className="rounded-xl border border-[rgba(99,102,241,0.15)] bg-[#0f0f1a] px-4 py-6 text-sm text-slate-500">
              Loading workflows...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(99,102,241,0.1)] flex items-center justify-center">
                <Search className="w-7 h-7 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm">
                {workflows.length === 0 ? 'No workflows exist yet' : 'No workflows match your search'}
              </p>
              {workflows.length > 0 && (
                <button
                  onClick={() => { setSearch(''); setStatusFilter('all') }}
                  className="mt-3 text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <WorkflowList workflows={filtered} />
          )}
        </motion.div>
      </div>

      <CreateWorkflowModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleWorkflowCreated}
      />
    </AppShell>
  )
}
