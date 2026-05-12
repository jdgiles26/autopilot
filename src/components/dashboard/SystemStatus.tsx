'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { SystemService } from '@/types'

const SERVICES: SystemService[] = [
  { name: 'Workflow Engine', status: 'operational', latency: 12, uptime: 99.98 },
  { name: 'AI Gateway', status: 'operational', latency: 180, uptime: 99.9 },
  { name: 'Task Queue', status: 'operational', latency: 3, uptime: 100 },
  { name: 'PostgreSQL', status: 'operational', latency: 8, uptime: 99.99 },
  { name: 'Redis Cache', status: 'degraded', latency: 45, uptime: 98.2 },
  { name: 'Webhook Ingress', status: 'operational', latency: 22, uptime: 99.95 },
]

const STATUS_CONFIG = {
  operational: { color: '#34d399', glow: 'rgba(16,185,129,0.4)', label: 'Operational' },
  degraded: { color: '#fbbf24', glow: 'rgba(245,158,11,0.4)', label: 'Degraded' },
  down: { color: '#f87171', glow: 'rgba(239,68,68,0.4)', label: 'Down' },
}

export function SystemStatus() {
  const operational = SERVICES.filter(s => s.status === 'operational').length
  const total = SERVICES.length

  return (
    <div className="rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#0f0f1a] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-100">System Status</h3>
        <span className="text-xs text-emerald-400 font-medium bg-[rgba(16,185,129,0.1)] px-2 py-0.5 rounded-full border border-[rgba(16,185,129,0.2)]">
          {operational}/{total} Online
        </span>
      </div>

      <div className="space-y-2.5">
        {SERVICES.map((service, i) => {
          const config = STATUS_CONFIG[service.status]
          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className="relative flex-shrink-0">
                <span
                  className="block w-2 h-2 rounded-full"
                  style={{
                    background: config.color,
                    boxShadow: `0 0 8px ${config.glow}`,
                  }}
                />
                {service.status === 'operational' && (
                  <motion.span
                    className="absolute inset-0 rounded-full"
                    style={{ background: config.color }}
                    animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300 truncate">{service.name}</span>
                  <span className="text-[10px] text-slate-500 ml-2 shrink-0">{service.latency}ms</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: config.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${service.uptime ?? 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 w-12 text-right shrink-0">
                    {service.uptime?.toFixed(1)}%
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
