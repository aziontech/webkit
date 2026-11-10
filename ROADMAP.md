# Roadmap — WebKit on par with Cloudscape and shadcn, built and maintained by AI

Benchmarks: [Cloudscape](https://cloudscape.design) (AWS) for coverage — components, patterns with
guidelines, runnable demos — and [shadcn/ui](https://ui.shadcn.com) (Vercel) for distribution —
real source files in a registry, a CLI that copies screens, examples as files. WebKit already leads
both on AI tooling (catalog, MCP, skills, rules, lint, `doctor`); the gaps are content and structure.

Updated 2026-11-10, after the team merged the existing components and templates into
`feat/webkit-ai-ready` (`f9562602`). Stages 1 to 14 run in order, each closing with its exit
criteria; stage 0 (close the branch: CI green, baselines, overlapping PRs) runs **last**, because
the Storybook-based checks it would fix are rebuilt on the new model along the way.

## Decisions already taken

| Topic              | Decision                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Naming             | shadcn/Radix vocabulary (`pagination`, `tabs`, `card`, `alert`, `radio-group`…), the names models know best.                     |
| Breaking changes   | One direct major (v6) with a migration guide and a codemod; no aliases.                                                          |
| Screens (blocks)   | One canonical block per screen; states are props or example data, not numbered copies.                                           |
| Repeated fragments | Promoted to exported components (page header, section header, setting row, save bar, confirm dialog).                            |
| Form fields        | One `Field` wrapper around any control replaces the `field-*` family.                                                            |
| Pattern guidelines | Cloudscape depth: purpose, when / when not, building blocks, do / don't, copy, accessibility.                                    |
| Collections        | `useCollection` for client and server data, filters in the URL, saved preferences.                                               |
| Charts             | Our own chart family (started: `Chart`, `BarList`, `DonutChart`, `SparkChart`, `StatTile`, `Tracker`).                           |
| Languages          | Built-in messages in en and pt-BR, right-to-left supported.                                                                      |
| Missing components | Ordered by Cloudscape's list. Generative-AI components are a stage of their own.                                                 |
| Storybook          | Replaced by our own docs site that renders the real files and publishes `llms.txt`.                                              |
| CLI                | New `add`, `diff`, `search` / `view` and `check`.                                                                                |
| Who builds         | AI agents, end to end, through the flow in stage 3. AI evaluation of screens runs at the end (stage 12).                         |
| Who decides        | The head of design opens every request and approves every merge; agents do everything in between.                                |
| Development area   | Material for developing WebKit lives in `.claude/` (and `.specs/`); only `skills/`, `rules/`, `adapters/` and the packages ship. |
| Surfaces           | Every export is `product`, `marketing` or `docs`; nothing on the marketing or docs surface may disappear unrecorded.             |

## Done since the merge review

| What                                                                                                                                                                                                                                                                                                                                                                                   | Where      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Development area: `ui-craft` moved to `.claude/skills/ui-craft` (mandatory review for every new or changed component, example and block); process docs moved to `.claude/docs/` and out of the npm package; root `AGENTS.md`/`CLAUDE.md` for contributors of any agent; `test/standards/ai-bundle-boundary` keeps the two areas apart. `webkit-usage` is now the consumer entry point. | `0eb23f3a` |
| Surfaces: `surface` on every catalog export; `list_components` filters by it; `suggest_component` ranks product components first outside marketing requests; `scripts/marketing-inventory.json` (468 items) and `marketing:check` block any marketing or docs item from leaving unrecorded.                                                                                            | `ef745ec5` |

## Review of the merge (2026-11-10)

What landed: 15 components (Wizard, Stepper, HelpPanel, KeyValuePairs, Tree, Slider, FieldTime,
FileDropzone, FieldFileUpload, SeverityTag and the 7-piece chart family), each with spec, test,
story, export and a size-limit budget; chart and severity color roles in the theme; 75 patterns
(from 60) with Cloudscape-style names, en + pt-BR intents and state variants; the patterns lint
baseline down from 39 patterns to 3.

What the merge did not change, and where it is handled:

| Finding                                                                                                                                                                                                                                                               | Stage |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| Patterns still live in Storybook: 119 template stories, 120 files build the SFC as text with `toSfc`, 0 real `.vue` blocks. `build-catalog.mjs` also boots the story server (`withStoryServer`) to extract component examples. Removing Storybook breaks both.        | 1     |
| Fragments are still patterns: `page/page-header`, `page/section-header`, `page/page-tabs`, `page/settings-section`, `forms/setting-row`, `overlays/confirm-dialog`.                                                                                                   | 2     |
| Overlaps: `confirm-dialog` × `delete-with-confirmation`; `form-in-drawer` × `create-in-drawer` × `nested-drawer` × `deploy-drawer` × `deployment-settings-drawer`; `save-per-card` × `save-per-group` × `save-all-groups`; `details-page` × `details-page-with-tabs`. | 2     |
| Misplaced categories: `shell/` holds pages (`details-page-with-tabs`, `single-page-create`, `multipage-create`, `split-view`, `home-dashboard`) while `creation/` and `detail/` exist.                                                                                | 2     |
| Two new `field-*` components (`field-time`, `field-file-upload`) extend the family the single `Field` replaces.                                                                                                                                                       | 2     |
| Built-in English strings (e.g. `paginator` `aria-label="Previous page"`), no locale layer.                                                                                                                                                                            | 4     |
| 162 physical direction utilities (`ml-`, `pr-`, `left-`, `text-right`…) against 79 logical ones; no `dir` handling.                                                                                                                                                   | 4     |
| Components adapt to the viewport (`sm:`/`md:`/`lg:` ~440 uses) but only 4 files use container queries, so a component inside a drawer or split view lays out for the window, not its box.                                                                             | 4     |
| `catalog.json` is now 7.5 MB (was 4.3 MB); the ESLint plugin and the MCP parse it whole.                                                                                                                                                                              | 5     |

## Stage 0 — Close the branch (runs last, after stage 14)

| #   | Item                         | Detail                                                                                                                                                                                                                                                                                                                                                                             |
| --- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.0 | CI is red on `f9562602`      | Stylelint: `spark-chart.vue:159` (`custom-property-empty-line-before`). Toolkit: `test/mcp/queries.test.mjs:314` still expects `platform/auth/sign-in`, but the merge folded the three auth patterns into `platform/auth`. Because both fail, the Vitest browser shards and the Storybook visual tests were skipped, so the 15 new components have not run in a browser in CI yet. |
| 0.1 | Overlap with per-ticket PRs  | #1162 (ENG-50004), #1163 (ENG-50006), #1164 (ENG-50005) and #1165 (ENG-50007) are still open for the same tickets. Close them in favor of this branch, or merge them first and rebase.                                                                                                                                                                                             |
| 0.2 | Signed commits               | CONTRIBUTING asks for signed commits. Re-sign (`git rebase --exec 'git commit --amend --no-edit -S' origin/main`) or let the squash merge sign it.                                                                                                                                                                                                                                 |
| 0.3 | Visual baselines             | New story ids and fictional names change the snapshots. Run `pnpm storybook:test:visual:update:baseline`.                                                                                                                                                                                                                                                                          |
| 0.4 | Address autofill             | WebKit now hides fields without `autocomplete` from password managers. Account Settings address fields should set `postal-code`, `address-line1`, `address-line2`; check with the real 1Password extension.                                                                                                                                                                        |
| 0.5 | Card-brand hex               | Three account patterns keep 5 `no-hardcoded-color` findings (card-brand plate). Swap for a token or asset, then `patterns:check --update`.                                                                                                                                                                                                                                         |
| 0.6 | Hook tests failing on `main` | `node .claude/hooks/__tests__/run.mjs`: "legacy button is whitelisted" and "new component without spec blocks". Fix and run them in CI — stage 3 relies on these hooks.                                                                                                                                                                                                            |

Visual baselines (0.3) are taken on the new model (Playwright over `examples/` and `blocks/`, stage
10), not on Storybook. Re-check every row against the code before running this stage.

Exit: PR merged to `main` and released.

## Stage 1 — Source of truth out of Storybook

The shadcn registry model: every screen and every example is a real file in the package, and every
tool (catalog, MCP, docs, Storybook while it lives) reads those files.

```
packages/webkit/
  src/components/…                        components (npm exports)
  examples/<component>/<example>.vue      usage examples: catalog examples, docs, visual tests
  blocks/<category>/<block>/              screens to copy (in the npm package, not in exports)
    <block>.vue                           real SFC; imports only public @aziontech/webkit/<x> paths
    components/*.vue                      parts used only by this block
    data.ts                               fictional data and the state variants
    block.json                            name, title, description, type (page | section),
                                          category, intents (en, pt-BR), components, variants,
                                          files [{ path, target }]
```

- Move the 75 patterns and the ~172 component examples out of `toSfc` strings into these files;
  stories import them (`?raw` for the source panel).
- `build-catalog.mjs` and `scripts/lib/patterns.mjs` read `blocks/` and `examples/` only.
- CI rule: nothing under `packages/` reads or imports from `apps/`.
- Blocks and examples run through the same lint, type-check and Vitest as components.
- The 44 marketing template stories (`templates/marketing/`) move to `blocks/marketing/` with
  `surface: marketing` and join the marketing inventory, so the site's page compositions survive
  the end of Storybook.
- Categories by task, as in Cloudscape: `auth`, `account`, `create`, `view`, `detail`, `edit`,
  `delete`, `dashboard`, `settings`, `shell`, `states`.

Exit: on a throwaway branch, delete `apps/storybook`; `catalog:build`, the package tests and
`get_pattern("platform/auth")` still pass and return the same SFC.

## Stage 2 — Hygiene and the v6 major

| #   | Item               | Detail                                                                                                                                                                                                                            |
| --- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | Inventory          | One table of every component, block and example with its market name (shadcn/Radix, Cloudscape), duplicates and proposed fate (keep, rename, merge, promote, remove).                                                             |
| 2.2 | Renames            | `paginator` → `pagination`, `tab-view` → `tabs`, `card-box` → `card`, `message` → `alert`, `box-grid-selection` → card-style `radio-group`, `chip` reviewed against `badge` and `tag`, chart names reviewed, and the rest of 2.1. |
| 2.3 | Single `Field`     | `Field` (label, description, error, required, counter) wraps `Input`, `Select`, `Switch`, `Slider`, `TimeInput`, `FileUpload`…; the `field-*` family leaves in v6.                                                                |
| 2.4 | Promote fragments  | Page header, section header, page tabs, settings section, setting row, save bar, confirm dialog become components; blocks use them.                                                                                               |
| 2.5 | Merge overlaps     | One block per job (see the review table): drawer forms, save strategies, details pages, confirm vs delete.                                                                                                                        |
| 2.6 | Prop vocabulary    | Same names for the same idea across components (`variant`, `size`, `disabled`, `readonly`, `loading`, `invalid`, `v-model`), enforced by `webkit-prop-vocabulary`.                                                                |
| 2.7 | Naming check in CI | Kebab-case English ids, no synonym of an existing name, block ids match their folder, market-name map kept in the catalog for search.                                                                                             |
| 2.8 | Codemod + guide    | `npx @aziontech/webkit migrate v6` rewrites imports and props; `MIGRATION-v6.md` lists every change.                                                                                                                              |
| 2.9 | Housekeeping       | Paginator `more` button (focusable, no name), Overline (core spacing, `//` read aloud), `cli-templates/claude/` legacy copy removal, history-rewrite decision for personal data.                                                  |

Exit: v6 released; the codemod migrates a copy of the console with zero manual edits.

## Stage 3 — AI-only implementation flow

Everything after this stage is built by agents. The flow makes a correct component the only path
through CI. The **head of design** is the only human in it: they open the request and approve the
merge.

1. **Request (head of design).** An issue from a template: intent, benchmark links (Cloudscape
   `.md`, shadcn page), where it is used in the console, acceptance criteria, surface.
2. **Research and spec.** Contributor skill `/webkit-new` (on top of `spec-create`,
   `structure-decide`, `reuse-audit`) reads the benchmarks through their `llms.txt`/registry, checks
   the catalog for reuse, and writes `.specs/<name>.md` as `draft`.
3. **Spec review by a second agent.** A reviewer agent with a fixed checklist (naming, reuse, props
   vocabulary, states, i18n keys, RTL, responsive behavior, a11y, tokens, perf budget) approves or
   returns it; status moves to `approved` with a checksum.
4. **Build.** `component-scaffold` → component, `examples/`, tests, docs; hooks block code without an
   approved spec (`enforce-spec-exists`).
5. **Machine gates (CI).** Unit + a11y (axe) + keyboard, RTL and locale snapshots, visual tests at
   5 viewports, size and runtime budgets, type coverage, spec ↔ code checksum, catalog and docs
   regenerated, naming check.
6. **`ui-craft` review.** The contributor skill runs its full progression on the component, its
   examples and every block that uses it; findings are fixed or listed in the PR.
7. **Usage check.** A fresh agent session gets an intent-only prompt that needs the new component
   and must pick it through the MCP; the result must pass `webkit doctor`.
8. **PR and approval (head of design).** Generated description with the gate results, the
   `ui-craft` report and screenshots (light, dark, RTL, mobile, wide). The head of design approves;
   the merge and release-please do the rest. A rejection goes back to step 2 or 4 with their
   comments, never to a human fix.

Also in this stage: the spec template gains `Internationalization`, `Right-to-left`, `Responsive`
and `Performance` sections; a block flow (`/webkit-new-block`) mirrors the component one; changes to
existing components go through the same gates plus a changeset that feeds the codemod.

Exit: one new component and one new block delivered by the flow with no human edits, opened and
approved by the head of design.

## Stage 4 — Cross-cutting quality

Done before new components so nothing is retrofitted twice.

| #   | Area          | Work                                                                                                                                                                                                                                                                                                                                                                                           |
| --- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | Languages     | `WebkitProvider` with `locale`; message catalogs for every built-in string (en, pt-BR; es next for LatAm); `Intl` for dates, numbers, currency, relative time and plurals; no built-in string outside a catalog (lint).                                                                                                                                                                        |
| 4.2 | Right-to-left | `dir` on the provider; logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`) enforced by lint; mirrored icons list (arrows, chevrons) vs. non-mirrored (play, logos, code); `<bdi>`/`dir="auto"` around user data (domains, IDs, code) inside RTL text; Arabic-capable font stack and line heights in the theme; RTL visual tests.                                  |
| 4.3 | Devices       | Breakpoint contract in the theme; container queries for components that live in drawers, split views and cards; mobile behaviors (table → stacked rows or cards, drawer and dialog as full-height sheets, sticky actions); touch targets ≥ 24 px (44 px on coarse pointers); `pointer: coarse` and `hover: none`; ultra-wide max widths; reflow at 320 px and 200% zoom (WCAG 1.4.10, 1.4.12). |
| 4.4 | Accessibility | axe in every component test, keyboard maps per component, live-region announcements (sorting, filtering, uploads), `prefers-reduced-motion`, forced-colors mode, focus management in overlays.                                                                                                                                                                                                 |
| 4.5 | Performance   | Keep size-limit per component; add runtime budgets in Playwright (Table 1k / 10k rows with virtualization, Chart with 10k points, Tree with 5k nodes, Select with 1k options) and interaction latency; lazy loading for heavy parts (code editor, charts); SSR and hydration with Nuxt (builds on #1171); catalog split into per-pattern files and lazy loading in the MCP and lint.           |
| 4.6 | Code quality  | Browser support matrix (last 2 Chrome, Edge, Firefox, Safari, iOS Safari, Android Chrome) tested in CI; public API report diffed per PR; dependency policy (no new runtime dependency without an approved spec); type coverage kept at its current floor.                                                                                                                                      |

Exit: every component passes the new gates in en, pt-BR and an RTL locale at 360, 768, 1280, 1920
and 2560 px.

## Stage 5 — Pattern guidelines

`guidelines.md` next to every block, Cloudscape depth: purpose, when to use / not, building blocks
(A, B, C… matching the SFC), do / don't, copy for each element, accessibility, related blocks.
`get_pattern` returns it with the SFC. Agents draft from the code; the stage-3 reviewer agent checks
them against the SFC.

## Stage 6 — `useCollection` and collection components

`useCollection` (client and server modes, filter / sort / paginate / select, empty and no-match
states, filters in the URL, saved preferences) plus the components that depend on its API:
property filter, collection preferences, cards collection. Table and the `table-view` block move to it.

## Stage 7 — Missing components, in Cloudscape order

Still missing after the merge, among others: property filter and collection preferences (stage 6),
app layout with tools / help / split panel / notifications regions, attribute editor and tag editor
as components (today blocks), button group, file token group, tutorial panel and hotspot, board
(configurable dashboard as a component), error boundary, and the remaining chart types (area,
line, mixed, scatter) on top of the started family. Each one goes through stage 3.

## Stage 8 — CLI, docs site and `llms.txt`

- CLI: `add <block>` (copies the block, resolves imports, suggests the route), `diff <block>`
  (local copy vs. canonical), `search` / `view` (MCP queries in the terminal), `check` (`doctor` +
  `report` as one CI gate).
- Docs site that renders `examples/` and `blocks/` with the code beside, foundations included.
- `llms.txt` plus one `.md` per component, block and foundation page, and `.json` APIs, generated
  from the catalog — for agents without the MCP.

## Stage 9 — Generative-AI components

Chat, prompt input, streaming response, thinking and loading states, citations, follow-up
questions, user-authorized actions, artifact previews — with blocks and guidelines, benchmarked on
Cloudscape's generative-AI section and shadcn's AI Elements.

## Stage 10 — Demos and the end of Storybook

`apps/demos`: routed Vue apps with mock data for full flows (list → create → detail → edit →
delete, settings, onboarding), assembled with `webkit add`. Visual tests move to Playwright over
`examples/`, `blocks/` and demos. Storybook is removed.

## Stage 11 — Search quality

Tune pattern and component search (synonyms en / pt-BR, ranking) with a fixed query set and an
expected-result table run in CI; today "onboarding" and "upgrade plan" rank the wrong block first.

## Stage 12 — Final AI evaluation

Fresh sessions with two agents (Claude Code and Codex or Cursor) build a fixed list of console
screens from intent-only prompts; score component choice, block reuse, lint, `doctor`, a11y,
RTL and mobile rendering against v5.11.0. Then run it on every release.

## Stage 13 — Console Kit and design sample audit (future: not started)

Not run yet; it starts only after stages 1 to 12. Two sources feed it, with a fixed precedence:

1. **The design sample first.** `apps/webkit-sample` on the `design/sample` branch of this
   repository (`console/components`, `console/pages`, `shared/ui`, `site/…`) holds the screens and
   pieces the design team refined most recently: application, auth, billing, creation, deployment,
   environment, firewall, form, function, home, list, marketplace, observability, onboarding, SQL
   database, workload and more. When the sample and the console both have a version of something,
   **the sample's design wins**.
2. **Then the Console Kit.** `aziontech/azion-console-kit` (and `aziontech/azion-new-console`) for
   whatever the sample does not have — known candidates: the new Events interface, Rules Engine,
   AI Chat.

For each item found: what it is, where it is used, the WebKit equivalent if any, and whether it
becomes a component, a block or stays product code. What is needed becomes WebKit components and
blocks through stage 3 (for example the SQL database pieces).

Once everything the sample holds lives in WebKit, the sample app's own structure can be removed —
with compatibility guaranteed first: every page the sample renders (console, hub, docs, site
preview) renders the same from WebKit components and blocks (visual diff), nothing on the marketing
or docs surface leaves without a `marketing-inventory.json` record, and every doc that links into
`apps/webkit-sample` (for example `.claude/docs/CONTAINERS.md`) points at the new home.

## Stage 14 — Migrate the marketing site to the new WebKit

Move the site to the new major with the smallest change possible: no re-implementation.

- Run `npx @aziontech/webkit migrate v6` (stage 2 codemod) on the site and apply the
  `renamed` map of `scripts/marketing-inventory.json`.
- Every entry under `removed` that the site still uses becomes a row here (what, where it is used,
  what replaces it) and is built through stage 3 before the site upgrades.
- Check: the site builds, its pages render the same in light, dark and mobile (visual diff against
  the current production), and `marketing:check` is green.

## How to keep it current

When an item closes, delete its row in the same PR. The maintenance rules themselves live in
[CONTRIBUTING.md](./CONTRIBUTING.md), section "What to update when WebKit changes".
