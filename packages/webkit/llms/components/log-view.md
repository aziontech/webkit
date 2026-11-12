# Log View

> Composition-based terminal log viewer for CI/deploy output. **LogView** is the root shell and context provider; **LogViewHeader**, **LogViewContent**, and **LogViewFooter** are composed as children so teams can reorder, omit, or replace the toolbar and footer without forking the log renderer.

- Import: `import LogView from '@aziontech/webkit/log-view'`
- Category: code · Surface: product · Structure: composition
- API as JSON: [log-view.json](https://github.com/aziontech/webkit/blob/main/.specs/log-view.json)

## When to use

- Showing build, deploy or CI output as timestamped lines the reader can search, filter to warnings, and copy.
- A log shell whose toolbar and footer vary by screen — compose `LogViewHeader`, `LogViewContent` and `LogViewFooter` in the order you need, or drop the ones you don't.
- A log that is still loading from the server — set `loading` to show a spinner and `loading-label` in place of the body.

## Do

- Give every line a stable `id` and a `type` (`text`, `folder`, `framework-version`, `success`, `warning`); the type drives the line's rendering and the warnings filter.
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
| `search` | `string` | `''` | false | Two-way value (`v-model:search`). |
| `warningsOnly` | `boolean` | `false` | false | Two-way value (`v-model:warningsOnly`). |

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

LogView ships flat, individually importable sub-components (each from its own `@aziontech/webkit/log-view-*` entry); every sub-component reads the root's shared state through the injected context, so the consumer wires nothing.

- `log-view-header.vue` — Default 48px toolbar: line count, warning filter, and a search field. Slots: `left`, `right`, `search`.
- `log-view-content.vue` — Scrollable log body with per-`type` line rendering, search highlighting, `ScrollArea`'s `fade` on the log body (the edges that still have lines beyond them fade out), and the copy-to-clipboard control (a `CopyButton` pinned top-right over the log content, shown when `copyable` is set). When `loading` is set, it replaces the log body with a centered `Spinner` (`@aziontech/webkit/spinner`) and the `loadingLabel` text (`role="status"`). Slot: `empty`.
- `log-view-footer.vue` — Optional footer region for actions (download, follow live, pagination). Slot: `default`.

## v-model

| Model                   | Type      | Default | Emits                 | Notes                                                                |
| ----------------------- | --------- | ------- | --------------------- | -------------------------------------------------------------------- |
| `v-model:search`        | `string`  | `''`    | `update:search`       | Two-way search query; filters LogViewContent and highlights matches. |
| `v-model:warnings-only` | `boolean` | `false` | `update:warningsOnly` | When true, shows only lines whose `type` is `warning`.               |

## States

- Visual states: `default`, `hover` (per log line), `focus-visible`, `disabled`, `loading`
- `data-disabled` / `data-warnings-only` / `data-loading` / `data-border` on the LogView root
- `loading` state: LogViewContent renders a centered spinner + `loadingLabel` in place of the log body
- Log line `data-type` reflects `line.type`
- Long logs: above 300 visible lines `LogViewContent` mounts lines in chunks of 100 as they scroll near view (unmounted chunks keep an estimated 24 px per line), so a 10,000-line log mounts within its runtime budget. Search, warnings-only, the line count and copy work on every line, mounted or not.

## Accessibility

- Visible focus on the interactive controls in the header/footer.
- LogViewContent carries a visually hidden `role="log"` region (`aria-live="polite"`) that holds only the lines appended to `lines` since the last update (filtered by the current search and warnings-only view). The scrolling log body is not a live region, so the lines already present at mount and the chunks that mount on scroll are never announced; replacing `lines` with a different log clears the region.
- The warning filter exposes `aria-pressed`; the copy control (a CopyButton in LogViewContent) uses `aria-label="Copy logs"` at rest, switching to `"Copied logs"` after a successful copy.
- The loading state uses `role="status"` with `aria-live="polite"`; the spinner is `aria-hidden` (from the Spinner component) and the `loadingLabel` text conveys status.
- `motion-reduce:transition-none` on every motion-bearing class.
- Touch target: the warning control is ≥40×40 px; the copy control uses CopyButton `size="small"` (28×28 px) to match CodeBlock — a justified deviation for the compact overlay.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none mirror.
- Keyboard: no horizontal arrow-key logic.
- Isolation: timestamps render `dir="ltr"`; each message renders `dir="auto"`, so a log line in another script keeps its own direction.

## Examples

### Default

```vue
<script setup>
  import LogView from '@aziontech/webkit/log-view'
  import LogViewContent from '@aziontech/webkit/log-view-content'
  import LogViewHeader from '@aziontech/webkit/log-view-header'
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
  const warningsOnly = ref(false)
</script>

<template>
  <div class="h-[640px]">
    <LogView
      :lines="lines"
      v-model:search="search"
      v-model:warnings-only="warningsOnly"
      class="h-full"
    >
      <LogViewHeader />
      <LogViewContent />
    </LogView>
  </div>
</template>
```

### Flush

```vue
<script setup>
  import LogView from '@aziontech/webkit/log-view'
  import LogViewContent from '@aziontech/webkit/log-view-content'
  import LogViewHeader from '@aziontech/webkit/log-view-header'
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
  const warningsOnly = ref(false)
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
        v-model:warnings-only="warningsOnly"
        class="h-full"
      >
        <LogViewHeader />
        <LogViewContent />
      </LogView>
    </div>
  </div>
</template>
```

### Loading

```vue
<script setup>
  import LogView from '@aziontech/webkit/log-view'
  import LogViewContent from '@aziontech/webkit/log-view-content'
  import LogViewHeader from '@aziontech/webkit/log-view-header'
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
  const warningsOnly = ref(false)
</script>

<template>
  <div class="h-[640px]">
    <LogView
      :lines="lines"
      loading
      v-model:search="search"
      v-model:warnings-only="warningsOnly"
      class="h-full"
    >
      <LogViewHeader />
      <LogViewContent />
    </LogView>
  </div>
</template>
```
