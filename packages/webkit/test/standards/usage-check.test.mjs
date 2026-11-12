import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  claudeArgs,
  collectWebkitImports,
  createUsageApp,
  evaluateUsage,
  formatUsageReport,
  parseClaudeResult,
  parseUsageArgs,
  pinMcpToInstalledPackage,
  resolveTarget
} from '../../scripts/usage-check.mjs'

const SCRIPT = resolve(dirname(fileURLToPath(import.meta.url)), '../../scripts/usage-check.mjs')

const withDir = (fn) => {
  const dir = mkdtempSync(join(tmpdir(), 'usage-check-'))
  try {
    return fn(dir)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

const writeVue = (app, rel, imports) => {
  const file = join(app, rel)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(
    file,
    `<script setup lang="ts">\n${imports.map((s, i) => `import C${i} from '@aziontech/webkit/${s}'`).join('\n')}\n</script>\n<template><main /></template>\n`
  )
}

test('parseUsageArgs reads the target, the prompt and the options', () => {
  const opts = parseUsageArgs(['button', '  a primary action  ', '--max-turns', '12', '--keep'])
  assert.equal(opts.target, 'button')
  assert.equal(opts.prompt, 'a primary action')
  assert.equal(opts.maxTurns, 12)
  assert.equal(opts.keep, true)
  assert.equal(opts.minCoverage, 0.8)
})

test('parseUsageArgs rejects missing or malformed arguments', () => {
  assert.throws(() => parseUsageArgs([]), /exactly two arguments/)
  assert.throws(() => parseUsageArgs(['button']), /exactly two arguments/)
  assert.throws(() => parseUsageArgs(['button', '   ']), /prompt is empty/)
  assert.throws(() => parseUsageArgs(['button', 'x', '--max-turns', '0']), /positive integer/)
  assert.throws(() => parseUsageArgs(['button', 'x', '--min-coverage', '2']), /min-coverage/)
  assert.throws(() => parseUsageArgs(['button', 'x', '--bogus']), /unknown option/)
})

test('resolveTarget finds a component export and a block by id, suffix or name', () => {
  assert.deepEqual(resolveTarget('button'), {
    kind: 'component',
    id: 'button',
    expected: ['button']
  })
  const block = resolveTarget('platform/auth')
  assert.equal(block.kind, 'block')
  assert.ok(block.expected.includes('button'))
  assert.equal(resolveTarget('auth').id, 'platform/auth')
  assert.throws(() => resolveTarget('no-such-thing-anywhere'), /neither a package export/)
})

test('createUsageApp writes a clean Vite + Vue app on the packed tarballs', () => {
  withDir((work) => {
    const app = createUsageApp(work, {
      webkitTgz: '/t/webkit.tgz',
      themeTgz: '/t/theme.tgz',
      iconsTgz: '/t/icons.tgz'
    })
    const pkg = JSON.parse(readFileSync(join(app, 'package.json'), 'utf8'))
    assert.equal(pkg.dependencies['@aziontech/webkit'], 'file:/t/webkit.tgz')
    assert.ok(pkg.devDependencies.vite)
    for (const f of ['vite.config.mjs', 'index.html', 'src/main.ts', 'pnpm-workspace.yaml']) {
      assert.ok(existsSync(join(app, f)), f)
    }
    assert.deepEqual(collectWebkitImports(app).imports.size, 0)
  })
})

test('pinMcpToInstalledPackage points the webkit server at the installed package', () => {
  withDir((app) => {
    writeFileSync(
      join(app, '.mcp.json'),
      JSON.stringify({ mcpServers: { other: { command: 'x' }, webkit: { command: 'npx' } } })
    )
    const config = pinMcpToInstalledPackage(app)
    assert.equal(config.mcpServers.webkit.command, 'node')
    assert.match(config.mcpServers.webkit.args[0], /node_modules\/@aziontech\/webkit\/src\/mcp/)
    assert.deepEqual(config.mcpServers.other, { command: 'x' })
  })
})

test('evaluateUsage passes a component imported by a generated .vue and doctor exit 0', () => {
  withDir((app) => {
    writeVue(app, 'src/components/Deploy.vue', ['button', 'card'])
    const target = resolveTarget('button')
    const scan = collectWebkitImports(app)
    assert.deepEqual(scan.files, ['src/components/Deploy.vue'])
    assert.equal(evaluateUsage({ target, scan, doctorExitCode: 0 }).pass, true)
    const doctorFail = evaluateUsage({ target, scan, doctorExitCode: 1 })
    assert.equal(doctorFail.pass, false)
    assert.equal(doctorFail.checks.find((c) => c.name === 'webkit doctor').pass, false)
  })
})

test('evaluateUsage fails when the expected component is not imported', () => {
  withDir((app) => {
    writeVue(app, 'src/App.vue', ['card'])
    const verdict = evaluateUsage({
      target: resolveTarget('button'),
      scan: collectWebkitImports(app),
      doctorExitCode: 0
    })
    assert.equal(verdict.pass, false)
    assert.match(
      formatUsageReport({ target: resolveTarget('button'), prompt: 'p', verdict }),
      /FAIL/
    )
  })
})

test('evaluateUsage measures block use by the share of its imports', () => {
  const target = { kind: 'block', id: 'x/y', expected: ['a', 'b', 'c', 'd', 'e'] }
  withDir((app) => {
    writeVue(app, 'src/App.vue', ['a', 'b', 'c', 'd'])
    const scan = collectWebkitImports(app)
    assert.equal(evaluateUsage({ target, scan, doctorExitCode: 0 }).pass, true)
    assert.equal(evaluateUsage({ target, scan, doctorExitCode: 0, minCoverage: 1 }).pass, false)
  })
})

test('claudeArgs and parseClaudeResult match the documented session', () => {
  const args = claudeArgs('make a page', 40)
  assert.deepEqual(args.slice(0, 2), ['-p', 'make a page'])
  for (const flag of ['--dangerously-skip-permissions', '--strict-mcp-config']) {
    assert.ok(args.includes(flag), flag)
  }
  assert.equal(args[args.indexOf('--max-turns') + 1], '40')
  assert.equal(args[args.indexOf('--mcp-config') + 1], '.mcp.json')
  assert.deepEqual(
    parseClaudeResult(JSON.stringify({ is_error: false, num_turns: 7, total_cost_usd: 0.4 })),
    { ok: true, turns: 7, costUsd: 0.4, result: '' }
  )
  assert.equal(parseClaudeResult('not json').ok, false)
})

test('the CLI dry run resolves the target without installing or calling claude', () => {
  const ok = spawnSync(process.execPath, [SCRIPT, 'button', 'a deploy button', '--dry-run'], {
    encoding: 'utf8'
  })
  assert.equal(ok.status, 0, ok.stderr)
  assert.equal(JSON.parse(ok.stdout).target.id, 'button')
  const bad = spawnSync(process.execPath, [SCRIPT, 'button'], { encoding: 'utf8' })
  assert.equal(bad.status, 2)
  assert.match(bad.stderr, /usage:/)
})
