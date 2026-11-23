import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '../src')

const STATIC_IMPORT = /^\s*import\s+(?!type\b)(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]/gm

function resolveLocal(from: string, specifier: string): string | null {
  if (!specifier.startsWith('.')) return null
  const base = resolve(dirname(from), specifier)
  for (const candidate of [base, `${base}.ts`, `${base}.vue`, resolve(base, 'index.ts')]) {
    if (existsSync(candidate) && candidate.match(/\.(ts|vue)$/)) return candidate
  }
  return null
}

function staticGraph(entry: string): { files: Set<string>; bare: Set<string> } {
  const files = new Set<string>()
  const bare = new Set<string>()
  const visit = (file: string) => {
    if (files.has(file)) return
    files.add(file)
    for (const [, specifier] of readFileSync(file, 'utf8').matchAll(STATIC_IMPORT)) {
      const local = resolveLocal(file, specifier)
      if (local) visit(local)
      else bare.add(specifier)
    }
  }
  visit(entry)
  return { files, bare }
}

const relative = (files: Set<string>) => [...files].map((file) => file.slice(SRC.length + 1))

test('an example frame loads neither the catalog index nor the docs shell up front', () => {
  for (const entry of ['main.ts', 'pages/example-frame-page.vue']) {
    const { files, bare } = staticGraph(resolve(SRC, entry))
    const names = relative(files)
    assert.ok(!names.includes('lib/data.ts'), `${entry} reaches lib/data.ts: ${names.join(', ')}`)
    assert.ok(!names.includes('components/docs-shell.vue'), `${entry} reaches the docs shell`)
    assert.ok(!bare.has('virtual:docs-index'), `${entry} imports the catalog index`)
  }
})
