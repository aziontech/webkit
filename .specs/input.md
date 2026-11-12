---
name: input
category: inputs
structure: monolithic
status: implemented
spec_version: 2
checksum: d1926dbaa37dcee7a36cc830673cf9a92d070307649e5b84b8a617ab18dc4d0b
created: 2026-05-22
last_updated: 2026-11-12
---

# Input Text — Component Spec

## Purpose

Single-line text input for forms and inline editing. Renders a bordered field with optional leading/trailing icon slots. Visual states (hover, focus, filled) are driven by native CSS pseudo-classes, not props. The component is the field only — labels, helper text, and error messages live in the wrapping form-field layer.

Aligned with Figma frame `562:6774` (Webkit / Input).

## When to use

- Capture a single line of free-form text (names, titles, search terms).

## When NOT to use

- The value spans multiple lines → use `textarea`.
- The value is strictly numeric → use `number-input`.
- The user must choose from a fixed set → use `select` / `multi-select`.

## Related

- `textarea` — multi-line free text.
- `number-input` — numeric input with stepper semantics.
- `field` — wraps this input with label, description and error; the input reads its id, `aria-describedby` and state from it.

## Best practices

- Prefer the `field-*` wrapper when you need a label, helper text, or validation message.
- Set an appropriate `type`/`inputmode` for the content (email, url, …).
- Set `monospace` on a field whose value is code-like: a CLI command, an ID, a token, a hash, a path. Pair it with `:spellcheck="false"`.
- A read-only command or ID the user copies: `readonly` + `monospace` inside an `InputGroup` with a `CopyButton`, and a description saying why it cannot change.
- Do not set `monospace` on prose values (names, titles, e-mails, domains typed by the user).
- Do not restyle a read-only field (dashed border, transparent fill): it is the same filled field, made non-editable; the reason belongs in the field's description.

## Usage

```vue
<script setup>
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const domain = ref('')
</script>

<template>
  <Input
    v-model="domain"
    placeholder="example.com"
    size="medium"
    aria-label="Domain"
  >
    <template #iconLeft>
      <i class="pi pi-globe" />
    </template>
  </Input>
</template>
```

## Props

| Prop           | Type                             | Default     | Required | JSDoc                                                                                                                                                                                                                                                   |
| -------------- | -------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `modelValue`   | `string`                         | `''`        | false    | Two-way bound value of the field.                                                                                                                                                                                                                       |
| `placeholder`  | `string`                         | `''`        | false    | Placeholder shown when the field is empty.                                                                                                                                                                                                              |
| `type`         | `'text' \| 'email' \| 'number'`  | `'text'`    | false    | Native input type. Restricted to single-line variants the field treats identically.                                                                                                                                                                     |
| `maxLength`    | `number \| undefined`            | `undefined` | false    | Native `maxlength` — maximum number of characters allowed.                                                                                                                                                                                              |
| `autocomplete` | `string \| undefined`            | `undefined` | false    | Native `autocomplete` token on the `<input>` (e.g. `email`, `username`, `off`). Omitted when unset.                                                                                                                                                     |
| `spellcheck`   | `boolean \| undefined`           | `undefined` | false    | Native `spellcheck` on the `<input>`. Set `false` for slugs, IDs and domains. Omitted when unset: the default is an explicit `undefined`, because Vue would otherwise cast an absent boolean to `false` and render `spellcheck="false"` on every field. |
| `size`         | `'small' \| 'medium' \| 'large'` | `'medium'`  | false    | Size token; affects height only — padding and typography are constant. Heights: small=28px, medium=32px, large=40px.                                                                                                                                    |
| `disabled`     | `boolean`                        | `false`     | false    | Disables interaction and applies disabled tokens.                                                                                                                                                                                                       |
| `readonly`     | `boolean`                        | `false`     | false    | Marks the field read-only: value is visible, focusable and copyable but not editable. Keeps the filled field (surface and solid border) with no hover border and a default cursor (`data-readonly`); distinct from the disabled field.                  |
| `required`     | `boolean`                        | `false`     | false    | Marks the field as required; sets native `required` and `aria-required`. Visual indicator (asterisk) is owned by the wrapping form-field, not by this component.                                                                                        |
| `invalid`      | `boolean`                        | `false`     | false    | Applies the invalid border + ring tokens and sets `aria-invalid`.                                                                                                                                                                                       |
| `monospace`    | `boolean`                        | `false`     | false    | Sets the value and placeholder in the monospace code face (`.text-label-code-sm`) for CLI commands, IDs, tokens and hashes (`data-monospace`).                                                                                                          |

## Events

| Event               | Payload  | Notes                                               |
| ------------------- | -------- | --------------------------------------------------- |
| `update:modelValue` | `string` | Emitted on native `input` event with the new value. |

## Slots

| Slot        | Purpose                                                   | Notes                                              |
| ----------- | --------------------------------------------------------- | -------------------------------------------------- |
| `iconLeft`  | Leading icon rendered inside the field, before the input. | Hidden from assistive tech (`aria-hidden="true"`). |
| `iconRight` | Trailing icon rendered inside the field, after the input. | Hidden from assistive tech (`aria-hidden="true"`). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `filled`, `disabled`, `readonly`, `invalid`
- Password managers: the `<input>` carries `data-1p-ignore`, `data-lpignore`, `data-bwignore` and `data-form-type="other"` unless it is a credential or identity field — `autocomplete` set to any token but `off`, or `type="email"`. A read-only field always carries them. This keeps 1Password, LastPass, Bitwarden and Dashlane from offering a sign-in on ordinary fields (names, IDs, searches) while login fields stay fillable. A consumer attr (e.g. `data-1p-ignore="false"`) wins.
- `data-readonly` mirrors the `readonly` prop: a read-only field keeps the editable field's fill (`var(--bg-surface)`) and solid `var(--border-default)` border, as the design sample draws it; it only drops the hover border and takes a default cursor. The value keeps `var(--text-default)` (readable and copyable, unlike `disabled`) and the field stays focusable. Why the value cannot change is said by the field's description, not by a different chrome.
- `data-monospace` mirrors the `monospace` prop: the value and the placeholder render in `.text-label-code-sm` instead of `.text-label-sm`.
- `data-size` mirrors the `size` prop
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors the `invalid` prop
- `data-required` mirrors the `required` prop; drives the warning-border treatment
- `data-has-icon-left` / `data-has-icon-right` mirror slot presence (driven by `$slots.iconLeft` / `$slots.iconRight`), read at render time: an icon slot passed behind a `v-if` adds or removes its icon box when the condition changes, never leaving an empty box behind
- `filled` is detected via the native `:not(:placeholder-shown)` selector — no JS state

## Motion & Animations

| Trigger                       | Animation / Transition                    | Token  | Reduced-motion fallback         |
| ----------------------------- | ----------------------------------------- | ------ | ------------------------------- |
| state change (border/ring/bg) | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |

## Tokens

| Region                               | Token (DESIGN.md)                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| typography                           | `.text-label-sm`                                                                                                    |
| typography (`monospace`)             | `.text-label-code-sm`                                                                                               |
| surface                              | `var(--bg-surface)`                                                                                                 |
| surface (disabled)                   | `var(--bg-disabled)`                                                                                                |
| text                                 | `var(--text-default)`                                                                                               |
| text (placeholder/muted)             | `var(--text-muted)`                                                                                                 |
| text (disabled)                      | `var(--text-disabled)`                                                                                              |
| border (default)                     | `var(--border-default)`                                                                                             |
| border (hover)                       | `var(--border-strong)`                                                                                              |
| border (invalid)                     | `var(--danger-border)`                                                                                              |
| border (required)                    | `var(--warning-border)`                                                                                             |
| ring (focus)                         | `var(--ring-color)`                                                                                                 |
| ring offset (focus)                  | `var(--input-ring-offset, var(--bg-canvas))` — host-tunable via the inherited `--input-ring-offset` custom property |
| spacing (horizontal padding)         | `var(--spacing-sm)`                                                                                                 |
| spacing (gap between icon and input) | `var(--spacing-xs)`                                                                                                 |
| shape                                | `var(--shape-elements)`                                                                                             |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2`, with the offset color resolving `var(--input-ring-offset, var(--bg-canvas))` — applied via `focus-within` on the field wrapper so the ring covers the whole control including icon slots. A host that places the field on a surface other than the canvas (a raised popover, a drawer) declares `--input-ring-offset` on any ancestor; custom properties inherit, so one declaration retunes the ring gap of every field inside it (this is how `calendar`'s fields panel matches its raised popover).
- Keyboard map: `Tab` focuses the input; standard text-editing keys apply.
- Direction: the `<input>` renders `dir="auto"` so a value typed in another script keeps its own direction inside right-to-left UI; a `dir` attribute overrides it.
- ARIA: `aria-invalid` is bound to the `invalid` prop; `aria-required` to the `required` prop; icon slots are `aria-hidden="true"` (decorative).
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including disabled state.
- `motion-reduce:transition-none` on every transition-bearing class.
- Touch target ≥40×40 px on `size="large"`; smaller sizes are intended for dense layouts where the wrapping label area extends the hit zone.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the icon slots are the consumer's and do not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: the `<input>` renders `dir="auto"`; a `dir` attribute overrides it.

## Examples

- Default
- Sizes — composite story rendering all three sizes side by side (canonical composite example).
- Icons — composite story showing the `iconLeft` slot, the `iconRight` slot, and both combined. Justification: documents the slot API surface from the Figma component (`hasIconLeft`/`iconLeft`, `hasIconRight`/`iconRight`) in a single browsable view.
- Filled — justification: pre-populated `modelValue` shows the filled visual state, which is implicit (no prop) and not visible from the Default story.
- Invalid — justification: documents the `invalid` visual treatment, which is a top-level prop with distinct token bindings.
- Email — justification: documents `type="email"` (native browser keyboard / validation surface) since the `type` prop is restricted and only two values matter visually.
- MaxLength — justification: documents `maxLength` as a hard character cap; behavior is invisible from props alone and only observable while typing.
- Disabled
- ReadOnly — justification: the `readonly` look (filled, non-editable) is a top-level prop and not visible from the other stories; shown with `monospace` as a copyable CLI command beside a read-only ID.

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
- Do not add examples beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
