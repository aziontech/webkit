---
name: client-mosaic
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-04
last_updated: 2026-11-04
checksum: fae54f52cebd1ed9e0b0fbb745d1ca9f0633431f87c77b7cf42befee4736f04d
---
# ClientMosaic — Component Spec

## Purpose

The client mosaic: a framed bento grid of customer cells where a story cell carries a photograph, the client's mark, one line of its result and a "read the case study" link, and a mark cell carries only the client's linked logo on a chosen fill. The layout is derived from the data: the first story spans two columns and two rows, every other story one column and two rows, every mark one cell. It is a page section — the site places it from a `{ _id: 'client-mosaic', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `bento-grid` and `mini-button`.

## When to use

- On the home page, to show the best customer stories and a wall of marks in one band.

## When NOT to use

- For three equal story columns → use `client-mosaic-columns`.
- For a plain wall with one quote → use `logo-wall-quote`.

## Related

- `bento-grid` — the grid the cells are laid in.
- `client-mosaic-columns` — the three-column sibling with brand-coloured faces.
- `sections` — the registry compound that renders this block from a page's `sections[]` JSON.

## Best practices

- Two stories and six marks fill the four-column grid exactly.
- Pick `fill` and `logoTreatment` together: a `knockout` mark reads on `white` or `primary`, a `monochrome` one on `canvas` or `surface`.

## Usage

```vue
<script setup>
import ClientMosaic from '@aziontech/webkit/sections/client-mosaic'
</script>

<template>
  <ClientMosaic
    aria-label="Client stories"
    link-label="Read the case study"
    :stories="[
      { logo: '/logos/netshoes.svg', logoAlt: 'Netshoes', photo: '/photos/netshoes.jpg', text: 'Netshoes automatically blocks more than 4 million threats in six months', href: '/success-case/netshoes' }
    ]"
    :logos="[
      { logo: '/logos/dafiti.svg', logoAlt: 'Dafiti', href: '/success-case/dafiti', fill: 'white', logoTreatment: 'knockout' },
      { logo: '/logos/agibank.svg', logoAlt: 'Agibank', href: '/success-case/agibank' }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `ariaLabel` | `string` | `''` | false | Accessible name of the grid. |
| `linkLabel` | `string` | `''` | false | Label of the link under every story. |
| `stories` | `ClientMosaicStory[]` | `[]` | false | The story cells, in order; each is `{ logo, logoAlt, photo, text, href, fill?, logoTreatment? }`. The first spans two columns and two rows, the rest one column and two rows. |
| `logos` | `ClientMosaicLogo[]` | `[]` | false | The mark cells, in order; each is `{ logo, logoAlt, href, fill?, logoTreatment? }` where `fill` is `'canvas'`, `'surface'`, `'white'` or `'primary'` and `logoTreatment` is `'monochrome'`, `'knockout'` or `'as-is'`. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` and `focus-visible` on each cell
- `data-fill` on every cell face drives its fill; `data-treatment` on every mark drives its ink; `data-lead` on the first story sets its larger text
- Empty: when both `stories` and `logos` are empty the band renders nothing

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover fill change on a cell | `transition-colors duration-fast-02 ease-productive-entrance` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (lead story) | `.text-heading-md` |
| typography (story) | `.text-body-lg` |
| story text | `var(--text-default)` |
| canvas fill | `var(--bg-canvas)` |
| canvas hover fill | `var(--bg-surface-raised)` |
| surface fill | `var(--bg-surface)` |
| primary fill | `var(--primary)` |
| focus ring | `var(--ring-color)` |
| cell inset | `var(--spacing-xl)` |
| story rhythm | `var(--spacing-md)` |
| frame rules and marks | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| white face for knockout marks | `var(--color-base-white)` | `TODO: tokenizar` a semantic knockout-face token |

## Accessibility (WCAG 2.1 AA)

- Visible focus: every mark cell is a link with `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset`; the story link is a `mini-button` with its own ring.
- Keyboard map: `Tab` moves between mark links and story links; `Enter` follows.
- ARIA: the band is a `<section>` named by `ariaLabel`; the photo of a story is decorative (`alt=""`, `aria-hidden`); every mark carries `logoAlt`; the story text is a paragraph and its link is named by `linkLabel`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): story text `var(--text-default)` over the canvas gradient; marks are inked to their fill through `logoTreatment`.
- `motion-reduce:transition-none` on the fill transition.
- Touch target ≥40×40 px — each mark cell is a full grid cell.

## Stories (Storybook)

- Default

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
