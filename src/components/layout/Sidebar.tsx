'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Workflow,
  Terminal,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  Activity,
  Cpu,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { href: '/workflows', label: 'Workflows', icon: Workflow, badge: '5' },
  { href: '/playground', label: 'Playground', icon: Terminal, badge: null },
  { href: '/activity', label: 'Activity', icon: Activity, badge: '3' },
  { href: '/models', label: 'AI Models', icon: Cpu, badge: null },
  { href: '/docs', label: 'Docs', icon: BookOpen, badge: null },
]

const BOTTOM_ITEMS = [
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex flex-col h-full border-r border-[rgba(99,102,241,0.15)] bg-[#0a0a12] z-20 shrink-0"
        style={{ overflow: 'visible' }}
      >
        {/* Logo */}
        <div className="flex items-center h-14 px-3 border-b border-[rgba(99,102,241,0.15)] shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
            <motion.div
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 shrink-0"
              style={{ boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-4 h-4 text-white" />
            </motion.div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-slate-100 text-base tracking-tight overflow-hidden whitespace-nowrap"
                >
                  Autopilot
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map(item => {
            const isActive = pathname.startsWith(item.href)
            return (
              <NavItem
                key={item.href}
                {...item}
                isActive={isActive}
                collapsed={collapsed}
              />
            )
          })}
        </nav>

        {/* Divider */}
        <div className="h-px bg-[rgba(99,102,241,0.1)] mx-2" />

        {/* Bottom items */}
        <div className="py-4 px-2 space-y-1">
          {BOTTOM_ITEMS.map(item => {
            const isActive = pathname.startsWith(item.href)
            return (
              <NavItem
                key={item.href}
                {...item}
                badge={null}
                isActive={isActive}
                collapsed={collapsed}
              />
            )
          })}
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 z-30 flex items-center justify-center w-6 h-6 rounded-full bg-[#13131f] border border-[rgba(99,102,241,0.3)] text-slate-400 hover:text-indigo-400 hover:border-indigo-500 transition-all shadow-[0_0_10px_rgba(99,102,241,0.2)]"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>

        {/* Status indicator */}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-[rgba(99,102,241,0.1)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
              <span className="text-xs text-slate-500">All systems operational</span>
            </div>
          </div>
        )}
      </motion.aside>
    </TooltipProvider>
  )
}

interface NavItemProps {
  href: string
  label: string
  icon: React.ElementType
  badge: string | null
  isActive: boolean
  collapsed: boolean
}

function NavItem({ href, label, icon: Icon, badge, isActive, collapsed }: NavItemProps) {
  const content = (
    <Link href={href}>
      <motion.div
        className={cn(
          'relative flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer',
          isActive
            ? 'bg-[rgba(99,102,241,0.15)] text-indigo-300 border border-[rgba(99,102,241,0.25)]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-[rgba(255,255,255,0.04)]'
        )}
        whileHover={{ x: 2 }}
        transition={{ duration: 0.15 }}
      >
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-indigo-400 rounded-full"
            style={{ boxShadow: '0 0 8px rgba(99,102,241,0.8)' }}
          />
        )}
        <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-indigo-400' : '')} />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap flex-1"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!collapsed && badge && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white"
            >
              {badge}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    )
  }

  return content
}
