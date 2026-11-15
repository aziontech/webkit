import { existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { bodyChecksum, parseSpecFile, templateSectionErrors, validateFrontmatter } from './spec.mjs'

export const SHIPPABLE_STATUSES = ['approved', 'implemented', 'locked']
export const SHIPPED_STATUSES = ['implemented', 'locked']
export const SPEC_EXEMPT = new Set(['_template.md', 'README.md'])

export function specFiles(specsDir) {
  return readdirSync(specsDir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md') && !SPEC_EXEMPT.has(e.name))
    .map((e) => e.name)
    .sort()
}

export function componentShipped(frontmatter, repoRoot) {
  if (!frontmatter?.name || !frontmatter?.category) return false
  return existsSync(
    resolve(repoRoot, 'packages/webkit/src/components', frontmatter.category, frontmatter.name)
  )
}

export function specIntegrityErrors(parsed, { forWrite = false, shipped = false } = {}) {
  const { frontmatter, body } = parsed
  const fmErrors = validateFrontmatter(frontmatter)
  if (fmErrors.length) {
    return [
      {
        kind: 'frontmatter',
        lines: ['Spec frontmatter invalid:', ...fmErrors.map((e) => `  - ${e}`)]
      }
    ]
  }
  const errors = []
  const templateErrors = templateSectionErrors(frontmatter, body)
  if (templateErrors.length) {
    errors.push({
      kind: 'template',
      lines: [
        'Spec does not follow the current template (.specs/_template.md):',
        ...templateErrors.map((e) => `  - ${e}`)
      ]
    })
  }
  const status = frontmatter.status
  if (!SHIPPABLE_STATUSES.includes(status)) {
    errors.push({
      kind: 'status',
      lines: [
        `Spec status is "${status}". A spec must be "approved", "implemented" or "locked" before a component is written or merged.`,
        '',
        'Run spec-validator: it flips draft → approved when the body satisfies every rule.'
      ]
    })
  } else if (forWrite && status === 'locked') {
    errors.push({
      kind: 'locked',
      lines: [
        'Spec is locked. Edits require bumping spec_version, setting status back to approved, and re-running spec-validator.'
      ]
    })
  } else if (shipped && !SHIPPED_STATUSES.includes(status)) {
    errors.push({
      kind: 'shipped-status',
      lines: [
        `Spec status is "${status}" but the component is shipped. A shipped component's spec stays "implemented" (or "locked").`
      ]
    })
  }
  if (frontmatter.checksum && SHIPPABLE_STATUSES.includes(status)) {
    const actual = bodyChecksum(body)
    if (actual !== frontmatter.checksum) {
      errors.push({
        kind: 'checksum',
        lines: [
          'Spec body was modified after approval (checksum mismatch).',
          `  expected: ${frontmatter.checksum}`,
          `  actual:   ${actual}`,
          '',
          'Re-run spec-validator to re-approve the body and refresh the checksum.'
        ]
      })
    }
  }
  return errors
}

export function checkSpecFile(specPath, repoRoot, opts = {}) {
  let parsed
  try {
    parsed = parseSpecFile(specPath)
  } catch (e) {
    return [{ kind: 'read', lines: [`Cannot read spec: ${e?.message ?? e}`] }]
  }
  const shipped = opts.shipped ?? componentShipped(parsed.frontmatter, repoRoot)
  return specIntegrityErrors(parsed, { ...opts, shipped })
}

export function checkAllSpecs(repoRoot) {
  const specsDir = join(repoRoot, '.specs')
  const failures = []
  for (const name of specFiles(specsDir)) {
    const errors = checkSpecFile(join(specsDir, name), repoRoot)
    if (errors.length) failures.push({ file: `.specs/${name}`, errors })
  }
  return failures
}
