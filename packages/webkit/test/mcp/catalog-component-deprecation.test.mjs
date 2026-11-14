import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { Linter } from 'eslint'

import { parseSpecFile } from '../../../../.claude/hooks/_lib/spec.mjs'
import { build, componentDeprecation } from '../../scripts/build-catalog.mjs'
import { exportTarget } from '../../scripts/lib/exports.mjs'

const PKG_ROOT = fileURLToPath(new URL('../..', import.meta.url))
const SPECS = resolve(PKG_ROOT, '../../.specs')
const exportsMap = JSON.parse(readFileSync(join(PKG_ROOT, 'package.json'), 'utf-8')).exports

test('componentDeprecation reads the @deprecated JSDoc on defineOptions, and only there', () => {
  const deprecated = `<script setup lang="ts">\n  /** @deprecated since 6.0 — use \`Other\`. Removed in 7.0. */\n  defineOptions({ name: 'Old' })\n</script>`
  assert.equal(componentDeprecation(deprecated), 'since 6.0 — use `Other`. Removed in 7.0.')
  const propOnly = `<script setup lang="ts">\n  defineOptions({ name: 'Live' })\n  interface Props {\n    /** @deprecated since 6.0 — use \`b\`. */\n    a?: string\n  }\n</script>`
  assert.equal(componentDeprecation(propOnly), null)
})

test('every component deprecated in its source is deprecated in its spec, with a live replacement', () => {
  for (const [key, entry] of Object.entries(exportsMap)) {
    const target = exportTarget(entry)
    if (typeof target !== 'string' || !target.endsWith('.vue')) continue
    const name = key.slice(2)
    const note = componentDeprecation(readFileSync(join(PKG_ROOT, target), 'utf-8'))
    let frontmatter = null
    try {
      frontmatter = parseSpecFile(join(SPECS, `${name}.md`)).frontmatter
    } catch {}
    if (!frontmatter) continue
    assert.equal(
      frontmatter.deprecated === true,
      Boolean(note),
      `${name}: source and spec disagree on deprecation`
    )
    if (note) {
      assert.ok(frontmatter.replaced_by, `${name}: deprecated spec names no replaced_by`)
      assert.ok(exportsMap[`./${frontmatter.replaced_by}`], `${name}: replaced_by is not an export`)
    }
  }
})

test('the built catalog marks DocCta deprecated and no-deprecated-component fires on it', async () => {
  const catalog = await build()
  const entry = catalog.imports['doc-cta']
  assert.equal(entry.deprecated, true)
  assert.equal(entry.replacedBy, 'doc-call-to-action')
  assert.match(entry.deprecation, /DocCallToAction/)

  const dir = mkdtempSync(join(tmpdir(), 'webkit-catalog-'))
  const path = join(dir, 'catalog.json')
  writeFileSync(path, JSON.stringify(catalog))
  process.env.WEBKIT_CATALOG_PATH = path
  const { _resetCatalogCache } = await import('../../src/eslint-plugin/catalog.js')
  _resetCatalogCache()
  const rule = (await import('../../src/eslint-plugin/rules/no-deprecated-component.js')).default
  const linter = new Linter({ configType: 'flat' })
  const messages = linter.verify("import DocCta from '@aziontech/webkit/doc-cta'\n", {
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    plugins: { webkit: { rules: { 'no-deprecated-component': rule } } },
    rules: { 'webkit/no-deprecated-component': 'error' }
  })
  assert.equal(messages.length, 1)
  assert.match(messages[0].message, /@aziontech\/webkit\/doc-call-to-action/)
})
