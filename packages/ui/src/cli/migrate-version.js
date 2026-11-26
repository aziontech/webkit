import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { readJson } from './migrate-syntax.js'

const SEMVER_RANGE = /^(?:[\^~]|[<>]=?|=|v|\s)*(\d+)(?:\.(?:\d+|[x*]))*(?:-[\w.]+)?/

const TARBALL = /(?:^|[/\\])aziontech-webkit-(\d+)\.\d+\.\d+(?:-[\w.]+)?\.tgz$/

function rangeMajor(range) {
  const majors = range.split('||').map((part) => part.trim().match(SEMVER_RANGE))
  if (majors.some((m) => !m)) return null
  return Math.min(...majors.map((m) => Number(m[1])))
}

function installedVersion(projectDir) {
  let dir = projectDir
  for (;;) {
    const file = join(dir, 'node_modules', '@aziontech', 'webkit', 'package.json')
    if (existsSync(file)) {
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
  const spec = range.trim().replace(/^npm:@aziontech\/webkit@/, '')
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
  const range = {
    ...pkg.peerDependencies,
    ...pkg.devDependencies,
    ...pkg.dependencies
  }['@aziontech/webkit']
  return typeof range === 'string' ? range : null
}
