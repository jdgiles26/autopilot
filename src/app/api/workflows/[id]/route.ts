import { NextResponse } from 'next/server'
import { getWorkflowById } from '@/lib/db'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(_: Request, { params }: RouteParams) {
  const { id } = await params
  const workflow = await getWorkflowById(id)

  if (!workflow) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
  }

  return NextResponse.json(workflow)
}
