---
name: doc-steps
category: docs
structure: composition
status: implemented
spec_version: 3
checksum: 1fbebc5bc0f7709f3aa56146cf9ce7fedaf85415ae95b0bea20e35f8fd348089
created: 2026-08-22
last_updated: 2026-11-22
---

# DocSteps — Component Spec

## Purpose

The ordered walkthrough from the docs frame: a column of `DocSteps.Step` children joined by a rail. Each step registers itself through the context this root provides and reads its number back, so the numbering is a fact of the document order — an author writes titles, never numbers, and reordering the page renumbers it. The final registered step is marked last, which is what drops its connector and trailing space.

## When to use

- Use DocSteps only inside documentation prose for numbered instructions read top to bottom.
- A procedure the reader performs in order: install, link, deploy.
- Any "follow these steps" band in documentation prose, however short.

## When NOT to use

- For a wizard or form flow inside the application — that is `Stepper` (or `Wizard`), not documentation chrome.
- For an unordered list of options or features — order is the whole claim this component makes; a list that has none is a plain list or `DocItem` rows.
- For a single instruction — one step is a sentence, not a walkthrough.

## Related

- `Stepper` — the app's interactive step rail. Both number their steps with the same shared step registry (`useStepRegistry`), which reads the order from the page, so a step inserted between two others takes its place in the count.
- `DocProse` — the contract around it. The column marks itself `data-doc-block`, so it takes the block rung of the prose ladder.

## Best practices

- Start each step title with the verb; keep the how in the step's body.
- Let the numbering be the document order — never encode a number into a title.
- Give a step a body only when the heading alone does not carry it; the rail stretches to cover whatever the body holds.

## Usage

```vue
<script setup>
  import DocSteps from '@aziontech/ui/doc-steps'
</script>

<template>
  <DocSteps>
    <DocSteps.Step title="Install the Azion CLI">
      Homebrew is the shortest path on macOS.
    </DocSteps.Step>
    <DocSteps.Step title="Link the project" />
    <DocSteps.Step title="Deploy" />
  </DocSteps>
</template>
```

`@aziontech/ui/doc-steps-root` is the root alone, without `Step` attached, for an app that
only renders steps through `DocMarkdown`.

## Sub-components

- `doc-steps.vue` — the root column; provides the numbering context.
- `doc-steps-step.vue` — `DocSteps.Step`, one numbered step: the circled index, the rail that continues to the next step, the step heading (`title` prop, `''` default) and an optional body in its default slot. It registers with the root's context during setup and reads its index back, so an author writes a title and never a number; rendered outside `DocSteps` it throws (`useDocStepsContext must be used within DocSteps.`). The circle and the rail are `aria-hidden`; the heading carries `data-doc-chrome`, the rail `data-step-connector`, the body `data-step-body`; the final step drops its rail through a last-child CSS variant. Test id `doc-steps-step`. It has no standalone export: it only renders inside `DocSteps`, so it ships attached to the compound.

## Props

| _none_ | — | — | — | — |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                               |
| --------- | ----- | ------------------------------------------------------------------- |
| `default` | —     | The `DocSteps.Step` children, in the order they should be numbered. |

## States

- Visual states: `default` (the column is not interactive and holds no visual state of its own)
- Provides the numbering context (the shared step registry): each `DocSteps.Step` registers in setup, hands over its element on mount and deregisters on unmount; `index` is the 1-based position on the page; the final step's connector is suppressed by a last-child CSS variant
- `data-doc-block` is the `DocProse` contract (the column takes the block rung of the ladder)

## Motion & Animations

_none_

## Tokens

| Region | Token (TOKENS.md) |
| ------ | ----------------- |
| _none_ | —                 |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the column is not focusable; `Tab` reaches only interactive content nested inside a step's body.
- Keyboard map: none of its own.
- ARIA: the column is an ordered list (`ol`, its markers removed) and each `DocSteps.Step` a list item (`li`), so assistive tech announces the step count and each step's position ("2 of 5"). The circled indices and the rail are decorative (`aria-hidden`, owned by `DocSteps.Step`): the list position already says the number, so it is not read twice. The step title stays text, not a heading: a heading level would need a new prop.
- Contrast: inherited from `DocSteps.Step`; the column paints nothing.
- Touch target: not applicable; the component is not interactive.

## Examples

- Default — five titled steps, the shape the docs frame specifies. Composite by necessity: the public API is slots-only, so there is nothing for an arg-driven story to drive.
- With step content (`WithBody`) — steps carrying prose bodies of different heights, so the rail visibly stretches to cover them. Justified in writing here because the body is a slot-shaped axis no control can reach, and the connector behaviour only reads against bodies of unequal height.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/ui/*` path must exist in `packages/ui/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
