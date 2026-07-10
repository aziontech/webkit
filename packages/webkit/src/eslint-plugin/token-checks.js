// Single source of truth for the DESIGN.md token-discipline checks. Consumed by:
//   - .claude/hooks/validate-tokens.mjs           -> write-time gate (AI pipeline), baseline-diff
//   - packages/webkit/scripts/check-authoring.mjs -> design-system CI ratchet (repo-wide)
// Each check: { id, regex (global), message }. The regexes run over the whole file text.

export const TOKEN_CHECKS = [
  {
    id: 'hex-color',
    regex: /#[0-9a-fA-F]{3,8}\b/g,
    message:
      'Hex color hardcoded. Use semantic tokens (var(--primary), var(--bg-surface), var(--text-default), ...).'
  },
  {
    id: 'rgb-hsl',
    regex: /\b(rgba?|hsla?)\s*\(/g,
    message: 'RGB/HSL hardcoded. Use semantic tokens via var(--*).'
  },
  {
    id: 'tailwind-palette',
    regex:
      /\b(?:bg|text|border|ring|outline|fill|stroke|divide|placeholder|caret|accent)-(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g,
    message:
      'Tailwind palette color. Use semantic webkit tokens (var(--primary), var(--text-default), var(--bg-surface), ...).'
  },
  {
    id: 'typography-raw-size',
    regex: /\btext-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b(?!-)/g,
    message:
      'Raw Tailwind text size. Use generated class from DESIGN.md (text-heading-md, text-body-sm, text-button-lg, text-label-md, ...).'
  },
  {
    id: 'typography-raw-length',
    regex: /text-\[length:var\(--text-/g,
    message:
      'Raw typography token. Use generated class from DESIGN.md (text-heading-md, text-body-sm, text-button-lg, ...).'
  },
  {
    id: 'leading-raw',
    regex: /\bleading-(?:3|4|5|6|7|8|9|10|11|12|tight|snug|relaxed|loose|\[)/g,
    message:
      'Raw leading-* class. Line-height is part of the generated typography class (DESIGN.md); do not override.'
  },
  {
    id: 'tracking-raw',
    regex: /\btracking-(?:tighter|tight|wide|wider|widest|\[)/g,
    message:
      'Raw tracking-* class. Letter-spacing is part of the generated typography class (DESIGN.md); do not override.'
  },
  {
    id: 'font-family-raw',
    regex: /\b(?:font-(?:sans|serif|mono|sora|proto-mono)\b|font-\[family-name:)/g,
    message:
      'Raw font-family. Font family is part of the generated typography class (DESIGN.md); do not override.'
  },
  {
    id: 'primevue-color',
    // The leading (?<![\w-]) excludes matches embedded in a CSS variable name
    // (e.g. the sanctioned `var(--bg-surface-overlay)`), so only the bare
    // PrimeFlex utility class (`surface-overlay`, `text-color`, ...) is caught.
    regex:
      /(?<![\w-])(?:text-color|surface-(?:0|50|100|200|300|400|500|600|700|800|900|ground|section|card|overlay|border|hover))\b/g,
    message:
      'PrimeVue color utility. Use semantic webkit tokens (var(--text-default), var(--bg-surface), ...).'
  },
  {
    id: 'class-in-defineprops',
    regex: /defineProps\s*[<(][^>)]*['"]?class['"]?\s*:/s,
    message:
      '`class` declared in defineProps. Use useAttrs() + inheritAttrs:false + rootClasses with attrs.class.'
  },
  {
    id: 'any-type',
    regex: /(?::\s*any\b(?!-)|<any>|\bas\s+any\b|Array<any>|Record<[^>]*any[^>]*>)/g,
    message: '`any` type. Provide a proper TypeScript type.'
  },
  {
    id: 'ts-ignore',
    regex: /\/\/\s*@ts-(?:ignore|nocheck|expect-error)\b/g,
    message: '`@ts-ignore`/`@ts-nocheck`/`@ts-expect-error`. Fix the underlying type issue.'
  },
  {
    id: 'js-class-preset',
    regex: /\bconst\s+\w*[Cc]lasses\s*=\s*(?:[{[]|computed\b)/g,
    message:
      'JS class preset (const *Classes = {…}/[…]/computed). Put utilities inline on the root class + switch variants with data-* (.claude/rules/styling.md).'
  },
  {
    id: 'style-block',
    regex: /<style[\s>]/g,
    message:
      'Component-local <style> block. Styles live inline on the root class as Tailwind utilities; no <style>/scoped CSS (.claude/rules/styling.md).'
  },
  {
    id: 'keyframes-local',
    regex: /@keyframes\b/g,
    message:
      'Component-local @keyframes. Add the animation to packages/theme/src/tokens/semantic/animations.js (run /add-animation) and use the animate-* utility.'
  },
  {
    id: 'animate-arbitrary',
    regex: /\banimate-\[/g,
    message:
      'Arbitrary animate-[…] value. Use a catalogued animate-* utility, or add one via /add-animation (semantic/animations.js).'
  },
  {
    id: 'motion-hardcoded',
    regex: /\b(?:duration|delay|ease)-\[/g,
    message:
      'Hardcoded duration/ease/delay. Use the duration/curve/ease tokens from primitives/animations (DESIGN.md § Animations).'
  }
]

export const TOKEN_MESSAGES = Object.fromEntries(TOKEN_CHECKS.map((c) => [c.id, c.message]))

/** File filter matching the write-time hook: component sources, excluding the wip/ zone. */
export function tokenChecksApply(rel) {
  return (
    rel.startsWith('packages/webkit/src/components/') &&
    !rel.startsWith('packages/webkit/src/components/wip/') &&
    /\.(vue|css|scss|ts)$/.test(rel)
  )
}

/**
 * All violated token-check ids for a file's full content — one entry PER MATCH, so the
 * ratchet's multiset diff catches a second occurrence of an already-baselined id (a
 * boolean-per-file scan would let it evade).
 */
export function scanTokens(content) {
  const found = []
  for (const c of TOKEN_CHECKS) {
    c.regex.lastIndex = 0
    const matches = content.match(c.regex)
    if (matches) for (let i = 0; i < matches.length; i++) found.push(c.id)
    c.regex.lastIndex = 0
  }
  return found
}
