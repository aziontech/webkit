---
name: file-preview
category: content
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 958e3895906d6cf05340be71d9d0217734e3f0989a6b3a044b260a47633279ec
created: 2026-11-16
last_updated: 2026-11-17
---

# FilePreview — Component Spec

## Purpose

The preview of one stored file in a storage or object browser: a header with the file's glyph, name, type and size, a Download action, and a body that shows the file the way it can be read. An image renders as the image, text as wrapped monospace text, JSON pretty-printed, and any other type a no-preview state that points at Download. Long text is cut at `maxLength` characters with a note that says so. It renders what the app hands it (an image URL, the text it fetched); it fetches nothing.

## When to use

- The detail pane or drawer of a file browser when a row is opened (`view/file-browser`, an Edge Storage bucket, a KV value).
- Showing an uploaded object before it is published or replaced.
- Any screen that shows one file and needs a type-aware fallback for files it cannot draw.

## When NOT to use

- Editing a file — use `CodeEditor`.
- Highlighted source code with tabs and copy — use `CodeBlock`.
- A list of files with upload progress — use `FileTokenGroup` or `UploadProgress`.
- A log stream — use `LogViewer`.

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
| `src`       | `string`  | `''`      | false    | URL of an image file to draw. An image with no `src` shows the no-preview state.                        |
| `content`   | `string`  | `''`      | false    | Text of a text or JSON file. JSON that parses is pretty-printed; JSON that does not shows as text.      |
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

- `data-type`: `image` | `text` | `json` | `unknown`, the way the body draws the file (derived from `mimeType`, then the extension).
- `data-loading` mirrors `loading`; the body is a `Skeleton` in a `role="status"` region and `aria-busy` is set.
- `error` set: the body is an `EmptyState` with the error text; Download stays available.
- An image that fails to load falls back to the no-preview state.
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
| ring          | `var(--ring-color)`                         |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The root is a `section` named by the file name (`aria-labelledby`).
- The image's `alt` is the file name.
- The text body is a focusable, scrollable region (`tabindex="0"`, `role="region"`, named `Contents of <file>`) so a keyboard user can scroll it.
- Loading is a `role="status"` region named `Loading preview`; the root has `aria-busy`.
- Download is a real `Button` with a visible label; the glyph is decorative (`aria-hidden`).
- Keyboard: `Tab` reaches the `actions` slot, Download and the text body; arrow keys scroll the text body.
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
| `filePreview.truncated`       | `Showing the first {shown} characters. Download the file to see all of it.` | —             |

- Formatting: `formatFileSize` (`Intl.NumberFormat` units) for `bytes`, `formatNumber` for the truncation count, both with the `ConfigProvider` locale.

## Right-to-left

- Layout: logical utilities only (`gap`, `ps-`/`pe-`, `text-start`); the header mirrors.
- Icons: none mirrored (file glyphs, download).
- Keyboard: unchanged.
- User data: the file name is in `<bdi>`; the text body is `dir="auto"` so code keeps its order on a right-to-left page.

## Responsive

- Container queries: none; it fills its column or drawer.
- Narrow (≤ 640 px): the name truncates with an ellipsis, the meta line stays under it, the Download label stays.
- Touch: the Download button and the `actions` slot keep the `Button` touch target.
- Reflow: no horizontal page scroll at 320 px; long text lines wrap, and an image scales down to the body width.

## Performance

- Bundle budget: 6.9 KB for `./file-preview` gzip in `.size-limit.json` (measured 6.8 KB + ~0.1 KB).
- Runtime budget: pretty-printing and cutting run once per `content` change; at most `maxLength` characters reach the DOM.
- Heavy parts: none (no highlighter; `CodeBlock` stays out of the bundle).

## Examples

The component has no `variant` or `size`; its axis is the file type it is given, so one example per type (Image, Text, Unknown) stands in for the composite Variants example, plus the Loading and Error states.

- Default — a JSON file, pretty-printed.
- Image — an image file drawn from `src`.
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
