---
name: client-mosaic-columns
category: sections
structure: monolithic
status: implemented
spec_version: 3
created: 2026-11-04
last_updated: 2026-11-15
checksum: ecafb245de3287489424ee0c9b6619d6d5d668a492d0c8a63b4ca227673d2b0f
---

# ClientMosaicColumns — Component Spec

## Purpose

Three featured success stories side by side: each column is a client's mark on a face painted in the client's own brand colour, over a one-line story that links to the case. With `reveal="hover"` each column is one card instead: the client's reversed logo on its brand face, which opens while hovered or focused to reveal the story line and a "Read story" cue, the whole card linking to the case; below the large breakpoint those cards stack and stay open. It is a page section — the site places it from a `{ _id: 'client-mosaic-columns', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box` and `logo-wall`. The retired `customer-spotlight` `_id` resolves here with `reveal: 'hover'`.

## When to use

- Use ClientMosaicColumns for three or four client cards in brand colours linking to case studies; `reveal="hover"` shows the story on hover.

## When NOT to use

- For a bento of client stories with photos and logos → use `client-mosaic`.
- For a quotation → use `client-quotes` or `logo-wall-quote` `kind="quote"`.

## Related

- `client-mosaic` — the bento sibling.
- `logo-wall` — the single-mark wall each column's face is rendered with.

## Best practices

- Three cells for `reveal="always"` (the grid is three columns from the large breakpoint); three or four for `reveal="hover"`, which shares the row between them.
- With `reveal="hover"` use the client's reversed (white) logo and one sentence per story; `logoWidth` sizes the mark as a share of the card (default `35%`).
- Leave `brand` out for a client the client registry knows (`clientBrand(name)` from `@aziontech/webkit/assets/client-registry`): the face reads its colours, and its ink, by `name`. Add a missing client to the registry rather than writing its hex colours into the page.
- Pass `brand` only for a one-off client the registry does not carry: `base` and `glow` may be any CSS colour, and `ink` is `'dark'` when the face is light enough that the link text must be dark. A cell with neither paints a black face.

## Usage

```vue
<script setup>
  import dafitiLogo from '@aziontech/webkit/assets/dafiti-extended-reversed.svg'
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import ClientMosaicColumns from '@aziontech/webkit/client-mosaic-columns'
</script>

<template>
  <ClientMosaicColumns
    aria-label="Featured success stories"
    link-label="Read story"
    :cells="[
      {
        name: 'Magalu',
        logo: magaluLogo,
        href: '/success-case/magalu',
        story: 'How Magalu enhances cybersecurity with Azion.',
        logoTreatment: 'monochrome'
      },
      {
        name: 'Dafiti',
        logo: dafitiLogo,
        href: '/success-case/dafiti',
        story: 'Dafiti modernized its digital architecture.',
        logoTreatment: 'knockout'
      }
    ]"
  />
</template>
```

## Props

| Prop        | Type                        | Default    | Required | JSDoc                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------- | --------------------------- | ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `anchor`    | `string`                    | `''`       | false    | In-page id set on the band so a hash link can target it.                                                                                                                                                                                                                                                                                                                                                        |
| `ariaLabel` | `string`                    | `''`       | false    | Accessible name of the list of stories.                                                                                                                                                                                                                                                                                                                                                                         |
| `linkLabel` | `string`                    | `''`       | false    | Label the mark face reveals on hover and the link's accessible name.                                                                                                                                                                                                                                                                                                                                            |
| `cells`     | `ClientMosaicColumnsCell[]` | `[]`       | false    | The stories, in order; each is `{ name, logo, href, story, brand?, logoTreatment?, logoWidth? }` where `brand` is `{ base, glow, ink? }` (CSS colours painting the face, `ink` `'dark'` or `'light'`) and defaults to the client registry's colours for `name`, `logoTreatment` is `'monochrome'`, `'knockout'` or `'as-is'`, and `logoWidth` (read by `reveal="hover"`) sizes the mark as a share of the card. |
| `reveal`    | `ClientMosaicColumnsReveal` | `'always'` | false    | When the story shows: `always` under each face, or `hover`, where each card opens to reveal it while hovered or focused and stays open below the large breakpoint.                                                                                                                                                                                                                                              |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` on each column (the face reveals the link line, the story fill rises)
- The face colours are bound as the `--wall-face` and `--wall-ink` custom properties from `brand`, or from the client registry by `name` when `brand` is left out; `data-treatment` on every mark drives its ink
- `reveal="hover"`: each list item carries `data-state=open|closed`; one card is open at a time on large screens, every card is open below the large breakpoint
- Empty: when `cells` is empty the band renders nothing

## Motion & Animations

| Trigger                     | Animation / Transition                                                                                                                                                                                                | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------- |
| hover fill on the story     | `before:transition-opacity before:duration-moderate-01 before:ease-productive-entrance`                                                                                                                               | inline (matches catalog)                          | `motion-reduce:before:transition-none` |
| `reveal="hover"` card opens | `transition-[translate] duration-moderate-02 ease-productive-entrance` (logo rises), `transition-[translate,opacity] duration-moderate-02` (story panel), `transition-[opacity,translate] duration-moderate-01` (cue) | inline (matches catalog)                          | `motion-reduce:transition-none`        |

## Tokens

| Region                    | Token (DESIGN.md)       |
| ------------------------- | ----------------------- |
| typography (story)        | `.text-heading-sm`      |
| story text                | `var(--text-default)`   |
| story fill                | `var(--bg-canvas)`      |
| story hover fill          | `var(--bg-hover)`       |
| story inset               | `var(--spacing-lg)`     |
| mark lift                 | `var(--spacing-sm)`     |
| grid gaps and frame marks | `var(--border-default)` |

## Theme gaps

| Figma variable           | Temporary primitive                                   | Follow-up                                      |
| ------------------------ | ----------------------------------------------------- | ---------------------------------------------- |
| link ink on a brand face | `var(--color-base-white)` / `var(--color-base-black)` | `TODO: tokenizar` semantic on-brand ink tokens |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the mark link is `logo-wall`'s, with its ring; the story panel is a duplicate link hidden from the tab order and from assistive technology.
- Keyboard map: `Tab` moves between the three mark links; `Enter` follows.
- ARIA: the band is a `<section>`; the grid is a list named by `ariaLabel` whose items are the columns; each mark carries the client `name` as `alt`; the story panel is `aria-hidden` with `tabindex="-1"` so the case is reachable once.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the link line ink follows `brand.ink`; the story text is `var(--text-default)` on `var(--bg-canvas)`.
- `motion-reduce:before:transition-none` on the hover fill.
- Touch target ≥40×40 px — each mark face spans its column.
- `reveal="hover"`: the list carries the one accessible name (`ariaLabel`, else the built-in "Customer stories"); each card is one link named "<link label>, <client>: <story>", so its logo is decorative (`alt=""`); focus opens the card the same way hover does and the ring is drawn inside the card; `pi-arrow-up-right` mirrors under right-to-left.

## Internationalization

| Key                       | English source     | Override prop                          |
| ------------------------- | ------------------ | -------------------------------------- |
| `customerSpotlight.list`  | `Customer stories` | `ariaLabel` (read by `reveal="hover"`) |
| `customerSpotlight.story` | `Read story`       | `linkLabel` (read by `reveal="hover"`) |

## Examples

- Default
- Reveal on hover — four client cards that open on hover or focus.

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
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
