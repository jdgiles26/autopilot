import 'server-only'

import { createOpenAI } from '@ai-sdk/openai'

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/v1'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'qwen3:8b'

const ollamaProvider = createOpenAI({
  baseURL: OLLAMA_BASE_URL,
})

export function getOllamaModel(modelId: string = OLLAMA_MODEL) {
  return ollamaProvider(modelId)
}

export { OLLAMA_BASE_URL, OLLAMA_MODEL }
