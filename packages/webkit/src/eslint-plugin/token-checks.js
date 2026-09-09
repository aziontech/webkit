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
    // Matches both v4 spellings of the arbitrary typography token (bracket and paren) —
    // keying on the bracket alone let the paren spelling through the gate (ENG-47001).
    regex: /text-(?:\[length:var\(|\(length:)--text-/g,
    message:
      'Raw typography token. Use generated class from DESIGN.md (text-heading-md, text-body-sm, text-button-lg, ...).'
  },
  {
    id: 'leading-raw',
    // Any numeric step: in v4 a numeric leading suffix resolves to a spacing multiple,
    // not the line-height it reads as. `none` stays out of the alternation (allowed on icons).
    regex: /\bleading-(?:\d+|tight|snug|relaxed|loose|[[(])/g,
    message:
      'Raw leading-* class. Line-height is part of the generated typography class (DESIGN.md); do not override.'
  },
  {
    id: 'tracking-raw',
    // `tightest` is not a step on the tracking scale — Tailwind emits nothing and the
    // dead override reads as working code, so it is reported here.
    regex: /\btracking-(?:tightest|tighter|tight|wide|wider|widest|[[(])/g,
    message:
      'Raw tracking-* class. Letter-spacing is part of the generated typography class (DESIGN.md); do not override.'
  },
  {
    id: 'font-family-raw',
    regex: /\b(?:font-(?:sans|serif|mono|sora|proto-mono)\b|font-[[(]family-name:)/g,
    message:
      'Raw font-family. Font family is part of the generated typography class (DESIGN.md); do not override.'
  },
  {
    id: 'legacy-color-util',
    // The leading lookbehind excludes matches embedded inside a CSS variable name,
    // so only the bare legacy utility class is caught.
    regex:
      /(?<![\w-])(?:text-color|surface-(?:0|50|100|200|300|400|500|600|700|800|900|ground|section|card|overlay|border|hover))\b/g,
    message:
      'Legacy/external color utility. Use semantic webkit tokens (var(--text-default), var(--bg-surface), ...).'
  },
  {
    id: 'zero-with-unit',
    // The math-function lookbehind balances parens ONE level deep: a zero nested two or
    // more calls in is reported here (as a bare-zero violation) instead of by
    // zero-unit-in-calc. Keep in sync with ZERO_WITH_UNIT in
    // packages/theme/src/scripts/zero-unit.mjs (theme sits below webkit; cannot import this).
    regex:
      /(?<![\w.])(?<!(?:calc|min|max|clamp)\((?:[^()]|\([^()]*\))*)0(?:px|rem|em|ex|rex|ch|rch|cap|rcap|ic|ric|lh|rlh|vw|vh|vi|vb|vmin|vmax|svw|svh|svi|svb|svmin|svmax|lvw|lvh|lvi|lvb|lvmin|lvmax|dvw|dvh|dvi|dvb|dvmin|dvmax|cqw|cqh|cqi|cqb|cqmin|cqmax|cm|mm|Q|in|pt|pc)(?![\w%])/gi,
    message:
      'Zero with a unit. A zero length takes no unit — write `0`, not `0px` / `0rem` / `0em` (.claude/rules/styling.md).'
  },
  {
    id: 'zero-unit-in-calc',
    // Same one-level nesting limit as zero-with-unit above; keep in sync with
    // ZERO_UNIT_IN_MATH in packages/theme/src/scripts/zero-unit.mjs.
    regex:
      /(?<=(?:calc|min|max|clamp)\((?:[^()]|\([^()]*\))*)(?<![\w.])0(?!rem)(?:px|rem|em|ex|rex|ch|rch|cap|rcap|ic|ric|lh|rlh|vw|vh|vi|vb|vmin|vmax|svw|svh|svi|svb|svmin|svmax|lvw|lvh|lvi|lvb|lvmin|lvmax|dvw|dvh|dvi|dvb|dvmin|dvmax|cqw|cqh|cqi|cqb|cqmin|cqmax|cm|mm|Q|in|pt|pc)(?![\w%])/gi,
    message:
      'Zero with the wrong unit inside a math function. `calc()`/`min()`/`max()`/`clamp()` require a unit on the zero — write `0rem`, not `0px` / `0em` (.claude/rules/styling.md).'
  },
  {
    id: 'dead-token-shorthand',
    // A malformed shorthand (whitespace inside the parens, or the bracket/paren order
    // inverted) silently never styles the element and is a lint/type/build error nowhere
    // else — chip's filled kind shipped transparent this way and its visual baselines
    // encoded the bug as correct. The custom-property lookahead keeps this off ordinary
    // subtraction and off nested var fallbacks. Raw-text scan: never QUOTE the pattern.
    regex: /-\((?=[^)]*--)[^)]*\s[^)]*\)|\[--\(/g,
    message:
      'Malformed token shorthand — the style NEVER applies (Tailwind emits nothing for a space inside the parens; an inverted `[--(token)]` emits an invalid value the browser discards). Write `prop-(--token)` / `prop-(type:--token)` with no whitespace inside the parens, and `[--token:value]` to DECLARE a custom property (.claude/rules/styling.md).'
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
    regex: /\banimate-[[(]/g,
    message:
      'Arbitrary animate-[…] value. Use a catalogued animate-* utility, or add one via /add-animation (semantic/animations.js).'
  },
  {
    id: 'motion-hardcoded',
    regex: /\b(?:duration|delay|ease)-[[(]/g,
    message:
      'Hardcoded duration/ease/delay. Use the duration/curve/ease tokens from primitives/animations (DESIGN.md § Animations).'
  }
]

export const TOKEN_MESSAGES = Object.fromEntries(TOKEN_CHECKS.map((c) => [c.id, c.message]))

/**
 * Shared file filter (write-time hook + CI ratchet): component sources, excluding
 * tests — tests legitimately reference raw class strings, browser-serialized
 * lengths, and type-error suppressions as assertions.
 */
export function tokenChecksApply(rel) {
  return (
    rel.startsWith('packages/webkit/src/components/') &&
    !/\.(test|spec)\.[tj]s$/.test(rel) &&
    /\.(vue|css|scss|ts)$/.test(rel)
  )
}

/**
 * All violated ids for a file's content, one entry PER MATCH — the ratchet's multiset
 * diff catches a second occurrence of an already-baselined id (boolean-per-file would not).
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
