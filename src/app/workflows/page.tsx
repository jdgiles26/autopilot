'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { WorkflowList } from '@/components/workflow/WorkflowList'
import { CreateWorkflowModal } from '@/components/workflow/CreateWorkflowModal'
import type { Workflow } from '@/types'
import { Plus, Search, Filter, Zap, CheckCircle2, PauseCircle, XCircle } from 'lucide-react'

const WORKFLOWS: Workflow[] = [
  {
    id: 'wf-001',
    name: 'Data Ingestion Pipeline',
    description: 'Real-time ETL pipeline with AI-powered data validation and schema inference',
    status: 'active',
    nodes: [],
    edges: [],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    lastRun: new Date(Date.now() - 900000).toISOString(),
    runCount: 248,
    successRate: 98.4,
    avgDuration: 3200,
    tags: ['data', 'etl', 'ai'],
  },
  {
    id: 'wf-002',
    name: 'LLM Code Review Bot',
    description: 'Automated PR review using GPT-4o with custom style enforcement rules',
    status: 'active',
    nodes: [],
    edges: [],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    lastRun: new Date(Date.now() - 1800000).toISOString(),
    runCount: 134,
    successRate: 99.2,
    avgDuration: 8100,
    tags: ['devops', 'llm', 'github'],
  },
  {
    id: 'wf-003',
    name: 'Customer Onboarding Flow',
    description: 'Multi-step onboarding with email sequences, CRM sync, and AI personalization',
    status: 'paused',
    nodes: [],
    edges: [],
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    lastRun: new Date(Date.now() - 86400000).toISOString(),
    runCount: 89,
    successRate: 94.7,
    avgDuration: 12400,
    tags: ['crm', 'email', 'automation'],
  },
  {
    id: 'wf-004',
    name: 'Anomaly Detection Sentinel',
    description: 'ML-powered anomaly detection and alerting on infrastructure metrics',
    status: 'active',
    nodes: [],
    edges: [],
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
    lastRun: new Date(Date.now() - 300000).toISOString(),
    runCount: 1204,
    successRate: 99.8,
    avgDuration: 450,
    tags: ['ml', 'monitoring', 'infra'],
  },
  {
    id: 'wf-005',
    name: 'Document Intelligence Extractor',
    description: 'Vision AI pipeline for extracting structured data from unstructured documents',
    status: 'completed',
    nodes: [],
    edges: [],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    lastRun: new Date(Date.now() - 86400000 * 3).toISOString(),
    runCount: 512,
    successRate: 96.3,
    avgDuration: 5800,
    tags: ['vision', 'ocr', 'documents'],
  },
  {
    id: 'wf-006',
    name: 'Social Media Intelligence',
    description: 'Sentiment analysis and trend detection across social platforms',
    status: 'failed',
    nodes: [],
    edges: [],
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    lastRun: new Date(Date.now() - 3600000 * 2).toISOString(),
    runCount: 67,
    successRate: 78.3,
    avgDuration: 22000,
    tags: ['nlp', 'social', 'analytics'],
  },
]

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
  const [workflows, setWorkflows] = useState<Workflow[]>(WORKFLOWS)

  const filtered = workflows.filter(wf => {
    const matchesSearch =
      !search ||
      wf.name.toLowerCase().includes(search.toLowerCase()) ||
      wf.description.toLowerCase().includes(search.toLowerCase()) ||
      wf.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || wf.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleWorkflowCreated = (wf: Workflow) => {
    setWorkflows(prev => [wf, ...prev])
    setShowCreate(false)
  }

  return (
    <AppShell
      title="Workflows"
      breadcrumbs={[{ label: 'Workflows' }]}
    >
      <div className="relative z-10 p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Workflows</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {workflows.length} total · {workflows.filter(w => w.status === 'active').length} active
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

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Search */}
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

          {/* Status filters */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#13131f] border border-[rgba(99,102,241,0.15)]">
            {STATUS_FILTERS.map(f => {
              const Icon = f.icon
              const isActive = statusFilter === f.value
              return (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {f.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Workflow list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(99,102,241,0.1)] flex items-center justify-center">
                <Search className="w-7 h-7 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm">No workflows match your search</p>
              <button
                onClick={() => { setSearch(''); setStatusFilter('all') }}
                className="mt-3 text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
              >
                Clear filters
              </button>
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
