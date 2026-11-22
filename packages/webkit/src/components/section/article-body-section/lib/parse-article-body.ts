import { safeHref } from '../../../../utils/safe-href'
import type { ArticleBodySectionBlock, ArticleBodySectionRun } from '../article-body-section.vue'

const slug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*/g

const runsOf = (text: string): ArticleBodySectionRun[] => {
  const runs: ArticleBodySectionRun[] = []
  let last = 0
  for (const match of text.matchAll(INLINE)) {
    const index = match.index ?? 0
    if (index > last) runs.push({ kind: 'text', text: text.slice(last, index) })
    const linkHref = match[1] === undefined ? null : safeHref(match[2])
    if (match[1] !== undefined && linkHref !== null) {
      runs.push({ kind: 'link', text: match[1], href: linkHref })
    } else if (match[1] !== undefined) runs.push({ kind: 'text', text: match[1] })
    else if (match[3] !== undefined) runs.push({ kind: 'strong', text: match[3] })
    else if (match[4] !== undefined) runs.push({ kind: 'code', text: match[4] })
    else runs.push({ kind: 'em', text: match[5] ?? '' })
    last = index + match[0].length
  }
  if (last < text.length) runs.push({ kind: 'text', text: text.slice(last) })
  return runs
}

const plainOf = (runs: ArticleBodySectionRun[]): string => runs.map((run) => run.text).join('')

const FENCE = /^```(\w*)\s*$/
const HEADING = /^(#{2,3})\s+(.+)$/
const BULLET = /^[-*]\s+(.*)$/
const NUMBERED = /^\d+\.\s+(.*)$/

const startsBlock = (line: string): boolean =>
  FENCE.test(line) || HEADING.test(line) || BULLET.test(line) || NUMBERED.test(line)

type Read = { block: ArticleBodySectionBlock; next: number }

const lineAt = (lines: string[], index: number): string => (lines[index] ?? '').trim()

const readCode = (lines: string[], start: number, lang: string): Read => {
  const code: string[] = []
  let index = start + 1
  while (index < lines.length && !/^```\s*$/.test(lineAt(lines, index))) {
    code.push(lines[index] ?? '')
    index += 1
  }
  return {
    block: { kind: 'code', text: code.join('\n'), lang: lang || undefined },
    next: index + 1
  }
}

const readList = (lines: string[], start: number, pattern: RegExp): Read => {
  const runs: ArticleBodySectionRun[][] = []
  let index = start
  while (index < lines.length) {
    const item = pattern.exec(lineAt(lines, index))
    if (!item) break
    runs.push(runsOf(item[1] ?? ''))
    index += 1
  }
  return {
    block: { kind: 'list', items: runs.map(plainOf), ordered: pattern === NUMBERED, runs },
    next: index
  }
}

const readParagraph = (lines: string[], start: number): Read => {
  const paragraph: string[] = []
  let index = start
  while (index < lines.length) {
    const next = lineAt(lines, index)
    if (!next || (paragraph.length > 0 && startsBlock(next))) break
    paragraph.push(next)
    index += 1
  }
  const runs = runsOf(paragraph.join(' '))
  return { block: { kind: 'paragraph', text: plainOf(runs), runs }, next: index }
}

const readBlock = (lines: string[], index: number, line: string): Read => {
  const fence = FENCE.exec(line)
  if (fence) return readCode(lines, index, fence[1] ?? '')
  const heading = HEADING.exec(line)
  if (heading) {
    const text = (heading[2] ?? '').trim()
    const depth = heading[1] === '###' ? 3 : 2
    return { block: { kind: 'heading', depth, id: slug(text), text }, next: index + 1 }
  }
  const pattern = BULLET.test(line) ? BULLET : NUMBERED.test(line) ? NUMBERED : null
  return pattern ? readList(lines, index, pattern) : readParagraph(lines, index)
}

export function parseArticleBody(source: string): ArticleBodySectionBlock[] {
  const lines = source.split('\n').map((line) => line.trimEnd())
  const out: ArticleBodySectionBlock[] = []
  let index = 0
  while (index < lines.length) {
    const line = lineAt(lines, index)
    if (!line) {
      index += 1
      continue
    }
    const read = readBlock(lines, index, line)
    out.push(read.block)
    index = read.next
  }
  return out
}
