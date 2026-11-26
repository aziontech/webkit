import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const PAIR_WORDS = { do: 'Do', dont: "Don't" }

const BANNED_PAIR_WORDS = [
  'correct',
  'incorrect',
  'wrong',
  'good',
  'bad',
  'do not',
  'never',
  'avoid',
  'recommended',
  'dos',
  "dos and don'ts",
  "do's and don'ts",
  'best practices',
  'constraints'
]

const BANNED_HEADINGS = new Set(
  BANNED_PAIR_WORDS.filter((word) => !['best practices', 'constraints'].includes(word))
)
const BANNED_LABELS = new Set(BANNED_PAIR_WORDS)

const normalize = (text) => text.replace(/[’‘]/g, "'").replace(/[:.]$/, '').trim().toLowerCase()

const HEADING = /^#{2,6}\s+(.+?)\s*#*\s*$/
const LABEL = /^\s*[-*+]\s+\*\*([^*]+?)\*\*\s*:|^\s*[-*+]\s+\*\*([^*]+?:)\*\*/
const TASK = /^\s*(?:[-*+]|\d+[.)])\s+\[[ xX]\]\s/
const FENCE = /^\s*(```|~~~)/

export function scanMarkdown(source, { rendered = false } = {}) {
  const findings = []
  let fence = null
  source.split('\n').forEach((line, index) => {
    const open = FENCE.exec(line)
    if (open) {
      if (!fence) fence = open[1]
      else if (line.trim().startsWith(fence)) fence = null
      return
    }
    if (fence) return
    const at = index + 1
    const heading = HEADING.exec(line)
    if (heading && BANNED_HEADINGS.has(normalize(heading[1])))
      findings.push({
        line: at,
        rule: 'pair-word',
        message: `heading "${heading[1]}": the example pair is "## ${PAIR_WORDS.do}" and "## ${PAIR_WORDS.dont}"`
      })
    const label = LABEL.exec(line)
    const word = label && normalize(label[1] ?? label[2])
    if (word && BANNED_LABELS.has(word))
      findings.push({
        line: at,
        rule: 'pair-word',
        message: `list label "${label[1] ?? label[2]}": label the pair "**${PAIR_WORDS.do}:**" and "**${PAIR_WORDS.dont}:**"`
      })
    if (rendered && TASK.test(line))
      findings.push({
        line: at,
        rule: 'task-list',
        message: 'a task list in a page the docs site renders: write a plain list or numbered steps'
      })
  })
  return findings
}

const markdownIn = (dir, match) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true, recursive: true })
        .filter((entry) => entry.isFile() && match(entry.name))
        .map((entry) => join(entry.parentPath, entry.name))
    : []

function renderedPages(repo) {
  const file = join(repo, 'skills/patterns.json')
  if (!existsSync(file)) return []
  return JSON.parse(readFileSync(file, 'utf8')).patterns.map((page) =>
    join(repo, 'skills', page.skill, 'SKILL.md')
  )
}

export function docsSources(repo) {
  const rendered = new Set([
    ...renderedPages(repo),
    ...markdownIn(join(repo, 'rules'), (name) => name.endsWith('.md')),
    ...markdownIn(join(repo, 'packages/webkit/blocks'), (name) => name === 'guidelines.md'),
    ...markdownIn(join(repo, '.specs'), (name) => name.endsWith('.md') && !name.startsWith('_'))
  ])
  const all = new Set([
    ...rendered,
    ...markdownIn(join(repo, 'rules'), (name) => name.endsWith('.md')),
    ...markdownIn(join(repo, 'skills'), (name) => name === 'SKILL.md')
  ])
  return [...all]
    .filter((file) => existsSync(file))
    .sort()
    .map((file) => ({ file, path: relative(repo, file), rendered: rendered.has(file) }))
}

export function checkDocsMarkdown(repo) {
  return docsSources(repo).flatMap(({ file, path, rendered }) =>
    scanMarkdown(readFileSync(file, 'utf8'), { rendered }).map((finding) => ({ path, ...finding }))
  )
}
