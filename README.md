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
ollama pull qwen3:8b
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Make sure Ollama is running locally on `http://localhost:11434` before starting the app.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OLLAMA_BASE_URL` | Ollama OpenAI-compatible base URL (default `http://localhost:11434/v1`) |
| `OLLAMA_MODEL` | Local Ollama model name to use for chat and planning, for example `qwen3:8b` |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |

The playground executor runs code with the local `python3`, `node`, and `/bin/bash` binaries available on the host machine.

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
