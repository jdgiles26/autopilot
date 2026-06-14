import { streamText } from 'ai'
import { generateWorkflowTool, executeCodeTool, searchDocsTool } from '@/lib/ai/tools'
import { SYSTEM_PROMPT } from '@/lib/ai/planner'
import { getOllamaModel } from '@/lib/ai/provider'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: Request) {
  const body = await req.json() as { messages: ChatMessage[] }

  const result = streamText({
    model: getOllamaModel(),
    system: SYSTEM_PROMPT,
    messages: body.messages,
    tools: {
      generate_workflow: generateWorkflowTool,
      execute_code: executeCodeTool,
      search_docs: searchDocsTool,
    },
    maxSteps: 3,
  } as any)

  return result.toTextStreamResponse()
}
