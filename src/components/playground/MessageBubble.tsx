'use client'

import React, { memo, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion } from 'framer-motion'
import { Bot, User, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

import { type UIMessage } from 'ai'

interface MessageBubbleProps {
  message: UIMessage
  isStreaming?: boolean
}

export const MessageBubble = memo(function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const content = typeof message.content === 'string' ? message.content : ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex gap-3 group', isUser ? 'flex-row-reverse' : '')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser
            ? 'bg-gradient-to-br from-indigo-500 to-violet-600'
            : 'bg-gradient-to-br from-cyan-500 to-indigo-600'
        )}
        style={{ boxShadow: isUser ? '0 0 12px rgba(99,102,241,0.4)' : '0 0 12px rgba(6,182,212,0.4)' }}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Bubble */}
      <div className={cn('flex flex-col gap-1 max-w-[80%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-xl px-4 py-2.5 text-sm relative',
            isUser
              ? 'bg-[rgba(99,102,241,0.2)] border border-[rgba(99,102,241,0.3)] text-slate-100'
              : 'bg-[#13131f] border border-[rgba(255,255,255,0.06)] text-slate-200'
          )}
        >
          {isUser ? (
            <p className="leading-relaxed">{content}</p>
          ) : (
            <div className="prose-dark prose prose-sm max-w-none leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }) {
                    const isInline = !className
                    return isInline ? (
                      <code
                        className="bg-[#0a0a12] px-1.5 py-0.5 rounded text-cyan-300 font-mono text-xs"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <code
                        className={cn(className, 'font-mono text-xs block')}
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                  pre({ children }) {
                    return (
                      <pre className="bg-[#0a0a12] border border-[rgba(99,102,241,0.15)] rounded-lg p-3 overflow-x-auto my-2">
                        {children}
                      </pre>
                    )
                  },
                  p({ children }) {
                    return <p className="mb-2 last:mb-0">{children}</p>
                  },
                  ul({ children }) {
                    return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                  },
                  ol({ children }) {
                    return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                  },
                }}
              >
                {content}
              </ReactMarkdown>
              {isStreaming && (
                <motion.span
                  className="inline-block w-1.5 h-4 bg-cyan-400 ml-0.5 align-middle rounded-sm"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </div>
          )}
        </div>

        {/* Copy button */}
        {!isUser && !isStreaming && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            {copied ? (
              <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
            ) : (
              <><Copy className="w-3 h-3" />Copy</>
            )}
          </button>
        )}
      </div>
    </motion.div>
  )
})
