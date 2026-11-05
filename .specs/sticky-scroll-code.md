---
name: sticky-scroll-code
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 09e97d701b53f62fb20dd5700ac19c925a35d989e8c74f66d5a317b60e9a80cd
---
# StickyScrollCode — Component Spec

## Purpose

The developer-capabilities band of a product page: a large section title over a sticky stack whose claims scroll past a pinned media frame, the open claim showing its one-file code sample on the pixelate texture and its own button under its description. It is a page section — the site places it from a `{ _id: 'sticky-scroll-code', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `sticky-stack`, `texture-material`, `code-block` and `button`. Which claim is open is scroll-driven state owned by `sticky-stack`.

## When to use

- To walk a developer through several capabilities, each proven by a short file, while the page scrolls.

## When NOT to use

- For one claim beside one sample → use `code-split`.
- For a walkthrough shown by illustrations → use `feature-scroll`.

## Related

- `sticky-stack` — the pinned, scroll-driven run of claims this section renders through.
- `code-block` — the one-file sample each claim shows.

## Best practices

- Keep each sample short enough to read in the pinned frame.
- Give every item a `code`; the item's `action` is optional and shows only while the item is open.

## Usage

```vue
<script setup>
import StickyScrollCode from '@aziontech/webkit/sections/sticky-scroll-code'
</script>

<template>
  <StickyScrollCode
    eyebrow="Ship It"
    title="Everything You Need to Build and Deploy"
    :items="[
      {
        title: 'Automated deployment via Git or CLI',
        description: 'Run one command from the project you already have.',
        action: { label: 'Docs', href: '/docs', trailing: true },
        code: { fileName: 'deploy.sh', language: 'bash', code: 'azion deploy' }
      }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the large section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `items` | `StickyScrollCodeItem[]` | `[]` | false | The capabilities, in reading order; each is `{ title, description, code, action? }` where `code` is the one-file sample `{ fileName, code, language?, fileIcon?, copyAriaLabel? }` and `action` is `{ label, href, trailing? }` rendered as a small secondary button under the open item. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`; the open item, its progress and the pinned frame are scroll-driven state owned by `sticky-stack`
- Empty: when `items` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set; an item's button renders only when it has an `action`

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| sample shape | `var(--shape-elements)` |
| sample shadow | `var(--shadow-sm)` |
| media gap | `var(--spacing-md)` |
| frame rules and marks | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `code-block` (copy button) and `button`.
- Keyboard map: `Tab` reaches each open item's copy button and button.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the headline is the section title's `h2`; each sample's copy button is named by its `copyAriaLabel`, or the code block's own name when empty.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`, `sticky-stack` and `code-block`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the sample's line entrance is owned by `code-block`.
- Touch target ≥40×40 px — not applicable to the small item button, which is supplementary to the item's copy.

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
