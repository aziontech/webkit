import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const SKIP = new Set(['node_modules', 'worktrees', 'logs', '.git'])

const markdown = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (SKIP.has(entry.name)) return []
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return markdown(path)
    return entry.name.endsWith('.md') ? [path] : []
  })

const files = [
  ...['contributing', 'rules', 'skills', 'agents', 'fragments'].flatMap((dir) =>
    markdown(join(ROOT, dir))
  ),
  ...['AGENTS.md', 'CONTRIBUTING.md'].map((name) => join(ROOT, name))
]

const stripCode = (text) => text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')

test('every relative link in the contributor and consumer docs resolves to a file', () => {
  const broken = []
  for (const file of files) {
    const text = stripCode(readFileSync(file, 'utf8'))
    for (const match of text.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const target = match[1].split('#')[0]
      if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('/')) continue
      const path = resolve(dirname(file), decodeURI(target))
      if (!existsSync(path) || (target.endsWith('/') && !statSync(path).isDirectory())) {
        broken.push(`${relative(ROOT, file)} -> ${match[1]}`)
      }
    }
  }
  assert.deepEqual(broken, [])
})
