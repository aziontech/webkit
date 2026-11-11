#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { readBlocks } from './lib/blocks.mjs'
import {
  buildWorkspace,
  installConsumerApp,
  packWorkspace,
  runLogged,
  writeConsumerApp
} from './lib/consumer-app.mjs'
import { importsOf } from './lib/patterns.mjs'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = resolve(PKG, '../..')

export const USAGE = [
  'usage: node scripts/usage-check.mjs <component-or-block> "<intent prompt>" [options]',
  '',
  '  <component-or-block>  an export subpath (date-picker) or a block id (platform/auth, auth)',
  '  "<intent prompt>"     what a product team would ask for, without naming the component',
  '',
  'options:',
  '  --max-turns <n>       turns for the claude session (default 40)',
  '  --min-coverage <r>    share of a block imports the app must use (default 0.8)',
  '  --report <file>       also write the Markdown report to <file>',
  '  --skip-build          reuse the built theme, icons and catalog',
  '  --keep                keep the temporary app',
  '  --dry-run             resolve the target and print the plan; no install, no claude'
].join('\n')

export function parseUsageArgs(argv) {
  const opts = {
    target: null,
    prompt: null,
    maxTurns: 40,
    minCoverage: 0.8,
    report: null,
    skipBuild: false,
    keep: false,
    dryRun: false
  }
  const positional = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--') continue
    if (arg === '--keep') opts.keep = true
    else if (arg === '--dry-run') opts.dryRun = true
    else if (arg === '--skip-build') opts.skipBuild = true
    else if (arg === '--max-turns') opts.maxTurns = Number(argv[++i])
    else if (arg === '--min-coverage') opts.minCoverage = Number(argv[++i])
    else if (arg === '--report') opts.report = argv[++i] ?? null
    else if (arg.startsWith('--')) throw new Error(`unknown option ${arg}`)
    else positional.push(arg)
  }
  if (positional.length !== 2) {
    throw new Error('expected exactly two arguments: <component-or-block> "<intent prompt>"')
  }
  ;[opts.target, opts.prompt] = positional.map((s) => s.trim())
  if (!opts.target) throw new Error('the component or block is empty')
  if (!opts.prompt) throw new Error('the intent prompt is empty')
  if (!Number.isInteger(opts.maxTurns) || opts.maxTurns < 1) {
    throw new Error('--max-turns must be a positive integer')
  }
  if (!(opts.minCoverage > 0 && opts.minCoverage <= 1)) {
    throw new Error('--min-coverage must be a number in (0, 1]')
  }
  if (opts.report === '') throw new Error('--report needs a file')
  return opts
}

export function resolveTarget(target, pkgRoot = PKG) {
  const exportsMap = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf8')).exports ?? {}
  if (exportsMap[`./${target}`] && !target.includes('/')) {
    return { kind: 'component', id: target, expected: [target] }
  }
  const blocks = readBlocks(pkgRoot)
  const ids = Object.keys(blocks)
  const matches = ids.includes(target)
    ? [target]
    : ids.filter((id) => id.endsWith(`/${target}`) || blocks[id].name === target)
  if (matches.length > 1) {
    throw new Error(`"${target}" matches several blocks: ${matches.join(', ')}; pass the full id`)
  }
  if (!matches.length) {
    throw new Error(`"${target}" is neither a package export nor a block id`)
  }
  const id = matches[0]
  return {
    kind: 'block',
    id,
    expected: [...new Set(importsOf(blocks[id].sfc).map((i) => i.subpath))].sort()
  }
}

function vueFiles(dir) {
  if (!existsSync(dir)) return []
  const out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name !== 'node_modules') out.push(...vueFiles(p))
    } else if (e.name.endsWith('.vue')) out.push(p)
  }
  return out.sort()
}

export function collectWebkitImports(appDir) {
  const files = vueFiles(join(appDir, 'src'))
  const imports = new Map()
  for (const file of files) {
    for (const { subpath } of importsOf(readFileSync(file, 'utf8'))) {
      const rel = relative(appDir, file).split('\\').join('/')
      imports.set(subpath, [...(imports.get(subpath) ?? []), rel])
    }
  }
  return { files: files.map((f) => relative(appDir, f).split('\\').join('/')), imports }
}

export function evaluateUsage({ target, scan, doctorExitCode, minCoverage = 0.8 }) {
  const checks = [
    {
      name: 'src/**/*.vue written',
      pass: scan.files.length > 0,
      detail: `${scan.files.length} file(s)`
    }
  ]
  if (target.kind === 'component') {
    const where = scan.imports.get(target.id)
    checks.push({
      name: `imports @aziontech/webkit/${target.id}`,
      pass: Boolean(where),
      detail: where ? where.join(', ') : 'not imported by any src/**/*.vue'
    })
  } else {
    const used = target.expected.filter((s) => scan.imports.has(s))
    const missing = target.expected.filter((s) => !scan.imports.has(s))
    const coverage = target.expected.length ? used.length / target.expected.length : 0
    checks.push({
      name: `uses block ${target.id}`,
      pass: coverage >= minCoverage,
      detail: `${used.length}/${target.expected.length} of its imports (need ${Math.round(minCoverage * 100)} %)${missing.length ? `; missing ${missing.join(', ')}` : ''}`
    })
  }
  checks.push({
    name: 'webkit doctor',
    pass: doctorExitCode === 0,
    detail: doctorExitCode === 0 ? 'no failure' : `exit ${doctorExitCode}`
  })
  return { pass: checks.every((c) => c.pass), checks }
}

export function claudeArgs(prompt, maxTurns) {
  return [
    '-p',
    prompt,
    '--dangerously-skip-permissions',
    '--max-turns',
    String(maxTurns),
    '--output-format',
    'json',
    '--mcp-config',
    '.mcp.json',
    '--strict-mcp-config'
  ]
}

export function pinMcpToInstalledPackage(appDir) {
  const file = join(appDir, '.mcp.json')
  const config = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
  config.mcpServers = {
    ...config.mcpServers,
    webkit: {
      command: 'node',
      args: [join(appDir, 'node_modules/@aziontech/webkit/src/mcp/server.js')]
    }
  }
  writeFileSync(file, JSON.stringify(config, null, 2) + '\n')
  return config
}

export function createUsageApp(work, tarballs) {
  const app = join(work, 'app')
  writeConsumerApp(app, tarballs)
  return app
}

export function parseClaudeResult(stdout) {
  try {
    const json = JSON.parse(stdout)
    return {
      ok: !json.is_error,
      turns: json.num_turns ?? null,
      costUsd: json.total_cost_usd ?? null,
      result: String(json.result ?? '').slice(0, 2000)
    }
  } catch {
    return { ok: false, turns: null, costUsd: null, result: String(stdout).slice(0, 2000) }
  }
}

export function formatUsageReport({ target, prompt, verdict, session }) {
  const lines = [
    `### Usage check: ${target.kind} \`${target.id}\``,
    '',
    `Prompt: ${prompt}`,
    '',
    '| Check | Result | Detail |',
    '| --- | --- | --- |',
    ...verdict.checks.map((c) => `| ${c.name} | ${c.pass ? 'pass' : '**FAIL**'} | ${c.detail} |`)
  ]
  if (session) {
    lines.push('', `Session: ${session.turns ?? '?'} turns, $${session.costUsd ?? '?'}.`)
  }
  lines.push('', verdict.pass ? 'Usage check passed.' : 'Usage check FAILED.')
  return lines.join('\n')
}

function main() {
  let opts
  try {
    opts = parseUsageArgs(process.argv.slice(2))
  } catch (e) {
    process.stderr.write(`usage-check: ${e.message}\n\n${USAGE}\n`)
    return 2
  }
  let target
  try {
    target = resolveTarget(opts.target)
  } catch (e) {
    process.stderr.write(`usage-check: ${e.message}\n`)
    return 2
  }
  if (opts.dryRun) {
    process.stdout.write(
      JSON.stringify(
        {
          target,
          prompt: opts.prompt,
          claude: ['claude', ...claudeArgs(opts.prompt, opts.maxTurns)]
        },
        null,
        2
      ) + '\n'
    )
    return 0
  }
  if (spawnSync('claude', ['--version'], { encoding: 'utf8' }).status !== 0) {
    process.stderr.write(
      'usage-check: the `claude` CLI is not on PATH (npm i -g @anthropic-ai/claude-code).\n'
    )
    return 2
  }

  const work = mkdtempSync(join(tmpdir(), 'webkit-usage-'))
  try {
    if (!opts.skipBuild) buildWorkspace(ROOT)
    const app = createUsageApp(work, packWorkspace(ROOT, join(work, 'tarballs')))
    const cli = join(app, 'node_modules/@aziontech/webkit/src/cli/cli.js')
    installConsumerApp(app)
    runLogged('node', [cli, 'init', '--yes'], app)
    installConsumerApp(app)
    pinMcpToInstalledPackage(app)

    process.stdout.write(`\n$ claude -p <prompt> … (cwd: ${app})\n`)
    const claude = spawnSync('claude', claudeArgs(opts.prompt, opts.maxTurns), {
      cwd: app,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      env: { ...process.env, CI: 'true' }
    })
    const session = parseClaudeResult(claude.stdout ?? '')
    writeFileSync(join(work, 'claude-output.json'), claude.stdout ?? '')

    const doctor = spawnSync('node', [cli, 'doctor'], { cwd: app, encoding: 'utf8' })
    process.stdout.write(doctor.stdout ?? '')
    const verdict = evaluateUsage({
      target,
      scan: collectWebkitImports(app),
      doctorExitCode: doctor.status,
      minCoverage: opts.minCoverage
    })
    if (!session.ok)
      verdict.checks.unshift({ name: 'claude session', pass: false, detail: session.result })
    verdict.pass = verdict.checks.every((c) => c.pass)

    const report = formatUsageReport({ target, prompt: opts.prompt, verdict, session })
    process.stdout.write(`\n${report}\n`)
    if (opts.report) writeFileSync(resolve(process.cwd(), opts.report), report + '\n')
    return verdict.pass ? 0 : 1
  } finally {
    if (opts.keep) process.stdout.write(`\nworkdir kept: ${work}\n`)
    else rmSync(work, { recursive: true, force: true })
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exit(main())
}
