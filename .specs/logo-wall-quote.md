---
name: logo-wall-quote
category: sections
structure: monolithic
status: implemented
spec_version: 4
template: 2
created: 2026-11-04
last_updated: 2026-11-15
checksum: 004619866264bb4d2326a4d497f39bdbb5e10828c97a5e31eaec292b1afab6ae
---

# LogoWallQuote — Component Spec

## Purpose

The customers band: a section title over a framed logo wall of linked client marks with one signed quote in its aside, closed by a call to action. It is a page section — the site places it from a `{ _id: 'logo-wall-quote', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `logo-wall`, `quote` and `button`.

## When to use

- Use LogoWallQuote for customer logos plus one featured quote.
- To prove adoption with marks and let one customer speak, early on a home or solution page.

## When NOT to use

- For several quotes in turn → use `client-quotes`.
- For marks with photos and stories in a mosaic → use `client-mosaic`.

## Related

- `logo-wall` — the wall the marks are laid in, with the quote in its aside.
- `logo` — draws every mark (the wall's and the quote's) right on both themes.

## Best practices

- Eight or nine logos fill the rectangle wall beside the aside.
- Pass client registry entries (`@aziontech/webkit/assets/client-registry`) as they stand: each carries `name`, `logo` and either `logoLight` (a light-theme drawing) or `artwork` (which theme a single file must be inverted on), and every mark renders through `Logo`.
- Without a registry entry, set `logoTreatment` per mark: `monochrome` for a mark drawn in one ink that must follow the theme, `knockout` for a black mark on a coloured fill, `color` for a colour mark, and `artwork: 'light'` for a reversed mark that must flip on the light theme; give a `logoLight` file instead when the light theme needs a different drawing.
- Give the quote's company mark a `logoLight` (or an `artwork`) the same way, so it stays legible on both themes.
- Keep to one or two actions under the quote: the primary (`secondary` kind) and an optional outlined `secondaryAction`.

## Usage

```vue
<script setup>
  import LogoWallQuote from '@aziontech/webkit/logo-wall-quote'
</script>

<template>
  <LogoWallQuote
    eyebrow="Customers"
    title="Trusted by the world's largest banks and e-commerce companies"
    aria-label="Banks and e-commerce companies running on Azion"
    :logos="[
      { name: 'Magalu', logo: '/logos/magalu.svg', href: '/success-case/magalu' },
      {
        name: 'Banco de la Nación',
        logo: '/logos/banco-de-la-nacion.svg',
        logoTreatment: 'monochrome',
        href: '/success-case/banco'
      }
    ]"
    :quote="{
      text: 'Azion delivered the advanced protection and superior performance we needed.',
      name: 'Ismael Aguilar',
      jobTitle: 'Information Security Manager at Zoop',
      logo: '/logos/zoop.svg',
      logoAlt: 'Zoop'
    }"
    :primary-action="{
      label: 'Read the case study',
      href: '/success-case/zoop',
      trailing: true,
      target: '_blank'
    }"
  />
</template>
```

## Props

| Prop              | Type                     | Default     | Required | JSDoc                                                                                                                                                                                                                                                                                 |
| ----------------- | ------------------------ | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kind`            | `LogoWallQuoteKind`      | `'wall'`    | false    | Layout of the band: `wall` sets the client marks with the quote in their aside, `quote` sets the quote alone as a full-width band (the design sample's QuoteBand) and needs no logos.                                                                                                 |
| `quoteKind`       | `LogoWallQuoteQuoteKind` | `'signed'`  | false    | Register of the quote in the `quote` layout: the featured `highlight` or the band-sized `signed` sentence.                                                                                                                                                                            |
| `anchor`          | `string`                 | `''`        | false    | In-page id set on the band so a hash link can target it.                                                                                                                                                                                                                              |
| `eyebrow`         | `string`                 | `''`        | false    | Overline above the section title.                                                                                                                                                                                                                                                     |
| `title`           | `string`                 | `''`        | false    | Headline of the band, rendered by the section title as its `h2`; the band renders no header when empty.                                                                                                                                                                               |
| `ariaLabel`       | `string`                 | `''`        | false    | Accessible name of the logo wall.                                                                                                                                                                                                                                                     |
| `logos`           | `LogoWallQuoteLogo[]`    | `[]`        | false    | The client marks, in order; each is `{ name, logo, logoLight?, logoTreatment?, artwork?, href? }` where `logoTreatment` is the shared `LogoTreatment` (`'color'`, `'monochrome'` or `'knockout'`, the `Logo` looks) and `artwork` is the registry's `'color'`, `'light'` or `'dark'`. |
| `quote`           | `LogoWallQuoteQuote`     | `undefined` | false    | The signed quote in the wall's aside; `{ text, name, jobTitle, logo, logoAlt, logoLight?, artwork? }`. Omitted when absent.                                                                                                                                                           |
| `primaryAction`   | `SectionTitleAction`     | `undefined` | false    | Button under the quote; `{ label, href, trailing?, target? }`. Omitted when absent.                                                                                                                                                                                                   |
| `secondaryAction` | `SectionTitleAction`     | `undefined` | false    | Outlined button beside the primary one under the quote; `{ label, href, trailing?, target? }`. Omitted when absent.                                                                                                                                                                   |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- Empty: when `logos` is empty the band renders nothing
- Each mark is a `Logo` carrying `data-treatment` (the `logoTreatment`, default `color`), `data-kind`, `data-artwork` and `data-route` (`pair`, `single` or `wordmark`), so the theme-following inks are driven by data attributes
- Not applicable: `loading`, `error`, `disabled`, `readonly`, `invalid`, `open`/`closed`

## Motion & Animations

_none_

## Tokens

| Region                | Token (DESIGN.md)       |
| --------------------- | ----------------------- |
| frame rules and marks | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `logo-wall` (each mark link) and `button`.
- Keyboard map: `Tab` moves between mark links and the action; `Enter` follows.
- ARIA: the band is a `<section>` named by its title (`aria-label`); the wall is `logo-wall`'s own list named by `ariaLabel`; every mark is a `Logo` (`role="img"`) named by the client `name`, announced once even when a light/dark pair renders; the quote is a `blockquote` signed by its author.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components; marks follow the theme through their treatment.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion.
- Touch target ≥40×40 px — each mark link spans its wall cell.

## Internationalization

No built-in strings: the title, the quote, the client names and the action labels are content the page passes.

- Formatting: none.

## Right-to-left

- Layout: the composed `section-title`, `logo-wall`, `quote` and `button` use logical utilities; the band adds none of its own.
- Icons: the trailing chevron of an action is mirrored by `button`; logos are never mirrored.
- Keyboard: `Tab` order follows the DOM, which follows the reading direction.
- User data: a client name drawn as a wordmark is wrapped in `dir="auto"` by `Logo`.

## Responsive

- Container queries: none of its own; `logo-wall` reflows the marks and moves the aside under them on narrow widths.
- Narrow: the marks cap at the wall cell's width (`max-w-full`), widening to a 96 px cap from `sm`.
- Touch: each mark link spans its wall cell (well over 44 px); actions are `large` buttons.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 22 KB gzip for `./logo-wall-quote` in `.size-limit.json` (unchanged; `Logo` adds under 1 KB because the band already ships `cn`).
- Runtime budget: one or two `img` per mark; files decode asynchronously.
- Heavy parts: none; the band imports no registry, the page passes the entries it shows.

## Examples

- Default
- Quote band — `kind="quote"`, the quote alone as a full-width band.
- Registry — the wall and the quote mark built from client registry entries, and both actions; it shows the props this change adds.

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
