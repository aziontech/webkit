# Code quality, maintainability and extension — technical spec

Roadmap item: "Plan to launch" 1.7. Decision: `DECISIONS.md` CQ-01 to CQ-03 (owner, 2026-11-20).

This spec says **how** every component and block is brought to one code standard before 6.0
merges into `main`. It is general on purpose: it does not list what changes in each component.
The run that executes it measures every component and block (phase 0), and applies the standards
below to whatever the measurement finds.

## 1. Goal and scope

Three goals, in this order:

1. **Code quality.** A reviewer can read any file in one sitting; nothing is written twice.
2. **Maintainability.** A feature lives in one place, has its own test, and can change without
   touching the rest of the component.
3. **Extension.** An app can restyle, recompose or add to a component without forking it, and a
   new feature can be added to a component without growing its root.

In scope: every `.vue` and `.ts` under `packages/ui/src/components`, `src/composables` and
`packages/ui/blocks`. Out of scope: visual design, tokens, naming (already standard), new
components, and the docs site.

Starting point, measured on 2026-11-20 (`feat/webkit-ai-ready`):

| Measure                                              | Value                                    |
| ---------------------------------------------------- | ---------------------------------------- |
| Component `.vue` files                               | 549                                      |
| Component files over 400 lines / over 800 lines      | 42 / 9 (largest: `data-table.vue`, 2175) |
| Component files with a source line over 1500 chars   | 11                                       |
| Components that write the link and button root twice | 6                                        |
| Component files that inspect slot vnodes themselves  | 7                                        |
| Block `.vue` files / total lines                     | 412 / 108,129                            |
| Block files over 400 lines                           | 102 (largest variant: 1846)              |

## 2. How decisions are made (no owner question)

The run decides everything itself. For each open point it reads the same component in shadcn
(`shadcn-ui/ui`, and `shadcn-vue` for the Vue form) and in Cloudscape
(`cloudscape-design/components`), and applies these rules in order. The first rule that settles
the point wins.

1. **Our rules win.** Anything `contributing/rules/*` already fixes is not reopened (naming, styling
   on `data-*`, no external positioning or animation library, `defineModel`, event payloads).
2. **Accessibility: take the stricter reference.** In practice that is usually Cloudscape
   (announcements, disabled reasons, keyboard maps).
3. **Anatomy is composition, data is props.** Where things go follows shadcn (parts the app
   composes). Lists of records follow Cloudscape (data in, the component renders it).
4. **Size holds.** No `.size-limit.json` budget rises for a refactor. A new feature that costs
   bytes goes in a companion part, so apps that do not use it pay nothing. A component that many
   others contain (Button is inside about 90) takes no new import at all, lazy ones included:
   the size check counts a lazy chunk in every component that reaches it. Any byte added to such
   a component raises every budget that contains it, so the raise lines are generated in the
   same lane (the pilot raised 92 budgets by about 0.4 KB each for Button).
5. **Tie: less code.** The option with fewer lines and fewer concepts wins.

Every decision that changes a public API, adds a shared primitive or departs from both references
gets one row in `DECISIONS.md` (`CQ-<n>`), with the two references compared in a sentence. The
only thing that still needs the owner is a push.

6.0 is not released, so a public API may change without a deprecation cycle. Each change still
updates the spec, the examples, `MIGRATION_V6.md` and the `v6*.json` maps in the same lane.

## 3. Standards

### 3.1 File and function size

| Unit                                   | Limit                     |
| -------------------------------------- | ------------------------- |
| Component `.vue` (whole file)          | 400 lines                 |
| `<script setup>` of one `.vue`         | 200 lines                 |
| Composable or `lib/` module            | 300 lines                 |
| Function                               | 60 lines, complexity 12   |
| Source line (class strings included)   | 200 characters            |
| Block page file / block variant file   | 400 lines / 120 lines     |
| Props on one root / models on one root | 20 / 5, see 3.4 when over |

Reference: shadcn's largest component file is under 800 lines, and Cloudscape splits its table
over 72 files. A file over its limit is split, never exempted; the split follows 3.2.

How `check:maintainability` counts:

- **A line counts when it holds code.** Blank lines and lines that hold only a comment (JS, TS
  or HTML) are skipped, as ESLint's `skipBlankLines` and `skipComments` do.
- **A `.vue` file** counts every block, tags included. Its script counts the lines between the
  opening and closing `<script setup>` tags (the plain `<script>` when there is no setup).
- **Functions** are every function in a script, a `.ts` or a `.js` file, measured by ESLint core
  `max-lines-per-function` (blank and comment lines skipped, IIFEs included) and `complexity`
  (classic). Template expressions are not functions.
- **Line length** is the `max-len` rule of `eslint.quality.config.js` (`lint:quality`), reused as
  is.
- **Props** are the members of the type or object given to `defineProps`, with local interfaces,
  their `extends` and intersections resolved; **models** are `defineModel` calls. Both apply to
  every component `.vue` under `src/components`, parts included.
- **Which limit applies:** a `.vue` under `src` or `examples` is a component; a `.vue` in a block
  is a page file, or a variant file under `variants/`; every other `.ts` / `.js` is a module,
  except data (`src/locales`, `.ts` under `src/assets`, `*-data.ts`, `map-chart-countries.ts`,
  a block's `sample.ts`), which has no file limit but whose functions are still measured.
- **Scope:** `src`, `blocks` and `examples`, without tests, test folders, `.figma.ts` and `.d.ts`.

### 3.2 One feature, one module

A component over the limits is split by **feature**, not by line count:

- **Logic** goes to `composables/use-<component>-<feature>.ts` (sorting, selection, filters,
  virtual rows, reorder, tree, keyboard). Each one takes the props slice and models it needs,
  returns refs and functions (`composables.md`), and has its own unit test that runs without
  mounting the component.
- **Markup** that repeats or stands alone goes to a private `parts/<name>.vue`, or to a public
  part when an app could reasonably place it itself.
- **Pure helpers** go to `lib/`.
- The root `.vue` is left as wiring: props, models, the composables it calls, `provide`, and the
  template.

The public API does not change in a split. `check-api-diff.mjs` must report no difference.

### 3.3 Nothing written twice

- **One root per component.** A component that is a link or a button renders one
  `<component :is>` root, as `root-element.md` already says. Two copies of the same template
  under `v-if` / `v-else` are removed.
- **Class strings are grouped.** The root's classes stay inline utilities on `data-*` (no `cva`,
  no class map: our button is about 3 KB against shadcn's 11.3 KB partly because of this). A
  class string over 200 characters is one constant in the script (`ROOT_CLASS`, `ICON_CLASS`),
  written as string literals joined with `+`, one group per line in this order: layout, states
  and focus, one line per variant, one line per size. The build folds it back into one string.
  Not a multi-line `class` in the template: the formatter collapses it, and the comment that
  stops the formatter is rendered into the page in development and breaks server output
  (pilot, CQ-04).
- **A component named after a native tag renders its root through `h`.** `<component :is="'button'">`
  inside `Button` resolves to `Button` itself and never ends; a small functional root that calls
  `h(tag, attrs, slots)` gives the one root instead (pilot, CQ-04).
- **Shared behaviour is a shared composable.** Behaviour found in two or more components
  (listbox keyboard, roving focus, typeahead, dismiss on outside press, item registration, row
  selection) moves to `src/composables/` and both components use it.
- **A clone detector gates it.** Token-based duplicate detection runs over components and blocks;
  the count only goes down.
- **A look-alike check gates what the clone detector cannot see.** Two components that do the same
  job in different text (Button, IconButton and HighlightButton each write their own link-or-button
  root, spinner and inert state) share no clone. `check:look-alikes` scores every pair of exported
  components on props, behaviour, classes, template shape and catalog purpose, and fails a new pair
  at 35% or more where neither imports the other. Phase 0 reads its 28 baseline pairs as part of the
  work list (`node scripts/check-look-alikes.mjs --report`); each pair fixed leaves the baseline.

### 3.4 Growth goes to parts, not to the root

When a root passes 20 props or 5 models, the run does not cut the API to fit. It checks each
feature: if it is slot-shaped or optional, it becomes a companion part that reads the injected
context (`compound-api.md`), and its props leave the root. From then on a new feature on that
component is a companion part or a composable, not a new root prop.

### 3.5 Extension points every component has

shadcn is extended by editing the copied file; Cloudscape hardly at all. Azion UI ships as a
package, so the extension points are part of the contract:

1. The consumer `class` merges onto the root, and wins.
2. Every part of the anatomy carries `data-slot="<part>"`, so an app can style it from outside.
3. Every region an app may want to replace is a slot with the default content inside it.
4. Every public part is importable on its own.
5. `<Component>Props` and each variant union are exported.
6. **New:** every compound component exports its context composable
   (`use<Component>Context`) and its context type, so an app can write its own context-aware part
   (a custom table toolbar button, a custom select item) without a fork. This is what Radix
   allows and Cloudscape does not.

### 3.6 Data in, without reading the slot

No component walks its slot vnodes to learn about its children (seven do today; `Select` learns
option labels this way). Two paths replace it:

- **`options` (or `items`) as data.** Every component that picks from a list takes the list as an
  optional prop and renders it through its own parts. Labels, filtering, lazy loading and virtual
  rows then come from data, as in Cloudscape.
- **One shared item registry** for the composed path: a single tested composable
  (`use-item-registry`) that parts register with. Radix does the same thing in one place. No
  component carries its own copy.

### 3.7 One state contract for anything that shows a list

Select, MultiSelect, Combobox, Command, DropdownMenu, Tree, TransferList, Table and DataTable take
the same state surface, rendered by the component (`component-states.md`):

| State        | Prop                             | Event       |
| ------------ | -------------------------------- | ----------- |
| Loading      | `loading`                        |             |
| Failed       | `error` (the message)            | `retry`     |
| More to load | `moreRows`, `loadingMore`        | `load-more` |
| No data      | `emptyTitle`, `emptyDescription` |             |
| No match     | `noMatch`                        |             |

Cloudscape has this as `statusType` and `onLoadItems`; shadcn leaves it to the app. We take
Cloudscape's coverage with our prop names. The component still fetches nothing.

### 3.8 What a screen reader hears

One shared primitive (`useAnnouncer`, `src/composables/use-announcer`: one polite live region
per page, created on the first message) replaces every hand-made `aria-live` node. A component
announces through it when: loading starts and ends, an action fails, a sort changes, the
selection count changes, a filter changes the result count, the page changes. The message comes
from the i18n catalog where the component already loads it. A component that has no built-in
strings (Button) announces the text the app gives it (`loadingLabel`) and nothing otherwise, as
Cloudscape's `loadingText` does: loading the translation runtime for one word costs 1.1 KB in
every component that holds a button (pilot, CQ-05). Reference: Cloudscape's internal live
region; shadcn has none.

### 3.9 Disabled with a reason

Every action control (Button, IconButton, SplitButton, menu and toolbar items) takes
`disabledReason`. When set on a disabled control, it stays focusable (`aria-disabled`, not
`disabled`) and carries the reason as its description. A control that already depends on
`Tooltip` (IconButton) shows the reason there. A control that does not (Button) puts it in
`title`: the browser shows it on hover and assistive technology reads it. It never imports
`Tooltip` for this, not even on demand: in the pilot that put the Tooltip in the bundle of 97
other components (Alert measured 12.3 KB instead of 5.75 KB) and moved 34 KB of `FilterMenu`
from a lazy chunk to its first load (CQ-06). An app that wants the styled bubble wraps the
button in `Tooltip`, which now opens on focus too. Reference: Cloudscape; shadcn has no
equivalent.

### 3.10 Native elements first

A component uses the native element when one exists. `Table` and `DataTable` move from
`div role="table"` to `table`, `thead`, `tbody`, `tr`, `th`, `td`, as both references do; virtual
rows use spacer rows. `DataGrid` keeps `role="grid"`. The phase-0 report lists every other ARIA
role standing in for a native element.

### 3.11 Types

No `any` (already gated). The run also counts type assertions (`as`) in components and
composables, removes the ones that hide a real mismatch (`as never`, `as unknown as`), and the
count only goes down.

### 3.12 Blocks

Blocks are what an agent copies, so the same goals apply to them:

- **A block is a folder, not one file:** the page file (wiring and layout), `parts/` for its
  regions, `use-<block>.ts` for its logic, `sample.ts` for its data. `azion-ui add` copies the
  folder. shadcn's blocks have the same shape.
- **A variant is a state, not a copy.** A variant file imports the block and passes props and
  sample data. It never repeats the block's template. Today the largest variants are 1,800-line
  near-copies of their block.
- **What three blocks repeat becomes a component** in `src/components`, with spec, test and
  examples (the existing "Repeated fragments" decision).
- The size limits of 3.1 and the clone detector of 3.3 apply.

## 4. Gates added

Each is one script in `packages/ui/scripts`, a gate in `run-gates.mjs` and a step of the
`toolkit` job, with no baseline (decision CQ-E: until 6.0 merges into `main` everything counts as
new, so a check starts from an empty list and the code is fixed).

| Gate                      | Checks                                                                                                     | State            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------- |
| `check:maintainability`   | Every limit in 3.1 (lines, function length, complexity, line length, props, models)                        | gate and CI step |
| `check:duplication`       | Cloned code in components and in one block; logic two blocks copy                                          | gate and CI step |
| `check:look-alikes`       | Components that do the same job and neither uses the other; a shared private part counts as reuse          | gate and CI step |
| `check:extension`         | 3.5: `data-slot` on parts, exported props types, exported context                                          | planned          |
| `check:slot-reading`      | 3.6: no `isVNode` or slot walking outside the shared registry                                              | planned          |
| `check:assertions`        | 3.11: no `as never` or `as unknown as` (only `undefined as never` for an unbound model), assertion count   | gate and CI step |
| `check:blocks` (extended) | 3.12: variant size, variant imports its block, no repeated template; the consumer lint on every local file | gate and CI step |
| `check:unused` (root)     | No unused file, export or dependency (knip)                                                                | gate and CI step |

Rule files change in the same lanes: `component-structure.md` (limits, the split by feature),
`styling.md` (grouped class lines), `composables.md` (feature composables), `compound-api.md`
(exported context), `component-states.md` (list state contract), `accessibility.md` (announcer,
disabled reason), `prop-vocabulary.md` (`disabledReason`, `options`, `moreRows`), and a new block
rule for 3.12.

## 5. How the run goes

| Phase | What                                                                                                                                                             | Runs                    |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 0     | **Measure.** A script scores every component and block against section 3 and writes one JSON and one page. This is the work list; nothing is fixed by hand list. | One agent               |
| 1     | **Foundations.** The gates of section 4 with their baselines, the shared primitives (`use-announcer`, `use-item-registry`), the rule edits.                      | One agent, alone        |
| 2     | **Internal refactor.** Sections 3.1 to 3.3 and 3.11, no public API change. One lane per category folder; the nine largest components get a lane each.            | Parallel                |
| 3     | **API work.** Sections 3.4 to 3.10: spec first (version bump, `spec-reviewer`), then code, test, examples, migration map.                                        | Parallel, after phase 2 |
| 4     | **Blocks.** Section 3.12, one lane per block group.                                                                                                              | Parallel, after phase 3 |
| 5     | **Verify.** Full gates, browser suite on three engines, visual suite, size and performance budgets, then the phase-0 script again.                               | One agent               |

Order inside each phase: worst score first.

## 6. What "done" means

For a refactor lane (phase 2), all of these hold:

- `check-api-diff.mjs` reports no public change.
- The component's existing tests pass **unchanged**. A test edit in a refactor lane is a finding.
- No size budget rose, no `perf-budgets.json` scenario got slower, and the visual suite shows no
  pixel change.
- Each extracted composable has its own test.

For the whole item:

- Every baseline of section 4 is empty, or each remaining entry has a `CQ-<n>` decision that
  says why.
- No component or block file is over its limit.
- The phase-0 page, run again, shows every component and block passing.
- Full gates, the browser suite and the visual suite are green on the final head.

## 7. What the earlier comparison found, and where it is fixed

| Finding (Button, Select, Table against shadcn and Cloudscape) | Section    |
| ------------------------------------------------------------- | ---------- |
| Button writes its template twice                              | 3.3        |
| Button's styles are one 5,000-character line                  | 3.3        |
| Select reads slot vnodes to learn labels                      | 3.6        |
| Select has no loading, error or load-more state               | 3.7        |
| DataTable is one 2,175-line file, 31 props, 11 models         | 3.1 to 3.4 |
| No screen-reader announcement for loading, sort, selection    | 3.8        |
| No "why is this disabled"                                     | 3.9        |
| Table is built from `div`s with roles                         | 3.10       |

Inline cell editing, multi-column sort and grouped column headers are new features, not code
quality. They are not part of this item; after it, each is a companion part or a composable
(3.4), which is what makes them cheap to add.
