---
name: slider
category: inputs
structure: monolithic
status: implemented
checksum: dcb5be737b85c858cc69a8347669b3336a555ae082b892df072ef6731c1a7162
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-10
---

# Slider — Component Spec

## Purpose

Bare range control `Slider`: one thumb on a horizontal track that picks a single number between `min` and `max` in `step` increments, with the portion from `min` to the value filled. It is built on a native `<input type="range">`, so the keyboard model, the `slider` role and the value announcements come from the platform; the component only styles the track, fill and thumb with tokens and adds optional tick marks and labelled reference values under the track. It renders no label, value readout or helper text — a field composes it with `Label` and `HelperText`, the same way `switch` and `input-number` are composed.

## When to use

- Picking an approximate value inside a known, bounded range where the position matters more than the exact digit (a spend or usage limit, a percentage threshold, a sampling rate).
- A plan or capacity selector whose stops are evenly spaced and few enough to read as tick marks.
- A bounded value the user adjusts by feel and then commits (listen to `change` to persist on release instead of on every drag frame).

## When NOT to use

- The user must type an exact number, or the range is unbounded → use `input-number`.
- The choice is between a handful of named options (1h / 24h / 7d) → use `segmented-button`.
- An on/off setting → use `switch`.
- Showing progress or a read-only quantity the user cannot change → use `progress-bar`.
- Selecting a range with two thumbs (from–to) — not supported by this component.

## Related

- `input-number` — exact numeric entry; pair it next to a slider when the user needs both coarse dragging and an exact value.
- `label` — names the slider; point its `for` at the slider's `id` (the `id` attribute lands on the native input).
- `helper-text` — description or error message under the slider in a field layout.
- `segmented-button` — a few discrete, named choices instead of a continuous range.
- `progress-bar` — displays a fraction; it is not interactive.

## Best practices

- Always give the slider an accessible name: `aria-label`, or a `Label` whose `for` matches the slider's `id`.
- Keep the value inside `[min, max]` and on a `step` multiple; the component clamps the displayed fill but never rewrites the bound value on its own.
- Turn on `ticks` only when every step is meaningful and the range has at most 21 positions; above that the ticks are not rendered.
- Use `referenceValues` for a few landmarks (`[0, 50, 100]`), not for every step — labels need horizontal room.
- Set `unit` when the number alone is ambiguous; it is appended verbatim to the reference labels and to the announced value, so include a leading space for word units (`' GB'`) and none for symbols (`'%'`).
- Listen to `change` for expensive side effects (saving a limit to the API); `v-model` updates on every movement.
- Use `readonly` to show a value the current user may not change but should still be able to focus and hear; use `disabled` when the control does not apply at all.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import Slider from '@aziontech/webkit/slider'

const threshold = ref(40)
</script>

<template>
  <Slider
    v-model="threshold"
    :min="0"
    :max="100"
    :step="10"
    ticks
    :reference-values="[0, 50, 100]"
    unit="%"
    aria-label="Alert threshold"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `min` | `number` | `0` | false | Lowest selectable value; the left end of the track. |
| `max` | `number` | `100` | false | Highest selectable value; the right end of the track. |
| `step` | `number` | `1` | false | Increment between selectable values, used by dragging and the arrow keys. |
| `disabled` | `boolean` | `false` | false | Disables interaction, removes the control from the tab order and applies the disabled tokens. |
| `readonly` | `boolean` | `false` | false | Keeps the control focusable but prevents the value from changing. |
| `invalid` | `boolean` | `false` | false | Applies the danger tokens and sets aria-invalid. |
| `ariaLabel` | `string` | `''` | false | Accessible name when no visible label is associated with the slider. |
| `ticks` | `boolean` | `false` | false | Shows a tick mark at every step when the range has at most 21 positions. |
| `referenceValues` | `number[]` | `[]` | false | Values marked and labelled under the track; entries outside min and max are ignored. |
| `unit` | `string` | `''` | false | Text appended verbatim to the reference labels and to the announced value. |

## v-model

| Model | Type | Default | Emits | Notes |
|---|---|---|---|---|
| `v-model` | `number` | `0` | `update:modelValue` | Current value via `defineModel<number>({ default: 0 })`. Emitted on every native `input` event (drag frame or key press) as `valueAsNumber`. Never emitted while `disabled` or `readonly`. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `change` | `number` | Commit signal: emitted from the native `change` event — on pointer release after a drag, and after each keyboard step — with the committed value. Lets the consumer persist once per interaction instead of once per drag frame (`update:modelValue` fires continuously). A value event, so no DOM event in the payload (see `.claude/rules/event-payloads.md`). Not emitted while `disabled` or `readonly`. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active` (dragging), `disabled`, `readonly`, `invalid`
- `data-disabled` mirrors the `disabled` prop; the native input is also `disabled`, so it leaves the tab order and ignores pointer and keys.
- `data-readonly` mirrors the `readonly` prop. A native range input ignores the HTML `readonly` attribute, so the component owns the behaviour: the input stays focusable, `aria-readonly="true"` is set, the navigation keys (arrows, `PageUp`/`PageDown`, `Home`/`End`) are prevented, pointer dragging is prevented, and any native `input` that still slips through writes the current model back to the element without emitting. Visual: fill and thumb border switch to the muted token and the cursor is `default`.
- `data-invalid` mirrors the `invalid` prop: the fill and the thumb border switch to the danger tokens; `aria-invalid="true"` is set on the input.
- Fill: the root sets the custom property `--slider-fill` (the clamped value as a percentage of `max - min`; `0%` when `max <= min`) through an inline `style` binding, the same way `tracker` and `chart` set their custom properties. The WebKit/Blink track paints the fill with a bracketed gradient (`[&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--accent)_var(--slider-fill),var(--bg-surface)_var(--slider-fill))]`); Firefox paints it natively with `[&::-moz-range-progress]:bg-(--accent)`. Expression values and custom-property declarations stay in brackets per `.claude/rules/styling.md`.
- Track and thumb are styled only through arbitrary pseudo-element variants on the native input (`appearance-none`, `[&::-webkit-slider-runnable-track]:…`, `[&::-webkit-slider-thumb]:appearance-none …`, `[&::-moz-range-track]:…`, `[&::-moz-range-thumb]:…`) — no extra track/thumb elements, no `<style>` block.
- Geometry: the native input is 40 px tall (`h-10`, the hit area) and full width; the track is 4 px tall and centred; the thumb is 16×16 px.
- Ticks (`ticks`) and reference marks (`referenceValues`) render in an `aria-hidden` row under the track. Each mark is positioned at the thumb-centre position for its value — `thumb/2 + (100% - thumb) × fraction` — so marks line up with the thumb at both ends; the fraction is passed per mark through an inline custom property. Every reference value also draws a tick. Reference labels read `{value}{unit}`; the first label is start-aligned, the last end-aligned, the rest centred on their mark.
- Attribute routing (as in `input-number`): consumer `class` merges onto the root wrapper; every other attribute (`id`, `name`, `aria-labelledby`, `aria-describedby`, …) is forwarded to the native input so a `Label for` and a `HelperText` association reach the focusable element. `data-testid` is read from attrs and applied to the root.
- `data-testid`: root fallback `input-slider`; native input `${testId}__input`; each reference label `${testId}__reference`.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| thumb hover / focus / state colour change | `transition-colors duration-fast-02 ease-productive-entrance` on the thumb pseudo-elements | motion primitives (`duration-fast-02` · `productive-entrance`) | `motion-reduce:transition-none` |

The fill and the thumb position are not animated: they track the pointer every frame, and an eased fill would lag behind the thumb.

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| track — background | `var(--bg-surface)` |
| track — border | `var(--border-default)` |
| track — shape | `var(--shape-elements)` |
| fill | `var(--accent)` |
| thumb — fill | `var(--bg-surface)` |
| thumb — border | `var(--accent)` |
| thumb — shape | `var(--shape-elements)` |
| thumb (hover) — overlay | `var(--bg-hover)` |
| focus-visible ring (on the thumb) | `var(--ring-color)` |
| focus ring offset | `var(--bg-canvas)` |
| tick mark | `var(--border-strong)` |
| reference label — typography | `.text-label-sm` |
| reference label — colour | `var(--text-muted)` |
| fill + thumb border (invalid) | `var(--danger)` |
| track border (invalid) | `var(--danger-border)` |
| fill + thumb border (readonly) | `var(--text-muted)` |
| track (disabled) | `var(--bg-disabled)` |
| fill + thumb border + tick + label (disabled) | `var(--text-disabled)` |
| marks row gap | `var(--spacing-xxs)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the ring is drawn on the thumb, not the 40 px input box — `focus-visible:outline-none` on the input plus `focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-(--ring-color) focus-visible:[&::-webkit-slider-thumb]:ring-offset-2 focus-visible:[&::-webkit-slider-thumb]:ring-offset-(--bg-canvas)` and the same set for `[&::-moz-range-thumb]`.
- Keyboard map (native): `Tab` focuses; `ArrowRight`/`ArrowUp` +`step`; `ArrowLeft`/`ArrowDown` −`step`; `PageUp`/`PageDown` move by a larger browser-defined increment; `Home` → `min`; `End` → `max`. When `readonly`, `Tab` still focuses and every value key is inert. When `disabled`, the control is skipped by `Tab`.
- ARIA: the native `<input type="range">` provides `role="slider"` and the implicit `aria-valuemin` / `aria-valuemax` / `aria-valuenow` from `min` / `max` / the value. `aria-label` comes from `ariaLabel` (omitted when empty, so an associated `Label` wins). `aria-valuetext="{value}{unit}"` is set only when `unit` is non-empty. `aria-readonly="true"` when `readonly`; `aria-invalid="true"` when `invalid`. The ticks and reference-label row is `aria-hidden="true"`.
- Contrast: thumb border and fill against the track ≥3:1 (non-text UI), reference labels ≥4.5:1, including the disabled state per the disabled tokens.
- `motion-reduce:transition-none` on every transitioned pseudo-element class.
- Touch target: the native input is 40 px tall and full width, so the whole track row is the hit area (≥40×40); the 16 px thumb is a visual, not the target.

## Stories (Storybook)

- Default — `v-model` bound, `min=0`, `max=100`, `step=1`, `aria-label` set.
- Ticks — justified: `ticks` is a structural visual axis (marks under the track) that Default does not show; renders `step=10` over 0–100 with `ticks`.
- ReferenceValues — justified: the labelled marks and the `unit` suffix are the Cloudscape-style landmark pattern and need their own copy-pasteable example; renders 0–100 with `:reference-values="[0, 25, 50, 75, 100]"` and `unit="%"`.
- Disabled
- Invalid — justified: invalid is a mutually-exclusive state with its own tokens (danger fill + border) per `.claude/rules/component-states.md`; renders the Default args plus `invalid`.

## Open questions

- Readonly story: `.claude/rules/component-states.md` gives each mutually-exclusive state its own story, but the brief lists only the five above. Decide whether to add `Readonly` before approval.
- Readonly pointer suppression: preventing `pointerdown` on a native range also stops click-to-focus in some browsers; confirm in Chromium/Firefox/WebKit that the readonly control still receives focus by pointer, or accept `Tab`-only focus.
- Thumb focus ring: Tailwind `ring-*` on `::-webkit-slider-thumb` / `::-moz-range-thumb` relies on the `--tw-ring-*` registered properties reaching pseudo-elements; verify in the browser before scaffolding, fall back to an outline on the thumb if not.
- RTL: a native range flips under `dir="rtl"` but the `to_right` gradient and the mark positions do not; RTL support is out of scope for v1 unless requested.
- `unit` spacing is consumer-controlled (`'%'` vs `' GB'`); a formatter function prop was avoided to keep the props data-only. Revisit if locale-aware formatting is needed.
- No `size` prop: one size (40 px hit area, 4 px track, 16 px thumb). Add the canonical `size` union later only if a design asks for it.

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
