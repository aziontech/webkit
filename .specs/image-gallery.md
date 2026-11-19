---
name: image-gallery
category: content
structure: monolithic
status: approved
spec_version: 1
template: 2
created: 2026-11-19
last_updated: 2026-11-19
checksum: e048c7acb6c728680f163bb0a944445978a4f629191a2f8d035872154343b26a
---

# ImageGallery — Component Spec

## Purpose

The images of one response: a responsive grid of thumbnails that opens one image larger in a `Dialog`, with previous, next and Download. It takes each image as a URL or as base64 data with its media type, so a chat can show the images a model returned in a message or a generation finished with. While images are generating it holds one `Skeleton` per expected image, and when the request fails it shows the error in place of the grid. It draws what the app hands it; it generates and fetches nothing.

## When to use

- The images in an assistant message: one or several image parts, from a URL or base64 data.
- The result of an image generation request: several images, a generating state and a failed state.
- Any set of a few related images a person wants to look at one by one and download.

## When NOT to use

- One stored file with its name, size and type, in a file browser — use `FilePreview`.
- A row of marketing cards or images that scrolls sideways — use `Carousel`.
- A picture you already have at a known size inside text or a card — a plain `img` is enough.
- Files attached to a prompt before it is sent — use `FileTokenGroup`.

## Related

- `Dialog` — the viewer that opens one image larger.
- `Skeleton` — the placeholder per expected image while images generate.
- `EmptyState` — the error state, the empty state and an image that fails to load in the viewer.
- `FilePreview` — one stored file with a type-aware body.
- `ChatMessage` — the message an image gallery sits in.

## Best practices

- Pass `alt` from what the image shows (a model's revised prompt is a good source); an image with no `alt` is named by its position ("Image 2 of 4").
- Give every item a stable `key` (the message id and the part index) so the grid keeps each image when items arrive one by one.
- Set `expectedCount` to the number of images requested, so the placeholders match the result.
- Base64 data stays in memory as a data URL; for large images prefer a URL the app serves.
- Handle `download` and call `event.preventDefault()` when the image is on another origin or needs a signed URL; a same-origin, `blob:` or `data:` image downloads by itself.

## Usage

```vue
<script setup>
  import ImageGallery from '@aziontech/webkit/image-gallery'

  const items = [
    { key: 'sunrise', src: 'https://example.com/images/sunrise.png', alt: 'Sunrise over a mountain lake' },
    { key: 'harbor', src: 'https://example.com/images/harbor.png', alt: 'Fishing boats in a quiet harbor' }
  ]

  const onDownload = (event, item) => {}
</script>

<template>
  <ImageGallery
    :items="items"
    @download="onDownload"
  />
</template>
```

## Props

| Prop            | Type                 | Default | Required | JSDoc                                                                                                                                  |
| --------------- | -------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `items`         | `ImageGalleryItem[]` | `[]`    | false    | Images to show, each from a URL (`src`) or base64 `data` with its `mimeType`.                                                          |
| `loading`       | `boolean`            | `false` | false    | Images are still generating: placeholders fill the grid after the images already in `items`, up to `expectedCount`.                    |
| `expectedCount` | `number`             | `1`     | false    | Number of images expected while `loading`; the grid shows a placeholder for each one not in `items` yet.                               |
| `error`         | `string`             | `''`    | false    | Why the images could not load or generate. Set, the gallery shows the error state in place of the grid, with this text under its title. |

## Type shapes

`ImageGalleryItem` (exported type):

| Field      | Type     | Notes                                                                                                   |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `key`      | `string` | Optional stable identity; the position is used when it is missing.                                      |
| `src`      | `string` | Optional URL of the image (`https:`, `blob:` or a `data:` URL).                                         |
| `data`     | `string` | Optional base64 image data, used when `src` is empty; a value that already starts with `data:` is used as is. |
| `mimeType` | `string` | Optional media type of `data` (`image/png`, `image/jpeg`); empty means `image/png`.                     |
| `alt`      | `string` | Optional alternative text; empty uses the position (`Image 2 of 4`).                                    |
| `fileName` | `string` | Optional name the download is saved under; empty uses `image-<position>.<extension of the media type>`. |

## Events

| Event      | Payload                                   | Notes                                                                                                                                           |
| ---------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `download` | `(event: MouseEvent, item: ImageGalleryItem)` | Download in the viewer was pressed for `item`. Download is a link with the `download` attribute, so the browser saves a same-origin, `blob:` or `data:` image unless the handler calls `preventDefault()`; browsers ignore `download` on a cross-origin URL and open it instead, so an app with cross-origin images handles this event (`preventDefault()` and its own download). |

## Slots

_No slots: the images come from `items`._

## States

- Precedence: `error` wins over everything (no image, placeholder or empty state shows). Otherwise the images in `items` render first, then, while `loading`, one placeholder for each of `expectedCount - items.length` (none when `expectedCount` is at most `items.length`). With no image and no placeholder the empty state shows.
- `data-layout`: `single` (one tile) | `pair` (two tiles) | `grid` (three or more), counted over the images and the placeholders.
- `data-loading` mirrors `loading`; the root has `aria-busy`, and each placeholder is a `Skeleton` tile hidden from assistive technology.
- `data-error` is set while `error` is set: the grid is replaced by an `EmptyState` titled `The images could not load` with the `error` text as its description, inside a `role="alert"` region.
- `data-empty` is set when there is no image, no placeholder and no error: an `EmptyState` that says `No images`.
- `data-broken` is set on a thumbnail whose image fails to load (it then shows the `az az-image` glyph on the surface and keeps its name) and on the viewer body for that image, which shows an `EmptyState` (`This image could not load`); Download stays.
- Viewer: `Dialog` with `data-state="open|closed"` (from `Dialog`); Previous is disabled on the first image and Next on the last.
- Not applicable: the component has no `disabled`, `readonly` or `invalid` state; it is read-only content.

## Motion & Animations

| Trigger                    | Animation / Transition                       | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| -------------------------- | -------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| thumbnail hover/focus      | `transition-colors duration-150 ease-out`    | inline (matches catalog)                          | `motion-reduce:transition-none` |
| viewer open / close        | from `Dialog` (its own motion and fallbacks) | `Dialog`                                          | from `Dialog`                   |
| placeholder                | from `Skeleton`                              | `Skeleton`                                        | from `Skeleton`                 |

## Tokens

| Region              | Token (DESIGN.md)                        |
| ------------------- | ---------------------------------------- |
| tile surface        | `var(--bg-surface)`                      |
| tile border         | `var(--border-default)`                  |
| tile border (hover) | `var(--border-strong)`                   |
| tile shape          | `var(--shape-card)`                      |
| gap                 | `var(--spacing-xs)`                      |
| single image width  | `var(--container-xs)`                    |
| counter             | `.text-body-sm`, `var(--text-muted)`     |
| broken glyph        | `var(--text-muted)`                      |
| ring                | `var(--ring-color)`                      |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Patterns: the grid is a plain list of buttons (`ul` named `Images`, one `button` per `li`), with no composite widget and no roving tabindex; the viewer follows the APG Dialog (Modal) pattern through `Dialog`.
- Each thumbnail is a native `button` with `aria-haspopup="dialog"`; its content is the image, so the image's `alt` (or `Image 2 of 4`) names the button. A broken thumbnail keeps the same name.
- Viewer: `Dialog` traps focus and, on open, moves focus to its first focusable control (the Close button in its header); `Esc` closes and focus returns to the thumbnail that opened it. The title is the image's `alt` (or its position); the `n of total` counter is a polite live region, so moving to another image is announced.
- Previous and Next are `IconButton`s (`az az-chevron-left`, `az az-chevron-right`) named `Previous image` / `Next image`; when one becomes disabled while it has focus (Next on the last image, Previous on the first), focus moves to the other one, so focus is never lost. Disabled, they take their contrast from `IconButton`'s disabled tokens.
- Download is a `Button` with a visible label and the `az az-download` glyph; it renders as a link and the `download` attribute reaches the anchor through its attributes (no prop).
- Keyboard: `Tab` moves through thumbnails; `Enter`/`Space` opens one; in the viewer `ArrowLeft`/`ArrowRight` go to the previous/next image (mirrored under `rtl`) and `Home`/`End` to the first/last; `Tab` follows the `Dialog` order — Close in the header, then Previous, Next and Download — and wraps; `Esc` closes.
- Live announcements: a visually hidden `role="status"` line says `Generating images` while `loading`, and `Images ready` once `loading` turns false with images to show; the error state is a `role="alert"` region, so a failed generation is announced. Placeholders are `aria-hidden`.
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on each thumbnail.
- Contrast ≥4.5:1 for the counter text; ≥3:1 for the broken glyph and the tile border on hover.
- Touch target: see Responsive.

## Internationalization

| Key                       | English source                 | Override prop |
| ------------------------- | ------------------------------ | ------------- |
| `imageGallery.label`      | `Images`                       | —             |
| `imageGallery.image`      | `Image {position} of {total}`  | item `alt`    |
| `imageGallery.position`   | `{position} of {total}`        | —             |
| `imageGallery.previous`   | `Previous image`               | —             |
| `imageGallery.next`       | `Next image`                   | —             |
| `imageGallery.download`   | `Download`                     | —             |
| `imageGallery.loading`    | `Generating images`            | —             |
| `imageGallery.ready`      | `Images ready`                 | —             |
| `imageGallery.error`      | `The images could not load`    | — (title; the `error` prop is the description under it) |
| `imageGallery.broken`     | `This image could not load`    | —             |
| `imageGallery.empty`      | `No images`                    | —             |

- Formatting: `formatNumber` (`Intl.NumberFormat`) for `position` and `total`, with the `ConfigProvider` locale.

## Right-to-left

- Layout: logical utilities only (`gap`, `ps-`/`pe-`, `text-start`); the grid fills from the start edge and the viewer footer mirrors.
- Icons: the Previous and Next chevrons are directional glyphs the stylesheet mirrors (never rotated); the image and download glyphs are not mirrored.
- Keyboard: under `rtl`, `ArrowLeft` goes to the next image and `ArrowRight` to the previous one, read from the resolved direction of the viewer.
- User data: the title (`alt`) is in `<bdi>`; images are not mirrored.

## Responsive

- Container queries: the root is the `image-gallery` container; from the `md` container width a grid of three or more tiles shows three columns, below it two. One tile is capped at `--container-xs` wide; two tiles share two columns.
- Narrow container (below the `md` container width): two columns of square thumbnails. The viewer is the `Dialog` sheet on small viewports (bottom sheet below `md`, full screen below `sm`), and the image scales to fit its body.
- Touch: every thumbnail is a whole-tile button at least 44 × 44 px (the narrowest two-column tile in a 320 px column is far larger), so it clears 24 px and 44 px under `pointer: coarse`; Previous, Next, Download and Close keep the `IconButton` / `Button` / `Dialog` targets (≥ 40 px, 44 px under `pointer: coarse`). Nothing depends on hover or swipe: Previous and Next are buttons as well as arrow keys.
- Reflow: no horizontal page scroll at 320 px and at 200 % zoom (WCAG 1.4.10, 1.4.12); thumbnails shrink with the column, text wraps, and the viewer image fits its body (`object-contain`).

## Performance

- Bundle budget: ≤ 30 KB gzip for `./image-gallery` in `.size-limit.json` (set to the measured size plus ~0.2 KB). `Dialog` (22.55 KB alone) is the bulk.
- Runtime budget: images load lazily (`loading="lazy"`, `decoding="async"`); a data URL is built once per item change.
- Heavy parts: the viewer (`Dialog`) is bundled up front, not loaded on first open: the server render and the hydration stay identical, a chat already ships `Dialog` for its other overlays, and an async boundary would delay the first open by a network round trip. The viewer renders only the open image.

## Examples

The component has no `variant` or `size`; its axes are the number of images and the generation states.

- Default — four images from URLs in a grid, opening the viewer.
- Single — one image, capped width.
- Loading — generating: one image arrived, placeholders up to `expectedCount` 4.
- Error — the generation failed, with the app's message.
- Base64 — images from base64 data with their media type (the shape of a model's image part).

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
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
