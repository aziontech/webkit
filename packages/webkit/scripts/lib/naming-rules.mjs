import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

import {
  MODELS,
  SEVERITY_EXTRAS,
  canonicalFor,
  checkValueSet,
  checkDataAttributes,
  checkEventVocabulary,
  checkPropVocabulary,
  checkSlotVocabulary
} from '../../../../.claude/hooks/lib/prop-vocabulary.mjs'
import {
  getSection,
  parseTable,
  parseTable2,
  parseVueSfc,
  resolveTypeUnion
} from '../../../../.claude/hooks/lib/spec.mjs'
import { checkSubpaths, checkSynonyms, retiredNames } from './naming.mjs'

export const NAMING_STAGED_BLOCKS = true

export const RULE_DOC = '.claude/rules/naming.md'

export const RULES = {
  'export-kebab': { stage: 'enforced', decision: 'N18', surface: 'export and block ids' },
  'block-id': { stage: 'enforced', decision: 'N9', surface: 'block.json id' },
  'export-synonym': { stage: 'enforced', decision: 'N18', surface: 'export names' },
  'export-retired': { stage: 'enforced', decision: 'N12', surface: 'export names' },
  'near-duplicate': {
    stage: 'staged',
    decision: 'N12/N18',
    surface: 'component, part, block, example and CSS names'
  },
  'export-category': { stage: 'staged', decision: 'N11', surface: 'export keys' },
  'category-folder': { stage: 'staged', decision: 'N11', surface: 'component category folders' },
  'block-path': { stage: 'staged', decision: 'N9', surface: 'block folders' },
  'block-word': {
    stage: 'staged',
    decision: 'N9',
    surface: 'block titles, MCP tools, catalog keys'
  },
  'block-state': { stage: 'staged', decision: 'N10', surface: 'block variant files' },
  'block-group-first': { stage: 'staged', decision: 'WN07', surface: 'block folders and ids' },
  'part-word': { stage: 'staged', decision: 'N8', surface: 'sub-component folders' },
  'part-export': { stage: 'staged', decision: 'N8', surface: 'sub-component exports' },
  'section-suffix': {
    stage: 'staged',
    decision: 'N12/WN-S01',
    surface: 'marketing page sections, and the word section elsewhere'
  },
  'docs-prefix': { stage: 'staged', decision: 'WN04', surface: 'documentation components' },
  'example-file': { stage: 'staged', decision: 'N13', surface: 'example files' },
  'prop-name': { stage: 'staged', decision: 'N1/N5/N6/api-76', surface: 'props in .vue and specs' },
  'prop-value': { stage: 'staged', decision: 'N2/N3/N5/N7', surface: 'prop value unions' },
  'model-shape': { stage: 'staged', decision: 'N6', surface: 'two-way models and their seeds' },
  'event-name': { stage: 'staged', decision: 'N18', surface: 'emitted events' },
  'slot-name': { stage: 'staged', decision: 'N7', surface: 'slots' },
  'type-name': { stage: 'staged', decision: 'N1', surface: 'exported types' },
  'data-attribute': { stage: 'staged', decision: 'N1/N6/N7', surface: 'data-* attributes' },
  testid: { stage: 'staged', decision: 'N11', surface: 'data-testid fallbacks' },
  'i18n-key': { stage: 'staged', decision: 'N18', surface: 'locale catalog keys' },
  'injection-key': { stage: 'staged', decision: 'N16', surface: 'provide/inject keys' },
  'composable-file': { stage: 'staged', decision: 'N16', surface: 'composable files' },
  'handler-name': { stage: 'staged', decision: 'N16', surface: 'event handler functions' },
  'dom-ref-name': { stage: 'staged', decision: 'N16', surface: 'template refs' },
  'private-folder': { stage: 'staged', decision: 'N16', surface: 'private helper folders' },
  'css-variable': { stage: 'staged', decision: 'N16', surface: 'component CSS variables' },
  'token-name': { stage: 'staged', decision: 'N4/N15', surface: 'theme tokens and utilities' },
  'icon-name': { stage: 'staged', decision: 'N14', surface: 'icon classes and files' },
  'file-name': { stage: 'staged', decision: 'N18', surface: 'files and folders' },
  'script-name': { stage: 'staged', decision: 'N17', surface: 'package.json scripts' },
  'filter-name': { stage: 'staged', decision: 'N17', surface: 'pnpm --filter arguments' },
  'workflow-name': { stage: 'staged', decision: 'N17', surface: 'CI workflows, jobs and steps' },
  'eslint-rule-name': { stage: 'staged', decision: 'N17', surface: 'ESLint rule names' },
  'tooling-name': {
    stage: 'staged',
    decision: 'N17',
    surface: 'skills, agents, commands and hooks'
  },
  'cli-name': { stage: 'staged', decision: 'N9/N17', surface: 'CLI commands and MCP tools' }
}

export function isBlocking(rule, { strict = false } = {}) {
  return RULES[rule]?.stage === 'enforced' || strict || NAMING_STAGED_BLOCKS
}

const CATEGORIES = [
  'action',
  'ai',
  'chart',
  'code',
  'content',
  'data',
  'docs',
  'feedback',
  'input',
  'layout',
  'marketing',
  'navigation',
  'overlay',
  'section',
  'provider'
]

const CATEGORY_RENAMES = {
  actions: 'action',
  inputs: 'input',
  sections: 'section',
  charts: 'chart',
  overlays: 'overlay',
  utils: 'feedback (spinner) or provider (config-provider)',
  templates: '(no such category)',
  documentation: 'docs'
}

const BLOCK_GROUPS = [
  'account',
  'ai',
  'auth',
  'create',
  'dashboard',
  'detail',
  'edit',
  'settings',
  'state',
  'view',
  'shell',
  'top-bar'
]

const BLOCK_GROUP_RENAMES = {
  states: 'state',
  shells: 'shell',
  'top-bars': 'top-bar',
  delete: 'edit',
  dashboards: 'dashboard',
  forms: 'create or edit',
  lists: 'view',
  overlays: 'create or edit',
  headers: 'top-bar'
}

const BLOCK_SURFACES = ['platform', 'product', 'app', 'console', 'site', 'website', 'docs']

const BLOCK_STATE_WORDS = {
  failed: 'error',
  failure: 'error',
  fail: 'error',
  errored: 'error',
  done: 'success',
  finished: 'success',
  succeeded: 'success',
  ok: 'success',
  complete: 'success',
  completed: 'success',
  blank: 'empty',
  spinner: 'loading'
}

const STATE_WORDS = ['loading', 'empty', 'error', 'success']

const PART_WORDS = [
  'trigger',
  'content',
  'header',
  'body',
  'footer',
  'title',
  'description',
  'close',
  'item',
  'group',
  'label',
  'separator',
  'list'
]

const DOMAIN_PARTS = {
  'bento-grid': ['cell'],
  'card-grid': ['cell'],
  carousel: ['next', 'previous'],
  chart: [
    'area',
    'axis',
    'bar',
    'brush',
    'crosshair',
    'grid',
    'legend',
    'line',
    'reference',
    'scatter',
    'tooltip'
  ],
  'chart-card': ['action', 'controls', 'handle'],
  'chat-message': ['actions', 'feedback'],
  'link-directory': ['column'],
  'console-layout': ['breadcrumb'],
  'console-mockup': ['shell'],
  'context-menu': ['sub'],
  command: ['empty', 'input', 'page'],
  'data-table': [
    'cell',
    'row',
    'column',
    'toolbar',
    'search',
    'filter',
    'export',
    'button',
    'pagination',
    'more'
  ],
  'date-picker': ['clear'],
  'dropdown-menu': ['sub'],
  field: ['error', 'legend', 'set'],
  'flow-diagram': ['anchor', 'bind', 'node'],
  footer: ['column', 'link'],
  'input-group': ['addon', 'input'],
  item: ['actions', 'media'],
  'log-viewer': ['steps'],
  pagination: ['button', 'size'],
  'prompt-input': ['button', 'picker', 'tools'],
  resizable: ['handle', 'pane'],
  'sidebar-menu': ['back', 'sub'],
  stepper: ['step'],
  table: [
    'actions',
    'body',
    'button',
    'caption',
    'cell',
    'export',
    'filter',
    'id',
    'link',
    'row',
    'search',
    'status',
    'tags',
    'time',
    'toolbar'
  ],
  toast: ['action'],
  'transfer-list': ['controls', 'source', 'target'],
  'tutorial-panel': ['hotspot', 'provider'],
  wizard: ['step']
}

const PART_RENAMES = {
  option: 'item',
  panel: 'content',
  overlay: 'nothing (Content renders the overlay)',
  portal: 'nothing (Content renders the portal)',
  chips: 'chip-group',
  breadcrumbs: 'breadcrumb',
  dismiss: 'close',
  options: 'items'
}

const BODY_ROOTS = ['dialog', 'drawer', 'panel']

const TABS_PARTS = {
  list: 'list',
  trigger: 'trigger',
  content: 'content',
  item: 'trigger',
  panel: 'content'
}

const ABBREVIATIONS = {
  btn: 'button',
  img: 'image',
  nav: 'navigation',
  cols: 'columns',
  col: 'column',
  desc: 'description',
  msg: 'message',
  util: 'lib',
  utils: 'lib',
  prev: 'previous',
  num: 'number',
  txt: 'text',
  pic: 'image',
  dlg: 'dialog',
  ctx: 'context',
  attr: 'attribute',
  attrs: 'attributes',
  sel: 'select',
  regen: 'regenerate',
  genai: 'ai',
  ds: '(spell it out)'
}

const SYNONYMS = {
  modal: 'dialog',
  sheet: 'drawer',
  popup: 'popover',
  snackbar: 'toast',
  notification: 'toast',
  loader: 'spinner',
  ticker: 'marquee',
  overline: 'eyebrow',
  helper: 'description (Field.Description)'
}

const NAME_WORD_EXEMPT = new Set([
  'template-gallery-section',
  'create-deploy-template',
  'view-template-browser'
])

const PLURAL_ROOTS_ALLOWED = new Set(['tabs', 'steps', 'settings', 'stats', 'news'])

const EXAMPLE_RENAMES = {
  types: 'variants',
  type: 'variants',
  kinds: 'variants',
  kind: 'variant',
  basic: 'default',
  overview: 'default',
  playground: 'default',
  demo: 'default',
  sample: 'default',
  example: 'default',
  usage: 'default',
  simple: 'default',
  read: 'readonly (read-only)',
  grouped: 'groups',
  levels: 'severities',
  outlined: 'outline',
  transparent: 'ghost',
  prefix: 'leading',
  suffix: 'trailing',
  left: 'start',
  right: 'end',
  current: 'active',
  expanded: 'open',
  failed: 'error',
  failure: 'error'
}

const SCRIPT_VERBS = [
  'build',
  'check',
  'test',
  'lint',
  'format',
  'dev',
  'preview',
  'serve',
  'clean',
  'update',
  'generate',
  'release',
  'publish',
  'pack',
  'sync',
  'run',
  'deploy',
  'typecheck',
  'gates',
  'start',
  'watch'
]

const LIFECYCLE_SCRIPTS = new Set([
  'prepare',
  'prepack',
  'postpack',
  'prepublishOnly',
  'preinstall',
  'install',
  'postinstall',
  'pretest',
  'posttest',
  'prebuild',
  'postbuild',
  'predev'
])

const ESLINT_PREFIXES = ['no', 'prefer', 'require', 'valid', 'consistent']

const REQUIRED_CHECKS = new Set(['OSSF Scorecard', 'Governance Gate'])

const WORKFLOW_BANNED_WORDS = ['storybook', 'stories', 'story', 'chromatic']

const SKILL_VERBS = [
  'add',
  'audit',
  'build',
  'check',
  'craft',
  'create',
  'decide',
  'extract',
  'fix',
  'map',
  'migrate',
  'new',
  'open',
  'regenerate',
  'release',
  'remove',
  'report',
  'review',
  'run',
  'scaffold',
  'sync',
  'test',
  'update',
  'validate',
  'verify',
  'write'
]

const HOOK_VERBS = ['validate', 'enforce', 'check']

const MCP_VERBS = ['list', 'get', 'search', 'suggest', 'check', 'validate', 'explain', 'find']

const LEGACY_ICON_WORDS = {
  times: 'x',
  bars: 'menu',
  cog: 'settings',
  angle: 'chevron',
  pratices: 'practices',
  scizors: 'scissors',
  cor: 'color'
}

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/
const CAMEL = /^[a-z][a-zA-Z0-9]*$/
const DOC_FILE = /^[A-Z][A-Z0-9_]*\.md$/
const LOCALE_TAG = /^[a-z]{2,3}(-[A-Z]{2})?$/
const FILE_NAME_EXEMPT = new Set([
  'SKILL.md',
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
  'AGENTS.md',
  'CLAUDE.md',
  'Dockerfile'
])

const kebabToPascal = (s) =>
  s
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
const kebabToCamel = (s) => {
  const p = kebabToPascal(s)
  return p.charAt(0).toLowerCase() + p.slice(1)
}
const words = (s) => String(s).split(/[-_.]/).filter(Boolean)
const lineOf = (text, index) => (index < 0 ? 1 : text.slice(0, index).split('\n').length)

function v(rule, file, line, message) {
  return { rule, file, line, message }
}

function wordProblem(word) {
  if (Object.hasOwn(ABBREVIATIONS, word))
    return `the abbreviation "${word}" (say "${ABBREVIATIONS[word]}")`
  if (Object.hasOwn(SYNONYMS, word))
    return `the synonym "${word}" (the standard word is "${SYNONYMS[word]}")`
  return null
}

function nameWordProblems(name) {
  if (NAME_WORD_EXEMPT.has(name)) return []
  return words(name).map(wordProblem).filter(Boolean)
}

function componentPath(rel) {
  const m = rel.match(/^packages\/webkit\/src\/components\/(.+)$/)
  if (!m) return null
  const segs = m[1].split('/')
  return { category: segs[0], root: segs[1] ?? null, segs, file: segs[segs.length - 1] }
}

const isTest = (rel) =>
  /\.(test|spec)\.[cm]?[jt]s$|(^|\/)(test|__tests__|fixtures|__snapshots__|__screenshots__)\//.test(
    rel
  )

function checkComponentPath(rel, ctx = {}) {
  const cp = componentPath(rel)
  if (!cp) return []
  const out = []
  const { category, root, segs, file } = cp
  const isRootFile = root && file === `${root}.vue` && segs.length === 3
  if (isRootFile && !CATEGORIES.includes(category)) {
    const to = CATEGORY_RENAMES[category]
    out.push(
      v(
        'category-folder',
        rel,
        1,
        `category folder "${category}" is not in the singular list (${to ? `use "${to}"` : CATEGORIES.join(', ')}) (${RULE_DOC}).`
      )
    )
  }
  for (const seg of segs.slice(0, -1)) {
    if (seg === '_lib' || seg === 'utils' || seg === 'helpers' || seg === 'util')
      out.push(
        v('private-folder', rel, 1, `private helper folder "${seg}" must be "lib/" (${RULE_DOC}).`)
      )
  }
  if (!root || !file.endsWith('.vue')) return out
  const stem = file.replace(/\.vue$/, '')
  const folder = segs[segs.length - 2]
  if (isRootFile && (category === 'sections' || category === 'section'))
    out.push(...sectionSuffixProblems(rel, stem))
  else if (isRootFile) out.push(...sectionWordProblems(rel, stem))
  if (isRootFile) out.push(...docsPrefixProblems(rel, category, stem))
  for (const problem of nameWordProblems(stem))
    out.push(v('near-duplicate', rel, 1, `component "${stem}" uses ${problem} (${RULE_DOC}).`))
  if (stem === root || folder !== stem || segs.length < 4) return out
  if (!stem.startsWith(`${root}-`)) {
    out.push(v('part-word', rel, 1, `part "${stem}" must be named "${root}-<part>" (${RULE_DOC}).`))
    return out
  }
  const part = stem.slice(root.length + 1)
  const last = part.split('-').pop()
  if (root === 'tabs') {
    if (TABS_PARTS[part] !== part)
      out.push(
        v(
          'part-word',
          rel,
          1,
          `Tabs parts are List, Trigger and Content only — "${part}" ${TABS_PARTS[part] ? `is "${TABS_PARTS[part]}"` : 'is not one'} (${RULE_DOC}).`
        )
      )
    return out
  }
  const domain = DOMAIN_PARTS[root] || []
  if (domain.includes(last)) return out
  if (Object.hasOwn(PART_RENAMES, last)) {
    out.push(
      v(
        'part-word',
        rel,
        1,
        `part word "${last}" in "${stem}" — use ${PART_RENAMES[last]} (${RULE_DOC}).`
      )
    )
    return out
  }
  if (last === 'body' && !BODY_ROOTS.includes(root)) {
    out.push(
      v(
        'part-word',
        rel,
        1,
        `"Body" is only the scrolling middle of Dialog, Drawer and Panel — "${stem}" uses Content (${RULE_DOC}).`
      )
    )
    return out
  }
  if (!PART_WORDS.includes(last)) {
    out.push(
      v(
        'part-word',
        rel,
        1,
        `part "${stem}" ends in "${last}", which is not a part word (${PART_WORDS.join(', ')}) nor a declared domain part of ${root} (DOMAIN_PARTS in scripts/lib/naming-rules.mjs) (${RULE_DOC}).`
      )
    )
  }
  return out
}

const SECTION_WRAPPER_WORDS = ['band', 'stack', 'block', 'module', 'strip']

function docsPrefixProblems(rel, category, stem) {
  const inDocs = category === 'docs' || category === 'documentation'
  if (inDocs === stem.startsWith('doc-')) return []
  return [
    v(
      'docs-prefix',
      rel,
      1,
      inDocs
        ? `documentation component "${stem}" must start with "doc-" — name it "doc-${stem}" (${RULE_DOC}).`
        : `"${stem}" starts with "doc-", which only components in src/components/docs/ use (${RULE_DOC}).`
    )
  ]
}

function sectionWordProblems(rel, stem) {
  if (!stem.split('-').includes('section')) return []
  return [
    v(
      'section-suffix',
      rel,
      1,
      `"${stem}" carries the word "section", which only the page sections in src/components/section/ use — name the piece after what it is (${RULE_DOC}).`
    )
  ]
}

function sectionSuffixProblems(rel, stem) {
  if (stem.endsWith('-section')) return []
  const ws = stem.split('-')
  const wrapper = ws.length > 1 && SECTION_WRAPPER_WORDS.includes(ws[ws.length - 1])
  const base = wrapper ? ws.slice(0, -1).join('-') : stem
  return [
    v(
      'section-suffix',
      rel,
      1,
      `page section "${stem}" must end in "-section" — name it "${base}-section" (${RULE_DOC}).`
    )
  ]
}

function checkFileName(rel) {
  const out = []
  const segs = rel.split('/')
  for (const [i, seg] of segs.entries()) {
    if (i === 0 && (seg === 'packages' || seg === 'apps')) continue
    if (seg.startsWith('.') || FILE_NAME_EXEMPT.has(seg) || DOC_FILE.test(seg)) continue
    if (
      seg === 'node_modules' ||
      seg === '__tests__' ||
      seg === '__snapshots__' ||
      seg === '__screenshots__' ||
      seg === '__mocks__'
    )
      return out
    const stem = seg.replace(/^_/, '').replace(/(\.[a-z0-9]+)+$/i, '')
    if (!stem) continue
    if (LOCALE_TAG.test(stem)) continue
    if (/^\[[^\]]+\]$/.test(stem)) continue
    if (!KEBAB.test(stem)) {
      out.push(v('file-name', rel, 1, `"${seg}" is not kebab-case (${RULE_DOC}).`))
      break
    }
  }
  return out
}

function staticTestidFallbacks(text) {
  const out = []
  const re = /data-testid['"]\][^?\n]{0,80}?\?\?\s*(['"`])([^'"`]*)\1/g
  for (const m of text.matchAll(re)) out.push({ value: m[2], quote: m[1], index: m.index })
  return out
}

function checkTestid(rel, text) {
  const out = []
  const stem = rel
    .split('/')
    .pop()
    .replace(/\.vue$/, '')
  for (const f of staticTestidFallbacks(text)) {
    if (f.quote === '`') continue
    if (f.value !== stem)
      out.push(
        v(
          'testid',
          rel,
          lineOf(text, f.index),
          `data-testid fallback "${f.value}" must be the component's own name "${stem}" (no category) (${RULE_DOC}).`
        )
      )
  }
  const ownFallback = staticTestidFallbacks(text).some((f) => f.value === stem)
  const inherited =
    text.match(/:data-testid="`\$\{\s*(?:ctx|context)\??\.testId\b/) ??
    text.match(/testId\s*=\s*computed\(\s*\(\)\s*=>\s*(?:ctx|context)\??\.testId\b/)
  if (!rel.includes('/parts/') && !ownFallback && inherited)
    out.push(
      v(
        'testid',
        rel,
        lineOf(text, inherited.index),
        `"${stem}" builds its test id from its parent's context — fall back to its own name "${stem}" and let the consumer's data-testid win (${RULE_DOC}).`
      )
    )
  for (const m of text.matchAll(/\$\{\s*[\w.]*[tT]est[iI]d\s*\}-(?=[a-z])/g)) {
    out.push(
      v(
        'testid',
        rel,
        lineOf(text, m.index),
        `inner test id joins with "-" — use \`\${testId}__<part>\` (${RULE_DOC}).`
      )
    )
  }
  return out
}

const DOM_EVENT_CAMEL =
  /^on\w*?(Key(?:Down|Up|Press)|Pointer(?:Down|Up|Move|Enter|Leave|Cancel|Over|Out)|Mouse(?:Down|Up|Move|Enter|Leave|Over|Out)|Focus(?:In|Out)|DblClick|ContextMenu|Touch(?:Start|End|Move|Cancel)|Drag(?:Start|End|Over|Enter|Leave)|Animation(?:End|Start)|Transition(?:End|Start)|BeforeInput)(?=[A-Z]|$)/

const blankTemplateLiterals = (text) =>
  text.replace(/`(?:\\[\s\S]|\$\{[^}]*\}|[^`\\])*`/g, (lit) => lit.replace(/[^\n]/g, ' '))

function checkHandlers(rel, source) {
  const out = []
  const text = blankTemplateLiterals(source)
  for (const m of text.matchAll(
    /(?:^|[\s;{(])(?:async\s+)?(?:function\s+|(?:const|let)\s+)(handle[A-Z]\w*)\s*(?:=\s*(?:async\s*)?(?:\(|[a-zA-Z_$][\w$]*\s*=>)|\()/g
  )) {
    const name = m[1]
    out.push(
      v(
        'handler-name',
        rel,
        lineOf(text, m.index),
        `handler "${name}" must be "on${name.slice(6)}" (${RULE_DOC}).`
      )
    )
  }
  for (const m of text.matchAll(/(?:function\s+|(?:const|let)\s+)(on[A-Z]\w*)/g)) {
    const hit = m[1].match(DOM_EVENT_CAMEL)
    if (!hit) continue
    const dom = hit[1]
    const fixed = m[1].replace(dom, dom.charAt(0) + dom.slice(1).toLowerCase())
    out.push(
      v(
        'handler-name',
        rel,
        lineOf(text, m.index),
        `handler "${m[1]}" must use Vue's DOM casing "${fixed}" (${RULE_DOC}).`
      )
    )
  }
  return out
}

function templateOf(text) {
  const m = text.match(/<template[^>]*>([\s\S]*)<\/template>\s*(?:<script|<style|$)/)
  return m ? { body: m[1], offset: m.index } : { body: '', offset: 0 }
}

function checkDomRefs(rel, text) {
  const out = []
  const seen = new Set()
  const { body, offset } = templateOf(text)
  for (const m of body.matchAll(/<([A-Za-z][\w.-]*)\b[^>]*?\sref="([A-Za-z_$][\w$]*)"/g)) {
    const [, tag, name] = m
    if (seen.has(name)) continue
    seen.add(name)
    if (/^[A-Z]/.test(tag) || tag.includes('.') || tag.includes('-')) continue
    if (!/Els?$/.test(name))
      out.push(
        v(
          'dom-ref-name',
          rel,
          lineOf(text, offset + m.index),
          `template ref "${name}" must end in "El" (or "Els" for a list) (${RULE_DOC}).`
        )
      )
  }
  for (const m of text.matchAll(
    /(?:const|let)\s+(\w+)\s*=\s*(?:shallowRef|ref|useTemplateRef)\s*<\s*(?:HTML|SVG)\w*Element/g
  )) {
    const name = m[1]
    if (seen.has(name) || /Els?$/.test(name)) continue
    seen.add(name)
    out.push(
      v(
        'dom-ref-name',
        rel,
        lineOf(text, m.index),
        `element ref "${name}" must end in "El" or "Els" (${RULE_DOC}).`
      )
    )
  }
  return out
}

function checkInjectionKeys(rel, text) {
  const out = []
  const re =
    /(?:export\s+)?const\s+(\w+)\s*(:\s*InjectionKey\s*<[^=]*?>)?\s*=\s*Symbol\s*\(\s*(?:(['"`])([^'"`]*)\3)?\s*\)/g
  for (const m of text.matchAll(re)) {
    const [, name, typed, , desc] = m
    if (!typed && !/(Key|KEY)$/.test(name)) continue
    const line = lineOf(text, m.index)
    if (!/^[A-Z][A-Za-z0-9]*InjectionKey$/.test(name)) {
      out.push(
        v(
          'injection-key',
          rel,
          line,
          `injection key "${name}" must be "<Component>[<Part>]InjectionKey" (${RULE_DOC}).`
        )
      )
      continue
    }
    const want = name.replace(/InjectionKey$/, '')
    if (desc !== want)
      out.push(
        v(
          'injection-key',
          rel,
          line,
          `injection key ${name} must be Symbol('${want}')${desc === undefined ? ' (it has no description)' : `, not Symbol('${desc}')`} (${RULE_DOC}).`
        )
      )
  }
  return out
}

function checkComposableFile(rel, text) {
  const out = []
  const file = rel.split('/').pop()
  const exported = [
    ...text.matchAll(
      /export\s+(?:async\s+)?function\s+(use[A-Z]\w*)|export\s+const\s+(use[A-Z]\w*)\s*=/g
    )
  ].map((m) => m[1] || m[2])
  const stem = file.replace(/\.[cm]?[jt]s$/, '')
  if (/^use[A-Z]/.test(stem)) {
    out.push(
      v('composable-file', rel, 1, `composable file "${file}" must be kebab "use-…" (${RULE_DOC}).`)
    )
    return out
  }
  if (stem.startsWith('use-')) {
    const want = kebabToCamel(stem)
    if (exported.length && !exported.includes(want))
      out.push(
        v(
          'composable-file',
          rel,
          1,
          `"${file}" must export ${want} (it exports ${exported.join(', ')}) (${RULE_DOC}).`
        )
      )
    return out
  }
  if (exported.length && stem !== 'index' && !/\.vue$/.test(file))
    out.push(
      v(
        'composable-file',
        rel,
        1,
        `${exported.join(', ')} must live in a "use-…" file named after it (${RULE_DOC}).`
      )
    )
  return out
}

const TYPOGRAPHY_SUFFIXES = [
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing',
  'font-family',
  'color'
]

function ownedElsewhere(name, root, ctx = {}) {
  if (ctx.themeVars?.has(name)) return true
  const readers = ctx.cssVarReaders?.get(name)
  if (!readers) return false
  for (const owner of readers) if (owner !== root && name.startsWith(`${owner}-`)) return true
  return false
}

function checkCssVariables(rel, text, root, ctx = {}) {
  const out = []
  if (!root) return out
  const seen = new Set()
  const re =
    /\[--([a-z0-9-]+):|['"]--([a-z0-9-]+)['"]\s*:|setProperty\(\s*['"]--([a-z0-9-]+)|style="--([a-z0-9-]+):|^\s*--([a-z0-9-]+)\s*:/gm
  for (const m of text.matchAll(re)) {
    const name = m[1] || m[2] || m[3] || m[4] || m[5]
    if (!name || name.startsWith('tw-') || seen.has(name)) continue
    seen.add(name)
    if (ownedElsewhere(name, root, ctx)) continue
    const line = lineOf(text, m.index)
    if (!name.startsWith(`${root}-`))
      out.push(
        v(
          'css-variable',
          rel,
          line,
          `CSS variable "--${name}" must start with "--${root}-" (--<component>-<part>-<property>) (${RULE_DOC}).`
        )
      )
    for (const problem of nameWordProblems(name))
      out.push(
        v('css-variable', rel, line, `CSS variable "--${name}" uses ${problem} (${RULE_DOC}).`)
      )
  }
  return out
}

const TOKEN_BAD = [
  {
    re: /(?<![\w-])(--[a-z0-9-]*?|[a-z][a-z0-9]*-[a-z0-9-]*?)\b(xxxl|xxl|xxs|xxxs)\b/g,
    fix: (w) => ({ xxs: '2xs', xxxs: '3xs', xxl: '2xl', xxxl: '3xl' })[w]
  },
  { re: /\bsintax\b/g, fix: () => 'syntax' },
  {
    re: /--(?!(?:bg|text)-contrast\b)[a-z0-9-]+-contrast\b|(?<![\w-])(?:bg|text|border|fill|stroke|ring)-\(--(?!(?:bg|text)-contrast\))[a-z0-9-]+-contrast\)/g,
    fix: () => '-foreground'
  }
]

function checkTokenNames(rel, text) {
  const out = []
  const seen = new Set()
  for (const { re, fix } of TOKEN_BAD) {
    for (const m of text.matchAll(re)) {
      const hit = m[0]
      if (seen.has(hit)) continue
      seen.add(hit)
      const word = m[2] || (hit.includes('sintax') ? 'sintax' : 'contrast')
      out.push(
        v(
          'token-name',
          rel,
          lineOf(text, m.index),
          `token "${hit}" — use "${fix(word)}" (${RULE_DOC}).`
        )
      )
    }
  }
  return out
}

const FILL_FAMILIES = ['primary', 'secondary', 'accent', 'success', 'warning', 'danger', 'info']

export function checkFillPairs(keys, file = 'packages/theme/src/tokens/theme') {
  const out = []
  const set = new Set(keys)
  for (const family of FILL_FAMILIES) {
    if (set.has(family) && !set.has(`${family}-foreground`))
      out.push(
        v(
          'token-name',
          file,
          1,
          `fill colour "--${family}" has no "--${family}-foreground" text pair (${RULE_DOC}).`
        )
      )
  }
  return out
}

function iconProblem(name, ctx) {
  if (name.startsWith('pi-')) return 'is from the removed pi icon set'
  if (!name.startsWith('az-')) return 'does not carry the "az-" prefix'
  const renamed = ctx?.iconRenames?.[name]
  if (renamed && !ctx?.icons?.has(name))
    return `was renamed to "${typeof renamed === 'string' ? renamed : 'nothing'}"`
  const legacy = name
    .replace(/^az-/, '')
    .split('-')
    .find((w) => Object.hasOwn(LEGACY_ICON_WORDS, w))
  if (legacy) return `uses the legacy word "${legacy}" (say "${LEGACY_ICON_WORDS[legacy]}")`
  if (ctx?.icons && ctx.icons.size && !ctx.icons.has(name))
    return 'is not an icon in @aziontech/icons'
  return null
}

const RETIRED_ICON_BASES = { ai: 'az', 'ai-cor': 'az-color', 'ai-color': 'az-color', pi: 'az' }

function checkIconUsage(rel, text, ctx) {
  const out = []
  const seen = new Set()
  for (const m of text.matchAll(
    /(?<![\w-])(ai-color|ai-cor|az-color|ai|pi|az)\s+((?:ai|pi|az)-[a-z0-9]+(?:-[a-z0-9]+)*)/g
  )) {
    const [, base, name] = m
    const key = `${base} ${name}`
    if (seen.has(key)) continue
    seen.add(key)
    const problem = RETIRED_ICON_BASES[base]
      ? `uses the retired base class "${base}" (write "${RETIRED_ICON_BASES[base]} az-…")`
      : iconProblem(name, ctx)
    if (problem)
      out.push(
        v('icon-name', rel, lineOf(text, m.index), `icon "${key}" ${problem} (${RULE_DOC}).`)
      )
  }
  for (const m of text.matchAll(/(?<![\w:-])class="([^"]*)"/g)) {
    const base = m[1].split(/\s+/).find((token) => RETIRED_ICON_BASES[token])
    if (!base || /(?:^|\s)(?:ai|pi|az)-[a-z0-9]/.test(m[1])) continue
    out.push(
      v(
        'icon-name',
        rel,
        lineOf(text, m.index),
        `class "${base}" is a retired icon base class (write "${RETIRED_ICON_BASES[base]}") (${RULE_DOC}).`
      )
    )
  }
  return out
}

function checkIconFile(rel) {
  const m = rel.match(/^packages\/icons\/src\/svg-raw\/([^/]+)\/([^/]+)\.svg$/)
  if (!m) return []
  const [, set, name] = m
  if (set !== 'az' && set !== 'az-color')
    return [
      v(
        'icon-name',
        rel,
        1,
        `icon folder "${set}" is retired: use svg-raw/az or svg-raw/az-color (${RULE_DOC}).`
      )
    ]
  const problem = iconProblem(name, { iconRenames: {} })
  return problem ? [v('icon-name', rel, 1, `icon file "${name}" ${problem} (${RULE_DOC}).`)] : []
}

function splitTop(text, sep) {
  const parts = []
  let depth = 0
  let quote = null
  let cur = ''
  for (const ch of text) {
    if (quote) {
      if (ch === quote) quote = null
    } else if (ch === "'" || ch === '"') quote = ch
    else if ('<([{'.includes(ch)) depth++
    else if ('>)]}'.includes(ch)) depth--
    else if (ch === sep && depth === 0) {
      parts.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }
  parts.push(cur)
  return parts.map((x) => x.trim()).filter(Boolean)
}

function collectTypes(text, into = new Map()) {
  for (const m of text.matchAll(
    /(?:^|\n)\s*(?:export\s+)?type\s+([A-Za-z_$][\w$]*)\s*=\s*([^\n]+(?:\n\s*\|[^\n]+)*)/g
  )) {
    if (!into.has(m[1])) into.set(m[1], m[2].replace(/;\s*$/, '').trim())
  }
  return into
}

export function unionResolver(script, types = new Map()) {
  const local = collectTypes(script)
  const resolve = (text, depth = 0) => {
    if (depth > 8) return null
    const out = []
    let body = String(text ?? '').trim()
    if (body.startsWith('|')) body = body.slice(1)
    for (const part of splitTop(body, '|')) {
      let m
      if ((m = part.match(/^'([^']*)'$/) || part.match(/^"([^"]*)"$/))) out.push(m[1])
      else if (/^(undefined|null|never)$/.test(part)) continue
      else if ((m = part.match(/^(Exclude|Extract)<([\s\S]+)>$/))) {
        const [a, b] = splitTop(m[2], ',')
        const left = resolve(a, depth + 1)
        const right = resolve(b, depth + 1)
        if (!left || !right) return null
        out.push(
          ...left.filter((x) => (m[1] === 'Exclude' ? !right.includes(x) : right.includes(x)))
        )
      } else if (/^[A-Za-z_$][\w$]*$/.test(part)) {
        const def = local.get(part) ?? types.get(part)
        if (!def) return null
        const inner = resolve(def, depth + 1)
        if (!inner) return null
        out.push(...inner)
      } else return null
    }
    return out
  }
  return resolve
}

export function extractModels(script) {
  const out = []
  for (const m of script.matchAll(/defineModel\s*(<)?/g)) {
    let i = m.index + m[0].length
    let type = ''
    if (m[1]) {
      let depth = 1
      const start = i
      while (i < script.length && depth > 0) {
        if (script[i] === '<') depth++
        else if (script[i] === '>' && script[i - 1] !== '=') depth--
        i++
      }
      type = script.slice(start, i - 1).trim()
    }
    const rest = script.slice(i).match(/^\s*\(\s*(?:'([A-Za-z][\w]*)'|"([A-Za-z][\w]*)")?/)
    if (!rest) continue
    out.push({ name: rest[1] || rest[2] || 'modelValue', type, model: true })
  }
  return out
}

const AXIS_PROP =
  /^(variant|size|severity|status|orientation)$|[a-z](Variant|Size|Severity|Status|Orientation)$/

function checkAxisTypeNames(rel, props, component, script = '') {
  const out = []
  const local = collectTypes(script)
  const pascal = kebabToPascal(component)
  for (const p of props) {
    if (!AXIS_PROP.test(p.name)) continue
    const type = String(p.type || '')
      .replace(/\s*\|\s*(undefined|null)\b/g, '')
      .trim()
    if (!/^[A-Z][\w]*$/.test(type) || !local.has(type)) continue
    const want = `${pascal}${p.name.charAt(0).toUpperCase()}${p.name.slice(1)}`
    if (type !== want)
      out.push(
        v(
          'type-name',
          rel,
          1,
          `prop "${p.name}" is typed "${type}"; name the union this file declares "${want}" (<Component><Axis>) (${RULE_DOC}).`
        )
      )
  }
  return out
}

export function checkAxisTypes(rel, text, names, ctx = {}) {
  const out = []
  const resolve = unionResolver(text, ctx.types)
  for (const m of text.matchAll(
    /export\s+type\s+([A-Za-z0-9_]+(Severity|Status|Orientation))\s*=\s*([^\n]+(?:\n\s*\|[^\n]+)*)/g
  )) {
    const [, name, axis, rhs] = m
    const line = lineOf(text, m.index)
    const prop = axis.toLowerCase()
    const documented = names.some((n) => SEVERITY_EXTRAS[n])
    if (
      axis === 'Severity' &&
      !documented &&
      splitTop(rhs.trim().replace(/^\|/, ''), '|').some((x) => /^['"]/.test(x))
    ) {
      out.push(
        v(
          'prop-value',
          rel,
          line,
          `type "${name}" re-lists severity values — derive it from Severity in utils/severity.ts (Severity, Exclude<Severity, …> or Extract<Severity, …>) (${RULE_DOC}).`
        )
      )
      continue
    }
    const members = resolve(rhs)
    if (!members) continue
    const msgs = names.map((n) => checkValueSet(prop, members, n))
    if (msgs.every(Boolean)) out.push(v('prop-value', rel, line, `type "${name}": ${msgs[0]}`))
  }
  return out
}

export function checkTemplateModels(rel, text) {
  const out = []
  for (const m of templateOf(text).body.matchAll(/v-model:([a-zA-Z][\w-]*)/g)) {
    const name = kebabToCamel(m[1])
    const want = Object.hasOwn(MODELS.banned, name) ? MODELS.banned[name] : canonicalFor(name)
    if (want)
      out.push(
        v(
          'model-shape',
          rel,
          lineOf(text, text.indexOf(m[0])),
          `v-model:${m[1]} is not a WebKit model — use ${Object.hasOwn(MODELS.banned, name) ? want : `v-model:${want}`} (${RULE_DOC}).`
        )
      )
  }
  return out
}

function checkModelShapes(rel, props, models) {
  const out = []
  for (const m of models) {
    if (Object.hasOwn(MODELS.banned, m.name)) {
      out.push(
        v(
          'model-shape',
          rel,
          1,
          `v-model:${m.name} is not allowed — use ${MODELS.banned[m.name]} (${RULE_DOC}).`
        )
      )
      continue
    }
    if (MODELS.idWord.test(m.name)) {
      const want = m.name.replace(/Ids?$/, (x) => (x === 'Ids' ? 'Keys' : 'Key'))
      out.push(
        v(
          'model-shape',
          rel,
          1,
          `model "${m.name}" holds ids — name it "${want}" (an id is a key) (${RULE_DOC}).`
        )
      )
      continue
    }
    const shape = MODELS.types.find((x) => x.test.test(m.name))
    const type = String(m.type || '')
      .replace(/\s+/g, ' ')
      .trim()
    if (shape && type && !shape.type.test(type))
      out.push(
        v(
          'model-shape',
          rel,
          1,
          `model "${m.name}" is typed "${type}"; the ${shape.concept} concept binds ${shape.want} on every component (${RULE_DOC}).`
        )
      )
  }
  for (const p of props) {
    if (MODELS.seedPrefix.test(p.name)) {
      const want = `default${p.name.slice(7)}`
      out.push(
        v(
          'model-shape',
          rel,
          1,
          `seed prop "${p.name}" must be "${want}" (a seed is default<Model>) (${RULE_DOC}).`
        )
      )
    }
  }
  return out
}

export const PHYSICAL_EDGE_TYPES = Object.freeze([
  'NetworkMapFade',
  'NetworkMapPosition',
  'ConsoleMockupShellFade',
  'TextureFade',
  'RegistrationFrameSide',
  'RegistrationFrameCorner',
  'RegistrationFrameMarks'
])

const PHYSICAL_WORD = /^(?:[a-z]+-)?(?:left|right)$/

function physicalSideMembers(typeText, script = '', types = new Map()) {
  const local = collectTypes(script)
  const seen = new Set()
  const found = []
  const walk = (text, depth) => {
    if (depth > 8) return
    for (const m of String(text ?? '').matchAll(/'([^']*)'|"([^"]*)"|\b([A-Z][\w$]*)\b/g)) {
      if (m[3]) {
        const name = m[3]
        if (PHYSICAL_EDGE_TYPES.includes(name) || seen.has(name)) continue
        seen.add(name)
        const def = local.get(name) ?? types.get(name)
        if (def) walk(def, depth + 1)
        continue
      }
      const word = m[1] ?? m[2]
      if (PHYSICAL_WORD.test(word) && !found.includes(word)) found.push(word)
    }
  }
  walk(typeText, 0)
  return found
}

function checkPhysicalSides(rel, props, script = '', types = new Map()) {
  const out = []
  for (const p of props) {
    const words = physicalSideMembers(p.type, script, types)
    if (!words.length) continue
    out.push(
      v(
        'prop-value',
        rel,
        1,
        `prop "${p.name}" names physical sides (${words.map((w) => `'${w}'`).join(', ')}) — use start/end so it flips in right-to-left; only a picture's own edges (${PHYSICAL_EDGE_TYPES.join(', ')}) keep left/right (${RULE_DOC}).`
      )
    )
  }
  return out
}

function checkSfcVocabulary(rel, text, component, ctx = {}, root = component) {
  const out = []
  let sfc
  try {
    sfc = parseVueSfc(text)
  } catch {
    return out
  }
  const script = sfc.raw ?? text
  const opts = {
    stage: 'all',
    component,
    root,
    resolveTypeUnion: (t) => resolveTypeUnion(script, t),
    resolveMembers: unionResolver(script, ctx.types)
  }
  const models = extractModels(script)
  for (const x of checkPropVocabulary([...sfc.props, ...models], opts))
    out.push(v(x.rule, rel, 1, x.message))
  out.push(...checkAxisTypeNames(rel, [...sfc.props, ...models], component, script))
  out.push(...checkModelShapes(rel, sfc.props, models))
  out.push(...checkPhysicalSides(rel, [...sfc.props, ...models], script, ctx.types))
  for (const x of checkEventVocabulary(sfc.emits, { stage: 'all' }))
    out.push(v(x.rule, rel, 1, x.message))
  for (const x of checkSlotVocabulary(sfc.slots)) out.push(v(x.rule, rel, 1, x.message))
  return out
}

function checkDataAttributeUsage(rel, text) {
  const out = []
  const names = new Set()
  for (const m of text.matchAll(/(?<![\w-]):?(data-[A-Za-z0-9-]+)\s*=/g)) names.add(m[1])
  for (const m of text.matchAll(/[{,]\s*['"](data-[A-Za-z0-9-]+)['"]\s*:/g)) names.add(m[1])
  for (const x of checkDataAttributes([...names].filter((n) => n !== 'data-testid'))) {
    const at = text.indexOf(x.attribute)
    out.push(v(x.rule, rel, lineOf(text, at), x.message))
  }
  return out
}

function checkTypeNames(rel, text, root) {
  const out = []
  for (const m of text.matchAll(/export\s+(?:type|interface)\s+([A-Za-z0-9_]+)/g)) {
    const name = m[1]
    const line = lineOf(text, m.index)
    if (name === 'Props') {
      out.push(
        v(
          'type-name',
          rel,
          line,
          `export a named "<Component>Props", never a bare "Props" (${RULE_DOC}).`
        )
      )
      continue
    }
    if (/Kind$/.test(name)) {
      out.push(
        v(
          'type-name',
          rel,
          line,
          `type "${name}" must be "${name.replace(/Kind$/, 'Variant')}" (the look) or "${name.replace(/Kind$/, 'Type')}" (the sort of part) (${RULE_DOC}).`
        )
      )
      continue
    }
    if (root && !name.startsWith(kebabToPascal(root)))
      out.push(
        v(
          'type-name',
          rel,
          line,
          `exported type "${name}" must start with its component name "${kebabToPascal(root)}" (${RULE_DOC}).`
        )
      )
  }
  return out
}

function checkSpecVocabulary(rel, text, ctx = {}) {
  const out = []
  const name = rel.split('/').pop().replace(/\.md$/, '')
  const body = text.replace(/^---[\s\S]*?---/, '')
  const clean = (s) =>
    String(s ?? '')
      .replace(/^`|`$/g, '')
      .trim()
  const props = parseTable2(getSection(body, 'Props'), 'type')
    .map((r) => ({ name: clean(r.prop), type: r.type ?? '' }))
    .filter((p) => p.name && /^[A-Za-z][\w]*$/.test(p.name))
  const at = (n) => lineOf(text, text.indexOf(`\`${n}\``))
  const resolve = unionResolver('', ctx.types)
  const resolveMembers = (t) => resolve(String(t).replace(/`/g, '').replace(/\\\|/g, '|'))
  for (const x of checkPropVocabulary(props, { stage: 'all', component: name, resolveMembers }))
    out.push(v(x.rule, rel, at(x.prop), x.message))
  const emits = parseTable(getSection(body, 'Events'))
    .map((r) => ({ name: clean(r.event) }))
    .filter((e) => e.name && /^[\w:-]+$/.test(e.name))
  for (const x of checkEventVocabulary(emits, { stage: 'all' }))
    out.push(v(x.rule, rel, at(x.event), x.message))
  const slots = parseTable(getSection(body, 'Slots'))
    .map((r) => clean(r.slot))
    .filter((s) => s && /^[\w-]+$/.test(s))
  for (const x of checkSlotVocabulary(slots)) out.push(v(x.rule, rel, at(x.slot), x.message))
  return out
}

function checkI18n(rel, text, ctx) {
  const out = []
  const owners = [
    ...(ctx?.componentNames || []),
    ...[...(ctx?.exports || [])].map((k) =>
      k
        .split('/')
        .pop()
        .replace(/^use-/, '')
        .replace(/-root$/, '')
    )
  ]
  const known = ctx?.componentNames ? new Set(owners.map(kebabToCamel)) : null
  const locale = rel
    .split('/')
    .pop()
    .replace(/\.ts$|-/g, '')
    .toLowerCase()
  for (const m of text.matchAll(/export\s+const\s+(\w+)\s*=/g)) {
    const ns = m[1]
    const line = lineOf(text, m.index)
    if (ns.toLowerCase() === locale) continue
    if (!CAMEL.test(ns))
      out.push(v('i18n-key', rel, line, `namespace "${ns}" must be camelCase (${RULE_DOC}).`))
    else if (known && known.size && !known.has(ns) && ns !== 'common')
      out.push(
        v(
          'i18n-key',
          rel,
          line,
          `namespace "${ns}" is not the camelCase name of a component (${RULE_DOC}).`
        )
      )
  }
  for (const m of text.matchAll(/^\s+(['"])([^'"]+)\1\s*:/gm)) {
    out.push(
      v(
        'i18n-key',
        rel,
        lineOf(text, m.index),
        `key "${m[2]}" must be a bare camelCase identifier (${RULE_DOC}).`
      )
    )
  }
  for (const m of text.matchAll(/^\s+([A-Za-z_$][\w$]*)\s*:/gm)) {
    if (!CAMEL.test(m[1]))
      out.push(
        v('i18n-key', rel, lineOf(text, m.index), `key "${m[1]}" must be camelCase (${RULE_DOC}).`)
      )
  }
  return out
}

const EXAMPLE_PROP_WORDS = { type: 'type', types: 'type', levels: 'level' }

function checkExampleIndex(rel, text, ctx = {}) {
  const out = []
  const comp = rel.split('/').slice(-2)[0]
  const ownsProp = (word) =>
    Boolean(EXAMPLE_PROP_WORDS[word] && ctx.specProps?.[comp]?.has(EXAMPLE_PROP_WORDS[word]))
  let json
  try {
    json = JSON.parse(text)
  } catch {
    return out
  }
  const files = (json.examples || []).map((e) => e.file).filter(Boolean)
  if (files.length && files[0] !== 'default.vue')
    out.push(
      v(
        'example-file',
        rel,
        1,
        `the first example is "${files[0]}" — it must be "default.vue" (${RULE_DOC}).`
      )
    )
  for (const file of files) {
    const stem = file.replace(/\.vue$/, '')
    if (!KEBAB.test(stem)) {
      out.push(v('example-file', rel, 1, `example "${file}" is not kebab-case (${RULE_DOC}).`))
      continue
    }
    const bad = stem.split('-').find((w) => Object.hasOwn(EXAMPLE_RENAMES, w) && !ownsProp(w))
    if (bad && !(bad === 'read' && !stem.includes('read-only')))
      out.push(
        v(
          'example-file',
          rel,
          1,
          `example "${file}" uses "${bad}" — say "${EXAMPLE_RENAMES[bad]}" (${RULE_DOC}).`
        )
      )
    for (const problem of nameWordProblems(stem))
      out.push(v('near-duplicate', rel, 1, `example "${file}" uses ${problem} (${RULE_DOC}).`))
  }
  if (/^(Templates|Patterns)\//.test(json.title || ''))
    out.push(v('block-word', rel, 1, `title "${json.title}" — the word is "Blocks" (${RULE_DOC}).`))
  return out
}

function checkBlockFile(rel, text) {
  const out = []
  const m = rel.match(/^packages\/webkit\/blocks\/(.+)\/block\.json$/)
  if (!m) return out
  const segs = m[1].split('/')
  if (segs.length !== 2)
    out.push(
      v(
        'block-path',
        rel,
        1,
        `block folder "${m[1]}" must be blocks/<group>/<block>/ (${BLOCK_SURFACES.includes(segs[0]) ? `drop the surface level "${segs[0]}" — it is the block.json "surface" field` : 'two levels'}) (${RULE_DOC}).`
      )
    )
  const group = segs.length > 2 && BLOCK_SURFACES.includes(segs[0]) ? segs[1] : segs[0]
  if (!BLOCK_GROUPS.includes(group)) {
    const to = BLOCK_GROUP_RENAMES[group]
    out.push(
      v(
        'block-path',
        rel,
        1,
        `block group "${group}" is not in the list (${to ? `use "${to}"` : BLOCK_GROUPS.join(', ')}) (${RULE_DOC}).`
      )
    )
  }
  for (const seg of segs.slice(-1))
    for (const problem of nameWordProblems(seg))
      out.push(v('near-duplicate', rel, 1, `block "${seg}" uses ${problem} (${RULE_DOC}).`))
  if (segs.length === 2)
    for (const problem of blockGroupFirstProblems(segs[0], segs[1]))
      out.push(v('block-group-first', rel, 1, `${problem} (${RULE_DOC}).`))
  let json
  try {
    json = JSON.parse(text)
  } catch {
    return out
  }
  if (!json.surface)
    out.push(v('block-path', rel, 1, `block.json has no "surface" field (${RULE_DOC}).`))
  if (/^(Templates|Patterns)\//.test(json.title || '') || /\bpattern\b/i.test(json.title || ''))
    out.push(
      v('block-word', rel, 1, `title "${json.title}" — the word is "Blocks/…" (${RULE_DOC}).`)
    )
  for (const variant of json.variants || []) {
    if (!variant.file) continue
    const stem = variant.file
      .split('/')
      .pop()
      .replace(/\.vue$/, '')
    out.push(...blockStateProblems(rel, stem))
  }
  return out
}

function blockGroupFirstProblems(group, block) {
  if (!block.startsWith(`${group}-`) || block === `${group}-`)
    return [`block "${group}/${block}" must start with its group word: "${group}/${group}-…"`]
  const rest = block.slice(group.length + 1)
  if (`-${rest}-`.includes(`-${group}-`))
    return [`block "${group}/${block}" says "${group}" twice; the group word comes once, first`]
  return []
}

function blockStateProblems(rel, stem) {
  const out = []
  const parts = stem.split('-')
  const bad = parts.find((w) => Object.hasOwn(BLOCK_STATE_WORDS, w))
  if (bad)
    out.push(
      v(
        'block-state',
        rel,
        1,
        `variant "${stem}" uses "${bad}" — the state word is "${BLOCK_STATE_WORDS[bad]}" (${RULE_DOC}).`
      )
    )
  else if (parts.length > 1 && STATE_WORDS.includes(parts[0]) && parts[0] !== 'no')
    out.push(
      v(
        'block-state',
        rel,
        1,
        `variant "${stem}" puts the state first — write "<subject>-<state>" ("${parts.slice(1).join('-')}-${parts[0]}") (${RULE_DOC}).`
      )
    )
  return out
}

function checkScripts(rel, text) {
  const out = []
  let pkg
  try {
    pkg = JSON.parse(text)
  } catch {
    return out
  }
  for (const [name, command] of Object.entries(pkg.scripts || {})) {
    if (LIFECYCLE_SCRIPTS.has(name)) continue
    const segs = name.split(':')
    const line = lineOf(text, text.indexOf(`"${name}"`))
    if (!segs.every((s) => KEBAB.test(s))) {
      out.push(
        v('script-name', rel, line, `script "${name}" must be kebab <verb>:<target> (${RULE_DOC}).`)
      )
      continue
    }
    if (!SCRIPT_VERBS.includes(segs[0])) {
      const verbAt = segs.findIndex((s) => SCRIPT_VERBS.includes(s))
      const hint =
        verbAt > 0
          ? ` — write "${[segs[verbAt], ...segs.filter((_, i) => i !== verbAt)].join(':')}"`
          : ''
      out.push(
        v(
          'script-name',
          rel,
          line,
          `script "${name}" must start with a verb (${SCRIPT_VERBS.join(', ')})${hint} (${RULE_DOC}).`
        )
      )
      continue
    }
    const file = String(command).match(/^node\s+(?:\.\/)?scripts\/([\w-]+)\.mjs$/)
    if (file && segs.length > 1 && file[1] !== segs.join('-'))
      out.push(
        v(
          'script-name',
          rel,
          line,
          `script "${name}" runs ${file[1]}.mjs — the file is "${segs.join('-')}.mjs" (or the script "${file[1].replace('-', ':')}") (${RULE_DOC}).`
        )
      )
  }
  out.push(...checkFilters(rel, text))
  return out
}

function checkFilters(rel, text) {
  const out = []
  for (const m of text.matchAll(/--filter[= ]+(['"]?)([^\s'"\\]+)\1/g)) {
    const target = m[2]
    if (
      target.startsWith('@') ||
      target.startsWith('.') ||
      target.startsWith('{') ||
      target.includes('*') ||
      target.startsWith('$')
    )
      continue
    out.push(
      v(
        'filter-name',
        rel,
        lineOf(text, m.index),
        `"--filter ${target}" must name the full package ("@aziontech/${target}") (${RULE_DOC}).`
      )
    )
  }
  return out
}

const PROPER_NOUNS = new Set([
  'Azion',
  'GitHub',
  'Node.js',
  'Playwright',
  'Chromium',
  'Firefox',
  'WebKit',
  'Vitest',
  'ESLint',
  'Stylelint',
  'Prettier',
  'TypeScript',
  'TruffleHog',
  'Scorecard',
  'Vue',
  'Vite',
  'MCP',
  'CLI',
  'npm',
  'pnpm',
  'PR',
  'API',
  'OSSF',
  'SSR',
  'CI'
])

function sentenceCaseProblem(name) {
  const clean = name
    .replace(/\$\{\{[^}]*\}\}/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/—.*$/, '')
    .trim()
  const ws = clean.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w))
  const rest = ws.slice(1).filter((w) => !PROPER_NOUNS.has(w) && !/^@/.test(w))
  const titled = rest.filter((w) => /^[A-Z][a-z]/.test(w))
  if (rest.length >= 2 && titled.length === rest.length) return 'is Title Case — use sentence case'
  if (
    ws.length &&
    /^[a-z]/.test(ws[0]) &&
    !/^(pnpm|npm|node|npx|vue-tsc|eslint|prettier)$/.test(ws[0])
  )
    return 'must start with a capital (sentence case)'
  return null
}

function checkWorkflow(rel, text) {
  const out = []
  const file = rel.split('/').pop()
  if (!/^[a-z0-9]+(-[a-z0-9]+)*\.yml$/.test(file))
    out.push(
      v(
        'workflow-name',
        rel,
        1,
        `workflow file "${file}" must be lowercase kebab .yml (${RULE_DOC}).`
      )
    )
  for (const m of text.matchAll(/^(?:name|    name|\s*-\s+name):\s*(.+?)\s*(?:#.*)?$/gm)) {
    const name = m[1].replace(/^['"]|['"]$/g, '')
    if (REQUIRED_CHECKS.has(name)) continue
    const line = lineOf(text, m.index)
    const code = name.match(/\((?:G\d+|\d+\.\d+|M\d+(?:\.\d+)?)\)|\bM\d+\.\d+\b|\bG\d+\b/)
    if (code)
      out.push(
        v(
          'workflow-name',
          rel,
          line,
          `name "${name}" carries the milestone code "${code[0]}" (${RULE_DOC}).`
        )
      )
    const banned = WORKFLOW_BANNED_WORDS.find((w) => new RegExp(`\\b${w}\\b`, 'i').test(name))
    if (banned)
      out.push(
        v(
          'workflow-name',
          rel,
          line,
          `name "${name}" uses the retired word "${banned}" (${RULE_DOC}).`
        )
      )
    const sc = sentenceCaseProblem(name)
    if (sc) out.push(v('workflow-name', rel, line, `name "${name}" ${sc} (${RULE_DOC}).`))
  }
  out.push(...checkFilters(rel, text))
  return out
}

function checkEslintRuleFile(rel) {
  const m = rel.match(/^packages\/webkit\/src\/eslint-plugin\/rules\/([^/]+)\.js$/)
  if (!m) return []
  const name = m[1]
  if (!KEBAB.test(name))
    return [v('eslint-rule-name', rel, 1, `rule "${name}" must be kebab-case (${RULE_DOC}).`)]
  if (!ESLINT_PREFIXES.includes(name.split('-')[0]))
    return [
      v(
        'eslint-rule-name',
        rel,
        1,
        `ESLint rule "webkit/${name}" must start with ${ESLINT_PREFIXES.map((p) => `${p}-`).join(', ')} (${RULE_DOC}).`
      )
    ]
  return []
}

function checkToolingName(rel) {
  const out = []
  let m
  const abbreviation = (name) =>
    name
      .split('-')
      .map((w) => (Object.hasOwn(ABBREVIATIONS, w) ? w : null))
      .find(Boolean)
  if (
    (m =
      rel.match(/^\.claude\/(skills)\/([^/]+)\/SKILL\.md$/) ||
      rel.match(/^\.claude\/(commands)\/([^/]+)\.md$/))
  ) {
    const name = m[2]
    if (name.startsWith('_')) return out
    if (!KEBAB.test(name))
      out.push(v('tooling-name', rel, 1, `"${name}" must be kebab-case (${RULE_DOC}).`))
    else if (!SKILL_VERBS.includes(name.split('-').pop()))
      out.push(
        v(
          'tooling-name',
          rel,
          1,
          `"${name}" must be object first, verb last ("<object>-<verb>", e.g. component-create) (${RULE_DOC}).`
        )
      )
    const ab = abbreviation(name)
    if (ab)
      out.push(v('tooling-name', rel, 1, `"${name}" uses the abbreviation "${ab}" (${RULE_DOC}).`))
    return out
  }
  if ((m = rel.match(/^skills\/([^/]+)\/SKILL\.md$/))) {
    const name = m[1]
    if (!/^webkit-[a-z0-9]+(-[a-z0-9]+)*$/.test(name))
      out.push(
        v(
          'tooling-name',
          rel,
          1,
          `consumer skill "${name}" must be "webkit-<kebab>" (${RULE_DOC}).`
        )
      )
    const ab = abbreviation(name)
    if (ab)
      out.push(v('tooling-name', rel, 1, `"${name}" uses the abbreviation "${ab}" (${RULE_DOC}).`))
    return out
  }
  if ((m = rel.match(/^(?:\.claude\/agents|adapters\/claude\/agents)\/([^/]+)\.md$/))) {
    const name = m[1]
    if (name.startsWith('_')) return out
    if (!KEBAB.test(name) || !/(er|or)$/.test(name.split('-').pop()))
      out.push(
        v(
          'tooling-name',
          rel,
          1,
          `agent "${name}" must be kebab and end in an agent noun (-er / -or) (${RULE_DOC}).`
        )
      )
    return out
  }
  if ((m = rel.match(/^\.claude\/hooks\/([^/]+)\.mjs$/))) {
    const name = m[1]
    if (!HOOK_VERBS.includes(name.split('-')[0]))
      out.push(
        v(
          'tooling-name',
          rel,
          1,
          `hook "${name}.mjs" must be ${HOOK_VERBS.map((h) => `${h}-<x>`).join(' / ')} (a data registry belongs in lib/) (${RULE_DOC}).`
        )
      )
  }
  return out
}

function checkMcpTools(rel, text) {
  const out = []
  for (const m of text.matchAll(/\btool\(\s*'([^']+)'/g)) {
    const name = m[1]
    const line = lineOf(text, m.index)
    if (!/^[a-z]+(_[a-z]+)*$/.test(name)) {
      out.push(
        v(
          'cli-name',
          rel,
          line,
          `MCP tool "${name}" must be snake_case <verb>_<noun> (${RULE_DOC}).`
        )
      )
      continue
    }
    if (!MCP_VERBS.includes(name.split('_')[0]))
      out.push(
        v(
          'cli-name',
          rel,
          line,
          `MCP tool "${name}" must start with a verb (${MCP_VERBS.join(', ')}) (${RULE_DOC}).`
        )
      )
    const word = name.split('_').find((w) => /^(pattern|patterns|template|templates)$/.test(w))
    if (word)
      out.push(
        v(
          'block-word',
          rel,
          line,
          `MCP tool "${name}" says "${word}" — the word is "block" (${RULE_DOC}).`
        )
      )
  }
  return out
}

function checkCliCommands(rel, text) {
  const out = []
  const m = text.match(/const\s+COMMANDS\s*=\s*new Set\(\[([\s\S]*?)\]\)/)
  if (!m) return out
  for (const c of m[1].matchAll(/'([^']+)'/g)) {
    if (!/^[a-z]+$/.test(c[1]))
      out.push(
        v(
          'cli-name',
          rel,
          lineOf(text, m.index),
          `CLI command "${c[1]}" must be one lowercase word (${RULE_DOC}).`
        )
      )
  }
  return out
}

function checkCatalogWords(rel, text) {
  const out = []
  for (const m of text.matchAll(
    /\b(patternAliases|search_patterns|get_pattern|catalog\/patterns)\b/g
  )) {
    out.push(
      v(
        'block-word',
        rel,
        lineOf(text, m.index),
        `"${m[1]}" — the word is "block" (blockAliases, search_blocks, get_block, catalog/blocks) (${RULE_DOC}).`
      )
    )
  }
  return out
}

function checkExportKeys(rel, text) {
  const out = []
  let pkg
  try {
    pkg = JSON.parse(text)
  } catch {
    return out
  }
  const all = new Set(
    [...CATEGORIES, ...Object.keys(CATEGORY_RENAMES)].filter((c) => c !== 'utils' && c !== 'docs')
  )
  const keys = Object.keys(pkg.exports || {})
    .filter((k) => k.startsWith('./'))
    .map((k) => k.slice(2))
  const set = new Set(keys)
  for (const key of keys) {
    const segs = key.split('/')
    const line = lineOf(text, text.indexOf(`"./${key}"`))
    if (segs.length > 1 && all.has(segs[0]))
      out.push(
        v(
          'export-category',
          rel,
          line,
          `export "./${key}" carries the category "${segs[0]}" — the key is flat "./${segs.slice(1).join('/')}" (${RULE_DOC}).`
        )
      )
    if (segs.length !== 1) continue
    for (const problem of nameWordProblems(key))
      out.push(v('near-duplicate', rel, line, `export "./${key}" uses ${problem} (${RULE_DOC}).`))
    const target = pkg.exports[`./${key}`]
    const file = typeof target === 'string' ? target : (target?.default ?? '')
    if (key.startsWith('use-') && !file.includes('/composables/'))
      out.push(
        v(
          'near-duplicate',
          rel,
          line,
          `export "./${key}" starts with "use-", which is reserved for composables (${RULE_DOC}).`
        )
      )
    if (
      key.endsWith('s') &&
      !PLURAL_ROOTS_ALLOWED.has(key.split('-').pop()) &&
      set.has(key.slice(0, -1))
    )
      out.push(
        v(
          'near-duplicate',
          rel,
          line,
          `export "./${key}" is the plural of "./${key.slice(0, -1)}" — a container for many is "<name>-group" or "<name>-list" (${RULE_DOC}).`
        )
      )
  }
  return out
}

function checkEnforcedExports(rel, text, ctx = {}) {
  let pkg
  try {
    pkg = JSON.parse(text)
  } catch {
    return []
  }
  const subpaths = Object.keys(pkg.exports || {})
    .filter((k) => k.startsWith('./'))
    .map((k) => k.slice(2))
  const at = (msg) => {
    const m = msg.match(/"\.\/([^"]+)"/)
    return m ? lineOf(text, text.indexOf(`"./${m[1]}"`)) : 1
  }
  const out = checkSubpaths(subpaths).map((m) => v('export-kebab', rel, at(m), m))
  for (const m of checkSynonyms(subpaths, ctx.retired || {})) {
    if (!m.startsWith('export ')) continue
    out.push(v(m.includes('was retired') ? 'export-retired' : 'export-synonym', rel, at(m), m))
  }
  return out
}

export function checkPartExports(ctx) {
  const out = []
  if (!ctx?.parts || !ctx?.exports) return out
  for (const { name, rel, root } of ctx.parts) {
    if (name.startsWith(`${root}-`) && !ctx.exports.has(name))
      out.push(
        v(
          'part-export',
          rel,
          1,
          `part "${name}" has no "./${name}" export — every part is importable on its own (${RULE_DOC}).`
        )
      )
  }
  return out
}

function checkTokenTree(ctx) {
  return ctx?.tokenKeys ? checkFillPairs(ctx.tokenKeys) : []
}

export function checkFile(rel, text, ctx = {}) {
  const out = []
  const ext = rel.split('.').pop()
  if (rel.startsWith('packages/') || rel.startsWith('apps/')) {
    if (!rel.includes('/node_modules/') && !rel.startsWith('packages/icons/src/svg-raw/'))
      out.push(...checkFileName(rel))
  }
  if (rel.endsWith('package.json')) {
    out.push(...checkScripts(rel, text))
    if (rel === 'packages/webkit/package.json')
      out.push(...checkExportKeys(rel, text), ...checkEnforcedExports(rel, text, ctx))
    return out
  }
  if (rel.startsWith('.github/workflows/') && /\.ya?ml$/.test(rel))
    return [...out, ...checkWorkflow(rel, text)]
  if (rel.startsWith('packages/icons/src/svg-raw/')) return [...out, ...checkIconFile(rel)]
  if (/^\.specs\/[a-z0-9-]+\.md$/.test(rel)) return [...out, ...checkSpecVocabulary(rel, text, ctx)]
  out.push(...checkEslintRuleFile(rel), ...checkToolingName(rel))
  if (rel === 'packages/webkit-mcp/src/server.js') out.push(...checkMcpTools(rel, text))
  if (rel === 'packages/webkit/src/cli/cli.js') out.push(...checkCliCommands(rel, text))
  if (rel === 'packages/webkit/scripts/build-catalog.mjs') out.push(...checkCatalogWords(rel, text))
  if (/^packages\/webkit\/examples\/[^/]+\/examples\.json$/.test(rel))
    out.push(...checkExampleIndex(rel, text, ctx))
  if (/^packages\/webkit\/blocks\/.+\/block\.json$/.test(rel))
    out.push(...checkBlockFile(rel, text))
  if (/^packages\/webkit\/src\/locales\/[^/]+\.ts$/.test(rel))
    out.push(...checkI18n(rel, text, ctx))
  if (/^packages\/theme\/src\/tokens\//.test(rel) && /\.(js|mjs|css)$/.test(rel))
    out.push(...checkTokenNames(rel, text))
  const code = /\.(vue|ts|js|mjs|tsx|jsx|css)$/.test(rel) && !rel.endsWith('.d.ts')
  if (!code || isTest(rel)) return out
  const inSrc = rel.startsWith('packages/webkit/src/')
  const webkitCode =
    /^packages\/webkit\/(src|blocks|examples)\//.test(rel) || /^apps\/[^/]+\/src\//.test(rel)
  if (!webkitCode) return out
  const cp = componentPath(rel)
  if (cp) out.push(...checkComponentPath(rel, ctx))
  if (ext !== 'css') {
    out.push(...checkHandlers(rel, text))
    if (!MIGRATION_TOOLING.test(rel)) out.push(...checkIconUsage(rel, text, ctx))
  }
  out.push(...checkTokenNames(rel, text))
  if (
    inSrc &&
    /\.[cm]?[jt]s$/.test(rel) &&
    !rel.includes('/eslint-plugin/') &&
    !rel.includes('/cli/')
  )
    out.push(...checkInjectionKeys(rel, text), ...checkComposableFile(rel, text))
  if (ext === 'vue') {
    out.push(
      ...checkDomRefs(rel, text),
      ...checkDataAttributeUsage(rel, text),
      ...checkTemplateModels(rel, text)
    )
    if (cp && cp.root) {
      out.push(...checkTestid(rel, text))
      const stem = cp.file.replace(/\.vue$/, '')
      out.push(...checkSfcVocabulary(rel, text, stem, ctx, cp.root))
      out.push(...checkTypeNames(rel, text, cp.root))
    }
  }
  if (cp && cp.root) {
    out.push(...checkCssVariables(rel, text, cp.root, ctx))
    if (/\.(vue|ts)$/.test(rel)) {
      const stem = cp.file.replace(/\.(vue|ts)$/, '')
      out.push(...checkAxisTypes(rel, text, [...new Set([stem, cp.root, cp.category])], ctx))
    }
  }
  return out
}

const MIGRATION_TOOLING = /^packages\/webkit\/src\/cli\/(migrate[\w-]*\.js|cli\.js|migrations\/.+)$/

const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.turbo',
  'coverage',
  'baselines',
  'worktrees',
  '.git',
  'llms',
  'test-results',
  'playwright-report',
  '.vite'
])

function walk(abs, root, out) {
  if (!existsSync(abs)) return out
  for (const e of readdirSync(abs, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue
    const p = join(abs, e.name)
    if (e.isDirectory()) walk(p, root, out)
    else out.push(relative(root, p).split('\\').join('/'))
  }
  return out
}

const SCAN_ROOTS = [
  'packages/webkit/src',
  'packages/webkit/blocks',
  'packages/webkit/examples',
  'packages/webkit/scripts',
  'packages/theme/src',
  'packages/icons/src/svg-raw',
  'packages/webkit-mcp/src',
  '.specs',
  '.github/workflows',
  '.claude/skills',
  '.claude/agents',
  '.claude/commands',
  'skills',
  'adapters/claude/agents'
]

function repoFiles(root) {
  const files = []
  for (const r of SCAN_ROOTS) walk(join(root, r), root, files)
  if (existsSync(join(root, 'apps')))
    for (const app of readdirSync(join(root, 'apps'))) {
      walk(join(root, 'apps', app, 'src'), root, files)
      if (existsSync(join(root, 'apps', app, 'package.json')))
        files.push(`apps/${app}/package.json`)
    }
  if (existsSync(join(root, '.claude/hooks')))
    for (const f of readdirSync(join(root, '.claude/hooks')))
      if (f.endsWith('.mjs')) files.push(`.claude/hooks/${f}`)
  files.push('package.json')
  for (const pkg of readdirSync(join(root, 'packages')))
    if (existsSync(join(root, 'packages', pkg, 'package.json')))
      files.push(`packages/${pkg}/package.json`)
  return [...new Set(files)].filter((f) => existsSync(join(root, f))).sort()
}

const readJson = (p) => {
  try {
    return JSON.parse(readFileSync(p, 'utf8'))
  } catch {
    return null
  }
}

export function loadContext(root) {
  const pkg = readJson(join(root, 'packages/webkit/package.json')) || {}
  const exports = new Set(
    Object.keys(pkg.exports || {})
      .filter((k) => k.startsWith('./'))
      .map((k) => k.slice(2))
  )
  const icons = new Set()
  for (const set of ['az', 'az-color']) {
    const dir = join(root, 'packages/icons/src/svg-raw', set)
    if (!existsSync(dir)) continue
    for (const f of readdirSync(dir)) if (f.endsWith('.svg')) icons.add(f.replace(/\.svg$/, ''))
  }
  const iconMap = readJson(join(root, 'packages/webkit/src/cli/migrations/v6-icons.json')) || {}
  const iconRenames = Object.fromEntries(
    Object.entries(iconMap.azionicons || {}).map(([from, to]) => [
      `az-${from.replace(/^ai-/, '')}`,
      typeof to === 'string' ? to : (to?.to ?? null)
    ])
  )
  const retired = retiredNames(
    readJson(join(root, 'packages/webkit/src/cli/migrations/v6.json')) || {}
  )
  const specProps = {}
  const specDir = join(root, '.specs')
  if (existsSync(specDir)) {
    for (const f of readdirSync(specDir)) {
      if (!f.endsWith('.md')) continue
      const spec = readFileSync(join(specDir, f), 'utf8')
      const props = new Set()
      if (/`type\??`|`type\?:/.test(spec)) props.add('type')
      if (/`level\??`|`level\?:/.test(spec)) props.add('level')
      if (props.size) specProps[f.replace(/\.md$/, '')] = props
    }
  }
  const parts = []
  const componentNames = new Set()
  const compRoot = join(root, 'packages/webkit/src/components')
  for (const rel of walk(compRoot, root, [])) {
    const cp = componentPath(rel)
    if (!cp || !cp.root || !cp.file.endsWith('.vue')) continue
    const stem = cp.file.replace(/\.vue$/, '')
    if (cp.segs[cp.segs.length - 2] !== stem) continue
    componentNames.add(stem)
    if (stem !== cp.root && cp.segs.length >= 4) parts.push({ name: stem, rel, root: cp.root })
  }
  const cssVarReaders = new Map()
  const types = new Map()
  for (const rel of walk(join(root, 'packages/webkit/src/utils'), root, [])) {
    if (rel.endsWith('.ts') && !isTest(rel))
      collectTypes(readFileSync(join(root, rel), 'utf8'), types)
  }
  for (const rel of walk(compRoot, root, [])) {
    const cp = componentPath(rel)
    if (!cp || !cp.root || !/\.(vue|ts|js|css)$/.test(rel) || isTest(rel)) continue
    const text = readFileSync(join(root, rel), 'utf8')
    if (/\.(vue|ts)$/.test(rel)) collectTypes(text, types)
    for (const m of text.matchAll(/(?:var\(|\()--([a-z0-9-]+)/g)) {
      if (!cssVarReaders.has(m[1])) cssVarReaders.set(m[1], new Set())
      cssVarReaders.get(m[1]).add(cp.root)
    }
  }
  const themeVars = new Set()
  for (const rel of walk(join(root, 'packages/theme/src'), root, [])) {
    if (!/\.(js|mjs|css)$/.test(rel)) continue
    const text = readFileSync(join(root, rel), 'utf8')
    for (const m of text.matchAll(/^\s*'?([a-z][a-z0-9-]*)'?\s*:/gm)) {
      themeVars.add(m[1])
      if (m[1].startsWith('text-'))
        for (const suffix of TYPOGRAPHY_SUFFIXES) themeVars.add(`${m[1]}-${suffix}`)
    }
    for (const m of text.matchAll(/var\(--([a-z0-9-]+)/g)) themeVars.add(m[1])
  }
  const tokenKeys = []
  const themeDir = join(root, 'packages/theme/src/tokens/theme')
  for (const rel of walk(themeDir, root, [])) {
    if (!rel.endsWith('.js')) continue
    const text = readFileSync(join(root, rel), 'utf8')
    for (const m of text.matchAll(/^\s*'?([a-z][a-z0-9-]*)'?\s*:/gm)) tokenKeys.push(m[1])
  }
  return {
    exports,
    icons,
    iconRenames,
    retired,
    parts,
    componentNames,
    tokenKeys,
    specProps,
    cssVarReaders,
    themeVars,
    types
  }
}

export function scanRepo(root, ctx = loadContext(root)) {
  const out = []
  for (const rel of repoFiles(root)) {
    let text = ''
    try {
      if (statSync(join(root, rel)).size > 2_000_000) continue
      text = rel.endsWith('.svg') ? '' : readFileSync(join(root, rel), 'utf8')
    } catch {
      continue
    }
    out.push(...checkFile(rel, text, ctx))
  }
  out.push(...checkPartExports(ctx), ...checkTokenTree(ctx))
  return out
}

export function countByRule(violations) {
  const counts = Object.fromEntries(Object.keys(RULES).map((r) => [r, 0]))
  for (const x of violations) counts[x.rule] = (counts[x.rule] ?? 0) + 1
  return counts
}

export function addedViolations(before, after) {
  const key = (x) => `${x.rule}\u0000${x.message}`
  const left = new Map()
  for (const x of before) left.set(key(x), (left.get(key(x)) ?? 0) + 1)
  const out = []
  for (const x of after) {
    const n = left.get(key(x)) ?? 0
    if (n > 0) left.set(key(x), n - 1)
    else out.push(x)
  }
  return out
}
