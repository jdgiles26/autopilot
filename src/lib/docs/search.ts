import 'server-only'

import { readdir, readFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

export interface DocSearchResult {
  title: string
  url: string
  snippet: string
}

const INCLUDED_EXTENSIONS = new Set(['.md', '.mdx', '.txt'])
const SKIPPED_DIRECTORIES = new Set(['node_modules', '.next', '.git', 'dist', 'build', '.turbo'])
const MAX_RESULTS = 5

/**
 * Extracts the file extension from a path.
 *
 * @param filePath - The file path to extract the extension from
 * @returns The file extension including the dot (e.g., `.md`), or an empty string if no extension exists
 */
function getExtension(filePath: string) {
  const index = filePath.lastIndexOf('.')
  return index >= 0 ? filePath.slice(index) : ''
}

/**
 * Recursively collects documentation file paths from a directory.
 *
 * @returns An array of file paths for all matching documentation files.
 */
async function collectDocs(directory: string, files: string[] = []): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIPPED_DIRECTORIES.has(entry.name)) continue
      await collectDocs(join(directory, entry.name), files)
      continue
    }

    if (entry.isFile() && INCLUDED_EXTENSIONS.has(getExtension(entry.name))) {
      files.push(join(directory, entry.name))
    }
  }

  return files
}

/**
 * Extracts a text snippet from content containing the query terms.
 *
 * @param content - The text to search within
 * @param query - The search terms to match
 * @returns A string snippet containing matched text with surrounding context, or `null` if no query terms are found in the content
 */
function buildSnippet(content: string, query: string) {
  const lowerContent = content.toLowerCase()
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  const matches = terms
    .map(term => lowerContent.indexOf(term))
    .filter(index => index >= 0)

  if (matches.length === 0) return null

  const startIndex = Math.max(0, Math.min(...matches) - 120)
  const endIndex = Math.min(content.length, Math.min(...matches) + 260)
  return content.slice(startIndex, endIndex).replace(/\s+/g, ' ').trim()
}

/**
 * Extracts the title from document content, falling back to the filename if no heading is present.
 *
 * @param content - The document content to search for a Markdown H1 heading
 * @param filePath - The file path, used as a fallback title if no heading is found
 * @returns The first Markdown H1 heading if found, otherwise the filename portion of `filePath`
 */
function readTitle(content: string, filePath: string) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim()
  return heading && heading.length > 0 ? heading : filePath.split(sep).pop() ?? filePath
}

/**
 * Searches local documentation files for a query.
 *
 * @returns An array of up to 5 search results ranked by relevance, then by title.
 */
export async function searchLocalDocs(query: string, rootDir = process.cwd()): Promise<DocSearchResult[]> {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) return []

  const files = await collectDocs(rootDir)
  const results: Array<DocSearchResult & { score: number }> = []

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf8')
    const snippet = buildSnippet(content, normalizedQuery)
    if (!snippet) continue

    const lowerContent = content.toLowerCase()
    const terms = normalizedQuery.toLowerCase().split(/\s+/).filter(Boolean)
    const score = terms.reduce((acc, term) => acc + (lowerContent.includes(term) ? 1 : 0), 0)

    results.push({
      title: readTitle(content, relative(rootDir, filePath)),
      url: `/${relative(rootDir, filePath).replace(/\\/g, '/')}`,
      snippet,
      score,
    })
  }

  return results
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, MAX_RESULTS)
    .map(({ score: _score, ...result }) => result)
}
