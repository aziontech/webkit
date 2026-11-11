---
name: outcome-mark
category: feedback
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: ca62191d90dd3051f8d68053ba4a1947a422013dc051c39f8e63f8f7a8f1e6d5
created: 2026-11-11
last_updated: 2026-11-11
---

# OutcomeMark — Component Spec

## Purpose

A small round mark that states how something ended: a check for success, a cross for danger, an exclamation for warning and a dash for neutral (not set, not run). It replaces the design sample's `StateMark` and `SuccessMark`. With `animated` the disc scales in and the glyph draws itself when the mark appears and every time its severity changes, so an outcome screen or a finished row can mark the moment a run lands; under reduced motion it shows at once.

## When to use

- At the head of an outcome screen (deploy succeeded or failed), at the large size, animated.
- In a checklist or a list of steps, at the small size, to say a step is done or not set.
- Beside a label that reports a finished run, when the run's state turns from running to an outcome.

## When NOT to use

- A state that is still running → use `spinner` or `status-indicator` with `loading`.
- A labelled status pill in a table cell → use `tag` or `status-indicator`.
- A message with text and actions → use `alert` or `toast`.

## Related

- `status-indicator` — a coloured dot with a label, for live states.
- `tag` — a labelled pill for a state.
- `toast` — reports the outcome of an async action wherever the user is.

## Best practices

- Pair the mark with words that say the same thing; the mark is not the only cue.
- Animate only the mark that just changed; a list of animated marks on load is noise.
- Give a specific `ariaLabel` (`Deployed`, `Done`) when the catalog name is too generic.

## Usage

```vue
<script setup>
  import OutcomeMark from '@aziontech/webkit/outcome-mark'
</script>

<template>
  <OutcomeMark
    severity="success"
    size="large"
    animated
    aria-label="Deployed"
  />
</template>
```

## Props

| Prop        | Type                                              | Default     | Required | JSDoc                                                                                                   |
| ----------- | ------------------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `severity`  | `'success' \| 'danger' \| 'warning' \| 'neutral'` | `'success'` | false    | The outcome the mark shows: a check, a cross, an exclamation or a dash.                                  |
| `size`      | `'small' \| 'medium' \| 'large'`                  | `'medium'`  | false    | Size token: 16, 20 or 48 px.                                                                            |
| `animated`  | `boolean`                                         | `false`     | false    | Scales the disc in and draws the glyph when it appears or its severity changes; static under reduced motion. |
| `ariaLabel` | `string`                                          | `''`        | false    | Accessible name. Empty uses the locale catalog name of the severity.                                    |

## Events

_none_

## Slots

_none_

## States

- `data-severity`: `success` | `danger` | `warning` | `neutral`; `data-size`: `small` | `medium` | `large`
- `data-state`: `pending` (disc scaled down and transparent, glyph undrawn) | `settled`; a static mark is always `settled`
- `data-animated` mirrors the `animated` prop

## Motion & Animations

| Trigger                         | Animation / Transition                                                                                  | Token                                         | Reduced-motion fallback                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------- |
| appear or severity change (disc) | `transition-[scale,opacity] duration-moderate-02 ease-expressive-entrance`                             | duration `moderate-02`, curve `expressive-entrance` | `motion-reduce:transition-none`; the flip is skipped |
| appear or severity change (glyph) | `transition-[stroke-dashoffset] duration-slow-01 ease-expressive-entrance`, delayed by `delay-150` (the `moderate-01` value; there is no delay token) | duration `slow-01`, curve `expressive-entrance`     | `motion-reduce:transition-none`                 |

## Tokens

| Region                 | Token                                                     |
| ---------------------- | --------------------------------------------------------- |
| success disc / glyph   | `var(--success)` / `var(--success-contrast)`              |
| danger disc / glyph    | `var(--danger)` / `var(--danger-contrast)`                |
| warning disc / glyph   | `var(--warning)` / `var(--warning-contrast)`              |
| neutral disc / ring / glyph | `var(--bg-surface-raised)` / `var(--border-default)` / `var(--text-muted)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Not focusable; no keyboard map.
- ARIA: the root `svg` is `role="img"` named by `ariaLabel` or the catalog name of the severity.
- The shape of the glyph tells the outcomes apart without colour (WCAG 1.4.1); glyph against disc meets 3:1 (WCAG 1.4.11) in both themes.
- Motion is decorative and skipped under `prefers-reduced-motion`.

## Internationalization

| Key                    | English source  | Override prop |
| ---------------------- | --------------- | ------------- |
| `outcomeMark.success` | Succeeded       | `ariaLabel`   |
| `outcomeMark.danger`  | Failed          | `ariaLabel`   |
| `outcomeMark.warning` | Needs attention | `ariaLabel`   |
| `outcomeMark.neutral` | Not set         | `ariaLabel`   |

- Formatting: none.

## Right-to-left

- Layout: no layout of its own.
- Icons: the check, cross, exclamation and dash are not mirrored.
- Keyboard: none.
- User data: none.

## Responsive

- Container queries: none: fixed size per `size`.
- Narrow: unchanged.
- Touch: not interactive.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 3 KB gzip for `./outcome-mark` in `.size-limit.json`.
- Runtime budget: none: two `requestAnimationFrame` ticks per replay.
- Heavy parts: none.

## Stories (Storybook)

- Default — the four severities.
- Sizes — small, medium and large in context.
- Animated — justified: the mark turns from neutral to an outcome on a button press, which is the only way to show the replay.

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
