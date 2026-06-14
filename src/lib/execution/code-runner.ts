import 'server-only'

import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as ts from 'typescript'

export type ExecutionLanguage = 'python' | 'javascript' | 'typescript' | 'bash'

export interface ExecutionLine {
  type: 'output' | 'error' | 'info' | 'success'
  content: string
}

export interface ExecuteCodeOptions {
  code: string
  language: ExecutionLanguage
  timeoutMs?: number
  onLine?: (line: ExecutionLine) => void
}

export interface ExecuteCodeResult {
  stdout: string
  stderr: string
  exitCode: number
  durationMs: number
  command: string
  runtime: string
}

const DEFAULT_TIMEOUT_MS = 30_000

function flushLines(
  chunk: string,
  buffer: { value: string },
  onLine?: (line: string) => void,
) {
  buffer.value += chunk
  const parts = buffer.value.split(/\r?\n/)
  buffer.value = parts.pop() ?? ''

  for (const part of parts) {
    onLine?.(part)
  }
}

function getRuntimeDetails(language: ExecutionLanguage) {
  switch (language) {
    case 'javascript':
      return {
        runtime: 'Node.js',
        command: 'node',
        extension: '.js',
      }
    case 'typescript':
      return {
        runtime: 'TypeScript via Node.js',
        command: 'node',
        extension: '.js',
      }
    case 'bash':
      return {
        runtime: 'Bash',
        command: '/bin/bash',
        extension: '.sh',
      }
    default:
      return {
        runtime: 'Python',
        command: 'python3',
        extension: '.py',
      }
  }
}

async function writeExecutableSource(language: ExecutionLanguage, code: string, directory: string) {
  const { extension } = getRuntimeDetails(language)
  const filePath = join(directory, `snippet${extension}`)

  if (language === 'typescript') {
    const transpiled = ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    })

    await writeFile(filePath, transpiled.outputText, 'utf8')
    return filePath
  }

  await writeFile(filePath, code, 'utf8')
  return filePath
}

export async function executeCodeSnippet({
  code,
  language,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  onLine,
}: ExecuteCodeOptions): Promise<ExecuteCodeResult> {
  const { runtime, command } = getRuntimeDetails(language)
  const workdir = await mkdtemp(join(tmpdir(), 'autopilot-exec-'))
  const sourcePath = await writeExecutableSource(language, code, workdir)

  const args = language === 'python'
    ? ['-u', sourcePath]
    : [sourcePath]

  const startedAt = Date.now()

  try {
    return await new Promise<ExecuteCodeResult>((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: workdir,
        env: {
          ...process.env,
          PYTHONUNBUFFERED: '1',
          NODE_NO_WARNINGS: '1',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      })

      let stdout = ''
      let stderr = ''
      let finished = false
      const stdoutBuffer = { value: '' }
      const stderrBuffer = { value: '' }

      const timeout = setTimeout(() => {
        if (finished) return
        finished = true
        child.kill('SIGKILL')
        reject(new Error(`Execution timed out after ${Math.round(timeoutMs / 1000)}s`))
      }, timeoutMs)

      const finish = (exitCode: number) => {
        if (finished) return
        finished = true
        clearTimeout(timeout)

        if (stdoutBuffer.value.length > 0) {
          onLine?.({ type: 'output', content: stdoutBuffer.value })
        }

        if (stderrBuffer.value.length > 0) {
          onLine?.({ type: 'error', content: stderrBuffer.value })
        }

        resolve({
          stdout,
          stderr,
          exitCode,
          durationMs: Date.now() - startedAt,
          command: `${command} ${args.join(' ')}`,
          runtime,
        })
      }

      child.stdout?.setEncoding('utf8')
      child.stdout?.on('data', chunk => {
        const text = String(chunk)
        stdout += text
        flushLines(text, stdoutBuffer, line => onLine?.({ type: 'output', content: line }))
      })

      child.stderr?.setEncoding('utf8')
      child.stderr?.on('data', chunk => {
        const text = String(chunk)
        stderr += text
        flushLines(text, stderrBuffer, line => onLine?.({ type: 'error', content: line }))
      })

      child.on('error', error => {
        if (finished) return
        finished = true
        clearTimeout(timeout)
        reject(error)
      })

      child.on('close', code => {
        finish(code ?? 1)
      })
    })
  } finally {
    await rm(workdir, { recursive: true, force: true })
  }
}
