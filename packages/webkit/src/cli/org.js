// Owner detection for `webkit init` — reads .git/config, never the network or a subprocess,
// so it stays pure and fixture-testable. It is a HINT (anyone can point a remote at an org):
// it decides whether a question is asked, nothing more. See docs/toolkit/cli.md.

import { existsSync, readFileSync, statSync } from 'node:fs'
import { isAbsolute, join, resolve } from 'node:path'

/** Owners whose repos get the CI workflow without being asked. */
export const INTERNAL_ORGS = ['aziontech', 'azioncorp']

/** True when `owner` is one of the Azion orgs (case-insensitive). */
export function isInternalOrg(owner) {
  return typeof owner === 'string' && INTERNAL_ORGS.includes(owner.toLowerCase())
}

/**
 * `{ host, owner, repo }` from a git remote URL — scp-like (`git@host:owner/repo.git`) or
 * URL-like (`https://`, `ssh://`, `git://`). Local paths carry no owner and yield null.
 */
export function parseRemoteUrl(url) {
  if (typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed || trimmed.startsWith('file://') || isAbsolute(trimmed) || trimmed.startsWith('.')) {
    return null
  }

  let host
  let path
  const scheme = /^[a-z][a-z0-9+.-]*:\/\//i.exec(trimmed)
  if (scheme) {
    // The platform parser handles user@, port and query.
    let parsed
    try {
      parsed = new URL(trimmed)
    } catch {
      return null
    }
    host = parsed.hostname
    path = parsed.pathname
  } else {
    const match = /^(?:[^@/]+@)?([^:/]+):(.+)$/.exec(trimmed)
    if (!match) return null
    host = match[1]
    path = match[2]
  }

  const segments = path
    .replace(/\.git$/, '')
    .split('/')
    .filter(Boolean)
  // An owner needs `<owner>/<repo>`; a bare `host:repo` has none.
  if (segments.length < 2) return null
  return { host, owner: segments[0], repo: segments[segments.length - 1] }
}

// `.git` is a directory in a clone and a `gitdir:` FILE in a worktree or submodule.
function resolveGitDir(projectDir) {
  const dotGit = join(projectDir, '.git')
  if (!existsSync(dotGit)) return null
  let stat
  try {
    stat = statSync(dotGit)
  } catch {
    return null
  }
  if (stat.isDirectory()) return dotGit
  let pointer
  try {
    pointer = readFileSync(dotGit, 'utf8')
  } catch {
    return null
  }
  const target = /^gitdir:\s*(.+)$/m.exec(pointer)?.[1]?.trim()
  if (!target) return null
  return isAbsolute(target) ? target : resolve(projectDir, target)
}

// Remotes live in the SHARED config: a linked worktree's gitdir has no `config`, only a
// `commondir` pointer to it. Without following it every worktree looks remote-less.
function configDir(projectDir) {
  const dir = resolveGitDir(projectDir)
  if (!dir) return null
  const commonPath = join(dir, 'commondir')
  if (!existsSync(commonPath)) return dir
  let target
  try {
    target = readFileSync(commonPath, 'utf8').trim()
  } catch {
    return dir
  }
  if (!target) return dir
  return isAbsolute(target) ? target : resolve(dir, target)
}

/** Every `[remote "<name>"] url = …` in the project's git config, in file order. */
export function readGitRemotes(projectDir) {
  const dir = configDir(projectDir)
  if (!dir) return []
  const configPath = join(dir, 'config')
  if (!existsSync(configPath)) return []
  let raw
  try {
    raw = readFileSync(configPath, 'utf8')
  } catch {
    return []
  }
  const remotes = []
  let current = null
  for (const line of raw.split('\n')) {
    const text = line.trim()
    if (text.startsWith('#') || text.startsWith(';')) continue
    const section = /^\[([^\]]+)\]$/.exec(text)
    if (section) {
      const named = /^remote\s+"(.+)"$/.exec(section[1].trim())
      current = named ? named[1] : null
      continue
    }
    if (!current) continue
    const kv = /^url\s*=\s*(.+)$/.exec(text)
    if (kv) remotes.push({ remote: current, url: kv[1].trim() })
  }
  return remotes
}

/** package.json#repository — the declarative fallback for a repo with no remote yet. */
function readPackageRepository(projectDir) {
  const path = join(projectDir, 'package.json')
  if (!existsSync(path)) return null
  let pkg
  try {
    pkg = JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
  const repository = pkg?.repository
  const url = typeof repository === 'string' ? repository : repository?.url
  if (typeof url !== 'string') return null
  // The shorthands npm accepts: "owner/repo" and "github:owner/repo".
  const shorthand = /^(?:github:)?([\w.-]+)\/([\w.-]+)$/.exec(url.trim())
  if (shorthand) return { host: 'github.com', owner: shorthand[1], repo: shorthand[2] }
  return parseRemoteUrl(url.replace(/^git\+/, ''))
}

/**
 * Detect the repo's owner. An INTERNAL owner on ANY remote wins — a fork's `origin` is a
 * personal account while `upstream` is still the org, and it is an Azion repo either way.
 * Falls back to `origin`, the first remote, then package.json#repository.
 */
export function detectOwner(projectDir) {
  const parsed = readGitRemotes(projectDir)
    .map(({ remote, url }) => ({ remote, ...(parseRemoteUrl(url) || {}) }))
    .filter((r) => r.owner)

  const pick =
    parsed.find((r) => isInternalOrg(r.owner)) ||
    parsed.find((r) => r.remote === 'origin') ||
    parsed[0]

  if (pick) {
    return {
      owner: pick.owner,
      repo: pick.repo,
      host: pick.host,
      source: `git remote "${pick.remote}"`,
      internal: isInternalOrg(pick.owner)
    }
  }

  const declared = readPackageRepository(projectDir)
  if (declared) {
    return {
      ...declared,
      source: 'package.json#repository',
      internal: isInternalOrg(declared.owner)
    }
  }
  return null
}
