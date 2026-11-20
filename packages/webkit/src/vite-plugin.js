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
 * @property {number} [settle]
 */

const read = (file) => {
  try {
    return readFileSync(file, 'utf8')
  } catch {
    return null
  }
}

const drops = (prev, next) => prev.some((sub) => !next.includes(sub))

/**
 * @param {WebkitPluginOptions} [options]
 * @returns {import('vite').Plugin}
 */
export default function webkit(options = {}) {
  const file = options.file ?? SOURCES_FILE
  const settle = options.settle ?? 80
  let root = process.cwd()
  const byFile = new Map()
  const timers = new Map()
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
    const files = appSourceFiles(root)
    const present = new Set(files)
    for (const f of [...byFile.keys()]) if (!present.has(f)) byFile.delete(f)
    for (const f of files) {
      const text = read(f)
      if (text === null) continue
      const next = webkitSubpaths(text)
      if (text.trim() === '' && byFile.get(f)?.length) continue
      byFile.set(f, next)
    }
  }
  const schedule = (abs, task) => {
    clearTimeout(timers.get(abs))
    timers.set(
      abs,
      setTimeout(() => {
        timers.delete(abs)
        task()
      }, settle)
    )
  }
  const settleFile = (abs, confirm = null) => {
    const text = read(abs)
    const prev = byFile.get(abs) ?? []
    if (text === null) {
      if (confirm === null) return schedule(abs, () => settleFile(abs, 'missing'))
      if (confirm === 'missing' && byFile.delete(abs)) sync()
      return
    }
    const next = webkitSubpaths(text)
    const shrinks = drops(prev, next)
    if (shrinks && text !== confirm) return schedule(abs, () => settleFile(abs, text))
    byFile.set(abs, next)
    sync()
  }
  const onChange = (path) => {
    const abs = resolve(path)
    if (!isAppSource(root, abs)) return
    schedule(abs, () => settleFile(abs))
  }
  const onUnlink = (path) => {
    const abs = resolve(path)
    if (!byFile.has(abs)) return
    schedule(abs, () => settleFile(abs))
  }

  return {
    name: '@aziontech/webkit',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
      index()
      sync(true)
    },
    buildStart() {
      index()
      sync()
    },
    configureServer(server) {
      server.watcher.on('add', onChange)
      server.watcher.on('change', onChange)
      server.watcher.on('unlink', onUnlink)
    },
    buildEnd() {
      for (const timer of timers.values()) clearTimeout(timer)
      timers.clear()
    }
  }
}
