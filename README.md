# Autopilot

A production-ready AI workflow automation platform built with Next.js 15, React Flow, and the Vercel AI SDK.

## Features

- **AI-Powered Workflow Builder** — Design DAG-based workflows with drag-and-drop React Flow canvas
- **Streaming AI Playground** — Interactive chat + code execution with real-time streaming
- **Live Dashboard** — Real-time metrics, activity feeds, and system health monitoring
- **Monaco Code Editor** — Full-featured code editing with syntax highlighting
- **Dark Futuristic UI** — Glassmorphism, neon glows, and fluid animations

## Quick Start

```bash
cp .env.example .env.local
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key (optional — mock mode if not set) |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |

## Tech Stack

- **Next.js 15** (App Router + Turbopack)
- **TypeScript 5** (strict mode)
- **Tailwind CSS v4**
- **Framer Motion v11**
- **React Flow v12** (`@xyflow/react`)
- **Vercel AI SDK v4**
- **Monaco Editor**
- **Recharts**
- **shadcn/ui** (Radix UI based)

## Docker

```bash
docker-compose up -d
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages + API routes
├── components/       # React components (layout, ui, features)
├── lib/              # Utilities, DB schema, AI tools
└── types/            # Global TypeScript types
```
