/**
 * Zero-with-unit discipline for the compiled token stylesheet.
 *
 * The tokens of `@aziontech/theme` are authored in JS (`src/tokens/**`) and compiled, so
 * no linter ever sees them: stylelint reads CSS/SCSS/`<style>`, and the webkit token-check
 * reads component `.vue`/`.ts`. This module is the only gate that sees the token *values*,
 * asserted against the final CSS string just before `build-tokens.mjs` writes `globals.css`.
 *
 * Rule (`.claude/rules/styling.md` § "A zero length carries no unit"): a zero length is
 * `0` — never `0px` / `0rem` / `0em`. The one exception is inside a math function
 * (`calc()`/`min()`/`max()`/`clamp()`), where CSS requires a unit and that unit is `rem`.
 *
 * Kept in sync with the `zero-with-unit` / `zero-unit-in-calc` checks in
 * `packages/webkit/src/eslint-plugin/token-checks.js`. Theme sits below webkit in the
 * dependency graph, so that shared engine cannot be imported here — `LENGTH_UNITS` below
 * is the same string, in the same order, as its counterpart there.
 *
 * No external deps — this module is pure (regex + string) and imports nothing.
 */

// Open a math function, consuming its interior. The interior — `(?:[^()]|\([^()]*\))*` —
// balances parens ONE level deep: a zero sitting ≥2 nested calls in (or behind grouping
// parens) falls back to the bare-zero check. Known, pinned limit.
const MATH_FN = '(?:calc|min|max|clamp)\\((?:[^()]|\\([^()]*\\))*';

// The complete CSS length-unit set. Order is irrelevant to correctness: the trailing
// `(?![\w%])` rejects any candidate that is only a prefix of a longer real unit, so a
// missing longer unit can only cause a miss, never a mismatch — which is exactly why the
// list must be complete. This one adds the units a partial list dropped: the logical
// viewport units (`vi`/`vb`) and their small/large/dynamic + min/max variants, and the
// root-relative font units (`rex`/`rch`/`ric`/`rcap`) — so `0vi` / `0svb` / `0rex` are no
// longer silent. `%`, `s`/`ms`, `deg`, `fr` carry meaning at zero and are deliberately out.
export const LENGTH_UNITS =
  'px|rem|em|ex|rex|ch|rch|cap|rcap|ic|ric|lh|rlh|vw|vh|vi|vb|vmin|vmax|svw|svh|svi|svb|svmin|svmax|lvw|lvh|lvi|lvb|lvmin|lvmax|dvw|dvh|dvi|dvb|dvmin|dvmax|cqw|cqh|cqi|cqb|cqmin|cqmax|cm|mm|Q|in|pt|pc';

// The two checks are mutually exclusive by construction, so nothing is reported twice:
// ZERO_WITH_UNIT excludes a zero preceded by an open math function (negative lookbehind);
// ZERO_UNIT_IN_MATH requires one (positive lookbehind) and exempts the sanctioned `0rem`.
// The `i` flag makes them case-insensitive — CSS units are (`0PX` is a violation).
//
// Non-global on purpose: a global regex carries `lastIndex`, which makes a shared `.test()`
// flip between hit and miss on successive calls. `findZeroMisuse` clones with `g` locally
// when it needs to enumerate matches, leaving these two safe for a stateless `.test()`.
export const ZERO_WITH_UNIT = new RegExp(`(?<![\\w.])(?<!${MATH_FN})0(?:${LENGTH_UNITS})(?![\\w%])`, 'i');
export const ZERO_UNIT_IN_MATH = new RegExp(
  `(?<=${MATH_FN})(?<![\\w.])0(?!rem)(?:${LENGTH_UNITS})(?![\\w%])`,
  'i',
);

/**
 * Every match of `regex` in `cssText`, as `{ line, n }` (trimmed source line + 1-based
 * line number). Runs over the WHOLE string, not line-by-line: `[^()]` inside the
 * math-function lookbehind matches newlines, so a declaration whose `calc()` wraps across
 * lines is still judged in context — a line-by-line scan mis-reads the tail line
 * (`- 0px);`) as a bare zero because it can't see the `calc(` above it. Clones `regex`
 * with the `g` flag locally so the exported non-global regexes keep their stateless `.test()`.
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

// The custom property a line declares, so the error can name the token to fix
// (`--tracking-normal: 0em;` → `--tracking-normal`). Null when the offending value is not
// on a `--token:` line (a continuation line of a wrapped declaration, a keyframe step, a
// hand-written utility): the line + number in the detail already locates those.
const tokenOf = (line) => line.match(/(--[\w-]+)\s*:/)?.[1] ?? null;

/**
 * Throw if any token value in `cssText` misuses a zero length. `source` names the artifact
 * the lines are numbered against (e.g. `globals.css`) — passed in, never hardcoded, so a
 * reuse of this check on another file reports honest paths.
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
