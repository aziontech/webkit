import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

// Point the loader at the real generated catalog (version-locked, deterministic).
// Set BEFORE importing the loader so the first resolve honors the override.
process.env.WEBKIT_CATALOG_PATH = fileURLToPath(new URL('../../catalog.json', import.meta.url))

const { loadCatalog, _resetCatalogCache } = await import('../../src/mcp/catalog.js')
const {
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
  searchPatterns,
  getPattern
} = await import('../../src/mcp/queries.js')

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
  const res = listComponents(catalog, { category: 'actions' })
  assert.equal(res.ok, true)
  assert.ok(res.count >= 1)
  assert.ok(res.components.every((c) => c.category === 'actions'))
  assert.ok(res.components.some((c) => c.name === 'button'))
})

test('every component carries a surface, and listComponents filters by it', () => {
  const all = listComponents(catalog)
  assert.ok(all.components.every((c) => ['product', 'marketing', 'docs'].includes(c.surface)))
  const product = listComponents(catalog, { surface: 'product' })
  assert.ok(product.components.some((c) => c.name === 'button'))
  assert.ok(product.components.every((c) => c.surface === 'product'))
  const marketing = listComponents(catalog, { surface: 'marketing' })
  assert.ok(marketing.components.some((c) => c.name === 'architecture-tabs'))
  assert.equal(getComponent(catalog, 'doc-callout').surface, 'docs')
})

test('listCategories returns a sorted, non-empty list', () => {
  const res = listCategories(catalog)
  assert.equal(res.ok, true)
  assert.ok(res.categories.includes('actions'))
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
  assert.ok(res.tokens.includes('--primary'), 'primary group should contain --primary')

  const bg = listTokens(catalog, { category: 'bg' })
  assert.ok(bg.tokens.includes('--bg-surface'), 'bg group should contain --bg-surface')
})

test('listTokens reports an unknown category with the available groups', () => {
  const res = listTokens(catalog, { category: 'nope' })
  assert.equal(res.ok, false)
  assert.equal(res.found, false)
  assert.ok(Array.isArray(res.groups) && res.groups.length > 0)
  assert.ok(res.groups.includes('animations'), 'animations must be advertised as a group')
})

test('listTokens surfaces the animations catalog with timing + use-when', () => {
  const res = listTokens(catalog, { category: 'animations' })
  assert.equal(res.ok, true)
  assert.equal(res.found, true)
  const slideIn = res.tokens.find((t) => t.class === 'animate-slide-in-left')
  assert.ok(slideIn, 'expected animate-slide-in-left in the animations catalog')
  assert.match(slideIn.value, /slideInLeft/)
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
  assert.match(res.sfc, /<script setup>/)
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
  const res = getUsageExample(catalog, 'radio-cards', { fromStory: false })
  assert.equal(res.found, true)
  // items: RadioCardsItem[] is required and non-scalar → :items="[]", not items="text"
  assert.match(res.sfc, /:items="\[\]"/)
  assert.doesNotMatch(res.sfc, /items="text"/)
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
  const { LAYOUT_CLASS_FAMILIES } = await import('../../src/eslint-plugin/layout-classes.js')
  const button = getComponent(catalog, 'button')
  assert.equal(button.allowedClasses.any, false)
  assert.deepEqual(button.allowedClasses.families, [...LAYOUT_CLASS_FAMILIES])
  assert.equal(getComponent(catalog, 'frame-box').allowedClasses.any, true)
})

test('validateUsage with a component flags classes outside the layout utilities', () => {
  const ok = validateUsage(catalog, {
    component: 'button',
    classes: 'w-full max-w-(--container-sm)'
  })
  assert.equal(ok.ok, true)
  const bad = validateUsage(catalog, { component: 'button', classes: 'w-full mt-4' })
  assert.equal(bad.ok, false)
  const problem = bad.problems.find((p) => p.kind === 'style-override')
  assert.deepEqual(problem.classes, ['mt-4'])
})

test('searchPatterns ranks platform/auth first for login and sign-up intents in EN and PT', () => {
  for (const q of [
    'login',
    'sign in',
    'entrar',
    'tela de login',
    'forgot password',
    'criar conta'
  ]) {
    const res = searchPatterns(catalog, q)
    assert.equal(res.matches[0].id, 'platform/auth', q)
  }
})

test('searchPatterns with an empty query lists every pattern', () => {
  const res = searchPatterns(catalog, '')
  assert.equal(res.count, Object.keys(catalog.patterns).length)
})

test('getPattern returns the SFC, components, skills and steps; variants by name', () => {
  const p = getPattern(catalog, 'platform/auth')
  assert.equal(p.found, true)
  assert.equal(p.variant, 'Login')
  assert.match(p.sfc, /<script setup>/)
  assert.match(p.sfc, /autocomplete="username"/)
  assert.ok(p.components.includes('Input'))
  assert.deepEqual(p.steps, ['email', 'password', 'reset', 'sent', 'new-password'])
  assert.ok(p.skills.includes('webkit-errors'))
  const v = getPattern(catalog, 'platform/auth', { variant: 'IncorrectCredentials' })
  assert.equal(v.variant, 'IncorrectCredentials')
  assert.match(v.sfc, /Incorrect email or password/)
  assert.equal(getPattern(catalog, 'platform/auth', { variant: 'SignUp' }).variant, 'SignUp')
  assert.equal(getPattern(catalog, 'auth').id, 'platform/auth')
  assert.equal(getPattern(catalog, 'nope-nope').found, false)
})

test('getPattern returns the guidelines and tells the agent to read them first', () => {
  const p = getPattern(catalog, 'platform/view/table-view')
  assert.match(p.guidelines, /^# Table view/)
  for (const section of ['## When to use', '## Building blocks', '## Copy', '## Accessibility'])
    assert.ok(p.guidelines.includes(section), section)
  assert.match(p.howToUse, /^Read `guidelines` first/)
  const v = getPattern(catalog, 'platform/view/table-view', { variant: 'Empty' })
  assert.equal(v.guidelines, p.guidelines)
})

test('searchPatterns cards carry the guidelines purpose as guidelinesSummary', () => {
  const card = searchPatterns(catalog, 'resource list').matches.find(
    (m) => m.id === 'platform/view/table-view'
  )
  assert.ok(card.guidelinesSummary.length > 40)
  assert.equal(card.guidelinesSummary.includes('##'), false)
})

test('a pattern without guidelines keeps the plain howToUse and no guidelines fields', () => {
  const bare = {
    available: true,
    patternAliases: {},
    patterns: {
      'platform/x': { name: 'X', primary: 'Default', sfc: '<template />', variants: [] }
    }
  }
  const p = getPattern(bare, 'platform/x')
  assert.equal('guidelines' in p, false)
  assert.match(p.howToUse, /^Copy this SFC/)
  assert.equal('guidelinesSummary' in searchPatterns(bare, '').matches[0], false)
})

test('getPattern resolves a v6 block id through catalog.patternAliases with a note', () => {
  const moved = getPattern(catalog, 'platform/lists/table-view')
  assert.equal(moved.found, true)
  assert.equal(moved.id, 'platform/view/table-view')
  assert.equal(moved.movedFrom, 'platform/lists/table-view')
  assert.match(moved.note, /platform\/view\/table-view/)
  assert.equal(
    getPattern(catalog, 'platform/lists/table-view', { variant: 'Empty' }).variant,
    'Empty'
  )

  const merged = getPattern(catalog, 'platform/forms/save-per-group')
  assert.equal(merged.id, 'platform/settings/settings-form')
  assert.equal(merged.variant, 'SavePerGroup')
  assert.equal(
    getPattern(catalog, 'platform/forms/save-per-group', { variant: 'SavingOneGroup' }).variant,
    'SavingOneGroup'
  )
  assert.equal(
    getPattern(catalog, 'platform/forms/sectioned-form', { variant: 'Submitted' }).variant,
    'ImportFromGitSubmitted'
  )
  assert.equal(getPattern(catalog, 'platform/forms/save-all-groups').variant, 'SaveAll')
  assert.equal(getPattern(catalog, 'details-page-with-tabs').id, 'platform/detail/details-page')
  assert.equal(getPattern(catalog, 'platform/auth').note, undefined)

  for (const [from, to] of Object.entries(catalog.patternAliases)) {
    const [id, variant] = to.split('#')
    const [oldId, oldVariant] = from.split('#')
    const p = getPattern(catalog, oldId, oldVariant ? { variant: oldVariant } : {})
    assert.equal(p.id, id, from)
    if (variant) assert.equal(p.variant, variant, from)
  }
})

test('searchPatterns lands each task on its v6 category block', () => {
  for (const [q, id] of [
    ['delete confirmation', 'platform/delete/delete-with-confirmation'],
    ['create in drawer', 'platform/create/create-in-drawer'],
    ['list page', 'platform/view/table-view'],
    ['details page', 'platform/detail/details-page'],
    ['resource settings', 'platform/edit/edit-resource'],
    ['save per card', 'platform/settings/settings-form'],
    ['account settings', 'platform/account/profile']
  ]) {
    assert.equal(searchPatterns(catalog, q).matches[0].id, id, q)
  }
})

test('suggestComponent returns the pattern first for a screen and the section for a marketing band', () => {
  const screen = suggestComponent(catalog, 'login page')
  assert.equal(screen.recommendation, 'pattern')
  assert.equal(screen.pattern.id, 'platform/auth')
  const band = suggestComponent(catalog, 'pricing page')
  assert.equal(band.recommendation, 'section')
  assert.equal(band.best.name, 'pricing-plans')
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
  assert.deepEqual(missingComponentDocs(catalog.imports), [])
  assert.deepEqual(
    missingComponentDocs({ x: { kind: 'component', purpose: 'p', useWhen: ['a'], avoidWhen: [] } }),
    ['x: When NOT to use']
  )
})

test('getUsageExample prefers the real story example when there is one', () => {
  const res = getUsageExample(catalog, 'field')
  assert.match(res.source, /^story /)
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
    ['tiles', 'radio-cards']
  ]) {
    const res = searchComponents(catalog, query)
    assert.equal(res.matches[0].name, name, `${query} should resolve to ${name}`)
    assert.ok(res.matches[0].note)
  }
  const plain = searchComponents(catalog, 'table')
  assert.ok(plain.matches.every((m) => m.note === undefined))
})

test('suggestComponent answers an alias with the current component, not a pattern', () => {
  for (const [need, name] of [
    ['modal', 'dialog'],
    ['segmented control', 'toggle-group'],
    ['paginator', 'pagination'],
    ['tiles', 'radio-cards'],
    ['message', 'alert']
  ]) {
    const res = suggestComponent(catalog, need)
    assert.equal(res.recommendation, 'component', need)
    assert.equal(res.best.name, name, need)
    assert.match(res.note, new RegExp(`another name for "${name}"`))
  }
})
