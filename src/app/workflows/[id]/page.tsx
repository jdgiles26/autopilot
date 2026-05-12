'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas'
import type { Workflow } from '@/types'
import {
  Play, Pause, Settings, Clock, CheckCircle2,
  Activity, ArrowLeft, Tag, BarChart2,
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime, formatDuration, formatPercent } from '@/lib/utils'

const SAMPLE_WORKFLOW: Workflow = {
  id: 'wf-001',
  name: 'Data Ingestion Pipeline',
  description: 'Real-time ETL pipeline with AI-powered data validation and schema inference. Ingests data from multiple sources, normalises it, and loads it into the warehouse.',
  status: 'active',
  nodes: [
    {
      id: 'n1',
      type: 'trigger',
      label: 'HTTP Webhook Trigger',
      description: 'Listens for incoming data payloads via POST /ingest',
      position: { x: 60, y: 200 },
      status: 'success',
      data: { method: 'POST', path: '/ingest', auth: 'bearer' },
    },
    {
      id: 'n2',
      type: 'ai-agent',
      label: 'Schema Inference Agent',
      description: 'Uses GPT-4o to infer and validate the incoming JSON schema',
      position: { x: 320, y: 120 },
      status: 'running',
      data: { model: 'gpt-4o', temperature: 0, maxTokens: 1024 },
    },
    {
      id: 'n3',
      type: 'condition',
      label: 'Schema Valid?',
      description: 'Branches on whether inferred schema passes validation rules',
      position: { x: 580, y: 200 },
      status: 'idle',
      data: { trueLabel: 'Valid', falseLabel: 'Invalid' },
    },
    {
      id: 'n4',
      type: 'code-exec',
      label: 'Transform & Normalise',
      description: 'Python script: maps fields, coerces types, fills defaults',
      position: { x: 840, y: 100 },
      status: 'idle',
      data: { runtime: 'python3.11', timeout: 30 },
    },
    {
      id: 'n5',
      type: 'notification',
      label: 'Error Alert',
      description: 'Sends Slack alert on schema validation failure',
      position: { x: 840, y: 320 },
      status: 'idle',
      data: { channel: '#data-errors', severity: 'high' },
    },
    {
      id: 'n6',
      type: 'transform',
      label: 'Load to Warehouse',
      description: 'Bulk-inserts normalised records into BigQuery',
      position: { x: 1100, y: 100 },
      status: 'idle',
      data: { destination: 'bigquery', dataset: 'raw_events', table: 'ingest' },
    },
  ],
  edges: [
    { id: 'e1', source: 'n1', target: 'n2', animated: true },
    { id: 'e2', source: 'n2', target: 'n3', animated: true },
    { id: 'e3', source: 'n3', target: 'n4', label: 'Valid', animated: false },
    { id: 'e4', source: 'n3', target: 'n5', label: 'Invalid', animated: false },
    { id: 'e5', source: 'n4', target: 'n6', animated: false },
  ],
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  updatedAt: new Date(Date.now() - 3600000).toISOString(),
  lastRun: new Date(Date.now() - 900000).toISOString(),
  runCount: 248,
  successRate: 98.4,
  avgDuration: 3200,
  tags: ['data', 'etl', 'ai'],
}

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
  const [workflow] = useState<Workflow>({ ...SAMPLE_WORKFLOW, id })
  const [isRunning, setIsRunning] = useState(false)

  const handleRun = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 3000)
  }

  return (
    <AppShell
      title={workflow.name}
      breadcrumbs={[
        { label: 'Workflows', href: '/workflows' },
        { label: workflow.name },
      ]}
    >
      <div className="relative z-10 flex flex-col h-full">
        {/* Header bar */}
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
                background: STATUS_COLOR[workflow.status] ?? '#94a3b8',
                boxShadow: `0 0 8px ${STATUS_COLOR[workflow.status] ?? '#94a3b8'}`,
              }}
            />
            <h1 className="text-sm font-semibold text-slate-100 truncate">{workflow.name}</h1>
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
          </div>

          {/* Stats */}
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

          {/* Actions */}
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
        </motion.div>

        {/* Canvas — fills remaining height */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex-1 min-h-0"
        >
          <WorkflowCanvas workflow={workflow} />
        </motion.div>
      </div>
    </AppShell>
  )
}
