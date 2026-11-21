import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export const VUE_TSC_KNOWN_GOOD = '3.3.11'

const DOUBLE_SLASH_SCOPE =
  'a static attribute containing "//" on a component inside a v-for (href="https://…", eyebrow-prefix="//") drops the loop variable from type-checking (TS2304 / TS2552); vuejs/language-tools#6240'

export const VUE_TSC_BROKEN = {
  '3.3.12': DOUBLE_SLASH_SCOPE,
  '3.3.13': DOUBLE_SLASH_SCOPE,
  '3.3.14':
    'a static attribute containing "//" on a component drops a surrounding v-for scope and types ' +
    'later template expressions as refs ("Property \'value\' does not exist"); ' +
    'vuejs/language-tools#6240, #6322'
}

const parse = (version) => {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(version).trim())
  return m ? m.slice(1).map(Number) : null
}

const compare = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]

export function rangeAdmits(range, version) {
  const v = parse(version)
  if (!v) return false
  const raw = String(range ?? '').trim()
  if (raw === '' || raw === '*' || raw === 'latest' || raw === 'x') return true
  return raw.split('||').some((alt) => {
    const m = /^(\^|~|>=|=)?\s*v?(\d+)\.(\d+)\.(\d+)$/.exec(alt.trim())
    if (!m) return /^[<>]/.test(alt.trim())
    const r = m.slice(2, 5).map(Number)
    if (compare(v, r) < 0) return false
    switch (m[1]) {
      case '^':
        return r[0] > 0
          ? v[0] === r[0]
          : r[1] > 0
            ? v[0] === 0 && v[1] === r[1]
            : compare(v, r) === 0
      case '~':
        return v[0] === r[0] && v[1] === r[1]
      case '>=':
        return true
      default:
        return compare(v, r) === 0
    }
  })
}

export function brokenVueTscIn(range) {
  return Object.keys(VUE_TSC_BROKEN).filter((version) => rangeAdmits(range, version))
}

function readJson(path) {
  try {
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null
  } catch {
    return null
  }
}

export function vueTscState(projectDir) {
  const pkg = readJson(join(projectDir, 'package.json')) || {}
  const field = pkg.dependencies?.['vue-tsc'] ? 'dependencies' : 'devDependencies'
  const declared = pkg[field]?.['vue-tsc'] ?? null
  const installed = readJson(join(projectDir, 'node_modules', 'vue-tsc', 'package.json'))?.version
  const languageCore = readJson(
    join(projectDir, 'node_modules', '@vue', 'language-core', 'package.json')
  )?.version
  return {
    declared,
    field,
    installed: installed ?? null,
    languageCore: languageCore ?? null,
    typescript: Boolean(declared) || existsSync(join(projectDir, 'tsconfig.json'))
  }
}

const RANGE_PART = /^(\^|~|>=|=)?\s*v?(\d+)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?(?:-[\w.]+)?$/

function rangeFloors(range) {
  const alts = String(range ?? '')
    .split('||')
    .map((alt) => alt.trim())
  const floors = []
  for (const alt of alts) {
    const m = RANGE_PART.exec(alt)
    if (!m) return null
    const nums = m.slice(2, 5).map((n) => (n == null || n === 'x' || n === '*' ? 0 : Number(n)))
    const wild =
      m[3] == null || m[3] === 'x' || m[3] === '*'
        ? 1
        : m[4] == null || m[4] === 'x' || m[4] === '*'
          ? 2
          : 3
    const op = m[1] || (wild === 1 ? '^' : wild === 2 ? '~' : '=')
    floors.push({ op, version: nums })
  }
  return floors
}

export function depDecision(declared, wanted) {
  if (declared == null) return 'add'
  const want = rangeFloors(wanted)?.[0]
  const have = rangeFloors(declared)
  if (!want || !have) return 'keep'
  const floor = want.version.join('.')
  if (have.some((h) => rangeAdmits(`${h.op}${h.version.join('.')}`, floor))) return 'keep'
  const highest = have.reduce((a, b) => (compare(a.version, b.version) >= 0 ? a : b))
  if (compare(highest.version, want.version) > 0) return 'keep'
  if (have.some((h) => h.op === '>=')) return 'keep'
  return 'upgrade'
}
