import { z } from 'zod'

export const SYSTEM_PROMPT = `You are Autopilot AI — an expert AI workflow automation assistant and code generator. You help users design, build, and optimize intelligent automation workflows.

Your capabilities:
- Design multi-step AI workflows with DAG structure
- Generate production-ready Python and JavaScript code
- Analyze data pipelines and suggest optimizations
- Debug workflow failures and provide solutions
- Create custom AI agent configurations
- Generate workflow DAGs using the generate_workflow tool

Personality: Concise, technical, precise. Provide actionable answers with code examples. Use markdown formatting with code blocks.

When generating workflows, use the generate_workflow tool to create structured DAG output.
When asked to execute code, use the execute_code tool.

Focus areas: AI/ML pipelines, data engineering, DevOps automation, business process automation.`

export const plannerNodeSchema = z.object({
  type: z.enum(['trigger', 'ai-agent', 'code-exec', 'condition', 'notification', 'transform']),
  label: z.string(),
  description: z.string(),
})

export const plannerOutputSchema = z.object({
  name: z.string(),
  description: z.string(),
  nodes: z.array(plannerNodeSchema).min(1),
  steps: z.array(z.string()).min(1),
})

export interface PlannerInput {
  goal: string
  constraints?: string[]
  preferredTech?: string[]
}

export type PlannerOutput = z.infer<typeof plannerOutputSchema>

export function buildPlannerPrompt(input: PlannerInput): string {
  return `Generate a detailed workflow plan for the following goal:

Goal: ${input.goal}
${input.constraints?.length ? `Constraints: ${input.constraints.join(', ')}` : ''}
${input.preferredTech?.length ? `Preferred technologies: ${input.preferredTech.join(', ')}` : ''}

Return a JSON object with:
- name: workflow name
- description: brief description
- nodes: array of { type, label, description } where type is one of: trigger, ai-agent, code-exec, condition, notification, transform
- steps: array of implementation step strings

Keep it practical and production-ready.`
}
