// Canonical prop vocabulary (machine-readable side of .claude/rules/prop-vocabulary.md).
// Consumed by validate-spec-compliance.mjs (write-time block), check-authoring.mjs (CI
// ratchet), the naming engine (packages/webkit/scripts/lib/naming-rules.mjs, which reports
// every entry) and build-catalog.mjs (stamps `vocabulary` into catalog.json for the MCP).
//
// Two stages. `aliases`, `VALUES`, the `enforced` VALUE_PATTERNS, PATTERNS, SLOTS and
// EVENT_WORDS are blocked today by the spec-compliance hook and ratchet. `staged` aliases,
// STAGED_VALUES, the other VALUE_PATTERNS, GROUP_LABEL and DATA_ATTRIBUTES belong to the
// 6.0 naming standard (decisions N1-N18) still being applied: the naming check reports
// them now and blocks them once the lead flips NAMING_STAGED_BLOCKS in
// packages/webkit/scripts/lib/naming-rules.mjs. Pass { stage: 'all' } to see both.

export const CONCEPTS = [
  {
    concept: 'visual variant (the look); a sort of part is `type`',
    canonical: 'variant',
    aliases: [
      'appearance',
      'intent',
      'headerVariant',
      'mediaKind',
      'cardStyle',
      'kind',
      'look',
      'styleVariant'
    ]
  },
  {
    concept: 'severity (colour meaning: neutral | info | success | warning | danger)',
    canonical: 'severity',
    aliases: ['tone']
  },
  {
    concept: 'job or step status (pending | running | success | error | canceled | skipped)',
    canonical: 'status',
    aliases: ['state', 'phase', 'outcome']
  },
  {
    concept: 'light-dismiss (closes on outside-click / Esc)',
    canonical: 'dismissible',
    aliases: ['dismissable', 'closeable']
  },
  {
    concept: 'primary heading text',
    canonical: 'title',
    aliases: ['heading', 'header'],
    staged: ['headline']
  },
  {
    concept: 'primary two-way-bound value',
    canonical: 'modelValue',
    aliases: ['isToggled']
  },
  {
    concept: 'anything that opens (v-model:open, data-state="open|closed")',
    canonical: 'open',
    aliases: ['expanded', 'visible', 'show', 'opened', 'shown']
  },
  {
    concept: 'ids of the parts that are open (v-model:openKeys, like selectedKeys)',
    canonical: 'openKeys',
    aliases: ['expandedKeys', 'expandedIds', 'openIds', 'expandedItems']
  },
  {
    concept: 'page or item you are on (renders aria-current)',
    canonical: 'active',
    aliases: ['current', 'activated', 'isCurrent']
  },
  {
    concept: 'picked keys of a multi-selection (v-model:selectedKeys)',
    canonical: 'selectedKeys',
    aliases: ['selectedIds', 'selectedValues', 'checkedKeys', 'selectedItems', 'rowSelection']
  },
  {
    concept: 'current page, 1-based (v-model:page, with v-model:pageSize)',
    canonical: 'page',
    aliases: ['pagination', 'pageIndex', 'currentPage']
  },
  {
    concept: 'disabled',
    canonical: 'disabled',
    aliases: [],
    staged: ['enabled']
  },
  {
    concept: 'leading or trailing glyph (icon name)',
    canonical: 'icon',
    aliases: [],
    staged: ['iconName', 'leadingIcon', 'trailingIcon']
  },
  {
    concept: 'in-page anchor id',
    canonical: 'anchor',
    aliases: ['anchorId', 'sectionId', 'hash']
  },
  {
    concept: 'side of the anchor an overlay opens on (with align and sideOffset)',
    canonical: 'side',
    aliases: ['placement']
  },
  {
    concept: 'validation state',
    canonical: 'invalid',
    aliases: ['hasError', 'isInvalid']
  },
  {
    concept: 'read-only',
    canonical: 'readonly',
    aliases: ['readOnly', 'isReadonly']
  },
  {
    concept: 'outline around the box',
    canonical: 'bordered',
    aliases: ['border', 'hasBorder']
  },
  {
    concept: 'copy affordance',
    canonical: 'copyable',
    aliases: ['showCopy']
  },
  {
    concept: 'self-advancing media',
    canonical: 'autoplay',
    aliases: ['autoPlay']
  },
  {
    concept: 'self-advancing media interval (ms)',
    canonical: 'autoplayInterval',
    aliases: ['autoPlayInterval', 'interval']
  },
  {
    concept: 'motion on / off (positive polarity)',
    canonical: 'animated',
    aliases: ['still']
  },
  {
    concept: 'short label above a heading',
    canonical: 'eyebrow',
    aliases: ['overline'],
    staged: ['kicker', 'tagline']
  },
  {
    concept: 'text of a link or call-to-action',
    canonical: 'linkLabel',
    aliases: ['link', 'cta']
  },
  {
    concept: 'column count below md',
    canonical: 'mobileColumns',
    aliases: ['mobileCols']
  },
  {
    concept: 'number of grid columns',
    canonical: 'columns',
    aliases: [],
    staged: ['cols']
  },
  {
    concept:
      'choices the user picks a value from (items for displayed lists, data + columns for tables)',
    canonical: 'options',
    aliases: [],
    staged: ['model', 'choices']
  },
  {
    concept: 'identity key of a row (rowKey) or list item (itemKey)',
    canonical: 'itemKey',
    aliases: ['trackBy', 'dataKey', 'keyField', 'idKey']
  },
  {
    concept: 'empty-state title (with emptyDescription, emptyActionLabel)',
    canonical: 'emptyTitle',
    aliases: ['emptyText', 'emptyMessage', 'emptyLabel', 'noResultsText', 'noDataText', 'empty']
  },
  {
    concept: 'main call-to-action object (with secondaryAction, one shared type)',
    canonical: 'primaryAction',
    aliases: [],
    staged: ['mainAction', 'primaryCta', 'primaryButton']
  },
  {
    concept: 'second call-to-action object',
    canonical: 'secondaryAction',
    aliases: [],
    staged: ['secondaryCta', 'secondaryButton']
  },
  {
    concept: 'heading level of a title the component renders',
    canonical: 'headingLevel',
    aliases: [],
    staged: ['titleLevel', 'headingTag', 'headerLevel']
  },
  {
    concept: 'where a link opens (target, as on button and link)',
    canonical: 'target',
    aliases: ['external', 'newTab', 'openInNewTab', 'blank']
  },
  {
    concept: 'more than one may be picked',
    canonical: 'multiple',
    aliases: ['multi']
  }
]

// Group parts name their header text `label` (like DropdownMenu.Group, Select.Group).
export const GROUP_LABEL = {
  canonical: 'label',
  staged: ['title', 'heading', 'header', 'groupLabel'],
  appliesTo: (component) => /-group$/.test(component || '')
}

// Prop-name shapes that read backwards or borrow another library's words.
export const PATTERNS = [
  {
    test: /^hide[A-Z]/,
    fix: (n) => `show${n.slice(4)}`,
    concept: 'part visibility toggle (show<Part>, positive)'
  },
  {
    test: /^enable[A-Z]/,
    fix: (n) => `${n.slice(6, 7).toLowerCase()}${n.slice(7)} as an -able adjective`,
    concept: 'capability (sortable, selectable, copyable)'
  },
  {
    test: /^disable[A-Z]/,
    fix: (n) => `the positive form of ${n.slice(7)}`,
    concept: 'positive boolean'
  }
]

// Shared value tokens: prop -> { banned value: canonical value }. `VALUES` blocks today;
// `STAGED_VALUES` is the 6.0 standard. A prop matched by VALUE_PATTERNS uses that map.
export const VALUES = {
  severity: {
    error: 'danger',
    destructive: 'danger',
    default: 'neutral',
    secondary: 'neutral',
    alt: 'neutral'
  },
  status: {
    done: 'success',
    ok: 'success',
    complete: 'success',
    completed: 'success',
    succeeded: 'success',
    finished: 'success',
    failed: 'error',
    failure: 'error',
    errored: 'error',
    cancelled: 'canceled',
    queued: 'pending',
    waiting: 'pending',
    'in-progress': 'running',
    progress: 'running'
  },
  variant: {
    outlined: 'outline',
    transparent: 'ghost',
    text: 'ghost',
    destructive: 'danger',
    error: 'danger'
  }
}

export const STAGED_VALUES = {}

const POSITION = {
  left: 'leading',
  right: 'trailing',
  start: 'leading',
  end: 'trailing',
  before: 'leading',
  after: 'trailing',
  prefix: 'leading',
  suffix: 'trailing'
}
const ALIGN = { left: 'start', right: 'end', top: 'start', bottom: 'end', centered: 'center' }
const SIDE = { left: 'start', right: 'end' }

export const VALUE_PATTERNS = [
  { test: /Position$/, map: POSITION, concept: 'position inside the component', enforced: true },
  { test: /^align$|Align$|^alignment$/, map: ALIGN, concept: 'alignment', enforced: true },
  { test: /^side$|Side$/, map: SIDE, concept: 'side', enforced: true },
  {
    test: /^selectionMode$|Mode$/,
    map: { multi: 'multiple' },
    concept: 'selection mode',
    enforced: true
  },
  {
    test: /^treatment$|Treatment$/,
    map: { 'as-is': 'color', original: 'color', 'invert-light': 'knockout' },
    concept: 'logo treatment'
  }
]

// Closed value sets: every member of a matching union is a shared value or an extra the
// component documents here (prop-vocabulary.md, "Closed value sets"). Extras are keyed by
// the component's kebab name, or by "<component>.<prop>" for one prop. A `variant` union
// made only of alignment words is the `align` axis, never a look.
export const SHARED_VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'danger', 'link']
export const SEVERITY_VALUES = ['neutral', 'info', 'success', 'warning', 'danger']
export const STATUS_VALUES = [
  'pending',
  'running',
  'success',
  'error',
  'canceled',
  'skipped',
  'streaming'
]
export const ORIENTATION_VALUES = ['horizontal', 'vertical']
export const ALIGN_WORDS = ['start', 'center', 'end', 'split', 'left', 'right']

export const VARIANT_EXTRAS = {
  'app-header': ['content', 'site'],
  'article-index-section.rowVariant': ['byline', 'center'],
  avatar: ['circle', 'square'],
  backdrop: ['globe', 'map', 'network'],
  'bento-grid': ['surface', 'canvas', 'none'],
  brand: ['default', 'reduced', 'extended'],
  'call-to-action': ['panel', 'split', 'lead', 'announcement'],
  card: ['default', 'integration'],
  'card-grid': ['gap', 'divider', 'frame', 'surface', 'canvas', 'none'],
  carousel: ['strip', 'cards'],
  chip: ['filled', 'dashed'],
  'closing-call-to-action-section': ['panel', 'frame'],
  'console-mockup': ['window', 'bare'],
  'console-showcase-section': ['console', 'diagram'],
  'doc-callout': ['note', 'info', 'tip', 'check', 'warning'],
  'doc-prompt': ['block', 'line'],
  'feature-tiles-section': ['artwork', 'illustrated'],
  'file-dropzone': ['inline', 'overlay'],
  footer: ['content', 'site', 'console'],
  hero: ['band', 'screen'],
  'hero-section': [
    'center',
    'title-band',
    'center-band',
    'compact-band',
    'copy-beside-art',
    'copy-on-top-art'
  ],
  item: ['default', 'muted', 'inline', 'option'],
  kbd: ['combined', 'separate'],
  'key-value-list': ['stacked', 'split'],
  'third-party-logo': ['color', 'monochrome', 'current', 'knockout'],
  'logo-wall': ['square', 'rectangle'],
  'logo-wall-section': ['wall', 'quote'],
  'logo-wall-section.quoteVariant': ['highlight', 'signed'],
  marquee: ['plain', 'band'],
  'media-split': ['media-end', 'media-start'],
  'media-tile': ['frame', 'plain'],
  'multi-select': ['summary', 'chips'],
  'navigation-menu': ['default', 'contrast'],
  'network-section': ['outcomes', 'benefits', 'stats'],
  'pricing-card': ['contained'],
  progress: ['rounded', 'flat'],
  quote: ['inline', 'signed', 'highlight'],
  'radio-group': ['default', 'card'],
  'response-loading': ['inline', 'bar'],
  'save-bar': ['floating', 'docked', 'plain', 'fade', 'centered'],
  'settings-row': ['field', 'compact', 'stacked'],
  'sidebar-menu-item.tagVariant': ['accent'],
  'site-footer-section': ['content', 'site'],
  skeleton: ['rectangle', 'circle'],
  'stat-tile': ['mono', 'sans'],
  switch: ['default', 'privacy'],
  tag: ['accent', 'contrast', 'highlight'],
  texture: ['dots', 'grid', 'lines', 'dither', 'pixelate', 'none']
}
export const SEVERITY_EXTRAS = {
  chart: ['severity-critical', 'severity-high', 'severity-medium', 'severity-low', 'severity-info'],
  'severity-tag': ['critical', 'high', 'medium', 'low']
}
export const STATUS_EXTRAS = {
  'prompt-input': ['ready'],
  'tool-approval': ['approved', 'denied', 'expired'],
  'tool-call': ['denied']
}
export const ORIENTATION_EXTRAS = {
  field: ['responsive'],
  'scroll-area': ['both']
}

export const VALUE_SETS = [
  {
    axis: 'variant',
    test: /^variant$|[a-z]Variant$/,
    values: SHARED_VARIANTS,
    extras: VARIANT_EXTRAS
  },
  {
    axis: 'severity',
    test: /^severity$|[a-z]Severity$/,
    values: SEVERITY_VALUES,
    extras: SEVERITY_EXTRAS
  },
  { axis: 'status', test: /^status$|[a-z]Status$/, values: STATUS_VALUES, extras: STATUS_EXTRAS },
  {
    axis: 'orientation',
    test: /^orientation$|[a-z]Orientation$/,
    values: ORIENTATION_VALUES,
    extras: ORIENTATION_EXTRAS
  }
]

export function valueSetFor(prop) {
  return VALUE_SETS.find((x) => x.test.test(prop)) || null
}

export function extrasFor(set, component, prop, root = component) {
  return [
    ...(set.extras[`${component}.${prop}`] || []),
    ...(set.extras[component] || []),
    ...(set.extras[root] || [])
  ]
}

/**
 * Check a union's members against its closed value set. Returns an error message or null.
 * `members` is the resolved list of string literals.
 */
export function checkValueSet(prop, members, component, root = component) {
  const set = valueSetFor(prop)
  if (!set || !members?.length) return null
  if (set.axis === 'variant' && members.every((m) => ALIGN_WORDS.includes(m)))
    return `${prop} values ${members.map((m) => `'${m}'`).join(' | ')} are alignment, not a look — name the prop "align" (${RULE_DOC}).`
  const allowed = new Set([...set.values, ...extrasFor(set, component, prop, root)])
  const bad = members.filter((m) => !allowed.has(m))
  if (!bad.length) return null
  return `${prop} values ${bad.map((b) => `'${b}'`).join(', ')} are outside the ${set.axis} set (${set.values.join(' | ')}) and not a documented ${component} extra (${RULE_DOC}).`
}

// Two-way models (defineModel). The primary value is the default model; a named model
// takes the type its concept fixes, so the same concept binds the same shape everywhere.
// An id is a key: one id is `<x>Key`, a list is `<x>Keys`. A seed is `default<Model>`.
export const MODELS = {
  banned: {
    value: 'the default model, defineModel<T>() bound with v-model (never v-model:value)'
  },
  types: [
    {
      test: /Keys$/,
      type: /^string\[\]$/,
      want: 'string[]',
      concept: 'ids of picked or open items'
    },
    { test: /Key$/, type: /^string( \| null)?$/, want: 'string | null', concept: 'id of one item' },
    { test: /^open$|[a-z]Open$/, type: /^boolean$/, want: 'boolean', concept: 'open state' },
    {
      test: /^(selected|active)$/,
      type: /^boolean$/,
      want: 'boolean (a single picked id is selectedKey)',
      concept: 'picked or current flag'
    },
    {
      test: /^(page|pageSize)$/,
      type: /^number$/,
      want: 'number',
      concept: '1-based page and page size'
    },
    {
      test: /Index$/,
      type: /^number( \| null)?$/,
      want: 'number | null',
      concept: 'position in a list'
    }
  ],
  idWord: /[a-z]Ids?$|^ids?$/,
  seedPrefix: /^initial[A-Z]/
}

// Size scale: tiny and xlarge exist only for a component that truly needs a 4th step.
export const SIZE = {
  prop: 'size',
  canonical: ['tiny', 'small', 'medium', 'large', 'xlarge'],
  bannedTokens: ['xs', 'sm', 'md', 'lg', 'xl', '2xs', '2xl', 'xxs', 'xxl']
}

export const CLOSABLE = {
  prop: 'closable',
  defaultTrue: ['dialog', 'drawer'],
  default: false
}

// Negated booleans that must be inverted (flip the default too). `disabled` / `readonly`
// are the accepted exceptions.
export const NEGATIVE_BOOLEANS = {
  hidden: 'show<Part>',
  closed: 'open',
  inactive: 'active',
  invisible: 'show<Part>',
  collapsed: 'open'
}

// Slot names (6.0 standard, enforced): leading/trailing for adornments, start/end for sides.
export const SLOTS = {
  prefix: 'leading',
  suffix: 'trailing',
  left: 'leading',
  right: 'trailing',
  prepend: 'leading',
  append: 'trailing',
  'icon-left': 'leading',
  'icon-right': 'trailing',
  'header-start': 'header-leading',
  'header-end': 'header-trailing',
  action: 'actions',
  'header-action': 'header-actions',
  breadcrumb: 'breadcrumbs'
}

// Words inside an event name (6.0 standard, enforced).
export const EVENT_WORDS = {
  dblclick: 'double-click',
  finish: 'complete',
  finished: 'complete',
  done: 'complete',
  failed: 'error',
  fail: 'error',
  dismiss: 'close',
  delete: 'remove'
}

// data-* attribute names (6.0 standard, staged).
export const DATA_ATTRIBUTES = {
  'data-kind': 'data-variant (look) or data-type (sort of part)',
  'data-open': 'data-state="open|closed"',
  'data-expanded': 'data-state="open|closed"',
  'data-collapsed': 'data-state="open|closed"',
  'data-shown': 'data-state="open|closed"',
  'data-visible': 'data-state="open|closed"',
  'data-current': 'data-active',
  'data-border': 'data-bordered',
  'data-tone': 'data-status or data-severity',
  'data-has-icon-left': 'data-leading',
  'data-has-icon-right': 'data-trailing',
  'data-inactive': 'data-disabled or data-inert',
  'data-part': 'data-slot',
  'data-focus': 'data-focused',
  'data-hover': 'data-hovered',
  'data-highlight': 'data-highlighted'
}

const RULE_DOC = '.claude/rules/prop-vocabulary.md'

/** Canonical name for a banned prop or model name, or null. */
export function canonicalFor(name, stage = 'all') {
  return aliasMap(stage)[name]?.canonical ?? null
}

function aliasMap(stage) {
  const map = {}
  for (const c of CONCEPTS) {
    for (const a of c.aliases)
      map[a] = { canonical: c.canonical, concept: c.concept, staged: false }
    if (stage === 'all') {
      for (const a of c.staged || [])
        map[a] = { canonical: c.canonical, concept: c.concept, staged: true }
    }
  }
  return map
}

function unionOf(p, opts) {
  let union = p.type || ''
  if (!/'/.test(union) && typeof opts.resolveTypeUnion === 'function') {
    union = opts.resolveTypeUnion(union.trim()) || union
  }
  return union
}

function membersOf(unionText) {
  return [...String(unionText).matchAll(/'([a-zA-Z0-9-]+)'/g)].map((m) => m[1])
}

export function valueMapFor(prop, stage = 'enforced') {
  const out = { ...(VALUES[prop] || {}) }
  for (const p of VALUE_PATTERNS) if (p.enforced && p.test.test(prop)) Object.assign(out, p.map)
  if (stage !== 'all') return Object.keys(out).length ? out : null
  Object.assign(out, STAGED_VALUES[prop] || {})
  for (const p of VALUE_PATTERNS) if (p.test.test(prop)) Object.assign(out, p.map)
  return Object.keys(out).length ? out : null
}

/**
 * Check a component's parsed props against the vocabulary. Returns
 * [{ prop, message, rule, staged }]. `opts.stage` is 'enforced' (default: what blocks
 * today) or 'all' (the 6.0 standard). `opts.component` (kebab name) enables the
 * group-label rule. `opts.resolveTypeUnion(typeText)` resolves a named union.
 */
export function checkPropVocabulary(props, opts = {}) {
  const stage = opts.stage || 'enforced'
  const violations = []
  const map = aliasMap(stage)
  const push = (prop, message, rule, staged) => violations.push({ prop, message, rule, staged })
  for (const p of props) {
    if (
      stage === 'all' &&
      GROUP_LABEL.appliesTo(opts.component) &&
      GROUP_LABEL.staged.includes(p.name)
    ) {
      push(
        p.name,
        `Prop "${p.name}" on a group part is its header text — use "${GROUP_LABEL.canonical}" (${RULE_DOC}).`,
        'prop-name',
        true
      )
      continue
    }
    const hit = map[p.name]
    if (hit) {
      push(
        p.name,
        `Prop "${p.name}" is not allowed — use the canonical "${hit.canonical}" for the ${hit.concept} concept (${RULE_DOC}).`,
        'prop-name',
        hit.staged
      )
      continue
    }
    if (/^(is|has)[A-Z]/.test(p.name)) {
      const suggested = p.name.replace(/^(is|has)/, '').replace(/^./, (ch) => ch.toLowerCase())
      push(
        p.name,
        `Boolean prop "${p.name}" must drop the is/has prefix — use "${suggested}" (${RULE_DOC}).`,
        'prop-name',
        false
      )
      continue
    }
    if (NEGATIVE_BOOLEANS[p.name]) {
      push(
        p.name,
        `Boolean prop "${p.name}" is negative — use the positive "${NEGATIVE_BOOLEANS[p.name]}" and flip the default (${RULE_DOC}).`,
        'prop-name',
        false
      )
      continue
    }
    const pattern = PATTERNS.find((x) => x.test.test(p.name) && p.name !== 'disabled')
    if (pattern) {
      push(
        p.name,
        `Prop "${p.name}" reads backwards — use ${pattern.fix(p.name)} (${pattern.concept}) (${RULE_DOC}).`,
        'prop-name',
        false
      )
      continue
    }
    const valueMap = valueMapFor(p.name, stage)
    if (valueMap) {
      const msg = checkValueUnion(p.name, unionOf(p, opts), stage)
      if (msg) {
        const enforcedMsg = stage === 'all' ? checkValueUnion(p.name, unionOf(p, opts)) : msg
        push(p.name, msg, 'prop-value', !enforcedMsg)
        continue
      }
    }
    const members =
      typeof opts.resolveMembers === 'function'
        ? opts.resolveMembers(p.type || '')
        : membersOf(unionOf(p, opts))
    if (opts.component && valueSetFor(p.name)) {
      const msg = checkValueSet(p.name, members, opts.component, opts.root)
      if (msg) {
        push(p.name, msg, 'prop-value', false)
        continue
      }
    }
    if (p.name === SIZE.prop || (opts.component && /[a-z]Size$/.test(p.name))) {
      const text = members ? members.map((m) => `'${m}'`).join(' | ') : unionOf(p, opts)
      const msg = checkSizeUnion(text)
      if (msg) push(p.name, msg, 'prop-value', false)
    }
  }
  return violations
}

/**
 * Validate a prop's union STRING against its value map. Returns an error message or null
 * (also null when the text is not a string-literal union).
 */
export function checkValueUnion(prop, unionText, stage = 'enforced') {
  const banned = valueMapFor(prop, stage)
  if (!banned) return null
  const bad = membersOf(unionText).filter((m) => Object.hasOwn(banned, m))
  if (!bad.length) return null
  const fixes = bad.map((b) => `'${b}' → '${banned[b]}'`).join(', ')
  return `${prop} values ${bad.map((b) => `'${b}'`).join(', ')} are not allowed — use the shared token (${fixes}) (${RULE_DOC}).`
}

/**
 * Validate a `size` union STRING: only the canonical tokens, in canonical order (a subset
 * is fine). Returns an error message or null.
 */
export function checkSizeUnion(unionText) {
  const members = membersOf(unionText)
  if (!members.length) return null
  const canon = SIZE.canonical
  const bad = members.filter((m) => !canon.includes(m))
  if (bad.length) {
    return (
      `size values ${bad.map((b) => `'${b}'`).join(', ')} are not allowed — ` +
      `use 'small' | 'medium' | 'large' (tiny / xlarge only for a 4th step; a subset is fine, in that order) (${RULE_DOC}).`
    )
  }
  const idx = members.map((m) => canon.indexOf(m))
  const ordered = [...idx].sort((a, b) => a - b)
  if (idx.join(',') !== ordered.join(',')) {
    const want = canon
      .filter((c) => members.includes(c))
      .map((c) => `'${c}'`)
      .join(' | ')
    return `size union must be declared in canonical order: ${want} (${RULE_DOC}).`
  }
  return null
}

/**
 * Check event names. Returns [{ event, message, rule, staged }]: kebab-case (an
 * update:<prop> event is exempt), no `<x>-change` echo of `update:<x>`, and with
 * { stage: 'all' } the 6.0 event words.
 */
export function checkEventVocabulary(emits, opts = {}) {
  const stage = opts.stage || 'enforced'
  const violations = []
  const names = new Set(emits.map((e) => e.name))
  for (const e of emits) {
    if (!e.name.includes(':') && /^[a-z]+[A-Z]/.test(e.name)) {
      const suggested = e.name.replace(/([A-Z])/g, '-$1').toLowerCase()
      violations.push({
        event: e.name,
        rule: 'event-name',
        staged: false,
        message: `Event "${e.name}" must be kebab-case — use "${suggested}" (${RULE_DOC}).`
      })
      continue
    }
    const m = e.name.match(/^(.+)-change$/)
    if (m && names.has(`update:${m[1]}`)) {
      violations.push({
        event: e.name,
        rule: 'event-name',
        staged: false,
        message: `Event "${e.name}" is redundant — it echoes "update:${m[1]}". Remove it; consumers use "@update:${m[1]}" / v-model. (A distinct commit event should be a bare "change", not "<x>-change".) (${RULE_DOC}).`
      })
      continue
    }
    if (!e.name.startsWith('update:')) {
      const word = e.name.split('-').find((w) => Object.hasOwn(EVENT_WORDS, w))
      if (word) {
        violations.push({
          event: e.name,
          rule: 'event-name',
          staged: false,
          message: `Event "${e.name}" uses "${word}" — say "${EVENT_WORDS[word]}" (${RULE_DOC}).`
        })
      }
    }
  }
  return violations
}

/** Check slot names (6.0 standard). Returns [{ slot, message, rule, staged }]. */
export function checkSlotVocabulary(slots) {
  const out = []
  for (const s of slots) {
    const name = s.name ?? s
    if (/[A-Z_]/.test(name)) {
      out.push({
        slot: name,
        rule: 'slot-name',
        staged: true,
        message: `Slot "${name}" must be kebab-case (.claude/rules/slots.md).`
      })
      continue
    }
    if (Object.hasOwn(SLOTS, name)) {
      out.push({
        slot: name,
        rule: 'slot-name',
        staged: false,
        message: `Slot "${name}" is not allowed — use "${SLOTS[name]}" (leading/trailing for adornments, start/end for sides) (${RULE_DOC}).`
      })
    }
  }
  return out
}

/** Check data-* attribute names (6.0 standard). Returns [{ attribute, message, rule, staged }]. */
export function checkDataAttributes(names) {
  const out = []
  for (const name of names) {
    if (Object.hasOwn(DATA_ATTRIBUTES, name)) {
      out.push({
        attribute: name,
        rule: 'data-attribute',
        staged: true,
        message: `Attribute "${name}" is not allowed — use ${DATA_ATTRIBUTES[name]} (${RULE_DOC}).`
      })
    } else if (!/^data-[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
      out.push({
        attribute: name,
        rule: 'data-attribute',
        staged: true,
        message: `Attribute "${name}" must be kebab-case (${RULE_DOC}).`
      })
    }
  }
  return out
}

/** JSON-serializable snapshot for catalog.json (the 6.0 standard the MCP steers toward). */
export function vocabularySnapshot() {
  return {
    props: CONCEPTS.map((c) => ({
      concept: c.concept,
      canonical: c.canonical,
      aliases: [...c.aliases, ...(c.staged || [])]
    })),
    groupLabel: { canonical: GROUP_LABEL.canonical, aliases: GROUP_LABEL.staged },
    size: { canonical: SIZE.canonical, bannedTokens: SIZE.bannedTokens },
    closable: { defaultTrue: CLOSABLE.defaultTrue, default: CLOSABLE.default },
    booleanPrefixes: { banned: ['is', 'has', 'hide', 'enable', 'disable'] },
    negativeBooleans: NEGATIVE_BOOLEANS,
    values: Object.fromEntries(
      [...new Set([...Object.keys(VALUES), ...Object.keys(STAGED_VALUES)])].map((k) => [
        k,
        { ...(VALUES[k] || {}), ...(STAGED_VALUES[k] || {}) }
      ])
    ),
    positions: { leadingTrailing: POSITION, align: ALIGN, side: SIDE },
    slots: SLOTS,
    dataAttributes: DATA_ATTRIBUTES,
    events: {
      convention: 'kebab-case, or update:<prop> for v-model',
      noEchoRule:
        'Do not emit "<x>-change" when "update:<x>" exists — it is redundant; use v-model / @update:<x>.',
      words: EVENT_WORDS
    }
  }
}
