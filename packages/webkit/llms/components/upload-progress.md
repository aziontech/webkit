# Upload Progress

> A card that follows a file transfer to its end while the person keeps working: uploading files into a bucket, moving objects between folders or deleting them. Its header says what is happening and how far it got (`Uploading 2 of 5 files`) over one overall bar; below it each file has its own bar, its state and a Cancel or Retry button. When every file has finished the header turns into the outcome (`5 files uploaded`, or `4 files uploaded, 1 failed` with Retry failed) and the card can be closed. It floats at the inline-end bottom corner by default, so it survives route changes in the console shell. Taken from the Console Kit's object storage progress card, extended with the per-file list the design sample's bucket browser needs.

- Import: `import UploadProgress from '@aziontech/webkit/upload-progress'`
- Category: feedback · Surface: product · Structure: monolithic
- API as JSON: [upload-progress.json](https://github.com/aziontech/webkit/blob/main/.specs/upload-progress.json)

## When to use

- A bucket upload that keeps running after the upload dialog closes.
- A move or delete of many objects that takes more than a second or two.
- Any batch of file transfers where the person should be able to cancel one file, or retry the ones that failed.

## Do

- Keep the card until the person closes it when anything failed; close it yourself a few seconds after a clean finish if you like.
- Send `error` as the reason (`Connection lost`, `Larger than 300 MB`), not a status code.
- Update `progress` no more than a few times a second; the bars animate between values.
- Report the outcome with a toast only when the card is not in view (for example, after the person collapsed it and left the page).

## Don’t

- The files picked in a form before it is submitted → use `file-token-group`.
- A single action with no per-file parts (a deploy, a build) → use the async-submit toast (`toast` with Edit and Redeploy).
- Progress of a page load or a determinate step inside a form → use `progress`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [file-token-group](file-token-group.md) — the files picked for upload, before the transfer starts.
- [progress](progress.md) — the bar used for the overall and per-file progress.
- [toast](toast.md) — reports the outcome of a single async action.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `UploadProgressItem[]` | `[]` | false | The files in the transfer, in order, with their state and progress. |
| `operation` | `'upload' \| 'move' \| 'delete'` | `'upload'` | false | What the transfer does; picks the header wording and the glyph. |
| `title` | `string` | `''` | false | Overrides the header text. Empty builds it from the operation and the counts. |
| `floating` | `boolean` | `true` | false | Fixes the card to the inline-end bottom corner of the viewport; false renders it in the flow. |
| `cancelable` | `boolean` | `true` | false | Shows Cancel on running and waiting files and Cancel all in the header. |
| `collapsed` | `boolean` | `false` | false | Two-way value (`v-model:collapsed`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `cancel` | `(event: MouseEvent, id?: string)` | Cancel on one file (its `id`) or Cancel all (no `id`). The parent stops the transfer. |
| `retry` | `(event: MouseEvent, id?: string)` | Retry on one failed file (its `id`) or Retry failed (no `id`). |
| `close` | `(event: MouseEvent)` | Close was pressed; offered only once every file has finished. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `actions` | — | Buttons for the finished transfer beside Close (for example `Open folder`). Shown when done. |

## v-model

| Model               | Type      | Default | Emits              | Notes                                                     |
| ------------------- | --------- | ------- | ------------------ | --------------------------------------------------------- |
| `v-model:collapsed` | `boolean` | `false` | `update:collapsed` | Hides the file list and keeps the header and overall bar. |

## States

- Root `data-state`: `running` (some file queued or running) | `done` (all finished, none failed) | `failed` (all finished, at least one error).
- Root `data-floating` when floating; `data-collapsed` when the list is hidden.
- Row `data-status`: `queued` | `running` | `done` | `error` | `canceled`.

## Accessibility

- The card is a `section` named by the catalog (`File transfers`), a region landmark that screen-reader users can jump to.
- The header text is mirrored in a visually hidden `role="status"` region (polite), so each file finishing and the final outcome are announced; percentages are not announced.
- The overall bar is a `progressbar` named by the header text; each row bar is named `<file> progress`.
- Keyboard map: Tab reaches the collapse toggle (`aria-expanded`, `aria-controls` the list), Cancel all or Retry failed and Close, then each row's Cancel or Retry. After Close the card unmounts in the parent; the parent returns focus to the control that started the transfer.
- State is never colour alone: rows carry a status word (`Waiting`, `Done`, `Canceled`) or the error text, and an `OutcomeMark` in the header when finished.
- Contrast: text ≥ 4.5:1 on `--bg-surface-raised` in both themes.

## Right-to-left

- Layout: logical utilities only; the floating card anchors at `end-*`, so it sits at the bottom left under rtl.
- Icons: the chevron of the collapse toggle points up or down and is not mirrored; status glyphs are not mirrored.
- Keyboard: Tab order follows the reading order.
- User data: file names render in `<bdi>`.

## Internationalization

| Key                           | English source                                 | Override prop |
| ----------------------------- | ---------------------------------------------- | ------------- |
| `uploadProgress.label`        | File transfers                                 | —             |
| `uploadProgress.uploading`    | `Uploading {done} of {count} file(s)` (plural) | `title`       |
| `uploadProgress.moving`       | `Moving {done} of {count} file(s)` (plural)    | `title`       |
| `uploadProgress.deleting`     | `Deleting {done} of {count} file(s)` (plural)  | `title`       |
| `uploadProgress.uploaded`     | `{count} file(s) uploaded` (plural)            | `title`       |
| `uploadProgress.moved`        | `{count} file(s) moved` (plural)               | `title`       |
| `uploadProgress.deleted`      | `{count} file(s) deleted` (plural)             | `title`       |
| `uploadProgress.failed`       | `{count} failed` (plural)                      | —             |
| `uploadProgress.queued`       | Waiting                                        | —             |
| `uploadProgress.done`         | Done                                           | —             |
| `uploadProgress.canceled`     | Canceled                                       | —             |
| `uploadProgress.cancelAll`    | Cancel all                                     | —             |
| `uploadProgress.cancelItem`   | Cancel {name}                                  | —             |
| `uploadProgress.retryItem`    | Retry {name}                                   | —             |
| `uploadProgress.retryFailed`  | Retry failed                                   | —             |
| `uploadProgress.close`        | Close                                          | —             |
| `uploadProgress.expand`       | Show files                                     | —             |
| `uploadProgress.collapse`     | Hide files                                     | —             |
| `uploadProgress.itemProgress` | {name} progress                                | —             |

- Formatting: sizes with `formatFileSize`, percentages with `formatNumber` (`style: 'percent'`), plural rules with `Intl.PluralRules`, all from `useLocale`.

## Responsive

- Container queries: none. Floating, the card is `--container-xs` wide and capped to the viewport minus the gutters; below 640 px it spans the viewport width minus the gutters.
- Narrow: names truncate with an ellipsis and keep the full name in `title`; the list scrolls inside a capped height.
- Touch: buttons are `IconButton` and `Button` small (32 px).
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import UploadProgress from '@aziontech/webkit/upload-progress'
  import { onBeforeUnmount, ref } from 'vue'

  const initial = () => [
    { id: 'logo', name: 'logo.svg', size: 4210, status: 'done' },
    { id: 'app', name: 'app.js', size: 248_320, status: 'running', progress: 64 },
    { id: 'styles', name: 'styles.css', size: 52_100, status: 'running' },
    { id: 'hero', name: 'hero.webp', size: 1_482_000, status: 'queued' }
  ]

  const items = ref(initial())
  let timer = 0

  const tick = () => {
    let started = false
    items.value = items.value.map((item) => {
      if (item.status === 'running') {
        const progress = Math.min(100, (item.progress ?? 0) + 18)
        return progress >= 100 ? { ...item, status: 'done', progress } : { ...item, progress }
      }
      if (item.status === 'queued' && !started) {
        started = true
        return { ...item, status: 'running', progress: 0 }
      }
      return item
    })
    if (items.value.every((item) => item.status !== 'running' && item.status !== 'queued')) {
      clearInterval(timer)
    }
  }

  const start = () => {
    clearInterval(timer)
    items.value = initial()
    timer = setInterval(tick, 600)
  }

  const cancel = (id) => {
    items.value = items.value.map((item) =>
      (id === undefined || item.id === id) &&
      (item.status === 'running' || item.status === 'queued')
        ? { ...item, status: 'canceled' }
        : item
    )
  }

  onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) flex-col items-start gap-(--spacing-sm)">
    <Button
      label="Start upload"
      kind="secondary"
      size="medium"
      icon="pi pi-upload"
      @click="start"
    />
    <UploadProgress
      :items="items"
      :floating="false"
      @cancel="(_event, id) => cancel(id)"
    />
  </div>
</template>
```

### Finished

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import UploadProgress from '@aziontech/webkit/upload-progress'

  const items = [
    { id: 'logo', name: 'logo.svg', size: 4210, status: 'done' },
    { id: 'app', name: 'app.js', size: 248_320, status: 'done' },
    { id: 'video', name: 'intro.mp4', size: 96_400_000, status: 'error', error: 'Connection lost' },
    { id: 'styles', name: 'styles.css', size: 52_100, status: 'done' }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-xs)">
    <UploadProgress
      :items="items"
      :floating="false"
    >
      <template #actions>
        <Button
          label="Open folder"
          kind="secondary"
          size="small"
        />
      </template>
    </UploadProgress>
  </div>
</template>
```

### Move

```vue
<script setup>
  import UploadProgress from '@aziontech/webkit/upload-progress'
  import { ref } from 'vue'

  const collapsed = ref(true)

  const items = [
    { id: 'a', name: 'reports/2026-10.csv', size: 18_200, status: 'done' },
    { id: 'b', name: 'reports/2026-11.csv', size: 19_400, status: 'running', progress: 40 },
    { id: 'c', name: 'reports/summary.pdf', size: 402_000, status: 'queued' }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-xs)">
    <UploadProgress
      v-model:collapsed="collapsed"
      :items="items"
      operation="move"
      :floating="false"
    />
  </div>
</template>
```
