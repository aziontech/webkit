import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

import {
  NAMING_STAGED_BLOCKS,
  PHYSICAL_EDGE_TYPES,
  RULES,
  addedViolations,
  checkAxisTypes,
  checkTemplateModels,
  extractModels,
  unionResolver,
  checkFile,
  checkFillPairs,
  checkPartExports,
  countByRule,
  isBlocking,
  loadContext,
  scanRepo
} from '../../scripts/lib/naming-rules.mjs'
import {
  checkDataAttributes,
  checkEventVocabulary,
  checkPropVocabulary,
  checkValueSet,
  checkSlotVocabulary,
  vocabularySnapshot
} from '../../../../.claude/hooks/lib/prop-vocabulary.mjs'

const ROOT = fileURLToPath(new URL('../../../../', import.meta.url))
const C = 'packages/webkit/src/components'

const ctx = {
  exports: new Set(['button', 'button-group', 'dialog', 'dialog-header', 'chip', 'chips', 'tabs']),
  icons: new Set(['ai-search', 'ai-x', 'ai-settings', 'ai-github']),
  iconRenames: { 'ai-times': 'ai-x' },
  retired: { paginator: 'pagination' },
  parts: [
    {
      name: 'dialog-header',
      rel: `${C}/overlay/dialog/dialog-header/dialog-header.vue`,
      root: 'dialog'
    },
    {
      name: 'dialog-footer',
      rel: `${C}/overlay/dialog/dialog-footer/dialog-footer.vue`,
      root: 'dialog'
    }
  ],
  componentNames: new Set(['button', 'dialog', 'command-group', 'kbd']),
  marketingPrimitives: new Set(['hero', 'media-split']),
  tokenKeys: ['primary', 'primary-foreground', 'danger']
}

const hits = (rel, text, rule) => checkFile(rel, text, ctx).filter((x) => x.rule === rule)
const sfc = (script, template = '<div />') =>
  `<script setup lang="ts">\n${script}\n</script>\n\n<template>\n  ${template}\n</template>\n`
const pkg = (body) => JSON.stringify(body, null, 2)

const FIXTURES = {
  'export-kebab': [
    'packages/webkit/package.json',
    pkg({ exports: { './Button': './x.vue' } }),
    pkg({ exports: { './button': './x.vue' } })
  ],
  'block-id': null,
  'export-synonym': [
    'packages/webkit/package.json',
    pkg({ exports: { './modal': './m.vue', './dialog': './d.vue' } }),
    pkg({ exports: { './dialog': './d.vue' } })
  ],
  'export-retired': [
    'packages/webkit/package.json',
    pkg({ exports: { './paginator': './p.vue' } }),
    pkg({ exports: { './pagination': './p.vue' } })
  ],
  'near-duplicate': [
    'packages/webkit/package.json',
    pkg({ exports: { './site-nav': './a.vue', './chips': './c.vue', './chip': './c.vue' } }),
    pkg({ exports: { './site-header': './a.vue', './chip-group': './c.vue', './tabs': './t.vue' } })
  ],
  'export-category': [
    'packages/webkit/package.json',
    pkg({ exports: { './feedback/skeleton': './s.vue' } }),
    pkg({ exports: { './skeleton': './s.vue', './utils/cn': './cn.ts' } })
  ],
  'category-folder': [[`${C}/inputs/chip/chip.vue`, `${C}/input/chip/chip.vue`], sfc(''), sfc('')],
  'block-path': [
    [
      'packages/webkit/blocks/platform/create/create-hub/block.json',
      'packages/webkit/blocks/create/create-hub/block.json'
    ],
    pkg({ id: 'x', surface: 'product' }),
    pkg({ id: 'x', surface: 'product' })
  ],
  'block-word': [
    'packages/webkit/blocks/create/create-hub/block.json',
    pkg({ surface: 'product', title: 'Templates/Platform/Create/CreateHub' }),
    pkg({ surface: 'product', title: 'Blocks/Create/CreateHub' })
  ],
  'block-state': [
    'packages/webkit/blocks/create/create-hub/block.json',
    pkg({
      surface: 'product',
      variants: [{ file: 'variants/failed.vue' }, { file: 'variants/loading-repositories.vue' }]
    }),
    pkg({
      surface: 'product',
      variants: [
        { file: 'variants/error.vue' },
        { file: 'variants/repositories-loading.vue' },
        { file: 'variants/no-invoices.vue' }
      ]
    })
  ],
  'part-word': [
    [
      `${C}/input/select/select-option/select-option.vue`,
      `${C}/input/select/select-item/select-item.vue`
    ],
    sfc(''),
    sfc('')
  ],
  'part-export': null,
  'section-suffix': [
    [`${C}/section/hero-band/hero-band.vue`, `${C}/section/hero-section/hero-section.vue`],
    sfc(''),
    sfc('')
  ],
  'example-file': [
    'packages/webkit/examples/button/examples.json',
    pkg({ examples: [{ file: 'basic.vue' }, { file: 'types.vue' }, { file: 'read-only.vue' }] }),
    pkg({
      examples: [
        { file: 'default.vue' },
        { file: 'variants.vue' },
        { file: 'readonly.vue' },
        { file: 'with-addon-start.vue' }
      ]
    })
  ],
  'prop-name': [
    `${C}/action/button/button.vue`,
    sfc(
      "interface Props { kind?: 'primary'; current?: boolean; hideIcon?: boolean }\nwithDefaults(defineProps<Props>(), {})"
    ),
    sfc(
      "interface Props { variant?: 'primary'; active?: boolean; showIcon?: boolean; type?: 'button' }\nwithDefaults(defineProps<Props>(), {})"
    )
  ],
  'prop-value': [
    `${C}/action/button/button.vue`,
    sfc(
      "interface Props { variant?: 'primary' | 'outlined' | 'transparent'; iconPosition?: 'left' | 'right'; align?: 'top' | 'center' }\nwithDefaults(defineProps<Props>(), {})"
    ),
    sfc(
      "interface Props { variant?: 'primary' | 'outline' | 'ghost' | 'link'; iconPosition?: 'leading' | 'trailing'; align?: 'start' | 'center' | 'end' }\nwithDefaults(defineProps<Props>(), {})"
    )
  ],
  'model-shape': [
    `${C}/data/tree/tree.vue`,
    sfc(
      "const value = defineModel<string>('value')\nconst activeId = defineModel<string | null>('activeId')\nconst selected = defineModel<string>('selected')\nconst openKeys = defineModel<Record<string, boolean>>('openKeys')\ninterface Props { initialState?: object }\nwithDefaults(defineProps<Props>(), {})"
    ),
    sfc(
      "const model = defineModel<string>({ default: '' })\nconst activeKey = defineModel<string | null>('activeKey')\nconst selectedKey = defineModel<string>('selectedKey')\nconst openKeys = defineModel<string[]>('openKeys')\nconst open = defineModel<boolean>('open')\ninterface Props { defaultOpen?: boolean }\nwithDefaults(defineProps<Props>(), {})"
    )
  ],
  'event-name': [
    `${C}/data/tree/tree.vue`,
    sfc("const emit = defineEmits<{ 'item-dblclick': [event: MouseEvent]; finished: [] }>()"),
    sfc("const emit = defineEmits<{ 'item-double-click': [event: MouseEvent]; complete: [] }>()")
  ],
  'slot-name': [
    `${C}/input/input/input.vue`,
    sfc('defineSlots<{ prefix(): unknown; suffix(): unknown }>()'),
    sfc('defineSlots<{ leading(): unknown; trailing(): unknown; default(): unknown }>()')
  ],
  'type-name': [
    `${C}/action/button/button.vue`,
    sfc("export type ButtonVariant = 'primary'\nexport type Props = {}\nexport type Agent = 'x'"),
    sfc(
      "export type ButtonVariant = 'primary'\nexport type ButtonType = 'submit'\nexport interface ButtonProps {}"
    )
  ],
  'data-attribute': [
    `${C}/action/button/button.vue`,
    sfc('', '<div :data-kind="variant" :data-open="open || null" data-hasIcon="x" />'),
    sfc(
      '',
      '<div :data-variant="variant" :data-state="open ? \'open\' : \'closed\'" :data-testid="testId" />'
    )
  ],
  testid: [
    `${C}/action/button/button.vue`,
    sfc(
      "const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'actions-button')",
      '<span :data-testid="`${testId}-icon`" />'
    ),
    sfc(
      "const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'button')",
      '<span :data-testid="`${testId}__icon`" />'
    )
  ],
  'i18n-key': [
    'packages/webkit/src/locales/en.ts',
    "export const kbd = {\n  'arrow-up': 'Up'\n} as const\nexport const Feedback = {\n  Close: 'x'\n} as const\n",
    "export const kbd = {\n  arrowUp: 'Up'\n} as const\nexport const commandGroup = {\n  label: 'x'\n} as const\n"
  ],
  'injection-key': [
    `${C}/overlay/dialog/injection-key.ts`,
    "export const dialogContextKey: InjectionKey<Ctx> = Symbol('DialogContext')\nexport const DialogInjectionKey: InjectionKey<Ctx> = Symbol('DialogContext')\n",
    "export const DialogInjectionKey: InjectionKey<Ctx> = Symbol('Dialog')\nexport const DialogHeaderInjectionKey: InjectionKey<Ctx> = Symbol('DialogHeader')\n"
  ],
  'composable-file': [
    [`${C}/data/flow/connectors.ts`, `${C}/data/flow/composables/use-flow-connectors.ts`],
    'export function useFlowConnectors() { return 1 }\n',
    'export function useFlowConnectors() { return 1 }\n'
  ],
  'handler-name': [
    `${C}/action/button/button.vue`,
    sfc(
      'function handleClick() {}\nconst onKeyDown = () => {}\nfunction onDocumentPointerDown() {}'
    ),
    sfc(
      'function onClick() {}\nconst onKeydown = () => {}\nfunction onDocumentPointerdown() {}\nconst handleRef = ref(null)'
    )
  ],
  'dom-ref-name': [
    `${C}/action/button/button.vue`,
    sfc(
      'const buttonRef = ref<HTMLButtonElement | null>(null)',
      '<button ref="buttonRef" /><div ref="root" />'
    ),
    sfc(
      'const buttonEl = ref<HTMLButtonElement | null>(null)',
      '<button ref="buttonEl" /><li v-for="i in 3" ref="itemEls" /><Dialog ref="dialog" />'
    )
  ],
  'private-folder': [
    [`${C}/chart/_lib/scale.ts`, `${C}/chart/lib/scale.ts`],
    'export const x = 1\n',
    'export const x = 1\n'
  ],
  'css-variable': [
    `${C}/data/card-grid/card-grid.vue`,
    sfc('', '<div class="[--cols:3] [--card-grid-cols:2]" />'),
    sfc('', '<div class="[--card-grid-columns:3] [--tw-shadow:0]" />')
  ],
  'token-name': [
    `${C}/action/button/button.vue`,
    sfc(
      '',
      '<div class="gap-(--spacing-xxs) text-(--primary-contrast) text-code-sintax-keyword" />'
    ),
    sfc(
      '',
      '<div class="gap-(--spacing-2xs) text-(--primary-foreground) text-code-syntax-keyword" />'
    )
  ],
  'icon-name': [
    `${C}/action/button/button.vue`,
    sfc(
      '',
      '<i class="ai ai-times" /><i class="pi pi-search" /><i class="ai ai-cog" /><i class="ai ai-serch" /><i class="ai-cor ai-github" />'
    ),
    sfc('', '<i class="ai ai-x" /><i class="ai ai-settings" /><i class="ai-color ai-github" />')
  ],
  'file-name': [
    ['apps/docs/src/components/ApiTable.vue', 'apps/docs/src/components/api-table.vue'],
    sfc(''),
    sfc('')
  ],
  'script-name': [
    'packages/webkit/package.json',
    pkg({
      scripts: {
        'catalog:build': 'node scripts/build-catalog.mjs',
        smoke: 'node x.js',
        'check:naming': 'node scripts/naming.mjs'
      }
    }),
    pkg({
      scripts: {
        'build:catalog': 'node scripts/build-catalog.mjs',
        'check:naming': 'node scripts/check-naming.mjs',
        prepack: 'x',
        typecheck: 'vue-tsc'
      }
    })
  ],
  'filter-name': [
    'package.json',
    pkg({ scripts: { 'build:theme': 'pnpm --filter theme build' } }),
    pkg({ scripts: { 'build:theme': 'pnpm --filter @aziontech/theme build' } })
  ],
  'workflow-name': [
    ['.github/workflows/App_Icons.yml', '.github/workflows/deploy-icons-gallery.yml'],
    'name: Auto Author Assign\njobs:\n  a:\n    name: Patterns (G1) — every story\n    steps:\n      - name: run it\n',
    'name: Assign PR author\njobs:\n  a:\n    name: Governance Gate\n    steps:\n      - name: Install Playwright Chromium\n        with:\n          name: visual-report\n'
  ],
  'eslint-rule-name': [
    [
      'packages/webkit/src/eslint-plugin/rules/accessible-name.js',
      'packages/webkit/src/eslint-plugin/rules/require-accessible-name.js'
    ],
    'export default {}\n',
    'export default {}\n'
  ],
  'tooling-name': [
    ['.claude/skills/regen-baselines/SKILL.md', '.claude/skills/baselines-regenerate/SKILL.md'],
    '---\nname: x\n---\n',
    '---\nname: x\n---\n'
  ],
  'cli-name': [
    'packages/webkit-mcp/src/server.js',
    "tool('searchComponents', {})\ntool('patterns_get', {})\n",
    "tool('search_components', {})\ntool('get_block', {})\n"
  ]
}

for (const [rule, fixture] of Object.entries(FIXTURES)) {
  if (!fixture) continue
  const [where, badText, goodText] = fixture
  const [badRel, goodRel] = Array.isArray(where) ? where : [where, where]
  test(`${rule}: fires on the bad case, silent on the good case`, () => {
    assert.ok(hits(badRel, badText, rule).length > 0, `${rule} did not fire on ${badRel}`)
    assert.deepEqual(
      hits(goodRel, goodText, rule).map((x) => x.message),
      [],
      `${rule} fired on the good case`
    )
  })
}

test('false positives the checker skips: test artifacts, element ids, kept tokens, migration tooling', () => {
  assert.deepEqual(
    checkFile(
      'packages/webkit/src/components/action/button/__screenshots__/Button Default 1.png',
      '',
      ctx
    ),
    []
  )
  assert.deepEqual(
    hits(
      `${C}/action/button/button.vue`,
      sfc('', `<input :aria-describedby="error ? 'data-stream-apiKey-message' : undefined" />`),
      'data-attribute'
    ),
    []
  )
  assert.equal(
    hits(`${C}/action/button/button.vue`, sfc('', '<div :data-hasIcon="x" />'), 'data-attribute')
      .length,
    1
  )
  assert.deepEqual(
    hits(
      `${C}/overlay/tooltip/tooltip.vue`,
      sfc('', '<div class="bg-(--bg-contrast) text-(--text-contrast)" />'),
      'token-name'
    ),
    []
  )
  const legacy = "const help = 'pi pi-times becomes ai ai-x; ai-cor becomes ai-color'\n"
  for (const rel of [
    'packages/webkit/src/cli/cli.js',
    'packages/webkit/src/cli/migrate.js',
    'packages/webkit/src/cli/migrations/v6-icons.js'
  ])
    assert.deepEqual(hits(rel, legacy, 'icon-name'), [], rel)
  assert.ok(hits('packages/webkit/src/cli/add.js', legacy, 'icon-name').length > 0)
})

test('handler-name: sample code inside a template literal is not a handler', () => {
  const rel = `${C}/content/code-panel/code-panel.vue`
  const text = sfc('const CODE = `async function handleRequest(request) {\n  return request\n}`')
  assert.deepEqual(hits(rel, text, 'handler-name'), [])
  assert.equal(hits(rel, sfc('async function handleRequest() {}'), 'handler-name').length, 1)
})

test('css-variable: a component may set a variable another component or the theme owns', () => {
  const owned = {
    ...ctx,
    cssVarReaders: new Map([
      ['texture-pool-a', new Set(['texture'])],
      ['cols', new Set(['card-grid'])]
    ]),
    themeVars: new Set(['bg-canvas', 'popup-origin', 'text-label-lg-font-weight'])
  }
  const rel = `${C}/section/hero-section/hero-section.vue`
  const text = sfc(
    '',
    '<div class="[--texture-pool-a:1%] [--bg-canvas:red] [--popup-origin:top] [--text-label-lg-font-weight:500] [--cols:2]" />'
  )
  const found = checkFile(rel, text, owned)
    .filter((x) => x.rule === 'css-variable')
    .map((x) => x.message.match(/"--([a-z0-9-]+)"/)[1])
  assert.deepEqual([...new Set(found)], ['cols'])
})

test('every rule in the registry has a fixture, and no fixture names an unknown rule', () => {
  assert.deepEqual(Object.keys(FIXTURES).sort(), Object.keys(RULES).sort())
})

test('block-id: an id that does not match its folder is the enforced block check', () => {
  const v = scanRepo(ROOT, loadContext(ROOT)).filter((x) => x.rule === 'block-id')
  assert.deepEqual(v, [])
})

test('part-export: a part folder with no export of its own is reported', () => {
  const v = checkPartExports(ctx)
  assert.deepEqual(
    v.map((x) => x.message.match(/"(\S+)"/)[1]),
    ['dialog-footer']
  )
})

test('token-name: every fill colour needs a -foreground pair', () => {
  assert.deepEqual(
    checkFillPairs(ctx.tokenKeys).map((x) => x.message.match(/"--(\S+)"/)[1]),
    ['danger']
  )
})

test('the part-word rule knows Tabs, Body and declared domain parts', () => {
  const part = (rel) => hits(rel, sfc(''), 'part-word').length
  assert.equal(part(`${C}/navigation/tabs/tabs-item/tabs-item.vue`), 1)
  assert.equal(part(`${C}/navigation/tabs/tabs-trigger/tabs-trigger.vue`), 0)
  assert.equal(part(`${C}/data/card/card-body/card-body.vue`), 1)
  assert.equal(part(`${C}/overlay/dialog/dialog-body/dialog-body.vue`), 0)
  assert.equal(part(`${C}/data/table/table-row/table-row.vue`), 0)
  assert.equal(part(`${C}/data/table/table-head-cell/table-head-cell.vue`), 0)
})

test('the group-label rule applies only to group parts', () => {
  const props = [{ name: 'title', type: 'string' }]
  assert.equal(checkPropVocabulary(props, { stage: 'all', component: 'command-group' }).length, 1)
  assert.equal(checkPropVocabulary(props, { stage: 'all', component: 'command' }).length, 0)
})

test('the enforced stage blocks the finished vocabulary; staged entries are reported only', () => {
  const props = [
    { name: 'kind', type: "'primary'" },
    { name: 'variant', type: "'outline' | 'ghost'" },
    { name: 'status', type: "'success'" },
    { name: 'current', type: 'boolean' }
  ]
  assert.deepEqual(
    checkPropVocabulary(props).map((x) => x.prop),
    ['kind', 'current']
  )
  const all = checkPropVocabulary(props, { stage: 'all' })
  assert.deepEqual(
    all.map((x) => [x.prop, x.staged]),
    [
      ['kind', false],
      ['current', false]
    ]
  )
  assert.equal(
    checkPropVocabulary([{ name: 'variant', type: "'primary' | 'outlined' | 'transparent'" }])[0]
      ?.rule,
    'prop-value'
  )
  assert.equal(checkPropVocabulary([{ name: 'appearance' }]).length, 1)
  assert.equal(checkPropVocabulary([{ name: 'severity', type: "'error'" }]).length, 1)
  assert.equal(checkPropVocabulary([{ name: 'status', type: "'done' | 'failed'" }]).length, 1)
  assert.equal(checkPropVocabulary([{ name: 'iconPosition', type: "'left'" }]).length, 1)
  assert.equal(checkPropVocabulary([{ name: 'hideOperations', type: 'boolean' }]).length, 1)
  assert.equal(checkPropVocabulary([{ name: 'expandedKeys', type: 'string[]' }]).length, 1)
  assert.equal(checkEventVocabulary([{ name: 'item-dblclick' }]).length, 1)
  assert.equal(checkSlotVocabulary([{ name: 'prefix' }])[0].staged, false)
  assert.equal(checkDataAttributes(['data-open'])[0].staged, true)
})

test('the catalog vocabulary stamps the 6.0 standard', () => {
  const snap = vocabularySnapshot()
  const look = snap.props.find((p) => p.canonical === 'variant')
  assert.ok(look.aliases.includes('kind'))
  assert.equal(snap.values.variant.outlined, 'outline')
  assert.ok(!snap.props.some((p) => p.aliases.includes('status')))
})

test('the switch is on: every rule blocks, staged and enforced alike', () => {
  assert.equal(NAMING_STAGED_BLOCKS, true)
  assert.equal(isBlocking('export-kebab'), true)
  assert.equal(isBlocking('prop-name'), true)
  assert.equal(isBlocking('css-variable'), true)
})

test('addedViolations counts only what a write adds', () => {
  const a = { rule: 'handler-name', message: 'm1' }
  const b = { rule: 'handler-name', message: 'm2' }
  assert.deepEqual(addedViolations([a], [a, b]), [b])
  assert.deepEqual(addedViolations([a, a], [a]), [])
})

test('the repo scan is clean on every rule', () => {
  const counts = countByRule(scanRepo(ROOT, loadContext(ROOT)))
  assert.deepEqual(Object.keys(counts).sort(), Object.keys(RULES).sort())
  for (const [id, n] of Object.entries(counts)) assert.equal(n, 0, `${id} must be clean`)
})

const hook = (input, env = {}) =>
  spawnSync('node', ['.claude/hooks/validate-naming.mjs'], {
    cwd: ROOT,
    input: JSON.stringify(input),
    encoding: 'utf8',
    env: { ...process.env, ...env }
  })

test('validate-naming hook: blocks an added violation of any rule', () => {
  const add = {
    tool_name: 'Edit',
    tool_input: {
      file_path: 'packages/webkit/package.json',
      old_string: '"./button":',
      new_string: '"./Button": "./x.vue",\n    "./button":'
    }
  }
  const blocked = hook(add)
  assert.equal(blocked.status, 2)
  assert.match(blocked.stderr, /\[export-kebab\]/)
  const write = {
    tool_name: 'Write',
    tool_input: {
      file_path: `${C}/input/fresh/fresh.vue`,
      content: sfc('function handleClick() {}')
    }
  }
  const staged = hook(write)
  assert.equal(staged.status, 2)
  assert.match(staged.stderr, /\[handler-name\]/)
  const clean = {
    ...write,
    tool_input: { ...write.tool_input, content: sfc('function onClick() {}') }
  }
  assert.equal(hook(clean).status, 0)
})

test('validate-naming hook: an edit that keeps existing debt is not blocked, and bad input fails open', () => {
  const keep = {
    tool_name: 'Edit',
    tool_input: {
      file_path: 'packages/webkit/package.json',
      old_string: '"./button":',
      new_string: '"./button":'
    }
  }
  assert.equal(hook(keep, { WEBKIT_NAMING_STRICT: '1' }).status, 0)
  const broken = spawnSync('node', ['.claude/hooks/validate-naming.mjs'], {
    cwd: ROOT,
    input: 'not json',
    encoding: 'utf8'
  })
  assert.equal(broken.status, 0)
})

const BTN = `${C}/action/button/button.vue`
const valueHits = (rel, script) =>
  checkFile(rel, sfc(script), ctx)
    .filter((x) => x.rule === 'prop-value')
    .map((x) => x.message)

test('prop-value: a variant union reads only shared values or documented extras', () => {
  assert.equal(
    valueHits(BTN, "interface Props { variant?: 'primary' | 'ghost' | 'link' }").length,
    0
  )
  assert.equal(
    valueHits(BTN, "interface Props { variant?: 'primary' | 'fancy' }").length,
    1,
    'an undocumented look fires'
  )
  const avatar = `${C}/content/avatar/avatar.vue`
  assert.equal(valueHits(avatar, "interface Props { variant?: 'circle' | 'square' }").length, 0)
  assert.equal(valueHits(avatar, "interface Props { variant?: 'circle' | 'hexagon' }").length, 1)
})

test('prop-value: a variant made only of alignment words must be align', () => {
  const msg = checkValueSet('variant', ['start', 'center', 'split'], 'section-title')
  assert.match(msg, /name the prop "align"/)
  assert.match(checkValueSet('titleVariant', ['start', 'center'], 'process-scroll'), /align/)
  assert.equal(checkValueSet('variant', ['primary', 'outline'], 'button'), null)
})

test('prop-value: severity, status and orientation use their closed sets', () => {
  assert.equal(checkValueSet('severity', ['info', 'danger'], 'alert'), null)
  assert.match(checkValueSet('severity', ['error'], 'alert'), /severity set/)
  assert.equal(checkValueSet('status', ['pending', 'running', 'success'], 'stepper'), null)
  assert.match(checkValueSet('status', ['done'], 'stepper'), /status set/)
  assert.equal(checkValueSet('status', ['ready', 'pending'], 'prompt-input'), null)
  assert.equal(checkValueSet('orientation', ['horizontal', 'vertical'], 'resizable'), null)
  assert.match(checkValueSet('orientation', ['diagonal'], 'resizable'), /orientation set/)
  assert.equal(checkValueSet('orientation', ['vertical', 'responsive'], 'field'), null)
})

test('prop-value: unions resolve through imported aliases and Exclude/Extract', () => {
  const types = new Map([['Severity', "'neutral' | 'info' | 'success' | 'warning' | 'danger'"]])
  const resolve = unionResolver("type AlertSeverity = Exclude<Severity, 'neutral'>", types)
  assert.deepEqual(resolve('AlertSeverity'), ['info', 'success', 'warning', 'danger'])
  assert.deepEqual(resolve("Extract<Severity, 'info' | 'danger'>"), ['info', 'danger'])
  assert.equal(resolve('string'), null)
  const withTypes = { ...ctx, types }
  const imported = sfc(
    "import type { Severity } from '../../../utils/severity'\ntype BadgeSeverity = Severity | 'error'\ninterface Props { severity?: BadgeSeverity }"
  )
  const rel = `${C}/content/badge/badge.vue`
  assert.equal(checkFile(rel, imported, withTypes).filter((x) => x.rule === 'prop-value').length, 1)
  const clean = imported.replace(" | 'error'", '')
  assert.equal(checkFile(rel, clean, withTypes).filter((x) => x.rule === 'prop-value').length, 0)
})

test('prop-value: a public prop union never names physical sides outside the picture-edge allowlist', () => {
  assert.equal(valueHits(BTN, "interface Props { edge?: 'left' | 'right' }").length, 1)
  assert.equal(
    valueHits(
      BTN,
      "type ButtonCorner = 'top-left' | 'bottom-right'\ninterface Props { corner?: ButtonCorner }"
    ).length,
    1,
    'a corner word through a local alias fires'
  )
  assert.equal(
    valueHits(
      BTN,
      "type ButtonEdges = 'all' | ButtonEdge[]\ntype ButtonEdge = 'top' | 'left'\ninterface Props { edges?: boolean | ButtonEdges }"
    ).length,
    1,
    'a nested alias and an array still fire'
  )
  assert.equal(valueHits(BTN, "interface Props { edge?: 'start' | 'end' }").length, 0)
  const map = `${C}/content/network-map/network-map.vue`
  assert.equal(
    valueHits(
      map,
      "export type NetworkMapFade = 'none' | 'left' | 'right'\ninterface Props { fade?: NetworkMapFade }"
    ).length,
    0,
    'a picture edge on the allowlist stays silent'
  )
  const frame = `${C}/layout/registration-frame/registration-frame.vue`
  assert.equal(
    valueHits(
      frame,
      "export type RegistrationFrameSide = 'top' | 'right' | 'bottom' | 'left'\nexport type RegistrationFrameSides = 'all' | 'none' | RegistrationFrameSide | RegistrationFrameSide[]\ninterface Props { borders?: RegistrationFrameSides; flush?: boolean | RegistrationFrameSides }"
    ).length,
    0,
    'a union built from an allowlisted side stays silent'
  )
  assert.equal(
    valueHits(
      frame,
      "export type RegistrationFrameSide = 'top' | 'left'\ninterface Props { borders?: RegistrationFrameSide | 'right' }"
    ).length,
    1,
    'a physical word added beside the allowlisted type still fires'
  )
  assert.deepEqual(
    PHYSICAL_EDGE_TYPES.filter((t) => /Fade$|Side$/.test(t)),
    ['NetworkMapFade', 'ConsoleMockupShellFade', 'TextureFade', 'RegistrationFrameSide']
  )
})

test('prop-value: size unions are ordered subsets of the size scale, also through an alias', () => {
  assert.equal(
    valueHits(BTN, "type ButtonSize = 'small' | 'large'\ninterface Props { size?: ButtonSize }")
      .length,
    0
  )
  assert.equal(
    valueHits(BTN, "type ButtonSize = 'large' | 'small'\ninterface Props { size?: ButtonSize }")
      .length,
    1
  )
  assert.equal(valueHits(BTN, "interface Props { iconSize?: 'sm' | 'md' }").length, 1)
})

test('prop-value: an exported severity type derives from Severity instead of re-listing it', () => {
  const rel = `${C}/feedback/alert/alert.vue`
  assert.equal(
    checkAxisTypes(rel, "export type AlertSeverity = 'info' | 'danger'", ['alert']).length,
    1
  )
  assert.equal(
    checkAxisTypes(rel, "export type AlertSeverity = Exclude<Severity, 'neutral'>", ['alert'], {
      types: new Map([['Severity', "'neutral' | 'info' | 'success' | 'warning' | 'danger'"]])
    }).length,
    0
  )
  assert.equal(
    checkAxisTypes(rel, "export type JobStatus = 'starting' | 'idle'", ['alert']).length,
    1,
    'an exported status type outside the set fires'
  )
})

test('type-name: a union the file declares for an axis prop is <Component><Axis>', () => {
  const typeHits = (script) =>
    checkFile(BTN, sfc(script), ctx)
      .filter((x) => x.rule === 'type-name')
      .map((x) => x.message)
  assert.equal(typeHits("type RangeSize = 'small'\ninterface Props { size?: RangeSize }").length, 1)
  assert.equal(
    typeHits("type ButtonSize = 'small'\ninterface Props { size?: ButtonSize }").length,
    0
  )
  assert.equal(
    typeHits(
      "import type { IconButtonSize } from '../icon-button/icon-button.vue'\ninterface Props { size?: IconButtonSize }"
    ).length,
    0,
    'a reused imported union is fine'
  )
})

test('model-shape: models are read from defineModel, default and named', () => {
  assert.deepEqual(
    extractModels(
      "const a = defineModel<string>({ default: '' })\nconst b = defineModel<Record<string, boolean>>('rowSelection')\nconst c = defineModel('open')"
    ).map((m) => [m.name, m.type]),
    [
      ['modelValue', 'string'],
      ['rowSelection', 'Record<string, boolean>'],
      ['open', '']
    ]
  )
})

test('model-shape: one concept binds one name and one type', () => {
  const modelHits = (script) =>
    checkFile(`${C}/data/tree/tree.vue`, sfc(script), ctx).filter((x) =>
      ['model-shape', 'prop-name'].includes(x.rule)
    )
  assert.equal(
    modelHits("const s = defineModel<Record<string, boolean>>('rowSelection')").length,
    1
  )
  assert.equal(modelHits("const s = defineModel<string[]>('selectedKeys')").length, 0)
  assert.equal(modelHits("const s = defineModel<number[]>('selectedKeys')").length, 1)
  assert.equal(modelHits("const s = defineModel<string>('selectedKey')").length, 0)
  assert.equal(modelHits("const s = defineModel<ExpandedState>('expanded')").length, 1)
  assert.equal(modelHits("const p = defineModel<PaginationState>('pagination')").length, 1)
  assert.equal(modelHits("const p = defineModel<number>('page')").length, 0)
  assert.equal(modelHits("const p = defineModel<string>('page')").length, 1)
  assert.equal(modelHits("const o = defineModel<string>('open')").length, 1)
  assert.equal(modelHits("const o = defineModel<boolean>('toolsOpen')").length, 0)
  assert.equal(modelHits("const a = defineModel<string | null>('active')").length, 1)
  assert.equal(modelHits("const a = defineModel<boolean>('active')").length, 0)
  assert.equal(modelHits("const s = defineModel<TableStateSnapshot>('state')").length, 1)
  assert.equal(modelHits('interface Props { initialState?: object }').length, 1)
  assert.equal(modelHits('interface Props { defaultSnapshot?: object }').length, 0)
})

test('model-shape: templates never bind v-model:value or a banned model name', () => {
  const tpl = (body) => sfc('', body)
  const rel = 'packages/webkit/examples/tree/default.vue'
  assert.equal(checkTemplateModels(rel, tpl('<Tabs v-model:value="tab" />')).length, 1)
  assert.equal(checkTemplateModels(rel, tpl('<DataTable v-model:row-selection="s" />')).length, 1)
  assert.equal(checkTemplateModels(rel, tpl('<DataTable v-model:expanded="s" />')).length, 1)
  assert.equal(checkTemplateModels(rel, tpl('<Tabs v-model="tab" />')).length, 0)
  assert.equal(checkTemplateModels(rel, tpl('<DataTable v-model:selected-keys="s" />')).length, 0)
})
