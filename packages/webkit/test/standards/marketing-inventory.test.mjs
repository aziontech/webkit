import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  currentItems,
  findLost,
  INVENTORY_PATH,
  updateInventory
} from '../../scripts/check-marketing-inventory.mjs'

const catalogWith = (imports, patterns = {}) => ({ imports, patterns })

test('an item that leaves the catalog is lost unless renamed or removed is recorded', () => {
  const inventory = {
    renamed: { 'old-band': 'new-band' },
    removed: { 'dead-band': 'unused by the site; use media-split' },
    items: [
      { id: 'old-band', surface: 'marketing' },
      { id: 'dead-band', surface: 'marketing' },
      { id: 'gone-band', surface: 'marketing' },
      { id: 'pattern:shells/website', surface: 'marketing' }
    ]
  }
  const catalog = catalogWith(
    { 'new-band': { surface: 'marketing' }, button: { surface: 'product' } },
    { 'shells/website': {} }
  )
  assert.deepEqual(findLost(inventory, catalog), ['gone-band'])
})

test('update adds new marketing and docs items and never drops one', () => {
  const inventory = { renamed: {}, removed: {}, items: [{ id: 'kept', surface: 'marketing' }] }
  const catalog = catalogWith({ 'doc-card': { surface: 'docs' }, button: { surface: 'product' } })
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
