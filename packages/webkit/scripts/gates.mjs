#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export const GATES = [
  {
    id: 'catalog',
    label: 'Catalog in sync',
    steps: [['node', 'scripts/build-catalog.mjs', '--check']]
  },
  {
    id: 'llms',
    label: 'llms.txt and Markdown pages in sync',
    steps: [['node', 'scripts/build-llms.mjs', '--check']]
  },
  { id: 'naming', label: 'Naming', steps: [['node', 'scripts/check-naming.mjs']] },
  {
    id: 'migrations',
    label: 'Public API changes have a codemod entry',
    steps: [['node', 'scripts/check-migrations.mjs']]
  },
  {
    id: 'marketing',
    label: 'Marketing and docs inventory',
    steps: [['node', 'scripts/check-marketing-inventory.mjs']]
  },
  { id: 'patterns', label: 'Patterns (G1)', steps: [['node', 'scripts/check-patterns.mjs']] },
  {
    id: 'cited-names',
    label: 'Cited names (G2)',
    steps: [['node', 'scripts/check-cited-names.mjs']]
  },
  {
    id: 'spec-status',
    label: 'No draft spec (G3)',
    steps: [['node', 'scripts/check-spec-status.mjs']]
  },
  {
    id: 'spec-template',
    label: 'Spec template sections',
    steps: [['node', 'scripts/check-spec-template.mjs']]
  },
  { id: 'authoring', label: 'Authoring ratchet', steps: [['node', 'scripts/check-authoring.mjs']] },
  {
    id: 'doc-standards',
    label: 'Skill and agent doc standards',
    steps: [['node', 'scripts/check-authoring-docs.mjs']]
  },
  {
    id: 'test-gate',
    label: 'Every component has a test',
    steps: [['node', 'scripts/check-tests.mjs']]
  },
  {
    id: 'block-stories',
    label: 'Block stories current',
    steps: [['node', '../../apps/storybook/scripts/gen-block-stories.mjs', '--check']]
  },
  {
    id: 'hook-tests',
    label: 'Hook tests',
    steps: [['node', '../../.claude/hooks/__tests__/run.mjs']]
  },
  {
    id: 'toolkit-tests',
    label: 'Toolkit tests',
    steps: [['node', '--test', 'test/**/*.test.mjs']]
  }
]

export function parseGateArgs(argv) {
  const opts = { only: null, bail: false, json: false }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--') continue
    if (arg === '--bail') opts.bail = true
    else if (arg === '--json') opts.json = true
    else if (arg === '--only') opts.only = (argv[++i] ?? '').split(',').filter(Boolean)
    else if (arg.startsWith('--only=')) opts.only = arg.slice(7).split(',').filter(Boolean)
    else throw new Error(`unknown argument: ${arg}`)
  }
  const unknown = (opts.only ?? []).filter((id) => !GATES.some((g) => g.id === id))
  if (unknown.length) throw new Error(`unknown gate(s): ${unknown.join(', ')}`)
  return opts
}

function runGate(gate) {
  const started = Date.now()
  let output = ''
  for (const [cmd, ...args] of gate.steps) {
    const res = spawnSync(cmd, args, { cwd: PKG, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    output += `${res.stdout ?? ''}${res.stderr ?? ''}`
    if (res.status !== 0) {
      return { ...gate, pass: false, seconds: (Date.now() - started) / 1000, output }
    }
  }
  return { ...gate, pass: true, seconds: (Date.now() - started) / 1000, output }
}

export function formatTable(results) {
  const rows = results.map(
    (r) =>
      `| ${r.label} | \`${r.steps.map((s) => s.join(' ')).join(' && ')}\` | ${r.pass ? 'pass' : '**FAIL**'} | ${r.seconds.toFixed(1)} s |`
  )
  const failed = results.filter((r) => !r.pass).length
  return [
    '| Gate | Command (in packages/webkit) | Result | Time |',
    '| --- | --- | --- | --- |',
    ...rows,
    '',
    `${results.length - failed} of ${results.length} gates passed.`
  ].join('\n')
}

export function runGates(opts) {
  const results = []
  for (const gate of GATES) {
    if (opts.only && !opts.only.includes(gate.id)) continue
    if (!opts.json) process.stderr.write(`… ${gate.label}\n`)
    const result = runGate(gate)
    results.push(result)
    if (!result.pass && opts.bail) break
  }
  return results
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  let opts
  try {
    opts = parseGateArgs(process.argv.slice(2))
  } catch (e) {
    process.stderr.write(`gates: ${e.message}\nusage: gates.mjs [--only id,id] [--bail] [--json]\n`)
    process.exit(2)
  }
  const results = runGates(opts)
  const failed = results.filter((r) => !r.pass)
  if (opts.json) {
    process.stdout.write(
      JSON.stringify(
        results.map(({ id, label, pass, seconds }) => ({ id, label, pass, seconds })),
        null,
        2
      ) + '\n'
    )
  } else {
    for (const r of failed) {
      process.stderr.write(`\n✖ ${r.label} output (last 40 lines):\n`)
      process.stderr.write(r.output.trim().split('\n').slice(-40).join('\n') + '\n')
    }
    process.stdout.write(`\n${formatTable(results)}\n`)
  }
  process.exit(failed.length ? 1 : 0)
}
