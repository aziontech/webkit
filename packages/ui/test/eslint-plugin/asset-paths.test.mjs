import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import tsParser from '@typescript-eslint/parser'
import { Linter } from 'eslint'
import * as vueParser from 'vue-eslint-parser'

import noRootRelativeAsset from '../../src/eslint-plugin/rules/no-root-relative-asset.js'

const PKG = fileURLToPath(new URL('../../', import.meta.url))
const DIRS = ['examples', 'blocks', 'src/components']
const CANDIDATE = /\/(?:marketing-components|media)\//

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walk(path, out)
    else if (/\.(vue|ts|js)$/.test(entry.name) && !/\.(test|spec|stories)\.ts$/.test(entry.name))
      out.push(path)
  }
  return out
}

test('every example, block and component imports its media; none points at a site-only URL', () => {
  const linter = new Linter({ configType: 'flat' })
  const config = [
    {
      files: ['**/*.vue', '**/*.ts', '**/*.js'],
      languageOptions: {
        parser: vueParser,
        parserOptions: { parser: tsParser, ecmaVersion: 'latest', sourceType: 'module' }
      },
      plugins: { webkit: { rules: { 'no-root-relative-asset': noRootRelativeAsset } } },
      rules: { 'webkit/no-root-relative-asset': 'error' }
    }
  ]
  const hits = []
  for (const dir of DIRS) {
    for (const file of walk(join(PKG, dir))) {
      const source = readFileSync(file, 'utf8')
      if (!CANDIDATE.test(source)) continue
      for (const message of linter.verify(source, config, { filename: file })) {
        hits.push(`${relative(PKG, file)}:${message.line} ${message.message}`)
      }
    }
  }
  assert.deepEqual(hits, [])
})
