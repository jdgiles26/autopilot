'use client'

import React, { useCallback, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
  Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Pause, Settings } from 'lucide-react'
import { WorkflowNode } from './WorkflowNode'
import type { Workflow } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDuration } from '@/lib/utils'

const NODE_TYPES = {
  trigger: WorkflowNode,
  'ai-agent': WorkflowNode,
  'code-exec': WorkflowNode,
  condition: WorkflowNode,
  notification: WorkflowNode,
  transform: WorkflowNode,
}

interface WorkflowCanvasProps {
  workflow: Workflow
}

export function WorkflowCanvas({ workflow }: WorkflowCanvasProps) {
  const initialNodes: Node[] = workflow.nodes.map(n => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: {
      label: n.label,
      description: n.description,
      nodeType: n.type,
      status: n.status ?? 'idle',
      ...n.data,
    },
  }))

  const initialEdges: Edge[] = workflow.edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: e.animated ?? false,
    type: 'smoothstep',
    style: {
      stroke: 'rgba(99,102,241,0.5)',
      strokeWidth: 2,
    },
    labelStyle: {
      fill: '#94a3b8',
      fontSize: 10,
      fontFamily: 'Inter',
    },
    labelBgStyle: {
      fill: '#13131f',
      fillOpacity: 0.9,
    },
  }))

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges(eds =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            style: { stroke: 'rgba(99,102,241,0.5)', strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const handleRun = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 3000)
  }

  return (
    <div className="flex h-full">
      {/* Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={() => setSelectedNode(null)}
          nodeTypes={NODE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          className="bg-[#0a0a12]"
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={30}
            size={1}
            color="rgba(99,102,241,0.12)"
          />
          <Controls
            className="!bg-[#13131f] !border-[rgba(99,102,241,0.2)] !rounded-lg"
          />
          <MiniMap
            nodeColor={(n) => {
              const colors: Record<string, string> = {
                trigger: '#6366f1',
                'ai-agent': '#06b6d4',
                'code-exec': '#10b981',
                condition: '#f59e0b',
                notification: '#8b5cf6',
                transform: '#ec4899',
              }
              return colors[n.type ?? ''] ?? '#475569'
            }}
            className="!bg-[#0f0f1a] !border-[rgba(99,102,241,0.2)]"
          />

          {/* Toolbar Panel */}
          <Panel position="top-right">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleRun}
                disabled={isRunning}
                className="gap-2"
              >
                {isRunning ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    Run
                  </>
                )}
              </Button>
              <Button size="sm" variant="ghost">
                <Settings className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Node detail panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-72 border-l border-[rgba(99,102,241,0.2)] bg-[#0f0f1a] flex flex-col shrink-0"
          >
            <div className="flex items-center justify-between p-4 border-b border-[rgba(99,102,241,0.15)]">
              <h3 className="font-semibold text-sm text-slate-200">Node Details</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-500 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <div>
                <p className="text-xs text-slate-500 mb-1">Name</p>
                <p className="text-sm font-medium text-slate-100">{selectedNode.data.label as string}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Type</p>
                <Badge variant="default" className="text-xs">
                  {selectedNode.data.nodeType as string}
                </Badge>
              </div>

              {(selectedNode.data.description as string | undefined) && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Description</p>
                  <p className="text-xs text-slate-400">{selectedNode.data.description as string}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background:
                        selectedNode.data.status === 'success' ? '#10b981' :
                        selectedNode.data.status === 'error' ? '#ef4444' :
                        selectedNode.data.status === 'running' ? '#6366f1' : '#475569',
                    }}
                  />
                  <span className="text-xs text-slate-300 capitalize">{selectedNode.data.status as string}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Node ID</p>
                <p className="text-xs font-mono text-slate-500">{selectedNode.id}</p>
              </div>

              <div className="pt-4 border-t border-[rgba(99,102,241,0.1)]">
                <p className="text-xs text-slate-500 mb-3">Configuration</p>
                <div className="space-y-2">
                  {Object.entries(selectedNode.data)
                    .filter(([k]) => !['label', 'description', 'nodeType', 'status'].includes(k))
                    .map(([k, v]) => (
                      <div key={k} className="flex items-start justify-between gap-2">
                        <span className="text-xs text-slate-500 capitalize">{k}</span>
                        <span className="text-xs text-slate-300 font-mono text-right truncate max-w-[120px]">
                          {String(v)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
