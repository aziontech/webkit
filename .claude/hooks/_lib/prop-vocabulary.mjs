// Canonical prop vocabulary — the single source of truth for prop naming across every
// webkit component. The rule: the same concept always ships under the same prop name,
// type, and default. Derived from the cross-component audit (2026-07); documented for
// humans in .claude/rules/prop-vocabulary.md.
//
// Consumed by:
//   - validate-spec-compliance.mjs  (author-side hook — blocks a divergent .vue on
//     every Write/Edit, so both new components AND edits stay on-vocabulary)
//   - scripts/build-catalog.mjs     (stamps `vocabulary` into catalog.json so the MCP
//     can steer AI-generated consumer code toward the canonical names)
//
// No external deps — plain data + pure helpers.

// concept -> { canonical, aliases }. Every `alias` is BANNED as a prop name; the message
// points at the canonical replacement. Only names with NO legitimate competing use are
// listed, so the block is deterministic and false-positive-free:
//   - `type` is NOT banned (native `<input type>` is legitimate).
//   - `value` is NOT banned (identity / v-model payload / clipboard text are legitimate).
//   - `header`/`title` collide only as PROP names here — a `header` SLOT is unaffected
//     (the hook parses defineProps, never defineSlots, for this check).
export const CONCEPTS = [
  {
    concept: 'visual/structural variant',
    canonical: 'kind',
    aliases: ['variant', 'appearance', 'intent', 'headerVariant', 'mediaKind', 'cardStyle']
  },
  {
    concept: 'severity / status color token',
    canonical: 'severity',
    aliases: ['status']
  },
  {
    // Light-dismiss (overlay closes on outside-click / Esc) — Dialog/Drawer/Popover.
    // Distinct from `closable` (an explicit close affordance / X button — Message/Toast/
    // TabViewItem), which stays a valid, separate name and is NOT an alias here.
    concept: 'light-dismiss (closes on outside-click / Esc)',
    canonical: 'dismissible',
    aliases: ['dismissable', 'closeable']
  },
  {
    concept: 'primary heading text',
    canonical: 'title',
    aliases: ['heading', 'header']
  },
  {
    concept: 'primary two-way-bound value',
    canonical: 'modelValue',
    aliases: ['isToggled']
  }
]

// The `size` scale is canonical everywhere it appears. A component may support a SUBSET
// (e.g. only small|medium) but must (a) use these exact tokens — never xs/sm/md/lg/xl —
// and (b) declare them in this order.
export const SIZE = {
  prop: 'size',
  canonical: ['small', 'medium', 'large'],
  bannedTokens: ['xs', 'sm', 'md', 'lg', 'xl']
}

const RULE_DOC = '.claude/rules/prop-vocabulary.md'

/** alias prop name -> { canonical, concept }, built once from CONCEPTS. */
function aliasMap() {
  const map = {}
  for (const c of CONCEPTS) {
    for (const a of c.aliases) map[a] = { canonical: c.canonical, concept: c.concept }
  }
  return map
}

/**
 * Check a component's parsed props against the vocabulary. Returns [{ prop, message }].
 * `opts.resolveTypeUnion(typeText)` (optional) lets the caller resolve a `size?: SizeAlias`
 * reference to its underlying union string so the size-token/order check can run; when it
 * can't be resolved the size check is skipped (never a false positive).
 */
export function checkPropVocabulary(props, opts = {}) {
  const violations = []
  const map = aliasMap()
  for (const p of props) {
    const hit = map[p.name]
    if (hit) {
      violations.push({
        prop: p.name,
        message: `Prop "${p.name}" is not allowed — use the canonical "${hit.canonical}" for the ${hit.concept} concept (${RULE_DOC}).`
      })
      continue // one violation per prop; the alias message is the most specific
    }
    if (/^(is|has)[A-Z]/.test(p.name)) {
      const suggested = p.name.replace(/^(is|has)/, '').replace(/^./, (ch) => ch.toLowerCase())
      violations.push({
        prop: p.name,
        message: `Boolean prop "${p.name}" must drop the is/has prefix — use "${suggested}" (${RULE_DOC}).`
      })
      continue
    }
    if (p.name === SIZE.prop) {
      let union = p.type || ''
      if (!/'/.test(union) && typeof opts.resolveTypeUnion === 'function') {
        union = opts.resolveTypeUnion(union.trim()) || union
      }
      const msg = checkSizeUnion(union)
      if (msg) violations.push({ prop: p.name, message: msg })
    }
  }
  return violations
}

/**
 * Validate a `size` union STRING. Returns an error message or null.
 *   - flags xs/sm/md/lg/xl and any non-canonical token;
 *   - requires canonical order (small before medium before large);
 *   - a subset (e.g. 'small' | 'medium') is allowed.
 * Returns null when the text is not a string-literal union (can't be checked here).
 */
export function checkSizeUnion(unionText) {
  const members = [...String(unionText).matchAll(/'([a-zA-Z]+)'/g)].map((m) => m[1])
  if (!members.length) return null
  const canon = SIZE.canonical
  const bad = members.filter((m) => !canon.includes(m))
  if (bad.length) {
    return (
      `size values ${bad.map((b) => `'${b}'`).join(', ')} are not allowed — ` +
      `use ${canon.map((c) => `'${c}'`).join(' | ')} (a subset is fine, in that order) (${RULE_DOC}).`
    )
  }
  const idx = members.map((m) => canon.indexOf(m))
  const ordered = [...idx].sort((a, b) => a - b)
  if (idx.join(',') !== ordered.join(',')) {
    const want = canon.filter((c) => members.includes(c)).map((c) => `'${c}'`).join(' | ')
    return `size union must be declared in canonical order: ${want} (${RULE_DOC}).`
  }
  return null
}

/**
 * Check event names. Emits kebab-case; a `update:<prop>` v-model event is exempt (its
 * payload segment may be camelCase). Returns [{ event, message }].
 */
export function checkEventVocabulary(emits) {
  const violations = []
  for (const e of emits) {
    if (!e.name.includes(':') && /^[a-z]+[A-Z]/.test(e.name)) {
      const suggested = e.name.replace(/([A-Z])/g, '-$1').toLowerCase()
      violations.push({
        event: e.name,
        message: `Event "${e.name}" must be kebab-case — use "${suggested}" (${RULE_DOC}).`
      })
    }
  }
  return violations
}

/** JSON-serializable snapshot for catalog.json (so the MCP can surface the vocabulary). */
export function vocabularySnapshot() {
  return {
    props: CONCEPTS.map((c) => ({ concept: c.concept, canonical: c.canonical, aliases: c.aliases })),
    size: { canonical: SIZE.canonical, bannedTokens: SIZE.bannedTokens },
    booleanPrefixes: { banned: ['is', 'has'] },
    events: { convention: 'kebab-case, or update:<prop> for v-model' }
  }
}
