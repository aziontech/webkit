---
name: band-stack
category: marketing
structure: monolithic
status: implemented
spec_version: 1
created: 2026-09-26
last_updated: 2026-10-01
checksum: d973fd2e497002fa56c0a59f4c978042d4cfb26fed19331a933c854cceb4f764
---

# Band Stack — Component Spec

## Purpose

A run of framed bands that follow one another down the page, each one drawn as two registration frames — its left half and its right half — sharing a hairline with the next. With `sticky` on, each band pins under the site header a step lower than the band before it, so the run piles up as the reader scrolls and every band already read stays visible as a ledge above the one being read.

The component owns the band rules, the shared hairlines and the pin offsets, and by default every band is split into two frames: a `media-split` composed into the stack frames its copy cell and its media cell as two `frame-box`es, left and right, each with its four marks. The bands themselves are whatever the consumer composes into the default slot — each direct child becomes one band. It carries no copy, heading or media of its own.

## When to use

- For a run of peer bands — three to six `media-split`s, one per solution or capability — that should read as one sequence.
- With `sticky`, when the run is the page's centrepiece and the reader should feel each band land on the last.
- Without `sticky`, to frame a run of bands with one shared hairline between neighbours, with no pinning.

## When NOT to use

- For a run where the scroll position should decide which claim is open beside one media pane → use `sticky-stack`.
- For peer claims a reader jumps between at will → use `media-tabs`.
- For a single band → frame it with `frame-box` directly, or set `framed` on the `media-split`.
- For a grid of cards → use `card-grid`.

## Related

- `media-split` — the band this stack holds, typically at `size="large"`. Inside the stack it frames its own two cells, so leave its `framed` off.
- `sticky-stack` — the scroll-driven sibling: one pinned frame whose open claim follows the scroll, instead of bands that pile up.
- `frame-box` — the frame each band is drawn in.
- `section-gap` — the spacer usually above the stack; pass `flush` so the first band does not draw a second rule under it.

## Best practices

- Keep the run to three to six bands. With `sticky` every band read stays pinned as a ledge, and a long run fills the viewport with ledges.
- Give every band the same height class (`media-split` `size="large"`, same `align`), so the ledges line up as the pile grows.
- Pass `flush` when the element directly above the stack already draws a rule (a `section-gap`, another frame), so the first band does not draw a second one.
- Give each band an opaque fill (`media-split` paints its own cells). A pinned band covers the one before it, and a transparent band shows the one underneath through it.
- Compose `media-split`s as the bands. The two frames are the band's own cells, so a child that is not a `media-split` carries no marks unless it frames itself — wrap it in a `frame-box` with `borders="none"`.
- Render the bands with `v-for` directly in the default slot; each direct child is one band, so a wrapper element around them collapses the run into a single band.

## Usage

```vue
<script setup>
  import BandStack from '@aziontech/webkit/band-stack'
  import MediaSplit from '@aziontech/webkit/media-split'
</script>

<template>
  <BandStack sticky flush>
    <MediaSplit
      title="Build and Run Applications"
      description="Deploy applications and static sites straight from Git."
      size="large"
      align="center"
      :heading-level="3"
      media-href="/site/solutions"
    />
    <MediaSplit
      title="Secure Applications and Networks"
      description="Stop DDoS attacks, bots and exploits before they reach your origin."
      size="large"
      align="center"
      :heading-level="3"
      media-href="/site/solutions"
    />
  </BandStack>
</template>
```

## Props

| Prop     | Type      | Default | Required | JSDoc                                                                                                                                      |
| -------- | --------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `sticky` | `boolean` | `false` | false    | Pin each band under the site header from `lg` up, a step lower than the band before it, so the run piles up as the page scrolls.           |
| `flush`  | `boolean` | `false` | false    | Drop the first band's top rule, for a stack sitting directly under an element that already draws one.                                      |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                                                                                               |
| --------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default` | —     | The bands. Each direct child — including every child a `v-for` renders — is wrapped in its own frame and becomes one band; comment nodes are skipped. |

## States

- Visual states: `default`
- `data-sticky` mirrors the `sticky` prop and is what pins the bands: from `lg` up each band is `position: sticky`, its `top` the site header's height plus one `var(--spacing-md)` step per band before it. Below `lg` the bands stack in normal flow with no pinning, because a pinned pile of full-width bands leaves a phone no room to read
- `data-flush` mirrors the `flush` prop; the first band's frame then draws no top rule
- Each band is a `frame-box` with its top and bottom rules and no marks of its own. The stack provides a context that tells a `media-split` band to frame its two cells, left and right, each with all four registration marks, so every band reads as two frames and both sides of its seam are ticked. Every band after the first pulls up one pixel so neighbouring rules overlap into a single hairline, while each band still owns its top rule — the rule a pinned band shows when it covers the one before it
- The pin offset is owned by the component, not the page: the stack pins below the site header's `3.5rem` bar, and a page sets nothing to get it
- Later bands paint over earlier ones in DOM order, so the pile grows downward with no `z-index` of its own

## Motion & Animations

_none_ — pinning follows the scroll position; the component declares no transition or animation.

## Tokens

| Region                        | Token (DESIGN.md)                                      |
| ----------------------------- | ------------------------------------------------------ |
| band rules and cell marks     | `var(--border-default)` (drawn by `frame-box`)          |
| pin step between bands        | `var(--spacing-md)`                                    |
| pin start (site header height) | `calc(var(--spacing) * 14)` — see Theme gaps           |

## Theme gaps

| Figma variable        | Temporary primitive                                                        | Follow-up         |
| --------------------- | -------------------------------------------------------------------------- | ----------------- |
| site header height    | `calc(var(--spacing) * 14)`, the same `3.5rem` `global-header` sets with `h-14` | `TODO: tokenizar` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable to the stack; controls inside each band keep their own `focus-visible` ring.
- Keyboard map: none of its own — `Tab` moves through each band's controls in DOM order, band by band.
- ARIA: the stack is a plain `div` with no role; each band keeps its own semantics (`media-split` is a `section` named by its heading).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): not applicable — the stack draws only rules; each band owns its text contrast.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the stack declares no motion. Pinning is scroll position, not animation.
- Touch target — not applicable; the stack composes no control of its own.

## Stories (Storybook)

- Default — three `media-split` bands at `size="large"`, not pinned, so the two frames of each band and the shared hairlines are the only thing on show.
- Sticky — the same run with `sticky` and `flush` on. It sets `parameters.layout: 'fullscreen'`; a story cannot scroll itself, so the canvas shows the resting state and the reader scrolls the Docs page to see the pile form.

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
