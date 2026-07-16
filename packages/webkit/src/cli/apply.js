// Idempotent executor for an init plan produced by `planInit`.
//
// Every action is safe to run twice: files present are skipped or merged, never
// clobbered; the `.mcp.json` merge adds the webkit server only if absent; the
// CLAUDE.md fragment is appended only when its marker is not already there;
// `add-dep` writes a version only for a dependency the project has not pinned.
//
// `applyPlan(projectDir, plan, opts)` returns a list of `{ action, result }`
// records describing what actually happened ('written' | 'merged' | 'appended'
// | 'skipped' | 'advised'), so the CLI can print an honest summary.

import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs'
import { dirname, join } from 'node:path'

function ensureDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true })
}

// Returns parsed JSON, or null when the file does NOT exist. Throws when the file
// EXISTS but cannot be parsed — a caller must never overwrite a file it failed to
// read (that would silently destroy the user's package.json / .mcp.json content).
function readJsonStrict(path) {
  if (!existsSync(path)) return null
  const raw = readFileSync(path, 'utf8')
  try {
    return JSON.parse(raw)
  } catch (err) {
    throw new Error(
      `${path} exists but is not valid JSON (${err.message}); refusing to overwrite it.`
    )
  }
}

function writeJson(path, value) {
  ensureDir(path)
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

// Deep-merge `patch` into `target`, WITHOUT overwriting existing leaf values.
// (Objects recurse; a key already present with a non-object value is left as-is.)
// This is what makes `.mcp.json` idempotent: a second run finds `mcpServers.webkit`
// already set and changes nothing.
function mergePreserve(target, patch) {
  let changed = false
  for (const [key, value] of Object.entries(patch)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
        target[key] = {}
        changed = true
      }
      if (mergePreserve(target[key], value)) changed = true
    } else if (!(key in target)) {
      target[key] = value
      changed = true
    }
  }
  return changed
}

function applyAddDep(projectDir, action) {
  const pkgPath = join(projectDir, 'package.json')
  let pkg
  try {
    pkg = readJsonStrict(pkgPath) || {}
  } catch (err) {
    return { action, result: 'error', detail: err.message }
  }
  const field = action.dev ? 'devDependencies' : 'dependencies'
  pkg[field] = pkg[field] || {}
  if (pkg[field][action.dep]) {
    return { action, result: 'skipped', detail: `${action.dep} already present` }
  }
  pkg[field][action.dep] = action.version
  writeJson(pkgPath, pkg)
  return { action, result: 'written', detail: `${field}.${action.dep}@${action.version}` }
}

function applyWrite(projectDir, action) {
  const target = join(projectDir, action.path)
  if (action.skipIfExists && existsSync(target)) {
    return { action, result: 'skipped', detail: `${action.path} exists` }
  }
  ensureDir(target)
  writeFileSync(target, action.content, 'utf8')
  return { action, result: 'written', detail: action.path }
}

function applyMergeJson(projectDir, action) {
  const target = join(projectDir, action.path)
  let current
  try {
    current = readJsonStrict(target) || {}
  } catch (err) {
    return { action, result: 'error', detail: err.message }
  }
  const changed = mergePreserve(current, action.merge)
  if (!changed) {
    return { action, result: 'skipped', detail: `${action.path} already has ${action.description}` }
  }
  writeJson(target, current)
  return { action, result: 'merged', detail: `${action.path}: ${action.description}` }
}

function applyAppend(projectDir, action) {
  const target = join(projectDir, action.path)
  const existing = existsSync(target) ? readFileSync(target, 'utf8') : ''
  if (action.marker && existing.includes(action.marker)) {
    return { action, result: 'skipped', detail: `${action.path} already contains marker` }
  }
  ensureDir(target)
  const next = existing
    ? `${existing}${existing.endsWith('\n') ? '' : '\n'}${action.content}`
    : action.content
  writeFileSync(target, next, 'utf8')
  if (action.mode) {
    try {
      chmodSync(target, action.mode)
    } catch {
      /* best-effort chmod (e.g. non-POSIX filesystem) */
    }
  }
  return { action, result: 'appended', detail: action.path }
}

function applyCopy(projectDir, action) {
  const target = join(projectDir, action.to)
  if (existsSync(target)) {
    return { action, result: 'skipped', detail: `${action.to} exists` }
  }
  if (!existsSync(action.from)) {
    return { action, result: 'skipped', detail: `template missing: ${action.from}` }
  }
  ensureDir(target)
  copyFileSync(action.from, target)
  return { action, result: 'written', detail: action.to }
}

/**
 * Execute a plan against `projectDir`. Idempotent: safe to run repeatedly.
 *
 * @param {string} projectDir absolute path to the consumer project
 * @param {Array<object>} plan actions from `planInit`
 * @returns {Array<{action: object, result: string, detail?: string}>}
 */
export function applyPlan(projectDir, plan) {
  const results = []
  for (const action of plan) {
    switch (action.type) {
      case 'add-dep':
        results.push(applyAddDep(projectDir, action))
        break
      case 'write':
        results.push(applyWrite(projectDir, action))
        break
      case 'merge-json':
        results.push(applyMergeJson(projectDir, action))
        break
      case 'append':
        results.push(applyAppend(projectDir, action))
        break
      case 'copy':
        results.push(applyCopy(projectDir, action))
        break
      case 'advise':
        results.push({ action, result: 'advised', detail: action.message })
        break
      default:
        results.push({ action, result: 'skipped', detail: `unknown action type: ${action.type}` })
    }
  }
  return results
}

export { readJsonStrict }
export const _internals = { mergePreserve }
