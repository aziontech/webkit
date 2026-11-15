import { isCommentScoped, proseComments } from './comment-scan.js'

export const isVue = (rel) => rel.endsWith('.vue')
export const isComposable = (rel) => /(^|\/)use-[^/]*\.(ts|js)$/.test(rel)
export const isJsComposable = (rel) => /(^|\/)use-[^/]*\.js$/.test(rel)

const SLOT_PRESENCE = /\b\$?slots(?:\.[\w$]+(?![\w$])|\[[^\]]+\])(?!\s*(?:\?\.)?\()/

function skipTypeArguments(text, start) {
  let i = start
  while (/\s/.test(text[i] ?? '')) i++
  if (text[i] !== '<') return i
  let depth = 0
  for (; i < text.length; i++) {
    if (text[i] === '<') depth++
    else if (text[i] === '>' && text[i - 1] !== '=') depth--
    if (depth === 0) break
  }
  i++
  while (/\s/.test(text[i] ?? '')) i++
  return i
}

function computedBodies(text) {
  const bodies = []
  const re = /\bcomputed\b/g
  let match
  while ((match = re.exec(text))) {
    const open = skipTypeArguments(text, re.lastIndex)
    if (text[open] !== '(') continue
    let depth = 1
    let i = open + 1
    while (i < text.length && depth > 0) {
      if (text[i] === '(') depth++
      else if (text[i] === ')') depth--
      i++
    }
    bodies.push({ start: match.index, body: text.slice(open + 1, i - 1) })
  }
  return bodies
}

const slotPresenceSites = (text) =>
  computedBodies(text)
    .filter(({ body }) => SLOT_PRESENCE.test(body))
    .map(({ start }) => start)

const isShippedComponent = (rel) => /(^|\/)packages\/webkit\/src\/components\/.+\.vue$/.test(rel)

const COMPONENT_TAG = /<([A-Z][\w.]*|[a-z][a-z0-9]*-[\w-]*)(?=[\s/>])/g

function doubleSlashAttributeSites(text) {
  const open = text.indexOf('<template')
  const close = text.lastIndexOf('</template>')
  if (open < 0 || close < open) return []
  const sites = []
  COMPONENT_TAG.lastIndex = open
  let tag
  while ((tag = COMPONENT_TAG.exec(text)) && tag.index < close) {
    let i = tag.index + tag[0].length
    while (i < close && text[i] !== '>') {
      const quote = text[i]
      if (quote === '"' || quote === "'") {
        const end = text.indexOf(quote, i + 1)
        if (end < 0) break
        if (text.slice(i + 1, end).includes('//')) sites.push(i)
        i = end + 1
      } else i++
    }
    COMPONENT_TAG.lastIndex = i
  }
  return sites
}

export const CONTENT_CHECKS = [
  {
    id: 'manual-v-model',
    applies: isVue,
    violated: (t) => /update:modelValue/.test(t) && /\bmodelValue\s*[?:]/.test(t),
    message:
      'Hand-rolled `modelValue` prop + `update:modelValue` emit. Express the two-way value with `defineModel()` (controlled + uncontrolled in one macro).'
  },
  {
    id: 'runtime-define-props',
    applies: isVue,
    violated: (t) => /defineProps\s*\(\s*\{/.test(t),
    message:
      'Runtime object `defineProps({...})`. Use a named `interface Props` + `defineProps<Props>()` + `withDefaults`.'
  },
  {
    id: 'runtime-define-emits',
    applies: isVue,
    violated: (t) => /defineEmits\s*\(\s*[[{]/.test(t),
    message:
      'Runtime `defineEmits([...])` / `defineEmits({...})`. Use the typed `defineEmits<{ ... }>()` form.'
  },
  {
    id: 'slot-without-defineslots',
    applies: isVue,
    violated: (t) => /<slot[\s/>]/.test(t) && !/defineSlots/.test(t),
    message:
      'Template renders `<slot>` but declares no typed `defineSlots<{ ... }>()`. Declare every slot.'
  },
  {
    id: 'computed-slot-presence',
    applies: isVue,
    violated: (t) => slotPresenceSites(t).length > 0,
    count: (t) => slotPresenceSites(t).length,
    locate: (t) => slotPresenceSites(t),
    message:
      'Slot presence read inside `computed()`. `slots` is not reactive, so the cached value never sees a slot appear or disappear (a `v-if` slot, a server render that differs from the client) and leaves an empty band behind. Read it at render: `const hasX = () => Boolean(slots.x)` and `v-if="hasX()"`.'
  },
  {
    id: 'component-attr-double-slash',
    applies: isShippedComponent,
    violated: (t) => doubleSlashAttributeSites(t).length > 0,
    count: (t) => doubleSlashAttributeSites(t).length,
    locate: (t) => doubleSlashAttributeSites(t),
    message:
      'An attribute value on a component tag contains `//` (a `"//"` eyebrow prefix, an `https://` URL). vue-tsc 3.3.9+ rewrites `//` in component props as a comment, so a consumer that type-checks the shipped `.vue` gets TS2304 for every `v-for` variable after it. Move the value into a script constant (`const EYEBROW_PREFIX = \'//\' as const`) and bind it (`:prefix="EYEBROW_PREFIX"`).'
  },
  {
    id: 'composable-return-reactive',
    applies: isComposable,
    violated: (t) => /return\s+reactive\s*\(/.test(t),
    message:
      'Composable returns `reactive(...)` (destructuring loses reactivity). Return refs/computed/functions; wrap escaping state in `readonly()`.'
  },
  {
    id: 'deprecated-without-replacement',
    applies: () => true,
    violated: (t) => {
      const re = /@deprecated([^\n]*(?:\r?\n[ \t]*\*(?!\/)[^\n]*)*)/g
      let m
      while ((m = re.exec(t))) {
        const rest = m[1]
          .replace(/\r?\n[ \t]*\*/g, ' ')
          .replace(/\*\/[^]*$/, '')
          .trim()
        if (!rest) return true
      }
      return false
    },
    message:
      '`@deprecated` with no replacement/removal version. Name the replacement and the removal version (e.g. "@deprecated since 4.2 — use `kind`. Removed in 5.0").'
  },
  {
    id: 'prose-comment',
    applies: isCommentScoped,
    violated: (t, rel) => proseComments(rel, t).length > 0,
    count: (t, rel) => proseComments(rel, t).length,
    locate: (t, rel) => proseComments(rel, t).map((c) => c.start),
    message:
      'Comment in implementation code. Only component API docs (JSDoc on props, emits, slots, models, exposed members and exported types) and tool directives are allowed. Name and structure the code so it needs no comment; rationale goes in the spec, a rules doc or the commit message.'
  }
]

export const MESSAGES = Object.fromEntries([
  ...CONTENT_CHECKS.map((c) => [c.id, c.message]),
  [
    'composable-js',
    'Composable authored as `.js`. Composables are `.ts` so the return type is derivable by consumers.'
  ]
])

export const STANDARD_BY_CHECK = {
  'manual-v-model': 'v-model',
  'runtime-define-props': 'props',
  'runtime-define-emits': 'emits',
  'slot-without-defineslots': 'slots',
  'computed-slot-presence': 'slots',
  'component-attr-double-slash': 'props',
  'composable-return-reactive': 'composables',
  'composable-js': 'composables',
  'deprecated-without-replacement': 'deprecation',
  'prose-comment': 'comments'
}

export function scanFile(relPath, content) {
  const found = []
  for (const c of CONTENT_CHECKS) {
    if (!c.applies(relPath)) continue
    const n = c.count ? c.count(content, relPath) : c.violated(content, relPath) ? 1 : 0
    for (let i = 0; i < n; i++) found.push(c.id)
  }
  if (isJsComposable(relPath)) found.push('composable-js')
  return found
}
