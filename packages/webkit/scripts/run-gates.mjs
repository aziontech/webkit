#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = resolve(PKG, '../..')

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
  {
    id: 'js-dts',
    label: 'Declarations for runtime .js modules in sync',
    steps: [['node', 'scripts/build-js-dts.mjs', '--check']]
  },
  {
    id: 'exports',
    label: 'Every source export declares types',
    steps: [['node', 'scripts/build-exports.mjs', '--check']]
  },
  { id: 'naming', label: 'Naming', steps: [['node', 'scripts/check-naming.mjs']] },
  {
    id: 'migrations',
    label: 'Public API changes have a codemod entry',
    steps: [['node', 'scripts/check-migrations.mjs']]
  },
  {
    id: 'api-diff',
    label: 'Public API diff against the base branch',
    steps: [['node', 'scripts/check-api-diff.mjs']]
  },
  {
    id: 'marketing-inventory',
    label: 'Marketing and docs inventory',
    steps: [['node', 'scripts/check-marketing-inventory.mjs']]
  },
  {
    id: 'blocks',
    label: 'Blocks',
    steps: [['node', 'scripts/check-blocks.mjs']]
  },
  {
    id: 'examples-lint',
    label: 'Examples pass the consumer lint',
    steps: [['node', 'scripts/check-examples-lint.mjs']]
  },
  {
    id: 'cited-names',
    label: 'Cited names',
    steps: [['node', 'scripts/check-cited-names.mjs']]
  },
  {
    id: 'spec-status',
    label: 'No draft spec',
    steps: [['node', 'scripts/check-spec-status.mjs']]
  },
  {
    id: 'spec-integrity',
    label: 'Spec integrity (status, checksum)',
    steps: [['node', 'scripts/check-spec-integrity.mjs']]
  },
  {
    id: 'spec-template',
    label: 'Spec template sections',
    steps: [['node', 'scripts/check-spec-template.mjs']]
  },
  { id: 'authoring', label: 'Authoring ratchet', steps: [['node', 'scripts/check-authoring.mjs']] },
  {
    id: 'authoring-docs',
    label: 'Authoring docs ratchet',
    steps: [['node', 'scripts/check-authoring-docs.mjs']]
  },
  {
    id: 'docs-markdown',
    label: "Docs Markdown: Do / Don't pairs, no task lists",
    steps: [['node', 'scripts/check-docs-markdown.mjs']]
  },
  {
    id: 'tests',
    label: 'Every component has a test',
    steps: [['node', 'scripts/check-tests.mjs']]
  },
  {
    id: 'size',
    label: 'Bundle budget',
    steps: [
      ['node', 'scripts/check-size.mjs'],
      ['node', 'scripts/check-css-size.mjs']
    ]
  },
  {
    id: 'complete',
    label: 'Every component is complete, size budgets only ratchet down',
    steps: [
      ['node', 'scripts/check-complete.mjs'],
      ['node', 'scripts/check-size-ratchet.mjs']
    ]
  },
  {
    id: 'look-alikes',
    label: 'No new pair of components that do the same job without reusing each other',
    steps: [['node', 'scripts/check-look-alikes.mjs']]
  },
  {
    id: 'duplication',
    label: 'No copy-pasted code in components or inside a block',
    steps: [['node', 'scripts/check-duplication.mjs']]
  },
  {
    id: 'maintainability',
    label:
      'No file, script block, function, line, prop or model count over the CODE_QUALITY.md 3.1 limits',
    steps: [['node', 'scripts/check-maintainability.mjs']]
  },
  {
    id: 'assertions',
    label: 'No as never or as unknown as, and the type assertion count does not grow',
    steps: [['node', 'scripts/check-assertions.mjs']]
  },
  {
    id: 'sfc-type-coverage',
    label:
      'The count of identifiers typed any in component SFC scripts and templates does not grow',
    steps: [['node', 'scripts/check-sfc-type-coverage.mjs']]
  },
  {
    id: 'quality-lint',
    label:
      'No line over 200 characters and no accessibility lint finding in components, blocks and examples',
    root: true,
    steps: [['pnpm', '--filter', '@aziontech/webkit', 'run', 'lint:quality']]
  },
  {
    id: 'hooks',
    label: 'Hook tests',
    steps: [['node', '../../.claude/hooks/test/run.mjs']]
  },
  {
    id: 'toolkit',
    label: 'Toolkit tests',
    steps: [['node', '--test', 'test/**/*.test.mjs']]
  },
  {
    id: 'packages',
    label: 'MCP, theme and icons package tests, icons manifest',
    root: true,
    steps: [
      ['pnpm', '--filter', '@aziontech/webkit-mcp', 'test'],
      ['pnpm', '--filter', '@aziontech/theme', 'test'],
      ['pnpm', '--filter', '@aziontech/icons', 'test'],
      ['pnpm', '--filter', '@aziontech/icons', 'check:manifest']
    ]
  },
  {
    id: 'docs-tests',
    label: 'Docs Markdown pipeline tests',
    root: true,
    steps: [['pnpm', 'test:docs']]
  },
  {
    id: 'stylelint',
    label: 'Stylelint',
    root: true,
    steps: [['pnpm', 'run', 'lint:webkit:style']]
  },
  {
    id: 'lint-canaries',
    label: 'Lint canaries still fail their rule',
    root: true,
    steps: [['node', 'lint-canaries/index.js']]
  },
  {
    id: 'lint',
    label: 'ESLint on the package source, no warning',
    root: true,
    steps: [['pnpm', 'run', 'lint:webkit']]
  },
  {
    id: 'typecheck',
    label: 'TypeScript check (vue-tsc)',
    root: true,
    steps: [['pnpm', 'run', 'typecheck:webkit']]
  },
  {
    id: 'type-coverage',
    label: 'Type coverage of the .ts files, at least 95%',
    root: true,
    steps: [['pnpm', 'run', 'check:webkit:type-coverage']]
  },
  {
    id: 'ssr',
    label: 'Server render of every block and example',
    root: true,
    steps: [['pnpm', '--filter', '@aziontech/webkit', 'test:ssr']]
  },
  {
    id: 'types-tests',
    label: 'Tests TypeScript check',
    root: true,
    steps: [['pnpm', 'run', 'typecheck:webkit:tests']]
  },
  {
    id: 'format',
    label: 'Prettier check',
    root: true,
    steps: [['pnpm', 'run', 'check:webkit:format']]
  },
  {
    id: 'unused',
    label: 'No unused file, export or dependency (knip)',
    root: true,
    steps: [['pnpm', 'run', 'check:unused']]
  },
  {
    id: 'versions',
    label: 'One version of each shared dependency, no lockfile duplicate (syncpack, pnpm dedupe)',
    root: true,
    steps: [['pnpm', 'run', 'check:versions']]
  },
  {
    id: 'spelling',
    label: 'No spelling mistake (typos)',
    root: true,
    steps: [['pnpm', 'run', 'check:spelling']]
  },
  {
    id: 'workflows',
    label: 'Workflow linters (actionlint, zizmor)',
    root: true,
    steps: [['npm', 'run', 'check:workflows']]
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
    const res = spawnSync(cmd, args, {
      cwd: gate.root ? ROOT : PKG,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024
    })
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
    '| Gate | Command (in packages/webkit, or the repo root for root gates) | Result | Time |',
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
    process.stderr.write(
      `gates: ${e.message}\nusage: run-gates.mjs [--only id,id] [--bail] [--json]\n`
    )
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
