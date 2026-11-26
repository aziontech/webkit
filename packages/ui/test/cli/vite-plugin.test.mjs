import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

import { SOURCES_FILE } from '../../src/cli/css-sources.js'
import webkit from '../../src/vite-plugin.js'

const SETTLE = 30

function put(dir, rel, content) {
  const path = join(dir, rel)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
}

function makeApp() {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-vite-plugin-'))
  put(dir, 'package.json', JSON.stringify({ name: 'app', version: '1.0.0' }))
  const pkg = 'node_modules/@aziontech/webkit'
  put(
    dir,
    `${pkg}/package.json`,
    JSON.stringify({
      name: '@aziontech/webkit',
      exports: {
        './button': './src/components/action/button/button.vue',
        './dialog': './src/components/overlay/dialog/dialog.vue'
      }
    })
  )
  put(dir, `${pkg}/src/components/action/button/button.vue`, '<template><b /></template>\n')
  put(dir, `${pkg}/src/components/overlay/dialog/dialog.vue`, '<template><i /></template>\n')
  return dir
}

const PAGE = "<script setup>\nimport Button from '@aziontech/webkit/button'\n</script>\n"
const BOTH =
  "<script setup>\nimport Button from '@aziontech/webkit/button'\nimport Dialog from '@aziontech/webkit/dialog'\n</script>\n"

function start(dir) {
  const plugin = webkit({ settle: SETTLE })
  const watcher = new EventEmitter()
  plugin.configResolved({ root: dir })
  plugin.configureServer({ watcher })
  return { plugin, watcher }
}

const sources = (dir) => readFileSync(join(dir, SOURCES_FILE), 'utf8')
const page = (dir) => join(dir, 'src/page.vue')

test('a read of a file mid-write (empty) does not drop its components', async () => {
  const dir = makeApp()
  try {
    put(dir, 'src/page.vue', PAGE)
    const { plugin, watcher } = start(dir)
    assert.match(sources(dir), /button\.vue/)
    writeFileSync(page(dir), '')
    watcher.emit('change', page(dir))
    await sleep(SETTLE * 1.5)
    assert.match(sources(dir), /button\.vue/)
    writeFileSync(page(dir), PAGE)
    await sleep(SETTLE * 3)
    assert.match(sources(dir), /button\.vue/)
    plugin.buildEnd()
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a partial write that cuts an import keeps the list until the file settles', async () => {
  const dir = makeApp()
  try {
    put(dir, 'src/page.vue', BOTH)
    const { plugin, watcher } = start(dir)
    writeFileSync(page(dir), BOTH.slice(0, 60))
    watcher.emit('change', page(dir))
    await sleep(SETTLE * 1.5)
    assert.match(sources(dir), /dialog\.vue/)
    writeFileSync(page(dir), BOTH)
    await sleep(SETTLE * 3)
    assert.match(sources(dir), /dialog\.vue/)
    assert.match(sources(dir), /button\.vue/)
    plugin.buildEnd()
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a removed import shrinks the list once the file reads the same twice', async () => {
  const dir = makeApp()
  try {
    put(dir, 'src/page.vue', BOTH)
    const { watcher } = start(dir)
    writeFileSync(page(dir), PAGE)
    watcher.emit('change', page(dir))
    await sleep(SETTLE * 4)
    assert.doesNotMatch(sources(dir), /dialog\.vue/)
    assert.match(sources(dir), /button\.vue/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a new import grows the list after the next change', async () => {
  const dir = makeApp()
  try {
    put(dir, 'src/page.vue', PAGE)
    const { watcher } = start(dir)
    writeFileSync(page(dir), BOTH)
    watcher.emit('change', page(dir))
    await sleep(SETTLE * 2)
    assert.match(sources(dir), /dialog\.vue/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('an atomic rename (unlink then add) keeps the components', async () => {
  const dir = makeApp()
  try {
    put(dir, 'src/page.vue', PAGE)
    const { watcher } = start(dir)
    unlinkSync(page(dir))
    watcher.emit('unlink', page(dir))
    await sleep(SETTLE / 3)
    writeFileSync(page(dir), PAGE)
    watcher.emit('add', page(dir))
    await sleep(SETTLE * 3)
    assert.match(sources(dir), /button\.vue/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a deleted file leaves the list once it stays gone', async () => {
  const dir = makeApp()
  try {
    put(dir, 'src/page.vue', PAGE)
    const { watcher } = start(dir)
    unlinkSync(page(dir))
    watcher.emit('unlink', page(dir))
    await sleep(SETTLE * 4)
    assert.doesNotMatch(sources(dir), /button\.vue/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('build start re-scans the whole app and corrects a missed change', () => {
  const dir = makeApp()
  try {
    put(dir, 'src/page.vue', PAGE)
    const { plugin } = start(dir)
    put(
      dir,
      'src/other.vue',
      "<script setup>\nimport D from '@aziontech/webkit/dialog'\n</script>\n"
    )
    assert.doesNotMatch(sources(dir), /dialog\.vue/)
    plugin.buildStart()
    assert.match(sources(dir), /dialog\.vue/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
