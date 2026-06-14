import { NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { buildPlannerPrompt, plannerOutputSchema, type PlannerInput } from '@/lib/ai/planner'
import { getOllamaModel } from '@/lib/ai/provider'

export async function POST(req: Request) {
  const body = await req.json() as PlannerInput

  const prompt = buildPlannerPrompt(body)
  const result = await generateObject({
    model: getOllamaModel(),
    schema: plannerOutputSchema,
    prompt,
    mode: 'auto',
  })

  const nodes = result.object.nodes.map((node, i) => ({
    id: `node-${i + 1}`,
    type: node.type,
    label: node.label,
    description: node.description,
    position: { x: 80 + i * 260, y: 200 + (i % 2 === 0 ? 0 : -60) },
    status: 'idle' as const,
    data: {},
  }))

  const edges = result.object.nodes.slice(0, -1).map((_, i) => ({
    id: `edge-${i + 1}`,
    source: `node-${i + 1}`,
    target: `node-${i + 2}`,
    animated: true,
  }))

  return NextResponse.json({ ...result.object, nodes, edges })
}
