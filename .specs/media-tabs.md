---
name: media-tabs
category: marketing
structure: monolithic
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/QEbHSTFDWfh4VHkBp6NWN3/Azion.com?node-id=13138-296208
  node_id: 13138-296208
checksum: fca4074145a200854e1f7bf43d5bd402836c9ee938958a45834937e30024f7e9
created: 2026-09-24
last_updated: 2026-09-24
---

# Media Tabs — Component Spec

## Purpose

A band split in two: a stack of claims on one side, one piece of media on the other, and only the selected claim's media on screen. The selection moves on hover, on click, and on a timer, so the band reads on its own and still answers a reader who takes it over. Its height is its own — each row carries a height the component sets from `size`, and the media column is exactly as tall as the stack — so the band never inherits a height from the section it lands in.

## When to use

- For a run of peer claims that share one picture frame — three ways a platform is fast, four things a product does.
- When each claim needs a sentence of its own, not a bullet: the copy is the content and the media illustrates it.
- As a product-page band that rewards watching but does not require it.

## When NOT to use

- For a numbered sequence where the order is the argument → use `accordion-gallery`, which is a walkthrough with a progress bar per step.
- For one claim beside one picture → use `media-split`.
- For questions and answers → use `faq`.
- For switching a page's content between peer views the reader navigates → use `tab-view`, which is a real ARIA tab set.

## Related

- `accordion-gallery` — the sequenced sibling: ordered steps with bullet points, each drawn in its own `frame-box`. This band's rows are full-bleed cells divided by hairlines, and its claims are peers.
- `media-split` — one claim, one picture, no selection.
- `illustration` — the official scene a tab's `media` slot usually holds.
- `frame-box` — the registration frame the page wraps the band in; the band draws only its own top and bottom rules and the seam between its columns.
- `section-title` — the heading above the band; this component carries no title of its own.

## Best practices

- Write the tabs as peers. A reader arrives mid-rotation, so no row may depend on the row above it.
- Keep a tab's title to one line and its description to two. The row has a fixed height, and copy that overruns it pushes the media column taller than the design.
- Give every tab a medium: the frame holds one at a time and cross-fades within it, so a tab with nothing to show reads as a broken rotation, not as a quiet one.
- Use scenes of the same shape. The frame does not resize between tabs.
- Leave `autoPlay` on for a band a reader is expected to watch. It pauses under the pointer, stops for good on a click, and never starts under reduced motion.
- Pick `size` from the copy, not from the section: `medium` holds a title and two lines, `large` a title and four.

## Usage

```vue
<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import MediaTabs from '@aziontech/webkit/media-tabs'

  const scenes = ['ai-applications', 'live-debugging']
</script>

<template>
  <MediaTabs
    :items="[
      {
        title: 'Run AI models close to users',
        description:
          'Execute models on the Azion Web Platform across hundreds of locations to deliver real-time responses with median latency under 30 ms.',
        src: '',
        alt: 'Inference running at the edge locations closest to each user'
      },
      {
        title: 'Keep every inference accounted for',
        description:
          'Meter tokens, latency and cost per model as the traffic happens, with no agent to install.',
        src: '',
        alt: 'Token and latency counters updating as requests arrive'
      }
    ]"
  >
    <template #media="{ index }">
      <Illustration :name="scenes[index]" />
    </template>
  </MediaTabs>
</template>
```

## Props

| Prop               | Type                             | Default    | Required | JSDoc                                                                                                                                                               |
| ------------------ | -------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`            | `MediaTabsItem[]`                | `[]`       | false    | The tabs, in order; each item is `{ title, description, src, alt }`.                                                                                                |
| `selectOn`         | `'hover' \| 'click'`             | `'hover'`  | false    | What moves the selection as the reader points at a row. A click always selects, on either setting.                                                                  |
| `autoPlay`         | `boolean`                        | `true`     | false    | Advances to the next tab on a timer; pauses under pointer or focus, stops for good on a click, and never runs under reduced motion.                                 |
| `autoPlayInterval` | `number`                         | `5000`     | false    | Milliseconds each tab is held before the band advances.                                                                                                             |
| `showProgress`     | `boolean`                        | `true`     | false    | Advances a hairline along the active row's bottom edge while the timer runs.                                                                                        |
| `size`             | `'small' \| 'medium' \| 'large'` | `'medium'` | false    | Height each row is held to, as a multiple of the band's own padding step; copy longer than that grows its row, and the media column is always as tall as the stack. |

## Events

| Event        | Payload                         | Notes                                                                                                           |
| ------------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `tab-change` | `(event: Event, index: number)` | The selection moved; `index` is the tab now shown. Fires on a reader's hover or click, not on an autoplay tick. |

## Slots

| Slot    | Scope                                                     | Notes                                                      |
| ------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| `media` | `{ item: MediaTabsItem, index: number, active: boolean }` | The tab's media; replaces the image built from `item.src`. |

## States

- Visual states: `default`, `hover`, `focus-visible` on each row
- `data-active` marks the selected row; it steps up to the raised surface while the others rest on the plain one
- `data-autoplay` is present on the root while the timer is running, so a page can tell a moving band from a resting one
- `data-size` carries the size token, which is what sets the row height every column measures from
- `data-select-on` carries the interaction mode
- The media frame shows exactly one medium at full opacity; the rest are present and transparent, which is what lets them cross-fade
- Empty: when `items` is empty the band renders nothing

## Motion & Animations

| Trigger                        | Animation / Transition                                            | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                                                   |
| ------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| selection change (media)       | `transition-opacity duration-slow-01 ease-out`                    | `slow-01` (400ms)                                 | `motion-reduce:transition-none` (swaps instantly)                         |
| selection change / hover (row) | `transition-colors duration-moderate-01 ease-out`                 | `moderate-01` (150ms)                             | `motion-reduce:transition-none`                                           |
| autoplay progress              | `transition-[width] duration-fast-01 ease-linear` on the hairline | `fast-01` (70ms)                                  | autoplay does not start under reduced motion, so the hairline never moves |

## Tokens

| Region                                 | Token (DESIGN.md)          |
| -------------------------------------- | -------------------------- |
| typography (tab title)                 | `.text-heading-md`         |
| typography (tab description)           | `.text-body-md`            |
| tab title text                         | `var(--text-default)`      |
| tab description text                   | `var(--text-muted)`        |
| resting row surface                    | `var(--bg-surface)`        |
| active row surface                     | `var(--bg-surface-raised)` |
| media frame surface                    | `var(--bg-canvas)`         |
| rules and column seam                  | `var(--border-default)`    |
| autoplay hairline                      | `var(--primary)`           |
| spacing (row padding, row height unit) | `var(--spacing-xl)`        |
| spacing (title to description)         | `var(--spacing-md)`        |
| ring                                   | `var(--ring-color)`        |

## Theme gaps

<!-- No new token group. The row height is a multiple of `--spacing-xl`, the band's own
     padding step, at the ratio 3 : 4.5 : 6 — so the height scales with the viewport exactly
     as the padding inside it does, and the component declares no scale of its own. -->

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: each row's title is a real `<button>` carrying `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Keyboard map: `Tab` moves between rows and `Enter` / `Space` selects one — the rows are buttons, not clickable containers, so no key handler is bolted onto a `div`.
- ARIA: the rows are a `<ul>` of `<li>`, each holding the button; the active button carries `aria-current="true"`. Each medium carries its tab's `alt` text, and the inactive media are `aria-hidden` so the frame announces one picture rather than all of them.
- **Not `role="tablist"`.** A tab's label here is a heading and a paragraph — the copy is the content, and the media only illustrates it. Real tabs promise a roving `tabindex` and arrow-key navigation over short labels; this band is a list of claims a reader tabs through one at a time, so it is announced as the list it is rather than as a tab set whose keyboard contract it does not honour.
- **WCAG 2.2.2 (pause, stop, hide):** autoplay is moving content, so it must be stoppable. It stops permanently on a click, pauses while the band has hover or focus, and does not start at all under `prefers-reduced-motion`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the description is `var(--text-muted)`, a known theme-level shortfall on the light canvas (see `big-numbers`); every other text region is `var(--text-default)`.
- Touch target ≥40×40 px — each row's button spans the whole row, well past the minimum.

## Stories (Storybook)

- Default
- Sizes — composite story rendering every `size` value, so the row-height ladder that the media column measures from is visible in one frame
- Static — `autoPlay` off and `selectOn` on click, so the band rests on its first tab and a reader can inspect it without it moving

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
