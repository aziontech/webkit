---
name: article-cards
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: f8513e04075a2fe110234f0050f2c06d5a72c80a91a0267984859b5018ed2d44
---
# ArticleCards — Component Spec

## Purpose

A titled row of three linked article cards on one hairline frame grid with no gutter, stacking to one column on mobile. Each card is a single link: a 16:9 media cell holding the article's cover — or, when it has none, the client's mark in one flat ink that follows the theme — then the headline, the deck and a `meta` overline pinned to the foot. It is a page section — the site places it from a `{ _id: 'article-cards', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box` and `card-grid`. `kind` places the heading only: `left` at the start (an article's closing row), `centered` centred over the cards under an overline (a landing-page band); the cards keep the same shape in both.

## When to use

- To close a blog post with its related articles, or a success story with its related stories.
- To show three stories as a landing-page band under a centred heading.

## When NOT to use

- For the full, filterable list of articles → use `article-index-blog` or `article-index-resource-hub`.
- For one featured article selected from a wall → use `article-highlight`.

## Related

- `card-grid` — the frame grid the cards sit on.
- `article-highlight` — the blog's opening band.

## Best practices

- Give a card either `image` or `mark`; the mark is drawn only when there is no cover.
- Keep the band to three cards so the frame row stays full.

## Usage

```vue
<script setup>
import ArticleCards from '@aziontech/webkit/article-cards'
</script>

<template>
  <ArticleCards
    kind="left"
    title="Related Articles"
    aria-label="Related Articles"
    :items="[
      {
        key: 'how-to-reduce-ai-agent-latency',
        href: '/blog/how-to-reduce-ai-agent-latency',
        title: 'How Do You Reduce AI Agent Latency?',
        description: 'Learn where latency builds up in AI agents.',
        meta: 'SEP 23, 2026 • 8 min read',
        image: '/media/blog/reduce-ai-agent-latency.png'
      }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `ArticleCardsKind` | `'left'` | false | Placement of the heading: `left` sets it at the start, `centered` centres it over the cards. |
| `eyebrow` | `string` | `''` | false | Overline above the heading. |
| `title` | `string` | `''` | false | Headline of the band; the band renders no header when empty. |
| `items` | `ArticleCardsItem[]` | `[]` | false | The cards, in order; each is `{ key, href, title, description, meta, image?, mark? }`. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the card grid. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` (the card lifts to the raised surface and its media scales up), `focus-visible` (inset ring)
- `data-kind` mirrors the `kind` prop and places the heading
- Empty: when `items` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover fill change on a card | `transition-colors duration-fast-02 ease-productive-entrance` | inline (matches catalog) | `motion-reduce:transition-none` |
| hover scale of the media | `transition-[scale] duration-moderate-02 ease-productive-entrance` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| card fill | `var(--bg-canvas)`, hover `var(--bg-surface-raised)` |
| media cell | `var(--bg-surface)`, rule `var(--border-default)` |
| headline | `text-heading-sm`, `var(--text-default)` |
| deck and overline | `text-body-sm` / `text-overline-sm`, `var(--text-muted)` |
| focus ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: each card is one link with an inset `focus-visible` ring.
- Keyboard map: `Tab` moves card to card; `Enter` follows the link.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the grid is a `group` named by `ariaLabel` when set; the headline is the section title's `h2` and each card's headline an `h3`; a cover is decorative (`alt=""`), a client mark is named by the client.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted` on the canvas.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — the whole card is the target.

## Stories (Storybook)

- Default
- Types — composite story rendering both `kind` values stacked.

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
