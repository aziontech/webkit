# `webkit report` and `webkit canary`

Two commands that answer "how much of this project's UI is actually the design system,
and is that number trustworthy?"

## `webkit report`

```bash
npx @aziontech/webkit report                       # Markdown to stdout
npx @aziontech/webkit report --format json         # the same numbers, machine-readable
npx @aziontech/webkit report --fail-on any         # exit 1 when any webkit/* violation exists
npx @aziontech/webkit report src/components         # restrict to a subset of patterns
```

It runs the project's own ESLint, keeps only `webkit/*` results, and prints:

- the violation total, the number of files affected, and an **adoption score**;
- a table per rule with what each one catches;
- the 15 worst files;
- **a coverage section that always states what it did not look at.**

Markdown goes to **stdout**, progress and warnings to **stderr**, so a CI step can do
`webkit report >> "$GITHUB_STEP_SUMMARY"` with nothing to filter.

| Option        | Default    |                              |
| ------------- | ---------- | ---------------------------- |
| `--format`    | `markdown` | `markdown` or `json`         |
| `--fail-on`   | `never`    | `never` or `any`             |
| `[patterns…]` | `.`        | ESLint file patterns to lint |

Exit codes: `0` (clean, or `--fail-on never`), `1` (violations exist and `--fail-on any`),
`2` (the run itself failed — ESLint could not be resolved/spawned, or no `.vue`/`.astro`
file was reached at all).

### The score counts clean files, not violations

`score = clean UI files ÷ all UI files`, over `.vue` and `.astro`. A file with twenty
findings weighs the same as a file with one, so the number moves when a **file is
finished** — not when the cheapest findings across the repo are cleared. It is the same
shape the `azion-console-kit` architecture report uses, so the two are comparable. A file
that failed to parse (a fatal ESLint error) is never counted as clean either — it was
never actually checked, so it cannot count as evidence of adoption. It is called out by
name in the "Coverage" section instead.

### The `keys` shape is forward-compatible with a future baseline

`collect()` also returns `keys`: a flat `"<relative-path>::<rule>"` list, one entry per
occurrence (not deduplicated). This PR does not ship `--baseline`/`--update`/
`--fail-on new` — only `never`/`any` — but the multiset shape means a later PR can add
baseline diffing without changing what `collect()` returns.

### Why the shim

The report spawns the project's own **`node_modules/.bin/eslint`** shim — not the ESLint
Node API, and not `node node_modules/.../eslint/bin/eslint.js`. That is not the obvious
choice, so here is the measurement behind it, taken on a pnpm + Astro consumer:

| Entry point                                  | `.astro` findings                                   |
| -------------------------------------------- | --------------------------------------------------- |
| `new ESLint().lintFiles(['.'])` (Node API)   | **0** — fatal `Unexpected token` per file, silently |
| `node node_modules/…/eslint/bin/eslint.js .` | **0** — same failure                                |
| `node_modules/.bin/eslint .`                 | correct — the parser runs                           |

Both of the first two paths report `0` findings for every `.astro` file instead of an
error, because ESLint quietly falls back to its default parser when it cannot resolve
`astro-eslint-parser`. The shim is what differs: pnpm's `.bin/eslint` exports `NODE_PATH`
into its `.pnpm` directories before exec'ing node, and only with that does ESLint resolve
the Astro parser. A measurement tool cannot be quietly wrong about its own denominator, so
`report` (and `canary`) always resolve `node_modules/.bin/eslint(.cmd)` first, and only
fall back to resolving `eslint/package.json#bin` directly with `process.execPath` when the
shim itself is missing (an unusual install layout).

### What the report cannot see, and says so

Every run ends with a coverage section, because a report that hides its own blind spots is
worse than no report:

- **`no-style-override` cannot run on `.astro`** — it needs vue-eslint-parser's template
  visitor, which `astro-eslint-parser` does not provide. A restyled component inside an
  Astro file is invisible to this report.
- **Raw HTML where a webkit component exists** (`<button>`, `<input>`, a hand-rolled
  modal) is caught by no rule yet — `prefer-webkit-component` matches imports from a
  foreign package, not markup.
- **Files with a fatal parse error** are listed by path — they were never actually
  checked, and are excluded from `uiFilesClean`.
- **An unresolved catalog disables the catalog-backed rules** — the report checks for
  this and leads with a warning, because otherwise "clean" and "blind" look identical.

## `webkit canary`

```bash
npx @aziontech/webkit canary
```

Inverted logic: each fixture violates one rule **on purpose** and must keep being flagged
by that exact rule.

```
OK    webkit/no-deep-internal-import denied-import.vue
OK    webkit/valid-import-path unknown-export.vue
OK    webkit/no-hardcoded-color hardcoded-color.vue
OK    webkit/no-hardcoded-color hardcoded-color.astro

4 of 4 required canaries fired — the rules reach this project.
```

The fixtures are written into `.webkit-canary/` under the project root — so the project's
own flat config applies to them — and removed afterwards, even when the run fails or
throws.

### Why canary exists

Every way of losing the design-system rules is silent, and every one of them makes the
adoption number reported by `webkit report` read **better**, never worse:

| What breaks                                       | What you see                                      |
| ------------------------------------------------- | ------------------------------------------------- |
| The catalog does not resolve                      | one `stderr` line; 8 of 12 rules quietly disabled |
| An extension is missing from the preset's `files` | nothing at all for those files                    |
| A config edit drops the preset                    | a lint that still passes                          |

`canary` is the only check in this pair that fails when the measurement itself stops
working, which is why it should gate CI ahead of trusting anything `report` prints.

The `.astro` fixture is **required** whenever `astro-eslint-parser` and
`eslint-plugin-astro` resolve from the project (meaning it lints `.astro` at all);
otherwise it is reported as `SKIP`, naming the reason — visible, never silent. A red
canary (any `FAIL` line, exit code `1`) means the design-system rules are **not** reaching
this project — fix the wiring (`webkit doctor` is the first stop) before trusting any
`webkit report` output.

## CLI contract summary

| Command  | Flags                                                                | Exit codes                                                         |
| -------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `report` | `--format <markdown\|json>`, `--fail-on <never\|any>`, `[patterns…]` | `0` clean/never, `1` violations + `--fail-on any`, `2` run failure |
| `canary` | (none)                                                               | `0` every required fixture fired, `1` any `FAIL`                   |
