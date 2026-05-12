export type WorkflowStatus = 'active' | 'paused' | 'completed' | 'failed' | 'pending'
export type NodeType = 'trigger' | 'ai-agent' | 'code-exec' | 'condition' | 'notification' | 'transform'
export type Priority = 'low' | 'medium' | 'high' | 'critical'

export interface WorkflowNode {
  id: string
  type: NodeType
  label: string
  description?: string
  position: { x: number; y: number }
  status?: 'idle' | 'running' | 'success' | 'error'
  data: Record<string, unknown>
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  label?: string
  animated?: boolean
  type?: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  status: WorkflowStatus
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdAt: string
  updatedAt: string
  lastRun?: string
  runCount: number
  successRate: number
  avgDuration: number
  tags: string[]
}

export interface Metric {
  label: string
  value: number
  unit?: string
  change?: number
  changeType?: 'increase' | 'decrease'
  icon: string
  color: string
}

export interface ActivityItem {
  id: string
  type: 'workflow_run' | 'workflow_created' | 'error' | 'success' | 'ai_generation'
  title: string
  description: string
  timestamp: string
  workflowId?: string
  severity?: 'info' | 'success' | 'warning' | 'error'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  isStreaming?: boolean
}

export interface ExecutionResult {
  stdout: string
  stderr: string
  exitCode: number
  duration: number
  language: 'python' | 'javascript'
}

export interface SystemService {
  name: string
  status: 'operational' | 'degraded' | 'down'
  latency?: number
  uptime?: number
}
