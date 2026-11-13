# Artifact Canvas

> The side panel that shows one generated artifact in full next to the conversation: a SQL file, a configuration, a table of results, a document. A header names it (title, meta, Close), a toolbar pages through its versions with `ResponseBranches` and offers Copy and Download, and the body scrolls on its own. It is the full view behind `ArtifactPreview`'s Open: the preview sits in the message, the canvas beside the thread. The owner places it in a `Resizable` pane, so the reader can widen it, narrow it or collapse it from the keyboard; the canvas fills whatever the pane gives it. Benchmarks: the artifact or canvas panel of chat assistants (a document beside the thread with versions), Cloudscape's split panel (a resizable side region with its own header and close).

- Import: `import ArtifactCanvas from '@aziontech/webkit/artifact-canvas'`
- Category: ai · Surface: product · Structure: monolithic
- API as JSON: [artifact-canvas.json](https://github.com/aziontech/webkit/blob/main/.specs/artifact-canvas.json)

## When to use

- An assistant answer produced something longer than a message can show: a file, a long query, a table, a document the reader will copy or keep.
- The reader asks for changes to that thing and each answer makes a new version to compare with the earlier ones.
- The reader reads the artifact and keeps chatting at the same time.

## Do

- Open the canvas from `ArtifactPreview`'s Open, then call `focus()` so the reader lands on its title; on Close return focus to the Open that opened it.
- Put it in a `Resizable.Pane` with a `min` that keeps the toolbar on one row (about 320 px) and a handle named after the canvas (`Resize the artifact`).
- Show the newest version when a new one finishes (set `v-model:version` to the last index); while it is generated set `streaming`, which locks the pager and marks the body busy.
- Keep Copy and Download about the version shown; `copyValue` and `downloadHref` change with `version`.
- One canvas at a time. Opening another artifact replaces the content and keeps the pane width.

## Don’t

- A short snippet that fits the message → `CodeBlock` or `ArtifactPreview` inside `ChatMessage`.
- A setting or a form the reader must fill → `Drawer` with the form.
- Help text about the page → `HelpPanel`.
- A narrow screen: show the same canvas in a full-height `Drawer` instead of a side pane (see Responsive).
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [artifact-preview](artifact-preview.md) — the card in the message; its Open opens this canvas.
- [response-branches](response-branches.md) — the version pager the toolbar reuses.
- [resizable](resizable.md) — the split the owner puts the canvas in (pane, handle, collapse).
- [chat-message](chat-message.md), `conversation` — the thread beside the canvas.
- [copy-button](copy-button.md) — the Copy control.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | File name or title of the artifact (`top-orders.sql`); names the panel. |
| `meta` | `string` | `''` | false | Facts that help recognize it, after the title: language, size, rows (`SQL · 12 lines`). |
| `kind` | `'code' \| 'table' \| 'document'` | `'document'` | false | What the artifact is; picks the icon and `data-kind`. The body is always the owner's slot. |
| `versions` | `number` | `1` | false | How many versions exist. With more than one, the toolbar shows the `ResponseBranches` pager. |
| `copyValue` | `string` | `''` | false | Text the Copy control puts on the clipboard, of the version shown. Empty hides Copy. |
| `downloadHref` | `string` | `''` | false | URL of the version shown, for Download (`download` takes the title). Empty hides Download. |
| `streaming` | `boolean` | `false` | false | A new version is being generated: the pager locks, the body is `aria-busy` and a polite status says so. |
| `version` | `number` | `0` | false | Two-way value (`v-model:version`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `close` | `(event: MouseEvent \| KeyboardEvent)` |  |
| `copy` | `value: string` |  |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | { version: number } | The artifact of the version shown: a `CodeBlock`, a `TableRoot`, prose. Scrolls inside. |
| `actions` | — | Extra icon actions in the toolbar, before Copy and Download (Insert into editor, Run). |

## Sub-components

_none_ — monolithic. The split and the handle are `Resizable`'s; the pager is `ResponseBranches`. Exposes `focus()`, which moves focus to the panel title (`tabindex="-1"`) for the owner to call after opening.

## v-model

| Model             | Type     | Default | Emits            | Notes                                                                 |
| ----------------- | -------- | ------- | ---------------- | --------------------------------------------------------------------- |
| `v-model:version` | `number` | `0`     | `update:version` | Zero-based index of the version shown, clamped by `ResponseBranches`. |

## States

- `data-kind` on the root (`code`, `table`, `document`); `data-streaming` while a version is generated.
- One version: no pager; the toolbar keeps Copy and Download, and is not drawn when neither is set and the `actions` slot is empty.
- `streaming`: the pager is disabled, the body has `aria-busy="true"`, and the status reads `Generating a new version`.
- No `copyValue` / `downloadHref`: that control is not drawn.

## Accessibility

- The root is a `section` named by its title (`aria-labelledby`), so it is a region landmark (`top-orders.sql`). The title is an `h2` with `tabindex="-1"`, the target of `focus()`.
- Close is an `IconButton` named `Close <title>`; Copy `Copy <title>`; Download `Download <title>`. The pager is `ResponseBranches` (`Artifact versions`, `Previous version`, `Next version`, a polite `2 of 3`).
- The body is a focusable scroll region named `<title> content`, so keyboard readers can scroll a long artifact; it is `aria-busy` while streaming.
- Keyboard: `Tab` order is title actions, then the toolbar, then the body; `Escape` anywhere inside closes the panel unless an inner control already handled it (`defaultPrevented`). Resizing is `Resizable.Handle`'s (arrow keys, Home, End).
- The streaming status is a polite live region, announced once when generation starts.

## Right-to-left

- Layout: logical utilities only; the panel's inner layout mirrors, Close sits at the inline end.
- Icons: the pager chevrons mirror through `ResponseBranches`; the other icons are not directional.
- Keyboard: none beyond the inner controls.
- User data: code bodies keep their own direction (`CodeBlock` is LTR); the title is `dir="auto"`.

## Internationalization

| Key                        | English source             | Override prop |
| -------------------------- | -------------------------- | ------------- |
| `artifactCanvas.close`     | `Close {title}`            | —             |
| `artifactCanvas.copy`      | `Copy {title}`             | —             |
| `artifactCanvas.download`  | `Download {title}`         | —             |
| `artifactCanvas.versions`  | `Artifact versions`        | —             |
| `artifactCanvas.content`   | `{title} content`          | —             |
| `artifactCanvas.streaming` | `Generating a new version` | —             |

- The title and the meta are the owner's text; the title has `dir="auto"`.

## Responsive

- Container queries: none; the canvas fills its pane (`h-full w-full`), and the toolbar wraps.
- Narrow: under the `md` breakpoint the owner shows the canvas in a full-height `Drawer` instead of a pane; the component is the same.
- Touch: icon controls are `IconButton` small, with its 40 px touch target.
- Reflow: no horizontal page scroll at 320 px; wide content scrolls inside the body.

## Examples

### Default

```vue
<script setup>
  import ArtifactCanvas from '@aziontech/webkit/artifact-canvas'
  import ArtifactPreview from '@aziontech/webkit/artifact-preview'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Resizable from '@aziontech/webkit/resizable'
  import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

  const versions = [
    'SELECT * FROM orders;',
    'SELECT id, customer_id, total\nFROM orders\nORDER BY total DESC;',
    'SELECT id, customer_id, total\nFROM orders\nWHERE created_at > now() - interval 7 day\nORDER BY total DESC\nLIMIT 10;'
  ]
  const version = ref(versions.length - 1)
  const open = ref(true)
  const width = ref(420)
  const height = ref(240)
  const narrow = ref(false)
  let narrowQuery = null
  const onNarrowChange = () => {
    narrow.value = !!narrowQuery?.matches
  }
  onMounted(() => {
    narrowQuery = window.matchMedia?.('(max-width: 639px)') ?? null
    onNarrowChange()
    narrowQuery?.addEventListener('change', onNarrowChange)
  })
  onBeforeUnmount(() => narrowQuery?.removeEventListener('change', onNarrowChange))
  const canvas = ref(null)
  const opener = ref(null)

  const show = async () => {
    open.value = true
    await nextTick()
    canvas.value?.focus()
  }
  const hide = async () => {
    open.value = false
    await nextTick()
    opener.value?.querySelector('button')?.focus()
  }
</script>

<template>
  <div
    class="w-full rounded-(--shape-card) border border-(--border-default)"
    :class="narrow ? 'h-(--container-md)' : 'h-(--container-xs)'"
  >
    <Resizable
      :orientation="narrow ? 'vertical' : 'horizontal'"
      class="h-full"
      aria-label="Conversation and artifact"
    >
      <Resizable.Pane>
        <div
          ref="opener"
          class="flex h-full flex-col gap-(--spacing-sm) overflow-auto p-(--spacing-md)"
        >
          <p class="m-0 text-body-sm text-(--text-default)">
            Here are the ten biggest orders of the last seven days.
          </p>
          <ArtifactPreview
            title="top-orders.sql"
            meta="SQL"
            icon="pi pi-code"
            openable
            @open="show"
          />
        </div>
      </Resizable.Pane>
      <Resizable.Handle
        v-if="open"
        aria-label="Resize the artifact"
      />
      <Resizable.Pane
        v-if="open"
        :basis="narrow ? height : width"
        :min="narrow ? 160 : 300"
        :max="narrow ? 360 : 720"
        @update:basis="(value) => (narrow ? (height = value) : (width = value))"
      >
        <ArtifactCanvas
          ref="canvas"
          v-model:version="version"
          title="top-orders.sql"
          :meta="`SQL · ${versions[version].split('\n').length} lines`"
          kind="code"
          :versions="versions.length"
          :copy-value="versions[version]"
          @close="hide"
        >
          <CodeBlock
            :tabs="[{ label: 'SQL', value: 'sql', code: versions[version], language: 'sql' }]"
            :copyable="false"
            :bordered="false"
          />
        </ArtifactCanvas>
      </Resizable.Pane>
    </Resizable>
  </div>
</template>
```

### Table

```vue
<script setup>
  import ArtifactCanvas from '@aziontech/webkit/artifact-canvas'
  import Button from '@aziontech/webkit/button'
  import { onBeforeUnmount, ref } from 'vue'

  const rows = [
    { country: 'United States', requests: '1,204,330', hit: '92%' },
    { country: 'United Kingdom', requests: '884,102', hit: '89%' },
    { country: 'Portugal', requests: '120,448', hit: '95%' }
  ]
  const streaming = ref(false)
  let timer = 0

  const regenerate = () => {
    streaming.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      streaming.value = false
    }, 1500)
  }
  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="flex w-full max-w-(--container-md) flex-col gap-(--spacing-sm)">
    <div
      class="h-(--container-3xs) overflow-hidden rounded-(--shape-card) border border-(--border-default)"
    >
      <ArtifactCanvas
        title="cache-hits-by-country.csv"
        meta="Last 7 days · 3 rows"
        kind="table"
        :streaming="streaming"
        download-href="data:text/csv;charset=utf-8,country,requests,hit"
      >
        <table class="w-full border-collapse text-body-sm">
          <thead class="bg-(--bg-surface-raised)">
            <tr>
              <th
                scope="col"
                class="px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm"
              >
                Country
              </th>
              <th
                scope="col"
                class="px-(--spacing-sm) py-(--spacing-xs) text-end text-label-sm"
              >
                Requests
              </th>
              <th
                scope="col"
                class="px-(--spacing-sm) py-(--spacing-xs) text-end text-label-sm"
              >
                Hit ratio
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in rows"
              :key="row.country"
              class="border-t border-(--border-muted)"
            >
              <td class="px-(--spacing-sm) py-(--spacing-xs)">{{ row.country }}</td>
              <td class="px-(--spacing-sm) py-(--spacing-xs) text-end tabular-nums">
                {{ row.requests }}
              </td>
              <td class="px-(--spacing-sm) py-(--spacing-xs) text-end tabular-nums">
                {{ row.hit }}
              </td>
            </tr>
          </tbody>
        </table>
      </ArtifactCanvas>
    </div>
    <Button
      class="self-start"
      label="Regenerate"
      kind="outlined"
      size="small"
      icon="pi pi-refresh"
      :loading="streaming"
      @click="regenerate"
    />
  </div>
</template>
```
