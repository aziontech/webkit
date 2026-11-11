---
name: faq-section
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 538191be63a82810f411b0c28f95ce4962935073dcbe10b71d96a095c0036c6f
---
# FaqSection — Component Spec

## Purpose

The frequently asked questions band near the end of a landing page: the heading in the left column and the questions on the right, each answer closed until the reader opens it, one at a time. It is a page section — the site places it from a `{ _id: 'faq-section', props }` entry and binds `props` straight onto it — and it composes `section-module` and `faq`. An answer is a markdown string, so it can run to several paragraphs (split by a blank line) and `- ` bullet lists, and a sentence can carry a link, bold or italic text, all without a slot or `v-html`.

## When to use

- To answer the handful of questions a reader still has before the closing call to action.

## When NOT to use

- For answers that need content beyond paragraphs, bullet lists and inline links (tables, images, code) → compose `faq` with its `answer` slot.
- For a single highlighted question with an action → use `call-to-action`.

## Related

- `faq` — the framed accordion band this section renders.
- `closing-call-to-action` — the band that usually follows it.

## Best practices

- Use one FAQ section per page and give it `anchor: 'faq'` so a page can link straight to it.
- Keep an answer short; links use `[label](href)`, bold `**text**` and italic `*text*`.
- Separate paragraphs with a blank line; start each bullet with `- ` and keep the list in its own block.
- Absolute `https://` links open in a new tab; site-relative links stay in the tab.

## Usage

```vue
<script setup>
import FaqSection from '@aziontech/webkit/faq-section'
</script>

<template>
  <FaqSection
    anchor="faq"
    title="Frequently asked questions"
    :items="[
      { question: 'Are there cold starts?', answer: 'No. Each function runs in a V8 isolate.' },
      { question: 'Which frameworks are compatible?', answer: 'See the full [frameworks list](/en/documentation/).' }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the FAQ as its `h2` in the left column. |
| `items` | `FaqSectionItem[]` | `[]` | false | The questions in display order; each is `{ question, answer }` where `answer` is markdown carrying paragraphs, bullet lists, links, bold and italic text. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `open` (one answer at a time, owned by the composed accordion)
- Empty: when `items` is empty the band renders nothing but its root
- An answer renders `[label](href)` as a link, `**text**` as bold and `*text*` as italic; any other text is shown as written
- An answer with a blank line or `- ` lines renders as stacked paragraphs and an ARIA list (`role="list"` / `listitem`, inside the accordion's paragraph); a single-paragraph answer renders as inline text, as before

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| answer links | `.text-link` |
| answer block gap / list indent | `var(--spacing-sm)` / `var(--spacing-xxs)` / `var(--spacing-lg)` |
| anchor scroll offset | `var(--spacing-xxl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed accordion triggers and the answer links.
- Keyboard map: `Tab` moves between the questions and the links of an open answer; `Enter` / `Space` toggles a question.
- ARIA: the `faq` renders the band's `<section>` labelled by its `h2`; the root is a plain `div` so the band has one landmark. A link that opens a new tab carries `rel="noopener noreferrer"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `faq`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the accordion carries its own fallback.
- Touch target ≥40×40 px — owned by the accordion triggers.

## Examples

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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
