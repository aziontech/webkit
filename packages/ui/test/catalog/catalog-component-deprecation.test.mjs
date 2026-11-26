import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { Linter } from 'eslint'

import { parseSpecFile } from '../../../../contributing/hooks/lib/spec.mjs'
import { build, componentDeprecation } from '../../scripts/build-catalog.mjs'
import { exportTarget } from '../../scripts/lib/exports.mjs'

const PKG_ROOT = fileURLToPath(new URL('../..', import.meta.url))
const SPECS = resolve(PKG_ROOT, '../../.specs')
const exportsMap = JSON.parse(readFileSync(join(PKG_ROOT, 'package.json'), 'utf-8')).exports

test('componentDeprecation reads the @deprecated JSDoc on defineOptions, and only there', () => {
  const deprecated = `<script setup lang="ts">\n  /** @deprecated since 6.1 — use \`Other\`. Removed in 7.0. */\n  defineOptions({ name: 'Old' })\n</script>`
  assert.equal(componentDeprecation(deprecated), 'since 6.1 — use `Other`. Removed in 7.0.')
  const propOnly = `<script setup lang="ts">\n  defineOptions({ name: 'Live' })\n  interface Props {\n    /** @deprecated since 6.1 — use \`b\`. */\n    a?: string\n  }\n</script>`
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

test('a component the catalog marks deprecated trips no-deprecated-component', async () => {
  const catalog = await build()
  for (const [subpath, entry] of Object.entries(catalog.imports)) {
    if (entry.replacedBy) {
      assert.ok(catalog.imports[entry.replacedBy], `${subpath}: replacedBy is not in the catalog`)
    }
  }
  const source = `<script setup lang="ts">\n  /** @deprecated since 6.1 — use \`Button\`. Removed in 7.0. */\n  defineOptions({ name: 'OldButton' })\n</script>`
  catalog.imports['old-button'] = {
    ...catalog.imports.button,
    deprecated: true,
    replacedBy: 'button',
    deprecation: componentDeprecation(source)
  }
  catalog.imports['old-link'] = {
    ...catalog.imports.button,
    deprecated: true,
    replacedBy: undefined,
    deprecation: componentDeprecation(source)
  }

  const dir = mkdtempSync(join(tmpdir(), 'azion-ui-catalog-'))
  const path = join(dir, 'catalog.json')
  writeFileSync(path, JSON.stringify(catalog))
  process.env.AZION_UI_CATALOG_PATH = path
  const { _resetCatalogCache } = await import('../../src/eslint-plugin/lib/catalog.js')
  _resetCatalogCache()
  const rule = (await import('../../src/eslint-plugin/rules/no-deprecated-component.js')).default
  const linter = new Linter({ configType: 'flat' })
  const lint = (code) =>
    linter.verify(code, {
      languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      plugins: { 'azion-ui': { rules: { 'no-deprecated-component': rule } } },
      rules: { 'azion-ui/no-deprecated-component': 'error' }
    })

  const replaced = lint("import OldButton from '@aziontech/ui/old-button'\n")
  assert.equal(replaced.length, 1)
  assert.match(replaced[0].message, /@aziontech\/ui\/button/)

  const noted = lint("import OldLink from '@aziontech/ui/old-link'\n")
  assert.equal(noted.length, 1)
  assert.match(noted[0].message, /Since 6\.1 — use `Button`/)

  assert.equal(lint("import Button from '@aziontech/ui/button'\n").length, 0)
})
