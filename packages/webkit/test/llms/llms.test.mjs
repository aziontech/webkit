import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { posix } from 'node:path'
import test from 'node:test'

const { assetPagePath, buildLlms, checkLlms, FULL_BUDGETS, undocumentedExports } =
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

function prose(text) {
  return text.replace(/^\s*```[\s\S]*?^\s*```/gm, '').replace(/`[^`\n]*`/g, '')
}

function shipped(path) {
  const rules = pkg.files.filter((f) => !/[*{]/.test(f))
  const covers = (rule) => path === rule || path.startsWith(`${rule}/`)
  return (
    rules.some((r) => !r.startsWith('!') && covers(r)) &&
    !rules.some((r) => r.startsWith('!') && covers(r.slice(1)))
  )
}

test('every relative link in llms/ resolves to a file the published package includes', () => {
  const dead = []
  for (const [file, text] of Object.entries(files)) {
    if (!file.endsWith('.md') && file !== 'llms.txt') continue
    for (const m of prose(text).matchAll(/\]\(([^)\s]+)\)/g)) {
      const href = m[1].split('#')[0]
      if (!href || /^[a-z]+:/.test(href)) continue
      const target = posix.normalize(posix.join('llms', posix.dirname(file), href))
      const ok = target.startsWith('llms/')
        ? target.slice(5) in files
        : existsSync(new URL(`../../${target}`, import.meta.url)) && shipped(target)
      if (!ok) dead.push(`${file} → ${m[1]}`)
    }
  }
  assert.deepEqual(dead, [])
})

test('every repository link in llms/ points at a file that exists', () => {
  const repo = 'https://github.com/aziontech/webkit/blob/main/'
  const dead = new Set()
  for (const [file, text] of Object.entries(files)) {
    for (const m of prose(text).matchAll(/\]\((https:\/\/github\.com\/aziontech\/webkit\/blob\/main\/[^)\s#]+)/g)) {
      const path = m[1].slice(repo.length)
      if (!existsSync(new URL(`../../../../${path}`, import.meta.url))) dead.add(`${file} → ${path}`)
    }
  }
  assert.deepEqual([...dead], [])
})

test('a component page links its API JSON to the file beside it', () => {
  assert.match(files['components/dialog.md'], /API as JSON: \[dialog\.json\]\(dialog\.json\)/)
  assert.ok(files['components/dialog.json'])
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
  for (const id of Object.keys(catalog.blocks)) {
    assert.ok(files[`blocks/${id}.md`], id)
    assert.match(files['llms.txt'], new RegExp(`\\(blocks/${id}\\.md\\)`))
  }
  for (const slug of [
    'tokens',
    'color',
    'typography',
    'spacing',
    'motion',
    'internationalization',
    'right-to-left',
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
  const page = files['blocks/auth/sign-in.md']
  assert.match(page, /## When to use/)
  assert.match(page, /## Variants/)
  assert.match(page, /## Code \(`Login`\)\n\n```vue\n<script setup( lang="ts")?>/)
})

test('llms-full.txt and llms-full-site.txt hold every page between them, split by surface, under their budgets', () => {
  const full = files['llms-full.txt']
  const site = files['llms-full-site.txt']
  for (const [file, budget] of Object.entries(FULL_BUDGETS)) {
    assert.ok(Buffer.byteLength(files[file]) <= budget, `${file} over ${budget}`)
  }
  for (const file of Object.keys(files).filter((f) => f.endsWith('.md'))) {
    const name = file.match(/^components\/([a-z0-9-]+)\.md$/)?.[1]
    const surface = name ? (catalog.imports[name]?.surface ?? 'app') : 'app'
    const [home, other] = surface === 'app' ? [full, site] : [site, full]
    assert.ok(home.includes(`<!-- ${file} -->`), file)
    assert.ok(!other.includes(`<!-- ${file} -->`), `${file} appears twice`)
  }
  assert.match(files['llms.txt'], /\(llms-full-site\.txt\)/)
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

  const auth = entry('blocks/auth/sign-in.md')
  assert.match(files['blocks/auth/sign-in.md'], /^### A\. Signed-out bar/m)
  assert.match(auth, /^- A\. Signed-out bar — `AppHeader` \(required\)$/m)
  assert.doesNotMatch(auth, /^### /m)
  assert.doesNotMatch(auth, /```vue/)
  assert.match(files['blocks/auth/sign-in.md'], /## Code \(`Login`\)/)

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
    const { items } = JSON.parse(
      readFileSync(new URL(`../../${meta.file}`, import.meta.url), 'utf-8')
    )
    assert.equal(items.length, meta.count, kind)
    for (const item of items)
      assert.ok(page.includes(`\`${item.class ?? item.name}\``), `${kind} ${item.name}`)
  }
  assert.match(files['foundations/illustrations.md'], /`ddos-protection`/)
  assert.match(files['foundations/icons.md'], /`az-color az-react`/)
})

test('a component that draws a registry asset links its asset page', () => {
  for (const [kind, meta] of Object.entries(catalog.assets)) {
    for (const name of meta.usedBy) {
      const page = files[`components/${name}.md`]
      assert.ok(page.includes('## Assets'), `${name}: ${kind}`)
      assert.ok(page.includes(`../${assetPagePath(kind)}`), `${name}: ${kind}`)
      const api = JSON.parse(files[`components/${name}.json`])
      assert.ok(
        api.assets.some((a) => a.kind === kind),
        `${name}.json: ${kind}`
      )
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
