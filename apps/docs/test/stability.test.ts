import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

import { buildIndex } from '../plugins/content.ts'

const catalog = JSON.parse(
  readFileSync(new URL('../../../packages/ui/catalog.json', import.meta.url), 'utf8')
)

test('the docs index marks preview components and blocks, and everything else GA', () => {
  const copy = structuredClone(catalog)
  for (const entry of Object.values(copy.imports) as { stability?: string }[])
    delete entry.stability
  for (const block of Object.values(copy.blocks) as { stability?: string }[]) delete block.stability
  copy.imports.button.stability = 'preview'
  copy.blocks['view/view-table'].stability = 'preview'
  const { components, blocks } = buildIndex(copy)
  const preview = <T extends { stability: string }>(list: T[], key: (item: T) => string) =>
    list.filter((item) => item.stability === 'preview').map(key)
  assert.deepEqual(
    preview(components, (item) => item.name),
    ['button']
  )
  assert.deepEqual(
    preview(blocks, (item) => item.id),
    ['view/view-table']
  )
  assert.ok(components.every((item) => ['preview', 'ga'].includes(item.stability)))
})
