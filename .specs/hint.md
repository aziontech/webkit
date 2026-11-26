---
name: hint
category: input
structure: monolithic
status: implemented
spec_version: 9
checksum: 09f5bc6b7ae466c93756eeed4a5691b24ca76037678a6652b21d60a4b8e02dbf
created: 2026-08-10
last_updated: 2026-11-23
---

# Hint — Component Spec

## Purpose

Click-open note (a "toggletip") on a small muted `az az-circle-info` glyph. A click, a tap, `Enter` or `Space` on the glyph opens a small panel, anchored below the glyph and aligned to its start, that holds one to three sentences and an optional "Learn more" link to the docs. It is level C of the in-product help standard: the way to attach a "why does this matter?" note to a field name, a setting or a column header without spending a line of vertical space on it. `Field.Label`, `SettingsRow` and `SettingsGroup` render it from their own `hint` prop.

## When to use

- A field, switch or setting whose name is clear but whose consequence is not (what "Sensitive" does to a stored value).
- A note of one to three sentences that is useful but not needed to complete the task, optionally with a link to the docs page that explains more.
- Beside a label, a heading, a stat or a column header, where a permanent line of helper text would add noise.

## When NOT to use

- Information needed to fill the field → `field-description`, which stays on screen.
- Naming a control or expanding an abbreviation → `tooltip`.
- Help longer than three sentences, steps or several links → `help-panel`.
- Validation messages → `field-error`.

## Related

- `field-description` — level A, the default: a short muted line under the field that is always visible.
- `tooltip` — level B: names a control or expands an abbreviation in a few words (about 80 characters at most).
- `help-panel` — level D: page-level help in the console's tools region, opened from an "Info" link after the page title.
- `popover` — the overlay Hint composes; use it for interactive content.
- `Field.Label`, `settings-row`, `settings-group` — render a Hint from their `hint` prop.
- `/webkit-in-product-help` — the consumer skill that picks the level of help.

## Best practices

- One to three plain sentences, each ending in a period.
- Place the glyph 4px after the label text, on the same line. Never at the end of the row, never on its own line.
- One Hint per label. Never stack two glyphs, and never put a Hint inside a Tooltip or another Hint.
- Never draw a typed "?" or a boxed icon button as a help trigger; Hint is the only help glyph.
- Add `href` when a docs page explains more; leave `linkLabel` empty for the localized "Learn more".
- Never hide required information behind a Hint.

## Usage

```vue
<script setup>
  import Hint from '@aziontech/webkit/hint'
</script>

<template>
  <Hint
    content="Values are encrypted at rest and never displayed again after saving."
    href="https://example.com/docs/variables"
  />
</template>
```

## Props

| Prop        | Type                                              | Default    | Required | JSDoc                                                                                                          |
| ----------- | ------------------------------------------------- | ---------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `content`   | `string`                                          | `''`       | true     | The note, one to three sentences, shown when the glyph is clicked and read as the glyph's description.         |
| `side`      | `'top' \| 'bottom' \| 'start' \| 'end' \| 'auto'` | `'bottom'` | false    | Side of the glyph the note opens on, flipped when it does not fit; `'auto'` picks the side with the most room. |
| `href`      | `string`                                          | `''`       | false    | Docs URL linked under the note; empty renders no link.                                                         |
| `linkLabel` | `string`                                          | `''`       | false    | Text of the docs link; empty uses the locale catalog (`Learn more`).                                           |
| `target`    | `'_blank' \| '_self'`                             | `'_blank'` | false    | Where the docs link opens.                                                                                     |
| `ariaLabel` | `string`                                          | `''`       | false    | Accessible name of the glyph button; empty uses the locale catalog (`More information`).                       |

Types (exported from `@aziontech/webkit/hint`): `HintSide` is `'top' | 'bottom' | 'start' | 'end'`; `HintTarget` is `'_blank' | '_self'`. `start` and `end` follow the text direction. The panel always aligns to the glyph's start edge.

## v-model

| Model          | Type      | Default | Emits         | Notes                                                                                                                                                            |
| -------------- | --------- | ------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `false` | `update:open` | Open state via `defineModel('open')`. Fires on every open and close: glyph click, `Enter`, `Space`, `Esc`, outside click. Unbound, the Hint keeps its own state. |

## Events

_No events of its own: `update:open` comes from `v-model:open` (see v-model above)._

## Slots

| _none_ | — | — |

## States

- Visual states of the glyph: `default`, `hover`, `focus-visible`, open (`aria-expanded="true"`, the glyph takes `var(--text-default)`).
- `data-state` values (on the root, owned by `Popover`): `open` | `closed`.
- `data-side` (on the root and the panel, owned by `Popover`): the side the panel landed on.

## Motion & Animations

| Trigger                     | Animation / Transition                    | Token  | Reduced-motion fallback         |
| --------------------------- | ----------------------------------------- | ------ | ------------------------------- |
| hover / focus (glyph color) | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |

The panel's open/close motion belongs to `popover` and is specified there.

## Tokens

| Region                    | Token (TOKENS.md)                                                        |
| ------------------------- | ------------------------------------------------------------------------ |
| glyph typography          | `.text-body-xs`                                                          |
| glyph color (rest)        | `var(--text-muted)`                                                      |
| glyph color (hover, open) | `var(--text-default)`                                                    |
| glyph radius              | `var(--shape-button)`                                                    |
| focus ring                | `var(--ring-color)`                                                      |
| panel surface, border     | owned by `popover` (`var(--bg-surface-raised)`, `var(--border-default)`) |
| panel padding             | `var(--spacing-sm)`                                                      |
| panel gap                 | `var(--spacing-xs)`                                                      |
| note typography, color    | `.text-body-sm`, `var(--text-default)`                                   |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The trigger is a native `<button type="button">` named by `ariaLabel` (fallback `More information`, from the locale catalog). It carries `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls` (from `Popover.Trigger`).
- The note is also in an always-rendered `hidden` element the button points at with `aria-describedby`, so a screen reader reads the note on focus without opening the panel.
- The panel is `role="dialog"` (non-modal), named by the trigger. It opens on activation only, never on hover.
- Keyboard map: `Tab` focuses the glyph; `Enter` or `Space` opens and closes the note; opening moves focus to the docs link when there is one; `Esc` closes and returns focus to the glyph. A second click or an outside click also closes it.
- The click default is prevented, so a Hint inside a `<label>` never toggles or focuses the labelled control.
- The glyph is decorative (`aria-hidden="true"`); the focus ring uses `var(--ring-color)`.
- Touch target: a `[data-slot=touch-target]` span extends the 20 px glyph's hit area to 24 px, and to 44 px on a coarse pointer.

## Internationalization

- The glyph's fallback name is `hint.label` (`More information`, `Mais informações`, `Más información`); the link's fallback text is `Link`'s `link.label` (`Learn more`).
- `content` and `linkLabel` come translated from the consumer.

## Examples

- Default
- Placements — composite example over the `side` axis, rendering the four sides side by side (closed; click each glyph to open it). Justified because `side` is the component's only variant axis.
- With link — a field label with a Hint whose note links to the docs (`href`). Justified because the link is the one optional part of the panel.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=label]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
