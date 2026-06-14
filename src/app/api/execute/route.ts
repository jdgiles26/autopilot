import { executeCodeSnippet, type ExecutionLanguage, type ExecutionLine } from '@/lib/execution/code-runner'

export const runtime = 'nodejs'

function encodeLine(line: ExecutionLine) {
  return `data: ${JSON.stringify(line)}\n\n`
}

export async function POST(req: Request) {
  const body = await req.json() as { code: string; language?: ExecutionLanguage }
  const language = body.language ?? 'python'
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(encodeLine({
          type: 'info',
          content: `Starting ${language} execution locally...`,
        })))

        const result = await executeCodeSnippet({
          code: body.code,
          language,
          onLine: line => {
            controller.enqueue(encoder.encode(encodeLine(line)))
          },
        })

        controller.enqueue(encoder.encode(encodeLine({
          type: result.exitCode === 0 ? 'success' : 'error',
          content: result.exitCode === 0
            ? `✓ Process finished with exit code 0 (took ${(result.durationMs / 1000).toFixed(2)}s)`
            : `✕ Process finished with exit code ${result.exitCode} (took ${(result.durationMs / 1000).toFixed(2)}s)`,
        })))
      } catch (error) {
        controller.enqueue(encoder.encode(encodeLine({
          type: 'error',
          content: `Execution error: ${error instanceof Error ? error.message : String(error)}`,
        })))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
