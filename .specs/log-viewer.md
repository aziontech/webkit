---
name: log-viewer
category: code
structure: composition
status: implemented
spec_version: 15
template: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3950-34695
  node_id: 3950:34695
checksum: f82408f9211dc6d07b26f8c1c124d6b8b38875a82d87bad97ec77f412c37d2f9
created: 2026-05-26
last_updated: 2026-11-18
---

# Log View — Component Spec

## Purpose

Composition-based terminal log viewer for CI/deploy output. **LogViewer** is the root shell and context provider; **`LogViewer.Header`**, **`LogViewer.Content`**, and **`LogViewer.Footer`** are composed as children so teams can reorder, omit, or replace the toolbar and footer without forking the log renderer. **`LogViewer.Steps`** shows a run with known steps (build, deploy, provisioning) as a pipeline: one collapsible step per phase, each with its own log, a Phased or Complete switch and an optional flush progress bar.

Use LogViewer for build, deploy or runtime log lines, and LogViewer.Steps when the run has named steps; for code the person reads or copies use CodeBlock, and for code the person edits use CodeEditor.

## When to use

- Showing build, deploy or CI output as timestamped lines the reader can search, filter to warnings, and copy.
- A log shell whose toolbar and footer vary by screen — compose `LogViewerHeader`, `LogViewerContent` and `LogViewerFooter` in the order you need, or drop the ones you don't.
- A run log with levels (`debug`, `info`, `warn`, `error`), such as what a function printed during a test run: set `level` on each line and `levels` on the root, and the header filters by level with a count per level.
- A log that is still loading from the server — set `loading` to show a spinner and `loading-label` in place of the body.
- A build or deploy run with known steps → `LogViewer.Steps` with one entry per step; every deploy-log block composes it instead of rebuilding the pipeline.

## When NOT to use

- Static, read-only code or configuration snippets → use `code-block`.
- An animated terminal session on a marketing page → use `cli-terminal-section`.
- Rows of structured records with columns, sorting or paging → use `table`.
- The steps of a form or setup the person moves through (no log under each step) → use `stepper`.
- The timed spans of one request or invocation → use `trace`.
- In a docs Markdown page or the site's page JSON. LogViewer is app-only (decision RV-C2-1, rule `webkit-content-channels`): it views a live run log (search, level filter, follow), so it has no `DocMarkdown` tag and no page JSON entry. A docs page or the site shows sample output as a code fence or `CodeBlock`.

## Related

- `code-block` — highlighted source code with a copy action, not a stream of typed log lines.
- `cli-terminal-section` — marketing band that plays a scripted terminal session.
- `stepper` — the steps of a wizard the person moves through; `LogViewer.Steps` is the steps of a run that a machine moves through, each with its log.
- `trace` — the spans of one request on a time axis, not log lines.
- `create/create-deploy-success` — the post-deploy screen that embeds `log-viewer` for the build log.

## Best practices

- Give every line a stable `id` and a `type` (`text`, `folder`, `framework-version`, `success`); the type drives the line's rendering. A warning is a `text` line with `level: 'warn'`; `level` drives the level toggles; the `warn` toggle is the warnings shortcut.
- For a run log, give each line a `level` and put the run offset (`120 ms`, `1.24 s`) in `time`; pass the levels the run can print as `levels` so every level is offered even when it has no line yet. Bind `v-model:level` when the app needs the chosen level.
- Bind `v-model:search` and `v-model:level` when the app needs the filter state; otherwise leave them unbound and the header manages them.
- Set `:bordered="false"` when the log sits inside a surface that already frames it (an accordion panel, a drawer).
- The copy control hides while `disabled` or `loading`, or when there is nothing to copy; listen to `@copy` for the copied text instead of reading the clipboard.
- Use the header's `start` / `end` / `search` slots and the footer's default slot to add actions, rather than rebuilding the toolbar.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import LogViewer from '@aziontech/webkit/log-viewer'

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
  <LogViewer
    :lines="lines"
    :levels="['info', 'warn']"
    v-model:search="search"
    v-model:level="level"
  >
    <LogViewer.Header />
    <LogViewer.Content />
  </LogViewer>
</template>
```

`@aziontech/webkit/log-viewer` is the compound (the root with `Header`, `Content`, `Footer` and `Steps` attached). For tree-shaking, import the root alone from `@aziontech/webkit/log-viewer-root` and each part from `@aziontech/webkit/log-viewer-header`, `log-viewer-content`, `log-viewer-footer` and `log-viewer-steps`.

```vue
<script setup>
  import LogViewer from '@aziontech/webkit/log-viewer'

  const steps = [
    { id: 'build', title: 'Build', status: 'success', duration: '9s', lines: buildLines },
    { id: 'publish', title: 'Publish', status: 'running', lines: publishLines }
  ]
</script>

<template>
  <LogViewer.Steps
    :steps="steps"
    progress
  >
    <template #header>Deployment logs</template>
  </LogViewer.Steps>
</template>
```

## Sub-components

LogViewer ships its sub-components attached to the root (`LogViewer.Header`, `LogViewer.Content`, `LogViewer.Footer`, `LogViewer.Steps`, via `index.ts`) and individually importable (each from its own `@aziontech/webkit/log-viewer-*` entry); every sub-component reads the root's shared state through the injected context, so the consumer wires nothing.

- `log-viewer-header.vue` (`LogViewer.Header`) — Default 48px toolbar: line count, the level filter and a search field. The level filter is one toggle per entry of `levels` (a dot in the level colour, the level name, its line count); with `levels` empty it offers the `warn` toggle alone while the log has a warning line, so the warnings shortcut is the same control, never a second one. Every toggle is the same native button: 32 px tall with a 44 px hit area on coarse pointers, `.text-label-sm`, the count in tabular numbers; the line count uses the same font. The line count and the toggles sit on one row that scrolls sideways (no visible scrollbar) when it does not fit, so a phone never wraps them into a second row. Slots: `start`, `end`, `search`.
- `log-viewer-content.vue` (`LogViewer.Content`) — Scrollable log body with per-`type` line rendering, search highlighting, `ScrollArea`'s `fade` on the log body (the edges that still have lines beyond them fade out), and the copy-to-clipboard control (a `CopyButton` pinned top-right over the log content, shown when `copyable` is set; while it shows, `data-copyable` keeps the body at least as tall as the button and its two insets, so a one-line log never pushes the button onto the frame's bottom rule). When `loading` is set, it replaces the log body with a centered `Spinner` (`@aziontech/webkit/spinner`) and the `loadingLabel` text (`role="status"`). When `error` is set, it replaces the body with a danger `Alert` holding the message. With no line to show, it renders the package `EmptyState` (small): "No log lines yet." for an empty log, "No line matches “query”" with a Clear search action for a search with no result, and "No log lines match the current filters." for a level or warnings filter with no result. Slot: `empty` (replaces the EmptyState).
- `log-viewer-footer.vue` (`LogViewer.Footer`) — Optional footer region for actions (download, follow live, pagination). Slot: `default`.
- `log-viewer-steps.vue` (`LogViewer.Steps`) — A run with known steps, standalone (it renders its own `LogViewer` per step and needs no parent `LogViewer`). An optional toolbar row (`__toolbar`, shown when the `header` slot is filled or `viewSwitch` is on) holds the `header` slot at the start and, with `viewSwitch`, a `ToggleGroup` (`__view-switch`, named `Log view`) switching **Phased** and **Complete** at the end. Phased renders an `Accordion` (`type="single"`, collapsible) with one item per step (`__step`, `data-status`): the trigger shows the status glyph (success: a success check; error: a danger cross; skipped: a muted minus; running: a `Spinner`; pending: a dashed circle), the status in words for assistive technology (`sr-only`), the title, the `step-meta` slot (it keeps its width, so a Tag there is never squeezed; the description truncates instead), the description (danger text on error, a shimmer while running) and the duration; the panel holds a borderless `LogViewer` + `LogViewer.Content` over the step's lines, loading with `Waiting to start…` while the step is pending, and the `step-empty` slot in place of the empty state (a skipped step defaults to `Never ran.`). Complete renders every step's lines as one borderless `LogViewer` (`__complete`; line ids are prefixed with the step id). With `progress`, a flush, small, flat `Progress` (`__progress`, named `Run progress`) sits on the bottom edge; its value is the share of steps that succeeded. Props: `steps?: LogViewerStep[]` (default `[]`), `copyable?: boolean` (default `true`, forwarded to each log), `viewSwitch?: boolean` (default `true`), `progress?: boolean` (default `false`). Models: `v-model:view` (`LogViewerStepsView` = `'phased' | 'complete'`, default `'phased'`), `v-model:open-step` (`string`, the id of the open step; unbound, the running step opens, else the one in error, else none). Slots: `header`, `step-meta({ step })`, `step-empty({ step })`. Test ids: `log-viewer-steps` (a consumer `data-testid` wins) and `__toolbar`, `__view-switch`, `__step`, `__complete`, `__progress` under it.

## Props

| Prop                | Type                   | Default | Required | JSDoc                                                                                                                                                                                                                                                               |
| ------------------- | ---------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lines`             | `LogViewerLine[]`      | `[]`    | false    | Log entries; filtered in LogViewerContent by search and level.                                                                                                                                                                                                      |
| `bordered`          | `boolean`              | `true`  | false    | Draw the outer card border and corner radius around the log shell. On by default; set `:bordered="false"` to render the shell flush inside a surface that already frames it (an accordion panel, a drawer). Internal dividers (header/footer edges) are unaffected. |
| `searchPlaceholder` | `string`               | `''`    | false    | Placeholder for the default header search field. Empty uses the locale catalog (`Find in logs`).                                                                                                                                                                    |
| `copyable`          | `boolean`              | `true`  | false    | Shows the copy-to-clipboard control (a CopyButton pinned top-right over the log content in LogViewerContent).                                                                                                                                                       |
| `disabled`          | `boolean`              | `false` | false    | Disables toolbar controls in LogViewerHeader.                                                                                                                                                                                                                       |
| `loading`           | `boolean`              | `false` | false    | Replaces the LogViewerContent log body with a centered spinner and label.                                                                                                                                                                                           |
| `loadingLabel`      | `string`               | `''`    | false    | Label shown beneath the spinner while `loading`. Empty uses the locale catalog (`Loading…`).                                                                                                                                                                        |
| `levels`            | `LogViewerLineLevel[]` | `[]`    | false    | Levels the header offers as filter toggles, each with its line count; a level with no line is still offered. Empty hides the level filter.                                                                                                                          |
| `error`             | `string`               | `''`    | false    | Message shown in place of the log body when the log failed to load. Empty shows the log.                                                                                                                                                                            |

## v-model

| Model            | Type                       | Default | Emits           | Notes                                                                                                                    |
| ---------------- | -------------------------- | ------- | --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `v-model:search` | `string`                   | `''`    | `update:search` | Two-way search query; filters LogViewerContent and highlights matches.                                                   |
| `v-model:level`  | `LogViewerLineLevel \| ''` | `''`    | `update:level`  | The level the log is filtered to; empty shows every level. A level toggle sets it and pressing the active one clears it. |

## Events

| Event  | Payload                              | Notes                                                            |
| ------ | ------------------------------------ | ---------------------------------------------------------------- |
| `copy` | `(event: MouseEvent, value: string)` | Fires after a successful copy; payload is the copied plain text. |

## Slots

| Slot      | Scope | Notes                                                                                              |
| --------- | ----- | -------------------------------------------------------------------------------------------------- |
| `default` | —     | Sub-components (LogViewerHeader, LogViewerContent, LogViewerFooter) composed in the desired order. |

## Data types

`LogViewerLine` (exported from `injection-key.ts`):

| Field        | Type                                                     | Notes                                                                                                                         |
| ------------ | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `id`         | `string`                                                 | Stable row key.                                                                                                               |
| `time`       | `string`                                                 | Timestamp label.                                                                                                              |
| `type`       | `'text' \| 'folder' \| 'framework-version' \| 'success'` | Log line variant; a warning is a `text` line with `level: 'warn'`.                                                            |
| `message`    | `string`                                                 | Primary log text.                                                                                                             |
| `folderType` | `string`                                                 | Optional filename highlight for `folder`.                                                                                     |
| `size`       | `string`                                                 | Optional raw size for `folder`.                                                                                               |
| `gzipSize`   | `string`                                                 | Optional gzip size for `folder`.                                                                                              |
| `suffix`     | `string`                                                 | Optional highlight for `framework-version`.                                                                                   |
| `level`      | `'debug' \| 'info' \| 'warn' \| 'error'`                 | Optional log level (`LogViewerLineLevel`): adds the level column, tints `warn` and `error` rows, and drives the level filter. |

`time` is a label, so it holds a clock time (`13:47:33`) or a run offset (`120 ms`). The time and level are columns of the whole log: the time column is as wide as the longest `time` in `lines` (tabular numbers, aligned to the end) and the level column as wide as the longest `level`, so every message starts at the same x on every row, whatever the filter shows. A line with an empty `time` or no `level` keeps an empty cell; a log where no line has a `time` (or a `level`) drops that column.

`LogViewerStep` (exported from `injection-key.ts`, read by `LogViewer.Steps`):

| Field         | Type                                                          | Notes                                         |
| ------------- | ------------------------------------------------------------- | --------------------------------------------- |
| `id`          | `string`                                                      | Stable step id; `v-model:open-step` holds it. |
| `title`       | `string`                                                      | Step name.                                    |
| `description` | `string`                                                      | Optional one-line summary or failure reason.  |
| `status`      | `'success' \| 'running' \| 'error' \| 'skipped' \| 'pending'` | `LogViewerStepStatus`; drives the glyph.      |
| `duration`    | `string`                                                      | Optional time label (`4s`).                   |
| `lines`       | `LogViewerLine[]`                                             | The step's own log lines.                     |

## States

- Visual states: `default`, `hover` (per log line), `focus-visible`, `disabled`, `loading`, `error`, `empty`
- `data-disabled` / `data-level` / `data-loading` / `data-error` / `data-bordered` on the LogViewer root
- `level` is the one severity axis: the level toggles read and write `level`; the warnings shortcut is the `warn` level toggle (it sets and clears `v-model:level`), offered alone when `levels` is empty
- `error` state: LogViewerContent renders a danger `Alert` with the message in place of the log body; copy is hidden
- `empty` state: the package `EmptyState` (see LogViewerContent above)
- `loading` state: LogViewerContent renders a centered spinner + `loadingLabel` in place of the log body
- Log line `data-type` reflects `line.type` and `data-level` reflects `line.level`; `warn` rows take the warning tint, `error` rows the danger tint and danger text
- Level toggles carry `data-level` and `data-active` (the chosen level); every toggle shows the count of lines at its level in the whole log
- Log line columns: the time and level cells take their width from the longest value in the whole log (`--log-viewer-time-width`, `--log-viewer-level-width` on the line list, counted in `ch` plus the code letter-spacing), so the columns do not move while lines are filtered, appended or mounted in chunks.
- Long logs: above 300 visible lines `LogViewerContent` mounts lines in chunks of 100 as they scroll near view (unmounted chunks keep an estimated 24 px per line), so a 10,000-line log mounts within its runtime budget. Search, the level filter, the line count and copy work on every line, mounted or not.

## Motion & Animations

| Trigger                                    | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                                          |
| ------------------------------------------ | ----------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------- |
| log line hover (LogViewerContent)          | `transition-colors duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none`                                  |
| running step description (LogViewer.Steps) | `animate-shimmer`                         | `--animate-shimmer`                               | `motion-reduce:animate-none` (and `motion-safe:` on the shimmer) |

## Tokens

| Region                                               | Token (DESIGN.md)                                                                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| typography (header line count and level toggles)     | `.text-label-sm`, counts `tabular-nums`                                                                                        |
| typography (log lines)                               | `.text-label-code-sm`                                                                                                          |
| surface (header/footer)                              | `var(--bg-surface)`                                                                                                            |
| surface (log canvas)                                 | `var(--bg-canvas)`                                                                                                             |
| surface (line hover)                                 | `var(--bg-surface-raised)`                                                                                                     |
| text (default line)                                  | `var(--text-default)`                                                                                                          |
| text (timestamp)                                     | `var(--text-muted)`                                                                                                            |
| text (`warn` line message)                           | `var(--warning-foreground)`                                                                                                    |
| text (success line)                                  | `var(--success-foreground)`                                                                                                    |
| surface (`error` level row)                          | `var(--danger)`                                                                                                                |
| text (timestamp on an `error` level row)             | `var(--text-default)` (muted fails contrast on the danger tint)                                                                |
| text (`error` level line, error level label and dot) | `var(--danger-foreground)`                                                                                                     |
| text (`warn` level label and dot)                    | `var(--warning-foreground)`                                                                                                    |
| text (`info` level label and dot)                    | `var(--info-foreground)`                                                                                                       |
| level toggle (rest / active)                         | `var(--border-default)`, `var(--bg-surface)` / `var(--border-selected)`, `var(--bg-selected)`, `var(--border-strong)` on hover |
| border (outer card, `bordered` prop)                 | `var(--border-muted)`                                                                                                          |
| shape (outer card, `bordered` prop)                  | `var(--shape-control)`                                                                                                         |
| spacing (loading block, vertical)                    | `var(--spacing-xl)`                                                                                                            |
| ring                                                 | `var(--ring-color)`                                                                                                            |

One code size across the code components (CodeBlock, CodeEditor, LogViewer, Trace and the docs source viewer): code text and line numbers are 12 px Roboto Mono (`--text-body-code-sm-font-size`, set by `.text-body-code-sm` or `.text-label-code-sm`), never a raw size and never a second code size. A file name in a header or tab is code too (`.text-label-code-sm`, `var(--text-muted)` or `var(--text-default)`); a tab that names a choice (npm, pnpm) is a label (`.text-label-sm`).

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
- LogViewerContent carries a visually hidden `role="log"` region (`aria-live="polite"`) that holds only the lines appended to `lines` since the last update (filtered by the current search and level). The scrolling log body is not a live region, so the lines already present at mount and the chunks that mount on scroll are never announced; replacing `lines` with a different log clears the region.
- The level filter is a `role="group"` named `Log levels`; each toggle is a button with `aria-pressed` named with its level and line count (`warn, 3 lines`), the level also in visible text, so the state is never colour only.
- The copy control (a CopyButton in LogViewerContent) uses `aria-label="Copy logs"` at rest, switching to `"Copied logs"` after a successful copy. It floats at the top inline end of the content, so the first two lines (`data-copy-gutter`) reserve its footprint on their inline end and never run under it.
- The loading state uses `role="status"` with `aria-live="polite"`; the spinner is `aria-hidden` (from the Spinner component) and the `loadingLabel` text conveys status.
- `motion-reduce:transition-none` on every motion-bearing class.
- LogViewer.Steps: each step is an `Accordion` item (a button with `aria-expanded`); the status glyph is `aria-hidden` and the status is in the trigger's text (`sr-only`), so it is never colour or shape only; the view switch is a named `ToggleGroup`; the progress bar is a `progressbar` named `Run progress`.
- Touch target: level toggles (the `warn` shortcut included) stay 32 px high at every width, so the toolbar keeps its size on a phone; on `pointer: coarse` an invisible layer extends each one's hit area to 44 px tall; the copy control uses CopyButton `size="small"` (28×28 px) to match CodeBlock — a justified deviation for the compact overlay.

## Internationalization

| Key                           | English source                                          | Override prop       |
| ----------------------------- | ------------------------------------------------------- | ------------------- |
| `logViewer.searchPlaceholder` | Find in logs                                            | `searchPlaceholder` |
| `logViewer.search`            | Search logs                                             | —                   |
| `logViewer.loading`           | Loading…                                                | `loadingLabel`      |
| `logViewer.lines`             | {count} line / {count} lines (plural)                   | —                   |
| `logViewer.gzip`              | gzip:                                                   | —                   |
| `logViewer.empty`             | No log lines match the current filters.                 | `empty` slot        |
| `logViewer.noLines`           | No log lines yet.                                       | `empty` slot        |
| `logViewer.noMatch`           | No line matches “{query}”.                              | `empty` slot        |
| `logViewer.clearSearch`       | Clear search                                            | `empty` slot        |
| `logViewer.copy`              | Copy logs                                               | —                   |
| `logViewer.copied`            | Copied logs                                             | —                   |
| `logViewer.levels`            | Log levels                                              | —                   |
| `logViewer.levelCount`        | {level}, {count} line / {level}, {count} lines (plural) | —                   |
| `logViewer.stepsView`         | Log view                                                | —                   |
| `logViewer.stepsPhased`       | Phased                                                  | —                   |
| `logViewer.stepsComplete`     | Complete                                                | —                   |
| `logViewer.stepsProgress`     | Run progress                                            | —                   |
| `logViewer.stepsWaiting`      | Waiting to start…                                       | —                   |
| `logViewer.stepsNeverRan`     | Never ran.                                              | `step-empty` slot   |
| `logViewer.stepDone`          | Done                                                    | —                   |
| `logViewer.stepFailed`        | Failed                                                  | —                   |
| `logViewer.stepSkipped`       | Skipped                                                 | —                   |
| `logViewer.stepRunning`       | Running                                                 | —                   |
| `logViewer.stepPending`       | Not started                                             | —                   |

- Formatting: counts go through the plural rules of the active locale. Level names (`debug`, `info`, `warn`, `error`) are log tokens and stay untranslated, as they appear in the log itself.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none mirror.
- Keyboard: no horizontal arrow-key logic.
- Isolation: the log body renders `dir="ltr"` (log output is code, so a line opens at its start and scrolls the same way in a right-to-left page); timestamps and level labels render `dir="ltr"`; each message and each step summary renders `dir="auto"`, so a line in another script keeps its own direction and an English summary keeps its start and number order.

## Responsive

- Container queries: none; the header stacks below `sm` and sits in one 48 px row from `sm`; the left group (line count, level toggles) stays on one row and scrolls sideways when it does not fit.
- Narrow: log lines stop wrapping and the body scrolls horizontally inside the ScrollArea; the page never does.
- Touch: level toggles keep their 32 px look and get a 44 px hit area on `pointer: coarse`; line hover is decoration only.
- Reflow: no horizontal page scroll at 320 px; the log body scrolls in both axes inside its frame.

## Performance

- Bundle budget: `log-viewer` (the compound `index.ts`, every part attached, including `LogViewer.Steps` with `Accordion`, `ToggleGroup` and `Progress`) in `.size-limit.json`, `log-viewer-steps` on its own, `log-viewer-root` 12.75 KB, `log-viewer-header` 4.8 KB, `log-viewer-content` 23.25 KB (initial chunk, with `EmptyState` and `Alert`), `log-viewer-footer` 0.65 KB gzip in `.size-limit.json`.
- Runtime budget: a 10,000-line log mounts within budget through chunked mounting (above 300 visible lines, chunks of 100); a chunk that scrolls far out of view is unmounted again and keeps its measured height, so scrolling through a long log never keeps every line mounted. The level counts and filters are one pass over `lines`; each line's lowercased search text and its copy text are built once and reused until its `message` changes, so a live tail costs one new line, not the whole log. The `LogViewer with 10k lines and a search: tail 20 appended lines` scenario holds the tail to its budget in `perf-budgets.json`.
- Heavy parts: none lazy-loaded; off-screen chunks stay unmounted.

## Examples

- Default — composed `LogViewer.Header` + `LogViewer.Content` over a realistic deploy log; search filters lines and highlights matches.
- Borderless — `:bordered="false"` inside a surface that already frames the log (the same name `code-block` uses).
- Loading — LogViewer with `loading` set; LogViewerContent shows the centered spinner + label.
- Levels — a function's test-run log with `level` on each line, run offsets in `time` and `levels` on the root: the header's level toggles with counts filter the lines, and `warn` / `error` rows are tinted. Justified: levels are a distinct log shape (run output), not a variant of the build log.
- Empty — no lines: the package empty state; justified because `empty` is a state the component owns.
- Disabled — `disabled` locks the search, level toggles and copy.
- WithFooter — `LogViewer.Footer` with a summary and an action; justified because the footer is public anatomy no other example shows.
- StepLogs — `LogViewer.Steps` over a finished deploy: each step's log in Phased, every line in Complete; justified because the steps part is public anatomy. Named for what it shows (a log split by step), so it does not read as a separate steps component.
- StepLogsRunning — the same step logs mid-run: done steps, a running step with its spinner, pending steps waiting, and the flush progress bar.
- StepLogsError — the same step logs after a failure: the failed step open with its reason, the remaining steps skipped, and a `step-meta` Tag.

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
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
