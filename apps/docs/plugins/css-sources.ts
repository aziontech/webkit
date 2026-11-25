import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Plugin } from 'vite'

import { readBlocks, REPO, walk, WEBKIT } from './paths.ts'

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const CSS_DIR = join(APP, '.build/css')
export const DOCS_SOURCES = join(CSS_DIR, 'docs.css')
const SRC = join(APP, 'src')
const EXAMPLES_DIR = join(WEBKIT, 'examples')
const BLOCKS_DIR = join(WEBKIT, 'blocks')
const FRAME_PAGES = {
  examples: join(SRC, 'pages/example-frame-page.vue'),
  blocks: join(SRC, 'pages/block-frame-page.vue')
}
const FRAME_STYLES = 'virtual:docs-frame-styles'

const CODE = /\.(vue|[cm]?[jt]s)$/
const TEST = /\.(test|spec)\.[cm]?[jt]s$/
const SPECIFIER = /(?:\bfrom|\bimport)\s*\(?\s*['"]([^'"\n]+)['"]/g
const SUFFIXES = ['', '.vue', '.ts', '.js', '.mjs', '/index.ts', '/index.js']
const PACKAGE = '@aziontech/webkit/'

const UTILITIES_HEADER = [
  "@import 'tailwindcss/utilities' source(none);",
  "@reference '@aziontech/theme';",
  "@import '@aziontech/icons/azionicons-color-utilities';"
]

type ExportEntry = string | { default?: string; import?: string } | null
export type FrameKind = keyof typeof FRAME_PAGES

let exportsCache: Record<string, ExportEntry> | null = null

function webkitExports(): Record<string, ExportEntry> {
  exportsCache ??= (
    JSON.parse(readFileSync(join(WEBKIT, 'package.json'), 'utf8')) as {
      exports: Record<string, ExportEntry>
    }
  ).exports
  return exportsCache
}

const isFile = (path: string) => existsSync(path) && statSync(path).isFile()

function fromExport(subpath: string): string | null {
  const entry = webkitExports()[`./${subpath}`]
  const target = typeof entry === 'string' ? entry : (entry?.default ?? entry?.import)
  return target ? join(WEBKIT, target) : null
}

function fromRelative(base: string, specifier: string): string | null {
  for (const suffix of SUFFIXES) {
    const candidate = resolve(base, `${specifier}${suffix}`)
    if (isFile(candidate)) return candidate
  }
  return null
}

export function sourceClosure(entries: string[]): string[] {
  const seen = new Set<string>()
  const queue: string[] = []
  const add = (file: string | null) => {
    if (!file || seen.has(file) || !CODE.test(file) || TEST.test(file)) return
    if (!file.startsWith(REPO + sep) || file.includes(`${sep}node_modules${sep}`)) return
    seen.add(file)
    queue.push(file)
  }
  for (const entry of entries) add(entry)
  while (queue.length) {
    const file = queue.pop() as string
    for (const [, raw] of readFileSync(file, 'utf8').matchAll(SPECIFIER)) {
      const specifier = raw.split('?')[0]
      if (specifier.startsWith('.')) add(fromRelative(dirname(file), specifier))
      else if (specifier.startsWith(PACKAGE)) add(fromExport(specifier.slice(PACKAGE.length)))
    }
  }
  return [...seen].sort()
}

function sourceLines(cssFile: string, files: string[]): string[] {
  return files.map((file) => `@source '${relative(dirname(cssFile), file).split(sep).join('/')}';`)
}

function write(file: string, content: string) {
  if (existsSync(file) && readFileSync(file, 'utf8') === content) return
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

export function writeDocsSources(): void {
  const files = sourceClosure(walk(SRC, (name) => CODE.test(name))).filter(
    (path) => !path.startsWith(SRC + sep)
  )
  write(DOCS_SOURCES, [...sourceLines(DOCS_SOURCES, files), ''].join('\n'))
}

export const frameStylesheet = (kind: FrameKind, dir: string) =>
  join(CSS_DIR, 'frames', kind, `${dir}.css`)

export function writeFrameStyles(kind: FrameKind, dir: string): string {
  const root = join(kind === 'examples' ? EXAMPLES_DIR : BLOCKS_DIR, dir)
  const css = frameStylesheet(kind, dir)
  const entries = [FRAME_PAGES[kind], ...walk(root, (name) => name.endsWith('.vue'))]
  const files = sourceClosure(entries).filter((path) => !path.startsWith(root + sep))
  write(css, [...UTILITIES_HEADER, ...sourceLines(css, [root, ...files]), ''].join('\n'))
  const wrapper = css.replace(/\.css$/, '.vue')
  const stylesheet = `./${dir.split('/').at(-1)}.css`
  write(
    wrapper,
    `<script setup lang="ts">\nimport ${JSON.stringify(stylesheet)}\n</script>\n\n<template><slot /></template>\n`
  )
  return wrapper
}

export function frameGroups(): [FrameKind, string][] {
  const examples = walk(EXAMPLES_DIR, (name) => name === 'examples.json').map(
    (file) => ['examples', relative(EXAMPLES_DIR, dirname(file))] as [FrameKind, string]
  )
  const blocks = readBlocks().map((block) => ['blocks', block.dir] as [FrameKind, string])
  return [...examples, ...blocks]
}

export function cssSourcesPlugin(): Plugin {
  return {
    name: 'docs-css-sources',
    enforce: 'pre',
    resolveId(id) {
      return id === FRAME_STYLES ? `\0${id}` : null
    },
    load(id) {
      if (id !== `\0${FRAME_STYLES}`) return null
      const entries = frameGroups().map(
        ([kind, dir]) =>
          `  ${JSON.stringify(`${kind}/${dir}`)}: () => import(${JSON.stringify(writeFrameStyles(kind, dir))}).then((m) => m.default)`
      )
      return `export default {\n${entries.join(',\n')}\n}`
    }
  }
}
