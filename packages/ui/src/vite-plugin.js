import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import {
  appSourceFiles,
  azionUiSubpaths,
  isAppSource,
  planSources,
  SOURCES_FILE,
  writeSources
} from './cli/css-sources.js'

/**
 * @typedef {object} AzionUiPluginOptions
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

const union = (state) => [...new Set([...state.byFile.values()].flat())].sort()

const sync = (state, force = false) => {
  const subpaths = union(state)
  const next = subpaths.join('\n')
  if (!force && next === state.key) return
  state.key = next
  writeSources(planSources(state.root, { file: state.file, subpaths }))
}

const index = (state) => {
  const files = appSourceFiles(state.root)
  const present = new Set(files)
  for (const f of [...state.byFile.keys()]) if (!present.has(f)) state.byFile.delete(f)
  for (const f of files) {
    const text = read(f)
    if (text === null) continue
    const next = azionUiSubpaths(text)
    if (text.trim() === '' && state.byFile.get(f)?.length) continue
    state.byFile.set(f, next)
  }
}

const schedule = (state, abs, task) => {
  clearTimeout(state.timers.get(abs))
  state.timers.set(
    abs,
    setTimeout(() => {
      state.timers.delete(abs)
      task()
    }, state.settle)
  )
}

const settleFile = (state, abs, confirm = null) => {
  const text = read(abs)
  const prev = state.byFile.get(abs) ?? []
  if (text === null) {
    if (confirm === null) return schedule(state, abs, () => settleFile(state, abs, 'missing'))
    if (confirm === 'missing' && state.byFile.delete(abs)) sync(state)
    return
  }
  const next = azionUiSubpaths(text)
  const shrinks = drops(prev, next)
  if (shrinks && text !== confirm) return schedule(state, abs, () => settleFile(state, abs, text))
  state.byFile.set(abs, next)
  sync(state)
}

const watchers = (state) => ({
  onChange(path) {
    const abs = resolve(path)
    if (!isAppSource(state.root, abs)) return
    schedule(state, abs, () => settleFile(state, abs))
  },
  onUnlink(path) {
    const abs = resolve(path)
    if (!state.byFile.has(abs)) return
    schedule(state, abs, () => settleFile(state, abs))
  }
})

/**
 * @param {AzionUiPluginOptions} [options]
 * @returns {import('vite').Plugin}
 */
export default function azionUi(options = {}) {
  const state = {
    file: options.file ?? SOURCES_FILE,
    settle: options.settle ?? 80,
    root: process.cwd(),
    byFile: new Map(),
    timers: new Map(),
    key: null
  }
  const { onChange, onUnlink } = watchers(state)

  return {
    name: '@aziontech/ui',
    enforce: 'pre',
    configResolved(config) {
      state.root = config.root
      index(state)
      sync(state, true)
    },
    buildStart() {
      index(state)
      sync(state)
    },
    configureServer(server) {
      server.watcher.on('add', onChange)
      server.watcher.on('change', onChange)
      server.watcher.on('unlink', onUnlink)
    },
    buildEnd() {
      for (const timer of state.timers.values()) clearTimeout(timer)
      state.timers.clear()
    }
  }
}
