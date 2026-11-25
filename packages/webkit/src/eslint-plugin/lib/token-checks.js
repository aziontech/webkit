const TOKEN_CHECKS = [
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
      'Raw Tailwind text size. Use a generated typography class (text-heading-md, ' +
      'text-body-sm, text-button-lg, text-label-md, ...) — ask the webkit MCP: list_tokens (no ' +
      'category) returns every typography class.'
  },
  {
    id: 'typography-raw-length',
    regex: /text-(?:\[length:var\(|\(length:)--text-/g,
    message:
      'Raw typography token. Use a generated typography class (text-heading-md, text-body-sm, text-button-lg, ...) — ask the webkit MCP: list_tokens (no category) returns every typography class.'
  },
  {
    id: 'leading-raw',
    regex: /\bleading-(?:\d+|tight|snug|relaxed|loose|[[(])/g,
    message:
      'Raw leading-* class. Line-height is part of the generated typography class (ask the webkit MCP: list_tokens); do not override.'
  },
  {
    id: 'tracking-raw',
    regex: /\btracking-(?:tightest|tighter|tight|wide|wider|widest|[[(])/g,
    message:
      'Raw tracking-* class. Letter-spacing is part of the generated typography class (ask the webkit MCP: list_tokens); do not override.'
  },
  {
    id: 'font-family-raw',
    regex:
      /\b(?:font-(?:sans|serif|mono|rubik|proto-mono)\b|(?<![\w-])font-(?:code|display)\b|font-[[(]family-name:)/g,
    message:
      'Raw font-family. Font family is part of the generated typography class (ask the webkit MCP: list_tokens); do not override.'
  },
  {
    id: 'legacy-color-util',
    regex:
      /(?<![\w-])(?:text-color|surface-(?:0|50|100|200|300|400|500|600|700|800|900|ground|section|card|overlay|border|hover))\b/g,
    message:
      'Legacy/external color utility. Use semantic webkit tokens (var(--text-default), var(--bg-surface), ...).'
  },
  {
    id: 'zero-with-unit',
    regex:
      /(?<![\w.])(?<!(?:calc|min|max|clamp)\((?:[^()]|\([^()]*\)|[\w-]+\()*)0(?:px|rem|em|ex|rex|ch|rch|cap|rcap|ic|ric|lh|rlh|vw|vh|vi|vb|vmin|vmax|svw|svh|svi|svb|svmin|svmax|lvw|lvh|lvi|lvb|lvmin|lvmax|dvw|dvh|dvi|dvb|dvmin|dvmax|cqw|cqh|cqi|cqb|cqmin|cqmax|cm|mm|Q|in|pt|pc)(?![\w%])/gi,
    message:
      'Zero with a unit. A zero length takes no unit — write `0`, not `0px` / `0rem` / `0em` (.claude/rules/styling.md).'
  },
  {
    id: 'zero-unit-in-calc',
    regex:
      /(?<=(?:calc|min|max|clamp)\((?:[^()]|\([^()]*\)|[\w-]+\()*)(?<![\w.])0(?!rem)(?:px|rem|em|ex|rex|ch|rch|cap|rcap|ic|ric|lh|rlh|vw|vh|vi|vb|vmin|vmax|svw|svh|svi|svb|svmin|svmax|lvw|lvh|lvi|lvb|lvmin|lvmax|dvw|dvh|dvi|dvb|dvmin|dvmax|cqw|cqh|cqi|cqb|cqmin|cqmax|cm|mm|Q|in|pt|pc)(?![\w%])/gi,
    message:
      'Zero with the wrong unit inside a math function. `calc()`/`min()`/`max()`/`clamp()` require a unit on the zero — write `0rem`, not `0px` / `0em` (.claude/rules/styling.md).'
  },
  {
    id: 'dead-token-shorthand',
    regex: /-\((?=[^)]*--)[^)]*\s[^)]*\)|\[--\(/g,
    message:
      'Malformed token shorthand — the style NEVER applies (Tailwind emits nothing for a space ' +
      'inside the parens; an inverted `[--(token)]` emits an invalid value the browser ' +
      'discards). Write `prop-(--token)` / `prop-(type:--token)` with no whitespace inside the ' +
      'parens, and `[--token:value]` to DECLARE a custom property (.claude/rules/styling.md).'
  },
  {
    id: 'container-query-on-container',
    regex: /(["'`])(?=[^"'`]*@container\/([\w-]+)(?![\w-]))[^"'`]*@[^\s"'`/]*\/\2:/g,
    message:
      'Container-query variant on the element that declares the container. A container query ' +
      'never matches its own container, so `@xl/name:` on the `@container/name` element NEVER ' +
      'applies. Put the variant on a child of the container (.claude/rules/styling.md).'
  },
  {
    id: 'has-on-scroll-frame',
    regex: /(?<![\w-])(?:group|peer)-has-(?:\[[^\s"'`]*\]|[\w-]+)\/scroll:/g,
    message:
      'A :has() variant read from the scroll frame (`group-has-[…]/scroll:`). The frame wraps ' +
      'every row, so Chromium re-checks the :has() whenever a row mounts and restyles the ' +
      'whole table on every scroll frame (the 10k-row virtual DataTable went from 228 ms to ' +
      '3,580 ms of style recalc). Get the result from the stacking order (the table scroll cue ' +
      'sits below the frozen cells), or measure the state in script, set a data attribute on ' +
      'the frame and read it with `group-data-[…]/scroll:` (.claude/rules/styling.md).'
  },
  {
    id: 'universal-sibling-selector',
    wide: true,
    regex: /\[&[^\]\s"'`]*?[+~]_?\*\]:/g,
    message:
      'A sibling variant whose subject is the universal selector (`[&+*]:`, `[&~*]:`, ' +
      '`[&>*+*]:`). It compiles to a rule like `.x + *`, so Chromium checks every element ' +
      'inserted anywhere the stylesheet applies against it (one such rule made each scroll frame ' +
      'of the virtual DataTable restyle three quarters of the table). Put the spacing on the ' +
      'element itself with `not-last:` or `not-first:`, use `[&>*:not(:first-child)]:`, or name ' +
      'the sibling (.claude/rules/styling.md).'
  },
  {
    id: 'rtl-double-flip',
    wide: true,
    regex:
      /(["'`])(?=[^"'`]*(?<![\w-])az-(?:(?:(?:circle-)?(?:chevron|arrow)|chevrons|arrow-down|caret)-(?:left|right)|arrow-(?:left|right)-to-line|log-in|log-out|reply|undo)(?![\w-]))[^"'`]*?(?<![^\s"'`])(?:[^\s"'`]*:)?rtl:-?rotate-180(?![^\s"'`])/g,
    message:
      'rtl:rotate-180 on a directional icon. `@aziontech/webkit/styles` already mirrors every ' +
      'directional `az-*` glyph under RTL with `scale: -1 1`; adding a rotation composes with ' +
      'it and the arrow points the WRONG way. Drop the rotation (or use `rtl:-scale-x-100`, ' +
      'which sets the same scale) (.claude/rules/styling.md).'
  },
  {
    id: 'off-brand-orange',
    wide: true,
    regex:
      /(?<!\w)(?:--text-(?:primary|brand)(?![\w-])|(?:--color-)?(?:alpha-orange|brand-primary|orange)-(?!500(?![\w-]))\d{2,3}(?![\w-]))/g,
    message:
      'An orange text colour or an orange that is not the logo orange. Content uses one orange, ' +
      'the logo orange #F3652B as var(--primary): a fill behind --primary-foreground text, or a ' +
      'bar, underline, glyph or glow beside text in --text-default. It is never the colour of text, ' +
      'which misses WCAG AA on light surfaces. --text-primary and --text-brand were removed in 6.0 ' +
      '(use --text-default), and the other steps of the orange scale stay inside the theme ' +
      '(rules/webkit-tokens.md).'
  },
  {
    id: 'status-fill-as-text',
    wide: true,
    regex: /(?<![\w-])text-\((?:color:)?--(?:danger|success|warning|info)\)/g,
    message:
      'A status fill colour used as text or icon colour. --danger, --success, --warning and ' +
      '--info are fills and vanish on a surface: a status icon on a surface is the -mark ' +
      'token, error text is --text-danger, text on the fill is its -foreground ' +
      '(rules/webkit-tokens.md).'
  },
  {
    id: 'color-logo-interpolated',
    wide: true,
    regex: /(?<![\w-])az-color\s+(?:az-)?(?:\$\{|["'`]\s*\+)/g,
    message:
      'A colour logo class built at runtime (`az-color az-${name}`). The stylesheet compiles only ' +
      'the colour logos whose whole class appears in scanned source, so a built class paints ' +
      "nothing. Write each full class ('az-color az-react'), or list a logo that only arrives in " +
      'data with @source inline("az-react") in webkit.css (rules/webkit-performance.md).'
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
      'Component-local @keyframes. Add the animation to packages/theme/src/tokens/semantic/animations.js (run /animation-add) and use the animate-* utility.'
  },
  {
    id: 'animate-arbitrary',
    regex: /\banimate-[[(]/g,
    message:
      'Arbitrary animate-[…] value. Use a catalogued animate-* utility, or add one via /animation-add (semantic/animations.js).'
  },
  {
    id: 'motion-hardcoded',
    regex: /\b(?:duration|delay|ease)-[[(]/g,
    message:
      'Hardcoded duration/ease/delay. Use the duration/ease tokens (ask the webkit MCP: list_tokens category "ease", or "animations" for the catalogued animate-* utilities).'
  }
]

export const TOKEN_MESSAGES = Object.fromEntries(TOKEN_CHECKS.map((c) => [c.id, c.message]))

export function tokenChecksApply(rel) {
  return (
    rel.startsWith('packages/webkit/src/components/') &&
    !/\.(test|spec)\.[tj]s$/.test(rel) &&
    /\.(vue|css|scss|ts)$/.test(rel)
  )
}

export const WIDE_TOKEN_DIRS = ['packages/webkit/blocks/', 'packages/webkit/examples/']

const WIDE_TOKEN_CHECKS = TOKEN_CHECKS.filter((c) => c.wide)

export function tokenChecksFor(rel, wideDirs = WIDE_TOKEN_DIRS) {
  if (tokenChecksApply(rel)) return TOKEN_CHECKS
  if (
    wideDirs.some((dir) => rel.startsWith(dir)) &&
    !/\.(test|spec)\.[tj]s$/.test(rel) &&
    /\.(vue|css|scss|ts|js)$/.test(rel)
  ) {
    return WIDE_TOKEN_CHECKS
  }
  return []
}

export function scanTokens(content, checks = TOKEN_CHECKS) {
  const found = []
  for (const c of checks) {
    c.regex.lastIndex = 0
    const matches = content.match(c.regex)
    if (matches) for (let i = 0; i < matches.length; i++) found.push(c.id)
    c.regex.lastIndex = 0
  }
  return found
}
