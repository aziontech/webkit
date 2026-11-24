---
name: rating
category: input
structure: monolithic
status: approved
stability: preview
spec_version: 1
template: 2
checksum: cccfcb62ba4d3deca34297ae65a28ca3ebcf1e0b8490019e10d7a6d8504c2afd
created: 2026-11-23
last_updated: 2026-11-23
---

# Rating — Component Spec

## Purpose

Rating is a row of stars that picks a whole score from 1 to `max` (5 by default), the way a customer rates a support conversation (CSAT) or a product review. It renders as a native radio group, one radio per star named "1 star" … "5 stars", so it is one tab stop, the arrow keys move the score and the value posts with a form. With `readonly` it becomes a display of a score, including a fractional average rounded to the nearest half star (4.5 shows four and a half stars), announced as one image ("Rated 4.5 out of 5").

## When to use

- Ask a customer to rate a support conversation, an answer or a resolved ticket on a 1-to-5 scale (customer satisfaction, CSAT).
- Collect a star score in a review or feedback form, inside a `Field` with a label, a description and a required error.
- Show a stored score or an average of scores as stars in a ticket, a table cell or a review list (`readonly`).

## When NOT to use

- A good / bad (thumbs up / thumbs down) answer → use `ToggleGroup` with two options, or `ChatMessageFeedback` under an AI answer.
- A score on a scale wider than 10 or a continuous value → use `Slider` or `NumberInput`.
- A choice between named options (plans, channels) → use `RadioGroup`.
- A score shown as a number or a bar (NPS breakdown, a meter) → use `StatTile` or `Progress`.

## Related

- `radio-group` — the same native radio pattern, for picking one labelled option instead of a score.
- `toggle-group` — two or three compact options such as good / bad.
- `chat-message-feedback` — thumbs up / thumbs down under an AI chat answer.
- `field` — wraps the rating with its label, description and error; the label names the group.
- `slider` — a number on a wide or continuous scale.

## Best practices

- Name the group: put it in a `Field` with a `Field.Label` (or `Field.Title`), or set `aria-label` on the root ("Rate this conversation").
- Keep `max` at 5 for satisfaction and reviews; scales above 5 are hard to tell apart at a glance.
- Start empty (`0`) when you ask for a rating, so nobody submits a score they did not choose; set `required` when the score is mandatory.
- Set `clearable` when a score is optional, so a person can take it back with the keyboard and a screen reader, not only by reloading.
- Show averages with `readonly`; print the count of ratings beside it in text ("4.5 · 128 reviews"), the stars do not carry it.
- Do not put a rating in a dense table row as an input; show it `readonly` and edit it in a dialog or a detail page.

## Usage

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import Rating from '@aziontech/webkit/rating'

  const score = ref(0)
</script>

<template>
  <Rating
    v-model="score"
    name="satisfaction"
    aria-label="Rate this conversation"
    clearable
  />
  <Rating
    :model-value="4.5"
    readonly
    size="small"
  />
</template>
```

## Props

| Prop        | Type                              | Default    | Required | JSDoc                                                                                                                                            |
| ----------- | --------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `max`       | `number`                          | `5`        | false    | Number of stars, the highest score. Rounded to a whole number and kept between 1 and 10.                                                         |
| `size`      | `'small' \| 'medium' \| 'large'`  | `'medium'` | false    | Star size: 16, 20 or 24 px glyphs in 24, 28 or 32 px targets. `RatingSize`, exported.                                                            |
| `name`      | `string`                          | `''`       | false    | Form field name shared by every star radio; the score submits under it. Empty uses a generated name so the radios still group.                  |
| `readonly`  | `boolean`                         | `false`    | false    | Shows the score instead of asking for it: no radios, the value rounded to the nearest half star, announced as one image.                         |
| `disabled`  | `boolean`                         | `false`    | false    | Disables every star and the clear button; the row shows at 50 % opacity with a not-allowed cursor.                                              |
| `required`  | `boolean`                         | `false`    | false    | Requires a score: sets `aria-required` on the group and `required` on the radios, so a native form blocks an empty submit.                       |
| `invalid`   | `boolean`                         | `false`    | false    | Marks the rating invalid: sets `aria-invalid` on the group and draws the empty stars in the danger mark colour.                                  |
| `clearable` | `boolean`                         | `false`    | false    | Shows a clear button after the stars that resets the score to 0 and moves focus to the first star. Not shown while `readonly`.                   |

`RatingProps` is exported as the named props interface.

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                                                                                                                                                     |
| --------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `number` | `0`     | `update:modelValue` | The score via `defineModel`; `0` means no score. Picking a star emits its whole number (1 … `max`); the clear button emits `0`. Unbound, the rating keeps its own score. As an input a fractional value shows rounded to a whole star; `readonly` shows it to the nearest half. |

## Events

_none_

## Slots

_none_

## States

- Visual states: `default`, `hover` (preview), `focus-visible`, `checked`, `disabled`, `invalid`, `readonly`
- Root: `role="radiogroup"` as an input, `role="img"` while `readonly`; `data-size` mirrors `size`; `data-readonly`, `data-disabled`, `data-required` and `data-invalid` mirror the state (the `Field` state included); `data-preview` while a fine pointer hovers a star.
- Each star: `data-fill="full" | "half" | "empty"` on its glyph; `half` only while `readonly`. A filled or half star draws in `var(--warning-mark)`, an empty star in `var(--text-muted)`, or `var(--danger-mark)` while invalid. Each star label carries `data-checked` on the star whose value is the score.
- Hover preview: on a fine pointer (`pointerType === 'mouse'`), hovering star `n` fills stars 1 … `n` until the pointer leaves the row; it never changes the model, and it does not run while `disabled` or `readonly`. Touch and pen get no preview: the tap selects.
- Picking the selected star again keeps the score (native radio); the score is cleared only by the clear button.
- While `readonly`, `required`, `invalid`, `name` and `clearable` have no effect: the display renders no inputs and no clear button, and sets no `aria-required` / `aria-invalid`; `disabled` only dims it.
- Not states of this component: `loading`, `empty` and `error` (the `Field.Error` carries the message).

## Motion & Animations

| Trigger                       | Animation / Transition                                       | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ----------------------------- | ------------------------------------------------------------ | ------------------------------------------------- | ------------------------------- |
| fill change (pick, preview)   | `transition-colors duration-fast-02 ease-productive-entrance` on each star glyph | inline (matches catalog)                          | `motion-reduce:transition-none` |

The clear button is an `IconButton` (`variant="ghost"`, `size="small"` at every rating size, icon `az az-x`) and keeps its own transitions.

## Tokens

| Region                          | Token (DESIGN.md)                                       |
| ------------------------------- | ------------------------------------------------------- |
| filled and half star            | `var(--warning-mark)`                                   |
| empty star                      | `var(--text-muted)`                                     |
| empty star (invalid)            | `var(--danger-mark)`                                    |
| star target (hover)             | `var(--bg-hover)`                                       |
| star target radius              | `var(--shape-button)`                                   |
| gap between stars and clear     | `var(--spacing-2xs)`                                    |
| focus ring                      | `var(--ring-color)` offset on `var(--bg-canvas)`        |
| disabled                        | 50 % opacity on the whole row, `cursor-not-allowed` (as `radio-group-item` and `checkbox`) |
| star glyph size (small / medium / large) | `text-[1rem]` / `text-[1.25rem]` / `text-[1.5rem]` with `leading-none` (icon font size, as `doc-card`) |
| star target (small / medium / large / coarse) | `size-6` / `size-7` / `size-8` / `pointer-coarse:size-11` |

`--warning-mark` is the amber the theme documents for an icon on a surface at the icon target (APCA Lc 45, WCAG 3:1) on `--bg-canvas`, `--bg-surface` and `--bg-surface-raised` in both themes; `--primary` is documented only as a solid mark (Lc 30), so it is not used for the star glyph. Colour is never the only cue: a filled star is a filled glyph (`az-star-fill`), an empty one an outline (`az-star`), a half star `az-star-half-fill`.

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `ring-2 ring-(--ring-color) ring-offset-1 ring-offset-(--bg-canvas)` on the focused star's target (the native radio inside is invisible).
- Keyboard map (APG radio group, native radios sharing one `name`): `Tab` enters on the checked star, or, when none is checked, on the first star (`Shift+Tab` enters on the last), and the next `Tab` moves to the clear button when shown, then out; `ArrowRight` / `ArrowDown` select the next star and `ArrowLeft` / `ArrowUp` the previous one, wrapping at the ends, all handled by the browser (it swaps `ArrowLeft` / `ArrowRight` under `dir="rtl"`); the component adds no key handling of its own; `Space` selects the focused star; `Enter` / `Space` on the clear button reset the score to 0 and move focus to the first star.
- Clear affordance: a separate `IconButton` ("Clear rating"), chosen over "click the selected star again" because a native radio cannot be unchecked from the keyboard, a toggle on re-click is not announced to screen readers and surprises people who double-click; the button is named, focusable and disabled while the score is 0.
- ARIA: root `role="radiogroup"` with `aria-labelledby` (the `Field` label ids) or the consumer's `aria-label`, `aria-describedby` (the `Field.Description` / `Field.Error` ids), `aria-required` and `aria-invalid`; each star is a native `type="radio"` input with `aria-label` "1 star" … "5 stars"; the glyphs are `aria-hidden`. While `readonly` the root is `role="img"`, renders no inputs, and is named by `aria-labelledby`: the `Field` label ids (when inside a `Field`) followed by a visually hidden summary, "Rated 4.5 out of 5" ("Not rated" at 0), whose `{value}` is the half-rounded value the stars show (4.37 reads "4.5"); a consumer `aria-label` is not used in this mode, put context in the text beside it.
- Contrast: star glyphs in documented icon pairs (`--warning-mark`, `--text-muted`, `--danger-mark` on the surfaces); filled and empty differ in shape as well as colour. The disabled row (50 % opacity) is an inactive control, exempt from WCAG 1.4.3 / 1.4.11, as in `radio-group` and `checkbox`.
- `motion-reduce:transition-none` on the star glyph transition.
- Touch target: each star target is 24, 28 or 32 px on a fine pointer and grows to 44 × 44 px on `pointer: coarse` (decision TT01, the row widens); the clear button follows `IconButton`'s coarse-pointer target.

## Internationalization

| Key             | English source                                          | Override prop |
| --------------- | ------------------------------------------------------- | ------------- |
| `rating.star`   | `{count} star` (one) / `{count} stars` (other)          | —             |
| `rating.value`  | `Rated {value} out of {max}`                            | —             |
| `rating.empty`  | `Not rated`                                             | —             |
| `rating.clear`  | `Clear rating`                                          | —             |

- Formatting: plurals through `Intl.PluralRules` (the `t()` plural form) with the locale from `ConfigProvider`; `{value}` and `{max}` through `Intl.NumberFormat` (at most one fraction digit, so 4.5 reads "4,5" in pt-BR). Overrides go through `ConfigProvider` messages.

## Right-to-left

- Layout: a flex row that follows `dir`, so star 1 sits at the inline start and stars fill from the inline start; the clear button sits at the inline end (`gap-*`, no physical sides).
- Icons: `az-star` and `az-star-fill` are symmetric; `az-star-half-fill` (left half filled) is mirrored with `rtl:-scale-x-100`, so the filled half faces the inline start.
- Keyboard: native radios — `ArrowRight` / `ArrowDown` move to the next star and `ArrowLeft` / `ArrowUp` to the previous one; under `dir="rtl"` the browser swaps `ArrowLeft` / `ArrowRight`, so the key that points toward the inline end still raises the score.
- User data: none.

## Responsive

- Container queries: none: fixed size.
- Narrow (≤ 640 px or a narrow container): the row does not wrap; 10 large stars on a coarse pointer are 440 px plus the clear button, so keep `max` at 5 on phones.
- Touch: targets ≥ 24 px, 44 px on `pointer: coarse`; the hover preview is fine-pointer only and touch selects on tap with no preview.
- Reflow: no horizontal scroll at 320 px and 200 % zoom with `max` 5 (5 × 44 px + the clear button).

## Performance

- Bundle budget: `rating` within 5.8 KB gzip (measured 5.55 KB plus headroom) (it bundles `IconButton`, about 2.7 KB, plus `useFieldControl` and `useTranslate`).
- Runtime budget: none: at most 10 native inputs.
- Heavy parts: none.

## Examples

- Default — an empty, `clearable` rating bound with `v-model` and an `aria-label`, the score printed beside it.
- Sizes — every `size` value side by side.
- Readonly — averages shown with `readonly` (4.5, 3, 0) with their review counts in text. Justified: display mode is the second job of the component (scores and averages in tickets and lists).
- Disabled — a rating with a score, `disabled`.
- InField — inside a `Field` with a `Field.Label`, a description, `required` and an error after an empty submit. Justified: shows the Field wiring (group name, description, required, invalid) of a CSAT survey.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/primitives/animations/animate.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Variants + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Variants/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
