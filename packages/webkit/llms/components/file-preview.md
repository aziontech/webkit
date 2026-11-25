# File Preview

> The preview of one stored file in a storage or object browser, or of a document in an AI conversation (a PDF the reader attaches or a model returns): a header with the file's glyph, name, type and size, a Download action, and a body that shows the file the way it can be read. An image renders as the image, a PDF in the browser's own PDF viewer, text as wrapped monospace text, JSON pretty-printed, and any other type a no-preview state that points at Download. Audio and video files are recognized (their glyph and type) and show the file card with Download; this component plays nothing. Long text is cut at `maxLength` characters with a note that says so. The file comes as a URL (`src`), as text (`content`) or as base64 bytes (`base64`, the shape a chat message carries); it renders what the app hands it and fetches nothing.

- Import: `import FilePreview from '@aziontech/webkit/file-preview'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [file-preview.json](file-preview.json)

## When to use

- The detail pane or drawer of a file browser when a row is opened (`view/view-file-browser`, an Edge Storage bucket, a KV value).
- Showing an uploaded object before it is published or replaced.
- A document part or an attachment in an AI conversation: a PDF, a text file or an image, from a URL or from base64 bytes.
- Any screen that shows one file and needs a type-aware fallback for files it cannot draw.

## Do

- Pass `mimeType` from the object's `Content-Type`; leave it empty and the file name's extension decides.
- Fetch only the first part of a large text file (a ranged request) and pass `bytes` with the full size, so the header shows the real size while the body shows the first part.
- Handle `download` with the app's own signed or authorized URL; the component never builds one.
- Pass an object URL (`URL.createObjectURL`) or a short-lived signed URL as `src`; revoke an object URL when the preview closes.
- `src` goes through `safeHref` (file schemes allowed): `javascript:`, `file:`, a protocol-relative `//host` URL and any other scheme draw nothing, as every other URL-taking component does. An image or PDF URL loads with no click, so an app that shows URLs a model or a tool returned should allow only its own origins before it passes them, or show a click-to-load placeholder. A `Content-Security-Policy` with `object-src 'none'` blocks the PDF viewer; allow `object-src 'self' blob:` where PDFs are previewed.
- When the app holds the bytes rather than a URL (a chat message part with base64 data), pass them as `base64` with `mimeType`; the component makes its own object URL for an image or PDF and revokes it when the source changes or the preview unmounts. Text and JSON are decoded into the body.
- A PDF is drawn by the browser's own viewer; where there is none (most phones, a viewer turned off), the body shows the no-preview state and Download stays.

## Don’t

- Editing a file — use `CodeEditor`.
- Highlighted source code with tabs and copy — use `CodeBlock`.
- A list of files with upload progress — use `FileTokenGroup` or `UploadProgress`.
- A log stream — use `LogViewer`.
- Playing audio or video — this component shows those files as a card with Download, not a player.
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
| `src` | `string` | `''` | false | URL of an image or PDF file to draw: https, http, blob, data or a relative path; any other scheme draws nothing. Set, it wins over `base64`. |
| `base64` | `string` | `''` | false | Base64 bytes of the file, for an app that holds the file rather than a URL. Text and JSON are decoded into the body when `content` is empty; an image or PDF with no `src` is drawn from them. |
| `content` | `string` | `''` | false | Text of a text or JSON file. JSON that parses is pretty-printed; JSON that does not shows as text. Set, it wins over `base64`. |
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

- `data-type`: `image` | `pdf` | `audio` | `video` | `text` | `json` | `unknown`, the kind of file the body draws (derived from `mimeType`, then the extension: `application/pdf` or `.pdf`, `audio/*` or an audio extension, `video/*` or a video extension).
- Header glyph per type: `image` `az az-image`, `pdf` `az az-file-pdf`, `audio` `az az-headphones`, `video` `az az-video`, `json` `az az-json`, `text` and `unknown` `az az-file`.
- A PDF with a source is an `object` (`type="application/pdf"`) of that source in the browser's PDF viewer, `var(--container-lg)` tall, with the ring token on keyboard focus; its fallback content is the no-preview state. Where the browser reports no PDF viewer (`navigator.pdfViewerEnabled` is `false`), or the PDF has no source, `data-type` stays `pdf` (glyph and type in the header) and only the body shows the no-preview state.
- Server render: `navigator` and `URL.createObjectURL` exist only in the browser, so the server and the first client render show a PDF's body as the no-preview state, and an image or PDF given only as `base64` with no source yet. After mount the component makes the object URL from `base64` and swaps the PDF `object` in when a viewer exists and a source resolves.
- An audio or video file keeps its `data-type` and glyph and shows the no-preview body; no player.
- `base64` is plain base64 or a base64 data URL (`data:application/pdf;base64,…`, the prefix is dropped). Text is decoded as UTF-8. `base64` that does not decode draws nothing: an image falls back to the no-preview state, a PDF shows the no-preview body, text shows the empty-file line.
- `data-loading` mirrors `loading`; the body is a `Skeleton` in a `role="status"` region and `aria-busy` is set.
- `error` set: the body is an `EmptyState` with the error text; Download stays available.
- An image that fails to load, or has no source, falls back to the no-preview state.
- Text over `maxLength` sets `data-truncated` and shows the truncation note.
- A text or JSON file with no content shows the empty-file line.

## Accessibility

- The root is a `section` named by the file name (`aria-labelledby`).
- The image's `alt` is the file name.
- The PDF `object` is named `Preview of <file>` (`title` and `aria-label`), so a screen reader announces the embedded document; the browser's viewer owns the keyboard inside it.
- The text body is a focusable, scrollable region (`tabindex="0"`, `role="region"`, named `Contents of <file>`) so a keyboard user can scroll it.
- Loading is a `role="status"` region named `Loading preview`; the root has `aria-busy`.
- Download is a real `Button` with a visible label; the glyph is decorative (`aria-hidden`).
- Keyboard: `Tab` reaches the `actions` slot, Download, the text body and the PDF viewer; arrow keys scroll the text body.
- Contrast ≥4.5:1 for the name, the meta line and the text.

## Right-to-left

- Layout: logical utilities only (`gap`, `ps-`/`pe-`, `text-start`); the header mirrors.
- Icons: none mirrored (file glyphs, download).
- The PDF viewer is the browser's; it follows the document's own direction.
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
| `filePreview.document`        | `Preview of {name}`                                                         | —             |
| `filePreview.truncated`       | `Showing the first {shown} characters. Download the file to see all of it.` | —             |

- Formatting: `formatFileSize` (`Intl.NumberFormat` units, the byte step as `B`: `182 B`, then `kB`, `MB`) for `bytes`, `formatNumber` for the truncation count, both with the `ConfigProvider` locale.

## Responsive

- Container queries: none; it fills its column or drawer.
- Narrow (≤ 640 px): the name truncates with an ellipsis, the meta line stays under it, the Download label stays. On the meta line the type truncates first and the size never does, so a phone reads `application/js… · 182 B`.
- Touch: the Download button and the `actions` slot keep the `Button` touch target.
- Reflow: no horizontal page scroll at 320 px; long text lines wrap, an image scales down to the body width, and the PDF viewer fills the body width at a fixed height.

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

### PDF

```vue
<script setup lang="ts">
  import FilePreview from '@aziontech/webkit/file-preview'

  const invoice =
    'JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA1IDAgUiA+PiA+PiAvQ29udGVudHMgNCAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCAyMjMgPj4Kc3RyZWFtCkJUIC9GMSAxOCBUZiA1NiA3NjAgVGQgKEFjbWUgSW5jLiAtIEludm9pY2UgMTA0MikgVGogMCAtMjggVGQgL0YxIDExIFRmIChCaWxsIHRvOiBKYW5lIERvZSwgMTAwIE1hcmtldCBTdHJlZXQsIFNhbiBGcmFuY2lzY28sIENBIDk0MTA1KSBUaiAwIC0xOCBUZCAoRWRnZSBTdG9yYWdlLCBOb3ZlbWJlciAyMDI2OiAkNDkuMDApIFRqIDAgLTE4IFRkIChUb3RhbCBkdWU6ICQ0OS4wMCkgVGogRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYSA+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjQxIDAwMDAwIG4gCjAwMDAwMDA1MTUgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA2IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgo1ODUKJSVFT0YK'
</script>

<template>
  <FilePreview
    class="max-w-(--container-2xl)"
    file-name="acme-invoice-1042.pdf"
    mime-type="application/pdf"
    :bytes="768"
    :base64="invoice"
  />
</template>
```
