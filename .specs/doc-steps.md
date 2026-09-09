---
name: doc-steps
category: documentation
structure: monolithic
status: implemented
spec_version: 1
checksum: 94d518a2e5fa943e0eca8998f466f8c5cbb6360ca6fa95d35a2a7828c9e812de
created: 2026-08-22
last_updated: 2026-08-22
---

# DocSteps — Component Spec

## Purpose

The ordered walkthrough from the docs frame: a column of `DocStep` children joined by a rail. Each step registers itself through the context this root provides and reads its number back, so the numbering is a fact of the document order — an author writes titles, never numbers, and reordering the page renumbers it. The final registered step is marked last, which is what drops its connector and trailing space.

## When to use

- A procedure the reader performs in order: install, link, deploy.
- Any "follow these steps" band in documentation prose, however short.

## When NOT to use

- For a wizard or form flow inside the application — that is the console's own stepper surface, not documentation chrome.
- For an unordered list of options or features — order is the whole claim this component makes; a list that has none is a plain list or `DocItem` rows.
- For a single instruction — one step is a sentence, not a walkthrough.

## Related

- `DocStep` — the sibling root this numbers; a step registers with this context on mount and throws when rendered outside one.
- `DocProse` — the contract around it. The column marks itself `data-doc-block`, so it takes the block rung of the prose ladder.

## Best practices

- Start each step title with the verb; keep the how in the step's body.
- Let the numbering be the document order — never encode a number into a title.
- Give a step a body only when the heading alone does not carry it; the rail stretches to cover whatever the body holds.

## Usage

```vue
<script setup>
  import DocStep from '@aziontech/webkit/doc-step'
  import DocSteps from '@aziontech/webkit/doc-steps'
</script>

<template>
  <DocSteps>
    <DocStep title="Install the Azion CLI"> Homebrew is the shortest path on macOS. </DocStep>
    <DocStep title="Link the project" />
    <DocStep title="Deploy" />
  </DocSteps>
</template>
```

## Props

| _none_ | — | — | — | — |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                         |
| --------- | ----- | ------------------------------------------------------------- |
| `default` | —     | The `DocStep` children, in the order they should be numbered. |

## States

- Visual states: `default` (the column is not interactive and holds no visual state of its own)
- Provides the numbering context: each `DocStep` registers on mount and deregisters on unmount; `index` is the 1-based document order and `last` marks the final registration, which suppresses that step's connector
- `data-doc-block` is the `DocProse` contract (the column takes the block rung of the ladder)

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
| ------ | ----------------- |
| _none_ | —                 |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the column is not focusable; `Tab` reaches only interactive content nested inside a step's body.
- Keyboard map: none of its own.
- ARIA: the column is a plain block. The circled indices and the rail are decorative (`aria-hidden`, owned by `DocStep`), so assistive tech reads the step headings and bodies in document order — the same order the numbers claim.
- Contrast: inherited from `DocStep`; the column paints nothing.
- Touch target: not applicable; the component is not interactive.

## Stories (Storybook)

- Default — five titled steps, the shape the docs frame specifies. Composite by necessity: the public API is slots-only, so there is nothing for an arg-driven story to drive.
- With step content (`WithBody`) — steps carrying prose bodies of different heights, so the rail visibly stretches to cover them. Justified in writing here because the body is a slot-shaped axis no control can reach, and the connector behaviour only reads against bodies of unequal height.

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
