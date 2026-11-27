import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

import { read } from '../init/project-files.js'

const AZION_UI_PKGS = ['@aziontech/ui']

export function resolveCatalog(projectDir) {
  if (process.env.AZION_UI_CATALOG_PATH && existsSync(process.env.AZION_UI_CATALOG_PATH)) {
    return process.env.AZION_UI_CATALOG_PATH
  }
  const require = createRequire(join(projectDir, '__azion_ui_resolve__.js'))
  for (const pkg of AZION_UI_PKGS) {
    try {
      return require.resolve(`${pkg}/catalog.json`)
    } catch {}
    try {
      return join(dirname(require.resolve(`${pkg}/package.json`)), 'catalog.json')
    } catch {}
  }
  return null
}

const SRC_EXTENSIONS = ['.vue', '.ts', '.js', '.mts', '.mjs', '.tsx', '.jsx']

export function listSrcFiles(projectDir) {
  const files = []
  const walk = (dir) => {
    let entries = []
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
      const path = join(dir, entry.name)
      if (entry.isDirectory()) walk(path)
      else if (SRC_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) files.push(path)
    }
  }
  walk(join(projectDir, 'src'))
  return files
}

export function installedVersion(projectDir, dep) {
  try {
    const pkgPath = join(projectDir, 'node_modules', dep, 'package.json')
    if (!existsSync(pkgPath)) return null
    return JSON.parse(readFileSync(pkgPath, 'utf8')).version || null
  } catch {
    return null
  }
}

export function parsedPackage(projectDir) {
  const raw = read(join(projectDir, 'package.json'))
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function readText(projectDir, rel) {
  return rel ? read(join(projectDir, rel)) || '' : ''
}
