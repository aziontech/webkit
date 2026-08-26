---
name: doc-step
category: documentation
structure: monolithic
status: implemented
spec_version: 1
checksum: 1f00c7b61e9b90c177431d9bd9ae5df6fd4d710d6315e7291c08c37f5cce9d14
created: 2026-08-22
last_updated: 2026-08-22
---

# DocStep — Component Spec

## Purpose

One numbered step of a `DocSteps` walkthrough: the circled index, the rail that continues to the next step, the step heading, and any content the author nests underneath. The number and the last-step mark come from the `DocSteps` context — the step registers itself during setup and reads its reactive index back, so an author writes a title and never a number. Rendered outside a `DocSteps` provider it throws (`useDocStepsContext must be used within DocSteps.`) instead of rendering unnumbered.

## When to use

- Only as a direct child of `DocSteps`, one per instruction the reader performs.

## When NOT to use

- Anywhere outside a `DocSteps` column — the context composable throws by design.
- For a checklist entry or a feature bullet — a step claims an order and a number.

## Related

- `DocSteps` — the sibling root that numbers this; it provides the context this step registers with.
- `DocProse` — the step heading marks itself `data-doc-chrome`, so prose rules stop at its edge.

## Best practices

- Lead the title with the verb and keep it to one line of instruction.
- Put elaboration — prose, a code block, another component — in the body slot, not in the title.
- Never restate the number in the title; the circle carries it.

## Usage

```vue
<script setup>
  import DocStep from '@aziontech/webkit/doc-step'
  import DocSteps from '@aziontech/webkit/doc-steps'
</script>

<template>
  <DocSteps>
    <DocStep title="Install the Azion CLI"> Homebrew is the shortest path on macOS. </DocStep>
    <DocStep title="Deploy" />
  </DocSteps>
</template>
```

## Props

| Prop    | Type     | Default | Required | JSDoc             |
| ------- | -------- | ------- | -------- | ----------------- |
| `title` | `string` | `''`    | false    | The step heading. |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                    |
| --------- | ----- | ------------------------------------------------------------------------ |
| `default` | —     | Optional body under the step heading: prose, code, or another component. |

## States

- Visual states: `default` (the step is not interactive)
- The final step drops its connector rail and trailing space through a last-child CSS variant, not through state. "Am I last?" is a question about DOM order, and a registration count answers it wrong: the count grows while the parent is still rendering, so every step would read it as it stood at its own setup
- `data-step-connector` marks the rail element, so its presence is testable structurally
- `data-doc-chrome` on the heading is the `DocProse` contract (prose rules stop here)

## Motion & Animations

_none_

## Tokens

| Region                      | Token (DESIGN.md)                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------- |
| typography (index)          | `.text-label-md`                                                                       |
| typography (heading)        | `.text-heading-xs`                                                                     |
| text                        | `var(--text-default)`                                                                  |
| surface (index circle)      | `var(--bg-surface)`                                                                    |
| border (index circle, rail) | `var(--border-default)`                                                                |
| shape (index circle)        | `var(--radius-full)`                                                                   |
| spacing                     | `var(--spacing-md)` / `var(--spacing-sm)` / `var(--spacing-xxs)` / `var(--spacing-lg)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the step is not focusable; `Tab` reaches only interactive content nested in its body.
- Keyboard map: none of its own.
- ARIA: the circled index and the rail are decorative (`aria-hidden`); the heading text and the body are the step's accessible content, read in document order — the same order the numbers claim.
- Contrast ≥4.5:1 (text): the heading and the index use `var(--text-default)` on the page and `var(--bg-surface)` respectively, the same pairing the rest of the layer measures AA on.
- Touch target: not applicable; the component is not interactive.

## Stories (Storybook)

- DocStep has no story file of its own, which is justified in writing here: a step cannot render outside its `DocSteps` provider (the context composable throws by design), so its anatomy — title-only steps, a step with body content, and the last step dropping its connector — is documented by the `DocSteps` stories (`Default`, `With step content`) in `DocSteps.stories.js`.

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
