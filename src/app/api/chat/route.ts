import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { generateWorkflowTool, executeCodeTool, searchDocsTool } from '@/lib/ai/tools'
import { SYSTEM_PROMPT } from '@/lib/ai/planner'

function getMockStream(prompt: string): ReadableStream {
  const responses: Record<string, string> = {
    default: `I'm Autopilot AI — your autonomous workflow engineering assistant. I can help you:

- **Design** multi-step AI workflow DAGs
- **Generate** production-ready Python & JavaScript code
- **Optimize** data pipelines and automation logic
- **Debug** workflow failures with root-cause analysis

What would you like to build today?`,
    workflow: `Here's a workflow plan for your use case:

\`\`\`json
{
  "name": "AI Processing Pipeline",
  "nodes": [
    { "type": "trigger", "label": "HTTP Trigger", "description": "Receives incoming payload" },
    { "type": "ai-agent", "label": "GPT-4o Processor", "description": "Analyzes and enriches data" },
    { "type": "condition", "label": "Quality Gate", "description": "Validates output quality > 90%" },
    { "type": "code-exec", "label": "Transform", "description": "Maps fields and formats output" },
    { "type": "notification", "label": "Deliver Results", "description": "Sends to downstream system" }
  ]
}
\`\`\`

This DAG follows a **validate-then-execute** pattern for maximum reliability. Each node handles one concern, keeping the workflow composable and testable.`,
    python: `Here's a production-ready Python implementation:

\`\`\`python
import asyncio
import httpx
from typing import Any

async def process_workflow(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Async workflow processor with error handling and retries.
    """
    async with httpx.AsyncClient(timeout=30) as client:
        # Step 1: Validate schema
        validated = validate_schema(payload)
        
        # Step 2: Call AI endpoint
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={
                "model": "gpt-4o",
                "messages": [{"role": "user", "content": str(validated)}]
            }
        )
        
        return {"status": "success", "result": response.json()}

# Run it
asyncio.run(process_workflow({"data": "example"}))
\`\`\`

Key design decisions:
- **Async** for non-blocking I/O — critical for high-throughput workflows
- **Context manager** for HTTP client lifecycle management  
- **Type hints** for IDE support and runtime validation`,
  }

  const lower = prompt.toLowerCase()
  let text = responses.default
  if (lower.includes('workflow') || lower.includes('pipeline') || lower.includes('dag')) {
    text = responses.workflow
  } else if (lower.includes('python') || lower.includes('code') || lower.includes('script')) {
    text = responses.python
  }

  const encoder = new TextEncoder()
  const words = text.split('')
  let index = 0

  return new ReadableStream({
    async start(controller) {
      while (index < words.length) {
        const chunk = words.slice(index, index + 3).join('')
        controller.enqueue(encoder.encode(`0:"${chunk.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`))
        index += 3
        await new Promise(resolve => setTimeout(resolve, 8))
      }
      controller.close()
    }
  })
}

export async function POST(req: Request) {
  const body = await req.json() as { messages: Array<{ role: string; content: string }> }

  // If no API key, return a mock streaming response
  if (!process.env.OPENAI_API_KEY) {
    const lastMessage = body.messages[body.messages.length - 1]
    const stream = getMockStream(lastMessage?.content ?? '')
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
      },
    })
  }

  const result = streamText({
    model: openai('gpt-4o'),
    system: SYSTEM_PROMPT,
    messages: body.messages as Parameters<typeof streamText>[0]['messages'],
    tools: {
      generate_workflow: generateWorkflowTool,
      execute_code: executeCodeTool,
      search_docs: searchDocsTool,
    },
    maxSteps: 3,
  })

  return result.toDataStreamResponse()
}
