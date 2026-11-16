import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import {
  appSourceFiles,
  isAppSource,
  planSources,
  SOURCES_FILE,
  webkitSubpaths,
  writeSources
} from './cli/css-sources.js'

/**
 * @typedef {object} WebkitPluginOptions
 * @property {string} [file]
 */

const readText = (file) => {
  try {
    return readFileSync(file, 'utf8')
  } catch {
    return ''
  }
}

/**
 * @param {WebkitPluginOptions} [options]
 * @returns {import('vite').Plugin}
 */
export default function webkit(options = {}) {
  const file = options.file ?? SOURCES_FILE
  let root = process.cwd()
  const byFile = new Map()
  let key = null

  const union = () => [...new Set([...byFile.values()].flat())].sort()
  const sync = (force = false) => {
    const subpaths = union()
    const next = subpaths.join('\n')
    if (!force && next === key) return
    key = next
    writeSources(planSources(root, { file, subpaths }))
  }
  const index = () => {
    byFile.clear()
    for (const f of appSourceFiles(root)) byFile.set(f, webkitSubpaths(readText(f)))
  }
  const onChange = (path) => {
    const abs = resolve(path)
    if (!isAppSource(root, abs)) return
    byFile.set(abs, webkitSubpaths(readText(abs)))
    sync()
  }
  const onUnlink = (path) => {
    const abs = resolve(path)
    if (!byFile.delete(abs)) return
    sync()
  }

  return {
    name: '@aziontech/webkit',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
      index()
      sync(true)
    },
    configureServer(server) {
      server.watcher.on('add', onChange)
      server.watcher.on('change', onChange)
      server.watcher.on('unlink', onUnlink)
    }
  }
}
