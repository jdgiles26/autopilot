import { NextResponse } from 'next/server'
import type { Workflow } from '@/types'
import { createWorkflow, getAllWorkflows } from '@/lib/db'

export async function GET() {
  const workflows = await getAllWorkflows()
  return NextResponse.json({ workflows, total: workflows.length })
}

export async function POST(req: Request) {
  const body = await req.json() as Partial<Workflow>
  const workflow = await createWorkflow(body)
  return NextResponse.json(workflow, { status: 201 })
}
