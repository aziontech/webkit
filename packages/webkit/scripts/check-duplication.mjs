#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SCANNED = ['src/components', 'blocks']
const IGNORED = ['**/*.test.ts', '**/*.figma.ts', '**/*.md']

export const blockOf = (file) =>
  file.startsWith('blocks/') ? file.split('/').slice(0, 3).join('/') : null

export function classify(a, b) {
  const [blockA, blockB] = [blockOf(a), blockOf(b)]
  return blockA && blockB && blockA !== blockB ? 'between-blocks' : 'clone'
}

export function findClones(pkgDir = PKG) {
  const out = mkdtempSync(join(tmpdir(), 'webkit-jscpd-'))
  const args = [
    ...SCANNED,
    '--min-lines',
    '10',
    '--min-tokens',
    '70',
    '--reporters',
    'json',
    '--output',
    out
  ]
  const run = spawnSync(
    join(pkgDir, 'node_modules/.bin/jscpd'),
    [...args, '--ignore', IGNORED.join(','), '--silent'],
    {
      cwd: pkgDir,
      encoding: 'utf8'
    }
  )
  if (run.error) throw run.error
  const report = JSON.parse(readFileSync(join(out, 'jscpd-report.json'), 'utf8'))
  rmSync(out, { recursive: true, force: true })
  const file = (side) => relative(pkgDir, resolve(pkgDir, side.name))
  return report.duplicates.map((d) => ({
    a: file(d.firstFile),
    b: file(d.secondFile),
    aLines: `${d.firstFile.start}-${d.firstFile.end}`,
    bLines: `${d.secondFile.start}-${d.secondFile.end}`,
    lines: d.lines,
    kind: classify(file(d.firstFile), file(d.secondFile))
  }))
}

function main() {
  const all = findClones()
  const clones = all.filter((c) => c.kind === 'clone')
  const betweenBlocks = all.filter((c) => c.kind === 'between-blocks')
  const list = (items) =>
    items.map((c) => `  ${c.a}:${c.aLines}  <->  ${c.b}:${c.bLines}  (${c.lines} lines)`).join('\n')
  if (process.argv.includes('--report') && betweenBlocks.length) {
    console.log(`Repeats between two blocks (${betweenBlocks.length}):\n${list(betweenBlocks)}\n`)
  }
  if (clones.length) {
    console.error(
      `✖ ${clones.length} copy-pasted fragment(s) in components or inside one block:\n${list(clones)}\n`
    )
    console.error(
      'Remove the repetition: one template driven by data, a private part in parts/, a composable, or a variant that\n' +
        'imports its block. Do not rename or reorder code to hide a copy. There is no baseline (decision CQ-E).'
    )
    process.exit(1)
  }
  console.log(
    `✓ duplication: no copy-pasted fragment in components or inside a block` +
      (betweenBlocks.length
        ? `; ${betweenBlocks.length} repeat(s) between two blocks (--report lists them)`
        : '')
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
