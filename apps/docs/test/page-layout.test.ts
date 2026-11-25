import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const source = (file: string) => readFileSync(resolve(HERE, '../src', file), 'utf8')

const breakpoint = (markup: string, pattern: RegExp) => markup.match(pattern)?.[1] ?? ''

test('the article reserves the On-this-page column only from the breakpoint that shows it', () => {
  const rail = breakpoint(
    source('components/table-of-contents.vue'),
    /sticky top-20 hidden [^"]*\b(\w+):block/
  )
  assert.notEqual(rail, '', 'the table of contents rail breakpoint was not found')
  for (const page of ['pages/component-page.vue', 'pages/block-page.vue']) {
    const cap = breakpoint(source(page), /\b(\w+):max-w-\[calc\(100%-var\(--container-3xs\)/)
    assert.equal(cap, rail, `${page} caps the article at ${cap}: but the rail shows at ${rail}:`)
  }
})

test('block state names read in sentence case', async () => {
  const { sentenceTitle } = await import('../src/lib/words.ts')
  assert.equal(sentenceTitle('RepositoriesLoading'), 'Repositories loading')
  assert.equal(sentenceTitle('ConnectError'), 'Connect error')
  assert.equal(sentenceTitle('DnsZoneEmpty'), 'DNS zone empty')
  assert.equal(sentenceTitle('Default'), 'Default')
})

test('the block preview viewport labels come from the message catalogs', () => {
  const frame = source('components/block-frame.vue')
  assert.doesNotMatch(frame, /label: '(Mobile|Tablet|Desktop|Full)/)
  for (const key of ['viewportMobile', 'viewportTablet', 'viewportDesktop', 'viewportFull'])
    assert.match(frame, new RegExp(`t\\.value\\.${key}`))
})
