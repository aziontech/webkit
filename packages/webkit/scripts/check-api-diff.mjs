#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { literalValues, loadMigrations, renamedSubpath, ruleOf } from './check-migrations.mjs'
import { REPO_ROOT, listAtBase, resolveBase, showAtBase } from './lib/base-ref.mjs'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const COMPONENT_KINDS = new Set(['component', 'root', 'subcomponent'])
const MODEL_DOC = /^Two-way value \(`v-model/
const MIGRATION_DOC = /^MIGRATION-v\d+\.md$/

const norm = (value) =>
  String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
const isRequired = (value) => norm(value) === 'true'

export function pascal(subpath) {
  return subpath
    .split('/')
    .pop()
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

export function surfaceFromCatalog(catalog) {
  const imports = catalog.imports || {}
  const hasModels = Object.values(imports).some((entry) => Array.isArray(entry.models))
  const components = {}
  for (const [subpath, entry] of Object.entries(imports)) {
    if (!COMPONENT_KINDS.has(entry.kind)) continue
    const props = {}
    for (const prop of entry.props || []) {
      if (!prop?.name || MODEL_DOC.test(prop.doc || '')) continue
      props[prop.name] = {
        type: norm(prop.type),
        default: norm(prop.default),
        required: isRequired(prop.required)
      }
    }
    components[subpath] = {
      props,
      events: Object.fromEntries((entry.events || []).map((e) => [e.name, norm(e.payload)])),
      slots: Object.fromEntries((entry.slots || []).map((s) => [s.name, norm(s.scope)])),
      models: hasModels ? [...(entry.models || [])].sort() : null,
      subcomponents: [...(entry.subcomponents || [])].sort(),
      specs: [subpath, entry.rootOf, entry.parent].filter(Boolean)
    }
  }
  return { exports: Object.keys(imports).sort(), components }
}

const change = (subpath, area, name, kind, breaking, detail) => ({
  subpath,
  area,
  name,
  kind,
  breaking,
  detail
})

function diffKeyed(subpath, area, before, after, compare) {
  const out = []
  for (const [name, value] of Object.entries(before)) {
    if (!(name in after)) out.push(change(subpath, area, name, 'removed', true, ''))
    else out.push(...compare(name, value, after[name]))
  }
  for (const name of Object.keys(after)) {
    if (!(name in before)) out.push(change(subpath, area, name, 'added', false, ''))
  }
  return out
}

function diffProp(subpath, name, before, after) {
  const out = []
  if (before.type !== after.type) {
    const was = literalValues(before.type)
    const now = literalValues(after.type)
    if (was && now) {
      const lost = was.filter((v) => !now.includes(v))
      const gained = now.filter((v) => !was.includes(v))
      if (lost.length) {
        out.push(
          change(
            subpath,
            'prop',
            name,
            'type narrowed',
            true,
            `drops ${lost.map((v) => `'${v}'`).join(', ')}`
          )
        )
      }
      if (gained.length) {
        out.push(
          change(
            subpath,
            'prop',
            name,
            'type widened',
            false,
            `adds ${gained.map((v) => `'${v}'`).join(', ')}`
          )
        )
      }
    } else {
      out.push(
        change(subpath, 'prop', name, 'type changed', true, `${before.type} → ${after.type}`)
      )
    }
  }
  if (before.default !== after.default && !(before.required && !after.required)) {
    out.push(
      change(subpath, 'prop', name, 'default changed', true, `${before.default} → ${after.default}`)
    )
  }
  if (before.required !== after.required) {
    out.push(
      after.required
        ? change(subpath, 'prop', name, 'optional → required', true, '')
        : change(subpath, 'prop', name, 'required → optional', false, '')
    )
  }
  return out
}

const valueChange = (subpath, area, kind) => (name, before, after) =>
  before === after ? [] : [change(subpath, area, name, kind, true, `${before} → ${after}`)]

const asKeys = (list) => Object.fromEntries((list || []).map((name) => [name, true]))

export function diffSurface(base, head) {
  const changes = []
  const headExports = new Set(head.exports)
  const baseExports = new Set(base.exports)
  for (const subpath of base.exports) {
    if (!headExports.has(subpath))
      changes.push(change(subpath, 'export', subpath, 'removed', true, ''))
  }
  for (const subpath of head.exports) {
    if (!baseExports.has(subpath))
      changes.push(change(subpath, 'export', subpath, 'added', false, ''))
  }
  for (const [subpath, before] of Object.entries(base.components)) {
    const after = head.components[subpath]
    if (!after) continue
    const props = diffKeyed(subpath, 'prop', before.props, after.props, (name, b, a) =>
      diffProp(subpath, name, b, a)
    )
    for (const c of props) {
      if (c.kind === 'added' && after.props[c.name].required) {
        Object.assign(c, { kind: 'added required', breaking: true })
      }
    }
    changes.push(
      ...props,
      ...diffKeyed(
        subpath,
        'event',
        before.events,
        after.events,
        valueChange(subpath, 'event', 'payload changed')
      ),
      ...diffKeyed(
        subpath,
        'slot',
        before.slots,
        after.slots,
        valueChange(subpath, 'slot', 'scope changed')
      ),
      ...diffKeyed(
        subpath,
        'sub-component',
        asKeys(before.subcomponents),
        asKeys(after.subcomponents),
        () => []
      )
    )
    if (before.models && after.models) {
      changes.push(
        ...diffKeyed(subpath, 'model', asKeys(before.models), asKeys(after.models), () => [])
      )
    }
  }
  return changes.filter((c) => !movedToModel(c, base.components, head.components))
}

export function movedToModel(c, baseComponents, headComponents) {
  const before = baseComponents[c.subpath]
  const after = headComponents[c.subpath]
  if (!before || !after) return false
  const headModels = new Set(after.models || [])
  const baseModels = new Set(before.models || [])
  if (c.area === 'prop' && c.kind === 'removed') return headModels.has(c.name)
  if (c.area === 'event' && c.kind === 'removed' && c.name.startsWith('update:')) {
    return headModels.has(c.name.slice('update:'.length))
  }
  if (c.area === 'model' && c.kind === 'added') {
    return c.name in before.props && !baseModels.has(c.name)
  }
  return false
}

export function isBreakingTitle(title) {
  return /^[a-z]+(\([^)]*\))?!:\s/.test(String(title ?? '').trim())
}

export function coveredByCodemod(c, migrations) {
  if (c.area === 'export' && c.kind === 'removed') {
    return Boolean(
      renamedSubpath(c.subpath, migrations.components) || migrations.removed[c.subpath]
    )
  }
  if (c.area !== 'prop') return false
  const rule = migrations.props[c.subpath]?.[c.name]
  if (!rule) return false
  if (c.kind === 'removed') return true
  if (c.kind === 'type narrowed') {
    const values = ruleOf(rule).values || {}
    return c.detail
      .replace(/^drops /, '')
      .split(', ')
      .every((v) => v.slice(1, -1) in values)
  }
  return false
}

export function mentionsComponent(lines, subpath) {
  const name = subpath.split('/').pop()
  const tokens = [
    new RegExp(`@aziontech/webkit/${name}(?![\\w-])`),
    new RegExp(`\`${name}\``),
    new RegExp(`\\b${pascal(subpath)}\\b`)
  ]
  return lines.some((line) => tokens.some((re) => re.test(line)))
}

export function addedLines(headText, baseText) {
  const seen = new Set((baseText ?? '').split('\n'))
  return headText.split('\n').filter((line) => line.trim() && !seen.has(line))
}

export function evaluate(changes, ctx) {
  const failures = []
  const breaking = changes.filter((c) => c.breaking)
  if (breaking.length && !isBreakingTitle(ctx.prTitle)) {
    failures.push(
      ctx.prTitle
        ? `${breaking.length} breaking change(s), but the PR title "${ctx.prTitle}" has no "!" before the colon (e.g. "feat(webkit)!: …").`
        : `${breaking.length} breaking change(s): the PR title must carry "!" before the colon (set PR_TITLE to check it locally).`
    )
  }
  for (const c of breaking) {
    const subjects = [c.subpath, ...(ctx.parents?.[c.subpath] ? [ctx.parents[c.subpath]] : [])]
    const covered =
      coveredByCodemod(c, ctx.migrations) ||
      subjects.some((s) => mentionsComponent(ctx.migrationLines, s))
    if (!covered) {
      failures.push(
        `${c.subpath}: ${c.area} ${c.name} ${c.kind} has no migration (add a codemod entry to src/cli/migrations/ or a line naming ${pascal(c.subpath)} to a MIGRATION-v<N>.md).`
      )
    }
  }
  const bySpec = new Map()
  for (const c of changes) {
    const spec = (ctx.specOf?.[c.subpath] || []).find((s) => s in ctx.baseSpecVersions)
    if (spec) bySpec.set(spec, [...(bySpec.get(spec) || []), c])
  }
  for (const [spec, list] of bySpec) {
    const before = ctx.baseSpecVersions[spec]
    const after = ctx.headSpecVersions[spec]
    if (after === undefined) continue
    if (!(after > before)) {
      failures.push(
        `.specs/${spec}.md: ${list.length} API change(s) but spec_version is still ${after} (base ${before}); bump it.`
      )
    }
  }
  return failures
}

export function formatTable(changes) {
  if (!changes.length) return 'No public API change.'
  const rows = changes.map(
    (c) =>
      `| ${c.subpath} | ${c.area} | ${c.name} | ${c.kind} | ${c.breaking ? '**breaking**' : 'non-breaking'} | ${c.detail.replace(/\|/g, '\\|')} |`
  )
  return [
    '| Export | Area | Name | Change | Class | Detail |',
    '| --- | --- | --- | --- | --- | --- |',
    ...rows
  ].join('\n')
}

export function specVersion(text) {
  const head = text?.match(/^---\n([\s\S]*?)\n---/)
  const m = head?.[1].match(/^spec_version:\s*(\d+)\s*$/m)
  return m ? Number(m[1]) : undefined
}

function specOfMap(baseSurface, headSurface) {
  const out = {}
  for (const surface of [baseSurface, headSurface]) {
    for (const [subpath, entry] of Object.entries(surface.components)) {
      out[subpath] = [...new Set([...(out[subpath] || []), ...entry.specs])]
    }
  }
  return out
}

function readSpecVersions(names, read) {
  const out = {}
  for (const name of names) {
    const version = specVersion(read(`.specs/${name}.md`))
    if (version !== undefined) out[name] = version
  }
  return out
}

function migrationDocLines(base) {
  const lines = []
  for (const file of readdirSync(PKG).filter((f) => MIGRATION_DOC.test(f))) {
    const head = readFileSync(resolve(PKG, file), 'utf8')
    lines.push(...addedLines(head, base ? showAtBase(base, `packages/webkit/${file}`) : ''))
  }
  return lines
}

function parentsOf(catalog) {
  return Object.fromEntries(
    Object.entries(catalog.imports || {})
      .filter(([, e]) => e.parent || e.rootOf)
      .map(([s, e]) => [s, e.parent || e.rootOf])
  )
}

export function run({ against = null, env = process.env } = {}) {
  const base = resolveBase({ against, env })
  const baseRaw = base ? showAtBase(base, 'packages/webkit/catalog.json') : null
  if (!baseRaw) {
    return {
      skipped: 'no base ref with a committed packages/webkit/catalog.json',
      changes: [],
      failures: []
    }
  }
  const headCatalog = JSON.parse(readFileSync(resolve(PKG, 'catalog.json'), 'utf8'))
  const baseSurface = surfaceFromCatalog(JSON.parse(baseRaw))
  const headSurface = surfaceFromCatalog(headCatalog)
  const changes = diffSurface(baseSurface, headSurface)
  const specOf = specOfMap(baseSurface, headSurface)
  const specNames = [...new Set(Object.values(specOf).flat())]
  const baseSpecs = new Set(listAtBase(base, '.specs'))
  const failures = evaluate(changes, {
    prTitle: env.PR_TITLE ?? '',
    migrations: loadMigrations(),
    migrationLines: migrationDocLines(base),
    parents: parentsOf(headCatalog),
    specOf,
    baseSpecVersions: readSpecVersions(
      specNames.filter((n) => baseSpecs.has(`${n}.md`)),
      (p) => showAtBase(base, p)
    ),
    headSpecVersions: readSpecVersions(specNames, (p) => {
      const abs = resolve(REPO_ROOT, p)
      return existsSync(abs) ? readFileSync(abs, 'utf8') : null
    })
  })
  return { base, changes, failures }
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invoked) {
  const args = process.argv.slice(2)
  const i = args.indexOf('--against')
  const result = run({ against: i >= 0 ? args[i + 1] : null })
  if (result.skipped) {
    console.log(
      `API diff skipped: ${result.skipped}; check-migrations still compares against scripts/api-snapshot.json.`
    )
    process.exit(0)
  }
  const { base, changes, failures } = result
  const breaking = changes.filter((c) => c.breaking).length
  console.log(
    `Public API of head vs ${base.ref} (${base.commit.slice(0, 9)}): ${changes.length} change(s), ${breaking} breaking.\n`
  )
  console.log(formatTable(changes))
  if (failures.length) {
    console.error(`\n✖ ${failures.length} problem(s):`)
    for (const line of failures) console.error(`  - ${line}`)
    process.exit(1)
  }
  console.log('\n✓ API changes are classified, marked and migrated.')
}
