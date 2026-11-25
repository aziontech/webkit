# Image Gallery

> The images of one response: a responsive grid of thumbnails that opens one image larger in a `Dialog`, with previous, next and Download. It takes each image as a URL or as base64 data with its media type, so a chat can show the images a model returned in a message or a generation finished with. While images are generating it holds one `Skeleton` per expected image, and when the request fails it shows the error in place of the grid. It draws what the app hands it; it generates and fetches nothing.

- Import: `import ImageGallery from '@aziontech/webkit/image-gallery'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [image-gallery.json](image-gallery.json)

## When to use

- The images in an assistant message: one or several image parts, from a URL or base64 data.
- The result of an image generation request: several images, a generating state and a failed state.
- Any set of a few related images a person wants to look at one by one and download.

## Do

- Pass `alt` from what the image shows (a model's revised prompt is a good source); an image with no `alt` is named by its position ("Image 2 of 4").
- Give every item a stable `key` (the message id and the part index) so the grid keeps each image when items arrive one by one.
- Set `expectedCount` to the number of images requested, so the placeholders match the result.
- Base64 data stays in memory as a data URL; for large images prefer a URL the app serves.
- Handle `download` and call `event.preventDefault()` when the image is on another origin or needs a signed URL; a same-origin, `blob:` or `data:` image downloads by itself.

## Don’t

- One stored file with its name, size and type, in a file browser — use `FilePreview`.
- A row of marketing cards or images that scrolls sideways — use `Carousel`.
- A picture you already have at a known size inside text or a card — a plain `img` is enough.
- Files attached to a prompt before it is sent — use `FileTokenGroup`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `Dialog` — the viewer that opens one image larger.
- `Skeleton` — the placeholder per expected image while images generate.
- `EmptyState` — the error state, the empty state and an image that fails to load in the viewer.
- `FilePreview` — one stored file with a type-aware body.
- `ChatMessage` — the message an image gallery sits in.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `ImageGalleryItem[]` | `[]` | false | Images to show, each from a URL (`src`) or base64 `data` with its `mimeType`. |
| `loading` | `boolean` | `false` | false | Images are still generating: placeholders fill the grid after the images already in `items`, up to `expectedCount`. |
| `expectedCount` | `number` | `1` | false | Number of images expected while `loading`; the grid shows a placeholder for each one not in `items` yet. |
| `error` | `string` | `''` | false | Why the images could not load or generate. Set, the gallery shows the error state in place of the grid, with this text under its title. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `download` | `(event: MouseEvent, item: ImageGalleryItem)` | Download in the viewer was pressed for `item`. Download is a link with the `download` attribute, so the browser saves a same-origin, `blob:` or `data:` image unless the handler calls `preventDefault()`; browsers ignore `download` on a cross-origin URL and open it instead, so an app with cross-origin images handles this event (`preventDefault()` and its own download). |
| `retry` | `(event: MouseEvent)` | Try again in the error state was pressed. The button renders only when this event has a listener, so a gallery whose app cannot run the request again shows no dead button; the app starts the request again and clears `error`. |

## States

- Precedence: `error` wins over everything (no image, placeholder or empty state shows). Otherwise the images in `items` render first, then, while `loading`, one placeholder for each of `expectedCount - items.length` (none when `expectedCount` is at most `items.length`). With no image and no placeholder the empty state shows.
- `data-layout`: `single` (one tile) | `pair` (two tiles) | `grid` (three or more), counted over the images and the placeholders.
- `data-loading` mirrors `loading`; the root has `aria-busy`, and each placeholder is a `Skeleton` tile hidden from assistive technology.
- `data-error` is set while `error` is set: the grid is replaced by an `EmptyState` titled `The images could not load` with the `error` text as its description, inside a `role="alert"` region. With a `retry` listener the error state also shows a Try again `Button` (`az az-refresh`, outline, medium) under the message.
- `data-empty` is set when there is no image, no placeholder and no error: an `EmptyState` that says `No images`.
- `data-broken` is set on a thumbnail whose image fails to load (it then shows the `az az-image` glyph on the surface and keeps its name) and on the viewer body for that image, which shows an `EmptyState` (`This image could not load`); Download stays.
- Viewer: `Dialog` with `data-state="open|closed"` (from `Dialog`); Previous is disabled on the first image and Next on the last.
- Not applicable: the component has no `disabled`, `readonly` or `invalid` state; it is read-only content.

## Accessibility

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

## Right-to-left

- Layout: logical utilities only (`gap`, `ps-`/`pe-`, `text-start`); the grid fills from the start edge and the viewer footer mirrors.
- Icons: the Previous and Next chevrons are directional glyphs the stylesheet mirrors (never rotated); the image and download glyphs are not mirrored.
- Keyboard: under `rtl`, `ArrowLeft` goes to the next image and `ArrowRight` to the previous one, read from the resolved direction of the viewer.
- User data: the title (`alt`) is in `<bdi>`; images are not mirrored.

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
| `imageGallery.retry`      | `Try again`                    | —             |

- Formatting: `formatNumber` (`Intl.NumberFormat`) for `position` and `total`, with the `ConfigProvider` locale.

## Responsive

- Container queries: the root is the `image-gallery` container; from the `md` container width a grid of three or more tiles shows three columns, below it two. One tile is capped at `--container-xs` wide; two tiles share two columns.
- Narrow container (below the `md` container width): two columns of square thumbnails. A thumbnail shows the whole image (`object-contain`, letterboxed on the tile surface), never a crop: a chart or a screenshot keeps its labels. The viewer is the `Dialog` sheet on small viewports (bottom sheet below `md`, full screen below `sm`), and the image scales to fit its body.
- Touch: every thumbnail is a whole-tile button at least 44 × 44 px (the narrowest two-column tile in a 320 px column is far larger), so it clears 24 px and 44 px under `pointer: coarse`; Previous, Next, Download and Close keep the `IconButton` / `Button` / `Dialog` targets (≥ 40 px, 44 px under `pointer: coarse`). Nothing depends on hover or swipe: Previous and Next are buttons as well as arrow keys.
- Reflow: no horizontal page scroll at 320 px and at 200 % zoom (WCAG 1.4.10, 1.4.12); thumbnails shrink with the column, text wraps, and the viewer image fits its body (`object-contain`).

## Examples

### Default

```vue
<script setup lang="ts">
  import aiGateway from '@aziontech/webkit/assets/ai-gateway.svg'
  import branches from '@aziontech/webkit/assets/branches.svg'
  import ddosProtection from '@aziontech/webkit/assets/ddos-protection.svg'
  import usageChart from '@aziontech/webkit/assets/usage-chart.svg'
  import ImageGallery from '@aziontech/webkit/image-gallery'

  const items = [
    { key: 'gateway', src: aiGateway, alt: 'AI gateway illustration' },
    { key: 'ddos', src: ddosProtection, alt: 'DDoS protection illustration' },
    { key: 'usage', src: usageChart, alt: 'Usage chart illustration' },
    { key: 'branches', src: branches, alt: 'Branches illustration' }
  ]
</script>

<template>
  <ImageGallery
    class="max-w-(--container-md)"
    :items="items"
  />
</template>
```

### Single

```vue
<script setup lang="ts">
  import aiGateway from '@aziontech/webkit/assets/ai-gateway.svg'
  import ImageGallery from '@aziontech/webkit/image-gallery'

  const items = [
    {
      key: 'gateway',
      src: aiGateway,
      alt: 'AI gateway illustration',
      fileName: 'acme-ai-gateway.svg'
    }
  ]
</script>

<template>
  <ImageGallery :items="items" />
</template>
```

### Loading

```vue
<script setup lang="ts">
  import ddosProtection from '@aziontech/webkit/assets/ddos-protection.svg'
  import ImageGallery from '@aziontech/webkit/image-gallery'

  const items = [{ key: 'ddos', src: ddosProtection, alt: 'DDoS protection illustration' }]
</script>

<template>
  <ImageGallery
    class="max-w-(--container-md)"
    :items="items"
    loading
    :expected-count="4"
  />
</template>
```
