---
name: quote-carousel
category: marketing
structure: monolithic
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/QEbHSTFDWfh4VHkBp6NWN3/Azion.com?node-id=13136-296065
  node_id: 13136:296065
checksum: cd7a6871ea63c29d033666af64f834d5e3b0f7af1c297b8e5ee1a12e463c583b
created: 2026-09-24
last_updated: 2026-09-24
---

# QuoteCarousel — Component Spec

## Purpose

A band of customer testimonials laid out as one scrollable row of flush cards. It is the wall form of `quote`: the same quotation, attribution and company mark, repeated across a track that snaps card by card and fades at both ends, so a page can carry more proof than the row is wide.

The cards sit edge to edge with no gutter — each draws its own hairline and the next one's overlaps it, so the row reads as one ruled strip rather than a set of floating tiles. The fade at either end is what says the strip continues past the band's edge.

## When to use

- When a page has more testimonials than fit in one row and the reader chooses how far to go.
- As the proof band under a section headline, where a grid of quotes would run down the page instead of across it.
- When every quote carries equal weight — the track gives no card more room than its neighbours.
- For a row of analyst recognitions, where the source is a firm rather than a person: leave `name` out and the mark leads the card alone.

## When NOT to use

- For a single testimonial → use `quote` directly; a track of one has nothing to scroll.
- For the one quotation a page features above the others → use `quote` in its `highlight` register.
- For a row of company marks with no quotation → use `brand-carousel` (moving) or `logo-wall` (static).
- For a set of quotes the reader must read → lay them out as a `card-grid`; anything past the first card in a track can be missed.

## Related

- `quote` — the single testimonial this band repeats; the `inline` register is what each card draws.
- `carousel` — the scrollable track underneath, with the snap points, the step controls and the keyboard behaviour.
- `brand-carousel` — the same clients without their words, moving on their own.
- `logo-wall` — the static wall of marks, when a quotation is not the point.
- `section-title` — the headline composed above the band; this component carries no heading of its own.

## Best practices

- Keep each `text` to one or two sentences. Cards in a track are read at a glance, and a paragraph turns a scannable strip into a wall.
- Give a person's quote a `name`. It is the attribution's lead and the source of the initials the card draws when there is no `photo`.
- Leave `name` out when the source is an institution — an analyst firm, a publication. The card then draws no likeness, the mark leads it, and `jobTitle` carries the report or article the claim comes from. Name the firm in that line as well, because the mark is decorative and a screen reader never reaches it.
- Name the company with `mark`, using a registry name rather than a URL, so the mark inherits the card's ink and reads on both themes. A name the registry does not carry is written as its own wordmark, which keeps the card complete while the artwork lands.
- Always pass `ariaLabel`. A scroll region with no name tells a screen-reader user nothing about what they are about to move through.
- Compose the headline above the band with `section-title`, unframed, so the band owns only the strip.
- Keep the band full width. The row is designed to run past the reader's view — inset it and the fade loses the thing it is signalling.
- The cards carry no gutter by design: the band sets `--carousel-gap` to zero on the track so each card's hairline meets its neighbour's, and every card pulls a pixel left so the two rules land as one.

## Usage

```vue
<script setup>
import QuoteCarousel from '@aziontech/webkit/quote-carousel'
import SectionTitle from '@aziontech/webkit/section-title'

const testimonials = [
  {
    text: 'With Azion, we scale proprietary AI models without managing infrastructure — inspecting millions of websites daily and automating the fastest threat takedown in the market.',
    name: 'Fabio Ramos',
    jobTitle: 'CEO',
    mark: 'axur'
  },
  {
    text: 'Azion keeps our filing season stable at a scale our own infrastructure never held, and we ship changes to the edge in minutes.',
    name: 'Vitor Torres',
    jobTitle: 'CEO',
    mark: 'contabilizei'
  }
]
</script>

<template>
  <SectionTitle
    kind="left"
    :framed="false"
    title="Battle-Tested by the World's Largest Banks and E-commerce Companies"
  />
  <QuoteCarousel
    :items="testimonials"
    aria-label="Customer testimonials"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `items` | `QuoteCarouselItem[]` | `[]` | false | The testimonials rendered as cards, in order; each item is `{ text, name?, jobTitle?, photo?, mark? }` — the quotation, who said it, the rest of the attribution, their likeness and the registry name of the company's mark. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the scrollable row of testimonials, announced before its contents. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, plus `focus-visible` on the track itself and `grab` / `grabbing` on the pointer while the row can be dragged
- A card with neither `name` nor `photo` draws no likeness, and its company mark leads the header row alone
- `data-scrollable` is present on the root while the track overflows its row, and it is what turns the end fades on; a band whose cards fit shows no fade and nothing to scroll. The fade is proportional (a percentage of the band's own width), so it reads the same on a phone and on a desktop
- An empty `items` renders the named track with no cards in it, so a band that is waiting on its data keeps its place and announces nothing
- The track is focusable and shows the focus ring, because a scrollable region must be reachable by keyboard

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| _none_ | — | — | — |

<!-- The band adds no motion of its own. The track's smooth scrolling and its
     `motion-reduce:scroll-auto` fallback belong to `carousel`, and are declared there. -->

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| card surface | `var(--bg-surface)` |
| card border | `var(--border-default)` |
| card padding | `var(--spacing-xl)` |
| card header gap (likeness to mark) | `var(--spacing-md)` |
| mark ink | `var(--text-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the track carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`, inherited from `carousel`.
- Keyboard map: `Tab` reaches the track; with it focused the arrow keys scroll it natively. The band adds no key handler of its own and replaces none.
- ARIA: the root is `carousel`'s `<section>` with `aria-roledescription="carousel"`, named by `ariaLabel`; each card is an `<li>` in the track holding one `<figure>` with its `<blockquote>` and `<figcaption>`. The likeness is decorative (`aria-hidden`), because the speaker is already named in the attribution, and the company mark is drawn `aria-hidden` with its name carried by the card's text.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the quotation is `var(--text-default)` and the attribution `var(--text-muted)`, both on `var(--bg-surface)`; the mark is drawn in `var(--text-default)` so it inherits the card's ink on either theme.
- The band declares no animation, so there is nothing to suppress beyond `carousel`'s own `motion-reduce:scroll-auto`. The track never advances on its own, so WCAG 2.2.2 does not apply by construction.
- Touch target ≥40×40 px: the band exposes no control of its own; the track is dragged and swiped.

## Stories (Storybook)

- Default
- Fallback — a card naming a company whose artwork is not registered, so the mark is written as its own wordmark (justified: the wordmark is a rendered state no prop toggles, and it is what lets a page name a client before its mark lands)
- Recognitions — cards whose source is a firm rather than a person, so the mark leads each one and no likeness is drawn (justified: the likeness is the card's most visible element and its absence is a whole second register of the component — the analyst band — which the default args cannot show while every speaker is a person)

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
