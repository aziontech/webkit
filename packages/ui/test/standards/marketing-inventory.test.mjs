import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  currentItems,
  findLost,
  INVENTORY_PATH,
  updateInventory
} from '../../scripts/check-marketing-inventory.mjs'

const catalogWith = (imports, blocks = {}) => ({ imports, blocks })

test('an item that leaves the catalog is lost unless renamed or removed is recorded', () => {
  const inventory = {
    renamed: { 'old-band': 'new-band' },
    removed: { 'dead-band': 'unused by the site; use media-split' },
    items: [
      { id: 'old-band', surface: 'site' },
      { id: 'dead-band', surface: 'site' },
      { id: 'gone-band', surface: 'site' },
      { id: 'block:shell/site', surface: 'site' }
    ]
  }
  const catalog = catalogWith(
    { 'new-band': { surface: 'site' }, button: { surface: 'app' } },
    { 'shell/site': {} }
  )
  assert.deepEqual(findLost(inventory, catalog), ['gone-band'])
})

test('update adds new marketing and docs items and never drops one', () => {
  const inventory = { renamed: {}, removed: {}, items: [{ id: 'kept', surface: 'site' }] }
  const catalog = catalogWith({ 'doc-card': { surface: 'docs' }, button: { surface: 'app' } })
  const ids = updateInventory(inventory, catalog).items.map((i) => i.id)
  assert.deepEqual(ids, ['doc-card', 'kept'])
  assert.deepEqual(
    currentItems(catalog).map((i) => i.id),
    ['doc-card']
  )
})

test('the shipped catalog still carries every marketing and docs item in the inventory', () => {
  const inventory = JSON.parse(readFileSync(INVENTORY_PATH, 'utf8'))
  const catalog = JSON.parse(readFileSync(new URL('../../catalog.json', import.meta.url), 'utf8'))
  assert.deepEqual(findLost(inventory, catalog), [])
})
