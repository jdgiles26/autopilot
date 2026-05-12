'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, Bell, Search, ChevronRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Breadcrumb {
  label: string
  href?: string
}

interface HeaderProps {
  title?: string
  breadcrumbs?: Breadcrumb[]
  onMenuToggle?: () => void
}

export function Header({ title, breadcrumbs, onMenuToggle }: HeaderProps) {
  return (
    <header className="h-14 flex items-center px-4 gap-4 border-b border-[rgba(99,102,241,0.15)] bg-[#0a0a12]/80 backdrop-blur-xl shrink-0 z-10">
      {/* Menu toggle (mobile) */}
      <Button variant="ghost" size="icon-sm" onClick={onMenuToggle} className="lg:hidden">
        <Menu className="w-4 h-4" />
      </Button>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
        <Link href="/dashboard" className="text-slate-500 hover:text-slate-300 transition-colors shrink-0">
          <Zap className="w-4 h-4" />
        </Link>
        {breadcrumbs?.map((crumb, i) => (
          <React.Fragment key={i}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            {crumb.href ? (
              <Link
                href={crumb.href}
                className={`hover:text-slate-200 transition-colors truncate ${
                  i === breadcrumbs.length - 1 ? 'text-slate-200 font-medium' : 'text-slate-500'
                }`}
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className={`truncate ${
                  i === breadcrumbs.length - 1 ? 'text-slate-200 font-medium' : 'text-slate-500'
                }`}
              >
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
        {title && !breadcrumbs && (
          <span className="text-slate-200 font-medium truncate">{title}</span>
        )}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center relative w-64">
        <Search className="absolute left-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        <Input
          placeholder="Search workflows..."
          className="pl-8 h-7 text-xs bg-[#13131f]"
        />
      </div>

      {/* Notifications */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[rgba(99,102,241,0.1)] transition-colors"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
      </motion.button>

      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer"
        style={{ boxShadow: '0 0 12px rgba(99,102,241,0.4)' }}
      >
        AP
      </motion.div>
    </header>
  )
}
