import { NextResponse } from 'next/server'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { buildPlannerPrompt, getMockPlannerResponse, type PlannerInput } from '@/lib/ai/planner'
import { generateWorkflowTool } from '@/lib/ai/tools'

export async function POST(req: Request) {
  const body = await req.json() as PlannerInput

  if (!process.env.OPENAI_API_KEY) {
    const mock = getMockPlannerResponse(body.goal)

    const nodes = mock.nodes.map((n, i) => ({
      id: `node-${i + 1}`,
      type: n.type,
      label: n.label,
      description: n.description,
      position: { x: 80 + i * 260, y: 200 + (i % 2 === 0 ? 0 : -60) },
      status: 'idle' as const,
      data: {},
    }))

    const edges = mock.nodes.slice(0, -1).map((_, i) => ({
      id: `edge-${i + 1}`,
      source: `node-${i + 1}`,
      target: `node-${i + 2}`,
      animated: true,
    }))

    return NextResponse.json({ ...mock, nodes, edges })
  }

  const prompt = buildPlannerPrompt(body)

  const result = streamText({
    model: openai('gpt-4o'),
    prompt,
    tools: { generate_workflow: generateWorkflowTool },
    maxSteps: 2,
  })

  return result.toDataStreamResponse()
}
