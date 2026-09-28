// Single source of truth for the construction-standard checks (.claude/rules/), shared by
// the write-time hook (validate-authoring), the DS CI ratchet (check-authoring), and the
// consumer lint (authoring-standards) — one definition, three surfaces. Each content check
// is a pure predicate on the whole file; `composable-js` is path-based (scanFile).

export const isVue = (rel) => rel.endsWith('.vue')
export const isComposable = (rel) => /(^|\/)use-[^/]*\.(ts|js)$/.test(rel)
export const isJsComposable = (rel) => /(^|\/)use-[^/]*\.js$/.test(rel)
export const isSource = (rel) => /\.(vue|ts|js)$/.test(rel)

// Comment discipline (comments.md). Line-based, parser-agnostic like every check here.
// Directives (eslint/ts/prettier/vite) and one-line JSDoc (`/** … */` — mandated on every
// public prop) are not prose. Blank lines neither extend nor break a block, so a long
// commentary cannot evade the block limit by inserting spacing.
export const COMMENT_BLOCK_MAX = 5
export const COMMENT_PROSE_MIN_LINES = 15
export const COMMENT_PROSE_MAX_RATIO = 0.2

const DIRECTIVE_RE = /^(eslint-|@ts-|prettier-ignore|@vite-ignore|@vue-ignore|v8 ignore)/

export function scanComments(text) {
  let inBlock = false
  let inHtml = false
  let run = 0
  let maxBlock = 0
  let prose = 0
  let nonBlank = 0
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (line !== '') nonBlank++
    let comment = false
    let oneLineJsdoc = false
    if (inBlock) {
      comment = true
      if (line.includes('*/')) inBlock = false
    } else if (inHtml) {
      comment = true
      if (line.includes('-->')) inHtml = false
    } else if (line.startsWith('//')) {
      comment = true
    } else if (line.startsWith('/*')) {
      comment = true
      oneLineJsdoc = line.startsWith('/**') && line.endsWith('*/')
      if (!line.includes('*/')) inBlock = true
    } else if (line.startsWith('<!--')) {
      comment = true
      if (!line.includes('-->')) inHtml = true
    }
    if (!comment) {
      if (line !== '') run = 0
      continue
    }
    run++
    if (run > maxBlock) maxBlock = run
    const body = line.replace(/^(\/\/+|\/\*+|\*+\/?|<!--)\s*/, '')
    if (!oneLineJsdoc && !DIRECTIVE_RE.test(body)) prose++
  }
  return { maxBlock, prose, nonBlank }
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
    id: 'verbose-comment-block',
    applies: isSource,
    violated: (t) => scanComments(t).maxBlock > COMMENT_BLOCK_MAX,
    message: `Comment block longer than ${COMMENT_BLOCK_MAX} lines. A comment states only what the code cannot (a constraint, a non-obvious why) — objectively. Long rationale belongs in the spec or a .claude/rules doc, not in the source.`
  },
  {
    id: 'comment-heavy-file',
    applies: isSource,
    violated: (t) => {
      const { prose, nonBlank } = scanComments(t)
      return prose >= COMMENT_PROSE_MIN_LINES && prose / nonBlank >= COMMENT_PROSE_MAX_RATIO
    },
    message:
      'File is mostly commentary (≥20% prose comment lines; one-line JSDoc and directives excluded). Delete comments that restate the code; compress the rest to objective one-liners.'
  }
]

export const MESSAGES = Object.fromEntries([
  ...CONTENT_CHECKS.map((c) => [c.id, c.message]),
  [
    'composable-js',
    'Composable authored as `.js`. Composables are `.ts` so the return type is derivable by consumers.'
  ]
])

// Maps each mechanized check id → the `.claude/rules` standard it enforces. The standards
// invariant test (packages/webkit/test/standards/invariant.test.mjs) uses this to prove
// every executable check is paired with a documented, write-time-enforced standard — so a
// suggestion to the AI and the block in the pipeline stay the same definition.
export const STANDARD_BY_CHECK = {
  'manual-v-model': 'v-model',
  'runtime-define-props': 'props',
  'runtime-define-emits': 'emits',
  'slot-without-defineslots': 'slots',
  'composable-return-reactive': 'composables',
  'composable-js': 'composables',
  'deprecated-without-replacement': 'deprecation',
  'verbose-comment-block': 'comments',
  'comment-heavy-file': 'comments'
}

/** All violated check ids for a file's full content. Includes the path-based composable-js. */
export function scanFile(relPath, content) {
  const found = []
  for (const c of CONTENT_CHECKS) {
    if (c.applies(relPath) && c.violated(content)) found.push(c.id)
  }
  if (isJsComposable(relPath)) found.push('composable-js')
  return found
}
