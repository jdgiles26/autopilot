'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { ChatInterface } from '@/components/playground/ChatInterface'
import { CodeEditor } from '@/components/playground/CodeEditor'
import { ExecutionTerminal } from '@/components/playground/ExecutionTerminal'
import { Play, Code2, MessageSquare, SplitSquareHorizontal } from 'lucide-react'

interface TerminalLine {
  id: string
  type: 'command' | 'output' | 'error' | 'info' | 'success'
  content: string
}

const PYTHON_STARTER = `# Autopilot AI Playground
# Write your code here — click Execute to run it

import json
from datetime import datetime

def process_workflow_data(data: dict) -> dict:
    """Process and validate incoming workflow payload."""
    return {
        "status": "processed",
        "timestamp": datetime.utcnow().isoformat(),
        "record_count": len(data.get("records", [])),
        "validated": True,
    }

# Example usage
payload = {
    "workflow_id": "wf-001",
    "records": [
        {"id": 1, "value": "alpha"},
        {"id": 2, "value": "beta"},
        {"id": 3, "value": "gamma"},
    ],
}

result = process_workflow_data(payload)
print(json.dumps(result, indent=2))
`

const LANGUAGE_OPTIONS = ['python', 'javascript', 'typescript', 'bash'] as const
type Language = typeof LANGUAGE_OPTIONS[number]

type PanelLayout = 'split' | 'chat' | 'code'

export default function PlaygroundPage() {
  const [code, setCode] = useState(PYTHON_STARTER)
  const [language, setLanguage] = useState<Language>('python')
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [layout, setLayout] = useState<PanelLayout>('split')

  const addLine = (type: TerminalLine['type'], content: string) =>
    setTerminalLines(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, type, content }])

  const handleExecute = async () => {
    if (isExecuting) return
    setIsExecuting(true)
    setTerminalLines([])

    addLine('command', `${language} execute.${language === 'python' ? 'py' : 'js'}`)
    addLine('info', `Runtime: ${language === 'python' ? 'Python 3.11' : 'Node.js v20'} · Autopilot Sandbox v1.0`)

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      })

      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(Boolean)
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const payload = JSON.parse(line.slice(6)) as { type: string; content: string }
              addLine(
                payload.type as TerminalLine['type'],
                payload.content
              )
            } catch { /* ignore malformed */ }
          }
        }
      }
    } catch (err) {
      addLine('error', `Execution error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <AppShell
      title="Playground"
      breadcrumbs={[{ label: 'Playground' }]}
    >
      <div className="relative z-10 flex flex-col h-full">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-5 py-2.5 border-b border-[rgba(99,102,241,0.15)] bg-[#0a0a12]/80 backdrop-blur-sm shrink-0"
        >
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Playground</span>

          <div className="h-4 w-px bg-[rgba(99,102,241,0.2)]" />

          {/* Language selector */}
          <div className="flex items-center gap-1 p-0.5 rounded-md bg-[#13131f] border border-[rgba(99,102,241,0.15)]">
            {LANGUAGE_OPTIONS.map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  language === lang
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Layout toggle */}
          <div className="flex items-center gap-1 p-0.5 rounded-md bg-[#13131f] border border-[rgba(99,102,241,0.15)]">
            {([
              { value: 'split', Icon: SplitSquareHorizontal, label: 'Split' },
              { value: 'chat', Icon: MessageSquare, label: 'Chat' },
              { value: 'code', Icon: Code2, label: 'Code' },
            ] as const).map(({ value, Icon, label }) => (
              <button
                key={value}
                onClick={() => setLayout(value)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
                  layout === value
                    ? 'bg-[rgba(99,102,241,0.2)] text-indigo-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={label}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          <div className="ml-auto">
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="btn btn-primary text-xs h-8 px-4 gap-1.5"
            >
              {isExecuting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Executing…
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Execute
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Main panels */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-1 min-h-0 gap-0"
        >
          {/* Chat panel */}
          {(layout === 'split' || layout === 'chat') && (
            <div className={`${layout === 'split' ? 'w-[380px] xl:w-[420px]' : 'flex-1'} border-r border-[rgba(99,102,241,0.15)] flex flex-col shrink-0`}>
              <ChatInterface />
            </div>
          )}

          {/* Editor + Terminal */}
          {(layout === 'split' || layout === 'code') && (
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Editor */}
              <div className="flex-1 min-h-0 border-b border-[rgba(99,102,241,0.15)]">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#0f0f1a] border-b border-[rgba(99,102,241,0.1)]">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs font-mono text-slate-400">
                    {language === 'python' ? 'execute.py' : `execute.${language === 'typescript' ? 'ts' : language === 'bash' ? 'sh' : 'js'}`}
                  </span>
                  <div className="ml-auto flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                </div>
                <div className="h-[calc(100%-36px)]">
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    language={language}
                    height="100%"
                  />
                </div>
              </div>

              {/* Terminal */}
              <div className="h-52 shrink-0">
                <ExecutionTerminal
                  lines={terminalLines}
                  isRunning={isExecuting}
                  onClear={() => setTerminalLines([])}
                  language={language}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AppShell>
  )
}
