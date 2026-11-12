---
name: doc-agent-card
category: documentation
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 730bab9ffbe87952eb29ba47ccc7bc6e457e8a75809696a29f6d313980097485
created: 2026-11-12
last_updated: 2026-11-12
---

# DocAgentCard — Component Spec

## Purpose

The "Your AI agent, fluent in Azion" card that opens the first section of a documentation home. Two columns in one framed card: on the left the title, one or two sentences on what the prompt gives the agent, and the inline `CopyPromptButton` with the agent marks; on the right, behind a vertical divider, the question "Prefer the guided route?" over an orange `Agent setup` button, set on an orange halftone panel that fades in from the bottom corner. Below the card's `@3xl` container size the columns stack and the divider turns horizontal. All four strings default to the catalog, so `<DocAgentCard :prompt="…" />` is the whole reference card.

## When to use

- The first block under "Start by interface" (or the hero) of a documentation home, to hand the reader's coding agent the platform in one prompt and offer the guided setup next to it.

## When NOT to use

- To show the prompt text itself → use `DocPrompt`.
- As a generic two-column banner → use `DocCard`, `DocCta` or a marketing `Banner`.
- On an article page → put `CopyPromptButton` in `DocPageHeader`'s meta actions instead.

## Related

- `CopyPromptButton` — the left column's action.
- `DocHero` — the masthead above it on a docs home.
- `DocCardGroup` — the Console / CLI / API cards that follow it; both share `FrameBox`'s corner marks.
- `TextureMaterial` — the `dither` halftone behind the guided action.

## Best practices

- Pass the exact prompt in `prompt`; leave the strings to the catalog unless the product differs.
- Point `action-href` at the agent setup guide.
- Follow it with a three-column `DocCardGroup` (Console, CLI, API) in the same section.
- Do not add an overline or an eyebrow above the title; the card has none.

## Usage

```vue
<script setup>
  import DocAgentCard from '@aziontech/webkit/doc-agent-card'
</script>

<template>
  <DocAgentCard
    prompt="Set up the Azion CLI, connect the Azion docs over MCP and link this project."
    action-href="/docs/agent-setup"
  />
</template>
```

## Props

| Prop          | Type                | Default     | Required | JSDoc                                                                                 |
| ------------- | ------------------- | ----------- | -------- | ------------------------------------------------------------------------------------- |
| `prompt`      | `string`            | —           | true     | The prompt `CopyPromptButton` copies.                                                 |
| `title`       | `string`            | `''`        | false    | Card heading (an `h3`); empty uses the catalog's `Your AI agent, fluent in Azion`.    |
| `description` | `string`            | `''`        | false    | One or two sentences on what the prompt gives the agent; empty uses the catalog's.    |
| `agents`      | `CopyPromptAgent[]` | `undefined` | false    | The agents whose marks the copy button shows; unset keeps the button's default list.  |
| `asideTitle`  | `string`            | `''`        | false    | Question over the guided action; empty uses the catalog's `Prefer the guided route?`. |
| `actionLabel` | `string`            | `''`        | false    | Label of the guided action; empty uses the catalog's `Agent setup`.                   |
| `actionHref`  | `string`            | `''`        | false    | Destination of the guided action; empty renders it as a button that only emits `action`. |

## Events

| Event    | Payload      | Notes                                                      |
| -------- | ------------ | ---------------------------------------------------------- |
| `copy`   | `string`     | Re-emitted from `CopyPromptButton` after a successful copy. |
| `action` | `MouseEvent` | The guided action was activated.                           |

## Slots

| Slot      | Props | Notes                                       |
| --------- | ----- | ------------------------------------------- |
| `actions` | —     | Replaces the copy button in the left column. |

## States

- Wide (container ≥ `@3xl`): two columns, 7 : 3, vertical divider. Narrow: one column, horizontal divider.
- The copy button carries its own `idle` / `copied` / `disabled` states.
- Not applicable: `loading`, `empty`, `error`, `open`/`closed`.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
| ------- | ---------------------- | ------------------------------------------------- | ----------------------- |
| _none_  | — (the button and copy button own theirs) | —                              | —                       |

## Tokens

| Region   | Token (DESIGN.md)                                                                   |
| -------- | ----------------------------------------------------------------------------------- |
| card     | `var(--bg-surface)` inside `FrameBox` (borders and corner marks)                    |
| divider  | `var(--border-default)`                                                             |
| title    | `.text-heading-lg`, `var(--text-default)`                                           |
| text     | `.text-body-md`, `var(--text-muted)`                                                |
| aside    | `.text-heading-md`, `var(--text-default)`                                           |
| art      | `TextureMaterial kind="dither"` inked with `var(--primary)` at 70 %                 |
| spacing  | `var(--spacing-xl)` padding, `var(--spacing-sm)` / `var(--spacing-md)` inner rhythm |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- A `<section>` named by its title (`aria-label`), with the title as an `h3` (it sits under the section's `h2`).
- The halftone is `aria-hidden` and never sits under text that needs contrast: the question and the button keep ≥ 4.5:1 on the surface.
- The actions keep their own roles, names and focus rings; reading order is left column, then right.

## Internationalization

| Key                       | English source                   | Override prop |
| ------------------------- | -------------------------------- | ------------- |
| `docAgentCard.title`      | `Your AI agent, fluent in Azion` | `title`       |
| `docAgentCard.description`| `One prompt teaches any coding agent the platform: …` | `description` |
| `docAgentCard.asideTitle` | `Prefer the guided route?`       | `asideTitle`  |
| `docAgentCard.action`     | `Agent setup`                    | `actionLabel` |

## Right-to-left

- Layout: logical utilities only (`border-s`, `end-0`); the divider and the halftone move to the mirrored side, and the dither ramp runs toward the bottom-left.

## Responsive

- Container query on the card itself (`@container`): two columns from `@3xl`, stacked below it.
- Reflow: no horizontal scroll at 320 px; the copy button truncates its label before overflowing.

## Performance

- Bundle budget: 6 KB gzip for `./doc-agent-card` in `.size-limit.json` (includes `Button`, `CopyPromptButton`, `FrameBox` and `TextureMaterial`).
- Runtime budget: none; static apart from the copy button's timer.

## Examples

- Default — the reference card from the catalog strings and a prompt.
- Narrow — the same card in a phone-width container, stacked.

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
