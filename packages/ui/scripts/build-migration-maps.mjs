#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MAPS = join(PKG, 'src/cli/migrations')
export const OUT = join(PKG, 'docs/migration-v6-maps.md')

const TITLES = {
  'v6.json': 'Components, types and parts',
  'v6-props.json': 'Props, values, slots and events',
  'v6-blocks.json': 'Block ids',
  'v6-testids.json': 'Test ids',
  'v6-icons.json': 'Icon classes',
  'v6-tokens.json': 'Tokens, classes and theme imports',
  'v6-lint.json': 'ESLint rules'
}

const cell = (value) =>
  String(value ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ')
const code = (value) => (value === '' ? '(removed)' : `\`${cell(value)}\``)

function rows(value, path, out) {
  if (value === null || typeof value !== 'object') {
    out.push([path.slice(0, -1).join(' › '), path.at(-1), value])
    return out
  }
  if (typeof value.to === 'string') {
    out.push([path.slice(0, -1).join(' › '), path.at(-1), value.to])
    for (const [from, to] of Object.entries(value.values ?? {}))
      out.push([[...path, 'value'].join(' › '), from, to])
    return out
  }
  if (typeof value.removed === 'string' || value.removed === true) {
    out.push([path.slice(0, -1).join(' › '), path.at(-1), ''])
    return out
  }
  for (const [key, child] of Object.entries(value)) rows(child, [...path, key], out)
  return out
}

export function renderMaps(dir = MAPS) {
  const files = readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .sort((a, b) => Object.keys(TITLES).indexOf(a) - Object.keys(TITLES).indexOf(b))
  const lines = [
    '# Migration maps, 6.0',
    '',
    'Generated from `src/cli/migrations/*.json` by `scripts/build-migration-maps.mjs`; do not edit by hand. Every row is a rename `npx @aziontech/ui migrate v6` applies, or a removal it reports. The guide that explains them is [`MIGRATION_V6.md`](../MIGRATION_V6.md).',
    ''
  ]
  for (const file of files) {
    const map = JSON.parse(readFileSync(join(dir, file), 'utf8'))
    const { version: _version, ...body } = map
    const table = rows(body, [], []).filter(([, from]) => from !== undefined)
    lines.push(`## ${TITLES[file] ?? file}`, '', `\`${file}\`, ${table.length} entries.`, '')
    lines.push('| Where | Old | New |', '| --- | --- | --- |')
    for (const [where, from, to] of table)
      lines.push(
        `| ${cell(where)} | ${code(from)} | ${typeof to === 'string' && to.includes(' ') ? cell(to) : code(to)} |`
      )
    lines.push('')
  }
  return lines.join('\n')
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const text = renderMaps()
  if (process.argv.includes('--check')) {
    const current = readFileSync(OUT, 'utf8')
    if (current !== text) {
      console.error(
        '✖ docs/migration-v6-maps.md is out of date: run node scripts/build-migration-maps.mjs'
      )
      process.exit(1)
    }
    console.log('✓ docs/migration-v6-maps.md matches the migration maps')
  } else {
    writeFileSync(OUT, text)
    console.log(`wrote ${OUT}`)
  }
}
