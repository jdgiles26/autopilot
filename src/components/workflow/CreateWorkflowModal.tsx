'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, Zap, Brain, Terminal, GitBranch, Bell, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Workflow } from '@/types'
import { v4 as uuidv4 } from 'uuid'

interface CreateWorkflowModalProps {
  open: boolean
  onClose: () => void
  onCreated: (workflow: Workflow) => void
}

const EXAMPLES = [
  'Analyze customer feedback and route to the right team',
  'Review pull requests and post AI-generated comments',
  'Monitor API health and auto-scale on anomalies',
  'Generate weekly reports from multiple data sources',
]

export function CreateWorkflowModal({ open, onClose, onCreated }: CreateWorkflowModalProps) {
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [preview, setPreview] = useState<string[]>([])

  const handleGenerate = async () => {
    if (!goal.trim()) return
    setIsGenerating(true)
    setPreview([])

    // Simulate AI generation
    await new Promise(r => setTimeout(r, 1500))

    const steps = [
      '⚡ HTTP Trigger — Receives workflow input',
      '🧠 AI Processor — Analyzes with GPT-4o',
      '🔀 Quality Gate — Validates confidence score',
      '💻 Transform — Post-processes results',
      '🔔 Notify — Delivers to destination',
    ]

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 200))
      setPreview(prev => [...prev, step])
    }

    setIsGenerating(false)
    if (!name) {
      setName(goal.split(' ').slice(0, 4).join(' ') + ' Workflow')
    }
  }

  const handleCreate = () => {
    const newWorkflow: Workflow = {
      id: uuidv4(),
      name: name || 'New Workflow',
      description: goal,
      status: 'pending',
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      runCount: 0,
      successRate: 0,
      avgDuration: 0,
      tags: [],
    }
    onCreated(newWorkflow)
    setName('')
    setGoal('')
    setPreview([])
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[rgba(99,102,241,0.2)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            Create Workflow with AI
          </DialogTitle>
          <DialogDescription>
            Describe what you want to automate and AI will generate the workflow structure
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Goal input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Describe your automation goal</label>
            <textarea
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="e.g. Analyze incoming support tickets and route them to the correct team based on urgency..."
              className="w-full min-h-[80px] rounded-lg border border-[rgba(99,102,241,0.2)] bg-[#13131f] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all"
            />
          </div>

          {/* Example prompts */}
          <div>
            <p className="text-xs text-slate-500 mb-2">Quick examples:</p>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLES.map(ex => (
                <button
                  key={ex}
                  onClick={() => setGoal(ex)}
                  className="text-[10px] px-2 py-1 rounded-full border border-[rgba(99,102,241,0.2)] text-slate-400 hover:text-slate-200 hover:border-[rgba(99,102,241,0.4)] hover:bg-[rgba(99,102,241,0.05)] transition-all"
                >
                  {ex.slice(0, 35)}...
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <Button
            onClick={handleGenerate}
            disabled={!goal.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating workflow...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate with AI
              </>
            )}
          </Button>

          {/* Preview */}
          {preview.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-lg border border-[rgba(99,102,241,0.2)] bg-[#13131f] p-3 space-y-2"
            >
              <p className="text-xs font-medium text-slate-400">Generated workflow steps:</p>
              {preview.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-slate-300 flex items-center gap-2"
                >
                  <span className="text-indigo-400">→</span>
                  {step}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Name field */}
          {preview.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-1.5"
            >
              <label className="text-xs font-medium text-slate-400">Workflow name</label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter a name..."
              />
            </motion.div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleCreate}
            disabled={preview.length === 0}
          >
            <Plus className="w-4 h-4" />
            Create Workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
