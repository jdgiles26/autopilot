import { NextResponse } from 'next/server'
import type { Workflow } from '@/types'
import { createWorkflow, getAllWorkflows } from '@/lib/db'

/**
 * Retrieves all workflows.
 *
 * @returns A JSON response containing the array of workflows and the total count.
 */
export async function GET() {
  const workflows = await getAllWorkflows()
  return NextResponse.json({ workflows, total: workflows.length })
}

/**
 * Creates a new workflow from the request body.
 *
 * @returns The created workflow as a JSON response with HTTP status 201.
 */
export async function POST(req: Request) {
  const body = await req.json() as Partial<Workflow>
  const workflow = await createWorkflow(body)
  return NextResponse.json(workflow, { status: 201 })
}
