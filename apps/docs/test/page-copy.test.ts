import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const src = fileURLToPath(new URL('../src/', import.meta.url))
const read = (path: string) => readFileSync(`${src}${path}`, 'utf8')

const vueFiles = (dir: string): string[] =>
  readdirSync(`${src}${dir}`, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? vueFiles(`${dir}${entry.name}/`)
      : entry.name.endsWith('.vue')
        ? [`${dir}${entry.name}`]
        : []
  )

test('the index leads and the Copy for AI tips are translated', () => {
  for (const catalog of ['lib/i18n-pt-br.ts', 'lib/i18n-es.ts']) {
    const text = read(catalog)
    for (const key of ['componentsLead', 'blocksLead', 'copyPageTip', 'copyBlockTip']) {
      const value = new RegExp(`\\b${key}:\\s*'([^']+)'`).exec(text)?.[1] ?? ''
      assert.ok(value, `${catalog} ${key}`)
      assert.doesNotMatch(value, /ready to paste|each with its/, `${catalog} ${key}`)
    }
  }
  const pages = ['components/component-grid.vue', 'pages/blocks-page.vue']
  for (const page of pages) assert.doesNotMatch(read(page), /each with its/, page)
  for (const page of ['pages/component-page.vue', 'pages/block-page.vue'])
    assert.doesNotMatch(read(page), /tip: '/, page)
})

test('every element that opens a new tab says so in its accessible name', () => {
  const missing: string[] = []
  for (const file of vueFiles('')) {
    const text = read(file)
    for (const match of text.matchAll(/<[A-Za-z][^>]*?target="_blank"[^>]*>/gs)) {
      if (!/newTab|openInNewTab/.test(match[0])) missing.push(file)
    }
  }
  assert.deepEqual(missing, [])
})

test('How it is built is a heading inside its summary, so the outline reaches it', () => {
  assert.match(
    read('pages/component-page.vue'),
    /<summary[^>]*>[\s\S]*?<h2[^>]*>\{\{ t\.howItIsBuilt \}\}<\/h2>[\s\S]*?<\/summary>/
  )
})

test('the not-found page offers search and the three sections, not only the start', () => {
  const page = read('pages/not-found-page.vue')
  assert.match(page, /@click="searchOpen = true"/)
  for (const to of ['/components', '/blocks', '/foundations'])
    assert.ok(page.includes(`'${to}'`), to)
  assert.match(
    read('components/docs-shell.vue'),
    /import \{ searchOpen \} from '\.\.\/lib\/search-open'/
  )
})

test('a rule or skill the docs site renders speaks as a page and spells WebKit', () => {
  const root = fileURLToPath(new URL('../../../', import.meta.url))
  const sources = [...read('lib/foundations.ts').matchAll(/markdown: '([^']+)'/g)].map((m) => m[1])
  assert.ok(sources.length > 5)
  const leaks = sources.filter((path) =>
    /\bThis skill\b|\bWebkit\b/.test(readFileSync(`${root}${path}`, 'utf8'))
  )
  assert.deepEqual(leaks, [])
})
