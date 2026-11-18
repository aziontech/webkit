# Log Viewer

> Composition-based terminal log viewer for CI/deploy output. **LogViewer** is the root shell and context provider; **`LogViewer.Header`**, **`LogViewer.Content`**, and **`LogViewer.Footer`** are composed as children so teams can reorder, omit, or replace the toolbar and footer without forking the log renderer. **`LogViewer.Steps`** shows a run with known steps (build, deploy, provisioning) as a pipeline: one collapsible step per phase, each with its own log, a Phased or Complete switch and an optional flush progress bar. Use LogViewer for build, deploy or runtime log lines, and LogViewer.Steps when the run has named steps; for code the person reads or copies use CodeBlock, and for code the person edits use CodeEditor.

- Import: `import LogViewerRoot from '@aziontech/webkit/log-viewer-root'`
- Compound import (dot notation, not tree-shakeable): `import LogViewer from '@aziontech/webkit/log-viewer'`
- Category: code · Surface: app · Structure: composition
- API as JSON: [log-viewer.json](log-viewer.json)

## When to use

- Showing build, deploy or CI output as timestamped lines the reader can search, filter to warnings, and copy.
- A log shell whose toolbar and footer vary by screen — compose `LogViewerHeader`, `LogViewerContent` and `LogViewerFooter` in the order you need, or drop the ones you don't.
- A run log with levels (`debug`, `info`, `warn`, `error`), such as what a function printed during a test run: set `level` on each line and `levels` on the root, and the header filters by level with a count per level.
- A log that is still loading from the server — set `loading` to show a spinner and `loading-label` in place of the body.
- A build or deploy run with known steps → `LogViewer.Steps` with one entry per step; every deploy-log block composes it instead of rebuilding the pipeline.

## Do

- Give every line a stable `id` and a `type` (`text`, `folder`, `framework-version`, `success`); the type drives the line's rendering. A warning is a `text` line with `level: 'warn'`; `level` drives the level toggles; the `warn` toggle is the warnings shortcut.
- For a run log, give each line a `level` and put the run offset (`120 ms`, `1.24 s`) in `time`; pass the levels the run can print as `levels` so every level is offered even when it has no line yet. Bind `v-model:level` when the app needs the chosen level.
- Bind `v-model:search` and `v-model:level` when the app needs the filter state; otherwise leave them unbound and the header manages them.
- Set `:bordered="false"` when the log sits inside a surface that already frames it (an accordion panel, a drawer).
- The copy control hides while `disabled` or `loading`, or when there is nothing to copy; listen to `@copy` for the copied text instead of reading the clipboard.
- Use the header's `start` / `end` / `search` slots and the footer's default slot to add actions, rather than rebuilding the toolbar.

## Don’t

- Static, read-only code or configuration snippets → use `code-block`.
- An animated terminal session on a marketing page → use `cli-terminal-section`.
- Rows of structured records with columns, sorting or paging → use `table`.
- The steps of a form or setup the person moves through (no log under each step) → use `stepper`.
- The timed spans of one request or invocation → use `trace`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [code-block](code-block.md) — highlighted source code with a copy action, not a stream of typed log lines.
- [cli-terminal-section](cli-terminal-section.md) — marketing band that plays a scripted terminal session.
- [stepper](stepper.md) — the steps of a wizard the person moves through; `LogViewer.Steps` is the steps of a run that a machine moves through, each with its log.
- [trace](trace.md) — the spans of one request on a time axis, not log lines.
- `deploy-success` — the post-deploy screen that embeds `log-viewer` for the build log.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `lines` | `LogViewerLine[]` | `[]` | false | Log entries; filtered in LogViewerContent by search and level. |
| `bordered` | `boolean` | `true` | false | Draw the outer card border and corner radius around the log shell. On by default; set `:bordered="false"` to render the shell flush inside a surface that already frames it (an accordion panel, a drawer). Internal dividers (header/footer edges) are unaffected. |
| `searchPlaceholder` | `string` | `''` | false | Placeholder for the default header search field. Empty uses the locale catalog (`Find in logs`). |
| `copyable` | `boolean` | `true` | false | Shows the copy-to-clipboard control (a CopyButton pinned top-right over the log content in LogViewerContent). |
| `disabled` | `boolean` | `false` | false | Disables toolbar controls in LogViewerHeader. |
| `loading` | `boolean` | `false` | false | Replaces the LogViewerContent log body with a centered spinner and label. |
| `loadingLabel` | `string` | `''` | false | Label shown beneath the spinner while `loading`. Empty uses the locale catalog (`Loading…`). |
| `levels` | `LogViewerLineLevel[]` | `[]` | false | Levels the header offers as filter toggles, each with its line count; a level with no line is still offered. Empty hides the level filter. |
| `error` | `string` | `''` | false | Message shown in place of the log body when the log failed to load. Empty shows the log. |
| `search` | `string` | `''` | false | Two-way value (`v-model:search`). |
| `level` | `LogViewerLineLevel \| ''` | `''` | false | Two-way value (`v-model:level`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `copy` | `(event: MouseEvent, value: string)` | Fires after a successful copy; payload is the copied plain text. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Sub-components (LogViewerHeader, LogViewerContent, LogViewerFooter) composed in the desired order. |

## Sub-component imports

- `@aziontech/webkit/log-viewer-content`
- `@aziontech/webkit/log-viewer-footer`
- `@aziontech/webkit/log-viewer-steps`
- `@aziontech/webkit/log-viewer-header`

## Sub-components

LogViewer ships its sub-components attached to the root (`LogViewer.Header`, `LogViewer.Content`, `LogViewer.Footer`, `LogViewer.Steps`, via `index.ts`) and individually importable (each from its own `@aziontech/webkit/log-viewer-*` entry); every sub-component reads the root's shared state through the injected context, so the consumer wires nothing.

- `log-viewer-header.vue` (`LogViewer.Header`) — Default 48px toolbar: line count, the level filter and a search field. The level filter is one toggle per entry of `levels` (a dot in the level colour, the level name, its line count); with `levels` empty it offers the `warn` toggle alone while the log has a warning line, so the warnings shortcut is the same control, never a second one. Every toggle is the same native button: 32 px tall with a 44 px hit area on coarse pointers, `.text-label-sm`, the count in tabular numbers; the line count uses the same font. The line count and the toggles sit on one row that scrolls sideways (no visible scrollbar) when it does not fit, so a phone never wraps them into a second row. Slots: `start`, `end`, `search`.
- `log-viewer-content.vue` (`LogViewer.Content`) — Scrollable log body with per-`type` line rendering, search highlighting, `ScrollArea`'s `fade` on the log body (the edges that still have lines beyond them fade out), and the copy-to-clipboard control (a `CopyButton` pinned top-right over the log content, shown when `copyable` is set; while it shows, `data-copyable` keeps the body at least as tall as the button and its two insets, so a one-line log never pushes the button onto the frame's bottom rule). When `loading` is set, it replaces the log body with a centered `Spinner` (`@aziontech/webkit/spinner`) and the `loadingLabel` text (`role="status"`). When `error` is set, it replaces the body with a danger `Alert` holding the message. With no line to show, it renders the package `EmptyState` (small): "No log lines yet." for an empty log, "No line matches “query”" with a Clear search action for a search with no result, and "No log lines match the current filters." for a level or warnings filter with no result. Slot: `empty` (replaces the EmptyState).
- `log-viewer-footer.vue` (`LogViewer.Footer`) — Optional footer region for actions (download, follow live, pagination). Slot: `default`.
- `log-viewer-steps.vue` (`LogViewer.Steps`) — A run with known steps, standalone (it renders its own `LogViewer` per step and needs no parent `LogViewer`). An optional toolbar row (`__toolbar`, shown when the `header` slot is filled or `viewSwitch` is on) holds the `header` slot at the start and, with `viewSwitch`, a `ToggleGroup` (`__view-switch`, named `Log view`) switching **Phased** and **Complete** at the end. Phased renders an `Accordion` (`type="single"`, collapsible) with one item per step (`__step`, `data-status`): the trigger shows the status glyph (success: a success check; error: a danger cross; skipped: a muted minus; running: a `Spinner`; pending: a dashed circle), the status in words for assistive technology (`sr-only`), the title, the `step-meta` slot, the description (danger text on error, a shimmer while running) and the duration; the panel holds a borderless `LogViewer` + `LogViewer.Content` over the step's lines, loading with `Waiting to start…` while the step is pending, and the `step-empty` slot in place of the empty state (a skipped step defaults to `Never ran.`). Complete renders every step's lines as one borderless `LogViewer` (`__complete`; line ids are prefixed with the step id). With `progress`, a flush, small, flat `Progress` (`__progress`, named `Run progress`) sits on the bottom edge; its value is the share of steps that succeeded. Props: `steps?: LogViewerStep[]` (default `[]`), `copyable?: boolean` (default `true`, forwarded to each log), `viewSwitch?: boolean` (default `true`), `progress?: boolean` (default `false`). Models: `v-model:view` (`LogViewerStepsView` = `'phased' | 'complete'`, default `'phased'`), `v-model:open-step` (`string`, the id of the open step; unbound, the running step opens, else the one in error, else none). Slots: `header`, `step-meta({ step })`, `step-empty({ step })`. Test ids: `log-viewer-steps` (a consumer `data-testid` wins) and `__toolbar`, `__view-switch`, `__step`, `__complete`, `__progress` under it.

## v-model

| Model            | Type                       | Default | Emits           | Notes                                                                                                                    |
| ---------------- | -------------------------- | ------- | --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `v-model:search` | `string`                   | `''`    | `update:search` | Two-way search query; filters LogViewerContent and highlights matches.                                                   |
| `v-model:level`  | `LogViewerLineLevel \| ''` | `''`    | `update:level`  | The level the log is filtered to; empty shows every level. A level toggle sets it and pressing the active one clears it. |

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

## Accessibility

- Visible focus on the interactive controls in the header/footer.
- LogViewerContent carries a visually hidden `role="log"` region (`aria-live="polite"`) that holds only the lines appended to `lines` since the last update (filtered by the current search and level). The scrolling log body is not a live region, so the lines already present at mount and the chunks that mount on scroll are never announced; replacing `lines` with a different log clears the region.
- The level filter is a `role="group"` named `Log levels`; each toggle is a button with `aria-pressed` named with its level and line count (`warn, 3 lines`), the level also in visible text, so the state is never colour only.
- The copy control (a CopyButton in LogViewerContent) uses `aria-label="Copy logs"` at rest, switching to `"Copied logs"` after a successful copy.
- The loading state uses `role="status"` with `aria-live="polite"`; the spinner is `aria-hidden` (from the Spinner component) and the `loadingLabel` text conveys status.
- `motion-reduce:transition-none` on every motion-bearing class.
- LogViewer.Steps: each step is an `Accordion` item (a button with `aria-expanded`); the status glyph is `aria-hidden` and the status is in the trigger's text (`sr-only`), so it is never colour or shape only; the view switch is a named `ToggleGroup`; the progress bar is a `progressbar` named `Run progress`.
- Touch target: level toggles (the `warn` shortcut included) stay 32 px high at every width, so the toolbar keeps its size on a phone; on `pointer: coarse` an invisible layer extends each one's hit area to 44 px tall; the copy control uses CopyButton `size="small"` (28×28 px) to match CodeBlock — a justified deviation for the compact overlay.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none mirror.
- Keyboard: no horizontal arrow-key logic.
- Isolation: timestamps and level labels render `dir="ltr"`; each message renders `dir="auto"`, so a log line in another script keeps its own direction.

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

## Responsive

- Container queries: none; the header stacks below `sm` and sits in one 48 px row from `sm`; the left group (line count, level toggles) stays on one row and scrolls sideways when it does not fit.
- Narrow: log lines stop wrapping and the body scrolls horizontally inside the ScrollArea; the page never does.
- Touch: level toggles keep their 32 px look and get a 44 px hit area on `pointer: coarse`; line hover is decoration only.
- Reflow: no horizontal page scroll at 320 px; the log body scrolls in both axes inside its frame.

## Examples

### Default

```vue
<script setup>
  import LogViewer from '@aziontech/webkit/log-viewer'
  import { ref } from 'vue'

  const lines = [
    { id: '1', time: '13:47:33', type: 'text', message: 'Deploy started successfully!' },
    { id: '2', time: '13:47:41', type: 'success', message: 'Build finished' },
    {
      id: '3',
      time: '13:47:42',
      type: 'folder',
      message: 'dist/index.js',
      folderType: 'asset',
      size: '12.4 kB',
      gzipSize: '4.1 kB'
    },
    {
      id: '4',
      time: '13:47:43',
      type: 'text',
      level: 'warn',
      message: 'Bundle larger than recommended'
    }
  ]
  const search = ref('')
  const level = ref('')
</script>

<template>
  <div class="h-[640px]">
    <LogViewer
      :lines="lines"
      v-model:search="search"
      v-model:level="level"
      class="h-full"
    >
      <LogViewer.Header />
      <LogViewer.Content />
    </LogViewer>
  </div>
</template>
```

### Borderless

```vue
<script setup>
  import LogViewer from '@aziontech/webkit/log-viewer'
  import { ref } from 'vue'

  const lines = [
    { id: '1', time: '13:47:33', type: 'text', message: 'Deploy started successfully!' },
    { id: '2', time: '13:47:41', type: 'success', message: 'Build finished' },
    {
      id: '3',
      time: '13:47:42',
      type: 'folder',
      message: 'dist/index.js',
      folderType: 'asset',
      size: '12.4 kB',
      gzipSize: '4.1 kB'
    },
    {
      id: '4',
      time: '13:47:43',
      type: 'text',
      level: 'warn',
      message: 'Bundle larger than recommended'
    }
  ]
  const search = ref('')
  const level = ref('')
</script>

<template>
  <div
    class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
  >
    <span class="text-label-sm text-(--text-muted)">Deploy output</span>
    <div class="mt-(--spacing-sm) h-[420px]">
      <LogViewer
        :lines="lines"
        :bordered="false"
        v-model:search="search"
        v-model:level="level"
        class="h-full"
      >
        <LogViewer.Header />
        <LogViewer.Content />
      </LogViewer>
    </div>
  </div>
</template>
```

### Loading

```vue
<script setup>
  import LogViewer from '@aziontech/webkit/log-viewer'
  import { ref } from 'vue'

  const lines = [
    { id: '1', time: '13:47:33', type: 'text', message: 'Deploy started successfully!' },
    { id: '2', time: '13:47:41', type: 'success', message: 'Build finished' },
    {
      id: '3',
      time: '13:47:42',
      type: 'folder',
      message: 'dist/index.js',
      folderType: 'asset',
      size: '12.4 kB',
      gzipSize: '4.1 kB'
    },
    {
      id: '4',
      time: '13:47:43',
      type: 'text',
      level: 'warn',
      message: 'Bundle larger than recommended'
    }
  ]
  const search = ref('')
  const level = ref('')
</script>

<template>
  <div class="h-[640px]">
    <LogViewer
      :lines="lines"
      loading
      v-model:search="search"
      v-model:level="level"
      class="h-full"
    >
      <LogViewer.Header />
      <LogViewer.Content />
    </LogViewer>
  </div>
</template>
```
