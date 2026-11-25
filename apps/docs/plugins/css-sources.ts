import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Plugin } from 'vite'

import { readBlocks, REPO, walk, WEBKIT } from './paths.ts'

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const CSS_DIR = join(APP, '.build/css')
export const DOCS_SOURCES = join(CSS_DIR, 'docs.css')
const EXAMPLES_DIR = join(WEBKIT, 'examples')
const BLOCKS_DIR = join(WEBKIT, 'blocks')

const CODE = /\.(vue|[cm]?[jt]s)$/
const TEST = /\.(test|spec)\.[cm]?[jt]s$/
const SPECIFIER = /(?:\bfrom|\bimport)\s*\(?\s*['"]([^'"\n]+)['"]/g
const SUFFIXES = ['', '.vue', '.ts', '.js', '.mjs', '/index.ts', '/index.js']
const PACKAGE = '@aziontech/webkit/'

const GROUP_HEADER = [
  "@import 'tailwindcss/utilities' source(none);",
  "@reference '@aziontech/theme';",
  "@import '@aziontech/icons/azionicons-color-utilities';"
]

type ExportEntry = string | { default?: string; import?: string } | null

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

export const exampleSourcesFile = (dir: string) => join(CSS_DIR, 'examples', `${dir}.css`)
export const blockSourcesFile = (dir: string) => join(CSS_DIR, 'blocks', `${dir}.css`)

function groupCss(file: string, root: string, entries: string[]): string {
  const files = sourceClosure(entries).filter((path) => !path.startsWith(root + sep))
  return [...GROUP_HEADER, ...sourceLines(file, [root, ...files]), ''].join('\n')
}

export function writeDocsSources(): void {
  const entries = walk(join(APP, 'src'), (name) => CODE.test(name))
  const files = sourceClosure(entries).filter((path) => !path.startsWith(join(APP, 'src') + sep))
  write(DOCS_SOURCES, [...sourceLines(DOCS_SOURCES, files), ''].join('\n'))
}

export function writeExampleSources(dir: string): string {
  const root = join(EXAMPLES_DIR, dir)
  const file = exampleSourcesFile(dir)
  write(
    file,
    groupCss(
      file,
      root,
      walk(root, (name) => name.endsWith('.vue'))
    )
  )
  return file
}

export function writeBlockSources(dir: string): string {
  const root = join(BLOCKS_DIR, dir)
  const file = blockSourcesFile(dir)
  write(
    file,
    groupCss(
      file,
      root,
      walk(root, (name) => name.endsWith('.vue'))
    )
  )
  return file
}

function groupOf(id: string): { kind: 'examples' | 'blocks'; dir: string } | null {
  if (id.includes('?') || !id.endsWith('.vue')) return null
  if (id.startsWith(EXAMPLES_DIR + sep)) {
    const dir = relative(EXAMPLES_DIR, dirname(id))
    return isFile(join(EXAMPLES_DIR, dir, 'examples.json')) ? { kind: 'examples', dir } : null
  }
  if (id.startsWith(BLOCKS_DIR + sep)) {
    const block = readBlocks().find((entry) => id.startsWith(join(BLOCKS_DIR, entry.dir) + sep))
    return block ? { kind: 'blocks', dir: block.dir } : null
  }
  return null
}

export function cssSourcesPlugin(): Plugin {
  return {
    name: 'docs-css-sources',
    enforce: 'post',
    transform(code, id) {
      const group = groupOf(id)
      if (!group) return null
      const file =
        group.kind === 'examples' ? writeExampleSources(group.dir) : writeBlockSources(group.dir)
      return { code: `import ${JSON.stringify(file)}\n${code}`, map: null }
    }
  }
}
