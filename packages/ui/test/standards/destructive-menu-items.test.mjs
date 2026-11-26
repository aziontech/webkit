import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const ITEMS =
  /<(DropdownMenu\.Item|DropdownMenuItem|ContextMenu\.Item|ContextMenuItem)\b([^>]*?)(\/?)>/gs
const DESTRUCTIVE = /\b(delete|remove|revoke|cancel invitation)\b/i
const DATA_ITEM = /\{[^{}]*\blabel: '(Delete|Remove|Revoke)\b[^']*'[^{}]*\}/g

function vueFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return vueFiles(path)
    return entry.name.endsWith('.vue') ? [path] : []
  })
}

const files = () => [...vueFiles(join(ROOT, 'blocks')), ...vueFiles(join(ROOT, 'examples'))]
const lineOf = (source, index) => source.slice(0, index).split('\n').length

test('a destructive menu item in a block or example is marked severity="danger"', () => {
  const unmarked = []
  for (const file of files()) {
    const source = readFileSync(file, 'utf8')
    for (const match of source.matchAll(ITEMS)) {
      const [, tag, attributes, selfClosing] = match
      if (/\bseverity=/.test(attributes)) continue
      const end = selfClosing ? match.index : source.indexOf(`</${tag}`, match.index)
      const text = `${attributes} ${source.slice(match.index + match[0].length, end).replace(/<[^>]+>/g, '')}`
      if (!DESTRUCTIVE.test(text)) continue
      unmarked.push(`${relative(ROOT, file)}:${lineOf(source, match.index)}`)
    }
  }
  assert.deepEqual(unmarked, [], 'add severity="danger" to each destructive menu item')
})

test('a destructive item in a menu built from data carries severity danger', () => {
  const unmarked = []
  for (const file of files()) {
    const source = readFileSync(file, 'utf8')
    if (!/DropdownMenu|ContextMenu/.test(source)) continue
    for (const match of source.matchAll(DATA_ITEM)) {
      if (/\bseverity: 'danger'/.test(match[0])) continue
      unmarked.push(`${relative(ROOT, file)}:${lineOf(source, match.index)}`)
    }
  }
  assert.deepEqual(unmarked, [], "add severity: 'danger' to each destructive menu entry")
})
