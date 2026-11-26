import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

// Point the loader at the real generated catalog (version-locked, deterministic).
// Set BEFORE importing the loader so the first resolve honors the override.
process.env.WEBKIT_CATALOG_PATH = fileURLToPath(new URL('../../catalog.json', import.meta.url))

const { loadCatalog, _resetCatalogCache } = await import('../../src/catalog/catalog.js')
const {
  listAssets,
  listComponents,
  listCategories,
  listTokens,
  getComponent,
  getBestPractices,
  getImport,
  searchComponents,
  suggestComponent,
  getUsageExample,
  validateUsage,
  pascalCase,
  sameVariant,
  searchBlocks,
  getBlock
} = await import('../../src/catalog/queries.js')

_resetCatalogCache()
const catalog = loadCatalog()

test('catalog is available and version-locked', () => {
  assert.equal(catalog.available, true)
  assert.ok(catalog.subpaths.length > 50, 'catalog should carry many exports')
})

test('pascalCase derives the PascalCase binding from a kebab subpath', () => {
  assert.equal(pascalCase('button'), 'Button')
  assert.equal(pascalCase('table-row'), 'TableRow')
  assert.equal(pascalCase('empty-results-block'), 'EmptyResultsBlock')
})

test('listComponents returns >50 components and includes button', () => {
  const res = listComponents(catalog)
  assert.equal(res.ok, true)
  assert.ok(res.count > 50, `expected >50 components, got ${res.count}`)
  const names = res.components.map((c) => c.name)
  assert.ok(names.includes('button'), 'button should be listed')
  // Every listed entry is genuinely a component.
  for (const c of res.components) {
    assert.equal(catalog.getEntry(c.name).kind, 'component')
  }
})

test('listComponents can filter by category', () => {
  const res = listComponents(catalog, { category: 'action' })
  assert.equal(res.ok, true)
  assert.ok(res.count >= 1)
  assert.ok(res.components.every((c) => c.category === 'action'))
  assert.ok(res.components.some((c) => c.name === 'button'))
})

test('every component carries a surface, and listComponents filters by it', () => {
  const all = listComponents(catalog)
  assert.ok(all.components.every((c) => ['app', 'site', 'docs'].includes(c.surface)))
  const product = listComponents(catalog, { surface: 'app' })
  assert.ok(product.components.some((c) => c.name === 'button'))
  assert.ok(product.components.every((c) => c.surface === 'app'))
  const marketing = listComponents(catalog, { surface: 'site' })
  assert.ok(marketing.components.some((c) => c.name === 'architecture-tabs-section'))
  assert.equal(getComponent(catalog, 'doc-callout').surface, 'docs')
})

test('listCategories returns a sorted, non-empty list', () => {
  const res = listCategories(catalog)
  assert.equal(res.ok, true)
  assert.ok(res.categories.includes('action'))
  assert.ok(res.categories.includes('data'))
})

test('listTokens returns the group index + typography classes', () => {
  const res = listTokens(catalog)
  assert.equal(res.ok, true)
  const groupNames = res.groups.map((g) => g.name)
  assert.ok(groupNames.includes('primary'), 'expected a "primary" group')
  assert.ok(groupNames.includes('bg'), 'expected a "bg" group')
  assert.ok(res.groups.every((g) => typeof g.count === 'number' && g.count > 0))
  assert.ok(res.typography.includes('text-body-md'), 'expected typography classes')
})

test('listTokens expands a category to its CSS custom properties', () => {
  const res = listTokens(catalog, { category: 'primary' })
  assert.equal(res.ok, true)
  assert.equal(res.found, true)
  const names = res.tokens.map((t) => t.name)
  assert.ok(names.includes('--primary'), 'primary group should contain --primary')

  const bg = listTokens(catalog, { category: 'bg' })
  assert.ok(
    bg.tokens.some((t) => t.name === '--bg-surface'),
    'bg group should contain --bg-surface'
  )
})

test('listTokens returns light and dark values and a purpose for a semantic colour', () => {
  const bg = listTokens(catalog, { category: 'bg' })
  const surface = bg.tokens.find((t) => t.name === '--bg-surface')
  assert.equal(surface.type, 'color')
  assert.equal(surface.light, '#FFFFFF')
  assert.equal(surface.dark, '#0A0A0A')
  assert.match(surface.purpose, /\.$/)

  const chart = listTokens(catalog, { category: 'chart' })
  for (const step of ['negative-2', 'negative-3', 'positive-3', 'positive-2']) {
    const token = chart.tokens.find((t) => t.name === `--chart-diverging-${step}`)
    assert.ok(token, `--chart-diverging-${step} is listed`)
    assert.match(token.light, /^#[0-9A-F]{6}$/i)
    assert.match(token.dark, /^#[0-9A-F]{6}$/i)
    assert.ok(token.purpose)
  }

  const muted = listTokens(catalog, { category: 'chart' }).tokens.find(
    (t) => t.name === '--chart-tooltip-muted'
  )
  assert.deepEqual(muted.alias, { light: '--text-muted' })
})

test('listTokens returns the value, breakpoints and purpose of a spacing token and a type class', () => {
  const spacing = listTokens(catalog, { category: 'spacing' })
  const xl = spacing.tokens.find((t) => t.name === '--spacing-xl')
  assert.equal(xl.value, '1.5rem')
  assert.deepEqual(xl.breakpoints, { sm: '2rem', xl: '3rem' })
  assert.ok(xl.purpose)
  const primitive = spacing.tokens.find((t) => !t.purpose)
  assert.ok(primitive && Object.keys(primitive).length === 1, 'a primitive carries its name only')

  const type = listTokens(catalog, { category: 'typography' })
  const heading = type.tokens.find((t) => t.name === 'text-heading-md')
  assert.equal(heading.type, 'typography')
  assert.equal(heading.value['font-size'], '1rem')
  assert.ok(heading.breakpoints.md['font-size'])
  assert.ok(heading.purpose)
})

test('listTokens looks up a single token by name', () => {
  const res = listTokens(catalog, { category: '--text-muted' })
  assert.equal(res.ok, true)
  assert.equal(res.tokens.length, 1)
  assert.equal(res.tokens[0].name, '--text-muted')
  assert.equal(res.tokens[0].light, '#535353')
  assert.equal(res.category, 'text')
})

test('every semantic token in the catalog has a purpose and the index counts them', () => {
  const values = Object.entries(catalog.tokens.values)
  assert.ok(values.length > 150)
  for (const [name, entry] of values) assert.ok(entry.purpose, `${name} has no purpose`)
  const index = listTokens(catalog)
  assert.equal(index.semanticCount, values.length)
  assert.deepEqual(index.themes, ['light', 'dark'])
})

test('listTokens reports an unknown category with the available groups', () => {
  const res = listTokens(catalog, { category: 'nope' })
  assert.equal(res.ok, false)
  assert.equal(res.found, false)
  assert.ok(Array.isArray(res.groups) && res.groups.length > 0)
  assert.ok(res.groups.includes('animations'), 'animations must be advertised as a group')
  assert.ok(res.groups.includes('typography'), 'typography must be advertised as a group')
})

test('listTokens surfaces the animations catalog with timing + use-when', () => {
  const res = listTokens(catalog, { category: 'animations' })
  assert.equal(res.ok, true)
  assert.equal(res.found, true)
  const slideIn = res.tokens.find((t) => t.class === 'animate-slide-in-start')
  assert.ok(slideIn, 'expected animate-slide-in-start in the animations catalog')
  assert.match(slideIn.value, /slideInStart/)
  assert.match(slideIn.useWhen, /sidebar/i)
  assert.match(res.hint, /motion-reduce/)
  // The index (no category) also advertises the animations group.
  const index = listTokens(catalog)
  assert.ok(index.groups.some((g) => g.name === 'animations' && g.count > 0))
})

test('every animate-* utility has a useWhen entry (guidance stays in sync with the catalog)', async () => {
  const { animate, useWhen } =
    await import('../../../theme/src/tokens/primitives/animations/animate.js')
  for (const name of Object.keys(animate)) {
    assert.ok(
      typeof useWhen[name] === 'string' && useWhen[name].length > 0,
      `animate-${name} has no useWhen entry — add it in packages/theme/src/tokens/primitives/animations/animate.js`
    )
  }
})

test('getComponent surfaces app-level setup for toast', () => {
  const res = getComponent(catalog, 'toast')
  assert.equal(res.found, true)
  assert.match(res.setup, /ToastPlugin/)
})

test('getComponent surfaces usage guidance fields (purpose + when/related/best-practices)', () => {
  const res = getComponent(catalog, 'badge')
  assert.equal(res.found, true)
  assert.equal(typeof res.purpose, 'string')
  assert.ok(res.purpose.length > 0, 'badge should carry a Purpose')
  for (const k of ['useWhen', 'avoidWhen', 'related', 'bestPractices']) {
    assert.ok(Array.isArray(res[k]), `${k} should be an array`)
  }
})

test('getBestPractices returns the guidance subset for a known component', () => {
  const res = getBestPractices(catalog, 'badge')
  assert.equal(res.found, true)
  assert.equal(typeof res.purpose, 'string')
  assert.ok('useWhen' in res && 'avoidWhen' in res && 'related' in res && 'bestPractices' in res)
})

test('getBestPractices returns suggestions for an unknown component', () => {
  const res = getBestPractices(catalog, 'buton')
  assert.equal(res.found, false)
  assert.ok(res.suggestions.includes('button'))
})

test('getComponent(table) has compoundRoot + subcomponents + props', () => {
  const res = getComponent(catalog, 'table')
  assert.equal(res.found, true)
  assert.equal(res.compoundRoot, true)
  assert.ok(Array.isArray(res.subcomponents) && res.subcomponents.length > 0)
  assert.ok(res.subcomponents.includes('@aziontech/webkit/table-row'))
  assert.ok(Array.isArray(res.props) && res.props.length > 0)
  assert.equal(res.structure, 'composition')
})

test('getComponent for an unknown name returns suggestions', () => {
  const res = getComponent(catalog, 'buton')
  assert.equal(res.found, false)
  assert.ok(res.suggestions.includes('button'))
})

test('getImport(table) returns the tree-shakeable -root import + compound alternative', () => {
  const res = getImport(catalog, 'table')
  assert.equal(res.found, true)
  assert.equal(res.importPath, '@aziontech/webkit/table-root')
  assert.match(res.import, /@aziontech\/webkit\/table-root/)
  assert.equal(res.binding, 'TableRoot')
  assert.ok(res.compoundAlternative, 'should surface the compound alternative')
  assert.equal(res.compoundAlternative.importPath, '@aziontech/webkit/table')
})

test('getImport(button) returns the plain button import', () => {
  const res = getImport(catalog, 'button')
  assert.equal(res.found, true)
  assert.equal(res.importPath, '@aziontech/webkit/button')
  assert.equal(res.binding, 'Button')
  assert.match(res.import, /import Button from '@aziontech\/webkit\/button'/)
  assert.equal(res.compoundAlternative, undefined)
})

test('suggestComponent resolves a table-ish need to table', () => {
  const byWord = suggestComponent(catalog, 'table')
  assert.equal(byWord.best.name, 'table')
  const byTypo = suggestComponent(catalog, 'datatable')
  // "datatable" contains "table" → substring/word match, or fuzzy fallback.
  const resolved = byTypo.best?.name
  assert.ok(
    resolved === 'table' || byTypo.alternatives.some((a) => a.name === 'table'),
    `expected datatable to resolve to table, got ${resolved}`
  )
})

test('searchComponents finds a component by substring', () => {
  const res = searchComponents(catalog, 'table')
  assert.equal(res.ok, true)
  assert.ok(res.matches.some((m) => m.name === 'table'))
})

test('getUsageExample synthesizes a runnable SFC with the tree-shakeable import', () => {
  const res = getUsageExample(catalog, 'button', { fromStory: false })
  assert.equal(res.found, true)
  assert.match(res.sfc, /<script setup( lang="ts")?>/)
  assert.match(res.sfc, /import Button from '@aziontech\/webkit\/button'/)
  assert.match(res.sfc, /<Button/)
  assert.match(res.sfc, /<template>/)
  assert.doesNotMatch(res.sfc, /primevue/i)
})

test('validateUsage flags an unknown import with suggestions', () => {
  const res = validateUsage(catalog, { import: '@aziontech/webkit/datatable' })
  assert.equal(res.ok, false)
  const problem = res.problems.find((p) => p.kind === 'import')
  assert.ok(problem)
  assert.equal(problem.severity, 'error')
  assert.ok(Array.isArray(problem.suggestions))
})

test('validateUsage accepts a real import', () => {
  const res = validateUsage(catalog, { import: '@aziontech/webkit/button' })
  assert.equal(res.ok, true)
  assert.equal(res.problems.length, 0)
})

test('validateUsage does NOT flag a sibling package as an invalid webkit import', () => {
  // @aziontech/webkit-cli / -mcp share the name as a prefix but are not webkit imports.
  for (const sibling of ['@aziontech/webkit-cli', '@aziontech/webkit-mcp']) {
    const res = validateUsage(catalog, { import: sibling })
    const problem = res.problems.find((p) => p.kind === 'import')
    assert.ok(problem, `${sibling} should produce an info problem`)
    assert.equal(problem.severity, 'info', `${sibling} must not be an error`)
    assert.match(problem.message, /nothing to validate/)
  }
})

test('getUsageExample binds an empty literal for a required array prop (never prop="text")', () => {
  const res = getUsageExample(catalog, 'site-header-section', { fromStory: false })
  assert.equal(res.found, true)
  // menus: SiteHeaderSectionMenu[] is required and non-scalar → :menus="[]", not menus="text"
  assert.match(res.sfc, /:menus="\[\]"/)
  assert.doesNotMatch(res.sfc, /menus="text"/)
})

test('validateUsage flags a hardcoded hex color in a class string', () => {
  const res = validateUsage(catalog, { classes: 'text-[#fff]' })
  assert.equal(res.ok, false)
  assert.ok(res.problems.some((p) => p.kind === 'token'))
})

test('validateUsage flags a tailwind palette color', () => {
  const res = validateUsage(catalog, { classes: 'bg-blue-500 p-4' })
  assert.equal(res.ok, false)
  assert.ok(res.problems.some((p) => p.kind === 'token' && p.ruleId === 'tailwind-palette'))
})

test('validateUsage passes clean semantic-token classes', () => {
  const res = validateUsage(catalog, { classes: 'bg-[var(--bg-surface)] text-body-md p-4' })
  assert.equal(res.ok, true)
})

test('getComponent tells which classes may go on the tag (shared layout list)', async () => {
  const { LAYOUT_CLASS_FAMILIES } = await import('../../src/eslint-plugin/lib/layout-classes.js')
  const button = getComponent(catalog, 'button')
  assert.equal(button.allowedClasses.any, false)
  assert.deepEqual(button.allowedClasses.families, [...LAYOUT_CLASS_FAMILIES])
  assert.equal(getComponent(catalog, 'registration-frame').allowedClasses.any, true)
})

test('validateUsage with a component flags classes outside the layout utilities', () => {
  const ok = validateUsage(catalog, {
    component: 'button',
    classes: 'w-full max-w-(--container-sm)'
  })
  assert.equal(ok.ok, true)
  const placed = validateUsage(catalog, {
    component: 'field',
    classes: 'mt-(--spacing-md) col-span-2 lg:col-span-4'
  })
  assert.equal(placed.ok, true)
  const bad = validateUsage(catalog, { component: 'button', classes: 'w-full mt-4 p-4' })
  assert.equal(bad.ok, false)
  const problem = bad.problems.find((p) => p.kind === 'style-override')
  assert.deepEqual(problem.classes, ['p-4'])
})

test('searchBlocks ranks auth/auth-sign-in first for login and sign-up intents in EN and PT', () => {
  for (const q of [
    'login',
    'sign in',
    'entrar',
    'tela de login',
    'forgot password',
    'criar conta'
  ]) {
    const res = searchBlocks(catalog, q)
    assert.equal(res.matches[0].id, 'auth/auth-sign-in', q)
  }
})

test('searchBlocks with an empty query lists every block', () => {
  const res = searchBlocks(catalog, '')
  assert.equal(res.count, Object.keys(catalog.blocks).length)
})

test('getBlock returns the SFC, components, skills and steps; variants by name', () => {
  const p = getBlock(catalog, 'auth/auth-sign-in')
  assert.equal(p.found, true)
  assert.equal(p.variant, 'Login')
  assert.match(p.sfc, /<script setup( lang="ts")?>/)
  assert.match(p.sfc, /autocomplete="username"/)
  assert.ok(p.components.includes('Input'))
  assert.deepEqual(p.steps, ['email', 'password', 'reset', 'sent', 'new-password'])
  assert.ok(p.skills.includes('webkit-errors'))
  const v = getBlock(catalog, 'auth/auth-sign-in', { variant: 'IncorrectCredentials' })
  assert.equal(v.variant, 'IncorrectCredentials')
  assert.match(v.sfc, /error="bad-credentials"/)
  assert.match(p.files['lib/sign-in-copy.ts'], /Incorrect email or password/)
  assert.equal(getBlock(catalog, 'auth/auth-sign-in', { variant: 'SignUp' }).variant, 'SignUp')
  assert.equal(getBlock(catalog, 'auth').id, 'auth/auth-sign-in')
  assert.equal(getBlock(catalog, 'nope-nope').found, false)
})

test('getBlock returns the guidelines and tells the agent to read them first', () => {
  const p = getBlock(catalog, 'view/view-table')
  assert.match(p.guidelines, /^# Table view/)
  for (const section of ['## When to use', '## Building blocks', '## Copy', '## Accessibility'])
    assert.ok(p.guidelines.includes(section), section)
  assert.match(p.howToUse, /^Read `guidelines` first/)
  const v = getBlock(catalog, 'view/view-table', { variant: 'Empty' })
  assert.equal(v.guidelines, p.guidelines)
})

test('searchBlocks cards carry the guidelines purpose as guidelinesSummary', () => {
  const card = searchBlocks(catalog, 'resource list').matches.find(
    (m) => m.id === 'view/view-table'
  )
  assert.ok(card.guidelinesSummary.length > 40)
  assert.equal(card.guidelinesSummary.includes('##'), false)
})

test('a block without guidelines keeps the plain howToUse and no guidelines fields', () => {
  const bare = {
    available: true,
    blockAliases: {},
    blocks: {
      'platform/x': { name: 'X', primary: 'Default', sfc: '<template />', variants: [] }
    },
    block(id) {
      return this.blocks[id]
    }
  }
  const p = getBlock(bare, 'platform/x')
  assert.equal('guidelines' in p, false)
  assert.match(p.howToUse, /^Copy this SFC/)
  assert.equal('guidelinesSummary' in searchBlocks(bare, '').matches[0], false)
})

test('getBlock resolves a v6 block id through catalog.blockAliases with a note', () => {
  const moved = getBlock(catalog, 'platform/lists/table-view')
  assert.equal(moved.found, true)
  assert.equal(moved.id, 'view/view-table')
  assert.equal(moved.movedFrom, 'platform/lists/table-view')
  assert.match(moved.note, /view\/view-table/)
  assert.equal(
    getBlock(catalog, 'platform/lists/table-view', { variant: 'Empty' }).variant,
    'Empty'
  )

  const merged = getBlock(catalog, 'platform/forms/save-per-group')
  assert.equal(merged.id, 'settings/settings-form')
  assert.equal(merged.variant, 'SavePerGroup')
  assert.equal(
    getBlock(catalog, 'platform/forms/save-per-group', { variant: 'SavingOneGroup' }).variant,
    'SavingOneGroup'
  )
  assert.equal(
    getBlock(catalog, 'platform/forms/sectioned-form', { variant: 'Submitted' }).variant,
    'ImportFromGit'
  )
  assert.equal(getBlock(catalog, 'platform/forms/save-all-groups').variant, 'SaveAll')
  assert.equal(getBlock(catalog, 'details-page-with-tabs').id, 'detail/detail-resource')
  assert.equal(getBlock(catalog, 'auth/auth-sign-in').note, undefined)

  for (const [from, to] of Object.entries(catalog.blockAliases)) {
    const [id, variant] = to.split('#')
    const [oldId, oldVariant] = from.split('#')
    const p = getBlock(catalog, oldId, oldVariant ? { variant: oldVariant } : {})
    assert.equal(p.id, id, from)
    if (variant) assert.ok(sameVariant(p.variant, variant), `${from}: ${p.variant}`)
  }
})

test('searchBlocks lands each task on its v6 category block', () => {
  for (const [q, id] of [
    ['delete confirmation', 'edit/edit-delete-dialog'],
    ['create in drawer', 'create/create-drawer'],
    ['list page', 'view/view-table'],
    ['details page', 'detail/detail-resource'],
    ['resource settings', 'edit/edit-resource'],
    ['save per card', 'settings/settings-form'],
    ['account settings', 'settings/settings-form']
  ]) {
    assert.equal(searchBlocks(catalog, q).matches[0].id, id, q)
  }
})

test('suggestComponent returns the block first for a screen and the section for a marketing band', () => {
  const screen = suggestComponent(catalog, 'login page')
  assert.equal(screen.recommendation, 'block')
  assert.equal(screen.block.id, 'auth/auth-sign-in')
  const band = suggestComponent(catalog, 'pricing page')
  assert.equal(band.recommendation, 'section')
  assert.equal(band.best.name, 'pricing-plans-section')
  assert.equal(suggestComponent(catalog, 'button').recommendation, 'component')
})

test('no MCP answer carries the spec status', () => {
  assert.equal('status' in getComponent(catalog, 'button'), false)
  assert.ok(listComponents(catalog).components.every((c) => !('status' in c)))
  assert.ok(Object.values(catalog.imports).every((e) => !('status' in e)))
})

test('getComponent carries the agent docs and story examples (D2)', () => {
  const ft = getComponent(catalog, 'field')
  assert.ok(ft.purpose)
  assert.ok(ft.useWhen.length > 0)
  assert.ok(ft.avoidWhen.length > 0)
  assert.ok(ft.examples.length > 0)
  assert.match(ft.examples[0].sfc, /@aziontech\/webkit\/field'/)
})

test('every exported component has purpose, when to use and when not to use', async () => {
  const { missingComponentDocs } = await import('../../scripts/lib/component-docs.mjs')
  const detailed = Object.fromEntries(catalog.subpaths.map((sub) => [sub, catalog.getDetails(sub)]))
  assert.deepEqual(missingComponentDocs(detailed), [])
  assert.deepEqual(
    missingComponentDocs({ x: { kind: 'component', purpose: 'p', useWhen: ['a'], avoidWhen: [] } }),
    ['x: When NOT to use']
  )
})

test('getUsageExample prefers the real story example when there is one', () => {
  const res = getUsageExample(catalog, 'field')
  assert.match(res.source, /^example /)
  assert.match(res.sfc, /<template>/)
})

test('getComponent resolves a market or retired name to the current export with a note', () => {
  assert.ok(catalog.aliases.modal === 'dialog')
  const modal = getComponent(catalog, 'modal')
  assert.equal(modal.found, true)
  assert.equal(modal.name, 'dialog')
  assert.equal(modal.binding, 'Dialog')
  assert.equal(modal.requested, 'modal')
  assert.equal(modal.aliasOf, 'dialog')
  assert.match(modal.note, /"modal" is not a webkit export.*@aziontech\/webkit\/dialog/)
  assert.equal(getComponent(catalog, 'paginator').name, 'pagination')
  assert.equal(getComponent(catalog, 'Segmented Control').name, 'toggle-group')
  const missing = getComponent(catalog, 'no-such-thing')
  assert.equal(missing.found, false)
  assert.equal(getComponent(catalog, 'dialog').note, undefined)
})

test('searchComponents ranks the aliased component first and marks it', () => {
  for (const [query, name] of [
    ['modal', 'dialog'],
    ['sheet', 'drawer'],
    ['message', 'alert'],
    ['cta', 'call-to-action']
  ]) {
    const res = searchComponents(catalog, query)
    assert.equal(res.matches[0].name, name, `${query} should resolve to ${name}`)
    assert.ok(res.matches[0].note)
  }
  const plain = searchComponents(catalog, 'table')
  assert.ok(plain.matches.every((m) => m.note === undefined))
})

test('suggestComponent answers an alias with the current component, not a block', () => {
  for (const [need, name] of [
    ['modal', 'dialog'],
    ['segmented control', 'toggle-group'],
    ['paginator', 'pagination'],
    ['sheet', 'drawer'],
    ['message', 'alert']
  ]) {
    const res = suggestComponent(catalog, need)
    assert.equal(res.recommendation, 'component', need)
    assert.equal(res.best.name, name, need)
    assert.match(
      res.note,
      new RegExp(
        `another name for "${name}"|renamed in WebKit v6: import @aziontech/webkit/${name}`
      )
    )
  }
})

test('list_assets indexes every kind with its count and the components that use it', () => {
  const res = listAssets(catalog)
  assert.equal(res.ok, true)
  const kinds = Object.fromEntries(res.kinds.map((k) => [k.kind, k]))
  for (const kind of ['illustrations', 'diagrams', 'brandMarks', 'icons']) {
    assert.ok(kinds[kind]?.count > 0, kind)
  }
  assert.ok(kinds.illustrations.usedBy.includes('illustration'))
  assert.ok(kinds.illustrations.usedBy.includes('media-split-stack-section'))
  assert.ok(kinds.brandMarks.usedBy.includes('marquee'))
  assert.ok(kinds.brandMarks.usedBy.includes('client-quotes-section'))
  assert.ok(kinds.diagrams.usedBy.includes('diagram'))
  assert.ok(kinds.icons.usedBy.includes('button'))
})

test('list_assets lists every registered illustration, the shipped tiles included', () => {
  const res = listAssets(catalog, { kind: 'illustration' })
  assert.equal(res.kind, 'illustrations')
  const names = res.items.map((i) => i.name)
  for (const name of [
    'ddos-protection',
    'ai-gateway',
    'usage-chart',
    'real-time-metrics-status-codes',
    'runtime'
  ]) {
    assert.ok(names.includes(name), name)
  }
  assert.ok(!names.includes('placeholder'))
  assert.equal(res.items.find((i) => i.name === 'runtime').canvas, '592x300')
})

test('list_assets lists only the renamed illustration scenes, never the old names', () => {
  const items = listAssets(catalog, { kind: 'illustrations' }).items
  const byName = new Map(items.map((i) => [i.name, i]))
  for (const [retired, current] of [
    ['saas-platforms', 'azion-to-commerce-tiles'],
    ['enable-owasp-protection-with-customizable-rules', 'waf-threat-families-panel'],
    ['stream-security-events-for-investigation-and-response', 'data-stream-destinations-map'],
    ['build-databases-from-code', 'sql-sdk-code-cards'],
    ['distributed-sql-for-resilient-global-reads', 'globe-with-sql-nodes'],
    ['reputation-intelligence-for-enhanced-protection', 'reputation-rings-hub'],
    ['white-gloves-when-it-matters', 'chat-and-headset-tiles'],
    ['stay-in-control', 'traffic-and-cost-bar-chart']
  ]) {
    assert.equal(byName.has(retired), false, retired)
    assert.equal(byName.get(current)?.deprecated, undefined, current)
  }
  assert.deepEqual(
    items.filter((i) => i.deprecated),
    []
  )
})

test('list_assets filters by name, label and keyword', () => {
  assert.deepEqual(
    listAssets(catalog, { kind: 'brandMarks', query: 'magalu' }).items.map((i) => i.name),
    ['magalu']
  )
  const trash = listAssets(catalog, { kind: 'icons', query: 'delete' }).items.map((i) => i.class)
  assert.ok(trash.includes('az az-trash'), trash.join(', '))
  const colour = listAssets(catalog, { kind: 'icons', query: 'react' }).items.map((i) => i.class)
  assert.ok(colour.includes('az-color az-react'), colour.join(', '))
  const cache = listAssets(catalog, { kind: 'diagrams', query: 'tiered cache' }).items
  assert.ok(cache.some((i) => i.name === 'cache'))
})

test('list_assets names the kinds when the kind is unknown', () => {
  const res = listAssets(catalog, { kind: 'stickers' })
  assert.equal(res.ok, false)
  assert.ok(res.kinds.includes('illustrations'))
})

test('every icon carries search keywords', () => {
  const icons = listAssets(catalog, { kind: 'icons' }).items
  const bare = icons.filter((i) => !i.keywords?.length).map((i) => i.class)
  assert.deepEqual(bare, [])
})

test('the Nitro and Stencil glyphs ship as monochrome brand icons, and only Stencil has a colour logo (IC17)', () => {
  const icons = new Map(listAssets(catalog, { kind: 'icons' }).items.map((i) => [i.class, i]))
  for (const [cls, keyword] of [
    ['az az-nitro', 'server'],
    ['az az-stencil', 'web components']
  ]) {
    const icon = icons.get(cls)
    assert.ok(icon, cls)
    assert.equal(icon.set, 'azionicons', cls)
    assert.ok(icon.keywords.includes('brand'), cls)
    assert.ok(icon.keywords.includes(keyword), cls)
    const raw = readFileSync(
      new URL(`../../../icons/src/svg-raw/az/${icon.name}.svg`, import.meta.url),
      'utf-8'
    )
    assert.match(raw, /<svg[^>]*fill="currentColor"/, cls)
    assert.doesNotMatch(raw, /#[0-9a-f]{3,6}\b|gradient|<mask|<filter|stroke=/i, cls)
    assert.equal(raw.match(/<path\b/g).length, 1, cls)
  }
  assert.ok(!icons.has('az-color az-nitro'))
  assert.ok(icons.has('az-color az-stencil'))
})

test('get_component points a consuming component at its asset list', () => {
  assert.deepEqual(
    getComponent(catalog, 'illustration').assets.map((a) => a.kind),
    ['illustrations']
  )
  assert.ok(getComponent(catalog, 'marquee').assets.some((a) => a.kind === 'brandMarks'))
  assert.deepEqual(getComponent(catalog, 'divider').assets, [])
})

test('a marketing page query ranks the website shell and the page sections first', () => {
  for (const q of ['product page', 'solution page', 'landing page', 'página de produto']) {
    assert.equal(searchBlocks(catalog, q).matches[0].id, 'shell/shell-site', q)
    const sections = searchComponents(catalog, q).matches
    assert.ok(sections.length > 0, q)
    assert.ok(
      sections.every((m) => m.category === 'section'),
      `${q}: ${sections.map((m) => m.name).join(', ')}`
    )
  }
  assert.equal(searchBlocks(catalog, 'docs landing page').matches[0].id, 'shell/shell-docs')
})

test('getBlock takes a variant by its file name or its PascalCase name', () => {
  const byFile = getBlock(catalog, 'view/view-table', { variant: 'error' })
  const byName = getBlock(catalog, 'view/view-table', { variant: 'Error' })
  assert.equal(byFile.found, true)
  assert.equal(byFile.variant, 'Error')
  assert.equal(byName.sfc, byFile.sfc)
  const moved = getBlock(catalog, 'platform/view/table-view', { variant: 'Failed' })
  assert.equal(moved.id, 'view/view-table')
  assert.equal(moved.variant, 'Error')
})

test('every block carries one surface of catalog.surfaces', () => {
  const raw = JSON.parse(readFileSync(new URL('../../catalog.json', import.meta.url), 'utf8'))
  const surfaces = Object.keys(raw.surfaces)
  assert.deepEqual(surfaces, ['app', 'site', 'docs', 'edge'])
  for (const [id, p] of Object.entries(catalog.blocks)) assert.ok(surfaces.includes(p.surface), id)
  assert.equal(catalog.block('shell/shell-site').surface, 'site')
  assert.equal(catalog.block('shell/shell-docs').surface, 'docs')
})

test('searchBlocks cards are summary-first: one sentence and the first intents, get_block has the rest', () => {
  for (const card of searchBlocks(catalog, '').matches) {
    assert.ok(card.intents.length <= 5, card.id)
    assert.doesNotMatch(card.summary, /[.!?]\s+\S/, card.id)
  }
})

test('listComponents pages with limit and cursor', () => {
  const all = listComponents(catalog)
  const first = listComponents(catalog, { limit: 10 })
  const second = listComponents(catalog, { limit: 10, cursor: first.nextCursor })
  assert.equal(first.components.length, 10)
  assert.equal(first.count, all.count)
  assert.deepEqual([...first.components, ...second.components], all.components.slice(0, 20))
  assert.equal(listComponents(catalog, { limit: all.count }).nextCursor, undefined)
})

test('getBlock returns only the sections asked for and names the rest', () => {
  const only = getBlock(catalog, 'view/view-table', { sections: ['guidelines'] })
  assert.equal('sfc' in only, false)
  assert.ok(only.guidelines)
  assert.deepEqual(only.omitted, ['sfc'])
  const sfc = getBlock(catalog, 'view/view-table', { sections: ['sfc'] })
  assert.equal('guidelines' in sfc, false)
  assert.match(sfc.sfc, /<template>/)
  assert.equal('omitted' in getBlock(catalog, 'view/view-table'), false)
})
