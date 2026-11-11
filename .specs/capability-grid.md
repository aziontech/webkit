---
name: capability-grid
category: sections
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: b9635258310c42f50e3dd95ca7b1bf8e61234dbcbe3a093f70356b5d1ab21412
created: 2026-11-11
last_updated: 2026-11-11
---

# CapabilityGrid — Component Spec

## Purpose

A framed grid of product capabilities under an optional section title: each cell is a `Topic` (glyph, heading, sentence) with optional bullet points, three or four to a row. From the design sample's site `CapabilityGrid`.

## When to use

- A product page listing what the product does, three or six at a time.
- A bare grid (no title) under a band that already has its heading.

## When NOT to use

- For capabilities with art — use `FeatureTiles` or `BentoGrid`.
- For links to other pages — use `UseCaseLinks` or `ResourceGrid`.

## Related

- `Topic`, `CardGrid`, `FrameBox`, `SectionTitle` — the parts.
- `FeatureTiles` — tiles with illustrations.

## Best practices

- Three or six items at three columns, four or eight at four, so rows stay full.
- Keep points to three short lines.

## Usage

```vue
<script setup>
  import CapabilityGrid from '@aziontech/webkit/capability-grid'
</script>

<template>
  <CapabilityGrid
    title="Everything an application needs"
    :items="[
      { icon: 'pi pi-bolt', title: 'Functions', description: 'Run code close to users.' },
      {
        icon: 'pi pi-database',
        title: 'Storage',
        description: 'Keep objects where they are read.'
      },
      {
        icon: 'pi pi-shield',
        title: 'Firewall',
        description: 'Stop attacks before they reach you.'
      }
    ]"
  />
</template>
```

## Props

| Prop          | Type                     | Default | Required | JSDoc                                                                                                                   |
| ------------- | ------------------------ | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `eyebrow`     | `string`                 | `''`    | false    | Overline above the title.                                                                                               |
| `title`       | `string`                 | `''`    | false    | Headline over the grid, rendered as the band `h2`; without it the grid is bare and each capability heading is an `h2`.  |
| `description` | `string`                 | `''`    | false    | One or two sentences under the title.                                                                                   |
| `items`       | `CapabilityGridItem[]`   | `[]`    | false    | The capabilities, in order; each is `{ title, description, icon?, points? }`. The band renders nothing when empty.      |
| `columns`     | `3 \\                    | 4`      | `3`      | false                                                                                                                   | Capabilities per row from the large breakpoint up. |
| `actions`     | `CapabilityGridAction[]` | `[]`    | false    | Buttons under the section title; each is `{ label, href, trailing?, target? }`, the first secondary, the rest outlined. |
| `anchor`      | `string`                 | `''`    | false    | In-page id set on the band so a hash link can target it.                                                                |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Renders nothing without items.
- Heading level drops to `h3` under a title and rises to `h2` without one.

## Motion & Animations

_none_

## Tokens

| Region  | Token (DESIGN.md)                                             |
| ------- | ------------------------------------------------------------- |
| frame   | From `FrameBox` and `CardGrid` (`var(--border-default)`)      |
| cell    | `var(--bg-canvas)` (`CardGridCell kind="canvas"`)             |
| points  | `.text-body-md`, `var(--text-muted)`                          |
| spacing | `var(--spacing-sm)`, `var(--spacing-xs)`, `var(--spacing-md)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- A `section` named by its title; headings nest under it.
- Points are a real list.
- Glyphs are decorative (from `Topic`).

## Internationalization

- Built-in strings: none. Every visible string is marketing copy and arrives through props, so the page supplies it in its own language.

## Right-to-left

- Layout: logical utilities only (`ps-*`, `border-e`, `ms-*`).
- Icons: none mirrored.
- Keyboard: unchanged.

## Responsive

- One column on phones, two on medium, `columns` from large (from `CardGrid`).
- No horizontal scroll at 320 px.

## Performance

- Bundle budget: 6.75 KB for `./capability-grid` gzip in `.size-limit.json` (measured + ~0.5 KB).
- Heavy parts: none.

## Stories (Storybook)

- Default — three capabilities with a title and an action.
- Points — six capabilities with bullet points at four columns.

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
