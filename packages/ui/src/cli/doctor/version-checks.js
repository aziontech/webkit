import { existsSync, realpathSync } from 'node:fs'
import { join } from 'node:path'

import { ALL_DEPS } from '../init/deps.js'
import { read } from '../init/project-files.js'
import { brokenVueTscIn, VUE_TSC_BROKEN, VUE_TSC_KNOWN_GOOD, vueTscState } from '../toolchain.js'
import { installedVersion } from './project.js'

function vueState(vue) {
  if (!vue) return ['warn', 'vue is not installed — webkit needs vue ^3.5.']
  const [major, minor] = vue.split('.').map(Number)
  if (major === 3 && minor >= 5) return ['ok', `vue ${vue}`]
  return ['fail', `vue ${vue} is installed — webkit needs vue ^3.5.`]
}

export function vueVersionCheck({ projectDir, add }) {
  add('vue version', ...vueState(installedVersion(projectDir, 'vue')))
}

function tailwindState(tailwind) {
  if (!tailwind) {
    return [
      'warn',
      'tailwindcss is not installed — webkit components are styled with Tailwind v4.1 or later (it comes with @aziontech/theme).'
    ]
  }
  const [major, minor] = tailwind.split('.').map(Number)
  if (major === 4 && minor >= 1) return ['ok', `tailwindcss ${tailwind}`]
  return [
    'fail',
    `tailwindcss ${tailwind} is installed — webkit needs Tailwind 4.1 or later (src/webkit.css uses \`@source not\`).`
  ]
}

export function tailwindVersionCheck({ projectDir, add }) {
  add('tailwind version', ...tailwindState(installedVersion(projectDir, 'tailwindcss')))
}

export function dependencyVersionsCheck({ projectDir, pkg, add }) {
  const declared = { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) }
  const present = ALL_DEPS.filter((dep) => dep in declared)
  if (!present.length) return
  const floating = present.filter((dep) => declared[dep] === 'latest')
  const lines = present.map((dep) => {
    const v = installedVersion(projectDir, dep)
    return `${dep}: declared ${declared[dep]}${v ? `, installed ${v}` : ', not installed'}`
  })
  if (!floating.length) {
    add('dependency versions', 'ok', lines.join('\n'))
    return
  }
  const pins = floating
    .map((dep) => {
      const v = installedVersion(projectDir, dep)
      return v ? `${dep}@^${v}` : dep
    })
    .join(', ')
  add(
    'dependency versions',
    'warn',
    `${floating.length} pinned as "latest" — consider pinning: ${pins}.\n${lines.join('\n')}`
  )
}

export function vueTscCheck({ projectDir, add }) {
  const tsc = vueTscState(projectDir)
  if (!tsc.declared && !tsc.installed) return
  const brokenInstalled = [tsc.installed, tsc.languageCore].find((v) => v && VUE_TSC_BROKEN[v])
  const brokenRange = tsc.installed ? [] : brokenVueTscIn(tsc.declared)
  const bad = brokenInstalled || brokenRange[0]
  add(
    'vue-tsc version',
    bad ? 'warn' : 'ok',
    bad
      ? `vue-tsc ${brokenInstalled ? `${bad} is installed` : `"${tsc.declared}" can resolve to ${bad}`}: ${VUE_TSC_BROKEN[bad]}. Pin it: \`npm i -D vue-tsc@${VUE_TSC_KNOWN_GOOD}\`.`
      : `vue-tsc ${tsc.installed ? `${tsc.installed} installed` : `declared ${tsc.declared}`}`
  )
}

function caretSatisfies(range, version) {
  const m = /^\^(\d+)\.(\d+)\.(\d+)$/.exec(range)
  if (!m) return true
  const r = m.slice(1).map(Number)
  const v = String(version).split('.').map(Number)
  if (v[0] !== r[0]) return false
  return v[1] > r[1] || (v[1] === r[1] && v[2] >= r[2])
}

function nestedTheme(projectDir) {
  const webkitDir = join(projectDir, 'node_modules', '@aziontech', 'webkit')
  const nestedDir = join(webkitDir, 'node_modules', '@aziontech', 'theme')
  const topDir = join(projectDir, 'node_modules', '@aziontech', 'theme')
  const sameCopy =
    existsSync(nestedDir) && existsSync(topDir) && realpathSync(nestedDir) === realpathSync(topDir)
  return sameCopy ? null : installedVersion(webkitDir, '@aziontech/theme')
}

function themeProblems(projectDir, webkitPkg, themeRange, theme) {
  const nested = nestedTheme(projectDir)
  const problems = []
  if (nested) {
    problems.push(
      `a second copy of @aziontech/theme (${nested}) is nested under @aziontech/webkit — remove it so one theme drives the tokens`
    )
  }
  if (!theme) {
    problems.push('@aziontech/theme is not installed — install it next to @aziontech/webkit')
    return problems
  }
  const fits = themeRange ? caretSatisfies(themeRange, theme) : true
  if (!fits) {
    problems.push(
      `@aziontech/theme ${theme} does not satisfy the ${themeRange} webkit ${webkitPkg.version} expects`
    )
  }
  return problems
}

export function themeVersionCheck({ projectDir, add }) {
  const webkitPkgPath = join(projectDir, 'node_modules', '@aziontech', 'webkit', 'package.json')
  const webkitPkg = existsSync(webkitPkgPath) ? JSON.parse(read(webkitPkgPath)) : null
  if (!webkitPkg) return
  const themeRange = webkitPkg.peerDependencies?.['@aziontech/theme']
  const theme = installedVersion(projectDir, '@aziontech/theme')
  const problems = themeProblems(projectDir, webkitPkg, themeRange, theme)
  add(
    'theme version',
    problems.length ? 'fail' : 'ok',
    problems.length
      ? problems.join('\n')
      : `@aziontech/theme ${theme} matches webkit ${webkitPkg.version} (${themeRange ?? 'any'})`
  )
}
