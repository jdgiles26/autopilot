'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal as TerminalIcon, X, Maximize2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TerminalLine {
  id: string
  type: 'command' | 'output' | 'error' | 'info' | 'success'
  content: string
  timestamp?: Date
}

interface ExecutionTerminalProps {
  lines: TerminalLine[]
  isRunning?: boolean
  onClear?: () => void
  language?: string
}

const LINE_COLORS: Record<string, string> = {
  command: '#818cf8',
  output: '#d1fae5',
  error: '#fca5a5',
  info: '#93c5fd',
  success: '#34d399',
}

export function ExecutionTerminal({ lines, isRunning, onClear, language = 'python' }: ExecutionTerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  return (
    <div className="flex flex-col h-full bg-[#050508] rounded-b-xl overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0a0a0f] border-b border-[rgba(16,185,129,0.15)]">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-mono font-semibold text-emerald-400">
            AUTOPILOT TERMINAL
          </span>
          {isRunning && (
            <motion.span
              className="text-[10px] text-amber-400 bg-[rgba(245,158,11,0.1)] px-1.5 py-0.5 rounded font-mono"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              RUNNING
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-600">{language}</span>
          {onClear && (
            <button
              onClick={onClear}
              className="text-slate-600 hover:text-slate-400 transition-colors"
              title="Clear terminal"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-6">
        {lines.length === 0 ? (
          <div className="flex items-center gap-2 text-slate-600">
            <ChevronRight className="w-3 h-3 text-emerald-600" />
            <span>Ready. Click &quot;Execute&quot; to run your code.</span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {lines.map((line, i) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="flex items-start gap-2"
              >
                {line.type === 'command' && (
                  <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" style={{ color: LINE_COLORS.command }} />
                )}
                <span
                  style={{
                    color: LINE_COLORS[line.type] ?? '#d1fae5',
                    fontStyle: line.type === 'info' ? 'italic' : 'normal',
                  }}
                  className="break-all"
                >
                  {line.content}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isRunning && (
          <motion.div
            className="flex items-center gap-2 text-emerald-500 mt-1"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <span>▋</span>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
