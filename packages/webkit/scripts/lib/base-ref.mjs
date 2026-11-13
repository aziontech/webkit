import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
export const DEFAULT_BASE = 'origin/feat/webkit-ai-ready'

const git = (args) =>
  execFileSync('git', args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    maxBuffer: 256 * 1024 * 1024
  })

export function baseCandidates({ against = null, env = process.env } = {}) {
  if (against) return [against]
  const out = []
  if (env.GITHUB_BASE_REF) out.push(`origin/${env.GITHUB_BASE_REF}`, env.GITHUB_BASE_REF)
  out.push(DEFAULT_BASE)
  return out
}

export function resolveBase(opts = {}) {
  for (const ref of baseCandidates(opts)) {
    let mergeBase = ''
    try {
      mergeBase = git(['merge-base', 'HEAD', ref]).trim()
    } catch {
      mergeBase = ''
    }
    if (mergeBase) return { ref, commit: mergeBase }
  }
  if (opts.against) return { ref: opts.against, commit: opts.against }
  return null
}

export function showAtBase(base, repoPath) {
  try {
    return git(['show', `${base.commit}:${repoPath}`])
  } catch {
    return null
  }
}

export function listAtBase(base, repoDir) {
  try {
    return git(['ls-tree', '--name-only', `${base.commit}:${repoDir}`])
      .split('\n')
      .filter(Boolean)
  } catch {
    return []
  }
}
