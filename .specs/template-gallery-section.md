---
name: template-gallery-section
category: section
structure: monolithic
template: 2
status: implemented
spec_version: 8
created: 2026-11-05
last_updated: 2026-11-16
checksum: 4df1a0ec83657277362f1da3dd8c27dd37c8e9a4ff67b468e3abc24f6ca7b83d
---

# TemplateGallerySection — Component Spec

## Purpose

The templates band of a solution page: a framed media split whose copy side invites the reader to start from a template and whose media side is a scrolling two-column wall of deployable template cards, closed by a marquee of the frameworks and clouds it works with. Each card is a mark, a title, one line and a deploy action. It is a page section — the site places it from a `{ _id: 'template-gallery-section', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `media-split`, `scroll-area`, `card-grid`, `button`, `registration-frame` and `marquee` rather than owning any anatomy of its own. With `closing` set it is the page's closing band: the hatched closing frame follows it, with no rules of its own, because the site footer under it opens with one (`hatch` turns that frame off when another closing band stacks directly below and draws the shared one).

## When to use

- Use TemplateGallerySection on marketing pages to show deployable templates; set `closing` when it is the last band.
- On a solution page (Retail, Web Apps, AI Workloads, Security, Performance, Streaming) to show the templates a reader can deploy right away.
- Whenever a band pairs one pitch with a long, browsable list of deployable starters.

## When NOT to use

- For a grid of features with artwork → use `feature-tiles-section`.
- For a marquee of marks alone → compose `marquee` directly.
- For a handful of icon-led use cases → use `customer-use-cases-section`.
- For a closing ask with links or a command and no templates → use `closing-call-to-action-section`; for an email sign-up close → use `newsletter-section`.

## Related

- `media-split` — the framed copy-and-media split the band is built on; it owns the band's named region.
- `marquee` — the row of framework and cloud marks that closes the band.

## Best practices

- Keep the wall to an even number of templates so the two columns end level.
- Turn on `invertInDark` only for a mark whose artwork ships in dark ink, so it stays legible on the dark theme.
- Set `templatesAriaLabel` so the scrolling wall is announced by name.
- Set `closing` only on the last band of the page, right above `site-footer-section`: it draws the hatched closing frame itself, so nothing follows it inside the page column (no trailing `SectionGap`, no closing `RegistrationFrame`).
- Turn `hatch` off only on a closing band that another closing band follows directly; the last one keeps the frame.

## Usage

```vue
<script setup>
  import TemplateGallerySection from '@aziontech/webkit/template-gallery-section'
</script>

<template>
  <TemplateGallerySection
    eyebrow="Your Stack, Your Way"
    title="Quick Start with Templates"
    description="Deploy complete projects in seconds with popular frameworks."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Talk to sales', href: '/contact', trailing: true }"
    :templates="[
      {
        title: 'Astro Odyssey',
        description: 'A marketing website starter built with Astro.',
        icon: 'az-color az-astro',
        href: '/templates/astro-odyssey'
      },
      {
        title: 'Next.js Commerce',
        description: 'Ecommerce template built with Next.js.',
        icon: 'az-color az-nextjs',
        invertInDark: true,
        href: '/templates/nextjs-commerce'
      }
    ]"
    deploy-label="Deploy now"
    templates-aria-label="Templates you can deploy"
    marquee-label="Compatible with Your Stack"
    :marquee-marks="['nextjs', 'astro', 'react', 'vue']"
  />
</template>
```

## Props

| Prop                 | Type                               | Default     | Required | JSDoc                                                                                                                                                                                                               |
| -------------------- | ---------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `anchor`             | `string`                           | `''`        | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                                                                                                                      |
| `eyebrow`            | `string`                           | `''`        | false    | Eyebrow above the headline.                                                                                                                                                                                         |
| `title`              | `string`                           | `''`        | false    | Headline of the band, rendered by the media split as its `h2` and naming its region.                                                                                                                                |
| `description`        | `string`                           | `''`        | false    | Paragraph under the headline.                                                                                                                                                                                       |
| `primaryAction`      | `SectionTitleAction`               | `undefined` | false    | First button under the copy, drawn as the large secondary button; `{ label, href, trailing?, target? }`. Omitted when absent.                                                                                       |
| `secondaryAction`    | `SectionTitleAction`               | `undefined` | false    | Second button under the copy, drawn as the large outlined button; `{ label, href, trailing?, target? }`. Omitted when absent.                                                                                       |
| `templates`          | `TemplateGallerySectionTemplate[]` | `[]`        | false    | The template cards of the scrolling wall, in order; each is `{ title, description?, icon?, invertInDark?, href? }` where `href` makes the whole card a link to the template. Templates without a title are skipped. |
| `deployLabel`        | `string`                           | `''`        | false    | Label of the deploy button on each card; a card renders its button only when both this and its `href` are set.                                                                                                      |
| `templatesAriaLabel` | `string`                           | `''`        | false    | Accessible name of the scrolling wall of templates.                                                                                                                                                                 |
| `marqueeLabel`       | `string`                           | `''`        | false    | Eyebrow above the row of marks.                                                                                                                                                                                     |
| `marqueeMarks`       | `string[]`                         | `[]`        | false    | Registry names of the frameworks and clouds in the row of marks, in order; the marquee is omitted when empty.                                                                                                       |
| `closing`            | `boolean`                          | `false`     | false    | Makes the band the page's closing band: the hatched closing frame follows it, as the closing call to action draws it.                                                                                               |
| `hatch`              | `boolean`                          | `true`      | false    | Draws the hatched closing frame under a `closing` band; turn it off when another closing band stacks directly below and draws the shared frame. Ignored without `closing`.                                          |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- A card with an `href` is a link target as a whole: a click anywhere on it follows the `href` (and a modified or middle click opens it in a new tab, as any link does), the pointer turns to the hand over it, and hovering it lights its deploy button. With a deploy button the card keeps one tab stop — the button — and the card-wide link is a pointer-only target hidden from assistive technology; without a deploy button the card-wide link is the card's one tab stop, named by the template title
- A card without an `href` is not interactive: no hand pointer, no hover light
- Empty: when no template carries a title the band renders nothing — not the split, not the marquee, not the closing frame
- `closing`: the tall hatched closing frame (`data-hatch="true"`, decorative) follows the band; `hatch` off drops it

## Motion & Animations

_none_

## Tokens

| Region                  | Token (DESIGN.md)          |
| ----------------------- | -------------------------- |
| typography (card title) | `.text-body-md`            |
| typography (card line)  | `.text-body-sm`            |
| card title              | `var(--text-default)`      |
| card line               | `var(--text-muted)`        |
| card fill               | `var(--bg-surface)`        |
| card inset              | `var(--spacing-xl)`        |
| card rhythm             | `var(--spacing-md)`        |
| mark tile fill          | `var(--bg-surface-raised)` |
| mark tile rule          | `var(--border-muted)`      |
| mark tile shape         | `var(--shape-control)`     |
| deploy prefix mark      | `var(--primary)`           |
| card link focus ring    | `var(--ring-color)`        |
| anchor scroll offset    | `var(--spacing-2xl)`       |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `button`s and the `scroll-area`; a card-wide link that is a card's only tab stop draws `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset` over the card.
- Keyboard map: `Tab` reaches the copy's actions, the scrolling wall and each card's one link (its deploy button, or the card itself when it has none) in reading order; `Enter` follows a link. Nothing else in the band is interactive.
- ARIA: the band's root is a plain `div`, because `media-split` already renders the band's region named by its title; the wall is `scroll-area`'s region named by `templatesAriaLabel`; the template marks and the closing frame are decorative (`aria-hidden`, or no content); a card-wide link duplicated by a deploy button is `aria-hidden` with `tabindex="-1"`, so each card is announced once.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): card titles `var(--text-default)`, card lines `var(--text-muted)`; marks flagged `invertInDark` invert under the dark theme.
- `motion-reduce:transition-none motion-reduce:transform-none` — the button hover and the marquee scroll belong to `button` and `marquee`, which carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the deploy buttons are medium `button`s, the copy's actions are large.

## Internationalization

- No built-in strings: every visible string arrives through props.

## Right-to-left

- Layout: logical utilities and the composed components' own mirroring, so the ask and the template grid follow the reading direction.
- Icons: action chevrons mirror (owned by `button`).
- Keyboard: unchanged.

## Responsive

- The composed `media-split` sets the ask beside the template grid and stacks them on narrow screens; the grid scrolls inside its `scroll-area`, at least 36rem tall and 44rem from large.
- No horizontal scroll at 320 px.

## Performance

- Bundle budget: 28.35 KB for `./template-gallery-section` gzip in `.size-limit.json`, initial chunk only.
- Renders every template it is given: keep the list to the dozen or so a closing band shows, and link to the full gallery for the rest.

## Examples

- Default — every card links as a whole to its template; the band carries an `anchor`.
- Closing — justification: `closing` and `hatch` change how the band ends a page (the closing frame under it, dropped when another closing band stacks below), which no other example shows.

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
