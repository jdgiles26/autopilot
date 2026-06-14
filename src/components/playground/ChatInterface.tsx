'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, RotateCcw, Zap } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OrbitSpinner } from '@/components/animations/GlowPulse'

const SUGGESTIONS = [
  'Generate a Python ETL pipeline for CSV processing',
  'Create a workflow that classifies emails using AI',
  'Write a FastAPI endpoint with authentication',
  'Build a data validation script with error handling',
]

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: '',
      }
      setMessages(prev => [...prev, assistantMessage])

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('0:')) {
            const text = line.slice(2)
            setMessages(prev => {
              const msgs = [...prev]
              if (msgs[msgs.length - 1].role === 'assistant') {
                msgs[msgs.length - 1].content += text
              }
              return msgs
            })
          }
        }
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e as unknown as React.FormEvent)
    }
  }

  const handleSuggestion = (text: string) => {
    setInput(text)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(99,102,241,0.15)]">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center"
            style={{ boxShadow: '0 0 12px rgba(6,182,212,0.4)' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Autopilot AI</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-slate-500">Ollama • Local</span>
            </div>
          </div>
        </div>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => setMessages([])}
          title="Clear conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full min-h-48 text-center space-y-6"
            >
              <div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-600 flex items-center justify-center"
                style={{ boxShadow: '0 0 40px rgba(99,102,241,0.3)' }}
              >
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 mb-1">Autopilot AI Assistant</h3>
                <p className="text-sm text-slate-500 max-w-xs">
                  Ask me to generate workflows, write code, analyze data, or plan automation strategies
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="text-left text-xs px-3 py-2.5 rounded-lg border border-[rgba(99,102,241,0.2)] text-slate-400 hover:text-slate-200 hover:border-[rgba(99,102,241,0.4)] hover:bg-[rgba(99,102,241,0.05)] transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((message, i) => (
              <MessageBubble
                key={message.id}
                message={message}
                isStreaming={isLoading && i === messages.length - 1 && message.role === 'assistant'}
              />
            ))
          )}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0">
              <OrbitSpinner size={20} />
            </div>
            <div className="bg-[#13131f] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-slate-500"
                    animate={{ y: [-3, 3, -3] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[rgba(99,102,241,0.15)]">
        <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything... (Shift+Enter for new line)"
              rows={1}
              className="w-full rounded-lg border border-[rgba(99,102,241,0.2)] bg-[#13131f] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all min-h-[40px] max-h-32"
              style={{ height: 'auto' }}
              onInput={e => {
                const el = e.target as HTMLTextAreaElement
                el.style.height = 'auto'
                el.style.height = `${Math.min(el.scrollHeight, 128)}px`
              }}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
