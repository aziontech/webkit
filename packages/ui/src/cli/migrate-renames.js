import { escapeRe } from './migrate-syntax.js'

export const TEST_FILE =
  /(\.(test|spec|cy|e2e)\.[cm]?[jt]sx?$)|(^|\/)(e2e|cypress|playwright|tests?)\//

export function migrateTestIds(source, testids = {}) {
  const keys = Object.keys(testids).sort((a, b) => b.length - a.length)
  if (!keys.length) return { source, changes: [] }
  const re = new RegExp(`(?<=['"\`])(${keys.map(escapeRe).join('|')})(?=['"\`]|__)`, 'g')
  const seen = new Set()
  const out = source.replace(re, (id) => {
    seen.add(`data-testid "${id}" → "${testids[id]}"`)
    return testids[id]
  })
  return { source: out, changes: [...seen] }
}

const LINT_RULE = /(?<![\w@/.-])azion-ui\/[a-z][a-z0-9-]*(?![\w-])/g

export function migrateLintRules(source, lint = {}) {
  const changes = []
  if (!source.includes('azion-ui/')) return { source, changes }
  const out = source.replace(LINT_RULE, (id) => {
    const next = lint[id]
    if (typeof next !== 'string') return id
    changes.push(`${id} → ${next}`)
    return next
  })
  return { source: out, changes: [...new Set(changes)] }
}
