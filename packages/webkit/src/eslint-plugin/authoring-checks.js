import { isCommentScoped, proseComments } from './comment-scan.js'

export const isVue = (rel) => rel.endsWith('.vue')
export const isComposable = (rel) => /(^|\/)use-[^/]*\.(ts|js)$/.test(rel)
export const isJsComposable = (rel) => /(^|\/)use-[^/]*\.js$/.test(rel)

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
