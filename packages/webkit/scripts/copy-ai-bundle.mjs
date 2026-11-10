#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(SCRIPT_DIR, '..')
const REPO = resolve(PKG, '../..')
const COPIES = ['skills', 'rules', 'adapters']

export function cleanAiBundle(pkg = PKG) {
  for (const dir of [...COPIES, 'cli-templates'])
    rmSync(join(pkg, dir), { recursive: true, force: true })
}

export function copyAiBundle(repo = REPO, pkg = PKG) {
  cleanAiBundle(pkg)
  for (const dir of COPIES) {
    const from = join(repo, dir)
    if (!existsSync(from)) throw new Error(`missing ${from} — the AI bundle lives at the repo root`)
    cpSync(from, join(pkg, dir), { recursive: true })
  }
  const legacy = join(pkg, 'cli-templates/claude')
  mkdirSync(legacy, { recursive: true })
  cpSync(join(repo, 'skills'), join(legacy, 'skills'), { recursive: true })
  cpSync(join(repo, 'rules'), join(legacy, 'rules'), { recursive: true })
  cpSync(join(repo, 'adapters/claude/agents'), join(legacy, 'agents'), { recursive: true })
  cpSync(join(repo, 'adapters/AGENTS.fragment.md'), join(legacy, 'CLAUDE.fragment.md'))
  return COPIES.map((dir) => `${dir}/ (${readdirSync(join(pkg, dir)).length} entries)`)
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invoked) {
  if (process.argv.includes('--clean')) {
    cleanAiBundle()
    process.stdout.write('AI bundle copies removed from the package directory\n')
  } else {
    const copied = copyAiBundle()
    process.stdout.write(
      `AI bundle copied into the package: ${copied.join(', ')} + cli-templates/ (legacy path, one version)\n`
    )
  }
}
