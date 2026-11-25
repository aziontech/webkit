import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

import { findEditorLeaks, indexGraph, pageSeeds, staticClosure } from './lib/editor-chunks.mjs'

const DIST = resolve(
  process.argv.find((arg) => arg.startsWith('--dist='))?.slice(7) ??
    join(dirname(fileURLToPath(import.meta.url)), '../dist')
)
const GRAPH = resolve(
  process.argv.find((arg) => arg.startsWith('--graph='))?.slice(8) ??
    join(DIST, '../.build/chunk-graph.json')
)
const report = process.argv.find((arg) => arg.startsWith('--report='))?.slice(9)

function pages(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return name === '_app' || name === '.vite' ? [] : pages(path)
    return name.endsWith('.html') ? [path] : []
  })
}

function routeOf(page) {
  const path = relative(DIST, page).split('\\').join('/')
  return `/${path.replace(/(?:^|\/)index\.html$/, '').replace(/\.html$/, '')}`
}

if (!existsSync(GRAPH)) {
  console.error(
    `check-editor-chunks: ${relative(process.cwd(), GRAPH)} is missing; run pnpm build:docs first`
  )
  process.exit(1)
}

const graph = JSON.parse(readFileSync(GRAPH, 'utf8'))
const routes = pages(DIST).map((page) => ({
  route: routeOf(page),
  seeds: pageSeeds(readFileSync(page, 'utf8'))
}))

if (report) {
  const byFile = indexGraph(graph)
  for (const route of report.split(',')) {
    const page = routes.find((item) => item.route === route)
    if (!page) {
      console.log(`${route}: no prerendered page`)
      continue
    }
    const files = [...staticClosure(byFile, page.seeds)].sort()
    const gzip = files.reduce(
      (sum, file) => sum + gzipSync(readFileSync(join(DIST, file))).length,
      0
    )
    const editor = files.filter((file) => byFile.get(file).editor)
    console.log(
      `${route}: ${files.length} JS files, ${(gzip / 1024).toFixed(1)} KB gzip, Monaco chunks: ${editor.join(', ') || 'none'}`
    )
  }
}

const problems = findEditorLeaks(graph, routes)
if (problems.length) {
  console.error(
    `check-editor-chunks: ${problems.length} way(s) a page loads the Monaco editor up front:`
  )
  for (const problem of problems.slice(0, 40)) console.error(`  ${problem}`)
  if (problems.length > 40) console.error(`  … and ${problems.length - 40} more`)
  console.error('Monaco must load only through import(); keep shared helpers out of its chunks.')
  process.exit(1)
}
const editors = graph.chunks.filter((chunk) => chunk.editor).length
console.log(
  `check-editor-chunks: ${routes.length} pages, ${graph.chunks.length} chunks; the ${editors} Monaco chunks load only through import()`
)
