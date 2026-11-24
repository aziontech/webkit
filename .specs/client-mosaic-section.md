---
name: client-mosaic-section
category: section
structure: monolithic
status: implemented
spec_version: 4
template: 2
created: 2026-11-04
last_updated: 2026-11-24
checksum: 6e940b2f4c07e3332c1d9766c7bfc5a3ea73964a68461642696405e8ba7ec600
---

# ClientMosaicSection — Component Spec

## Purpose

The client mosaic: a framed bento grid of customer cells where a story cell carries a photograph, the client's mark, one line of its result and a "read the case study" link, and a mark cell carries only the client's linked logo on a chosen fill. With `stories` and `logos` the layout is derived from the data: the first story spans two columns and two rows, every other story one column and two rows, every mark one cell. With `cells` the page places story and mark cells in one ordered list, each with its own column and row span, so stories and marks interleave as on the home page. It is a page section — the site places it from a `{ _id: 'client-mosaic-section', props }` entry and binds `props` straight onto it — and it composes `module`, `registration-frame`, `bento-grid`, `logo` and `link`.

## When to use

- On the home page, to show the best customer stories and a wall of marks in one band.

## When NOT to use

- For three equal story columns → use `client-story-columns-section`.
- For a plain wall with one quote → use `logo-wall-section`.

## Related

- `bento-grid` — the grid the cells are laid in.
- `client-story-columns-section` — the three-column sibling with brand-coloured faces.
- `third-party-logo` — draws every client mark in the ink its fill needs.

## Best practices

- Two stories and six marks fill the four-column grid exactly.
- Use `cells` when the order matters (a story between marks, a tall story at the end of a row): give each cell its `span` and `rows` (`'1'` or `'2'`) and make the spans add up to full rows of four.
- Pick `fill` and `logoTreatment` together: a `knockout` mark reads on `white` or `primary`, a `monochrome` one on `canvas` or `surface`. Left unset, a mark on `white` or `primary` takes `knockout` and every other mark `monochrome`.
- Set `stacked` on a cell whose mark is a stacked lockup (squarer than a wordmark) so it draws one step taller.
- A story without a `photo` sits on its fill; keep photos for the stories that have one.

## Usage

```vue
<script setup>
  import ClientMosaicSection from '@aziontech/webkit/client-mosaic-section'
</script>

<template>
  <ClientMosaicSection
    aria-label="Client stories"
    link-label="Read the case study"
    :stories="[
      {
        logo: '/logos/netshoes.svg',
        logoAlt: 'Netshoes',
        photo: '/photos/netshoes.jpg',
        text: 'Netshoes automatically blocks more than 4 million threats in six months',
        href: '/success-case/netshoes'
      }
    ]"
    :logos="[
      {
        logo: '/logos/dafiti.svg',
        logoAlt: 'Dafiti',
        href: '/success-case/dafiti',
        fill: 'white',
        logoTreatment: 'knockout'
      },
      { logo: '/logos/agibank.svg', logoAlt: 'Agibank', href: '/success-case/agibank' }
    ]"
  />
</template>
```

## Props

| Prop        | Type                         | Default | Required | JSDoc                                                                                                                                                                                                                                                                                                                                  |
| ----------- | ---------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaLabel` | `string`                     | `''`    | false    | Accessible name of the grid.                                                                                                                                                                                                                                                                                                           |
| `linkLabel` | `string`                     | `''`    | false    | Label of the link under every story.                                                                                                                                                                                                                                                                                                   |
| `anchor`    | `string`                     | `''`    | false    | In-page id set on the band so a hash link can target it.                                                                                                                                                                                                                                                                               |
| `stories`   | `ClientMosaicSectionStory[]` | `[]`    | false    | The story cells, in order; each is `{ logo, logoAlt, photo?, text, href, fill?, logoTreatment? }`. The first spans two columns and two rows, the rest one column and two rows.                                                                                                                                                         |
| `logos`     | `ClientMosaicSectionLogo[]`  | `[]`    | false    | The mark cells, in order; each is `{ logo, logoAlt, href, fill?, logoTreatment? }` where `fill` is `'canvas'`, `'surface'`, `'white'` or `'primary'` and `logoTreatment` is `'color'`, `'monochrome'` or `'knockout'` (the shared `ThirdPartyLogoTreatment`).                                                                          |
| `cells`     | `ClientMosaicSectionCell[]`  | `[]`    | false    | The cells in placement order, story and mark cells interleaved; each is `{ logo, logoAlt, href, text?, photo?, span?, rows?, fill?, logoTreatment?, stacked? }` where a cell with `text` is a story cell, `span` and `rows` are `'1'` (default) or `'2'`, and `fill` defaults to `canvas`. When set it replaces `stories` and `logos`. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` and `focus-visible` on each cell
- `data-cell` (`story` or `logo`), `data-span` and `data-rows` on every grid cell; `data-fill` on every cell face drives its fill; every mark is a `ThirdPartyLogo` with `data-treatment` and `data-variant` for its ink and `data-stacked` for a stacked lockup; `data-lead` sets the larger text of the first story (from `stories`) or of a story spanning two columns (from `cells`)
- Empty: when `cells`, `stories` and `logos` are all empty the band renders nothing
- Not applicable: `loading`, `error`, `disabled`, `readonly`, `invalid`, `open`/`closed`

## Motion & Animations

| Trigger                     | Animation / Transition                                        | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| --------------------------- | ------------------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| hover fill change on a cell | `transition-colors duration-fast-02 ease-productive-entrance` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region                  | Token (DESIGN.md)          |
| ----------------------- | -------------------------- |
| typography (lead story) | `.text-heading-md`         |
| typography (story)      | `.text-body-lg`            |
| story text              | `var(--text-default)`      |
| canvas fill             | `var(--bg-canvas)`         |
| canvas hover fill       | `var(--bg-surface-raised)` |
| surface fill            | `var(--bg-surface)`        |
| primary fill            | `var(--primary)`           |
| focus ring              | `var(--ring-color)`        |
| cell inset              | `var(--spacing-xl)`        |
| story rhythm            | `var(--spacing-md)`        |
| frame rules and marks   | `var(--border-default)`    |

## Theme gaps

| Figma variable                | Temporary primitive       | Follow-up                                        |
| ----------------------------- | ------------------------- | ------------------------------------------------ |
| white face for knockout marks | `var(--color-base-white)` | `TODO: tokenizar` a semantic knockout-face token |

## Accessibility (WCAG 2.1 AA)

- Visible focus: every mark cell is a link with `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset`; the story link is a `link` with its own ring.
- Keyboard map: `Tab` moves between mark links and story links; `Enter` follows.
- ARIA: the band is a `<section>` named by `ariaLabel`; the photo of a story is decorative (`alt=""`, `aria-hidden`); every mark is a `ThirdPartyLogo` (`role="img"`) named by `logoAlt`; the story text is a paragraph and its link is named by `linkLabel`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): story text `var(--text-default)` over the canvas gradient; marks are inked to their fill through `logoTreatment`.
- `motion-reduce:transition-none` on the fill transition.
- Touch target ≥40×40 px — each mark cell is a full grid cell.

## Internationalization

No built-in strings: the story lines, the client names and `linkLabel` are content the page passes.

- Formatting: none.

## Right-to-left

- Layout: the grid follows the reading direction (`bento-grid`); the story cell uses logical alignment (`items-start`, `self-start`).
- Icons: the story link's chevron is mirrored by `link`; logos are never mirrored.
- Keyboard: `Tab` order follows the placement order.
- User data: none beyond the client names, which are images named by `logoAlt`.

## Responsive

- Container queries: none of its own; `bento-grid` sets four columns, two below `md`.
- Narrow: a two-column span fills the phone row; cells keep a minimum height of `clamp(180px, 18vw, 240px)`.
- On a phone a mark cell left alone in its row (an odd run of marks before a story, or the last mark) carries `data-lone` and fills the row, so the two-column frame never shows a blank half cell.
- Below `lg` a story cell spans two columns (the full row on a phone, half the four-column grid on a tablet), so its claim and its link never squeeze into one narrow column.
- Touch: every mark cell is a full-cell link; story links are `link` targets.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 7.1 KB gzip for `./client-mosaic-section` in `.size-limit.json` (the ordered `cells` model and `ThirdPartyLogo` add about 0.9 KB).
- Runtime budget: up to a dozen cells; photos load lazily and decode asynchronously.
- Heavy parts: the story photographs (`loading="lazy"`).

## Examples

- Default
- Ordered cells — the home mosaic built from `cells`: interleaved stories and marks with their own spans, a stacked lockup, knockout marks on `white` and `primary`, and an `anchor`.

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
