import { tool } from 'ai'
import { z } from 'zod'
import type { WorkflowNode, WorkflowEdge } from '@/types'

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
  execute: async ({ goal, steps }) => {
    const nodes: WorkflowNode[] = steps.map((step, i) => ({
      id: `node-${i + 1}`,
      type: step.type as WorkflowNode['type'],
      label: step.label,
      description: step.description,
      position: { x: 100 + i * 250, y: 200 },
      status: 'idle' as const,
      data: {},
    }))

    const edges: WorkflowEdge[] = steps.slice(0, -1).map((_, i) => ({
      id: `edge-${i + 1}`,
      source: `node-${i + 1}`,
      target: `node-${i + 2}`,
      animated: true,
    }))

    return { goal, nodes, edges }
  },
})

export const executeCodeTool = tool({
  description: 'Execute a code snippet and return the output',
  parameters: z.object({
    code: z.string().describe('The code to execute'),
    language: z.enum(['python', 'javascript']).describe('The programming language'),
  }),
  execute: async ({ code, language }) => {
    // Mock execution
    const mockOutputs: Record<string, string> = {
      python: `Python 3.11.4
>>> ${code.split('\n')[0]}
Hello, World!
Process finished with exit code 0`,
      javascript: `Node.js v20.10.0
> ${code.split('\n')[0]}
'Hello, World!'
undefined`,
    }
    return { output: mockOutputs[language] ?? 'Execution complete', exitCode: 0 }
  },
})

export const searchDocsTool = tool({
  description: 'Search the Autopilot documentation',
  parameters: z.object({
    query: z.string().describe('The search query'),
  }),
  execute: async ({ query }) => {
    return {
      results: [
        { title: 'Getting Started with Autopilot', url: '/docs/getting-started', snippet: `Learn how to build your first workflow with ${query}...` },
        { title: 'AI Agent Configuration', url: '/docs/agents', snippet: 'Configure AI agents for your workflows...' },
      ],
    }
  },
})
