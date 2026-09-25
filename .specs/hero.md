---
name: hero
category: marketing
structure: composition
status: approved
spec_version: 2
checksum: 48937c972b92abedbf501e860f1e5abeb4390dddd3b4bf34b0179f2120073d96
created: 2026-09-22
last_updated: 2026-09-24
---

# Hero — Component Spec

## Purpose

The opening band of a page: a full-bleed section spanning the whole viewport width whose copy is centered in a capped column, optionally filling one screen and optionally carrying a decorative backdrop behind it. It is the top layer of the page language and the owner of the page's first rule — the bottom hairline every column below it hangs from. `Hero.Title` is the copy block it centers.

## When to use

- As the opening band of a marketing, hub or documentation page.
- Whenever a band must span the window while its copy stays on the page's measure.
- For any band that carries a decorative backdrop behind its content.
- With `kind="screen"` when the opening should measure exactly one viewport.

## When NOT to use

- For the framed column of bands below the opening → use `section-container`.
- For one band inside that column → use `section-module`.
- For a section header further down the page → use `section-title`, which renders an `h2`.
- For a mid-page announcement → use `banner`; for the closing ask → use `call-to-action`.
- For a copy-and-media pairing that is not the page opening → use `media-split`.

## Related

- `section-container` — the framed column below it; this band's `border-b` is that column's top edge.
- `section-module` — the brick stacked inside that column.
- `texture-material` — the backdrop the `texture` prop paints, and what the `background` slot usually holds.
- `media-split` — the same copy-beside-media shape at section scale, rendering an `h2`.
- `banner` — the mid-page announcement band.

## Best practices

- One `Hero` per page. It owns the `h1` through `Hero.Title`, and a second breaks the document outline.
- Pass `kind="screen"` for an opening band that should measure one screen, and declare the sticky bar's height as `--banner-offset` so the band still measures exactly one screen beneath it.
- Put the backdrop in the `background` slot rather than on the band's own class: the slot renders beneath the content layer and is already marked decorative.
- Turn `padded` off when the slotted content owns its block rhythm; the inline inset is not optional, because it is the page boundary the bar above the band also reads.
- Keep `highlight` to the opening phrase of the headline — it is the same sentence, only painted differently.
- Put the calls to action in `Hero.Title`'s `actions` slot; it stacks them full-width on narrow screens, which is what makes a hero button a comfortable thumb target.
- Reach for `floorTexture` rather than wiring a texture into the `bottom` slot by hand: the window is a fixed cell, so the band already carries the ink and the horizontal falloff fitted to it, and a hand-fitted copy of that drifts.
- Leave the `media` slot out entirely rather than filling it with decoration — a band with one column and a strong statement beats one with a stock image.

## Usage

```vue
<script setup>
import Hero from '@aziontech/webkit/hero'
import Button from '@aziontech/webkit/button'
</script>

<template>
  <Hero
    kind="screen"
    max-width="site"
    texture="dots"
    texture-fade="bottom"
  >
    <Hero.Title
      centered
      eyebrow="Edge platform"
      highlight="Build anything."
      title="Run it everywhere."
      description="Ship applications, security and observability from one platform."
    >
      <template #actions>
        <Button label="Start for free" />
        <Button
          kind="outlined"
          label="Talk to sales"
        />
      </template>
    </Hero.Title>
  </Hero>
</template>
```

The standalone imports stay available and are the tree-shaking path — `@aziontech/webkit/hero-root` for the band alone, `@aziontech/webkit/hero-title` for the copy block alone.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `HeroKind` | `'band'` | false | Height of the band; `screen` fills one viewport minus `--banner-offset`. |
| `maxWidth` | `HeroWidth` | `'7xl'` | false | Width the inner column is capped at; `site` is the marketing measure, `full` keeps only the inset. |
| `bordered` | `boolean` | `true` | false | Draw the band's bottom rule, which is the top edge of whatever follows it. |
| `padded` | `boolean` | `true` | false | Apply the band's own vertical rhythm. The inline inset is always applied. |
| `texture` | `TextureMaterialKind` | `'none'` | false | Paint this texture behind the band's content; `none` leaves the backdrop to the `background` slot. |
| `textureFade` | `TextureMaterialFade` | `'none'` | false | Fade applied to the layer the `texture` prop paints. |
| `floorTexture` | `TextureMaterialKind` | `'none'` | false | Paint this texture standing on the band's floor, filling the `bottom` window under the brand strip. |
| `align` | `HeroAlign` | `'center'` | false | Where the content column sits vertically when the band fills a screen. |
| `carousel` | `boolean` | `false` | false | Stand the brand strip on the band's floor, under the `bottom` window. |
| `carouselMarks` | `string[]` | `[]` | false | Registry names of the marks the strip shows, in order. |
| `carouselLabel` | `string` | `''` | false | Overline above the brand strip, stating the claim the marks make. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The band's copy, centered in the capped column above the backdrop; usually one `Hero.Title`. |
| `media` | — | Screenshot, diagram or form set beside the copy from `md` up. When filled, the content column becomes two columns and the copy keeps the leading one. |
| `background` | — | Decorative backdrop rendered full-bleed beneath the content; marked `aria-hidden`. |
| `top` | — | Decorative asset window overlaying the band's top edge; clips its child, which may be larger than the window and offset inside it. It claims no space, so content still centres on the band. |
| `bottom` | — | Asset window standing on the band's floor; clips its child, which may be larger than the window and offset inside it. It is real content, so it **reserves its height** and `align` centres the copy in what is left. It shares the floor with the `carousel` strip, which stands under it. `floorTexture` fills this same window when the asset is one of the system's textures. |

## Sub-components

The root `Hero` owns the band — the full-bleed section, the capped column, the bottom rule, the backdrop and asset windows, and the one-screen height. `Hero.Title` owns the copy block placed in its default slot. There is no shared state between them: the band is a layout shell and the copy block is self-contained, so nothing is provided or injected and the consumer wires nothing. Member names mirror this component's anatomy; the band has no `data-state="open|closed"`, so it has no `Trigger` or `Content`.

- `hero-title/hero-title.vue` — the page's leading statement: overline, `h1` with an optionally accented opening phrase, supporting paragraph and the actions row. Renders a `header`, so it carries the band's document outline.
  - Props: `title` (`string`, required) — headline of the page, rendered as the page's `h1`; `highlight` (`string`, `''`) — opening phrase of the headline, painted in the brand accent, reading as one sentence with `title`; `description` (`string`, `''`) — supporting sentence under the headline, overridden by the default slot; `eyebrow` (`string`, `''`) — short uppercase overline rendered above the headline; `centered` (`boolean`, `false`) — centre the whole block instead of aligning it to the start.
  - Events: _none_.
  - Slots: `default` — description body, replacing the `description` prop when provided; `actions` — the page's leading calls to action, stacked full-width below `20rem` and laid out in a row above it.

## States

- Visual states: `default`
- `data-kind` carries the band's height mode (`band` or `screen`)
- `data-width` carries the resolved width key
- `data-bordered` present when the bottom rule is drawn
- `data-padded` present when the band applies its own vertical rhythm
- `data-media` present when the `media` slot is filled and the content column is split in two
- `data-align` carries where the content column sits vertically in a `screen` band. The column takes the band's leftover height, so `center` is the centre of the space actually available — a `bottom` asset reserves its height and the copy centres above it, while a `top` asset overlays and claims none
- The band is an `isolate` stacking context, so its layer order never leaks into the page. Layer tokens set that order: `--banner-z-background` (0), `--banner-z-top` / `--banner-z-bottom` (1), `--banner-z-content` (10)
- Each asset window clips its slotted child, so an asset larger than the band shows only the part the window frames. Custom properties place it: `--banner-top-height` / `--banner-bottom-height` size the window, and `--banner-top-x` / `-y`, `--banner-bottom-x` / `-y`, `--banner-background-x` / `-y` move the asset inside it
- `data-floor` present when `floorTexture` paints the floor window. The window then takes a fluid default height (`clamp(9rem, 30dvh, 34rem)`) so a `screen` band still measures one screen on a laptop and caps at the design's field where there is room; with no floor texture it stays `auto` and is sized by its slotted child. `--banner-bottom-height` overrides either, and `--banner-floor-ink` (0.6) sets how strongly the texture reads
- The floor holds the `bottom` window and the `carousel` strip in one block, so a single ground covers both: `--banner-floor-bg` (transparent by default) paints it, which is how a design plinths the floor a shade off the band's own canvas
- `carousel` loads the strip on demand, so a band without one pulls in neither the strip nor its mark registry
- `carouselLabel` names what the strip is evidence of; left empty the marks stand alone, which is the right register when the band's copy has already said it

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| band fill | `var(--bg-canvas)` |
| band floor ground | `var(--banner-floor-bg, transparent)` — set by the consumer |
| floor strip rhythm | `var(--spacing-xl)` |
| floor texture ink | `var(--banner-floor-ink, 0.6)` |
| band rule | `var(--border-default)` |
| band inset | `var(--layout-boundary-inline)` |
| band rhythm | `var(--spacing-xl)` |
| media column gap | `var(--spacing-xxl)` |
| copy block rhythm | `var(--spacing-md)` |
| headline | `.text-heading-2xl`, `var(--text-default)` |
| accent phrase | `var(--color-orange-400)`, `var(--primary)`, `var(--color-orange-600)` |
| description | `.text-body-lg`, `var(--text-muted)` |
| asset window clip | — (geometry, set by the consumer's `--banner-*` properties) |
| width cap | `var(--container-3xl)` … `var(--container-7xl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable to the band — it is a container; controls composed into it keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color)` ring.
- Keyboard map: none — the band is not focusable; `Tab` order is decided entirely by the slotted content.
- ARIA: the root renders a `section` and adds no role; the backdrop and the top asset window are wrapped `aria-hidden="true"` so decoration never reaches the accessibility tree. `Hero.Title` renders a `header` holding the page's single `h1`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — the backdrop is decoration and the slotted copy owns its own contrast against the canvas.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable to the band; the actions row in `Hero.Title` stacks full-width below `20rem` so each control clears the target.

## Stories (Storybook)

- Default
- Widths — composite story rendering the width keys side-by-side (justified: a cap is only legible when two are compared in one view)
- Screen — the band filling one viewport (mutually-exclusive state of the `kind` prop)
- Media — the band with the copy beside a media column (justified: the two-column split is a structural mode the default story cannot show)
- Background — the band with a backdrop in its `background` slot (justified: the layering of backdrop beneath copy is the band's one non-obvious behaviour)
- Backdrops — composite story rendering every `texture` value (justified: a texture is a multi-option axis, and the canonical composite story for it)
- AssetWindows — the `top` and `bottom` slots filled (justified: the clipping windows and their `--banner-*` geometry cannot be read from the prop table)
- Alignment — composite story rendering every `align` value (justified: a multi-option axis whose effect only exists in a `screen` band)
- PageLanguage — the band above a `section-container` (justified: the band's `border-b` is another component's top edge, and that handoff is the reason the band exists)
- Carousel — the band with a `floorTexture` field and the brand strip on its floor (justified: the strip is a floor region the prop table cannot show, and its plinth ground is set by a custom property rather than a prop)

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
