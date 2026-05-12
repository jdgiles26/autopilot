'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues with Monaco
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const MONACO_OPTIONS = {
  fontSize: 13,
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  fontLigatures: true,
  lineHeight: 22,
  padding: { top: 16, bottom: 16 },
  minimap: { enabled: false },
  scrollbar: {
    vertical: 'auto' as const,
    horizontal: 'auto' as const,
    verticalScrollbarSize: 6,
    horizontalScrollbarSize: 6,
  },
  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true,
  renderLineHighlight: 'line' as const,
  lineNumbers: 'on' as const,
  glyphMargin: false,
  folding: true,
  lineDecorationsWidth: 8,
  lineNumbersMinChars: 4,
  automaticLayout: true,
  wordWrap: 'on' as const,
  tabSize: 2,
  insertSpaces: true,
  smoothScrolling: true,
  cursorBlinking: 'smooth' as const,
  cursorSmoothCaretAnimation: 'on' as const,
}

const DARK_THEME = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '475569', fontStyle: 'italic' },
    { token: 'keyword', foreground: '818cf8' },
    { token: 'string', foreground: '34d399' },
    { token: 'number', foreground: 'fbbf24' },
    { token: 'function', foreground: '22d3ee' },
    { token: 'type', foreground: 'a78bfa' },
    { token: 'variable', foreground: 'e2e8f0' },
  ],
  colors: {
    'editor.background': '#0a0a12',
    'editor.foreground': '#e2e8f0',
    'editorLineNumber.foreground': '#334155',
    'editorLineNumber.activeForeground': '#6366f1',
    'editor.selectionBackground': '#6366f130',
    'editor.lineHighlightBackground': '#6366f108',
    'editorCursor.foreground': '#6366f1',
    'editor.findMatchBackground': '#6366f140',
    'editorGutter.background': '#0a0a12',
    'scrollbarSlider.background': '#6366f120',
    'scrollbarSlider.hoverBackground': '#6366f140',
  },
}

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  readOnly?: boolean
  height?: string
}

export function CodeEditor({
  value,
  onChange,
  language = 'python',
  readOnly = false,
  height = '100%',
}: CodeEditorProps) {
  const handleMount = (editor: unknown, monaco: unknown) => {
    const m = monaco as {
      editor: {
        defineTheme: (name: string, theme: typeof DARK_THEME) => void
        setTheme: (name: string) => void
      }
    }
    m.editor.defineTheme('autopilot-dark', DARK_THEME)
    m.editor.setTheme('autopilot-dark')
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full bg-[#0a0a12] text-slate-500 text-sm">
        Loading editor...
      </div>
    }>
      <MonacoEditor
        height={height}
        language={language}
        value={value}
        onChange={v => onChange(v ?? '')}
        onMount={handleMount}
        options={{
          ...MONACO_OPTIONS,
          readOnly,
          theme: 'autopilot-dark',
        }}
      />
    </Suspense>
  )
}
