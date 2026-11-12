# JOURNAL — contributor journey C (AI-only), branch `eval/journey-c`

The contributor is me, an AI agent with no prior WebKit context. I learned the process only from
the repository. The base is `410437266` (`feat/webkit-v6` line). The box is a loaded 4-CPU machine.
Constraints for this run: no subagents, never push, one heavy command at a time, and every
foreground command under 10 minutes.

Times come from `date` and the commit timestamps (UTC, 2026-11-12). Wall-clock was dominated by
tool runs (docs build 3 min, gates 45 s, lint 27 s, type-check 27 s, SSR 57 s), not by authoring.

| Phase                                                                                                                           | Start  | End                                | Wall                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Onboarding (README → AGENTS → .claude/AGENTS → commands → CONTRIBUTING)                                                         | 05:26  | ~05:29                             | ~3 min                                                                                                           |
| Audit (pages.json, ~55 `search` queries, `view`, catalog, grep) → `GAPS.md`                                                     | ~05:29 | 05:31                              | ~2 min of tool time; the reading was the bulk of the effort                                                      |
| Piece 1: `search-trigger` component (spec → commit + catalog fix)                                                               | 05:31  | 05:45                              | ~14 min                                                                                                          |
| Piece 2: docs article page (built as block `docs/article`, ended as variants `Article` + `Reference` of `shells/documentation`) | 05:45  | 05:50 (first green), 06:05 (final) | ~5 min to green `check-patterns` and harness; 15 more for visual fixes, a contrast failure and the taxonomy move |
| Piece 3: docs home (`docs/landing` → variant `Landing`)                                                                         | 05:48  | 05:50 (first green), 06:05 (final) | ~2 min (reused piece 2's chrome) + the same fixes                                                                |
| Docs build + screenshots + visual fixes + re-verify                                                                             | 05:51  | ~06:10                             | docs build 3 m 17 s, three times                                                                                 |
| Journal                                                                                                                         | —      | end                                | —                                                                                                                |

---

## 1. How I learned the process (file by file)

1. **`README.md`.** It has two paths: "consume" and "contribute". The contribute path says to
   read `.claude/AGENTS.md`, that every component starts from a spec through `/component-create`,
   and that I must run `catalog:build` after changing a block or example.
   - _Stale:_ its "Development flow" says "flip `status: draft` → `approved`" **by hand**.
     `AGENTS.md` and `/webkit-new` say only `spec-validator` may flip it, after a second-agent
     review.
   - _Stale:_ "How to read this repo" points at `.specs/button.md` + `button.vue` as the
     **canonical implementation**. `button.vue` builds its classes in JS arrays
     (`'before:transition-opacity …'`), which `.claude/rules/styling.md` forbids ("no class
     presets in JavaScript").
2. **`AGENTS.md` (root).** This was the best single entry point. It lists the 9-step AI flow
   (`/webkit-new`, `/webkit-new-block`) and the gates, and says hooks block writes without an
   approved spec.
3. **`.claude/AGENTS.md`.** Long. Useful parts: §11.4 hard rules, §12 hooks.
   - _Stale:_ every path is `packages/webkit/src/components/webkit/**`, but that folder does not
     exist; components live in `src/components/<category>/`.
   - _Stale:_ "Node >= 22.18.0" (README, CONTRIBUTING and `.nvmrc` say >= 24).
   - _Stale:_ "scaffolder writes `.vue` + `package.json`". `.claude/rules/component-structure.md`
     says "**No per-component `package.json`**".
   - _Stale:_ "Five hooks". `settings.json` wires eight.
   - _Stale:_ the category list (`marketing`, `templates`) does not match the folders (`sections`,
     `chart`, `ai`).
4. **`.claude/commands/webkit-new.md` / `webkit-new-block.md`.** These are the real procedure.
   They are clear, with an exit condition per step. They assume:
   - (a) a GitHub issue (`gh issue view`). There is none in this eval, so I wrote the issue fields
     into the run log.
   - (b) isolated sub-agents for authoring and review, which this run forbids.
   - (c) the `claude` CLI plus an API key for the usage check.

   `webkit-new-block` lists block categories `platform/*` and `shell` only. `blocks/headers/`
   already exists and is not listed, and there is **no category for docs or marketing pages**.
   The issue template `new-block.yml` has the same list.

5. **`CONTRIBUTING.md`.** It has the same flow as a table, the "What to update when WebKit changes"
   table (the most useful single table in the repo) and the gates list.
6. **`.claude/commands/spec-create.md`, `component-create.md`, `.claude/skills/spec-validate`,
   `.claude/agents/spec-reviewer.md`, `.specs/_template.md`, `.claude/rules/{testing,
component-structure,bundle-budget,prop-vocabulary}.md`.** I read these as each step needed
   them.
   - _Missing:_ `spec-validate` is "deterministic" but is an LLM skill. No script computes the
     checksum or flips the status. I wrote a 40-line script over `.claude/hooks/_lib/spec.mjs`.
   - _Stale:_ `spec-create` Mode B "always asks the user about every section". In an AI-only flow
     there is no user. `/webkit-new` resolves this ("the issue and research notes are the
     answers"), but `spec-create` itself does not say so.
   - _Stale:_ `_template.md` still shows the `src/components/webkit/<category>/` layout and talks
     about "Stories" (Storybook is gone).
7. **`.claude/settings.json` + `.claude/hooks/README.md`.** The hooks use relative paths
   (`node .claude/hooks/x.mjs`, `ROOT = process.cwd()`). They fire **only** when Claude Code is
   started at the repo root. My session was started elsewhere, so none fired on my writes. No CLI
   runs "the hooks on this file". I wrote `hooks.sh`, which pipes a Write-shaped JSON into all 8
   hooks, and ran it on every file I wrote.
8. **`.claude/skills/ui-craft/SKILL.md`.** The mandatory review. It is good, but it routes to 15
   child skills. For a small component, most are N/A. Nothing says which subset applies to an
   action button versus a page.
9. **`ROADMAP.md`.** I skimmed the headings only. I didn't need it to contribute.

**What was missing overall:** a single "contributor quickstart for agents" listing the exact
commands in order, including the local equivalents of the steps that need GitHub, sub-agents or a
paid session. I also lacked a way to run the hooks and the spec validator from the shell.

---

## 2. Audit

See `GAPS.md`. I used `cli.js search`/`view` (the same catalog the MCP serves), plus
`catalog.json` and grep.

Result: the regions of all 16 pages are almost entirely covered (282 catalog entries, 79 blocks).
The real gaps are:

1. the hand-rolled "Search ⌘K" field (75 copies);
2. no page-level block for documentation (an article, the home).

Marketing pages are composed from sections by the site, by design.

Discovery frictions found while auditing:

- `search` ranks by shared single words. "pricing page", "product page" and "contact sales page"
  all return `doc-page-header`/`page-header`, because of "page".
- "pager next previous page" misses `doc-pagination`.
- MCP `search_components` with "keyboard shortcut" ranks `kbd` first via an alias note.
- `search` prints `webkit 5.12.0` on the v6 line.
- The catalog leaks spec-table escapes into types: `doc-heading` `level: 1 \ | 2 \ | 3 \ | 4`.
- Some component examples are not copyable: `doc-pagination` calls `router.push`, and
  `doc-on-this-page` calls `scrollToHeading`. Neither is defined.
- `banner`'s "Avoid when" names `message`, which is not an export (it is an alias of `alert`).

---

## 3. Piece 1: `SearchTrigger` component (`@aziontech/webkit/search-trigger`)

Flow followed: `/webkit-new` steps 1–8 run locally, plus `/component-create`.

1. **Issue (step 1).** There is no GitHub issue, so I wrote the form fields to
   `.claude/logs/search-trigger.jsonl` (gitignored).
2. **Research and reuse (step 2).**
   - `search` + MCP: no trigger exists.
   - `Command` owns the ⌘K listener and has no Trigger part.
   - `catalog.json#aliases` has no "search" entry.
   - grep: 75 hand-rolled copies.
   - The `command` example hand-rolls a _third_ variant: a readonly `Input` acting as a trigger.
   - Benchmarks: the shadcn docs search button; the Cloudscape top-navigation search slot.

   I did not fetch the pages; I wrote from memory and logged that.

3. **Spec draft (step 3).** `.specs/search-trigger.md`, template 2, Mode B with the issue as the
   answers. `spec-template:check` passed.
4. **Second-agent review (step 4).** **Deviation:** no subagents are allowed, so I ran the fixed
   10-item `spec-reviewer` checklist myself, in a separate pass. This is not independent.
   - Pass 1 → **return** on item 7: touch targets need 44 px on coarse pointers. I added
     `pointer-coarse:min-h-11`/`min-w-11`.
   - Pass 2 → approve.
   - My validator script wrote the checksum and set `approved`.
5. **Build (step 5).**
   - Wrote the `.vue`. My hook runner reported **two blocks**:
     - `validate-spec-compliance`: "Slots missing in .vue: `_none_`". The spec's Slots table had a
       header row plus a `_none_` row. The parser reads `_none_` as a slot named `_none_`. The
       message says "fix the spec OR the .vue" but not that **the format** is the problem. I found
       the accepted form (a bare `_none_` paragraph) by reading other specs. → Spec edit →
       re-approval.
     - `enforce-test-exists`: "no co-located test". This is correct and the message is good. But
       the documented order (`/component-create` writes the `.vue`, then `/webkit-new` step 5.2
       writes the test) can't be followed: the PostToolUse hook fires on the first `.vue` write.
       _The message also suggests adding the component to `legacy-components.json`, which is a
       bypass that a hurried agent would take._
   - Changed the spec again: `aria-keyshortcuts` is `"Meta+K Control+K"` on both server and
     client, so SSR and hydration agree. Platform sniffing would mismatch (`Kbd` has that latent
     issue). → re-approval.
   - i18n: added `searchTrigger.label` to `en.ts`, `pt-BR.ts` and `es.ts` by hand. No doc says a
     new key needs all three catalogs; I inferred it from `sectionCommand`.
   - Export in `package.json#exports`; 3 examples (Default with `Command`, Collapsible, Disabled);
     test with 13 cases (render, testid, label/i18n, shortcut mapping, collapsible, click
     via pointer/Enter/Space, disabled suppression, opens `Command`, examples, pt-BR, rtl, axe
     ×3).
   - **Size:** `check-size.mjs` has no filter and builds all 253 budgets. I ran a filtered copy:
     2.59 KB → budget 3 KB. Separately, 253 of 440 export paths are unbudgeted, although
     `bundle-budget.md` says "Do not add a public export without a size-limit entry".
   - `catalog:build` ✓; `search` finds it (rank 2) for "search trigger with keyboard shortcut ctrl
     k". The pt-BR query "campo de busca no cabeçalho com atalho" finds **nothing**: components
     have no pt-BR intents (only blocks do), and specs have nowhere to put them.
6. **Machine gates (step 6).**
   - `gates` **15/15 pass** (45 s).
   - `lint` ✖: `simple-import-sort` in my test (autofix). After the fix ✓.
   - `lint:style` ✓, `type-check` ✓, `type-coverage` 99.97 % ✓, `format:check` ✓, `test:ssr` 6/6 ✓,
     Vitest `search-trigger.test` 13/13 ✓.
   - **Trap:** running Prettier over the spec realigned its tables, so the body sha256 no longer
     matched (`checksum DIFFERS`). The approval is a hash of raw bytes, and the repo's own
     formatter breaks it. → re-approval.
7. **ui-craft (step 7).** Findings:
   - (blocker, fixed) disabled used `opacity-50`; now `--bg-disabled`/`--text-disabled`.
   - (fixed) hover changed the border while disabled; now `enabled:` guard.
   - (open, minor) the folded form has no visual tooltip; the hand-rolled copies wrapped the
     IconButton in a `Tooltip`. The accessible name is kept.

   Updated the spec's Tokens table → re-approval → `implemented`.

8. **Usage check (step 8).** Not run. A real run is a paid `claude -p` session, which counts as a
   subagent here. `--dry-run` resolved the plan. As a proxy I drove the MCP server over stdio:
   - `search_components("search button with keyboard shortcut in the header")` ranks
     `search-trigger` **4th** (score 33, after `kbd` 78 and `button` 61).
   - `suggest_component` recommends the `headers/docs-header` **pattern**, which does not use the
     new component.

   So a fresh agent would probably still hand-roll the field until the header blocks adopt it.
   I did not migrate the 75 copies (that is a separate change with visual baselines). The two new
   docs blocks use it.

9. **Commit.**
   - `5eb84a5e4 feat(webkit): add SearchTrigger…`. Husky ran lint-staged and commitlint, and both
     passed.
   - **Trap:** lint-staged's Prettier reformatted my example `.vue` _at commit time_, so the
     committed `catalog/examples/search-trigger.json` was immediately stale
     (`catalog:check` ✖ "stale catalog/examples/search-trigger.json").
   - Fixed in `048f1c3f9`. CI would have failed the PR on a catalog I had just regenerated.

## 4. Piece 2: docs article page (`docs/article` → `shells/documentation` variants `Article` + `Reference`)

Flow: `/webkit-new-block`.

1. **Category.** Neither the issue template nor the command offers `docs`. I created
   `blocks/docs/` (the catalog accepts any folder holding a `block.json`). Taxonomy decided
   alone, unreviewed.
2. **Reuse.** No docs page block exists. The existing `shells/documentation` hand-writes its
   column (`<h1>`, `<h2>`, `<p>`) **and its "On this page" list**, instead of `DocOnThisPage`.
   That is the wrong example for an agent.
3. **Brief and review.** Self-run, block mode. Same deviation as piece 1.
4. **Build.**
   - Copied the shell's chrome. Replaced the search with `SearchTrigger collapsible` in an
     `@container`.
   - The column uses only `Doc*` parts. The rail uses `DocOnThisPage` + `DocCta`.
   - Variant `Reference` (Applications reference: callout, `Diagram name="applications"` in
     `DocFrame`, JSON `CodeBlock`, term list).
   - `block.json` (en + pt-BR intents), `guidelines.md`.
   - `check-patterns` ✓ **first try**; `check-naming` ✓.
5. **Harness.** `copyable-sfcs`, `rtl`, `hydration`, `reflow`, `a11y-blocks-light/dark`,
   `a11y-examples-light/dark` filtered with `-t 'docs/(article|landing)|search-trigger'`:
   **66/66 pass**.
6. **Discovery.**
   - `search "documentation article page with steps and code"` → `docs/article` first.
   - pt-BR `"página de tutorial da documentação"` → first.
   - MCP `search_patterns("a getting started tutorial page for our docs site")` → first.
7. **Docs site.** `docs:build` 3 m 17 s, exit 0. It prerendered `/blocks/docs/article`,
   `/frame/tutorial/docs/article` and `/frame/reference/docs/article`; the Blocks index lists a
   new "Docs" group.
8. **ui-craft from the screenshots.** Every machine check passed and the page still had 4 visible
   defects:
   - `DocHeading` rendered at **body size**. It takes its scale from `DocProse` (stated only in
     its JSDoc: "drives the prose type scale"). Fix: one `DocProse` around the column.
   - Every rail row showed a **house icon**: `MenuItem`'s `icon` defaults to `'pi pi-home'`.
     Fix: `icon=""` on every row.
   - The "Search documentation" label truncated in the 224 px field. Changed to "Search docs".
   - In the landing (piece 3): the marketing `Banner` rendered at display scale, louder than the
     `h1`. Replaced with a full-width `DocCard`.

## 5. Piece 3: docs home (`docs/landing` → `shells/documentation` variant `Landing`)

Same flow. I built it from piece 2's chrome (no outline rail).

- **Content:** `DocPageHeader` without a breadcrumb, the Get started button, a `DocPrompt` for the
  agent, then 4 sections of `DocCardGroup`s with framework glyphs, and `DocPagination`.
- **Hook gap:** I first used `layout-column-wide` and `text-display-sm`. Neither exists, and no
  hook or gate flagged them (`validate-tokens` only covers `src/components/**`). I caught both by
  grepping the theme.
- **`patterns:check` ✖:** "Avoid the class(es) … on the webkit component `<DocProse>` — Only
  layout utilities are allowed on a webkit tag … Put the rest on a wrapper element". This message
  is excellent and the fix took one minute.
- **Harness:** a11y light/dark ✓ (included in the 66).

---

### 5b. Late blocks that changed the shape of pieces 2 and 3

- **a11y harness (styled) ✖ on `Reference`:** "color-contrast: … `.bg-(--primary).text-(--primary-contrast)`". I had moved the column into one `DocProse` to fix the heading scale. The two `Button`s render as `<a>`, so `DocProse` restyled them as links. Fix: wrap the row in `data-doc-chrome` (the `DocProse` ChromeBoundary example documents it). Note that this harness **does** see CSS and contrast, although `.claude/rules/testing.md` says the browser suite has none. A contributor reading the rule would not expect a contrast failure from Vitest.
- **Toolkit test ✖ (`gates` → "Toolkit tests"):** `test/standards/patterns.test.mjs` — `assert.ok(ids.every((id) => /^(headers|shells|platform)\//.test(id)))`. A bare assert, with no message, enforces the block taxonomy. **No doc, command, template or reviewer item mentions it.** `check-patterns`, `check-naming`, `catalog:build`, the docs site and the MCP all accepted `docs/` happily, and this was the **last** gate to say no, about 30 minutes after I created the folder. I had two options:
  - (a) widen the regex, which edits a test to pass a gate (`/webkit-new` forbids it, and it is the design owner's taxonomy call);
  - (b) follow `/webkit-new-block` step 2: "if one nearly does, the run adds a **variant**".

  I chose (b). `shells/documentation` is literally the docs chrome with a placeholder column, so the three pages became its variants `Article`, `Reference` and `Landing`. I merged the guidance into its `guidelines.md` (Do, Don't, Copy and one States line per variant) and appended the en + pt-BR intents to its `block.json`. Discovery still works: CLI `search` (en and pt-BR) and MCP `search_patterns` / `suggest_component` return `shells/documentation` first, and `webkit view shells/documentation --variant Article` prints the page.
  - **Cost of (b):** `apps/visual` screenshots only the **primary** state of non-AI blocks, so the three pages get no visual baseline. Under (a) each would have been a primary state with light, dark and 390 px baselines. The process pushes me to a shape that loses pixel coverage.

- **commitlint ✖:** header 106 > 100 characters. The message is clear and the fix took one minute.

## 6. Gates and hooks that blocked me

| #   | Gate / hook                              | Blocked on                                                                  | Did the message say how to fix?                                                                               |
| --- | ---------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | `validate-spec-compliance` (hook)        | `_none_` row in Slots table read as a slot                                  | Partly: "fix the spec OR the .vue". It did not say the table **format** was the problem.                      |
| 2   | `enforce-test-exists` (hook)             | `.vue` written before its test                                              | Yes. But it also offers the legacy whitelist as an escape.                                                    |
| 3   | `eslint` (`lint`)                        | import order in the test                                                    | Yes ("Run autofix").                                                                                          |
| 4   | my spec-validate script (`bodyChecksum`) | Prettier realigned the spec tables                                          | No. Nothing tells you the formatter invalidates the approval.                                                 |
| 5   | `catalog:check` (after commit)           | lint-staged reformatted an example during the commit                        | Yes ("Run catalog:build"). But the cause, the pre-commit hook itself, is invisible.                           |
| 6   | `patterns:check` consumer lint           | classes on `<DocProse>`                                                     | Yes. Exemplary message.                                                                                       |
| 7   | none                                     | invalid utility classes in blocks (`layout-column-wide`, `text-display-sm`) | Not blocked at all. They would have reached review.                                                           |
| 8   | none                                     | 4 visual defects (heading scale, house icons, truncation, banner scale)     | Nothing machine-checks them. Only screenshots caught them.                                                    |
| 9   | a11y harness (Vitest, styled)            | `Button` row inside `DocProse` lost contrast                                | Partly: the selector and rule are given; the cause (prose link styles) and the `data-doc-chrome` fix are not. |
| 10  | toolkit test `patterns.test.mjs`         | block id outside `headers                                                   | shells                                                                                                        | platform` | **No.** It is a bare `assert.ok`, and the taxonomy is written nowhere else. |
| 11  | commitlint                               | header longer than 100 characters                                           | Yes.                                                                                                          |

## 7. Final state

**Commits on `eval/journey-c`** (newest first, never pushed):

```
b01682546 refactor(webkit): docs pages become Article, Reference and Landing variants of the docs shell
91dea6369 feat(webkit): add docs/article and docs/landing blocks
048f1c3f9 chore(webkit): regenerate the catalog after lint-staged reformatted the SearchTrigger example
5eb84a5e4 feat(webkit): add SearchTrigger, the field-shaped button that opens search
```

| Piece             | Where                                                                                                                                                       | Status                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| SearchTrigger     | `src/components/actions/search-trigger/`, `.specs/search-trigger.md` (`implemented`), `examples/search-trigger/`, i18n en/pt-BR/es, `.size-limit.json` 3 KB | Done. Open: no tooltip when folded; the 75 hand-rolled copies are not migrated; paid usage check not run. |
| Docs article page | `blocks/shells/documentation/variants/article.vue` + `reference.vue`                                                                                        | Done as variants. Open: no visual baseline (non-AI variants aren't screenshotted).                        |
| Docs home         | `blocks/shells/documentation/variants/landing.vue`                                                                                                          | Done as a variant. Same open item. Minor: large gap between the prompt and the first section.             |

---

## 8. Final verification

Last run at 06:05–06:10 on `b01682546`:

- `pnpm --filter @aziontech/webkit run gates`: **15/15 pass** (catalog, llms, d.ts, naming, migrations, marketing inventory, patterns G1, cited names G2, no draft G3, spec template, authoring ratchet, doc standards, test gate, hook tests, toolkit tests 332/332).
- `lint` ✓ · `lint:style` ✓ · `type-check` ✓ · `type-coverage` 99.97 % ✓ · `format:check` ✓ · `test:ssr` 6/6 ✓ (renders every block and example).
- Vitest browser, filtered to the new pieces (`search-trigger.test`, `copyable-sfcs`, `rtl`, `hydration`, `reflow`, `live-regions`, `screen-reader`, `a11y-blocks/examples-light/dark`): **90 passed, 0 failed**.
- Size: `search-trigger` 2.59 KB / 3 KB budget. This is a filtered run; I did not run the full 253-entry `size`.
- Docs site: `pnpm --filter @aziontech/webkit-docs build` exit 0. It prerendered `/components/search-trigger`, `/example?path=search-trigger/*`, `/blocks/shells/documentation` and `/frame/{article,reference,landing}/shells/documentation`. Screenshots (1440 light/dark, 390, plus the component and the collapsible example) are in `C/shots/`. All pages returned 200 with no page errors.
- `search`/MCP: `search-trigger` is found (CLI rank 2; MCP `search_components` rank 4). The docs pages are found first via `shells/documentation` (CLI en + pt-BR, MCP `search_patterns`, `suggest_component`).
- Not run: the full `webkit:test` suite, `apps/visual` (`visual:test`; baselines come only from the CI workflow), the paid `usage-check`, and the full `size`.

---

## 9. What WebKit must change so contributing is effortless

1. **Ship the "local" versions of every step.** `pnpm spec:approve <name>` (validate + checksum +
   status), `pnpm hooks:run <file>` (all hooks on one file), `pnpm size -- --only <name>`, and a
   `gates --component <name>` that runs lint, types, size and the filtered Vitest for one piece.
   Today an agent outside Claude Code (or started in another directory) gets **none** of the hook
   protection and has to rebuild these tools.
2. **Make the spec checksum formatting-proof.** Hash the parsed tables and sections, not the raw
   bytes, or run Prettier inside `spec-validate`. Today `prettier --write` silently un-approves a
   spec.
3. **Stop lint-staged from staling the catalog.** Run `catalog:build` inside lint-staged after
   Prettier (or exclude examples and blocks from the formatter's write step), so the committed
   catalog always matches.
4. **Write the block taxonomy down once and enforce it early.** Today it lives only in a bare
   `assert` in `test/standards/patterns.test.mjs`. Put the allowed roots in one data file read by
   `catalog:build`, `check-naming`, `new-block.yml`, `/webkit-new-block` and the reviewer, and fail
   at `catalog:build` time with a message. Then decide whether docs and site pages get a root
   (`docs/`) or live as shell variants. If they are variants, the visual suite must screenshot
   every variant of the shells, not only the primary.
5. **Fix the stale paths in one sweep.** `src/components/webkit/**` (`.claude/AGENTS.md`,
   `_template.md`), the Node version, "five hooks", per-component `package.json`, README's "flip
   to approved by hand", and `button.vue` as the "canonical" file that breaks `styling.md`.
6. **Give components bilingual intents.** Add a spec section (or `examples.json` key) for search
   intents in en + pt-BR, as blocks already have. Make `search`/`search_components` weigh the
   component name and intents over single shared words ("page", "keyboard").
7. **Make the usage check runnable in the flow.** Offer a cheap deterministic variant (MCP
   `suggest_component` / `search_components` must rank the new piece top-3 for the issue intent)
   that runs without a paid session. Keep the paid run for CI dispatch.
8. **Extend the token/class check to blocks and examples.** Unknown utilities such as
   `layout-column-wide` and `text-display-sm` should fail `patterns:check`, the way `<DocProse
class>` already does.
9. **Remove surprising defaults and document context dependencies.** `MenuItem icon='pi pi-home'`
   should default to `''`. `DocHeading` outside `DocProse` should warn, or carry its own scale.
   `/example?path=` should state that it takes the stem without `.vue`.
10. **Fix the hook messages.** `validate-spec-compliance` should name the accepted "no slots/events"
    form. `enforce-test-exists` should not suggest the legacy whitelist to a new component.
11. **One canonical "how to search" control.** Migrate the 75 hand-rolled triggers (and the
    `command` example's readonly-Input trigger) to `SearchTrigger`, so `suggest_component` → the
    header patterns lead agents to it.
12. **Write the i18n checklist down.** "A new message key goes in `en.ts` (+ the `en` object), `pt-BR.ts`
    and `es.ts`", with a gate that compares the three key sets.
