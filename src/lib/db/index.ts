import 'server-only'

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import type { Workflow } from '@/types'

const STORE_PATH = join(process.cwd(), '.autopilot-data', 'workflows.json')

/**
 * Loads and parses the workflow store from disk.
 *
 * @returns The array of workflows, or an empty array if the store does not exist or is not valid.
 */
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

/**
 * Persists the workflows array to the store file.
 */
async function writeStore(workflows: Workflow[]) {
  await mkdir(dirname(STORE_PATH), { recursive: true })
  await writeFile(STORE_PATH, `${JSON.stringify(workflows, null, 2)}\n`, 'utf8')
}

/**
 * Retrieves all workflows from the persistent store.
 *
 * @returns An array of all stored workflows
 */
export async function getAllWorkflows(): Promise<Workflow[]> {
  return readStore()
}

/**
 * Retrieves a workflow by its ID.
 *
 * @param id - The workflow ID to search for
 * @returns The workflow with the specified ID, or `undefined` if not found
 */
export async function getWorkflowById(id: string): Promise<Workflow | undefined> {
  const workflows = await readStore()
  return workflows.find(workflow => workflow.id === id)
}

/**
 * Creates and persists a new workflow with the provided data.
 *
 * Missing fields are assigned defaults. The created workflow is stored and returned.
 *
 * @param data - Partial workflow data
 * @returns The created workflow
 */
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

/**
 * Updates an existing workflow with the provided partial data.
 *
 * @param id - The identifier of the workflow to update
 * @param data - Partial workflow data to merge with the existing workflow
 * @returns The updated workflow, or `undefined` if no workflow with the given `id` was found
 */
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
