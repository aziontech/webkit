import { readFileSync, writeFileSync } from 'node:fs'

import { classOf, loadManifest } from './lib/icons-manifest.mjs'

const OUT = './docs/ICONS.md'
const manifest = loadManifest()
const cell = (text) => String(text ?? '').replace(/\|/g, '\\|')
const code = (text) => `\`${text}\``

const lines = [
  '# Icon reference',
  '',
  '> Generated from `src/icons.json` by `scripts/build-docs.mjs`. Edit the JSON, then run `npm run build`; do not edit this page by hand.',
  '',
  `${manifest.icons.length} icons in three groups. A monochrome icon is \`az az-<name>\` and takes the text colour; a colour logo is \`az-color az-<name>\` and keeps its own colours. Browse the drawings in the icons gallery (\`apps/icons-gallery\`).`,
  '',
  '## How the icons are organised',
  ''
]

for (const [groupId, group] of Object.entries(manifest.groups)) {
  const count = manifest.icons.filter((e) => e.group === groupId).length
  lines.push(`- **${group.title}** (${count}) — ${group.summary}`)
  for (const [catId, cat] of Object.entries(group.categories)) {
    const n = manifest.icons.filter((e) => e.group === groupId && e.category === catId).length
    if (n) lines.push(`  - ${cat.title} (${n}) — ${cat.summary}`)
  }
}

lines.push(
  '',
  'Pick an icon by what it stands for, not by how it looks. A product icon names only that product; for a generic idea (a database, a table, a route) use an Interface icon. Never use an External logo to stand for an Azion product.',
  ''
)

for (const [groupId, group] of Object.entries(manifest.groups)) {
  lines.push(`## ${group.title}`, '', group.summary, '')
  for (const [catId, cat] of Object.entries(group.categories)) {
    const items = manifest.icons.filter((e) => e.group === groupId && e.category === catId)
    if (!items.length) continue
    const withProduct = groupId === 'azion' && ['product', 'feature'].includes(catId)
    lines.push(`### ${group.title} · ${cat.title}`, '', cat.summary, '')
    const head = ['Class', ...(withProduct ? ['Product'] : []), 'Stands for', 'Shows', 'Notes']
    lines.push(`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`)
    for (const e of items) {
      const notes = []
      if (e.status === 'deprecated')
        notes.push(
          `Deprecated: use ${code(classOf({ ...e, name: e.replacedBy }))}. Removed in ${e.removedIn}.`
        )
      if (e.issue) notes.push(`Open: ${e.issue}`)
      const row = [
        code(classOf(e)),
        ...(withProduct ? [e.product ?? ''] : []),
        e.means,
        e.shows,
        notes.join(' ')
      ]
      lines.push(`| ${row.map(cell).join(' | ')} |`)
    }
    lines.push('')
  }
}

const renamed = manifest.icons.flatMap((e) =>
  e.legacy
    .filter((old) => old.split(' ')[1].replace(/^(ai|pi)-/, '') !== e.name)
    .map((old) => [old, e])
)
lines.push(
  '## Old names',
  '',
  'Until 6.0 the classes were `ai ai-<name>`, `ai-cor ai-<name>` and PrimeIcons `pi pi-<name>`. They are gone in 6.0: `npx @aziontech/ui migrate` rewrites every one. Where only the prefix changed, `ai` became `az` and `ai-cor` became `az-color`. These icons also changed their name:',
  '',
  '| Old class | New class | Why |',
  '| --- | --- | --- |'
)
for (const [old, e] of renamed.filter(([old]) => !old.startsWith('pi ')))
  lines.push(`| ${code(old)} | ${code(classOf(e))} | ${cell(e.renamedBecause ?? '')} |`)
lines.push(
  '',
  `PrimeIcons: ${renamed.filter(([old]) => old.startsWith('pi ')).length} \`pi pi-<name>\` classes map to an \`az\` icon; each entry lists its old class under \`legacy\` in \`src/icons.json\`.`,
  ''
)

const text = lines.join('\n')
if (process.argv.includes('--check')) {
  if (readFileSync(OUT, 'utf-8') !== text) {
    console.error(`\n🔴 ${OUT} is out of date. Run npm run build and commit it.\n`)
    process.exit(1)
  }
  console.log(`  ✔ ${OUT} is current`)
} else {
  writeFileSync(OUT, text)
  console.log(`  ✔ ${OUT} written`)
}
