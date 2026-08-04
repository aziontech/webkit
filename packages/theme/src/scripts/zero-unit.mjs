/**
 * Zero-with-unit gate for the compiled token stylesheet.
 *
 * Token values are authored in JS and compiled, so no linter sees them — this is the only
 * check that does, run on the final CSS before build-tokens.mjs writes globals.css. Rule
 * (.claude/rules/styling.md): a zero length is `0`, never `0px`/`0rem`/`0em`; the sole
 * exception is inside calc()/min()/max()/clamp(), where CSS requires a unit and it is `rem`.
 *
 * Kept in sync with token-checks.js in packages/webkit — theme sits below webkit in the
 * dependency graph and cannot import it, so LENGTH_UNITS is the same string there. Pure
 * module: node built-ins only, no imports.
 */

// Opens a math function and consumes its interior, balancing parens ONE level deep — a zero
// nested ≥2 calls in falls back to the bare-zero check (pinned limit).
const MATH_FN = '(?:calc|min|max|clamp)\\((?:[^()]|\\([^()]*\\))*';

// The complete CSS length-unit set. Order is irrelevant: the trailing (?![\w%]) rejects a
// candidate that is only a prefix of a longer real unit, so a missing unit only causes a
// miss — hence the list must be complete. `%`, `s`/`ms`, `deg`, `fr` mean something at zero
// and stay out.
export const LENGTH_UNITS =
  'px|rem|em|ex|rex|ch|rch|cap|rcap|ic|ric|lh|rlh|vw|vh|vi|vb|vmin|vmax|svw|svh|svi|svb|svmin|svmax|lvw|lvh|lvi|lvb|lvmin|lvmax|dvw|dvh|dvi|dvb|dvmin|dvmax|cqw|cqh|cqi|cqb|cqmin|cqmax|cm|mm|Q|in|pt|pc';

// Mutually exclusive, so nothing is reported twice: the bare check excludes a zero preceded
// by an open math function, the in-math check requires one and exempts `0rem`. `i` = units
// are case-insensitive. Non-global so `.test()` is stateless — findZeroMisuse adds `g` locally.
export const ZERO_WITH_UNIT = new RegExp(`(?<![\\w.])(?<!${MATH_FN})0(?:${LENGTH_UNITS})(?![\\w%])`, 'i');
export const ZERO_UNIT_IN_MATH = new RegExp(
  `(?<=${MATH_FN})(?<![\\w.])0(?!rem)(?:${LENGTH_UNITS})(?![\\w%])`,
  'i',
);

/**
 * Every match of `regex` in `cssText` as `{ line, n }` (trimmed source line + 1-based line).
 * Scans the whole string, not line-by-line, so a calc() wrapped across newlines is judged in
 * context (`[^()]` in the lookbehind matches the newline). Clones with `g` locally to keep
 * the exported regexes non-global.
 */
export const findZeroMisuse = (cssText, regex) => {
  const scan = new RegExp(regex.source, `${regex.flags.replace('g', '')}g`);
  const out = [];
  for (let m; (m = scan.exec(cssText)); ) {
    const lineStart = cssText.lastIndexOf('\n', m.index - 1) + 1;
    const nlIdx = cssText.indexOf('\n', m.index);
    const lineEnd = nlIdx === -1 ? cssText.length : nlIdx;
    out.push({ line: cssText.slice(lineStart, lineEnd).trim(), n: cssText.slice(0, m.index).split('\n').length });
  }
  return out;
};

// The custom property a line declares, so the error names the token to fix. Null when the
// zero is not on a `--token:` line (continuation line, keyframe step) — the line number locates those.
const tokenOf = (line) => line.match(/(--[\w-]+)\s*:/)?.[1] ?? null;

/**
 * Throw if any token value in `cssText` misuses a zero length. `source` names the artifact the
 * lines are numbered against — passed in, never hardcoded, so a reuse reports an honest path.
 */
export const assertNoZeroWithUnit = (cssText, source = 'globals.css') => {
  const bare = findZeroMisuse(cssText, ZERO_WITH_UNIT);
  const inMath = findZeroMisuse(cssText, ZERO_UNIT_IN_MATH);
  if (bare.length === 0 && inMath.length === 0) return;

  const detail = (rows) => rows.map(({ line, n }) => `  ${source}:${n}  ${line}`).join('\n');
  const tokens = [...new Set([...bare, ...inMath].map(({ line }) => tokenOf(line)).filter(Boolean))];
  const parts = [`build:tokens — ${bare.length + inMath.length} token value(s) misuse a zero.`];
  if (bare.length > 0) {
    parts.push(`A zero length takes no unit: write '0', not '0px' / '0rem' / '0em'.\n${detail(bare)}`);
  }
  if (inMath.length > 0) {
    parts.push(
      `Inside calc()/min()/max()/clamp() the zero needs a unit, and that unit is rem: write '0rem'.\n${detail(inMath)}`,
    );
  }
  const grepHint = tokens.length > 0 ? ` — grep the offending token name (${tokens.join(', ')})` : '';
  parts.push(`Fix the token at its source under src/tokens/**${grepHint}, not the generated ${source}.`);
  throw new Error(parts.join('\n'));
};
