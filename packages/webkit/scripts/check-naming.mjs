#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  checkBlocks,
  checkSubpaths,
  checkSynonyms,
  readBlockIds,
  retiredNames
} from './lib/naming.mjs'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export function exportSubpaths(pkg) {
  return Object.keys(pkg.exports || {})
    .filter((k) => k.startsWith('./'))
    .map((k) => k.slice(2))
}

export function checkNaming({ subpaths, blocks, retired }) {
  return [...checkSubpaths(subpaths), ...checkBlocks(blocks), ...checkSynonyms(subpaths, retired)]
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invoked) {
  const pkg = JSON.parse(readFileSync(resolve(PKG, 'package.json'), 'utf8'))
  const migration = JSON.parse(readFileSync(resolve(PKG, 'src/cli/migrations/v6.json'), 'utf8'))
  const subpaths = exportSubpaths(pkg)
  const blocks = readBlockIds(resolve(PKG, 'blocks'))
  const errors = checkNaming({ subpaths, blocks, retired: retiredNames(migration) })
  if (errors.length) {
    console.error(`Naming check failed (${errors.length}):`)
    for (const e of errors) console.error(`  - ${e}`)
    console.error(
      'Rules: kebab-case English ids, block ids match their folder, no synonym of an existing export, no retired v6 name (scripts/lib/naming.mjs).'
    )
    process.exit(1)
  }
  console.log(
    `Naming OK: ${subpaths.length} exports, ${blocks.length} blocks, no synonyms or retired names.`
  )
}
