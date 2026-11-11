import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadCatalogFrom } from '../mcp/catalog.js'

export const PACKAGE_NAME = '@aziontech/webkit'
export const OWN_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

function installedRoot(projectDir) {
  try {
    const require = createRequire(join(projectDir, '__webkit_resolve__.js'))
    return dirname(require.resolve(`${PACKAGE_NAME}/package.json`))
  } catch {
    return null
  }
}

function exportSet(pkg) {
  return new Set(Object.keys(pkg?.exports || {}).map((key) => key.replace(/^\.\/?/, '')))
}

export function resolveWebkit(projectDir) {
  const installed = installedRoot(projectDir)
  const installedPkg = installed ? readJson(join(installed, 'package.json')) : null
  const root = installed && existsSync(join(installed, 'blocks')) ? installed : OWN_ROOT
  const pkg = readJson(join(root, 'package.json')) || {}
  return {
    root,
    version: pkg.version || null,
    installed: Boolean(installed),
    installedVersion: installedPkg?.version || null,
    fromInstalled: root === installed,
    exports: exportSet(installedPkg || pkg)
  }
}

export function catalogFor(webkit) {
  const path = join(webkit.root, 'catalog.json')
  if (!existsSync(path)) {
    throw new Error(`${PACKAGE_NAME}@${webkit.version} ships no catalog.json at ${path}`)
  }
  return loadCatalogFrom(path)
}
