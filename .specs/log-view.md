---
name: log-view
category: code
structure: composition
status: implemented
spec_version: 8
template: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3950-34695
  node_id: 3950:34695
checksum: b9c05a803221bb4f17466e628615f316f3b89e7969d0518cc8c385d4dc192200
created: 2026-05-26
last_updated: 2026-11-15
---

# Log View — Component Spec

## Purpose

Composition-based terminal log viewer for CI/deploy output. **LogView** is the root shell and context provider; **`LogView.Header`**, **`LogView.Content`**, and **`LogView.Footer`** are composed as children so teams can reorder, omit, or replace the toolbar and footer without forking the log renderer. **`LogView.Steps`** shows a run with known steps (build, deploy, provisioning) as a pipeline: one collapsible step per phase, each with its own log, a Phased or Complete switch and an optional flush progress bar.

Use LogView for build, deploy or runtime log lines, and LogView.Steps when the run has named steps; for code the person reads or copies use CodeBlock, and for code the person edits use CodeEditor.

## When to use

- Showing build, deploy or CI output as timestamped lines the reader can search, filter to warnings, and copy.
- A log shell whose toolbar and footer vary by screen — compose `LogViewHeader`, `LogViewContent` and `LogViewFooter` in the order you need, or drop the ones you don't.
- A run log with levels (`debug`, `info`, `warn`, `error`), such as what a function printed during a test run: set `level` on each line and `levels` on the root, and the header filters by level with a count per level.
- A log that is still loading from the server — set `loading` to show a spinner and `loading-label` in place of the body.
- A build or deploy run with known steps → `LogView.Steps` with one entry per step; every deploy-log block composes it instead of rebuilding the pipeline.

## When NOT to use

- Static, read-only code or configuration snippets → use `code-block`.
- An animated terminal session on a marketing page → use `cli-terminal`.
- Rows of structured records with columns, sorting or paging → use `table`.

## Related

- `code-block` — highlighted source code with a copy action, not a stream of typed log lines.
- `cli-terminal` — marketing band that plays a scripted terminal session.
- `deploy-success` — the post-deploy screen that embeds `log-view` for the build log.

## Best practices

- Give every line a stable `id` and a `type` (`text`, `folder`, `framework-version`, `success`); the type drives the line's rendering. A warning is a `text` line with `level: 'warn'`; `level` drives the warnings filter and the level toggles.
- For a run log, give each line a `level` and put the run offset (`120 ms`, `1.24 s`) in `time`; pass the levels the run can print as `levels` so every level is offered even when it has no line yet. Bind `v-model:level` when the app needs the chosen level.
- Bind `v-model:search` and `v-model:level` when the app needs the filter state; otherwise leave them unbound and the header manages them.
- Set `:bordered="false"` when the log sits inside a surface that already frames it (an accordion panel, a drawer).
- The copy control hides while `disabled` or `loading`, or when there is nothing to copy; listen to `@copy` for the copied text instead of reading the clipboard.
- Use the header's `left` / `right` / `search` slots and the footer's default slot to add actions, rather than rebuilding the toolbar.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import LogView from '@aziontech/webkit/log-view'

  const lines = [
    {
      id: '1',
      time: '13:47:33',
      type: 'text',
      level: 'info',
      message: 'Deploy started successfully!'
    },
    { id: '2', time: '13:47:41', type: 'success', level: 'info', message: 'Build finished' },
    {
      id: '3',
      time: '13:47:42',
      type: 'text',
      level: 'warn',
      message: 'Bundle larger than recommended'
    }
  ]
  const search = ref('')
  const level = ref('')
</script>

<template>
  <LogView
    :lines="lines"
    :levels="['info', 'warn']"
    v-model:search="search"
    v-model:level="level"
  >
    <LogView.Header />
    <LogView.Content />
  </LogView>
</template>
```

`@aziontech/webkit/log-view` is the compound (the root with `Header`, `Content`, `Footer` and `Steps` attached). For tree-shaking, import the root alone from `@aziontech/webkit/log-view-root` and each part from `@aziontech/webkit/log-view-header`, `log-view-content`, `log-view-footer` and `log-view-steps`.

```vue
<script setup>
  import LogView from '@aziontech/webkit/log-view'

  const steps = [
    { key: 'build', title: 'Build', status: 'done', duration: '9s', lines: buildLines },
    { key: 'publish', title: 'Publish', status: 'running', lines: publishLines }
  ]
</script>

<template>
  <LogView.Steps
    :steps="steps"
    progress
  >
    <template #header>Deployment logs</template>
  </LogView.Steps>
</template>
```

## Sub-components

LogView ships its sub-components attached to the root (`LogView.Header`, `LogView.Content`, `LogView.Footer`, `LogView.Steps`, via `index.ts`) and individually importable (each from its own `@aziontech/webkit/log-view-*` entry); every sub-component reads the root's shared state through the injected context, so the consumer wires nothing.

- `log-view-header.vue` (`LogView.Header`) — Default 48px toolbar: line count, warning filter (a native button that toggles `level` between `warn` and every level, 32 px, 44 px on coarse pointers), the level filter (one toggle per entry of `levels`, with its line count) and a search field. Slots: `left`, `right`, `search`.
- `log-view-content.vue` (`LogView.Content`) — Scrollable log body with per-`type` line rendering, search highlighting, `ScrollArea`'s `fade` on the log body (the edges that still have lines beyond them fade out), and the copy-to-clipboard control (a `CopyButton` pinned top-right over the log content, shown when `copyable` is set). When `loading` is set, it replaces the log body with a centered `Spinner` (`@aziontech/webkit/spinner`) and the `loadingLabel` text (`role="status"`). When `error` is set, it replaces the body with a danger `Alert` holding the message. With no line to show, it renders the package `EmptyState` (small): "No log lines yet." for an empty log, "No line matches “query”" with a Clear search action for a search with no result, and "No log lines match the current filters." for a level or warnings filter with no result. Slot: `empty` (replaces the EmptyState).
- `log-view-footer.vue` (`LogView.Footer`) — Optional footer region for actions (download, follow live, pagination). Slot: `default`.
- `log-view-steps.vue` (`LogView.Steps`) — A run with known steps, standalone (it renders its own `LogView` per step and needs no parent `LogView`). An optional toolbar row (`__toolbar`, shown when the `header` slot is filled or `viewSwitch` is on) holds the `header` slot at the start and, with `viewSwitch`, a `ToggleGroup` (`__view-switch`, named `Log view`) switching **Phased** and **Complete** at the end. Phased renders an `Accordion` (`type="single"`, collapsible) with one item per step (`__step`, `data-status`): the trigger shows the status glyph (done: a success check; failed: a danger cross; skipped: a muted minus; running: a `Spinner`; pending: a dashed circle), the status in words for assistive technology (`sr-only`), the title, the `step-meta` slot, the description (danger text when failed, a shimmer while running) and the duration; the panel holds a borderless `LogView` + `LogView.Content` over the step's lines, loading with `Waiting to start…` while the step is pending, and the `step-empty` slot in place of the empty state (a skipped step defaults to `Never ran.`). Complete renders every step's lines as one borderless `LogView` (`__complete`; line ids are prefixed with the step key). With `progress`, a flush, small, flat `Progress` (`__progress`, named `Run progress`) sits on the bottom edge; its value is the share of steps done. Props: `steps?: LogViewStep[]` (default `[]`), `copyable?: boolean` (default `true`, forwarded to each log), `viewSwitch?: boolean` (default `true`), `progress?: boolean` (default `false`). Models: `v-model:view` (`LogViewStepsView` = `'phased' | 'complete'`, default `'phased'`), `v-model:open-step` (`string`, the key of the open step; unbound, the running step opens, else the failed one, else none). Slots: `header`, `step-meta({ step })`, `step-empty({ step })`. Test ids: `code-log-view__steps` (a consumer `data-testid` wins) and `__toolbar`, `__view-switch`, `__step`, `__complete`, `__progress` under it.

## Props

| Prop                | Type                 | Default | Required | JSDoc                                                                                                                                                                                                                                                               |
| ------------------- | -------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lines`             | `LogViewLine[]`      | `[]`    | false    | Log entries; filtered in LogViewContent by search and level.                                                                                                                                                                                                   |
| `bordered`          | `boolean`            | `true`  | false    | Draw the outer card border and corner radius around the log shell. On by default; set `:bordered="false"` to render the shell flush inside a surface that already frames it (an accordion panel, a drawer). Internal dividers (header/footer edges) are unaffected. |
| `searchPlaceholder` | `string`             | `''`    | false    | Placeholder for the default header search field. Empty uses the locale catalog (`Find in logs`).                                                                                                                                                                    |
| `copyable`          | `boolean`            | `true`  | false    | Shows the copy-to-clipboard control (a CopyButton pinned top-right over the log content in LogViewContent).                                                                                                                                                         |
| `disabled`          | `boolean`            | `false` | false    | Disables toolbar controls in LogViewHeader.                                                                                                                                                                                                                         |
| `loading`           | `boolean`            | `false` | false    | Replaces the LogViewContent log body with a centered spinner and label.                                                                                                                                                                                             |
| `loadingLabel`      | `string`             | `''`    | false    | Label shown beneath the spinner while `loading`. Empty uses the locale catalog (`Loading…`).                                                                                                                                                                        |
| `levels`            | `LogViewLineLevel[]` | `[]`    | false    | Levels the header offers as filter toggles, each with its line count; a level with no line is still offered. Empty hides the level filter.                                                                                                                          |
| `error`             | `string`             | `''`    | false    | Message shown in place of the log body when the log failed to load. Empty shows the log.                                                                                                                                                                            |

## v-model

| Model                   | Type                     | Default | Emits                 | Notes                                                                                                                                                                      |
| ----------------------- | ------------------------ | ------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:search`        | `string`                 | `''`    | `update:search`       | Two-way search query; filters LogViewContent and highlights matches.                                                                                                       |
| `v-model:level`         | `LogViewLineLevel \| ''` | `''`    | `update:level`        | The level the log is filtered to; empty shows every level. A level toggle sets it and pressing the active one clears it.                                                   |

## Events

| Event  | Payload                              | Notes                                                            |
| ------ | ------------------------------------ | ---------------------------------------------------------------- |
| `copy` | `(event: MouseEvent, value: string)` | Fires after a successful copy; payload is the copied plain text. |

## Slots

| Slot      | Scope | Notes                                                                                        |
| --------- | ----- | -------------------------------------------------------------------------------------------- |
| `default` | —     | Sub-components (LogViewHeader, LogViewContent, LogViewFooter) composed in the desired order. |

## Data types

`LogViewLine` (exported from `injection-key.ts`):

| Field        | Type                                                                  | Notes                                                                                                                                                                                          |
| ------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`         | `string`                                                              | Stable row key.                                                                                                                                                                                |
| `time`       | `string`                                                              | Timestamp label.                                                                                                                                                                               |
| `type`       | `'text' \| 'folder' \| 'framework-version' \| 'success'` | Log line variant; a warning is a `text` line with `level: 'warn'`. |
| `message`    | `string`                                                              | Primary log text.                                                                                                                                                                              |
| `folderType` | `string`                                                              | Optional filename highlight for `folder`.                                                                                                                                                      |
| `size`       | `string`                                                              | Optional raw size for `folder`.                                                                                                                                                                |
| `gzipSize`   | `string`                                                              | Optional gzip size for `folder`.                                                                                                                                                               |
| `suffix`     | `string`                                                              | Optional highlight for `framework-version`.                                                                                                                                                    |
| `level`      | `'debug' \| 'info' \| 'warn' \| 'error'`                              | Optional log level (`LogViewLineLevel`): adds the level column, tints `warn` and `error` rows, and drives the level filter.                                                                    |

`time` is a label, so it holds a clock time (`13:47:33`) or a run offset (`120 ms`); an empty `time` drops the time column for that line.

`LogViewStep` (exported from `injection-key.ts`, read by `LogView.Steps`):

| Field         | Type                                                          | Notes                                          |
| ------------- | ------------------------------------------------------------- | ---------------------------------------------- |
| `key`         | `string`                                                      | Stable step key; `v-model:open-step` holds it. |
| `title`       | `string`                                                      | Step name.                                     |
| `description` | `string`                                                      | Optional one-line summary or failure reason.   |
| `status`      | `'done' \| 'running' \| 'failed' \| 'skipped' \| 'pending'` | `LogViewStepStatus`; drives the glyph.         |
| `duration`    | `string`                                                      | Optional time label (`4s`).                    |
| `lines`       | `LogViewLine[]`                                               | The step's own log lines.                      |

## States

- Visual states: `default`, `hover` (per log line), `focus-visible`, `disabled`, `loading`, `error`, `empty`
- `data-disabled` / `data-level` / `data-loading` / `data-error` / `data-border` on the LogView root
- `level` is the one severity axis: the warnings filter, the warning count and the level toggles all read `level`; the warning filter is the `warn` level toggle (it sets and clears `v-model:level`)
- `error` state: LogViewContent renders a danger `Alert` with the message in place of the log body; copy is hidden
- `empty` state: the package `EmptyState` (see LogViewContent above)
- `loading` state: LogViewContent renders a centered spinner + `loadingLabel` in place of the log body
- Log line `data-type` reflects `line.type` and `data-level` reflects `line.level`; `warn` rows take the warning tint, `error` rows the danger tint and danger text
- Level toggles carry `data-level` and `data-active` (the chosen level); every toggle shows the count of lines at its level in the whole log
- Long logs: above 300 visible lines `LogViewContent` mounts lines in chunks of 100 as they scroll near view (unmounted chunks keep an estimated 24 px per line), so a 10,000-line log mounts within its runtime budget. Search, the level filter, the line count and copy work on every line, mounted or not.

## Motion & Animations

| Trigger                         | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ------------------------------- | ----------------------------------------- | ------------------------------------------------- | ------------------------------- |
| log line hover (LogViewContent) | `transition-colors duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none` |
| running step description (LogView.Steps) | `animate-(--animate-shimmer)` | `--animate-shimmer`                          | `motion-reduce:animate-none` (and `motion-safe:` on the shimmer) |

## Tokens

| Region                                               | Token (DESIGN.md)                                                                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| typography (header label)                            | `.text-label-code-sm`                                                                                                          |
| typography (log lines)                               | `.text-label-code-sm`                                                                                                          |
| surface (header/footer)                              | `var(--bg-surface)`                                                                                                            |
| surface (log canvas)                                 | `var(--bg-canvas)`                                                                                                             |
| surface (line hover)                                 | `var(--bg-surface-raised)`                                                                                                     |
| text (default line)                                  | `var(--text-default)`                                                                                                          |
| text (timestamp)                                     | `var(--text-muted)`                                                                                                            |
| text (`warn` line message)                           | `var(--warning-contrast)`                                                                                                      |
| text (success line)                                  | `var(--success-contrast)`                                                                                                      |
| surface (`error` level row)                          | `var(--danger)`                                                                                                                |
| text (timestamp on an `error` level row)             | `var(--text-default)` (muted fails contrast on the danger tint)                                                                |
| text (`error` level line, error level label and dot) | `var(--danger-contrast)`                                                                                                       |
| text (`warn` level label and dot)                    | `var(--warning-contrast)`                                                                                                      |
| text (`info` level label and dot)                    | `var(--info-contrast)`                                                                                                         |
| level toggle (rest / active)                         | `var(--border-default)`, `var(--bg-surface)` / `var(--border-selected)`, `var(--bg-selected)`, `var(--border-strong)` on hover |
| border (outer card, `bordered` prop)                 | `var(--border-muted)`                                                                                                          |
| shape (outer card, `bordered` prop)                  | `var(--shape-elements)`                                                                                                        |
| spacing (loading block, vertical)                    | `var(--spacing-xl)`                                                                                                            |
| ring                                                 | `var(--ring-color)`                                                                                                            |

**The root sizes to its content, not to its parent.** It takes `h-fit` alongside `min-h-0`, so a
short log occupies the height of the lines it has instead of stretching to fill a flex or grid
parent and leaving the canvas empty below the last line. A host that _wants_ the full height gives
the root its own `class="h-full"` — that is the consumer's call to make, and `$attrs` carries it.

The **loading** state has no lines to give it height, so it carries `py-(--spacing-xl)` of its
own: the spinner and its label sit in a block with real vertical presence rather than collapsing to
the height of a single row the moment the root stopped stretching.

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus on the interactive controls in the header/footer.
- LogViewContent carries a visually hidden `role="log"` region (`aria-live="polite"`) that holds only the lines appended to `lines` since the last update (filtered by the current search and level). The scrolling log body is not a live region, so the lines already present at mount and the chunks that mount on scroll are never announced; replacing `lines` with a different log clears the region.
- The level filter is a `role="group"` named `Log levels`; each toggle is a button with `aria-pressed` named with its level and line count (`warn, 3 lines`), the level also in visible text, so the state is never colour only.
- The warning filter exposes `aria-pressed`; the copy control (a CopyButton in LogViewContent) uses `aria-label="Copy logs"` at rest, switching to `"Copied logs"` after a successful copy.
- The loading state uses `role="status"` with `aria-live="polite"`; the spinner is `aria-hidden` (from the Spinner component) and the `loadingLabel` text conveys status.
- `motion-reduce:transition-none` on every motion-bearing class.
- LogView.Steps: each step is an `Accordion` item (a button with `aria-expanded`); the status glyph is `aria-hidden` and the status is in the trigger's text (`sr-only`), so it is never colour or shape only; the view switch is a named `ToggleGroup`; the progress bar is a `progressbar` named `Run progress`.
- Touch target: level toggles are 32 px high (44 px on `pointer: coarse`); the warning control is ≥40×40 px; the copy control uses CopyButton `size="small"` (28×28 px) to match CodeBlock — a justified deviation for the compact overlay.

## Internationalization

| Key                         | English source                                          | Override prop       |
| --------------------------- | ------------------------------------------------------- | ------------------- |
| `logView.searchPlaceholder` | Find in logs                                            | `searchPlaceholder` |
| `logView.search`            | Search logs                                             | —                   |
| `logView.loading`           | Loading…                                                | `loadingLabel`      |
| `logView.lines`             | {count} line / {count} lines (plural)                   | —                   |
| `logView.warnings`          | Warnings                                                | —                   |
| `logView.warningCount`      | {count} warning / {count} warnings (plural)             | —                   |
| `logView.gzip`              | gzip:                                                   | —                   |
| `logView.empty`             | No log lines match the current filters.                 | `empty` slot        |
| `logView.noLines`           | No log lines yet.                                       | `empty` slot        |
| `logView.noMatch`           | No line matches “{query}”.                              | `empty` slot        |
| `logView.clearSearch`       | Clear search                                            | `empty` slot        |
| `logView.copy`              | Copy logs                                               | —                   |
| `logView.copied`            | Copied logs                                             | —                   |
| `logView.levels`            | Log levels                                              | —                   |
| `logView.levelCount`        | {level}, {count} line / {level}, {count} lines (plural) | —                   |
| `logView.stepsView`         | Log view                                                | —                   |
| `logView.stepsPhased`       | Phased                                                  | —                   |
| `logView.stepsComplete`     | Complete                                                | —                   |
| `logView.stepsProgress`     | Run progress                                            | —                   |
| `logView.stepsWaiting`      | Waiting to start…                                       | —                   |
| `logView.stepsNeverRan`     | Never ran.                                              | `step-empty` slot   |
| `logView.stepDone`          | Done                                                    | —                   |
| `logView.stepFailed`        | Failed                                                  | —                   |
| `logView.stepSkipped`       | Skipped                                                 | —                   |
| `logView.stepRunning`       | Running                                                 | —                   |
| `logView.stepPending`       | Not started                                             | —                   |

- Formatting: counts go through the plural rules of the active locale. Level names (`debug`, `info`, `warn`, `error`) are log tokens and stay untranslated, as they appear in the log itself.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none mirror.
- Keyboard: no horizontal arrow-key logic.
- Isolation: timestamps and level labels render `dir="ltr"`; each message renders `dir="auto"`, so a log line in another script keeps its own direction.

## Responsive

- Container queries: none; the header stacks below `sm` and sits in one 48 px row from `sm`; the left group (line count, warning filter, level toggles) wraps.
- Narrow: log lines stop wrapping and the body scrolls horizontally inside the ScrollArea; the page never does.
- Touch: level toggles and the warning control grow on `pointer: coarse`; line hover is decoration only.
- Reflow: no horizontal page scroll at 320 px; the log body scrolls in both axes inside its frame.

## Performance

- Bundle budget: `log-view` (the compound `index.ts`, every part attached, including `LogView.Steps` with `Accordion`, `ToggleGroup` and `Progress`) in `.size-limit.json`, `log-view-steps` on its own, `log-view-root` 12.75 KB, `log-view-header` 4.8 KB, `log-view-content` 23.25 KB (initial chunk, with `EmptyState` and `Alert`), `log-view-footer` 0.65 KB gzip in `.size-limit.json`.
- Runtime budget: a 10,000-line log mounts within budget through chunked mounting (above 300 visible lines, chunks of 100); a chunk that scrolls far out of view is unmounted again and keeps its measured height, so scrolling through a long log never keeps every line mounted. The level counts and filters are one pass over `lines`; each line's lowercased search text and its copy text are built once and reused until its `message` changes, so a live tail costs one new line, not the whole log. The `LogView with 10k lines and a search: tail 20 appended lines` scenario holds the tail to its budget in `perf-budgets.json`.
- Heavy parts: none lazy-loaded; off-screen chunks stay unmounted.

## Examples

- Default — composed `LogView.Header` + `LogView.Content` over a realistic deploy log; search filters lines and highlights matches.
- Borderless — `:bordered="false"` inside a surface that already frames the log (the same name `code-block` uses).
- Loading — LogView with `loading` set; LogViewContent shows the centered spinner + label.
- Levels — a function's test-run log with `level` on each line, run offsets in `time` and `levels` on the root: the header's level toggles with counts filter the lines, and `warn` / `error` rows are tinted. Justified: levels are a distinct log shape (run output), not a variant of the build log.
- Empty — no lines: the package empty state; justified because `empty` is a state the component owns.
- Disabled — `disabled` locks the search, level toggles and copy.
- WithFooter — `LogView.Footer` with a summary and an action; justified because the footer is public anatomy no other example shows.
- Steps — `LogView.Steps` over a finished deploy: each step's log in Phased, every line in Complete; justified because the steps part is public anatomy.
- StepsRunning — `LogView.Steps` mid-run: done steps, a running step with its spinner, pending steps waiting, and the flush progress bar.
- StepsFailed — `LogView.Steps` after a failure: the failed step open with its reason, the remaining steps skipped, and a `step-meta` Tag.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
