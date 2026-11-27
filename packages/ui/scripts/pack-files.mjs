#!/usr/bin/env node

import { execFileSync, spawn } from 'node:child_process'
import { basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildTypes, cleanTypes } from './build-types.mjs'
import { cleanAiBundle, copyAiBundle } from './copy-ai-bundle.mjs'

const SCRIPT = fileURLToPath(import.meta.url)
const CLEAN_DEADLINE_MS = 10 * 60 * 1000

export function preparePack() {
  const bundle = copyAiBundle()
  const types = buildTypes()
  return { bundle, types }
}

export function cleanPack() {
  cleanAiBundle()
  cleanTypes()
}

export function isPnpmCommand(command) {
  const [first = '', second = ''] = command.trim().split(/\s+/)
  return [first, second].some((arg) => /^pnpm(\.c?js|\.mjs|\.exe)?$/i.test(basename(arg)))
}

export function findAncestor(pid, matches, readProcess, depth = 8) {
  let current = pid
  for (let i = 0; i < depth && current > 1; i++) {
    const info = readProcess(current)
    if (!info) return null
    if (matches(info.command)) return current
    current = info.ppid
  }
  return null
}

function readProcess(pid) {
  try {
    const out = execFileSync('ps', ['-o', 'ppid=,args=', '-p', String(pid)], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
    const match = out.match(/^(\d+)\s+([\s\S]*)$/)
    return match ? { ppid: Number(match[1]), command: match[2] } : null
  } catch {
    return null
  }
}

export function packerToOutlive(env = process.env, ppid = process.ppid, read = readProcess) {
  if (env.npm_lifecycle_event !== 'postpack') return null
  if (!(env.npm_config_user_agent ?? '').startsWith('pnpm/')) return null
  return findAncestor(ppid, isPnpmCommand, read)
}

function alive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return error.code === 'EPERM'
  }
}

function cleanAfter(pid) {
  const deadline = Date.now() + CLEAN_DEADLINE_MS
  const timer = setInterval(() => {
    if (alive(pid) && Date.now() < deadline) return
    clearInterval(timer)
    cleanPack()
  }, 100)
}

const invoked = process.argv[1] && resolve(process.argv[1]) === SCRIPT
if (invoked) {
  const args = process.argv.slice(2)
  if (args[0] === '--clean-after') {
    cleanAfter(Number(args[1]))
  } else if (args[0] === '--clean') {
    const packer = packerToOutlive()
    if (packer) {
      spawn(process.execPath, [SCRIPT, '--clean-after', String(packer)], {
        detached: true,
        stdio: 'ignore'
      }).unref()
      process.stdout.write('Pack files (AI bundle, types/) are removed once pnpm exits\n')
    } else {
      cleanPack()
      process.stdout.write('Pack files (AI bundle, types/) removed from the package directory\n')
    }
  } else {
    try {
      const { bundle, types } = preparePack()
      process.stdout.write(`AI bundle copied into the package: ${bundle.join(', ')}\n`)
      process.stdout.write(`types/: ${types.count} declarations\n`)
    } catch (error) {
      process.stderr.write(`pack-files: ${error.message}\n`)
      process.exit(1)
    }
  }
}
