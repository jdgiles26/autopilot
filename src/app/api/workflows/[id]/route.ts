import { NextResponse } from 'next/server'
import { getWorkflowById } from '@/lib/db'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * Fetches and returns a workflow by its ID.
 *
 * @returns A JSON response containing the workflow, or a 404 error if the workflow is not found.
 */
export async function GET(_: Request, { params }: RouteParams) {
  const { id } = await params
  const workflow = await getWorkflowById(id)

  if (!workflow) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
  }

  return NextResponse.json(workflow)
}
