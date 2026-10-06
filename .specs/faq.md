---
name: faq
category: marketing
structure: monolithic
status: implemented
spec_version: 2
checksum: c2115b0e8b3019e94b35a03c050fcac334a25b9ebe32124c69b369442911450c
created: 2026-09-22
last_updated: 2026-09-24
---

# Faq — Component Spec

## Purpose

The frequently-asked-questions band of a marketing page: a two-column panel with the section's heading on the left and the answers as a disclosure list on the right. It is the page-level band, not the disclosure primitive — it composes `accordion`, which remains the right choice anywhere a bare expandable list is wanted.

The band is drawn in the hairline register: the two columns and every row are separated by a one-pixel gap over a rule fill, so the seams are the grid's own gaps rather than borders on the cells. The rule under a row is held at the item's edge and drawn only while that item is open, which keeps exactly one rule per row in either state; the last row draws none, because it sits on the band's own floor. A single `--accordion-inset` hook, re-declared per breakpoint, puts the heading, every question and every answer on one content column.

## When to use

- As the FAQ band near the end of a marketing or pricing page.
- Whenever a page must answer a known set of objections without sending the reader to docs.
- When the answers are short enough to read in place rather than link out to.

## When NOT to use

- For a bare expandable list anywhere else → use `accordion` directly.
- For long-form reference content that belongs in documentation → use `doc-prose` and link to it.
- For a single expandable aside inside a section → use `accordion` with one item.

## Related

- `accordion` — the disclosure primitive this band renders its answers through.
- `section-title` — the header for a section whose body is not a question list.
- `frame-box` — the frame the band is drawn with, applied by whatever assembles the page; the band draws none of its own.

## Best practices

- `framed` decides who draws the rule. On, the band draws its own registration frame. Off, the rule and the corner marks belong to the `section-module` or `frame-box` the page assembles it into, so a band placed in an already-framed column never lands a second hairline on the column's own.
- Keep the band to the questions a reader actually asks before buying; a FAQ is objection handling, not a manual.
- Write each `question` as the reader would ask it, in their words rather than the product's.
- Keep answers to a couple of sentences and link out for the rest — use the `answer` slot when an answer needs a link or richer content.
- Give every item a stable `value`. It is the accordion's open-state key, so a reordered or re-keyed list loses whatever the reader had open.
- Leave the first item closed. An open answer on load pushes the rest of the list down and hides the range of questions.

## Usage

```vue
<script setup>
import Faq from '@aziontech/webkit/faq'
</script>

<template>
  <Faq
    title="Frequently asked questions"
    :items="[
      {
        value: 'edge',
        question: 'What is edge computing?',
        answer: 'Running your code in the locations closest to your users, instead of one region.'
      },
      {
        value: 'pricing',
        question: 'How does pricing work?',
        answer: 'You pay for what you use, with no upfront commitment.'
      },
      {
        value: 'trial',
        question: 'Is there a free tier?',
        answer: 'Yes — every core feature is available on the free tier.'
      }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `''` | false | Headline of the band, rendered as its `h2` in the left column. |
| `items` | `FaqItem[]` | `[]` | false | The questions and their answers, in order; each item is `{ value, question, answer }` where `value` is the item's stable key. |
| `framed` | `boolean` | `false` | false | Draw the band's own registration frame. Turn it off when the page already wraps the band in a frame. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `answer` | `{ item: FaqItem }` | Replaces the rendered answer for every item, so an answer can carry a link or richer content. |

## States

- Visual states: `default`
- Each answer is closed on load; open state is owned by the composed `accordion`
- Empty: when `items` is empty the band renders no answer list and no frame

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (headline) | `.text-heading-lg` |
| typography (question) | `.text-body-md` |
| typography (answer) | `.text-body-sm` |
| headline text | `var(--text-default)` |
| question text | `var(--text-default)` |
| answer text | `var(--text-muted)` |
| band rules and marks | `var(--border-default)` |
| cell fill | `var(--bg-canvas)` |
| spacing (content inset, below `lg`) | `var(--spacing-lg)` — bound to `--accordion-inset`, so the heading, every trigger and every answer start on one content column |
| spacing (content inset, from `lg`) | `var(--spacing-xl)` — the same hook, one step wider |
| spacing (row rhythm) | `var(--spacing-md)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `accordion`, whose triggers carry the `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: delegated to `accordion` — `Tab` moves between questions, `Enter` / `Space` opens and closes the focused one.
- ARIA: the headline is a real `h2` and the band is a `<section>` labelled by it; the disclosure semantics (`aria-expanded`, the trigger/panel association) belong to `accordion` and are not re-declared here.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the headline is `var(--text-default)`; the question and answer colours are the composed `accordion`'s.
- `motion-reduce:transition-none motion-reduce:transform-none` — the open/close transition belongs to `accordion`, which carries its own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the accordion trigger spans the column width and keeps its own target height.

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
