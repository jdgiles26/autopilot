const PYTHON_OUTPUTS: Array<{ type: string; content: string }> = [
  { type: 'info', content: 'Python 3.11.9 · Autopilot Sandbox v1.0.0' },
  { type: 'info', content: 'Initializing secure execution context...' },
  { type: 'output', content: '' },
  { type: 'output', content: '{\n  "status": "processed",\n  "timestamp": "2026-05-12T18:44:39.020Z",\n  "record_count": 3,\n  "validated": true\n}' },
  { type: 'output', content: '' },
  { type: 'success', content: '✓ Process finished with exit code 0 (took 0.43s)' },
]

const JS_OUTPUTS: Array<{ type: string; content: string }> = [
  { type: 'info', content: 'Node.js v20.10.0 · Autopilot Sandbox v1.0.0' },
  { type: 'info', content: 'Initializing secure execution context...' },
  { type: 'output', content: '' },
  { type: 'output', content: "{ status: 'processed', recordCount: 3, validated: true }" },
  { type: 'output', content: '' },
  { type: 'success', content: '✓ Process finished with exit code 0 (took 0.21s)' },
]

const TS_OUTPUTS: Array<{ type: string; content: string }> = [
  { type: 'info', content: 'TypeScript 5.4.5 · ts-node v10.9.2 · Autopilot Sandbox v1.0.0' },
  { type: 'info', content: 'Transpiling with esbuild...' },
  { type: 'output', content: '' },
  { type: 'output', content: '{ status: "processed", timestamp: "2026-05-12T18:44:39.020Z" }' },
  { type: 'success', content: '✓ Process finished with exit code 0 (took 0.38s)' },
]

const BASH_OUTPUTS: Array<{ type: string; content: string }> = [
  { type: 'info', content: 'Bash 5.2 · Autopilot Sandbox v1.0.0' },
  { type: 'output', content: 'Hello from Autopilot sandbox!' },
  { type: 'success', content: '✓ Exit code 0' },
]

function getOutputLines(language: string): Array<{ type: string; content: string }> {
  switch (language) {
    case 'javascript': return JS_OUTPUTS
    case 'typescript': return TS_OUTPUTS
    case 'bash': return BASH_OUTPUTS
    default: return PYTHON_OUTPUTS
  }
}

export async function POST(req: Request) {
  const body = await req.json() as { code: string; language?: string }
  const language = body.language ?? 'python'
  const outputLines = getOutputLines(language)

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      for (const line of outputLines) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(line)}\n\n`)
        )
        await new Promise(resolve => setTimeout(resolve, 120))
      }
      controller.close()
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
