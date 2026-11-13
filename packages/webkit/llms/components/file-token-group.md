# File Token Group

> The files a person picked for upload, shown as removable tokens before or while they upload: each token names the file with a glyph for its type, its size and, when asked, its last-modified date, carries a progress bar while it uploads and its own error or warning line when it cannot be sent. It pairs with `file-dropzone` (which receives the files) and with a Browse files button: the product keeps the list, the group renders it and reports which token was removed. Taken from Cloudscape's file token group; the Console Kit and the design sample list files by hand.

- Import: `import FileTokenGroup from '@aziontech/webkit/file-token-group'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [file-token-group.json](https://github.com/aziontech/webkit/blob/main/.specs/file-token-group.json)

## When to use

- Under a `FileDropzone` or a Browse files button in a form, to show what will be uploaded and let the person drop a file before submitting.
- In an upload dialog, to show each file's progress and the files that were refused (too large, wrong type) with the reason.
- Read-only, in a review step, to list the attachments that will be sent.

## Do

- Keep the refused files in the list with their error, so the person sees why and can remove them; do not drop them silently.
- Write each error as the reason and the limit (`Larger than 300 MB`), not as a code.
- Use `limit` when more than five files are common, so the form below stays in view.
- Remove the file from your list on `dismiss`; the group moves focus to the next token for you.

## Don’t

- A running transfer that should follow the person around the console → use `upload-progress`.
- Files already stored in a bucket or a repository → use `table` (the file browser block).
- Free-text tags or labels → use `tag-editor` or `chip`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [file-dropzone](file-dropzone.md) — receives dropped files; the group lists them.
- [upload-progress](upload-progress.md) — the floating card for transfers that keep running after the dialog closes.
- [chip](chip.md) — a removable label without file details.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `FileTokenGroupItem[]` | `[]` | false | The files, in order; each with its optional upload state, error and warning. |
| `alignment` | `'vertical' \| 'horizontal'` | `'vertical'` | false | Vertical stacks full-width tokens; horizontal wraps compact tokens in rows. |
| `limit` | `number` | `0` | false | Shows this many tokens and a Show more toggle for the rest. 0 shows them all. |
| `showFileSize` | `boolean` | `true` | false | Shows the size beside the name, formatted for the locale. |
| `showFileLastModified` | `boolean` | `false` | false | Shows the last-modified date, formatted for the locale. |
| `readonly` | `boolean` | `false` | false | Hides the remove buttons; the list is for reading only. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list. Empty uses the locale catalog (`Files`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `dismiss` | `(event: MouseEvent, payload: { index: number; item: FileTokenGroupItem })` | The remove button of the token at `index` was pressed. The parent removes it from `items`. |

## States

- Root `data-alignment`: `vertical` | `horizontal`; `data-readonly` when read-only.
- Token `data-status`: `idle` | `loading` | `warning` | `error` (error wins over warning, both over loading).
- Show more toggle: `aria-expanded` `true` | `false`.
- A file with a `webkitRelativePath` (picked with a folder picker or dropped as a folder on `FileDropzone directories`) is named by that path (`site/css/main.css`) in the token, its title, the remove button and the progress bar; otherwise by `name`.

## Accessibility

- The root is a `ul` (`role="list"`) named by `ariaLabel` or the catalog; each token is a `li`.
- Each remove button is an `IconButton` named `Remove <file name>`; its `aria-describedby` points at the token's error or warning line, so the reason is read with it.
- Keyboard map: Tab reaches each remove button and the Show more toggle in order; Enter or Space removes. After a removal focus moves to the remove button now at the same index, else the previous one, else the list itself (`tabindex="-1"`).
- An error or warning is shown as text with an icon, never by colour alone (WCAG 1.4.1); the uploading bar is a `progressbar` named `Uploading <file name>`.
- Contrast: name and meta ≥ 4.5:1 on `--bg-surface` in both themes; the danger border ≥ 3:1.

## Right-to-left

- Layout: logical utilities only (`ms-auto`, `ps-`, `text-start`); the remove button sits at the inline end.
- Icons: file glyphs and the cross are not mirrored.
- Keyboard: Tab order follows the reading order.
- User data: file names render in `<bdi>` so a Latin name keeps its order inside rtl text.

## Internationalization

| Key                        | English source                                                | Override prop |
| -------------------------- | ------------------------------------------------------------- | ------------- |
| `fileTokenGroup.label`     | Files                                                         | `ariaLabel`   |
| `fileTokenGroup.remove`    | Remove {name}                                                 | —             |
| `fileTokenGroup.uploading` | Uploading {name}                                              | —             |
| `fileTokenGroup.modified`  | Modified {date}                                               | —             |
| `fileTokenGroup.showMore`  | `Show {count} more file` / `Show {count} more files` (plural) | —             |
| `fileTokenGroup.showFewer` | Show fewer files                                              | —             |

- Formatting: sizes with `formatFileSize`, dates with `formatDate` (`dateStyle: 'medium'`), both from `useLocale`.

## Responsive

- Container queries: none; vertical tokens fill their container, horizontal tokens are at most `--container-3xs` wide and wrap.
- Narrow: names truncate with an ellipsis and keep the full name in `title`.
- Touch: the remove button is a small `IconButton` (32 px), 44 px hit area on `pointer: coarse` through the button.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import { ref } from 'vue'

  const LIMIT = 300 * 1024 * 1024

  const input = ref(null)
  const items = ref([
    { file: { name: 'logo.svg', size: 4210, type: 'image/svg+xml' } },
    { file: { name: 'index.html', size: 18432, type: 'text/html' } },
    { file: { name: 'site-backup.tar', size: 412_000_000 }, error: 'Larger than 300 MB' },
    { file: { name: 'notes.txt', size: 0, type: 'text/plain' }, warning: 'This file is empty' }
  ])

  const toItem = (file) => ({
    file,
    error: file.size > LIMIT ? 'Larger than 300 MB' : undefined,
    warning: file.size === 0 ? 'This file is empty' : undefined
  })

  const add = (files) => {
    items.value = [...items.value, ...Array.from(files).map(toItem)]
  }

  const onPick = (event) => {
    add(event.target.files ?? [])
    event.target.value = ''
  }

  const remove = (index) => {
    items.value = items.value.filter((_, position) => position !== index)
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-md) flex-col gap-(--spacing-sm)">
    <FileDropzone
      description="Up to 300 MB per file."
      @drop="(event, files) => add(files)"
    >
      <Button
        label="Browse files"
        kind="secondary"
        size="medium"
        @click="input?.click()"
      />
    </FileDropzone>
    <input
      ref="input"
      type="file"
      multiple
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      @change="onPick"
    />
    <FileTokenGroup
      :items="items"
      @dismiss="(_event, { index }) => remove(index)"
    />
  </div>
</template>
```

### Uploading

```vue
<script setup>
  import FileTokenGroup from '@aziontech/webkit/file-token-group'

  const items = [
    {
      file: { name: 'hero.webp', size: 1_482_000, type: 'image/webp', lastModified: 1762790400000 },
      loading: false
    },
    {
      file: { name: 'app.js', size: 248_320, type: 'text/javascript' },
      loading: true,
      progress: 64
    },
    { file: { name: 'styles.css', size: 52_100, type: 'text/css' }, loading: true },
    {
      file: { name: 'archive.zip', size: 512_000_000, type: 'application/zip' },
      error: 'Larger than 300 MB'
    }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <FileTokenGroup
      :items="items"
      show-file-last-modified
      aria-label="Files to upload"
    />
  </div>
</template>
```

### Horizontal

```vue
<script setup>
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import { ref } from 'vue'

  const items = ref(
    ['robots.txt', 'favicon.ico', 'sitemap.xml', 'manifest.json', 'og-image.png', 'fonts.css'].map(
      (name, index) => ({ file: { name, size: 1024 * (index + 2) } })
    )
  )

  const remove = (index) => {
    items.value = items.value.filter((_, position) => position !== index)
  }
</script>

<template>
  <div class="w-full max-w-(--container-lg)">
    <FileTokenGroup
      :items="items"
      alignment="horizontal"
      :limit="3"
      @dismiss="(_event, { index }) => remove(index)"
    />
  </div>
</template>
```
