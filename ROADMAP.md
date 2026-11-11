# Roadmap — WebKit on par with Cloudscape and shadcn, built and maintained by AI

Benchmarks: [Cloudscape](https://cloudscape.design) (AWS) for coverage — components, patterns with
guidelines, runnable demos — and [shadcn/ui](https://ui.shadcn.com) (Vercel) for distribution —
real source files in a registry, a CLI that copies screens, examples as files. WebKit already leads
both on AI tooling (catalog, MCP, skills, rules, lint, `doctor`); the gaps are content and structure.

Updated 2026-11-10. The work is split in two milestones, each numbered in order. **Milestone 1**
makes WebKit itself complete (one source of truth, v6 hygiene, languages, devices, performance,
guidelines, collections) and ends with one full test pass. **Milestone 2**
adds the distribution and the rest (CLI, docs, demos, evaluation, site migration, and completing
the component catalog with the patterns and components from the design sample) and ends by merging into `main`. The project is fully specified: no
approval step sits between items.

## How the work runs

- **Tests.** During the items only the fast checks run (lint, type-check, compiling every copyable
  SFC, catalog, toolkit tests: one to two minutes). The browser suite, visual, accessibility, RTL and
  mobile checks run once, in M1.10, and are fixed there.
- **Parallel agents.** M1.1 and M1.2 run first and alone, because they touch every file. Then
  M1.4–M1.7 (one agent per area), M1.8 and M1.9 run in parallel branches, and are integrated before
  M1.10. In M2.9 the missing components split by component, one agent each. In Milestone 2, M2.1–M2.3 and M2.4 run in
  parallel; M2.5 waits for M2.3.

## Decisions already taken

| Topic              | Decision                                                                                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Naming             | shadcn/Radix vocabulary (`pagination`, `tabs`, `card`, `alert`, `radio-group`…), the names models know best.                                                          |
| Breaking changes   | One direct major (v6) with a migration guide and a codemod; no aliases.                                                                                               |
| Screens (blocks)   | One canonical block per screen; states are props or example data, not numbered copies.                                                                                |
| Repeated fragments | Promoted to exported components (page header, section header, setting row, save bar, confirm dialog).                                                                 |
| Form fields        | One `Field` wrapper around any control replaces the `field-*` family.                                                                                                 |
| Pattern guidelines | Cloudscape depth: purpose, when / when not, building blocks, do / don't, copy, accessibility.                                                                         |
| Collections        | `useCollection` for client and server data, filters in the URL, saved preferences.                                                                                    |
| Charts             | Our own chart family (started: `Chart`, `BarList`, `DonutChart`, `SparkChart`, `StatTile`, `Tracker`).                                                                |
| Languages          | Built-in messages in en and pt-BR, right-to-left supported.                                                                                                           |
| Missing components | Completed in M2.9 from three sources, in order: the design sample (its design wins), then the Console Kit, then Cloudscape's list. Generative-AI components are M2.4. |
| Storybook          | Replaced by our own docs site that renders the real files and publishes `llms.txt`.                                                                                   |
| CLI                | New `add`, `diff`, `search` / `view` and `check`.                                                                                                                     |
| Who builds         | AI agents, in parallel where possible (see above). AI evaluation of screens runs in M2.7.                                                                             |
| Who decides        | Nobody in this project: it is fully specified and merges into `main` at the end (M2.10). For components made after it, the M1.3 flow applies.                         |
| Development area   | Material for developing WebKit lives in `.claude/` (and `.specs/`); only `skills/`, `rules/`, `adapters/` and the packages ship.                                      |
| Surfaces           | Every export is `product`, `marketing` or `docs`; nothing on the marketing or docs surface may disappear unrecorded.                                                  |

## Done since the merge review

| What                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Where        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Development area: `ui-craft` moved to `.claude/skills/ui-craft` (mandatory review for every new or changed component, example and block); process docs moved to `.claude/docs/` and out of the npm package; root `AGENTS.md`/`CLAUDE.md` for contributors of any agent; `test/standards/ai-bundle-boundary` keeps the two areas apart. `webkit-usage` is now the consumer entry point.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `0eb23f3a`   |
| Surfaces: `surface` on every catalog export; `list_components` filters by it; `suggest_component` ranks product components first outside marketing requests; `scripts/marketing-inventory.json` (468 items) and `marketing:check` block any marketing or docs item from leaving unrecorded.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `ef745ec5`   |
| M1.1 done: screens in `packages/webkit/blocks/` (75 blocks, 137 states, `block.json`) and examples in `packages/webkit/examples/` (681 component examples, 72 site examples with README); catalog, MCP and 95 component tests read the files, not Storybook (catalog build 0.35 s, identical output); Storybook stories for blocks and site sections are generated (`apps/storybook/scripts/gen-block-stories.mjs`); every copyable SFC mounts in the browser (`src/test/copyable-sfcs.test.ts`; 30 broken examples fixed); login is the auth block's primary state with `autocomplete="username"`; Rubik replaces Sora everywhere; a colleague's name replaced by a fictional one.                                                                                                                                                                                                                                                                                                                                                                                    | M1.1 commit  |
| M1.2 done (v6): 14 components renamed to the shadcn/Radix vocabulary; one `Field` compound replaces the 15 `field-*` components (plus `PhoneInput`, `PasswordRequirements`, `InputGroup.Input`); 7 page fragments promoted to components (`PageHeader`, `SectionHeader`, `PageTabs`, `SettingsSection`, `SettingRow`, `SaveBar`, `ConfirmDialog`); 69 → 60 blocks, merged by job and grouped by task (`create`, `view`, `detail`, `edit`, `delete`, `settings`, `states`, `dashboard`) with old ids still served by `get_pattern`; prop vocabulary applied to 17 components and enforced by the hook; `naming:check` in CI and catalog `aliases` (market and retired names); `npx @aziontech/webkit migrate v6` codemod (idempotent) and `MIGRATION-v6.md`; housekeeping (pagination ellipsis inert, overline token and hidden prefix, legacy flat folders moved, `cli-templates/` removed, card-brand hex gone, address autofill).                                                                                                                                    | M1.2 commits |
| M1.6 done (devices): breakpoint contract in `@aziontech/theme` (viewport breakpoints for the shell, the `--container-*` scale for container queries; `test/device-contract.test.mjs`); 15 box-aware components (`Table` and its toolbar, `PageHeader`, `SectionHeader`, `SettingRow`, `SettingsSection`, `SaveBar`, `Card`, `Alert`, `EmptyState`, `Pagination`, `Wizard`, `HelpPanel`, `ChartCard`, `StatTile`, the dialog and drawer body) plus `KeyValuePairs` sized by its own width and `Field orientation="responsive"` following any container; `Table` stacks rows into label/value cards below `--container-lg` (`stackable`); dialogs and drawers are full-height sheets below `sm` with pinned, full-width footer actions; 24 px hit areas (44 px on `pointer: coarse`) on buttons, icon buttons, checkboxes, radios, switches and pagination; no hover-only affordances; `src/test/reflow.test.ts` mounts every block and example in a 320 px and a 1280 px box with the theme compiled and asserts no horizontal overflow (1,824 cases, empty allowlist). |

## Review of the merge (2026-11-10)

What landed: 15 components (Wizard, Stepper, HelpPanel, KeyValuePairs, Tree, Slider, FieldTime,
FileDropzone, FieldFileUpload, SeverityTag and the 7-piece chart family), each with spec, test,
story, export and a size-limit budget; chart and severity color roles in the theme; 75 patterns
(from 60) with Cloudscape-style names, en + pt-BR intents and state variants; the patterns lint
baseline down from 39 patterns to 3.

What the merge did not change, and where it is handled:

| Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Item          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Patterns still live in Storybook: 119 template stories, 120 files build the SFC as text with `toSfc`, 0 real `.vue` blocks. `build-catalog.mjs` also boots the story server (`withStoryServer`) to extract component examples. Removing Storybook breaks both.                                                                                                                                                                                                                                                                                                                                                                                                                      | M1.1          |
| Fragments are still patterns: `page/page-header`, `page/section-header`, `page/page-tabs`, `page/settings-section`, `forms/setting-row`, `overlays/confirm-dialog`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | M1.2          |
| Overlaps: `confirm-dialog` × `delete-with-confirmation`; `form-in-drawer` × `create-in-drawer` × `nested-drawer` × `deploy-drawer` × `deployment-settings-drawer`; `save-per-card` × `save-per-group` × `save-all-groups`; `details-page` × `details-page-with-tabs`. Done: `ConfirmDialog` is a component; the drawer forms are `create/create-in-drawer` (`deploy-drawer` stays: deploying is its own job); the save strategies are `settings/settings-form`; the details pages are `detail/details-page`; `form-in-modal` joined `delete/delete-with-confirmation`, `server-validation` joined `states/form-validation` and `sectioned-form` joined `create/single-page-create`. | M1.2 2.5 done |
| Misplaced categories: `shell/` holds pages (`details-page-with-tabs`, `single-page-create`, `multipage-create`, `split-view`, `home-dashboard`) while `creation/` and `detail/` exist. Done: product blocks are grouped by task (`auth`, `account`, `create`, `view`, `detail`, `edit`, `delete`, `dashboard`, `settings`, `states`); every old id resolves through `src/cli/migrations/v6-blocks.json` (`catalog.json#patternAliases`, `get_pattern`).                                                                                                                                                                                                                             | M1.2 2.5 done |
| Two new `field-*` components (`field-time`, `field-file-upload`) extend the family the single `Field` replaces.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | M1.2          |
| Built-in English strings (e.g. `paginator` `aria-label="Previous page"`), no locale layer.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | M1.4          |
| 162 physical direction utilities (`ml-`, `pr-`, `left-`, `text-right`…) against 79 logical ones; no `dir` handling.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | M1.5          |
| Components adapt to the viewport (`sm:`/`md:`/`lg:` ~440 uses) but only 4 files use container queries, so a component inside a drawer or split view lays out for the window, not its box. Done: the components that live in panels are containers (M1.6).                                                                                                                                                                                                                                                                                                                                                                                                                           | M1.6          |
| `catalog.json` is now 7.5 MB (was 4.3 MB); the ESLint plugin and the MCP parse it whole.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | M1.7          |

# Milestone 1 — WebKit complete

## M1.1 — Source of truth out of Storybook

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

Also here: the sans-serif becomes **Rubik** everywhere (theme tokens, `@font-face`, Storybook, `apps/fonts`); Sora is removed.

Exit: on a throwaway branch, delete `apps/storybook`; `catalog:build`, the package tests and
`get_pattern("platform/auth")` still pass and return the same SFC.

## M1.2 — Hygiene and the v6 major

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

**Status: done on the branch.** Still open from it: the release itself (with M2.10); running the codemod
on a copy of the console (needs the console repository, M2.9); `.claude/docs/COMPONENT_REQUIREMENTS.md`
still shows `kind="text"` and `field-*` examples (the file is marked do-not-edit without approval); the
hook test suite `.claude/hooks/__tests__/run.mjs` keeps its 2 failures from `main` (M2.10); exported type
names such as `SeverityTagLevel` keep their v5 names; the `PhoneInput` flag data (~105 KB gzipped) has no
size budget (M1.7).

## M1.3 — AI-only implementation flow

This project itself runs without approvals; this flow is how components are made **after** it.

Everything built after this project goes through it. The flow makes a correct component the only path
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

Also in this item: the spec template gains `Internationalization`, `Right-to-left`, `Responsive`
and `Performance` sections; a block flow (`/webkit-new-block`) mirrors the component one; changes to
existing components go through the same gates plus a changeset that feeds the codemod.

Exit: one new component and one new block delivered by the flow with no human edits, opened and
approved by the head of design.

## M1.4 — Languages

`WebkitProvider` with `locale`; message catalogs for every built-in string (en, pt-BR; es next for LatAm); `Intl` for dates, numbers, currency, relative time and plurals; no built-in string outside a catalog (lint).

Exit: every built-in string comes from a catalog in en and pt-BR (lint), and dates, numbers and plurals go through `Intl`.

## M1.5 — Right-to-left

`dir` on the provider; logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`) enforced by lint; mirrored icons list (arrows, chevrons) vs. non-mirrored (play, logos, code); `<bdi>`/`dir="auto"` around user data (domains, IDs, code) inside RTL text; Arabic-capable font stack and line heights in the theme; RTL visual tests.

Exit: no physical direction utility left (lint); every component renders mirrored under `dir="rtl"`.

## M1.6 — Devices

Breakpoint contract in the theme; container queries for components that live in drawers, split views and cards; mobile behaviors (table → stacked rows or cards, drawer and dialog as full-height sheets, sticky actions); touch targets ≥ 24 px (44 px on coarse pointers); `pointer: coarse` and `hover: none`; ultra-wide max widths; reflow at 320 px and 200% zoom (WCAG 1.4.10, 1.4.12).

Exit: components that live in panels use container queries; touch targets and reflow rules hold at 320, 768, 1280, 1920 and 2560 px.

## M1.7 — Performance

Keep size-limit per component; add runtime budgets in Playwright (Table 1k / 10k rows with virtualization, Chart with 10k points, Tree with 5k nodes, Select with 1k options) and interaction latency; lazy loading for heavy parts (code editor, charts); SSR and hydration with Nuxt (builds on #1171); catalog split into per-pattern files and lazy loading in the MCP and lint.

Also: the catalog splits into per-pattern files loaded lazily by the MCP and the lint (it is 7.5 MB).

## M1.8 — Pattern guidelines

`guidelines.md` next to every block, Cloudscape depth: purpose, when to use / not, building blocks
(A, B, C… matching the SFC), do / don't, copy for each element, accessibility, related blocks.
`get_pattern` returns it with the SFC. Agents draft from the code; the M1.3 reviewer agent checks
them against the SFC.

## M1.9 — `useCollection` and collection components

`useCollection` (client and server modes, filter / sort / paginate / select, empty and no-match
states, filters in the URL, saved preferences) plus the components that depend on its API:
property filter, collection preferences, cards collection. Table and the `table-view` block move to it.

## M1.10 — Full test pass

The only full run of the slow suites, after M1.1–M1.9 are integrated: the browser suite (5,400+
tests), the copyable-SFC test (every block and example mounts), visual tests, axe, RTL and locale
snapshots, the five viewports, runtime budgets, and the browser matrix (last 2 Chrome, Edge,
Firefox, Safari, iOS Safari, Android Chrome) with the public-API report. Every failure is fixed here.

Exit: all suites green on the integrated branch.

# Milestone 2 — Distribution, migration and audits

## M2.1 — CLI

`add <block>` (copies the block, resolves imports, suggests the route), `diff <block>` (local copy vs. canonical), `search` / `view` (MCP queries in the terminal), `check` (`doctor` + `report` as one CI gate).

## M2.2 — `llms.txt` and Markdown pages

`llms.txt` plus one `.md` per component, block and foundation page, and `.json` APIs, generated from the catalog — for agents without the MCP.

## M2.3 — Docs site

Our own docs site that renders `examples/` and `blocks/` with the code beside, foundations included. Replaces Storybook for people.

## M2.4 — Generative-AI components

Chat, prompt input, streaming response, thinking and loading states, citations, follow-up
questions, user-authorized actions, artifact previews — with blocks and guidelines, benchmarked on
Cloudscape's generative-AI section and shadcn's AI Elements.

## M2.5 — Demos and the end of Storybook

`apps/demos`: routed Vue apps with mock data for full flows (list → create → detail → edit →
delete, settings, onboarding), assembled with `webkit add`. Visual tests move to Playwright over
`examples/`, `blocks/` and demos. Storybook is removed.

Needs M2.3.

## M2.6 — Search quality

Tune pattern and component search (synonyms en / pt-BR, ranking) with a fixed query set and an
expected-result table run in CI; today "onboarding" and "upgrade plan" rank the wrong block first.

## M2.7 — Final AI evaluation

Fresh sessions with two agents (Claude Code and Codex or Cursor) build a fixed list of console
screens from intent-only prompts; score component choice, block reuse, lint, `doctor`, a11y,
RTL and mobile rendering against v5.11.0. Then run it on every release.

## M2.8 — Migrate the marketing site to the new WebKit

Move the site to the new major with the smallest change possible: no re-implementation.

- Run `npx @aziontech/webkit migrate v6` (M1.2 codemod) on the site and apply the
  `renamed` map of `scripts/marketing-inventory.json`.
- Every entry under `removed` that the site still uses becomes a row here (what, where it is used,
  what replaces it) and is built through M1.3 before the site upgrades.
- Check: the site builds, its pages render the same in light, dark and mobile (visual diff against
  the current production), and `marketing:check` is green.

## M2.9 — Complete the component catalog and its patterns: design sample, Console Kit, Cloudscape; accessibility end to end

One goal: every component, screen and pattern the products need lives in WebKit. Three sources, in this
order, and the order decides every conflict:

1. **The design sample first — its design always wins.** `apps/webkit-sample` on the
   `design/sample` branch of this repository (`console/components`, `console/pages`, `shared/ui`,
   `site/…`) holds what the design team refined most recently: application, auth, billing,
   creation, deployment, environment, firewall, form, function, home, list, marketplace,
   observability, onboarding, SQL database, workload and more.
   - **Prefer the sample over the console.** When the sample and the Console Kit both have a version
     of something, take the sample's design, never the console's.
   - **Bring in what the sample already has.** Anything the sample has and WebKit lacks becomes a
     WebKit component or block taken from the sample (for example the SQL database pieces), not
     redesigned from scratch.
2. **Then the Console Kit — only for what the sample does not have.** `aziontech/azion-console-kit`
   (and `aziontech/azion-new-console`); known candidates: the new Events interface, Rules Engine,
   AI Chat.
3. **Then Cloudscape's list — only for what neither has.** Still missing after the merge, among
   others: property filter and collection preferences (M1.9), app layout with tools / help / split
   panel / notifications regions, attribute editor and tag editor as components (today blocks),
   button group, file token group, tutorial panel and hotspot, board (configurable dashboard as a
   component), error boundary, and the remaining chart types (area, line, mixed, scatter) on top of
   the started family.

For each item: what it is, where it is used, which source it comes from, the WebKit equivalent if
any, and whether it becomes a component, a block or stays product code. Every new piece goes
through the M1.3 flow, one agent per component.

**Patterns taken from the sample first: form errors and async actions.** Two screens of the
sample become WebKit blocks and the documented standard before anything else in this item:

- **Form errors** (`/forms/error-validation`): a server rejection scoped to a section shows one
  danger `Message` above that section, saying what happened and that nothing else was lost, with
  the recovery action on it (for example _Reload connectors_); the field it concerns turns invalid
  with its own one-line reason under it. Becomes the form-error block and the rule in the
  `webkit-errors` and `webkit-form` skills.
- **Async actions** (`/forms/async-deployment`): a long action (build, deploy, any command that runs
  on its own) starts, frees the user, and reports back wherever they are, both on success and on
  failure; the page shows the status tag and the outcome `Message`. The toast that reports it
  always carries two actions: **Edit** for the item it is about and **Redeploy** (never _View
  deployments_). Becomes a block, a skill section (`webkit-ui-states`, `webkit-errors`) and the
  catalog guidance for every build and deploy screen.

Once everything the sample holds lives in WebKit, the sample app's own structure can be removed —
with compatibility guaranteed first: every page the sample renders (console, hub, docs, site
preview) renders the same from WebKit components and blocks (visual diff), nothing on the marketing
or docs surface leaves without a `marketing-inventory.json` record, and every doc that links into
`apps/webkit-sample` (for example `.claude/docs/CONTAINERS.md`) points at the new home.

**Accessibility, end to end.** Every accessibility item (WCAG 2.1 AA, keyboard maps, focus
management in overlays, live-region announcements, reduced motion, forced colors, contrast in both
themes) is implemented and proven by tests that run on every PR, not once. Start from the open PR
that already fixes axe findings (#1169) and extend it until axe, keyboard and screen-reader checks
cover every component, block and example.

## M2.10 — Close the branch and merge into `main`

| #   | Item                         | Detail                                                                                                                                                                                                                                                                                                                                                                             |
| --- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.0 | CI is red on `f9562602`      | Stylelint: `spark-chart.vue:159` (`custom-property-empty-line-before`). Toolkit: `test/mcp/queries.test.mjs:314` still expects `platform/auth/sign-in`, but the merge folded the three auth patterns into `platform/auth`. Because both fail, the Vitest browser shards and the Storybook visual tests were skipped, so the 15 new components have not run in a browser in CI yet. |
| 0.1 | Overlap with per-ticket PRs  | #1162 (ENG-50004), #1163 (ENG-50006), #1164 (ENG-50005) and #1165 (ENG-50007) are still open for the same tickets. Close them in favor of this branch, or merge them first and rebase.                                                                                                                                                                                             |
| 0.2 | Signed commits               | CONTRIBUTING asks for signed commits. Re-sign (`git rebase --exec 'git commit --amend --no-edit -S' origin/main`) or let the squash merge sign it.                                                                                                                                                                                                                                 |
| 0.3 | Visual baselines             | New story ids and fictional names change the snapshots. Run `pnpm storybook:test:visual:update:baseline`.                                                                                                                                                                                                                                                                          |
| 0.4 | Address autofill             | WebKit now hides fields without `autocomplete` from password managers. Account Settings address fields should set `postal-code`, `address-line1`, `address-line2`; check with the real 1Password extension.                                                                                                                                                                        |
| 0.5 | Card-brand hex               | Three account patterns keep 5 `no-hardcoded-color` findings (card-brand plate). Swap for a token or asset, then `patterns:check --update`.                                                                                                                                                                                                                                         |
| 0.6 | Hook tests failing on `main` | `node .claude/hooks/__tests__/run.mjs`: "legacy button is whitelisted" and "new component without spec blocks". Fix and run them in CI — M1.3 relies on these hooks.                                                                                                                                                                                                               |

Visual baselines (0.3) are taken on the new model (Playwright over `examples/` and `blocks/`, M2.5),
not on Storybook. Re-check every row against the code before running this item.

Before the merge the full suites run again (as in M1.10), so everything Milestone 2 added — the
M2.9 components above all — is covered.

Exit: merged into `main` and released.

## How to keep it current

When an item closes, delete its row in the same PR. The maintenance rules themselves live in
[CONTRIBUTING.md](./CONTRIBUTING.md), section "What to update when WebKit changes".
