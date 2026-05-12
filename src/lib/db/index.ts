import type { Workflow } from '@/types'

// Mock database - in production, use Drizzle ORM + PostgreSQL
const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-001',
    name: 'Customer Onboarding AI',
    description: 'Automates customer onboarding with AI-driven document processing and verification',
    status: 'active',
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Form Submit', position: { x: 100, y: 200 }, status: 'idle', data: {}, description: 'Customer submits onboarding form' },
      { id: 'n2', type: 'ai-agent', label: 'Document Analyzer', position: { x: 350, y: 200 }, status: 'idle', data: {}, description: 'Extracts and validates documents' },
      { id: 'n3', type: 'condition', label: 'Valid Check', position: { x: 600, y: 200 }, status: 'idle', data: {}, description: 'Checks document validity' },
      { id: 'n4', type: 'notification', label: 'Welcome Email', position: { x: 850, y: 120 }, status: 'idle', data: {}, description: 'Sends welcome email' },
      { id: 'n5', type: 'notification', label: 'Review Alert', position: { x: 850, y: 280 }, status: 'idle', data: {}, description: 'Alerts team for review' },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', animated: true },
      { id: 'e2', source: 'n2', target: 'n3', animated: true },
      { id: 'e3', source: 'n3', target: 'n4', label: 'Valid' },
      { id: 'e4', source: 'n3', target: 'n5', label: 'Invalid' },
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    lastRun: new Date(Date.now() - 3600000).toISOString(),
    runCount: 247,
    successRate: 98.4,
    avgDuration: 3200,
    tags: ['customer', 'ai', 'onboarding'],
  },
  {
    id: 'wf-002',
    name: 'Code Review Automation',
    description: 'AI-powered code review that checks for bugs, security issues, and best practices',
    status: 'active',
    nodes: [
      { id: 'n1', type: 'trigger', label: 'PR Opened', position: { x: 100, y: 200 }, status: 'idle', data: {}, description: 'Pull request opened' },
      { id: 'n2', type: 'code-exec', label: 'Run Tests', position: { x: 350, y: 120 }, status: 'idle', data: {}, description: 'Execute test suite' },
      { id: 'n3', type: 'ai-agent', label: 'Code Analyzer', position: { x: 350, y: 280 }, status: 'idle', data: {}, description: 'AI code review' },
      { id: 'n4', type: 'notification', label: 'Post Review', position: { x: 600, y: 200 }, status: 'idle', data: {}, description: 'Post review comments' },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', animated: true },
      { id: 'e2', source: 'n1', target: 'n3', animated: true },
      { id: 'e3', source: 'n2', target: 'n4' },
      { id: 'e4', source: 'n3', target: 'n4' },
    ],
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    lastRun: new Date(Date.now() - 1800000).toISOString(),
    runCount: 1843,
    successRate: 99.1,
    avgDuration: 45000,
    tags: ['devops', 'ai', 'code-review'],
  },
  {
    id: 'wf-003',
    name: 'Data Pipeline Orchestrator',
    description: 'ETL pipeline with AI-driven data quality checks and anomaly detection',
    status: 'paused',
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Cron Schedule', position: { x: 100, y: 200 }, status: 'idle', data: {}, description: 'Runs every 6 hours' },
      { id: 'n2', type: 'code-exec', label: 'Extract Data', position: { x: 350, y: 200 }, status: 'idle', data: {}, description: 'Pull from sources' },
      { id: 'n3', type: 'transform', label: 'Transform', position: { x: 600, y: 200 }, status: 'idle', data: {}, description: 'Clean and normalize' },
      { id: 'n4', type: 'ai-agent', label: 'Anomaly Detect', position: { x: 850, y: 200 }, status: 'idle', data: {}, description: 'Detect anomalies' },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', animated: false },
      { id: 'e2', source: 'n2', target: 'n3', animated: false },
      { id: 'e3', source: 'n3', target: 'n4', animated: false },
    ],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    lastRun: new Date(Date.now() - 86400000 * 2).toISOString(),
    runCount: 412,
    successRate: 94.7,
    avgDuration: 182000,
    tags: ['data', 'etl', 'ai'],
  },
  {
    id: 'wf-004',
    name: 'Incident Response Bot',
    description: 'Automated incident detection, triage, and resolution with AI-guided remediation',
    status: 'active',
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Alert Fired', position: { x: 100, y: 200 }, status: 'idle', data: {}, description: 'PagerDuty alert' },
      { id: 'n2', type: 'ai-agent', label: 'Triage Agent', position: { x: 350, y: 200 }, status: 'idle', data: {}, description: 'Analyzes severity' },
      { id: 'n3', type: 'condition', label: 'Severity', position: { x: 600, y: 200 }, status: 'idle', data: {}, description: 'P1 or lower?' },
      { id: 'n4', type: 'notification', label: 'Page On-Call', position: { x: 850, y: 100 }, status: 'idle', data: {}, description: 'Wake up on-call' },
      { id: 'n5', type: 'code-exec', label: 'Auto Remediate', position: { x: 850, y: 300 }, status: 'idle', data: {}, description: 'Run playbook' },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', animated: true },
      { id: 'e2', source: 'n2', target: 'n3', animated: true },
      { id: 'e3', source: 'n3', target: 'n4', label: 'P1' },
      { id: 'e4', source: 'n3', target: 'n5', label: 'P2/P3' },
    ],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
    lastRun: new Date(Date.now() - 900000).toISOString(),
    runCount: 89,
    successRate: 96.6,
    avgDuration: 8500,
    tags: ['ops', 'incident', 'ai'],
  },
  {
    id: 'wf-005',
    name: 'Content Generation Pipeline',
    description: 'Multi-stage AI content creation with brand voice validation and SEO optimization',
    status: 'completed',
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Content Brief', position: { x: 100, y: 200 }, status: 'idle', data: {}, description: 'Receive content brief' },
      { id: 'n2', type: 'ai-agent', label: 'Draft Writer', position: { x: 350, y: 200 }, status: 'idle', data: {}, description: 'Generate first draft' },
      { id: 'n3', type: 'ai-agent', label: 'SEO Optimizer', position: { x: 600, y: 200 }, status: 'idle', data: {}, description: 'Optimize for SEO' },
      { id: 'n4', type: 'notification', label: 'Publish', position: { x: 850, y: 200 }, status: 'idle', data: {}, description: 'Publish to CMS' },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', animated: false },
      { id: 'e2', source: 'n2', target: 'n3', animated: false },
      { id: 'e3', source: 'n3', target: 'n4', animated: false },
    ],
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    lastRun: new Date(Date.now() - 86400000 * 1).toISOString(),
    runCount: 156,
    successRate: 100,
    avgDuration: 25000,
    tags: ['content', 'ai', 'marketing'],
  },
]

export function getAllWorkflows(): Workflow[] {
  return MOCK_WORKFLOWS
}

export function getWorkflowById(id: string): Workflow | undefined {
  return MOCK_WORKFLOWS.find(w => w.id === id)
}

export function createWorkflow(data: Partial<Workflow>): Workflow {
  const newWorkflow: Workflow = {
    id: `wf-${Date.now()}`,
    name: data.name ?? 'New Workflow',
    description: data.description ?? '',
    status: 'pending',
    nodes: data.nodes ?? [],
    edges: data.edges ?? [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    runCount: 0,
    successRate: 0,
    avgDuration: 0,
    tags: data.tags ?? [],
  }
  MOCK_WORKFLOWS.push(newWorkflow)
  return newWorkflow
}
