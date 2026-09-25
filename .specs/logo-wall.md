---
name: logo-wall
category: marketing
structure: monolithic
status: implemented
spec_version: 1
checksum: 0000a7ede0732472f868b87a74e702a8ea87dbaee838fdc6a6971eb6c7b29f34
created: 2026-09-22
last_updated: 2026-09-24
---

# Logo Wall — Component Spec

## Purpose

The customer-proof band of a marketing page: a responsive grid of company marks, optionally linked, under one accessible group name. It is deliberately a static grid rather than an auto-scrolling strip — moving content needs a pause control to meet WCAG 2.2.2, and a wall a reader can scan beats one they have to wait for.

The marks rest at 60% opacity, so the wall reads as the evidence behind the page's own words rather than as twelve things competing with them; a linked mark comes up to full strength on hover and focus. Fill the `aside` slot and the band splits from `lg` up — the wall on the start edge, one of those customers speaking on the end edge — and the wall narrows from six columns to four to sit in half the width.

## When to use

- To show who already uses the product, as the proof band under a hero or section.
- Wherever a set of partner, customer or certification marks is the message.
- When the marks are recognisable enough that names are unnecessary.
- To set one customer's statement beside the crowd that backs it, by filling `aside` with a `quote`.

## When NOT to use

- For a measured claim rather than a set of names → use `big-numbers`.
- For one customer's statement → use `quote`.
- For a single brand mark, such as the product's own → use `brand`.
- For a grid of described features rather than marks → use `feature-card`.

## Related

- `quote` — one named customer's statement; the wall shows many without words.
- `big-numbers` — the numeric form of the same proof band.
- `brand` — the product's own mark, not a customer's.

## Best practices

- Supply marks that read on the page's own surface. The component applies no colour filter — only a uniform opacity — so a mark that only works on one theme will not work on both; ship a mark that does, rather than inverting it. When the marks come from a registry that already places them per theme, render them through the `mark` slot and keep `items` as the list they are drawn from.
- Give every mark a real `alt` — the company name. The wall is a list of who uses the product, and that list should be readable without seeing it.
- Set `ariaLabel` so the group announces its purpose ("Customers using Azion") instead of reading as an unnamed list.
- Keep the marks to one visual weight. A wall mixing wordmarks and full lockups reads as inconsistent no matter how the grid is set.
- Link a mark with `href` only when there is somewhere worth going, such as a case study.
- Put one statement in `aside`, not a second grid. The band's argument is *many customers, one of them talking*; two things of equal weight leave a reader with neither.
- Give the wall eight or twelve marks when `aside` is filled — it is four columns wide there — so the last row is full rather than ragged.

## Usage

```vue
<script setup>
import LogoWall from '@aziontech/webkit/logo-wall'
import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <LogoWall
    aria-label="Customers building on Azion"
    :items="[
      { src: '/logos/northwind.svg', alt: 'Northwind' },
      { src: '/logos/contoso.svg', alt: 'Contoso', href: '/customers/contoso' },
      { src: '/logos/fabrikam.svg', alt: 'Fabrikam' },
      { src: '/logos/tailspin.svg', alt: 'Tailspin' }
    ]"
  >
    <template #aside>
      <Quote
        logo="/logos/contoso.svg"
        text="Azion transformed our operations, reducing costs and improving performance."
        source="Mateus Leonardi, CTO at Contoso"
      />
    </template>
  </LogoWall>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `items` | `LogoItem[]` | `[]` | false | The marks rendered in the grid, in order; each item is `{ src, alt, href? }` where `src` is the mark's URL, `alt` names the company, and `href` links the mark when there is somewhere to go. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the group of marks, announced instead of an unnamed list. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `aside` | — | Content set beside the wall from `lg` up, such as one customer's `quote`; when it is empty the wall spans the full width. |
| `mark` | `{ item: LogoItem; index: number }` | One cell's mark, replacing the image built from the item — for a mark that owns its own theming (a per-theme asset swap, a silhouette filter). The slotted content carries its own alternative text. |

## States

- Visual states: every mark rests at 60% opacity; `hover` / `focus-visible` on a mark that carries an `href` is the only thing that lifts it to full
- `data-aside` is present when the `aside` slot is filled, and is what splits the band into two columns from `lg` up and narrows the wall from six columns to four
- A cell's mark is the `mark` slot's content when it is filled, and the image built from the item otherwise; either way it rests at the same 60% opacity and, with an `href`, lifts on `hover` / `focus-visible`
- Empty: when `items` is empty the wall renders no grid, so a page with no customers to name shows nothing rather than an empty frame — an `aside` given without items still renders, since a statement stands on its own

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover on a linked mark | `transition-opacity duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| spacing (grid gap) | `var(--spacing-xl)` |
| spacing (wall ↔ aside gap) | `var(--spacing-xxl)` |
| ring | `var(--ring-color)` |
| focus ring offset | `var(--bg-canvas)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: a linked mark carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; an unlinked mark is not focusable.
- Keyboard map: `Tab` reaches each linked mark in DOM order; unlinked marks are skipped. No arrow-key model — this is a list, not a composite widget.
- ARIA: the grid is a `<ul>` of `<li>` so the count is announced, named by `ariaLabel` when set; each mark's `alt` carries the company name, so the wall is readable without sight. A mark supplied through the `mark` slot owns that name itself — the component cannot add it.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the marks are consumer-supplied images held at 60% opacity. WCAG 1.4.11 exempts logotypes from the contrast minimum, and the component adds no colour filter, so a mark must still carry its own legibility against `var(--bg-canvas)` at that strength. Anything in `aside` is ordinary content and is bound by the minimum in full.
- `motion-reduce:transition-none` on the linked-mark hover transition. The band never auto-scrolls, so WCAG 2.2.2 (pause, stop, hide) does not apply.
- Touch target ≥40×40 px — a linked mark's anchor spans its full grid cell.

## Stories (Storybook)

- Default
- Linked — marks carrying an `href` (justified: the hover, focus ring and anchor semantics only exist on linked marks, and the default args have none)
- WithAside — the wall paired with a `quote` on the end edge (justified: the two-column split and the four-column wall exist only when the `aside` slot is filled, and no arg can produce them)

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
