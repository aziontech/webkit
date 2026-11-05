---
name: cli-terminal
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 66de448b728dd31299dc75e537d25f98b3c049bc8ecf59044eb9d2c901f0ff37
---
# CliTerminal — Component Spec

## Purpose

The Azion CLI band of a product page: a horizontal section title with one outlined button, over a terminal session on the pixelate texture that runs off the frame's bottom rule, its lines entering one after another. It is a page section — the site places it from a `{ _id: 'cli-terminal', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `button`, `frame-box`, `texture-material` and `code-block`.

## When to use

- To close a product argument on how little it takes to ship from the terminal, like Functions and Workloads.

## When NOT to use

- For a config file or handler beside the claim → use `code-split`.
- For several capabilities, each with its own file → use `sticky-scroll-code`.

## Related

- `code-block` — the terminal session the band shows.
- `code-split` — the sibling band with the sample beside the copy.

## Best practices

- Keep the session to a few commands and their output; comment the output lines so the copied text still runs.
- Name the copy button with `copyAriaLabel` so a screen reader says what it copies.

## Usage

```vue
<script setup>
import CliTerminal from '@aziontech/webkit/sections/cli-terminal'
</script>

<template>
  <CliTerminal
    eyebrow="Azion CLI"
    title="Deploy your first function in two commands"
    description="Link a project, deploy it, and curl the domain the CLI hands back."
    copy-aria-label="Copy the deploy session"
    session="azion deploy --auto"
    :primary-action="{ label: 'Install the CLI', href: '/docs/cli', trailing: true }"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Supporting sentence beside the headline. |
| `session` | `string` | `''` | false | The terminal session shown under the header, commands and their output verbatim, highlighted as bash; the band renders nothing when empty. |
| `copyAriaLabel` | `string` | `''` | false | Accessible name of the session's copy button; empty keeps the code block's own. |
| `primaryAction` | `CliTerminalAction` | `undefined` | false | Outlined button in the section title; `{ label, href, trailing?, target? }`. Omitted when absent. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`; the copy button and the button own their hover and focus states
- Empty: when `session` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| session shape | `var(--shape-elements)` |
| session shadow | `var(--shadow-2xl)` |
| session width | `var(--container-4xl)` |
| headline width | `var(--container-xl)` |
| frame inset | `var(--spacing-xl)` |
| frame top air | `var(--spacing-16)`, `var(--spacing-32)` |
| session bleed | `var(--spacing-xs)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `code-block` (copy button) and `button`.
- Keyboard map: `Tab` reaches the button and the copy button; `Enter` follows the button.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the headline is the section title's `h2`; the copy button is named by `copyAriaLabel`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`, `code-block` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the session's line entrance is owned by `code-block` and draws at once under reduced motion.
- Touch target ≥40×40 px: the large button.

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
