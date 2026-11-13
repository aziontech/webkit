#!/usr/bin/env node

import { createHash } from 'node:crypto'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { parseArgs } from 'node:util'

const { values } = parseArgs({
  options: {
    before: { type: 'string' },
    after: { type: 'string' },
    out: { type: 'string', default: 'baseline-review' },
    title: { type: 'string', default: 'Visual baseline review' }
  }
})

if (!values.before || !values.after) {
  process.stderr.write(
    'usage: baseline-review.mjs --before <dir> --after <dir> [--out <dir>] [--title <text>]\n'
  )
  process.exit(2)
}

const listFiles = (root) => {
  if (!existsSync(root)) return []
  const files = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry)
      if (statSync(path).isDirectory()) walk(path)
      else files.push(relative(root, path))
    }
  }
  walk(root)
  return files.sort()
}

const digest = (path) => createHash('sha256').update(readFileSync(path)).digest('hex')

const beforeFiles = new Set(listFiles(values.before))
const afterFiles = new Set(listFiles(values.after))
const names = [...new Set([...beforeFiles, ...afterFiles])].sort()

const changes = []
for (const name of names) {
  const inBefore = beforeFiles.has(name)
  const inAfter = afterFiles.has(name)
  if (inBefore && inAfter) {
    if (digest(join(values.before, name)) !== digest(join(values.after, name)))
      changes.push({ name, status: 'modified' })
  } else {
    changes.push({ name, status: inAfter ? 'added' : 'removed' })
  }
}

rmSync(values.out, { recursive: true, force: true })
mkdirSync(values.out, { recursive: true })

const copy = (fromRoot, side, name) => {
  const target = join(values.out, side, name)
  mkdirSync(dirname(target), { recursive: true })
  copyFileSync(join(fromRoot, name), target)
  return `${side}/${name}`
}

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const image = (src) =>
  src
    ? `<a href="${escapeHtml(src)}"><img src="${escapeHtml(src)}" alt="" loading="lazy"></a>`
    : '<span class="none">none</span>'

const rows = changes.map(({ name, status }) => {
  const before = status === 'added' ? '' : copy(values.before, 'before', name)
  const after = status === 'removed' ? '' : copy(values.after, 'after', name)
  return `<tr><td><code>${escapeHtml(name)}</code><br><span class="${status}">${status}</span></td><td>${image(before)}</td><td>${image(after)}</td></tr>`
})

const count = (status) => changes.filter((change) => change.status === status).length
const totals = `${count('added')} added, ${count('modified')} modified, ${count('removed')} removed`

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(values.title)}</title>
<style>
body { font: 14px/1.5 system-ui, sans-serif; margin: 16px; background: #fff; color: #111; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #ccc; padding: 8px; vertical-align: top; text-align: left; }
td:first-child { width: 20%; word-break: break-all; }
img { max-width: 100%; border: 1px solid #ddd; }
.added { color: #08660b; } .modified { color: #8a5300; } .removed { color: #b00020; } .none { color: #777; }
</style>
</head>
<body>
<h1>${escapeHtml(values.title)}</h1>
<p>${totals}. Every change must be explained by the pull request. Click an image to open it at full size.</p>
${changes.length ? `<table><thead><tr><th>Snapshot</th><th>Before (committed)</th><th>After</th></tr></thead><tbody>\n${rows.join('\n')}\n</tbody></table>` : '<p>No baseline changed.</p>'}
</body>
</html>
`

writeFileSync(join(values.out, 'index.html'), page)
writeFileSync(join(values.out, 'changes.json'), `${JSON.stringify(changes, null, 2)}\n`)

const listed = changes.slice(0, 200).map(({ name, status }) => `- ${status}: \`${name}\``)
if (changes.length > listed.length)
  listed.push(`- and ${changes.length - listed.length} more (see \`changes.json\`)`)
const summary = [`${totals}.`, '', ...listed, ''].join('\n')

writeFileSync(join(values.out, 'summary.md'), summary)
process.stdout.write(summary)
