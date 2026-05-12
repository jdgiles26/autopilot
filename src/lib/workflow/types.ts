import type { WorkflowNode, WorkflowEdge, Workflow, WorkflowStatus } from '@/types'

export type { WorkflowNode, WorkflowEdge, Workflow, WorkflowStatus }

export interface ExecutionContext {
  workflowId: string
  runId: string
  startedAt: Date
  variables: Record<string, unknown>
  logs: ExecutionLog[]
}

export interface ExecutionLog {
  nodeId: string
  level: 'info' | 'warn' | 'error'
  message: string
  timestamp: Date
  duration?: number
}

export interface WorkflowRun {
  id: string
  workflowId: string
  status: 'running' | 'completed' | 'failed'
  startedAt: string
  completedAt?: string
  duration?: number
  logs: ExecutionLog[]
}
