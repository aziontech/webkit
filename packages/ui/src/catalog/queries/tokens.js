import { NOT_AVAILABLE } from '../lib/results.js'

const EMPTY_TOKENS = { cssVars: [], typography: [], groups: {} }

const CATEGORY_ALIASES = {
  animations: 'animations',
  animation: 'animations',
  animate: 'animations',
  motion: 'animations',
  typography: 'typography',
  type: 'typography',
  font: 'typography',
  fonts: 'typography'
}

const describeToken = (tokens, name) => {
  const entry = tokens.values?.[name]
  return entry ? { name, ...entry } : { name }
}

const found = (category, tokens, hint) => ({
  ok: true,
  available: true,
  found: true,
  category,
  tokens,
  ...(hint ? { hint } : {})
})

const SPECIAL_CATEGORIES = {
  animations: (tokens) =>
    found(
      'animations',
      (tokens.animations || []).map((name) => ({
        class: `animate-${name}`,
        ...(tokens.animationGuide?.[name] || {})
      })),
      'Every motion-bearing class pairs with a motion-reduce: fallback (e.g. ' +
        '`animate-slide-in-start motion-reduce:animate-none`). Panel/drawer open-close wraps the ' +
        'v-if region in a Vue Transition with enter-active-class / leave-active-class.'
    ),
  typography: (tokens) =>
    found(
      'typography',
      (tokens.typography || []).map((name) => describeToken(tokens, name)),
      'Each entry is a utility class: `value` holds its base declarations and `breakpoints` the sizes it steps to (mobile first). Never restate them in a component.'
    )
}

function tokenCategory(tokens, key) {
  const special = SPECIAL_CATEGORIES[CATEGORY_ALIASES[key]]
  if (special) return special(tokens)
  const tokenName = key.startsWith('--') ? key : `--${key}`
  if (tokens.values?.[tokenName] && !tokens.groups[key]) {
    return found(tokens.values[tokenName].group, [describeToken(tokens, tokenName)])
  }
  const group = tokens.groups[key]
  if (!group) {
    const groupNames = Object.keys(tokens.groups)
    return {
      ok: false,
      available: true,
      found: false,
      category: key,
      groups: [...groupNames, 'typography', 'animations'],
      message: `No token group "${key}". Available groups: ${groupNames.join(', ')}, typography, animations.`
    }
  }
  return found(
    key,
    group.map((name) => describeToken(tokens, name)),
    'A semantic token carries its `light` and `dark` value (a colour) or its `value` and ' +
      '`breakpoints` (a length), and its `purpose`. A token with only a name is a primitive: use ' +
      'the semantic token whose purpose fits instead.'
  )
}

function tokenOverview(catalog, tokens) {
  const groupNames = Object.keys(tokens.groups)
  return {
    ok: true,
    available: true,
    groups: [
      ...groupNames.map((name) => ({
        name,
        count: tokens.groups[name].length,
        semantic: tokens.groups[name].filter((n) => tokens.values?.[n]).length
      })),
      { name: 'typography', count: (tokens.typography || []).length },
      { name: 'animations', count: (tokens.animations || []).length }
    ],
    semanticCount: Object.keys(tokens.values || {}).length,
    themes: tokens.themes || ['light', 'dark'],
    typography: tokens.typography,
    vocabulary: catalog.vocabulary || null,
    hint:
      'Call list_tokens with a category (e.g. "primary", "bg", "text", "chart", "spacing", ' +
      '"shape", "layout", "typography", "animations") for that group, or with one token name (e.g. ' +
      '"--bg-surface"). Semantic tokens come with their light and dark values and a one-line ' +
      'purpose; pick by purpose, never by the value.'
  }
}

export function listTokens(catalog, { category } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const tokens = catalog.tokens || EMPTY_TOKENS
  if (category != null && String(category).length) {
    return tokenCategory(tokens, String(category).toLowerCase().trim())
  }
  return tokenOverview(catalog, tokens)
}
