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
    // Any numeric step, not just 3-12: in Tailwind v4 `leading-<n>` resolves to
    // calc(var(--spacing) * n), so `leading-1` is 0.25rem — not the line-height
    // of 1 it reads as. `none` stays out of the alternation (allowed on icons).
    regex: /\bleading-(?:\d+|tight|snug|relaxed|loose|\[)/g,
    message:
      'Raw leading-* class. Line-height is part of the generated typography class (DESIGN.md); do not override.'
  },
  {
    id: 'tracking-raw',
    // `tightest` is not a step on the tracking scale, so Tailwind emits nothing
    // for it and the class silently does nothing. It belongs here so the dead
    // override is reported rather than read as working code.
    regex: /\btracking-(?:tightest|tighter|tight|wide|wider|widest|\[)/g,
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
    id: 'legacy-color-util',
    // The leading (?<![\w-]) excludes matches embedded in a CSS variable name
    // (e.g. the sanctioned `var(--bg-surface-overlay)`), so only the bare
    // legacy utility class (`surface-overlay`, `text-color`, ...) is caught.
    regex:
      /(?<![\w-])(?:text-color|surface-(?:0|50|100|200|300|400|500|600|700|800|900|ground|section|card|overlay|border|hover))\b/g,
    message:
      'Legacy/external color utility. Use semantic webkit tokens (var(--text-default), var(--bg-surface), ...).'
  },
  {
    id: 'zero-with-unit',
    // A zero length is unit-less: `0`, never `0px` / `0rem` / `0em`. Only LENGTH
    // units are listed (the same scope as stylelint's `length-zero-no-unit`), so
    // `0%`, `0s`, `0deg` and `0fr` — where the unit carries meaning or is required —
    // are untouched. The leading (?<![\w.]) keeps `10px` / `1.0em` / `grid0px` out;
    // the trailing (?![\w%]) keeps `0pxel`-style identifiers out.
    regex:
      /(?<![\w.])0(?:px|rem|em|ex|ch|cap|ic|lh|rlh|vw|vh|vmin|vmax|svw|svh|lvw|lvh|dvw|dvh|cqw|cqh|cqi|cqb|cqmin|cqmax|cm|mm|Q|in|pt|pc)(?![\w%])/g,
    message:
      'Zero with a unit. A zero length takes no unit — write `0`, not `0px` / `0rem` / `0em` (.claude/rules/styling.md).'
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

/**
 * File filter matching the write-time hook: component sources, excluding the wip/ zone
 * and test files. Tests legitimately reference raw class strings as assertions
 * (`toContain('text-sm')`) and use `@ts-expect-error` to exercise the type surface, so
 * the token discipline does not apply to `*.test.*` / `*.spec.*` or the `src/test/` helpers.
 */
export function tokenChecksApply(rel) {
  return (
    rel.startsWith('packages/webkit/src/components/') &&
    !rel.startsWith('packages/webkit/src/components/wip/') &&
    !/\.(test|spec)\.[tj]s$/.test(rel) &&
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
