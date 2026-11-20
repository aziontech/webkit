import assert from 'node:assert/strict'
import { test } from 'node:test'

import { isEditorModule } from '../plugins/chunk-graph.ts'
import {
  findEditorLeaks,
  indexGraph,
  pageSeeds,
  staticClosure
} from '../scripts/lib/editor-chunks.mjs'

const chunk = (
  file: string,
  editor: boolean,
  imports: string[] = [],
  dynamicImports: string[] = []
) => ({
  file,
  editor,
  foreignModules: [] as string[],
  imports,
  dynamicImports
})

const healthy = {
  version: 1,
  chunks: [
    chunk(
      '_app/app.js',
      false,
      ['_app/runtime.js'],
      ['_app/foundation-page.js', '_app/editor.api.js']
    ),
    chunk('_app/runtime.js', false),
    chunk('_app/foundation-page.js', false, ['_app/runtime.js'], ['_app/icons-view.js']),
    chunk('_app/icons-view.js', false, ['_app/foundation-page.js']),
    chunk('_app/editor.api.js', true, ['_app/vs.js']),
    chunk('_app/vs.js', true, ['_app/editor.api.js'])
  ]
}

const page = (route: string) => ({
  route,
  seeds: ['_app/app.js', '_app/foundation-page.js']
})

test('a module from monaco-editor marks its chunk as an editor chunk', () => {
  assert.ok(
    isEditorModule(
      '/repo/node_modules/.pnpm/monaco-editor@0.55.1/node_modules/monaco-editor/esm/vs/editor/editor.api.js'
    )
  )
  assert.ok(!isEditorModule('\0rolldown/runtime.js'))
  assert.ok(!isEditorModule('/repo/packages/webkit/src/components/code/code-editor/monaco.ts'))
})

test('Monaco reached only through import() passes', () => {
  assert.deepEqual(findEditorLeaks(healthy, [page('/foundations/color')]), [])
})

test('a page chunk that statically imports a Monaco chunk fails, page by page', () => {
  const broken = structuredClone(healthy)
  const foundation = broken.chunks.find((item) => item.file === '_app/foundation-page.js')!
  foundation.imports = ['_app/vs.js']
  broken.chunks.find((item) => item.file === '_app/vs.js')!.foreignModules = ['rolldown/runtime.js']
  const problems = findEditorLeaks(broken, [
    page('/foundations/color'),
    { route: '/', seeds: ['_app/app.js'] }
  ])
  assert.ok(
    problems.some(
      (line) =>
        line.includes('foundation-page.js statically imports the Monaco chunk _app/vs.js') &&
        line.includes('rolldown/runtime.js')
    )
  )
  assert.ok(problems.some((line) => line.startsWith('/foundations/color loads the Monaco chunks')))
  assert.ok(!problems.some((line) => line.startsWith('/ loads')))
})

test('a graph without Monaco chunks fails, so a broken detector cannot pass silently', () => {
  const blind = { version: 1, chunks: healthy.chunks.map((item) => ({ ...item, editor: false })) }
  assert.match(findEditorLeaks(blind, [])[0], /no Monaco chunk/)
})

test('page seeds are the module script and the module preloads', () => {
  const html =
    '<script>var a=1</script><script type="module" crossorigin src="/_app/app.js"></script>' +
    '<link rel="modulepreload" crossorigin href="/_app/foundation-page.js"><link rel="stylesheet" href="/_app/app.css">'
  assert.deepEqual(pageSeeds(html), ['_app/app.js', '_app/foundation-page.js'])
  assert.deepEqual([...staticClosure(indexGraph(healthy), pageSeeds(html))].sort(), [
    '_app/app.js',
    '_app/foundation-page.js',
    '_app/runtime.js'
  ])
})
