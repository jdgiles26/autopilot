'use client'

import React, { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { motion } from 'framer-motion'
import {
  Zap,
  Brain,
  Terminal,
  GitBranch,
  Bell,
  Shuffle,
  CheckCircle,
  XCircle,
  Loader2,
  Circle,
} from 'lucide-react'

const NODE_CONFIG: Record<string, {
  color: string
  bgColor: string
  borderColor: string
  glowColor: string
  Icon: React.ElementType
  label: string
}> = {
  trigger: {
    color: '#818cf8',
    bgColor: 'rgba(99,102,241,0.15)',
    borderColor: 'rgba(99,102,241,0.4)',
    glowColor: 'rgba(99,102,241,0.3)',
    Icon: Zap,
    label: 'Trigger',
  },
  'ai-agent': {
    color: '#22d3ee',
    bgColor: 'rgba(6,182,212,0.12)',
    borderColor: 'rgba(6,182,212,0.35)',
    glowColor: 'rgba(6,182,212,0.3)',
    Icon: Brain,
    label: 'AI Agent',
  },
  'code-exec': {
    color: '#34d399',
    bgColor: 'rgba(16,185,129,0.12)',
    borderColor: 'rgba(16,185,129,0.35)',
    glowColor: 'rgba(16,185,129,0.3)',
    Icon: Terminal,
    label: 'Code Exec',
  },
  condition: {
    color: '#fbbf24',
    bgColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.35)',
    glowColor: 'rgba(245,158,11,0.3)',
    Icon: GitBranch,
    label: 'Condition',
  },
  notification: {
    color: '#a78bfa',
    bgColor: 'rgba(139,92,246,0.12)',
    borderColor: 'rgba(139,92,246,0.35)',
    glowColor: 'rgba(139,92,246,0.3)',
    Icon: Bell,
    label: 'Notification',
  },
  transform: {
    color: '#f472b6',
    bgColor: 'rgba(236,72,153,0.12)',
    borderColor: 'rgba(236,72,153,0.35)',
    glowColor: 'rgba(236,72,153,0.3)',
    Icon: Shuffle,
    label: 'Transform',
  },
}

interface WorkflowNodeData {
  label: string
  description?: string
  nodeType: string
  status: 'idle' | 'running' | 'success' | 'error'
  [key: string]: unknown
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'success':
      return <CheckCircle className="w-3 h-3 text-emerald-400" />
    case 'error':
      return <XCircle className="w-3 h-3 text-red-400" />
    case 'running':
      return <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
    default:
      return <Circle className="w-3 h-3 text-slate-600" />
  }
}

export const WorkflowNode = memo(function WorkflowNode({ data, selected }: NodeProps) {
  const nodeData = data as WorkflowNodeData
  const config = NODE_CONFIG[nodeData.nodeType] ?? NODE_CONFIG.trigger
  const { Icon } = config

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative"
      style={{ minWidth: 180 }}
    >
      {/* Glow when selected */}
      {selected && (
        <motion.div
          className="absolute -inset-1 rounded-xl"
          style={{
            background: `radial-gradient(ellipse, ${config.glowColor} 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: '#0f0f1a',
          border: `1px solid ${selected ? config.borderColor : 'rgba(99,102,241,0.15)'}`,
          boxShadow: selected
            ? `0 0 24px ${config.glowColor}, 0 4px 20px rgba(0,0,0,0.4)`
            : '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        {/* Colored header */}
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ background: config.bgColor, borderBottom: `1px solid ${config.borderColor}` }}
        >
          <div
            className="flex items-center justify-center w-5 h-5 rounded-md"
            style={{ background: `${config.color}20` }}
          >
            <Icon className="w-3 h-3" style={{ color: config.color }} />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: config.color }}>
            {config.label}
          </span>
          <div className="ml-auto">
            <StatusIcon status={nodeData.status} />
          </div>
        </div>

        {/* Body */}
        <div className="px-3 py-2.5">
          <p className="text-xs font-semibold text-slate-100 mb-0.5 leading-tight">
            {nodeData.label}
          </p>
          {nodeData.description && (
            <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">
              {nodeData.description}
            </p>
          )}
        </div>

        {/* Running indicator */}
        {nodeData.status === 'running' && (
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{ background: config.color }}
          >
            <motion.div
              className="h-full"
              style={{ background: `linear-gradient(90deg, transparent, white, transparent)` }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !rounded-full !border-2"
        style={{
          background: '#0f0f1a',
          borderColor: config.color,
          boxShadow: `0 0 8px ${config.glowColor}`,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !rounded-full !border-2"
        style={{
          background: config.color,
          borderColor: config.color,
          boxShadow: `0 0 8px ${config.glowColor}`,
        }}
      />
    </motion.div>
  )
})
