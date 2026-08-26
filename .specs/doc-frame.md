---
name: doc-frame
category: documentation
structure: monolithic
status: implemented
spec_version: 1
checksum: c64d4657c90e124a8dcd6b5bcea971344a6fc67dbd4931fe0f0071c9ae2580a9
created: 2026-08-22
last_updated: 2026-08-22
---

# DocFrame — Component Spec

## Purpose

The bordered surface every screenshot, diagram and clip in a documentation page sits on, so no media floats loose on the canvas and all of it shares one border, radius and inset. Pass `src` and the frame decides from the extension whether it holds a still or a clip; compose the default slot when the framed thing is markup. A still opens full screen out of its own frame — the picture is the button — while a clip keeps its player controls and composed content has no source to open. The caption reads under the frame, centered, as part of the picture; the hint reads above it on the text's own left edge, as part of the sentence that led the reader here; each is a string prop for the plain case with a slot of the same name for rich content.

## When to use

- Any screenshot, diagram or screen recording inside documentation prose — every one of them, so the page's media all shares one border, radius and inset.
- A composed panel or mock the page wants presented as a figure rather than as live UI: fill the default slot.
- A clip that decorates a step (`autoplay`) or one the reader chooses to play (default, with controls).

## When NOT to use

- For an application-screen media block outside documentation prose — use `FrameBox` or compose the layout directly.
- For an image that is itself a link or a card — a frame is a figure, not a navigation target.
- For a gallery or carousel; the frame holds one piece of media at a time.

## Related

- `DocProse` — the page contract around it. The frame marks itself `data-doc-block`, so it takes the block rung of the prose ladder, and its caption and hint arrive unclassed for the page to style.
- `DocCallout` — the other block-level interruption; a callout carries words, a frame carries media.

## Best practices

- Always pass `alt` for a still or a clip: it labels the media, names the zoom trigger, and titles the full-screen dialog.
- Keep the caption to one line that belongs to the picture; a paragraph of context belongs in the prose above, or in `hint` when it leads directly into the frame.
- Use the `caption` / `hint` slots only when the sentence needs markup (a link, a bold run, a code chip); the string props cover the plain case in one attribute.
- Reach for `autoplay` only when the clip is decoration: it mutes, inlines and loops the clip and removes its controls, on the prop path and for a clip written by hand in the slot alike.

## Usage

```vue
<script setup>
  import DocFrame from '@aziontech/webkit/doc-frame'
</script>

<template>
  <DocFrame
    src="/docs/create-application-step-3.png"
    alt="Step 3 of Create application: the imported repository and the deploy commands"
    caption="Console, Create application — step 3"
  />
</template>
```

## Props

| Prop       | Type      | Default | Required | JSDoc                                                                         |
| ---------- | --------- | ------- | -------- | ----------------------------------------------------------------------------- |
| `caption`  | `string`  | `''`    | false    | Caption under the frame, centered; plain-text fallback for the caption slot.  |
| `hint`     | `string`  | `''`    | false    | Lead-in above the frame, left aligned; plain-text fallback for the hint slot. |
| `src`      | `string`  | `''`    | false    | Media source; omit to frame slot content instead.                             |
| `alt`      | `string`  | `''`    | false    | Alternative text for the framed media.                                        |
| `autoplay` | `boolean` | `false` | false    | Plays the clip on its own, muted, inline and looping, with no controls.       |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                                |
| --------- | ----- | ------------------------------------------------------------------------------------ |
| `default` | —     | Framed content when no `src` is given.                                               |
| `caption` | —     | Rich caption content; the `caption` prop is its plain-text fallback inside the slot. |
| `hint`    | —     | Rich lead-in content; the `hint` prop is its plain-text fallback inside the slot.    |

## States

- Visual states: `default`; `hover` and `focus-visible` on the zoom trigger of a still (the full-screen badge fades in on both, so the affordance is not pointer-only).
- The framed element is decided by data, not by a prop: a source matching a clip extension (`.mp4`, `.webm`, `.ogv`, `.ogg`, `.mov`, `.m4v`) renders a player, any other source renders a still, and no source renders the default slot.
- The lightbox contract: only a **still** opens full screen — the picture itself is the trigger. `Escape`, the backdrop, the close control and a click on the opened picture all close it, and focus returns to the thumbnail trigger. A **clip** does not zoom (it carries controls a click would fight, and a player has fullscreen of its own), and **composed slot content** does not zoom (there is no source to open).
- While open: the overlay carries `data-state="open"`, body scroll is locked, and the full-size copy carries `data-flip="start|armed"` — the attribute that arms the FLIP transition only after the starting transform has committed.
- `autoplay` is applied on both authoring paths: to the prop, and by rewriting a hand-written autoplaying clip in the default slot with the same muted/inline/loop attributes and no controls.
- `data-doc-block` is the `DocProse` contract (the frame takes the block rung of the prose ladder).

## Motion & Animations

| Trigger                                                 | Animation / Transition                                                                                                       | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                                                                                                                                                                                        |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| hover / keyboard focus on the zoom trigger (badge fade) | `transition-opacity duration-fast-02 ease-productive-entrance`                                                               | semantic                                          | `motion-reduce:transition-none`                                                                                                                                                                                |
| lightbox open (overlay)                                 | `animate-fade-in`                                                                                                            | semantic                                          | `motion-reduce:animate-none`                                                                                                                                                                                   |
| lightbox open/close (FLIP travel of the picture)        | `data-[flip=armed]:transition-[transform] data-[flip=armed]:duration-moderate-02 data-[flip=armed]:ease-expressive-entrance` | semantic                                          | `motion-reduce:transition-none!` — and the FLIP is also skipped in JS: the transform is never written under a reduced-motion preference, so the close path (which unmounts on `transitionend`) stays reachable |

The FLIP transform itself is an inline style because it is a measurement (the rectangle where that one thumbnail sits), not a style choice; the transition stays a class so a consumer can override it. It legitimately names `transform`: the animated value is the inline `transform`, not Tailwind's translate/scale utilities.

## Tokens

| Region                              | Token (DESIGN.md)                                                                      |
| ----------------------------------- | -------------------------------------------------------------------------------------- |
| typography (hint, caption)          | `.text-body-xs`                                                                        |
| typography (zoom badge)             | `.text-label-sm`                                                                       |
| typography (close control)          | `.text-label-md`                                                                       |
| glyph size (zoom badge)             | `var(--text-body-xs)`                                                                  |
| text (hint, caption)                | `var(--text-muted)`                                                                    |
| text (badge, close control)         | `var(--text-default)`                                                                  |
| border                              | `var(--border-default)`                                                                |
| surface (frame)                     | `var(--bg-surface-raised)`                                                             |
| surface (badge, close control)      | `var(--bg-surface)`                                                                    |
| surface.hover (close control)       | `var(--bg-hover)`                                                                      |
| backdrop                            | `var(--bg-backdrop)`                                                                   |
| shape (frame)                       | `var(--shape-card)`                                                                    |
| shape (media, badge, close control) | `var(--shape-elements)`                                                                |
| ring                                | `var(--ring-color)`                                                                    |
| spacing                             | `var(--spacing-xxs)` / `var(--spacing-xs)` / `var(--spacing-sm)` / `var(--spacing-lg)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the zoom trigger is a real button with `focus-visible:outline-2 focus-visible:outline-(--ring-color)`; the close control carries the same ring. The full-screen badge fades in on keyboard focus as well as hover, so the zoom affordance is never pointer-only.
- Keyboard map: `Tab` reaches the zoom trigger of a still; `Enter` / `Space` opens the lightbox. While open, focus moves to the close control, `Tab` / `Shift+Tab` are trapped inside the dialog, and `Escape` closes it. On close — by any path — focus returns to the thumbnail trigger.
- ARIA: the trigger's `aria-label` names the picture ("View full screen: {alt}"). The lightbox is `role="dialog"` with `aria-modal="true"`, labelled from `alt`. The backdrop is `aria-hidden` — the pointer shortcut whose keyboard equivalents are `Escape` and the real close button. The badge is `aria-hidden` (the trigger already carries the name). A clip takes `aria-label` from `alt`; an autoplaying clip is muted so it never seizes a screen reader's audio.
- The lightbox Teleports to `body` and locks body scroll while open, so assistive tech and the pointer agree on what is interactive.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons) on all frame chrome tokens.
- Touch target: the zoom trigger is the whole picture; the close control is a padded button at the viewport corner.

## Stories (Storybook)

- Default — a frame around composed markup (default slot) with a plain-text caption.
- Media — composite story: one `src` renders a still as an image and a clip source as a player. Justified in writing here because the rendered element itself switches on the source extension, which no single-arg story can show.
- Autoplay — state story for the `autoplay` prop, shown on both authoring paths (the prop, and a hand-written clip in the slot the frame rewrites) — the two paths are the contract, so both must be visible.
- Prose — the caption and hint slots carrying rich content (a bold run, a link, a code chip) over their string-prop fallbacks. Justified in writing here because the slot-with-prop-fallback shape is the component's prose contract and is invisible in the arg-driven story.

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
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
