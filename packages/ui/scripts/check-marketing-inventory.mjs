#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const INVENTORY_PATH = resolve(PKG, 'scripts/marketing-inventory.json')
const CATALOG_PATH = resolve(PKG, 'catalog.json')

const SITE_BLOCK = /^(shell\/(site|docs)|marketing\/)/

export function currentItems(catalog) {
  const exports = Object.entries(catalog.imports || {})
    .filter(([, e]) => e.surface === 'site' || e.surface === 'docs')
    .map(([sub, e]) => ({ id: sub, surface: e.surface }))
  const blocks = Object.keys(catalog.blocks || {})
    .filter((id) => SITE_BLOCK.test(id))
    .map((id) => ({ id: `block:${id}`, surface: id.includes('doc') ? 'docs' : 'site' }))
  return [...exports, ...blocks].sort((a, b) => a.id.localeCompare(b.id))
}

export function findLost(inventory, catalog) {
  const present = new Set(currentItems(catalog).map((i) => i.id))
  const accounted = new Set([
    ...Object.keys(inventory.renamed || {}),
    ...Object.keys(inventory.removed || {})
  ])
  return inventory.items.map((i) => i.id).filter((id) => !present.has(id) && !accounted.has(id))
}

export function updateInventory(inventory, catalog) {
  const known = new Set(inventory.items.map((i) => i.id))
  const added = currentItems(catalog).filter((i) => !known.has(i.id))
  return {
    ...inventory,
    items: [...inventory.items, ...added].sort((a, b) => a.id.localeCompare(b.id))
  }
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invoked) {
  const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'))
  const inventory = existsSync(INVENTORY_PATH)
    ? JSON.parse(readFileSync(INVENTORY_PATH, 'utf8'))
    : { renamed: {}, removed: {}, items: [] }
  if (process.argv.includes('--update')) {
    const next = updateInventory(inventory, catalog)
    writeFileSync(INVENTORY_PATH, `${JSON.stringify(next, null, 2)}\n`)
    process.stdout.write(
      `marketing inventory: ${next.items.length} items (${next.items.length - inventory.items.length} added)\n`
    )
  } else {
    const lost = findLost(inventory, catalog)
    if (lost.length) {
      process.stderr.write(
        `✗ ${lost.length} marketing/docs item(s) left the catalog without a record:\n` +
          lost.map((id) => `  - ${id}`).join('\n') +
          '\nRecord each one in scripts/marketing-inventory.json: "renamed": { "<old>": "<new>" } or ' +
          '"removed": { "<old>": "<why, and what the site uses instead>" }.\n'
      )
      process.exit(1)
    }
    process.stdout.write(`✓ marketing inventory: ${inventory.items.length} items accounted for\n`)
  }
}
