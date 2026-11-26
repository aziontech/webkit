import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'vue/compiler-sfc'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const ERROR_FILE =
  /(\/variants\/[^/]*(error|fail|forbidden|maintenance|rate-limited|not-found|expired)[^/]*\.vue$)|\/state-(edge-)?error-page\//
const BUTTONS = new Set(['Button', 'SplitButton'])

function vueFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return vueFiles(path)
    return entry.name.endsWith('.vue') && !entry.name.includes('.test.') ? [path] : []
  })
}

const files = () => [
  ...vueFiles(join(ROOT, 'blocks')),
  ...vueFiles(join(ROOT, 'examples')),
  ...vueFiles(join(ROOT, 'src/components'))
]

const attribute = (node, name) => {
  const prop = node.props?.find(
    (p) =>
      (p.type === 6 && p.name === name) ||
      (p.type === 7 && p.name === 'bind' && p.arg?.content === name)
  )
  if (!prop) return null
  return prop.type === 6 ? (prop.value?.content ?? '') : (prop.exp?.content ?? '')
}

const isErrorSurface = (node) => {
  if (node.type !== 1) return false
  if (node.tag === 'ErrorBoundary') return true
  const severity = attribute(node, 'severity')
  return /^(Alert|Toast)$/.test(node.tag) && severity !== null && /danger/.test(severity)
}

function primaryButtons(file) {
  const { descriptor } = parse(readFileSync(file, 'utf8'), { filename: file })
  if (!descriptor.template) return []
  const found = []
  const errorFile = ERROR_FILE.test(file)
  const visit = (node, inError) => {
    if (!node) return
    const error = inError || isErrorSurface(node)
    if (node.type === 1 && BUTTONS.has(node.tag) && error) {
      const variant = attribute(node, 'variant')
      if (variant === null || /primary/.test(variant)) {
        found.push(`${relative(ROOT, file)}:${node.loc.start.line}`)
      }
    }
    for (const child of node.children ?? []) visit(child, error)
    for (const branch of node.branches ?? []) visit(branch, error)
  }
  visit(descriptor.template.ast, errorFile)
  return found
}

test('an error never carries a primary button', () => {
  const offenders = files().flatMap(primaryButtons)
  assert.deepEqual(
    offenders,
    [],
    'use variant="secondary" for the recovery action of an error (skills/webkit-errors, ERR-2)'
  )
})
