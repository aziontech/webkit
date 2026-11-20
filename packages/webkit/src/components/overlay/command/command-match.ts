/** A half-open `[start, end)` character range of a label that matched the query. */
export type CommandMatchRange = [start: number, end: number]

/** How well one item matches the query: `score` in `[0, 1]` (0 hides the item) and the label ranges to highlight. */
export interface CommandMatch {
  score: number
  ranges: CommandMatchRange[]
}

const FULL: CommandMatch = { score: 1, ranges: [] }
const NONE: CommandMatch = { score: 0, ranges: [] }

const BOUNDARY = /[\s\-_/.:@()[\]]/

const isWordStart = (text: string, index: number) => index === 0 || BOUNDARY.test(text[index - 1])

function substringMatch(text: string, query: string): CommandMatch | null {
  const index = text.indexOf(query)
  if (index < 0) return null
  if (index === 0 && query.length === text.length) return { score: 1, ranges: [[0, text.length]] }
  const base = index === 0 ? 0.9 : isWordStart(text, index) ? 0.8 : 0.7
  return {
    score: base + 0.09 * (query.length / text.length),
    ranges: [[index, index + query.length]]
  }
}

function walk(text: string, query: string, preferWordStart: boolean): number[] | null {
  const hits: number[] = []
  let position = 0
  for (const char of query) {
    let found = -1
    if (text[position] === char) found = position
    else if (preferWordStart) {
      for (let i = text.indexOf(char, position); i >= 0; i = text.indexOf(char, i + 1)) {
        if (isWordStart(text, i)) {
          found = i
          break
        }
      }
    }
    if (found < 0) found = text.indexOf(char, position)
    if (found < 0) return null
    hits.push(found)
    position = found + 1
  }
  return hits
}

function quality(text: string, hits: number[]): number {
  let strong = 0
  hits.forEach((hit, i) => {
    if (isWordStart(text, hit) || (i > 0 && hits[i - 1] === hit - 1)) strong += 1
  })
  return strong / hits.length
}

function toRanges(hits: number[]): CommandMatchRange[] {
  const ranges: CommandMatchRange[] = []
  for (const hit of hits) {
    const last = ranges[ranges.length - 1]
    if (last && last[1] === hit) last[1] = hit + 1
    else ranges.push([hit, hit + 1])
  }
  return ranges
}

function subsequenceMatch(text: string, query: string): CommandMatch | null {
  let best: { hits: number[]; quality: number } | null = null
  for (const preferWordStart of [true, false]) {
    const hits = walk(text, query, preferWordStart)
    if (!hits) continue
    const q = quality(text, hits)
    if (!best || q > best.quality) best = { hits, quality: q }
  }
  if (!best || best.quality < 0.5) return null
  return { score: 0.2 + 0.4 * best.quality, ranges: toRanges(best.hits) }
}

export function matchCommand(
  query: string,
  label: string,
  keywords: readonly string[] = []
): CommandMatch {
  const q = query.trim().toLowerCase()
  if (!q) return FULL
  const text = label.toLowerCase()
  const direct = substringMatch(text, q)
  if (direct) return direct
  const keywordScore = keywords.reduce((best, keyword) => {
    const word = keyword.toLowerCase()
    if (word === q) return Math.max(best, 0.85)
    if (word.startsWith(q)) return Math.max(best, 0.75)
    return word.includes(q) ? Math.max(best, 0.65) : best
  }, 0)
  if (keywordScore) return { score: keywordScore, ranges: [] }
  return subsequenceMatch(text, q) ?? NONE
}

export function splitByRanges(
  label: string,
  ranges: readonly CommandMatchRange[]
): { text: string; match: boolean }[] {
  const parts: { text: string; match: boolean }[] = []
  let cursor = 0
  for (const [start, end] of ranges) {
    if (start > cursor) parts.push({ text: label.slice(cursor, start), match: false })
    parts.push({ text: label.slice(start, end), match: true })
    cursor = end
  }
  if (cursor < label.length) parts.push({ text: label.slice(cursor), match: false })
  return parts
}
