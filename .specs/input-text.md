---
name: input-text
category: inputs
structure: monolithic
status: approved
spec_version: 2
checksum: 70f887fdc6932b1f79b79148688ae417dc3090513fd7d6607c77075ecdf5a898
created: 2026-05-22
last_updated: 2026-06-16
---
# Input Text — Component Spec

## Purpose

Single-line text input for forms and inline editing. Renders a bordered field with optional leading/trailing icon slots. Visual states (hover, focus, filled) are driven by native CSS pseudo-classes, not props. The component is the field only — labels, helper text, and error messages live in the wrapping form-field layer.

Aligned with Figma frame `562:6774` (Webkit / InputText).

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `string` | `undefined` | no | Two-way bound value of the field. |
| `placeholder` | `string` | `''` | no | Placeholder shown when the field is empty. |
| `type` | `'text' \| 'email' \| 'number'` | `'text'` | no | Native input type. Restricted to single-line variants the field treats identically. |
| `maxLength` | `number` | `undefined` | no | Native `maxlength` — maximum number of characters allowed. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Size token; affects height only — padding and typography are constant. Heights: small=28px, medium=32px, large=40px. |
| `disabled` | `boolean` | `false` | no | Disables interaction and applies disabled tokens. |
| `readonly` | `boolean` | `false` | no | Marks the field read-only; value is visible but not editable. Native pass-through. |
| `required` | `boolean` | `false` | no | Marks the field as required; sets native `required` and `aria-required`. Visual indicator (asterisk) is owned by the wrapping form-field, not by this component. |
| `invalid` | `boolean` | `false` | no | Applies the invalid border + ring tokens and sets `aria-invalid`. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `string` | Emitted on native `input` event with the new value. |

## Slots

| Slot | Purpose | Notes |
|---|---|---|
| `iconLeft` | Leading icon rendered inside the field, before the input. | Hidden from assistive tech (`aria-hidden="true"`). |
| `iconRight` | Trailing icon rendered inside the field, after the input. | Hidden from assistive tech (`aria-hidden="true"`). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `filled`, `disabled`, `invalid`
- `data-size` mirrors the `size` prop
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors the `invalid` prop
- `data-required` mirrors the `required` prop; drives the warning-border treatment
- `data-has-icon-left` / `data-has-icon-right` mirror slot presence (driven by `$slots.iconLeft` / `$slots.iconRight`)
- `filled` is detected via the native `:not(:placeholder-shown)` selector — no JS state

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| state change (border/ring/bg) | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography | `.text-label-sm` |
| surface | `var(--bg-surface)` |
| surface (disabled) | `var(--bg-disabled)` |
| text | `var(--text-default)` |
| text (placeholder/muted) | `var(--text-muted)` |
| text (disabled) | `var(--text-disabled)` |
| border (default) | `var(--border-default)` |
| border (hover) | `var(--border-strong)` |
| border (invalid) | `var(--danger-border)` |
| border (required) | `var(--warning-border)` |
| ring (focus) | `var(--ring-color)` |
| spacing (horizontal padding) | `var(--spacing-sm)` |
| spacing (gap between icon and input) | `var(--spacing-xs)` |
| shape | `var(--shape-elements)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]` — applied via `focus-within` on the field wrapper so the ring covers the whole control including icon slots.
- Keyboard map: `Tab` focuses the input; standard text-editing keys apply.
- ARIA: `aria-invalid` is bound to the `invalid` prop; `aria-required` to the `required` prop; icon slots are `aria-hidden="true"` (decorative).
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including disabled state.
- `motion-reduce:transition-none` on every transition-bearing class.
- Touch target ≥40×40 px on `size="large"`; smaller sizes are intended for dense layouts where the wrapping label area extends the hit zone.

## Stories (Storybook)

- Default
- Sizes — composite story rendering all three sizes side by side (canonical composite per `storybook-write` skill).
- Icons — composite story showing the `iconLeft` slot, the `iconRight` slot, and both combined. Justification: documents the slot API surface from the Figma component (`hasIconLeft`/`iconLeft`, `hasIconRight`/`iconRight`) in a single browsable view.
- Filled — justification: pre-populated `modelValue` shows the filled visual state, which is implicit (no prop) and not visible from the Default story.
- Invalid — justification: documents the `invalid` visual treatment, which is a top-level prop with distinct token bindings.
- Email — justification: documents `type="email"` (native browser keyboard / validation surface) since the `type` prop is restricted and only two values matter visually.
- MaxLength — justification: documents `maxLength` as a hard character cap; behavior is invisible from props alone and only observable while typing.
- Disabled

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
- Do not add bespoke Storybook stories beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Stories (Storybook)" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
