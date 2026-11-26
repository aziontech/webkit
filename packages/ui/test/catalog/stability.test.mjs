import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { blockCard } from '../../src/catalog/lib/block-search.js'
import { componentCard, PREVIEW_NOTE, stabilityOf } from '../../src/catalog/lib/results.js'
import { readBlocks } from '../../scripts/lib/blocks.mjs'

const fakeCatalog = (entry) => ({ getEntry: () => entry })

test('a preview entry carries stability and its note; a GA entry carries nothing', () => {
  assert.deepEqual(stabilityOf({ stability: 'preview' }), {
    stability: 'preview',
    stabilityNote: PREVIEW_NOTE
  })
  assert.deepEqual(stabilityOf({}), {})
  assert.deepEqual(stabilityOf({ stability: 'ga' }), {})
})

test('component cards and block cards surface preview', () => {
  const card = componentCard(
    fakeCatalog({ import: '@aziontech/webkit/ticket', stability: 'preview' }),
    'ticket'
  )
  assert.equal(card.stability, 'preview')
  assert.equal(componentCard(fakeCatalog({ import: 'x' }), 'button').stability, undefined)
  assert.equal(
    blockCard('view/view-ticket', { name: 'ViewTicket', stability: 'preview' }).stability,
    'preview'
  )
  assert.equal(blockCard('view/view-table', { name: 'ViewTable' }).stability, undefined)
})

function blockRoot(stability) {
  const root = mkdtempSync(join(tmpdir(), 'webkit-stability-'))
  const dir = join(root, 'blocks', 'view', 'view-ticket')
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'view-ticket.vue'), '<template><div /></template>\n')
  writeFileSync(
    join(dir, 'block.json'),
    JSON.stringify({
      id: 'view/view-ticket',
      name: 'ViewTicket',
      title: 'Blocks/View/ViewTicket',
      primary: { name: 'Default', file: 'view-ticket.vue' },
      ...(stability ? { stability } : {})
    })
  )
  return root
}

test('readBlocks stamps preview, leaves GA unmarked and rejects an unknown stability', () => {
  assert.equal(readBlocks(blockRoot('preview'))['view/view-ticket'].stability, 'preview')
  assert.equal(readBlocks(blockRoot('ga'))['view/view-ticket'].stability, undefined)
  assert.equal(readBlocks(blockRoot())['view/view-ticket'].stability, undefined)
  assert.throws(() => readBlocks(blockRoot('beta')), /stability "beta" is not preview or ga/)
})
