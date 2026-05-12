// Drizzle ORM schema definitions
// In production: import { drizzle } from 'drizzle-orm/postgres-js'

// Schema type definitions for the database tables

export interface WorkflowTable {
  id: string
  name: string
  description: string | null
  status: string
  nodes: string // JSON
  edges: string // JSON
  tags: string // JSON array
  run_count: number
  success_rate: number
  avg_duration: number
  created_at: Date
  updated_at: Date
  last_run: Date | null
}

export interface WorkflowRunTable {
  id: string
  workflow_id: string
  status: string
  started_at: Date
  completed_at: Date | null
  duration_ms: number | null
  logs: string // JSON
  error: string | null
}

export interface UserTable {
  id: string
  email: string
  name: string
  avatar_url: string | null
  role: string
  created_at: Date
}

// Schema column types (mirrors what Drizzle would generate)
export const schema = {
  workflows: 'workflows' as const,
  workflow_runs: 'workflow_runs' as const,
  users: 'users' as const,
}
