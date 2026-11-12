import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { posix } from 'node:path'
import test from 'node:test'

const { assetPagePath, buildLlms, checkLlms, FULL_BUDGET_BYTES, undocumentedExports } =
  await import('../../scripts/build-llms.mjs')

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
  assert.match(page, /## Code \(`Login`\)\n\n```vue\n<script setup( lang="ts")?>/)
})

test('llms-full.txt holds every page and stays under its size budget', () => {
  const full = files['llms-full.txt']
  assert.ok(Buffer.byteLength(full) <= FULL_BUDGET_BYTES)
  for (const file of Object.keys(files).filter((f) => f.endsWith('.md'))) {
    assert.ok(full.includes(`<!-- ${file} -->`), file)
  }
})

test('llms-full.txt cuts repeats and detail, the per-page files keep them', () => {
  const full = files['llms-full.txt']
  const entry = (file) => {
    const start = full.indexOf(`<!-- ${file} -->`)
    const end = full.indexOf('\n---\n', start)
    return full.slice(start, end === -1 ? undefined : end)
  }
  const tagRule = 'Only layout utilities (margin, flex and grid placement'
  assert.equal(full.split(tagRule).length - 1, 1, 'the tag-class rule is stated once')
  assert.ok(files['components/button.md'].includes(tagRule))
  assert.doesNotMatch(full, /^- API as JSON:/m)
  assert.match(files['components/button.md'], /^- API as JSON: \[button\.json\]/m)

  const multi = Object.keys(files).find(
    (f) => /^components\/.*\.md$/.test(f) && (files[f].match(/^### /gm) || []).length > 2
  )
  assert.ok(multi)
  assert.ok((files[multi].match(/```vue\n/g) || []).length > 1, multi)
  assert.equal((entry(multi).match(/```vue\n/g) || []).length, 1, multi)

  const auth = entry('blocks/platform/auth.md')
  assert.match(files['blocks/platform/auth.md'], /^### A\. Signed-out bar/m)
  assert.match(auth, /^- A\. Signed-out bar — `GlobalHeader` \(required\)$/m)
  assert.doesNotMatch(auth, /^### /m)
  assert.doesNotMatch(auth, /```vue/)
  assert.match(files['blocks/platform/auth.md'], /## Code \(`Login`\)/)

  for (const m of full.matchAll(/\]\(([^)\s]+\.(?:md|json))\)/g)) {
    if (/^https?:/.test(m[1])) continue
    assert.ok(m[1] in files, `llms-full.txt links ${m[1]}, which is not a file under llms/`)
  }
})

test('the package ships llms/', () => {
  assert.ok(pkg.files.includes('llms'))
})

test('the package keeps internal review notes out of the tarball', () => {
  assert.ok(pkg.files.includes('docs'))
  assert.ok(pkg.files.includes('!docs/reviews'))
})

test('every asset kind has a foundation page, linked from llms.txt, that lists every name', () => {
  for (const [kind, meta] of Object.entries(catalog.assets)) {
    const path = assetPagePath(kind)
    const page = files[path]
    assert.ok(page, path)
    assert.match(files['llms.txt'], new RegExp(`\\(${path.replace('.', '\\.')}\\)`), path)
    const { items } = JSON.parse(readFileSync(new URL(`../../${meta.file}`, import.meta.url), 'utf-8'))
    assert.equal(items.length, meta.count, kind)
    for (const item of items) assert.ok(page.includes(`\`${item.class ?? item.name}\``), `${kind} ${item.name}`)
  }
  assert.match(files['foundations/illustrations.md'], /`ddos-protection`/)
  assert.match(files['foundations/icons.md'], /`ai-cor ai-react`/)
})

test('a component that draws a registry asset links its asset page', () => {
  for (const [kind, meta] of Object.entries(catalog.assets)) {
    for (const name of meta.usedBy) {
      const page = files[`components/${name}.md`]
      assert.ok(page.includes('## Assets'), `${name}: ${kind}`)
      assert.ok(page.includes(`../${assetPagePath(kind)}`), `${name}: ${kind}`)
      const api = JSON.parse(files[`components/${name}.json`])
      assert.ok(api.assets.some((a) => a.kind === kind), `${name}.json: ${kind}`)
    }
  }
})

test('every public component export is documented in llms/components', () => {
  const view = buildLlms()
  assert.ok(files['components/chart-card.md'])
  assert.equal(catalog.imports['chart-card'].kind, 'component')
  const imports = JSON.parse(JSON.stringify(catalog.imports))
  imports['chart-card'] = { ...imports['chart-card'], kind: 'subcomponent', parent: 'chart' }
  const missing = undocumentedExports({ imports }, view)
  assert.ok(
    missing.some((m) => m.startsWith('chart-card')),
    missing.join('\n')
  )
  assert.deepEqual(undocumentedExports({ imports: catalog.imports }, files), [])
})
