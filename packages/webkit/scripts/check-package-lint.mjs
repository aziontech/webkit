#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(SCRIPT_DIR, '..', '..', '..')

const PUBLINT = 'publint@0.3.25'
const ATTW = '@arethetypeswrong/cli@0.18.5'

const PACKAGES = [
  {
    name: '@aziontech/theme',
    dir: 'packages/theme',
    prepare: [],
    packArgs: [],
    attw: ['--profile', 'esm-only']
  },
  {
    name: '@aziontech/icons',
    dir: 'packages/icons',
    prepare: [['pnpm', '--filter', '@aziontech/icons', 'run', 'build']],
    packArgs: [],
    attw: []
  },
  {
    name: '@aziontech/webkit',
    dir: 'packages/webkit',
    prepare: [['node', 'packages/webkit/scripts/pack-files.mjs']],
    cleanup: [['node', 'packages/webkit/scripts/pack-files.mjs', '--clean']],
    packArgs: ['--config.ignore-scripts=true'],
    attw: null
  }
]

function run(cmd, args, cwd) {
  process.stdout.write(`\n$ ${cmd} ${args.join(' ')}\n`)
  const res = spawnSync(cmd, args, { cwd, stdio: 'inherit', env: process.env })
  return res.status === 0
}

function pack(pkg, packDir) {
  const out = execFileSync('pnpm', ['pack', ...pkg.packArgs, '--pack-destination', packDir], {
    cwd: join(ROOT, pkg.dir),
    encoding: 'utf8'
  })
  const last = out.trim().split('\n').pop().trim()
  return last.startsWith('/') ? last : join(packDir, last.split('/').pop())
}

function lintPackage(pkg, packDir) {
  for (const [cmd, ...args] of pkg.prepare) if (!run(cmd, args, ROOT)) return false
  let tgz
  try {
    tgz = pack(pkg, packDir)
  } finally {
    for (const [cmd, ...args] of pkg.cleanup ?? []) run(cmd, args, ROOT)
  }
  const unpacked = join(packDir, pkg.name.replace('/', '__'))
  mkdirSync(unpacked, { recursive: true })
  execFileSync('tar', ['-xzf', tgz, '-C', unpacked])
  let ok = run(
    'npx',
    ['--yes', PUBLINT, 'run', join(unpacked, 'package'), '--pack', 'false', '--strict'],
    ROOT
  )
  if (pkg.attw) ok = run('npx', ['--yes', ATTW, tgz, ...pkg.attw], ROOT) && ok
  return ok
}

function main() {
  const packDir = mkdtempSync(join(tmpdir(), 'webkit-package-lint-'))
  const failed = []
  try {
    for (const pkg of PACKAGES) if (!lintPackage(pkg, packDir)) failed.push(pkg.name)
  } finally {
    rmSync(packDir, { recursive: true, force: true })
  }
  if (failed.length) {
    console.error(`\n✖ Package lint failed for ${failed.join(', ')} (publint, arethetypeswrong).`)
    return 1
  }
  console.log(`\n✓ ${PACKAGES.map((p) => p.name).join(', ')}: publint and arethetypeswrong pass.`)
  return 0
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exitCode = main()
