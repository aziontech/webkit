import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { typography } from '../../../theme/src/tokens/semantic/typography.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')

const SCANNED = ['src/components', 'blocks', 'examples']

const NOT_TYPED = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit'
])

const rem = (value) => {
  const size = typeof value === 'object' ? value._ : value
  return size?.endsWith('rem') ? parseFloat(size) : 0
}

const SIXTEEN = Object.entries(typography)
  .filter(([, style]) => rem(style.fontSize) >= 1)
  .map(([name]) => name)

const vueFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return vueFiles(path)
    return entry.name.endsWith('.vue') ? [path] : []
  })

const template = (source) => {
  const start = source.indexOf('<template')
  return start < 0 ? '' : source.slice(start)
}

const typedControls = (source) =>
  [...template(source).matchAll(/<(input|textarea|select)\b(?:[^>"']|"[^"]*"|'[^']*')*>/g)]
    .map((match) => match[0])
    .filter((tag) => {
      const type = tag.match(/\stype="([^"]*)"/)?.[1]
      if (type && NOT_TYPED.has(type)) return false
      return !/\stabindex="-1"/.test(tag)
    })

const CLASS_CONSTANT = /const ([A-Z0-9_]*CLASS)\b[^=\n]*=((?:\s*(?:'[^'\n]*'|"[^"\n]*")\s*\+?)+)/g

const classConstants = (source) =>
  new Map(
    [...source.matchAll(CLASS_CONSTANT)].map(([, name, body]) => [
      name,
      [...body.matchAll(/'([^'\n]*)'|"([^"\n]*)"/g)]
        .map(([, single, double]) => single ?? double)
        .join('')
    ])
  )

const LOCAL_IMPORT = /import\s*\{([^}]*)\}\s*from\s*'(\.[^']*)'/g

const importedClassConstants = (source, file) => {
  const constants = new Map()
  for (const [, names, spec] of source.matchAll(LOCAL_IMPORT)) {
    const base = resolve(dirname(file), spec)
    const target = [base, `${base}.ts`, `${base}.js`].find(
      (path) => /\.(ts|js)$/.test(path) && existsSync(path)
    )
    if (!target) continue
    const wanted = new Set(names.split(',').map((name) => name.trim().split(/\s+/)[0]))
    for (const [name, value] of classConstants(readFileSync(target, 'utf8')))
      if (wanted.has(name)) constants.set(name, value)
  }
  return constants
}

const classesOf = (tag, constants) => {
  const bound = tag.match(/\s:class="([^"]*)"/)?.[1] ?? ''
  const named = [...bound.matchAll(/[A-Z][A-Z0-9_]*CLASS\b/g)].map(
    ([name]) => constants.get(name) ?? ''
  )
  return [tag.match(/\sclass="([^"]*)"/)?.[1] ?? '', ...named].join(' ')
}

const sixteenOnTouch = (tag, constants) =>
  classesOf(tag, constants)
    .split(/\s+/)
    .some((token) => {
      const [utility, ...variants] = token.split(':').reverse()
      if (!SIXTEEN.includes(utility)) return false
      return variants.length === 0 || variants.at(-1) === 'pointer-coarse'
    })

test('the theme still has 16px type classes to step up to', () => {
  assert.ok(SIXTEEN.includes('text-body-md'))
  assert.ok(SIXTEEN.includes('text-label-code-lg'))
  assert.ok(!SIXTEEN.includes('text-label-sm'))
})

test('every typed native control, select and focusable read-only field steps its text up to 16px on coarse pointers', () => {
  const missing = []
  for (const dir of SCANNED) {
    for (const file of vueFiles(join(ROOT, dir))) {
      const source = readFileSync(file, 'utf8')
      const constants = new Map([
        ...importedClassConstants(source, file),
        ...classConstants(source)
      ])
      for (const tag of typedControls(source)) {
        if (!sixteenOnTouch(tag, constants))
          missing.push(`${relative(ROOT, file)}: ${tag.slice(0, 80)}`)
      }
    }
  }
  assert.deepEqual(
    missing,
    [],
    'iOS zooms the page on focus when a field is under 16px: add pointer-coarse:text-body-md (or text-label-code-lg for code) to the native control'
  )
})
