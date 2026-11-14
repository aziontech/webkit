# Log View

> Composition-based terminal log viewer for CI/deploy output. **LogView** is the root shell and context provider; **`LogView.Header`**, **`LogView.Content`**, and **`LogView.Footer`** are composed as children so teams can reorder, omit, or replace the toolbar and footer without forking the log renderer.

- Import: `import LogViewRoot from '@aziontech/webkit/log-view-root'`
- Compound import (dot notation, not tree-shakeable): `import LogView from '@aziontech/webkit/log-view'`
- Category: code · Surface: product · Structure: composition
- API as JSON: [log-view.json](https://github.com/aziontech/webkit/blob/main/.specs/log-view.json)

## When to use

- Showing build, deploy or CI output as timestamped lines the reader can search, filter to warnings, and copy.
- A log shell whose toolbar and footer vary by screen — compose `LogViewHeader`, `LogViewContent` and `LogViewFooter` in the order you need, or drop the ones you don't.
- A run log with levels (`debug`, `info`, `warn`, `error`), such as what a function printed during a test run: set `level` on each line and `levels` on the root, and the header filters by level with a count per level.
- A log that is still loading from the server — set `loading` to show a spinner and `loading-label` in place of the body.

## Do

- Give every line a stable `id` and a `type` (`text`, `folder`, `framework-version`, `success`, `warning`); the type drives the line's rendering and the warnings filter.
- For a run log, give each line a `level` and put the run offset (`120 ms`, `1.24 s`) in `time`; pass the levels the run can print as `levels` so every level is offered even when it has no line yet. Bind `v-model:level` when the app needs the chosen level.
- Bind `v-model:search` and `v-model:warnings-only` when the app needs the filter state; otherwise leave them unbound and the header manages them.
- Set `:bordered="false"` when the log sits inside a surface that already frames it (an accordion panel, a drawer).
- The copy control hides while `disabled` or `loading`, or when there is nothing to copy; listen to `@copy` for the copied text instead of reading the clipboard.
- Use the header's `left` / `right` / `search` slots and the footer's default slot to add actions, rather than rebuilding the toolbar.

## Don’t

- Static, read-only code or configuration snippets → use `code-block`.
- An animated terminal session on a marketing page → use `cli-terminal`.
- Rows of structured records with columns, sorting or paging → use `table`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [code-block](code-block.md) — highlighted source code with a copy action, not a stream of typed log lines.
- [cli-terminal](cli-terminal.md) — marketing band that plays a scripted terminal session.
- deploy-success` — the post-deploy screen that embeds `log-view` for the build log.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `lines` | `LogViewLine[]` | `[]` | false | Log entries; filtered in LogViewContent by search and warnings-only. |
| `bordered` | `boolean` | `true` | false | Draw the outer card border and corner radius around the log shell. On by default; set `:bordered="false"` to render the shell flush inside a surface that already frames it (an accordion panel, a drawer). Internal dividers (header/footer edges) are unaffected. |
| `searchPlaceholder` | `string` | `''` | false | Placeholder for the default header search field. Empty uses the locale catalog (`Find in logs`). |
| `copyable` | `boolean` | `true` | false | Shows the copy-to-clipboard control (a CopyButton pinned top-right over the log content in LogViewContent). |
| `disabled` | `boolean` | `false` | false | Disables toolbar controls in LogViewHeader. |
| `loading` | `boolean` | `false` | false | Replaces the LogViewContent log body with a centered spinner and label. |
| `loadingLabel` | `string` | `''` | false | Label shown beneath the spinner while `loading`. Empty uses the locale catalog (`Loading…`). |
| `levels` | `LogViewLineLevel[]` | `[]` | false | Levels the header offers as filter toggles, each with its line count; a level with no line is still offered. Empty hides the level filter. |
| `error` | `string` | `''` | false | Message shown in place of the log body when the log failed to load. Empty shows the log. |
| `search` | `string` | `''` | false | Two-way value (`v-model:search`). |
| `warningsOnly` | `boolean` | `false` | false | Two-way value (`v-model:warningsOnly`). |
| `level` | `LogViewLineLevel \| ''` | `''` | false | Two-way value (`v-model:level`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `copy` | `string` | Fires after a successful copy; payload is the copied plain text. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Sub-components (LogViewHeader, LogViewContent, LogViewFooter) composed in the desired order. |

## Sub-component imports

- `@aziontech/webkit/log-view-content`
- `@aziontech/webkit/log-view-footer`
- `@aziontech/webkit/log-view-header`

## Sub-components

LogView ships its sub-components attached to the root (`LogView.Header`, `LogView.Content`, `LogView.Footer`, via `index.ts`) and individually importable (each from its own `@aziontech/webkit/log-view-*` entry); every sub-component reads the root's shared state through the injected context, so the consumer wires nothing.

- `log-view-header.vue` (`LogView.Header`) — Default 48px toolbar: line count, warning filter (a native button, 32 px, 44 px on coarse pointers), the level filter (one toggle per entry of `levels`, with its line count) and a search field. Slots: `left`, `right`, `search`.
- `log-view-content.vue` (`LogView.Content`) — Scrollable log body with per-`type` line rendering, search highlighting, `ScrollArea`'s `fade` on the log body (the edges that still have lines beyond them fade out), and the copy-to-clipboard control (a `CopyButton` pinned top-right over the log content, shown when `copyable` is set). When `loading` is set, it replaces the log body with a centered `Spinner` (`@aziontech/webkit/spinner`) and the `loadingLabel` text (`role="status"`). When `error` is set, it replaces the body with a danger `Alert` holding the message. With no line to show, it renders the package `EmptyState` (small): "No log lines yet." for an empty log, "No line matches “query”" with a Clear search action for a search with no result, and "No log lines match the current filters." for a level or warnings filter with no result. Slot: `empty` (replaces the EmptyState).
- `log-view-footer.vue` (`LogView.Footer`) — Optional footer region for actions (download, follow live, pagination). Slot: `default`.

## v-model

| Model                   | Type                     | Default | Emits                 | Notes                                                                                                                                                                      |
| ----------------------- | ------------------------ | ------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:search`        | `string`                 | `''`    | `update:search`       | Two-way search query; filters LogViewContent and highlights matches.                                                                                                       |
| `v-model:warnings-only` | `boolean`                | `false` | `update:warningsOnly` | **@deprecated since 6.0 — use `v-model:level` with `'warn'`. Removed in 7.0.** When true, shows only warning lines (`level: 'warn'`, or the deprecated `type: 'warning'`). |
| `v-model:level`         | `LogViewLineLevel \| ''` | `''`    | `update:level`        | The level the log is filtered to; empty shows every level. A level toggle sets it and pressing the active one clears it.                                                   |

## States

- Visual states: `default`, `hover` (per log line), `focus-visible`, `disabled`, `loading`, `error`, `empty`
- `data-disabled` / `data-warnings-only` / `data-level` / `data-loading` / `data-error` / `data-border` on the LogView root
- `level` is the one severity axis: the warnings filter, the warning count and the level toggles all read `level`, falling back to `warn` for a deprecated `type: 'warning'` line
- `error` state: LogViewContent renders a danger `Alert` with the message in place of the log body; copy is hidden
- `empty` state: the package `EmptyState` (see LogViewContent above)
- `loading` state: LogViewContent renders a centered spinner + `loadingLabel` in place of the log body
- Log line `data-type` reflects `line.type` and `data-level` reflects `line.level`; `warn` rows take the warning tint, `error` rows the danger tint and danger text
- Level toggles carry `data-level` and `data-active` (the chosen level); every toggle shows the count of lines at its level in the whole log
- Long logs: above 300 visible lines `LogViewContent` mounts lines in chunks of 100 as they scroll near view (unmounted chunks keep an estimated 24 px per line), so a 10,000-line log mounts within its runtime budget. Search, warnings-only, the line count and copy work on every line, mounted or not.

## Accessibility

- Visible focus on the interactive controls in the header/footer.
- LogViewContent carries a visually hidden `role="log"` region (`aria-live="polite"`) that holds only the lines appended to `lines` since the last update (filtered by the current search and warnings-only view). The scrolling log body is not a live region, so the lines already present at mount and the chunks that mount on scroll are never announced; replacing `lines` with a different log clears the region.
- The level filter is a `role="group"` named `Log levels`; each toggle is a button with `aria-pressed` named with its level and line count (`warn, 3 lines`), the level also in visible text, so the state is never colour only.
- The warning filter exposes `aria-pressed`; the copy control (a CopyButton in LogViewContent) uses `aria-label="Copy logs"` at rest, switching to `"Copied logs"` after a successful copy.
- The loading state uses `role="status"` with `aria-live="polite"`; the spinner is `aria-hidden` (from the Spinner component) and the `loadingLabel` text conveys status.
- `motion-reduce:transition-none` on every motion-bearing class.
- Touch target: level toggles are 32 px high (44 px on `pointer: coarse`); the warning control is ≥40×40 px; the copy control uses CopyButton `size="small"` (28×28 px) to match CodeBlock — a justified deviation for the compact overlay.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none mirror.
- Keyboard: no horizontal arrow-key logic.
- Isolation: timestamps and level labels render `dir="ltr"`; each message renders `dir="auto"`, so a log line in another script keeps its own direction.

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

- Formatting: counts go through the plural rules of the active locale. Level names (`debug`, `info`, `warn`, `error`) are log tokens and stay untranslated, as they appear in the log itself.

## Responsive

- Container queries: none; the header stacks below `sm` and sits in one 48 px row from `sm`; the left group (line count, warning filter, level toggles) wraps.
- Narrow: log lines stop wrapping and the body scrolls horizontally inside the ScrollArea; the page never does.
- Touch: level toggles and the warning control grow on `pointer: coarse`; line hover is decoration only.
- Reflow: no horizontal page scroll at 320 px; the log body scrolls in both axes inside its frame.

## Examples

### Default

```vue
<script setup>
  import LogView from '@aziontech/webkit/log-view'
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
    { id: '4', time: '13:47:43', type: 'warning', message: 'Bundle larger than recommended' }
  ]
  const search = ref('')
  const level = ref('')
</script>

<template>
  <div class="h-[640px]">
    <LogView
      :lines="lines"
      v-model:search="search"
      v-model:level="level"
      class="h-full"
    >
      <LogView.Header />
      <LogView.Content />
    </LogView>
  </div>
</template>
```

### Borderless

```vue
<script setup>
  import LogView from '@aziontech/webkit/log-view'
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
    { id: '4', time: '13:47:43', type: 'warning', message: 'Bundle larger than recommended' }
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
      <LogView
        :lines="lines"
        :bordered="false"
        v-model:search="search"
        v-model:level="level"
        class="h-full"
      >
        <LogView.Header />
        <LogView.Content />
      </LogView>
    </div>
  </div>
</template>
```

### Loading

```vue
<script setup>
  import LogView from '@aziontech/webkit/log-view'
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
    { id: '4', time: '13:47:43', type: 'warning', message: 'Bundle larger than recommended' }
  ]
  const search = ref('')
  const level = ref('')
</script>

<template>
  <div class="h-[640px]">
    <LogView
      :lines="lines"
      loading
      v-model:search="search"
      v-model:level="level"
      class="h-full"
    >
      <LogView.Header />
      <LogView.Content />
    </LogView>
  </div>
</template>
```
