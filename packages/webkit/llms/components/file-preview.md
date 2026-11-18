# File Preview

> The preview of one stored file in a storage or object browser: a header with the file's glyph, name, type and size, a Download action, and a body that shows the file the way it can be read. An image renders as the image, text as wrapped monospace text, JSON pretty-printed, and any other type a no-preview state that points at Download. Long text is cut at `maxLength` characters with a note that says so. It renders what the app hands it (an image URL, the text it fetched); it fetches nothing.

- Import: `import FilePreview from '@aziontech/webkit/file-preview'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [file-preview.json](file-preview.json)

## When to use

- The detail pane or drawer of a file browser when a row is opened (`view/view-file-browser`, an Edge Storage bucket, a KV value).
- Showing an uploaded object before it is published or replaced.
- Any screen that shows one file and needs a type-aware fallback for files it cannot draw.

## Do

- Pass `mimeType` from the object's `Content-Type`; leave it empty and the file name's extension decides.
- Fetch only the first part of a large text file (a ranged request) and pass `bytes` with the full size, so the header shows the real size while the body shows the first part.
- Handle `download` with the app's own signed or authorized URL; the component never builds one.
- Pass an object URL (`URL.createObjectURL`) or a short-lived signed URL as `src`; revoke an object URL when the preview closes.

## Don’t

- Editing a file — use `CodeEditor`.
- Highlighted source code with tabs and copy — use `CodeBlock`.
- A list of files with upload progress — use `FileTokenGroup` or `UploadProgress`.
- A log stream — use `LogViewer`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `CodeBlock` — syntax-highlighted code; heavier, for a code sample rather than a stored object.
- `EmptyState` — the no-preview and error states inside this component.
- `Skeleton` — the loading placeholder inside this component.
- `DataTable` — the file list a preview opens from.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `fileName` | `string` | `—` | true | Name of the file, shown in the header and used as the image's alternative text. |
| `mimeType` | `string` | `''` | false | Media type of the file (`image/png`, `application/json`). Empty reads the type from the file extension. |
| `bytes` | `number` | `undefined` | false | Size of the whole file in bytes, shown beside the type. Unset hides the size. |
| `src` | `string` | `''` | false | URL of an image file to draw. An image with no `src` shows the no-preview state. |
| `content` | `string` | `''` | false | Text of a text or JSON file. JSON that parses is pretty-printed; JSON that does not shows as text. |
| `maxLength` | `number` | `20000` | false | Characters of text shown before the rest is cut, with a note that says how much is shown. |
| `loading` | `boolean` | `false` | false | Shows a placeholder in the body while the app fetches the file; the header stays. |
| `error` | `string` | `''` | false | Why the preview could not load. Set, the body shows the error state with this text. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `download` | `MouseEvent` | The Download button was pressed; the app starts the download. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `actions` | — | More actions in the header, before Download (copy link, delete). |

## States

- `data-type`: `image` | `text` | `json` | `unknown`, the way the body draws the file (derived from `mimeType`, then the extension).
- `data-loading` mirrors `loading`; the body is a `Skeleton` in a `role="status"` region and `aria-busy` is set.
- `error` set: the body is an `EmptyState` with the error text; Download stays available.
- An image that fails to load falls back to the no-preview state.
- Text over `maxLength` sets `data-truncated` and shows the truncation note.
- A text or JSON file with no content shows the empty-file line.

## Accessibility

- The root is a `section` named by the file name (`aria-labelledby`).
- The image's `alt` is the file name.
- The text body is a focusable, scrollable region (`tabindex="0"`, `role="region"`, named `Contents of <file>`) so a keyboard user can scroll it.
- Loading is a `role="status"` region named `Loading preview`; the root has `aria-busy`.
- Download is a real `Button` with a visible label; the glyph is decorative (`aria-hidden`).
- Keyboard: `Tab` reaches the `actions` slot, Download and the text body; arrow keys scroll the text body.
- Contrast ≥4.5:1 for the name, the meta line and the text.

## Right-to-left

- Layout: logical utilities only (`gap`, `ps-`/`pe-`, `text-start`); the header mirrors.
- Icons: none mirrored (file glyphs, download).
- Keyboard: unchanged.
- User data: the file name is in `<bdi>`; the text body is `dir="auto"` so code keeps its order on a right-to-left page.

## Internationalization

| Key                           | English source                                                              | Override prop |
| ----------------------------- | --------------------------------------------------------------------------- | ------------- |
| `filePreview.download`        | `Download`                                                                  | —             |
| `filePreview.loading`         | `Loading preview`                                                           | —             |
| `filePreview.contents`        | `Contents of {name}`                                                        | —             |
| `filePreview.noPreview`       | `No preview for this file type`                                             | —             |
| `filePreview.noPreviewDetail` | `Download the file to open it.`                                             | —             |
| `filePreview.error`           | `The preview could not load`                                                | `error`       |
| `filePreview.empty`           | `This file is empty.`                                                       | —             |
| `filePreview.truncated`       | `Showing the first {shown} characters. Download the file to see all of it.` | —             |

- Formatting: `formatFileSize` (`Intl.NumberFormat` units) for `bytes`, `formatNumber` for the truncation count, both with the `ConfigProvider` locale.

## Responsive

- Container queries: none; it fills its column or drawer.
- Narrow (≤ 640 px): the name truncates with an ellipsis, the meta line stays under it, the Download label stays.
- Touch: the Download button and the `actions` slot keep the `Button` touch target.
- Reflow: no horizontal page scroll at 320 px; long text lines wrap, and an image scales down to the body width.

## Examples

### Default

```vue
<script setup lang="ts">
  import FilePreview from '@aziontech/webkit/file-preview'

  const settings = JSON.stringify({
    name: 'acme-store',
    domains: ['www.example.com', 'shop.example.com'],
    cache: { ttl: 3600, browser: true },
    origin: { host: 'origin.example.com', protocol: 'https' }
  })

  const onDownload = (event: MouseEvent) => {
    event.preventDefault()
  }
</script>

<template>
  <FilePreview
    class="max-w-(--container-md)"
    file-name="settings.json"
    mime-type="application/json"
    :bytes="182"
    :content="settings"
    @download="onDownload"
  />
</template>
```

### Image

```vue
<script setup lang="ts">
  import illustration from '@aziontech/webkit/assets/ai-gateway.svg'
  import FilePreview from '@aziontech/webkit/file-preview'
</script>

<template>
  <FilePreview
    class="max-w-(--container-md)"
    file-name="ai-gateway.svg"
    mime-type="image/svg+xml"
    :bytes="18432"
    :src="illustration"
  />
</template>
```

### Text

```vue
<script setup lang="ts">
  import FilePreview from '@aziontech/webkit/file-preview'

  const paths = ['/', '/products', '/cart', '/checkout', '/api/orders']
  const log = Array.from(
    { length: 60 },
    (_, index) =>
      `2026-11-09T10:${String(index % 60).padStart(2, '0')}:00Z GET ${paths[index % paths.length]} ${index % 7 === 0 ? 404 : 200} ${12 + (index % 9) * 7}ms`
  ).join('\n')
</script>

<template>
  <FilePreview
    class="max-w-(--container-md)"
    file-name="access-2026-11-09.log"
    mime-type="text/plain"
    :bytes="48210"
    :content="log"
    :max-length="600"
  />
</template>
```
