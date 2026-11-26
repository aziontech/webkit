import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { loadPackageMap } from './migrate-package.js'
import { escapeRe, readJson } from './migrate-syntax.js'

const NAME = '@aziontech/ui'
const OLD_NAMES = Object.entries(loadPackageMap().packages || {})
  .filter(([, next]) => next === NAME)
  .map(([old]) => old)
const NAMES = [NAME, ...OLD_NAMES]
const tarballStem = (name) => name.replace(/^@/, '').replace('/', '-')

const SEMVER_RANGE = /^(?:[\^~]|[<>]=?|=|v|\s)*(\d+)(?:\.(?:\d+|[x*]))*(?:-[\w.]+)?/

const TARBALL = new RegExp(
  `(?:^|[/\\\\])(?:${NAMES.map((n) => escapeRe(tarballStem(n))).join('|')})-(\\d+)\\.\\d+\\.\\d+(?:-[\\w.]+)?\\.tgz$`
)

function rangeMajor(range) {
  const majors = range.split('||').map((part) => part.trim().match(SEMVER_RANGE))
  if (majors.some((m) => !m)) return null
  return Math.min(...majors.map((m) => Number(m[1])))
}

function installedVersion(projectDir) {
  let dir = projectDir
  for (;;) {
    for (const name of NAMES) {
      const file = join(dir, 'node_modules', ...name.split('/'), 'package.json')
      if (!existsSync(file)) continue
      const { version } = readJson(file)
      if (typeof version === 'string') return version
    }
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}

export function declaredMajor(projectDir) {
  const range = declaredRange(projectDir)
  if (range == null) return null
  const spec = range.trim().replace(new RegExp(`^npm:(?:${NAMES.map(escapeRe).join('|')})@`), '')
  const tarball = spec.match(TARBALL)
  if (tarball) return { range, major: Number(tarball[1]), source: 'tarball' }
  if (!/^(file|link|workspace|portal|git|github|https?):|[/\\]/.test(spec) && spec) {
    const major = rangeMajor(spec)
    if (major != null) return { range, major, source: 'range' }
  }
  const installed = installedVersion(projectDir)
  const m = installed && installed.match(/^(\d+)\.\d+\.\d+/)
  if (m) return { range, major: Number(m[1]), source: 'installed', installed }
  const workspace = spec.match(/^workspace:(.+)$/)
  const major = workspace ? rangeMajor(workspace[1]) : null
  return major == null ? null : { range, major, source: 'range' }
}

export function declaredRange(projectDir) {
  const pkg = readJson(join(projectDir, 'package.json'))
  const deps = { ...pkg.peerDependencies, ...pkg.devDependencies, ...pkg.dependencies }
  const range = NAMES.map((name) => deps[name]).find((value) => typeof value === 'string')
  return range ?? null
}
