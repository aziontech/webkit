import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import tsParser from '@typescript-eslint/parser'
import { Linter } from 'eslint'
import vueParser from 'vue-eslint-parser'

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const REPO_ROOT = resolve(PKG_ROOT, '..', '..')
const DOC_DIRS = ['skills', 'rules']
const FENCE = /^([ \t]*)```(vue|html|ts|js)[ \t]*\n([\s\S]*?)^\1```[ \t]*$/gm
const NEGATIVE_MARK = /❌|✗/
const NEGATIVE_WORDS = /\b(wrong|don't|do not|avoid|anti-pattern|forbidden|bad)\b/i
const NEGATIVE_LEAD = /^\W*(wrong|don't|do not|avoid|bad|never|anti-patterns?|forbidden)\b/i
const TAG = /<([A-Z][A-Za-z0-9]*)[\s/>.]/g

// Teaching samples annotate and elide with comments (`<!-- #cell-* slots -->`), and a
// template-only excerpt elides its script: those two checks cannot judge a sample.
const SKIPPED_MESSAGES = new Set(['prose-comment'])
const SKIPPED_WITHOUT_SCRIPT = new Set(['slot-without-defineslots'])

process.env.WEBKIT_CATALOG_PATH = join(PKG_ROOT, 'catalog.json')
const catalog = JSON.parse(readFileSync(join(PKG_ROOT, 'catalog.json'), 'utf8'))
const { default: webkit } = await import('../../src/eslint-plugin/index.js')

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

function markdownFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) markdownFiles(p, out)
    else if (entry.name.endsWith('.md')) out.push(p)
  }
  return out
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length
}

function prose(markdown, index) {
  let fenced = false
  const out = []
  for (const line of markdown.slice(0, index).split('\n')) {
    if (/^\s*```/.test(line)) fenced = !fenced
    else if (!fenced) out.push(line)
  }
  return out
}

function isNegative(markdown, index, code) {
  if (code.includes('❌')) return true
  if (NEGATIVE_WORDS.test(code.split('\n')[0])) return true
  const lines = prose(markdown, index)
  const lead = lines.filter((l) => l.trim() && !/^\s*<!--.*-->\s*$/.test(l)).at(-1) || ''
  const heading = lines.findLast((l) => /^#{1,6}\s/.test(l)) || ''
  return (
    NEGATIVE_LEAD.test(lead) ||
    NEGATIVE_MARK.test(lead) ||
    NEGATIVE_LEAD.test(heading.replace(/^#+\s*/, ''))
  )
}

function synthesizedImports(code) {
  const imported = new Set([...code.matchAll(/import\s+([A-Z]\w*)/g)].map((m) => m[1]))
  const lines = []
  for (const name of new Set([...code.matchAll(TAG)].map((m) => m[1]))) {
    if (imported.has(name)) continue
    const sub = kebab(name)
    if (!catalog.imports?.[sub]) continue
    const compound = code.includes(`<${name}.`)
    const root = !compound && catalog.imports[`${sub}-root`] ? `${sub}-root` : sub
    lines.push(`import ${name} from '@aziontech/webkit/${root}'`)
  }
  return lines
}

function asSfc(code) {
  const sfc = /^\s*<(template|script)\b/.test(code)
  const body = sfc ? code : `<template>\n${code}\n</template>\n`
  const imports = synthesizedImports(body)
  if (!imports.length) return body
  const setup = /(<script\b[^>]*\bsetup\b[^>]*>)/
  if (setup.test(body)) return body.replace(setup, `$1\n${imports.join('\n')}`)
  return `<script setup lang="ts">\n${imports.join('\n')}\n</script>\n${body}`
}

export function codeSamples() {
  const samples = []
  for (const dir of DOC_DIRS) {
    for (const file of markdownFiles(join(REPO_ROOT, dir))) {
      const markdown = readFileSync(file, 'utf8')
      for (const m of markdown.matchAll(FENCE)) {
        const [, indent, lang, raw] = m
        const code = raw
          .split('\n')
          .map((l) => (l.startsWith(indent) ? l.slice(indent.length) : l))
          .join('\n')
        samples.push({
          file: relative(REPO_ROOT, file).split('\\').join('/'),
          line: lineOf(markdown, m.index) + 1,
          lang,
          code,
          negative: isNegative(markdown, m.index, code)
        })
      }
    }
  }
  return samples
}

const linter = new Linter({ configType: 'flat', cwd: PKG_ROOT })
const config = [
  ...webkit.configs.strict,
  {
    files: ['**/*.vue'],
    languageOptions: { parser: vueParser, parserOptions: { parser: tsParser } }
  },
  { files: ['**/*.ts'], languageOptions: { parser: tsParser } }
]

function lintSample(sample) {
  const isTemplate = sample.lang === 'vue' || sample.lang === 'html'
  const text = isTemplate ? asSfc(sample.code) : sample.code
  const filename = `src/sample.${isTemplate ? 'vue' : sample.lang}`
  const scriptless = !/<script\b/.test(sample.code)
  return linter
    .verify(text, config, { filename })
    .filter(
      (m) =>
        m.severity === 2 &&
        !m.fatal &&
        !SKIPPED_MESSAGES.has(m.messageId) &&
        !(scriptless && SKIPPED_WITHOUT_SCRIPT.has(m.messageId))
    )
}

test('the sample reader finds the code and tells wrong examples apart', () => {
  const samples = codeSamples()
  assert.ok(samples.length > 100, `found ${samples.length} samples`)
  const style = samples.filter((s) => s.file === 'rules/webkit-style-override.md')
  assert.ok(style.some((s) => s.negative && s.code.includes('bg-[#0a0a0a]')))
  assert.ok(style.some((s) => !s.negative))
  assert.ok(samples.filter((s) => !s.negative).length > 80)
})

test('a synthesized import makes a fragment lintable, so a style override on a webkit tag fails', () => {
  const [hit] = lintSample({ lang: 'vue', code: '<Tag label="x" class="p-4" />' })
  assert.equal(hit?.ruleId, 'webkit/no-style-override')
  assert.deepEqual(lintSample({ lang: 'vue', code: '<Table :data="rows" class="h-full" />' }), [])
})

test('every code sample in skills/ and rules/ passes the consumer lint preset', () => {
  const failures = []
  for (const sample of codeSamples()) {
    if (sample.negative) continue
    for (const message of lintSample(sample)) {
      failures.push(`${sample.file}:${sample.line} ${message.ruleId} — ${message.message}`)
    }
  }
  assert.deepEqual(failures, [])
})
