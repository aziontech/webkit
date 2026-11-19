---
name: file-preview
category: content
structure: monolithic
status: approved
spec_version: 2
template: 2
checksum: 04ae9747d3edca4cf80cf1f1e2ae7f631eb1a99c0877302edae5f7d6f8877702
created: 2026-11-16
last_updated: 2026-11-19
---

# FilePreview — Component Spec

## Purpose

The preview of one stored file in a storage or object browser, or of a document in an AI conversation (a PDF the reader attaches or a model returns): a header with the file's glyph, name, type and size, a Download action, and a body that shows the file the way it can be read. An image renders as the image, a PDF in the browser's own PDF viewer, text as wrapped monospace text, JSON pretty-printed, and any other type a no-preview state that points at Download. Audio and video files are recognized (their glyph and type) and show the file card with Download; this component plays nothing. Long text is cut at `maxLength` characters with a note that says so. The file comes as a URL (`src`), as text (`content`) or as base64 bytes (`base64`, the shape a chat message carries); it renders what the app hands it and fetches nothing.

## When to use

- The detail pane or drawer of a file browser when a row is opened (`view/view-file-browser`, an Edge Storage bucket, a KV value).
- Showing an uploaded object before it is published or replaced.
- A document part or an attachment in an AI conversation: a PDF, a text file or an image, from a URL or from base64 bytes.
- Any screen that shows one file and needs a type-aware fallback for files it cannot draw.

## When NOT to use

- Editing a file — use `CodeEditor`.
- Highlighted source code with tabs and copy — use `CodeBlock`.
- A list of files with upload progress — use `FileTokenGroup` or `UploadProgress`.
- A log stream — use `LogViewer`.
- Playing audio or video — this component shows those files as a card with Download, not a player.

## Related

- `CodeBlock` — syntax-highlighted code; heavier, for a code sample rather than a stored object.
- `EmptyState` — the no-preview and error states inside this component.
- `Skeleton` — the loading placeholder inside this component.
- `DataTable` — the file list a preview opens from.

## Best practices

- Pass `mimeType` from the object's `Content-Type`; leave it empty and the file name's extension decides.
- Fetch only the first part of a large text file (a ranged request) and pass `bytes` with the full size, so the header shows the real size while the body shows the first part.
- Handle `download` with the app's own signed or authorized URL; the component never builds one.
- Pass an object URL (`URL.createObjectURL`) or a short-lived signed URL as `src`; revoke an object URL when the preview closes.
- When the app holds the bytes rather than a URL (a chat message part with base64 data), pass them as `base64` with `mimeType`; the component makes its own object URL for an image or PDF and revokes it when the source changes or the preview unmounts. Text and JSON are decoded into the body.
- A PDF is drawn by the browser's own viewer; where there is none (most phones, a viewer turned off), the body shows the no-preview state and Download stays.

## Usage

```vue
<script setup>
  import FilePreview from '@aziontech/webkit/file-preview'

  const onDownload = (event) => {}
</script>

<template>
  <FilePreview
    file-name="settings.json"
    mime-type="application/json"
    :bytes="182"
    content='{"name":"acme-store","cache":{"ttl":3600}}'
    @download="onDownload"
  />
</template>
```

## Props

| Prop        | Type      | Default   | Required | JSDoc                                                                                                   |
| ----------- | --------- | --------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `fileName`  | `string`  | —         | true     | Name of the file, shown in the header and used as the image's alternative text.                         |
| `mimeType`  | `string`  | `''`      | false    | Media type of the file (`image/png`, `application/json`). Empty reads the type from the file extension. |
| `bytes`     | `number`  | undefined | false    | Size of the whole file in bytes, shown beside the type. Unset hides the size.                           |
| `src`       | `string`  | `''`      | false    | URL of an image or PDF file to draw. Set, it wins over `base64`.                                        |
| `base64`    | `string`  | `''`      | false    | Base64 bytes of the file, for an app that holds the file rather than a URL. Text and JSON are decoded into the body when `content` is empty; an image or PDF with no `src` is drawn from them. |
| `content`   | `string`  | `''`      | false    | Text of a text or JSON file. JSON that parses is pretty-printed; JSON that does not shows as text. Set, it wins over `base64`. |
| `maxLength` | `number`  | `20000`   | false    | Characters of text shown before the rest is cut, with a note that says how much is shown.               |
| `loading`   | `boolean` | `false`   | false    | Shows a placeholder in the body while the app fetches the file; the header stays.                       |
| `error`     | `string`  | `''`      | false    | Why the preview could not load. Set, the body shows the error state with this text.                     |

## Events

| Event      | Payload      | Notes                                                         |
| ---------- | ------------ | ------------------------------------------------------------- |
| `download` | `MouseEvent` | The Download button was pressed; the app starts the download. |

## Slots

| Slot      | Scope | Notes                                                            |
| --------- | ----- | ---------------------------------------------------------------- |
| `actions` | —     | More actions in the header, before Download (copy link, delete). |

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

## Motion & Animations

_none_

## Tokens

| Region        | Token (DESIGN.md)                           |
| ------------- | ------------------------------------------- |
| surface       | `var(--bg-surface)`                         |
| body          | `var(--bg-canvas)`                          |
| border        | `var(--border-default)`                     |
| shape         | `var(--shape-card)`                         |
| name          | `.text-label-md`, `var(--text-default)`     |
| type and size | `.text-body-xs`, `var(--text-muted)`        |
| text and JSON | `.text-body-code-sm`, `var(--text-default)` |
| PDF height    | `var(--container-lg)`                       |
| PDF focus     | `var(--ring-color)`                         |
| ring          | `var(--ring-color)`                         |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The root is a `section` named by the file name (`aria-labelledby`).
- The image's `alt` is the file name.
- The PDF `object` is named `Preview of <file>` (`title` and `aria-label`), so a screen reader announces the embedded document; the browser's viewer owns the keyboard inside it.
- The text body is a focusable, scrollable region (`tabindex="0"`, `role="region"`, named `Contents of <file>`) so a keyboard user can scroll it.
- Loading is a `role="status"` region named `Loading preview`; the root has `aria-busy`.
- Download is a real `Button` with a visible label; the glyph is decorative (`aria-hidden`).
- Keyboard: `Tab` reaches the `actions` slot, Download, the text body and the PDF viewer; arrow keys scroll the text body.
- Contrast ≥4.5:1 for the name, the meta line and the text.

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

- Formatting: `formatFileSize` (`Intl.NumberFormat` units) for `bytes`, `formatNumber` for the truncation count, both with the `ConfigProvider` locale.

## Right-to-left

- Layout: logical utilities only (`gap`, `ps-`/`pe-`, `text-start`); the header mirrors.
- Icons: none mirrored (file glyphs, download).
- The PDF viewer is the browser's; it follows the document's own direction.
- Keyboard: unchanged.
- User data: the file name is in `<bdi>`; the text body is `dir="auto"` so code keeps its order on a right-to-left page.

## Responsive

- Container queries: none; it fills its column or drawer.
- Narrow (≤ 640 px): the name truncates with an ellipsis, the meta line stays under it, the Download label stays.
- Touch: the Download button and the `actions` slot keep the `Button` touch target.
- Reflow: no horizontal page scroll at 320 px; long text lines wrap, an image scales down to the body width, and the PDF viewer fills the body width at a fixed height.

## Performance

- Bundle budget: 6.9 KB for `./file-preview` gzip in `.size-limit.json` (measured 6.8 KB + ~0.1 KB).
- Runtime budget: pretty-printing and cutting run once per `content` change; at most `maxLength` characters reach the DOM.
- Heavy parts: none (no highlighter, no PDF library: the browser's viewer draws a PDF; `CodeBlock` stays out of the bundle).
- Base64: decoded once per `base64` change; an image or PDF becomes one object URL, revoked when the source changes or the component unmounts.

## Examples

The component has no `variant` or `size`; its axis is the file type it is given, so one example per type (Image, PDF, Text, Unknown) stands in for the composite Variants example, plus the Loading and Error states.

- Default — a JSON file, pretty-printed.
- Image — an image file drawn from `src`.
- PDF — a PDF invoice from base64 bytes, in the browser's PDF viewer.
- Text — a long text file cut at `maxLength`, with the truncation note.
- Unknown — a binary file with the no-preview state and Download.
- Loading — the placeholder while the file loads.
- Error — the error state with the app's message.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

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
