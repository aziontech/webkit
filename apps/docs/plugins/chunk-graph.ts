import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Plugin } from 'vite'

const CHUNK_GRAPH_FILE = '.vite/chunk-graph.json'

const BUILD_DIR = fileURLToPath(new URL('../.build', import.meta.url))
const DIST_DIR = fileURLToPath(new URL('../dist', import.meta.url))

export function moveBuildManifests(dist = DIST_DIR, buildDir = BUILD_DIR): void {
  const graph = join(dist, CHUNK_GRAPH_FILE)
  if (existsSync(graph)) {
    mkdirSync(buildDir, { recursive: true })
    renameSync(graph, join(buildDir, 'chunk-graph.json'))
  }
  rmSync(join(dist, '.vite'), { recursive: true, force: true })
}

const CLIENT_ENTRY = fileURLToPath(new URL('../src/main.ts', import.meta.url))
const RUNTIME_ANCHOR = 'virtual:docs-bundler-runtime'
const RESOLVED_RUNTIME_ANCHOR = `\0${RUNTIME_ANCHOR}`

const EDITOR_MODULE = /[\\/]node_modules[\\/]monaco-editor[\\/]/

export interface ChunkGraphEntry {
  file: string
  editor: boolean
  foreignModules: string[]
  imports: string[]
  dynamicImports: string[]
}

export interface ChunkGraph {
  version: 1
  chunks: ChunkGraphEntry[]
}

export function isEditorModule(id: string): boolean {
  return EDITOR_MODULE.test(id)
}

function shortId(id: string): string {
  const clean = id.replace(/^\0/, '')
  const at = clean.lastIndexOf('/node_modules/')
  return at === -1 ? clean.replace(/^.*?\/(apps|packages)\//, '$1/') : clean.slice(at + 14)
}

export function chunkGraphPlugin(): Plugin {
  let ssr = false
  return {
    name: 'docs-chunk-graph',
    apply: 'build',
    configResolved(config) {
      ssr = Boolean(config.build.ssr)
    },
    generateBundle(_options, bundle) {
      if (ssr || this.environment?.config.consumer === 'server') return
      const chunks: ChunkGraphEntry[] = []
      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk') continue
        const editor =
          output.moduleIds.some(isEditorModule) ||
          (output.facadeModuleId !== null && isEditorModule(output.facadeModuleId))
        chunks.push({
          file: output.fileName,
          editor,
          foreignModules: editor
            ? output.moduleIds.filter((id) => !isEditorModule(id)).map(shortId)
            : [],
          imports: output.imports,
          dynamicImports: output.dynamicImports
        })
      }
      chunks.sort((a, b) => a.file.localeCompare(b.file))
      const graph: ChunkGraph = { version: 1, chunks }
      this.emitFile({ type: 'asset', fileName: CHUNK_GRAPH_FILE, source: JSON.stringify(graph) })
    }
  }
}

export function bundlerRuntimePlugin(): Plugin {
  return {
    name: 'docs-bundler-runtime',
    apply: 'build',
    resolveId(id) {
      return id === RUNTIME_ANCHOR ? RESOLVED_RUNTIME_ANCHOR : undefined
    },
    load(id) {
      return id === RESOLVED_RUNTIME_ANCHOR ? 'export {}' : undefined
    },
    transform(code, id) {
      if (id !== CLIENT_ENTRY || this.environment?.config.consumer === 'server') return undefined
      return {
        code: `${code}\nimport * as bundlerRuntime from '${RUNTIME_ANCHOR}'\nglobalThis[Symbol.for('${RUNTIME_ANCHOR}')] = bundlerRuntime\n`,
        map: null
      }
    }
  }
}
