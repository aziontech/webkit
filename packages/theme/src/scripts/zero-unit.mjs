/**
 * Zero-with-unit gate for the compiled token stylesheet — the only check that sees token
 * values (authored in JS, so no linter does), run on the final CSS before globals.css is
 * written. A zero length is `0`; inside calc()/min()/max()/clamp() it must carry a unit, and
 * that unit is `rem` (.claude/rules/styling.md). Mirror of the zero checks in packages/webkit
 * token-checks.js, kept in sync — LENGTH_UNITS is the same string. Pure: node built-ins only.
 */

// Opens a math function; balances parens one level deep (a zero nested deeper falls back to
// the bare-zero check).
const MATH_FN = '(?:calc|min|max|clamp)\\((?:[^()]|\\([^()]*\\))*';

// Complete CSS length-unit set — must be complete, since a missing unit silently passes.
export const LENGTH_UNITS =
  'px|rem|em|ex|rex|ch|rch|cap|rcap|ic|ric|lh|rlh|vw|vh|vi|vb|vmin|vmax|svw|svh|svi|svb|svmin|svmax|lvw|lvh|lvi|lvb|lvmin|lvmax|dvw|dvh|dvi|dvb|dvmin|dvmax|cqw|cqh|cqi|cqb|cqmin|cqmax|cm|mm|Q|in|pt|pc';

// Mutually exclusive, so a value is reported once. Non-global so `.test()` is stateless —
// findZeroMisuse adds `g` locally to enumerate matches.
export const ZERO_WITH_UNIT = new RegExp(`(?<![\\w.])(?<!${MATH_FN})0(?:${LENGTH_UNITS})(?![\\w%])`, 'i');
export const ZERO_UNIT_IN_MATH = new RegExp(
  `(?<=${MATH_FN})(?<![\\w.])0(?!rem)(?:${LENGTH_UNITS})(?![\\w%])`,
  'i',
);

/**
 * Matches of `regex` in `cssText` as `{ line, n }`. Scans the whole string, not line-by-line,
 * so a calc() wrapped across newlines is still seen as in-math.
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

// The `--custom-property` a line declares, to name the token to fix; null off a `--token:` line.
const tokenOf = (line) => line.match(/(--[\w-]+)\s*:/)?.[1] ?? null;

/** Throw if `cssText` misuses a zero length. `source` names the artifact in the message. */
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
