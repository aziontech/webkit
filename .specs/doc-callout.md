---
name: doc-callout
category: documentation
structure: monolithic
status: implemented
spec_version: 1
checksum: b255666b3b5f7ad78634c367e9bc3ee58415a7b53a17745da1cac144867768c9
created: 2026-08-22
last_updated: 2026-08-22
---

# DocCallout — Component Spec

## Purpose

The admonition a documentation page interrupts itself with — Note, Info, Tip, Check, Warning, Danger — rendered on the webkit `Message` surface, so the severity colour, the border, the icon and the radius come from the design system rather than from this layer. Its anatomy is a glyph and one row of inline prose, nothing else.

## When to use

- An aside the reader must not miss mid-prose: a caveat, a prerequisite, a warning about data loss.
- A short confirmation that a step worked (`check`), or a shortcut worth knowing (`tip`).

## When NOT to use

- For a block that needs its own box — a list, a fenced sample, a card grid. Those belong outside the callout; its body is inline prose.
- For an application-screen banner or a form error — use `Message` directly, which is what this composes.
- As a section heading. A callout is an interruption, not structure.

## Related

- `Message` — the webkit surface this renders on; reach for it directly outside documentation prose.
- `DocProse` — the contract around it. A callout marks itself `data-doc-chrome`, so prose rules stop at its edge, and `data-doc-block`, so it takes the block rung of the ladder.

## Best practices

- Let the glyph and the tint carry the severity; do not restate it in the copy ("Warning: …").
- Keep the body to inline prose — a sentence or two, links and inline code.
- Reach for `tip` when the aside claims nothing about stakes. Borrowing `check` for a friendly shortcut paints a shortcut the same green as a confirmed success.

## Usage

```vue
<script setup>
  import DocCallout from '@aziontech/webkit/doc-callout'
</script>

<template>
  <DocCallout kind="warning">
    Deleting a workload releases its domain. Anything still pointing at it will stop resolving.
  </DocCallout>
</template>
```

## Props

| Prop    | Type                                                            | Default  | Required | JSDoc                                                             |
| ------- | --------------------------------------------------------------- | -------- | -------- | ----------------------------------------------------------------- |
| `kind`  | `'note' \| 'info' \| 'tip' \| 'check' \| 'warning' \| 'danger'` | `'note'` | false    | Which admonition this is; drives the severity color and the icon. |
| `label` | `string`                                                        | `''`     | false    | Fallback copy when the default slot is empty.                     |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                  |
| --------- | ----- | ------------------------------------------------------ |
| `default` | —     | The callout copy: inline prose, links and inline code. |

## States

- Visual states: `default` (the component is not interactive and holds no state)
- `data-kind` mirrors the `kind` prop, so a test or a consumer can target one flavour
- `data-neutral` is present only for `tip`, the one kind that carries no severity
- `data-doc-block` + `data-doc-chrome` are the `DocProse` contract (block rung; prose stops here)

## Motion & Animations

_none_

## Tokens

| Region                            | Token (DESIGN.md)                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------------- |
| typography (copy)                 | `.text-body-sm`                                                                                   |
| typography (inline code)          | `.text-label-code-sm`                                                                             |
| text                              | `var(--text-default)`                                                                             |
| surface (neutral kind)            | `var(--bg-surface)`                                                                               |
| border (neutral kind)             | `var(--border-default)`                                                                           |
| glyph (neutral kind)              | `var(--primary)`                                                                                  |
| surface + border (severity kinds) | `Message`'s own `data-severity` tokens                                                            |
| surface (inline code, neutral)    | `var(--bg-hover)`                                                                                 |
| border (inline code, severity)    | `var(--info-border)` / `var(--success-border)` / `var(--warning-border)` / `var(--danger-border)` |
| shape (inline code)               | `var(--shape-flat)`                                                                               |
| spacing                           | `var(--spacing-sm)`                                                                               |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the callout is not focusable; a link inside it inherits the prose focus ring.
- Keyboard map: none of its own — `Tab` reaches only a link in the copy.
- ARIA: the role comes from `Message`; the glyph is decorative (`aria-hidden`), so the copy is the accessible content.
- Contrast ≥4.5:1: the copy is `--text-default` in every kind, measured 13.31:1–18.97:1 across the six fills in both themes. The inline-code chip keeps `--text-default` too, measured 10.05:1–14.43:1 — the severity ink on that chip drops to 4.03:1 in dark danger, which is why it is not used.
- `tip` deliberately does **not** speak in `--text-muted` (3.95:1 light, under AA).
- Touch target: not applicable; the component is not interactive.

## Stories (Storybook)

- Default — a single callout with the default `kind`.
- Kinds — composite story rendering all six kinds side by side, which is the only way to read the severity ladder and the neutral `tip` against each other.

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
