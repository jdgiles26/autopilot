import type { Workflow, WorkflowNode, WorkflowEdge } from '@/types'

export interface NodeDefinition {
  type: string
  label: string
  color: string
  icon: string
  description: string
}

export const NODE_DEFINITIONS: Record<string, NodeDefinition> = {
  trigger: {
    type: 'trigger',
    label: 'Trigger',
    color: '#6366f1',
    icon: 'zap',
    description: 'Initiates the workflow',
  },
  'ai-agent': {
    type: 'ai-agent',
    label: 'AI Agent',
    color: '#06b6d4',
    icon: 'brain',
    description: 'Executes AI tasks',
  },
  'code-exec': {
    type: 'code-exec',
    label: 'Code Execution',
    color: '#10b981',
    icon: 'terminal',
    description: 'Runs code in a sandbox',
  },
  condition: {
    type: 'condition',
    label: 'Condition',
    color: '#f59e0b',
    icon: 'git-branch',
    description: 'Branches based on condition',
  },
  notification: {
    type: 'notification',
    label: 'Notification',
    color: '#8b5cf6',
    icon: 'bell',
    description: 'Sends notifications',
  },
  transform: {
    type: 'transform',
    label: 'Transform',
    color: '#ec4899',
    icon: 'shuffle',
    description: 'Transforms data',
  },
}

export function createDefaultWorkflow(name: string, description: string): Workflow {
  const trigger: WorkflowNode = {
    id: 'node-1',
    type: 'trigger',
    label: 'HTTP Trigger',
    description: 'Receives incoming HTTP requests',
    position: { x: 100, y: 200 },
    status: 'idle',
    data: { method: 'POST', path: '/webhook' },
  }

  const agent: WorkflowNode = {
    id: 'node-2',
    type: 'ai-agent',
    label: 'AI Processor',
    description: 'Analyzes and processes input',
    position: { x: 350, y: 200 },
    status: 'idle',
    data: { model: 'gpt-4o', temperature: 0.7 },
  }

  const condition: WorkflowNode = {
    id: 'node-3',
    type: 'condition',
    label: 'Success Check',
    description: 'Validates AI response',
    position: { x: 600, y: 200 },
    status: 'idle',
    data: { condition: 'response.confidence > 0.8' },
  }

  const notify: WorkflowNode = {
    id: 'node-4',
    type: 'notification',
    label: 'Notify Team',
    description: 'Sends result to Slack',
    position: { x: 850, y: 120 },
    status: 'idle',
    data: { channel: '#ai-results', template: 'success' },
  }

  const codeExec: WorkflowNode = {
    id: 'node-5',
    type: 'code-exec',
    label: 'Fallback Handler',
    description: 'Handles low confidence cases',
    position: { x: 850, y: 280 },
    status: 'idle',
    data: { language: 'python', code: 'print("fallback")' },
  }

  const edges: WorkflowEdge[] = [
    { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true },
    { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true },
    { id: 'e3-4', source: 'node-3', target: 'node-4', label: 'yes', animated: false },
    { id: 'e3-5', source: 'node-3', target: 'node-5', label: 'no', animated: false },
  ]

  return {
    id: `wf-${Date.now()}`,
    name,
    description,
    status: 'active',
    nodes: [trigger, agent, condition, notify, codeExec],
    edges,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    runCount: 0,
    successRate: 0,
    avgDuration: 0,
    tags: ['ai', 'automation'],
  }
}

export function simulateWorkflowRun(workflow: Workflow): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 2000))
}
