# `webkit report` and `webkit canary`

Two commands and one reusable workflow that answer "how much of this project's UI is
actually the design system, and is that number trustworthy?"

## `webkit report`

```bash
npx @aziontech/webkit report                       # Markdown to stdout
npx @aziontech/webkit report --format json         # the same numbers, machine-readable
npx @aziontech/webkit report --update              # snapshot the baseline
npx @aziontech/webkit report --fail-on new         # ratchet: fail only on new violations
```

It runs the project's own ESLint, keeps only `webkit/*` results, and prints:

- the violation total, the number of files affected, and an **adoption score**;
- a table per rule with what each one catches;
- the 15 worst files;
- **a coverage note saying what it did not look at.**

Markdown goes to **stdout**, progress and warnings to **stderr**, so a CI step can do
`webkit report >> "$GITHUB_STEP_SUMMARY"` with nothing to filter.

| Option              | Default                 |                                                               |
| ------------------- | ----------------------- | ------------------------------------------------------------- |
| `--format`          | `markdown`              | `markdown` or `json`                                          |
| `--baseline <file>` | `.webkit-baseline.json` | where the frozen debt lives                                   |
| `--update`          | —                       | rewrite the baseline from this run, then exit                 |
| `--fail-on`         | `never`                 | `never` · `new` (violations absent from the baseline) · `any` |

### The score counts clean files, not violations

`score = clean UI files ÷ all UI files`, over `.vue` and `.astro`. A file with twenty
findings weighs the same as a file with one, so the number moves when a **file is
finished** — not when the cheapest findings across the repo are cleared. It is the same
shape the `azion-console-kit` architecture report uses, so the two are comparable.

### The baseline is a multiset

Keys are `<file>::<rule>`, **one per occurrence**. A second violation of an
already-baselined rule in the same file therefore counts as _introduced_ — with a plain
set it would slip through. Same semantics as `scripts/check-authoring.mjs`, deliberately.

Commit the baseline. `--fail-on new` refuses to run without one rather than inventing an
empty baseline and reporting everything as new.

### Why the shim

The report spawns the project's **`node_modules/.bin/eslint`** shim. That is not the
obvious choice, so here is the measurement behind it — taken on a pnpm + Astro consumer
with eslint 9.39.5:

| Entry point                                  | `.astro` findings                                   |
| -------------------------------------------- | --------------------------------------------------- |
| `new ESLint().lintFiles(['.'])` (Node API)   | **0** — fatal `Unexpected token interface` per file |
| `node node_modules/…/eslint/bin/eslint.js .` | **0** — same failure                                |
| `node_modules/.bin/eslint .`                 | **3** — correct                                     |

The API reported a fatal parse error for every `.astro` file even though
`calculateConfigForFile()` returned the right parser _and_ processor for those same files.
Spawning the resolved bin file with `node` failed the same way. The shim is what differs:
pnpm's `.bin/eslint` exports `NODE_PATH` into its `.pnpm` directories before exec'ing
node, and without it ESLint cannot resolve the Astro parser — so it silently falls back to
the default one.

All three paths **succeed**. Two of them just return a smaller number. A measurement tool
cannot be quietly wrong, so the report goes through the same entry point the project's own
`lint` script does.

### What the report cannot see, and says so

Every run ends with a coverage note, because a report that hides its own blind spots is
worse than no report:

- **`no-style-override` does not run on `.astro`** — it needs vue-eslint-parser's template
  visitor, which astro-eslint-parser does not provide. A restyled component inside an
  Astro file is invisible.
- **Raw HTML where a component exists** (`<button>`, `<input>`, a hand-rolled modal) is
  caught by no rule yet. `prefer-webkit-component` matches imports from a foreign package,
  not markup.
- **An unresolved catalog disables the catalog-backed rules.** The report checks for this
  and leads with it, because otherwise "clean" and "blind" look identical.

## `webkit canary`

```bash
npx @aziontech/webkit canary
```

Inverted logic: each shipped fixture violates one rule **on purpose** and must keep being
flagged by that exact rule.

```
OK    denied-import.vue — webkit/no-deep-internal-import
OK    unknown-export.vue — webkit/valid-import-path
OK    hardcoded-color.vue — webkit/no-hardcoded-color
OK    foreign-library.vue — webkit/prefer-webkit-component
OK    hardcoded-color.astro — webkit/no-hardcoded-color

4 of 4 required canaries fired, plus 1 optional — the rules reach this project.
```

The fixtures are written into `.webkit-canary/` under the project root — so the project's
own flat config applies to them — and removed afterwards.

This command exists because **every way of losing the rules is silent**:

| What breaks                                       | What you see                                    |
| ------------------------------------------------- | ----------------------------------------------- |
| The catalog does not resolve                      | one stderr line; 8 of 12 rules quietly disabled |
| An extension is missing from the preset's `files` | nothing at all for those files                  |
| A config edit drops the preset                    | a lint that still passes                        |

In all three cases the adoption number reads **better**, not worse. The canary is the only
check that fails when the measurement stops working, which is why the reusable workflow
blocks on it.

The `.astro` fixture is **optional**: a project that does not lint Astro at all skips it
rather than failing. A project that _does_ lint Astro but whose rules do not reach it gets
a `SKIP` line naming the reason — visible, not silent.

## The reusable workflow

```yaml
jobs:
  webkit:
    uses: aziontech/webkit/.github/workflows/webkit-consumer-gate.yml@main
```

Four stages, deliberately not equally strict:

| Stage                          | Blocks? | Why                                                                                                                                            |
| ------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Wiring** (`webkit doctor`)   | yes     | If the wiring is broken, everything below measures the wrong thing. Also covers version drift — it warns on any dependency pinned to `latest`. |
| **Canary**                     | yes     | The only stage that fails when the measurement itself stops working.                                                                           |
| **Adoption** (`webkit report`) | no      | Reports the score and tables to the run Summary. `fail-on: new` turns it into a ratchet.                                                       |
| **Style** (stylelint)          | no      | Tokens in authored CSS.                                                                                                                        |

`webkit-gate` is the single check to mark required: it passes when every stage either
succeeded or was cleanly skipped, so a consumer can disable a stage without changing which
check is required.

Useful inputs: `fail-on` (`never` → `new` is the flip from report to gate),
`package-manager`, `node-version-file`, `baseline`, `paths`, and `block-*` per stage. The
workflow lives in a **public** repo, so private consumers can call it too.

### Rolling it out

Report first, ratchet second:

1. Call the workflow with the defaults. The Summary now carries the number.
2. When the number stops surprising anyone, run `webkit report --update` once and commit
   `.webkit-baseline.json`.
3. Switch to `fail-on: new`. Existing debt stays frozen; new UI outside the design system
   fails the PR.

Step 2 is the whole point of the baseline: it lets the gate start blocking without asking
anyone to migrate first.
