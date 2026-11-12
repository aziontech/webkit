# Doc Frame

> The bordered surface every screenshot, diagram and clip in a documentation page sits on, so no media floats loose on the canvas and all of it shares one border, radius and inset. Pass `src` and the frame decides from the extension whether it holds a still or a clip; compose the default slot when the framed thing is markup. A still opens full screen out of its own frame — the picture is the button — while a clip keeps its player controls and composed content has no source to open. The caption reads under the frame, centered, as part of the picture; the hint reads above it on the text's own left edge, as part of the sentence that led the reader here; each is a string prop for the plain case with a slot of the same name for rich content.

- Import: `import DocFrame from '@aziontech/webkit/doc-frame'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-frame.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-frame.json)

## When to use

- Any screenshot, diagram or screen recording inside documentation prose — every one of them, so the page's media all shares one border, radius and inset.
- A composed panel or mock the page wants presented as a figure rather than as live UI: fill the default slot.
- A clip that decorates a step (`autoplay`) or one the reader chooses to play (default, with controls).

## Do

- Always pass `alt` for a still or a clip: it labels the media, names the zoom trigger, and titles the full-screen dialog.
- Keep the caption to one line that belongs to the picture; a paragraph of context belongs in the prose above, or in `hint` when it leads directly into the frame.
- Use the `caption` / `hint` slots only when the sentence needs markup (a link, a bold run, a code chip); the string props cover the plain case in one attribute.
- Reach for `autoplay` only when the clip is decoration: it mutes, inlines and loops the clip and removes its controls, on the prop path and for a clip written by hand in the slot alike.

## Don’t

- For an application-screen media block outside documentation prose — use `FrameBox` or compose the layout directly.
- For an image that is itself a link or a card — a frame is a figure, not a navigation target.
- For a gallery or carousel; the frame holds one piece of media at a time.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- DocProse` — the page contract around it. The frame marks itself `data-doc-block`, so it takes the block rung of the prose ladder, and its caption and hint arrive unclassed for the page to style.
- DocCallout` — the other block-level interruption; a callout carries words, a frame carries media.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `caption` | `string` | `''` | false | Caption under the frame, centered; plain-text fallback for the caption slot. |
| `hint` | `string` | `''` | false | Lead-in above the frame, left aligned; plain-text fallback for the hint slot. |
| `src` | `string` | `''` | false | Media source; omit to frame slot content instead. |
| `alt` | `string` | `''` | false | Alternative text for the framed media. |
| `autoplay` | `boolean` | `false` | false | Plays the clip on its own, muted, inline and looping, with no controls. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Framed content when no `src` is given. |
| `caption` | — | Rich caption content; the `caption` prop is its plain-text fallback inside the slot. |
| `hint` | — | Rich lead-in content; the `hint` prop is its plain-text fallback inside the slot. |

## States

- Visual states: `default`; `hover` and `focus-visible` on the zoom trigger of a still (the full-screen badge fades in on both, so the affordance is not pointer-only).
- The framed element is decided by data, not by a prop: a source matching a clip extension (`.mp4`, `.webm`, `.ogv`, `.ogg`, `.mov`, `.m4v`) renders a player, any other source renders a still, and no source renders the default slot.
- The lightbox contract: only a **still** opens full screen — the picture itself is the trigger. `Escape`, the backdrop, the close control and a click on the opened picture all close it, and focus returns to the thumbnail trigger. A **clip** does not zoom (it carries controls a click would fight, and a player has fullscreen of its own), and **composed slot content** does not zoom (there is no source to open).
- While open: the overlay carries `data-state="open"`, body scroll is locked, and the full-size copy carries `data-flip="start|armed"` — the attribute that arms the FLIP transition only after the starting transform has committed.
- `autoplay` is applied on both authoring paths: to the prop, and by rewriting a hand-written autoplaying clip in the default slot with the same muted/inline/loop attributes and no controls.
- `data-doc-block` is the `DocProse` contract (the frame takes the block rung of the prose ladder).

## Accessibility

- Visible focus: the zoom trigger is a real button with `focus-visible:outline-2 focus-visible:outline-(--ring-color)`; the close control carries the same ring. The full-screen badge fades in on keyboard focus as well as hover, so the zoom affordance is never pointer-only.
- Keyboard map: `Tab` reaches the zoom trigger of a still; `Enter` / `Space` opens the lightbox. While open, focus moves to the close control, `Tab` / `Shift+Tab` are trapped inside the dialog, and `Escape` closes it. On close — by any path — focus returns to the thumbnail trigger.
- ARIA: the trigger's `aria-label` names the picture ("View full screen: {alt}"). The lightbox is `role="dialog"` with `aria-modal="true"`, labelled from `alt`. The backdrop is `aria-hidden` — the pointer shortcut whose keyboard equivalents are `Escape` and the real close button. The badge is `aria-hidden` (the trigger already carries the name). A clip takes `aria-label` from `alt`; an autoplaying clip is muted so it never seizes a screen reader's audio.
- The lightbox Teleports to `body` and locks body scroll while open, so assistive tech and the pointer agree on what is interactive.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons) on all frame chrome tokens.
- Touch target: the zoom trigger is the whole picture; the close control is a padded button at the viewport corner.
- Teleported content: the teleported zoom dialog binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

### Default

```vue
<script setup>
  import DocFrame from '@aziontech/webkit/doc-frame'
</script>

<template>
  <DocFrame caption="Console, + Create">
    <div
      class="w-full rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
    >
      <p class="text-heading-xs text-(--text-default)">Create a workload</p>
      <p class="pt-(--spacing-xxs) text-body-sm text-(--text-muted)">
        Pick a template, or start from an empty project.
      </p>
    </div>
  </DocFrame>
</template>
```

### Media

```vue
<script setup>
  import placeholderClip from '@aziontech/webkit/assets/placeholder-clip.webm'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import DocFrame from '@aziontech/webkit/doc-frame'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <DocFrame
      :src="placeholderImage"
      alt="Step 3 of Create application: the imported repository, the name, build and deploy commands, and the firewall toggle"
    >
      <template #caption>Console, <strong>Create application</strong> — step 3</template>
    </DocFrame>
    <DocFrame
      :src="placeholderClip"
      alt="Creating an application from a Git repository, start to step 3"
      caption="The same flow, from the method to the deploy"
    />
  </div>
</template>
```

### Autoplay

```vue
<script setup>
  import placeholderClip from '@aziontech/webkit/assets/placeholder-clip.webm'
  import DocFrame from '@aziontech/webkit/doc-frame'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <DocFrame
      :src="placeholderClip"
      alt="Landing on step 3 of Create application"
      autoplay
      caption="Autoplay: muted, inline, looping, no controls"
    />
    <DocFrame caption="The same rule reaches a clip written by hand">
      <video
        autoplay
        :src="placeholderClip"
        class="block h-auto w-full rounded-(--shape-elements)"
      ></video>
    </DocFrame>
  </div>
</template>
```
