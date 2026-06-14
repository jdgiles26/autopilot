import 'server-only'

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import type { Workflow } from '@/types'

const STORE_PATH = join(process.cwd(), '.autopilot-data', 'workflows.json')

async function readStore(): Promise<Workflow[]> {
  try {
    const raw = await readFile(STORE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed as Workflow[] : []
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }

    throw error
  }
}

async function writeStore(workflows: Workflow[]) {
  await mkdir(dirname(STORE_PATH), { recursive: true })
  await writeFile(STORE_PATH, `${JSON.stringify(workflows, null, 2)}\n`, 'utf8')
}

export async function getAllWorkflows(): Promise<Workflow[]> {
  return readStore()
}

export async function getWorkflowById(id: string): Promise<Workflow | undefined> {
  const workflows = await readStore()
  return workflows.find(workflow => workflow.id === id)
}

export async function createWorkflow(data: Partial<Workflow>): Promise<Workflow> {
  const workflows = await readStore()
  const newWorkflow: Workflow = {
    id: data.id ?? `wf-${Date.now()}`,
    name: data.name ?? 'New Workflow',
    description: data.description ?? '',
    status: data.status ?? 'pending',
    nodes: data.nodes ?? [],
    edges: data.edges ?? [],
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString(),
    lastRun: data.lastRun,
    runCount: data.runCount ?? 0,
    successRate: data.successRate ?? 0,
    avgDuration: data.avgDuration ?? 0,
    tags: data.tags ?? [],
  }

  workflows.unshift(newWorkflow)
  await writeStore(workflows)
  return newWorkflow
}

export async function updateWorkflow(id: string, data: Partial<Workflow>): Promise<Workflow | undefined> {
  const workflows = await readStore()
  const index = workflows.findIndex(workflow => workflow.id === id)
  if (index < 0) return undefined

  const updatedWorkflow: Workflow = {
    ...workflows[index],
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  }

  workflows[index] = updatedWorkflow
  await writeStore(workflows)
  return updatedWorkflow
}
