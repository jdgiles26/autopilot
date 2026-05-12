import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import type { Workflow } from '@/types'

const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-001',
    name: 'Data Ingestion Pipeline',
    description: 'Real-time ETL pipeline with AI-powered data validation',
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
    description: 'Automated PR review using GPT-4o with custom rule engine',
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
]

export async function GET() {
  return NextResponse.json({ workflows: MOCK_WORKFLOWS, total: MOCK_WORKFLOWS.length })
}

export async function POST(req: Request) {
  const body = await req.json() as Partial<Workflow>

  const newWorkflow: Workflow = {
    id: uuidv4(),
    name: body.name ?? 'Untitled Workflow',
    description: body.description ?? '',
    status: 'pending',
    nodes: body.nodes ?? [],
    edges: body.edges ?? [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    runCount: 0,
    successRate: 0,
    avgDuration: 0,
    tags: body.tags ?? [],
  }

  return NextResponse.json(newWorkflow, { status: 201 })
}
