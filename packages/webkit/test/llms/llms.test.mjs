import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { posix } from 'node:path'
import test from 'node:test'

const { buildLlms, checkLlms, FULL_BUDGET_BYTES } = await import('../../scripts/build-llms.mjs')

const catalog = JSON.parse(readFileSync(new URL('../../catalog.json', import.meta.url), 'utf-8'))
const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf-8'))
const files = buildLlms()
const components = Object.keys(catalog.imports).filter(
  (n) => catalog.imports[n].kind === 'component'
)

test('llms/ on disk matches the generator', () => {
  assert.deepEqual(checkLlms(files), [])
})

test('llms.txt follows the llmstxt.org shape: H1, summary, then H2 sections of links', () => {
  const lines = files['llms.txt'].split('\n')
  assert.match(lines[0], /^# \S/)
  assert.equal(lines.filter((l) => /^# /.test(l)).length, 1)
  assert.match(
    lines.find((l) => l.trim()),
    /^# /
  )
  assert.ok(
    lines.some((l) => /^> \S/.test(l)),
    'blockquote summary'
  )
  const firstH2 = lines.findIndex((l) => /^## /.test(l))
  assert.ok(lines.slice(0, firstH2).findIndex((l) => /^> /.test(l)) > 0)
  const sectionLines = lines.slice(firstH2).filter((l) => l.trim() && !/^## /.test(l))
  for (const l of sectionLines) assert.match(l, /^- \[[^\]]+\]\([^)]+\)(: .+)?$/, l)
  assert.ok(lines.includes('## Optional'))
})

test('every link in llms.txt and in the pages resolves to a generated file', () => {
  const missing = []
  for (const [file, text] of Object.entries(files)) {
    if (!file.endsWith('.md') && file !== 'llms.txt') continue
    for (const m of text.matchAll(/\]\(([^)\s]+\.(?:md|json|txt))\)/g)) {
      const target = posix.normalize(posix.join(posix.dirname(file), m[1]))
      if (target === '../catalog.json') continue
      if (/^https?:/.test(m[1]) || target.startsWith('..')) continue
      if (!(target in files)) missing.push(`${file} → ${m[1]}`)
    }
  }
  assert.deepEqual(missing, [])
})

test('every component has a page and a JSON API, and every block and foundation a page', () => {
  for (const n of components) {
    assert.ok(files[`components/${n}.md`], n)
    const api = JSON.parse(files[`components/${n}.json`])
    assert.equal(api.name, n)
    assert.ok(api.import.startsWith('@aziontech/webkit/'))
    assert.ok(Array.isArray(api.props) && Array.isArray(api.examples))
    assert.match(files['llms.txt'], new RegExp(`\\(components/${n}\\.md\\)`))
  }
  for (const id of Object.keys(catalog.patterns)) {
    assert.ok(files[`blocks/${id}.md`], id)
    assert.match(files['llms.txt'], new RegExp(`\\(blocks/${id}\\.md\\)`))
  }
  for (const slug of [
    'tokens',
    'color',
    'typography',
    'spacing',
    'motion',
    'i18n',
    'rtl',
    'devices'
  ]) {
    assert.ok(files[`foundations/${slug}.md`], slug)
  }
})

test('a component page carries the API, guidance, accessibility and code', () => {
  const page = files['components/button.md']
  for (const heading of ['## When to use', '## Do', '## Don’t', '## Props', '## Accessibility']) {
    assert.ok(page.includes(`\n${heading}\n`), heading)
  }
  assert.match(page, /import Button from '@aziontech\/webkit\/button'/)
  assert.match(page, /```vue\n/)
})

test('a block page carries guidelines, variants and the primary SFC', () => {
  const page = files['blocks/platform/auth.md']
  assert.match(page, /## When to use/)
  assert.match(page, /## Variants/)
  assert.match(page, /## Code \(`Login`\)\n\n```vue\n<script setup>/)
})

test('llms-full.txt holds every page and stays under its size budget', () => {
  const full = files['llms-full.txt']
  assert.ok(Buffer.byteLength(full) <= FULL_BUDGET_BYTES)
  for (const file of Object.keys(files).filter((f) => f.endsWith('.md'))) {
    assert.ok(full.includes(`<!-- ${file} -->`), file)
  }
})

test('the package ships llms/', () => {
  assert.ok(pkg.files.includes('llms'))
})
