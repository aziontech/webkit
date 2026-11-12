import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

import { nonLayoutClasses } from '../../src/eslint-plugin/layout-classes.js'
import { PKG_ROOT } from './_helpers/cli-project.mjs'

const REPO_ROOT = join(PKG_ROOT, '..', '..')
const THEME_ROOT = join(PKG_ROOT, '..', 'theme')

function markdownFiles(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) markdownFiles(path, out)
    else if (name.endsWith('.md')) out.push(path)
  }
  return out
}

const SHIPPED_DOCS = [
  ...['skills', 'rules', 'adapters'].flatMap((dir) => markdownFiles(join(REPO_ROOT, dir))),
  join(PKG_ROOT, 'README.md'),
  ...markdownFiles(join(PKG_ROOT, 'docs', 'toolkit'))
]

const COUNTER_EXAMPLE_HEADING = /\b(wrong|don'?t|do not|never|incorrect|anti-?pattern)\b/i

function exampleBlocks(text) {
  const blocks = []
  let heading = ''
  let fence = null
  let start = 0
  const lines = text.split('\n')
  lines.forEach((line, index) => {
    if (fence === null && /^#{1,6}\s/.test(line)) heading = line
    const marker = line.match(/^\s*(```+|~~~+)/)?.[1]
    if (!marker) return
    if (fence === null) {
      fence = marker
      start = index + 1
    } else if (marker.startsWith(fence)) {
      if (!COUNTER_EXAMPLE_HEADING.test(heading)) {
        blocks.push({ line: start + 1, code: lines.slice(start, index).join('\n') })
      }
      fence = null
    }
  })
  return blocks
}

const catalog = JSON.parse(readFileSync(join(PKG_ROOT, 'catalog.json'), 'utf8'))
const pascal = (subpath) =>
  subpath
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')
const WEBKIT_TAGS = new Set(Object.keys(catalog.imports).map(pascal))
const STYLE_SEAM_TAGS = new Set(
  Object.entries(catalog.imports)
    .filter(([, entry]) => entry.styleSeam)
    .map(([subpath]) => pascal(subpath))
)

const LOOK_CLASS =
  /^(?:[\w-]+:)*-?(?:bg|text|border|ring|outline|fill|stroke|shadow|rounded|font|from|via|to|divide|decoration|accent|caret|opacity)-|\(--|var\(--|#[0-9a-f]{3,8}\b/i

test('no shipped example restyles a webkit component with colour or token classes', () => {
  const offenders = []
  for (const file of SHIPPED_DOCS) {
    for (const block of exampleBlocks(readFileSync(file, 'utf8'))) {
      for (const match of block.code.matchAll(
        /<([A-Z][A-Za-z]*)(?:\.[A-Z][A-Za-z]*)?\b([^<>]*?)\/?>/g
      )) {
        const [, tag, attrs] = match
        if (!WEBKIT_TAGS.has(tag) || STYLE_SEAM_TAGS.has(tag)) continue
        const classes = attrs.match(/(?:^|\s)class="([^"]*)"/)?.[1]
        if (!classes) continue
        const look = nonLayoutClasses(classes).filter((cls) => LOOK_CLASS.test(cls))
        if (look.length) {
          const line = block.line + block.code.slice(0, match.index).split('\n').length - 1
          offenders.push(`${relative(REPO_ROOT, file)}:${line} <${tag} class="${look.join(' ')}">`)
        }
      }
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `restyled webkit components in shipped examples:\n${offenders.join('\n')}`
  )
})

test('every @aziontech/theme subpath the shipped docs import is a real theme export', () => {
  const exportsMap = JSON.parse(readFileSync(join(THEME_ROOT, 'package.json'), 'utf8')).exports
  const missing = []
  for (const file of SHIPPED_DOCS) {
    for (const [, subpath] of readFileSync(file, 'utf8').matchAll(
      /['"`]@aziontech\/theme\/([\w./-]+)['"`]/g
    )) {
      if (!(`./${subpath}` in exportsMap)) missing.push(`${relative(REPO_ROOT, file)}: ${subpath}`)
    }
  }
  assert.deepEqual(missing, [])
})

test('the README and the webkit-usage skill say how to force the dark theme', () => {
  for (const file of [
    join(PKG_ROOT, 'README.md'),
    join(REPO_ROOT, 'skills/webkit-usage/SKILL.md')
  ]) {
    const text = readFileSync(file, 'utf8')
    assert.match(
      text,
      /<html[^>]*data-theme="dark"/,
      `${relative(REPO_ROOT, file)} has no dark opt-in`
    )
    assert.match(
      text,
      /light by default/i,
      `${relative(REPO_ROOT, file)} does not say light is the default`
    )
  }
})
