import { tool } from 'ai'
import { z } from 'zod'
import type { WorkflowNode, WorkflowEdge } from '@/types'
import { executeCodeSnippet, type ExecutionLanguage } from '@/lib/execution/code-runner'
import { searchLocalDocs } from '@/lib/docs/search'

export const generateWorkflowTool = tool({
  description: 'Generate a workflow DAG based on a goal description',
  parameters: z.object({
    goal: z.string().describe('The high-level goal for the workflow'),
    steps: z.array(z.object({
      type: z.enum(['trigger', 'ai-agent', 'code-exec', 'condition', 'notification', 'transform']),
      label: z.string(),
      description: z.string(),
    })).describe('The steps in the workflow'),
  }),
  execute: async (input: any) => {
    const params = input as { goal: string; steps: any[] }
    const { goal, steps } = params
    const nodes: WorkflowNode[] = steps.map((step: typeof steps[0], i: number) => ({
      id: `node-${i + 1}`,
      type: step.type as WorkflowNode['type'],
      label: step.label,
      description: step.description,
      position: { x: 100 + i * 250, y: 200 },
      status: 'idle' as const,
      data: {},
    }))

    const edges: WorkflowEdge[] = steps.slice(0, -1).map((_: typeof steps[0], i: number) => ({
      id: `edge-${i + 1}`,
      source: `node-${i + 1}`,
      target: `node-${i + 2}`,
      animated: true,
    }))

    return { goal, nodes, edges }
  },
} as any)

export const executeCodeTool = tool({
  description: 'Execute a code snippet and return the output',
  parameters: z.object({
    code: z.string().describe('The code to execute'),
    language: z.enum(['python', 'javascript', 'typescript', 'bash']).describe('The programming language'),
  }),
  execute: async (input: any) => {
    const params = input as { code: string; language: ExecutionLanguage }
    const { code, language } = params
    const result = await executeCodeSnippet({ code, language })
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n').trim()

    return {
      output: output || 'Execution complete',
      exitCode: result.exitCode,
      durationMs: result.durationMs,
    }
  },
} as any)

export const searchDocsTool = tool({
  description: 'Search the Autopilot documentation',
  parameters: z.object({
    query: z.string().describe('The search query'),
  }),
  execute: async (input: any) => {
    const params = input as { query: string }
    const { query } = params
    const results = await searchLocalDocs(query)
    return { results }
  },
} as any)
