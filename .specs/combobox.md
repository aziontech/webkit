---
name: combobox
category: inputs
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 845f7bd2ce1d49a6eec1be8d5227bbd935359997401ec395e2901e2022bd93b2
created: 2026-11-11
last_updated: 2026-11-11
---

# Combobox — Component Spec

## Purpose

A text field with a list of suggestions under it: typing filters the options, picking one fills the field, and a value that is not in the list is accepted as typed. It holds one string value, after the design sample's `ComboboxInput` and the ARIA 1.2 combobox pattern. It differs from `Select`, whose value must be one of its options and whose trigger is a button, and from `Command`, which runs commands from a palette instead of filling a form field.

## When to use

- A form field whose usual values are known but a new one is valid: an environment variable name, a header, a path, a region tag, a branch.
- A long option list the user would rather type than scroll, with the list as a reminder.
- Options that come from the server as the user types (`search` event, `loading`, `filter: false`).
- Suggestions grouped by origin (Recent, Suggested, System) in one field.

## When NOT to use

- The value must be one of a short fixed list → use `select` (or `radio-group` for 2–5 visible choices).
- Several values at once → use `multi-select`.
- Searching and running commands or jumping to a page → use `command`.
- Filtering a collection by properties → use `property-filter`.
- Key/value pairs or tags → use `attribute-editor` or `tag-editor` (their key cells may hold a Combobox).

## Related

- `select` — closed list, button trigger, no free entry.
- `input` — the field Combobox is built on; use it alone when there are no suggestions.
- `field` — label, description and error around the Combobox; it reads id, invalid, disabled and required from it.
- `command` — palette of actions, not a form value.
- `property-filter` — token-based filtering with the same listbox look.

## Best practices

- Put the Combobox in a `Field` so it gets a visible label; use `ariaLabel` only where no label can be shown.
- Keep `allowCustom` on only when a new value is genuinely valid; with it off, the field restores the last valid value when the typed text matches nothing.
- Give options a `description` for what tells them apart (a scope, a count), not a second copy of the label.
- For server data set `filter` to `false`, listen to `search` (debounce on your side), and drive `loading` from the request.
- Validate the committed value (`update:modelValue`) in the form, not each keystroke; `search` is for suggestions only.
- Use `group` when options come from distinct sources; keep group titles one or two words.

## Usage

```vue
<script setup>
  import Combobox from '@aziontech/webkit/combobox'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const name = ref('')
  const options = [
    { value: 'API_URL', description: 'Suggested' },
    { value: 'NODE_ENV', description: 'System' },
    { value: 'LOG_LEVEL' }
  ]
</script>

<template>
  <Field>
    <Field.Label>Variable name</Field.Label>
    <Combobox
      v-model="name"
      :options="options"
      placeholder="Search or type a name"
      clearable
    />
    <Field.Description>Pick a known variable or type a new one.</Field.Description>
  </Field>
</template>
```

## Sub-components

_none_ — one `.vue` file. The list is rendered by the component itself (teleported to `body`, positioned with `usePlacement`); options are data, rendered through the optional `option` slot.

## Props

| Prop          | Type                             | Default    | Required | JSDoc                                                                                                      |
| ------------- | -------------------------------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `modelValue`  | `string`                         | `''`       | false    | The committed value. Supports v-model. Changes on pick, Enter, Tab, blur and clear, not on each keystroke. |
| `options`     | `ComboboxOption[]`               | `[]`       | false    | Suggestions: `{ value, label?, description?, group?, disabled? }`.                                         |
| `placeholder` | `string`                         | `''`       | false    | Placeholder of the field.                                                                                  |
| `ariaLabel`   | `string`                         | `''`       | false    | Accessible name when no `Field` label names the field.                                                     |
| `size`        | `'small' \| 'medium' \| 'large'` | `'medium'` | false    | Size token, as `Input`: 28 / 32 / 40 px.                                                                   |
| `allowCustom` | `boolean`                        | `true`     | false    | Accepts a typed value that matches no option, offered as `Use "…"`.                                        |
| `filter`      | `boolean`                        | `true`     | false    | Filters `options` by the typed text. Turn off when the server filters on `search`.                         |
| `clearable`   | `boolean`                        | `false`    | false    | Shows a clear button while the field has a value.                                                          |
| `loading`     | `boolean`                        | `false`    | false    | Shows a spinner and the loading row while options are fetched.                                             |
| `emptyText`   | `string`                         | `''`       | false    | Text of the list when nothing matches. Empty uses the locale catalog.                                      |
| `disabled`    | `boolean`                        | `false`    | false    | Disables the field.                                                                                        |
| `readonly`    | `boolean`                        | `false`    | false    | Shows the value without the list or editing.                                                               |
| `required`    | `boolean`                        | `false`    | false    | Marks the field required (`aria-required`).                                                                |
| `invalid`     | `boolean`                        | `false`    | false    | Marks the field invalid (`aria-invalid`, danger border).                                                   |

`ComboboxOption`: `value: string` (committed and matched), `label?: string` (shown instead of the value), `description?: string` (muted, at the end of the row), `group?: string` (rows with the same group sit under one title, in first-seen order), `disabled?: boolean`.

## Events

| Event               | Payload  | Notes                                                                      |
| ------------------- | -------- | -------------------------------------------------------------------------- |
| `update:modelValue` | `string` | v-model: the committed value.                                              |
| `search`            | `string` | The typed text, on each keystroke while the list is open (server filters). |
| `create`            | `string` | A value that matches no option was committed (`allowCustom`).              |

## Slots

| Slot     | Scope                                                            | Notes                                   |
| -------- | ---------------------------------------------------------------- | --------------------------------------- |
| `option` | `{ option: ComboboxOption, active: boolean, selected: boolean }` | Replaces the content of one option row. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `open`, `disabled`, `readonly`, `invalid`, `loading`, empty list
- `data-state` on the root: `open` | `closed`
- `data-disabled`, `data-invalid` on the root mirror the resolved props (prop or `Field`)
- Option rows: `data-active` (the keyboard/pointer highlight), `data-selected` (equals the committed value), `data-disabled`
- The field shows the selected option's `label` when the value equals an option's `value`, otherwise the value itself

## Motion & Animations

| Trigger          | Animation / Transition                    | Token                           | Reduced-motion fallback         |
| ---------------- | ----------------------------------------- | ------------------------------- | ------------------------------- |
| list opens       | `animate-popup-scale-in`                  | semantic (150ms · cubic-bezier) | `motion-reduce:animate-none`    |
| list closes      | `animate-popup-scale-out`                 | semantic (110ms · cubic-bezier) | `motion-reduce:animate-none`    |
| option highlight | `transition-colors duration-150 ease-out` | inline (matches catalog)        | `motion-reduce:transition-none` |
| loading          | `Spinner`                                 | component                       | `Spinner` handles it            |

## Tokens

| Region                      | Token (DESIGN.md)                                                       |
| --------------------------- | ----------------------------------------------------------------------- |
| field                       | the `Input` tokens (surface, border, ring, sizes)                       |
| list surface                | `var(--bg-surface-raised)`, `var(--border-default)`, `var(--shadow-xs)` |
| list shape                  | `var(--shape-elements)`                                                 |
| list padding / row gap      | `var(--spacing-xxs)`                                                    |
| option text                 | `.text-label-sm`, `var(--text-default)`                                 |
| option description          | `.text-body-sm`, `var(--text-muted)`                                    |
| option active / selected    | `var(--bg-hover)` / `var(--bg-selected)`                                |
| group title, empty, loading | `.text-label-sm` / `.text-body-sm`, `var(--text-muted)`                 |
| layer                       | `var(--z-input-overlay)`                                                |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- ARIA 1.2 combobox: the `<input>` has `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls` (the listbox id) and `aria-activedescendant` (the highlighted option); the list is `role="listbox"`, rows are `role="option"` with `aria-selected` and `aria-disabled`; grouped rows sit in `role="group"` named by their title (`aria-labelledby`).
- Keyboard map: focus or `ArrowDown` opens the list; `ArrowDown`/`ArrowUp` move the highlight (wrapping, skipping disabled rows); `Home`/`End` move it to the first/last option while the list is open (otherwise the caret moves); `Enter` commits the highlighted option, or the typed text when nothing is highlighted (`allowCustom`); `Escape` closes the list, and a second `Escape` restores the last committed text; `Tab` commits the highlighted option or the typed text and moves on; `Alt+ArrowUp` closes.
- Focus stays in the input the whole time; pointer clicks on rows do not move focus (`mousedown.prevent`).
- A polite status region announces the number of options after each change of the typed text ("3 options"), "No matches" and "Loading options"; it is visually hidden.
- The clear button is a real button with an accessible name ("Clear"), reachable by Tab only while there is a value, and returns focus to the input.
- `Field` integration through `Input`: label `for`/`id`, `aria-describedby`, `aria-invalid`, `aria-required`, disabled.
- Contrast: option text and muted descriptions ≥4.5:1 on `--bg-surface-raised` in both themes; the active row is marked by its fill and `aria-activedescendant`, never colour alone for selection (a check icon marks the selected row).
- Touch targets: rows are 32 px tall, 44 px on `pointer: coarse`.

## Internationalization

| Key                    | English source                                | Override prop |
| ---------------------- | --------------------------------------------- | ------------- |
| `combobox.empty`       | `No matches`                                  | `emptyText`   |
| `combobox.loading`     | `Loading options`                             | —             |
| `combobox.useValue`    | `Use "{value}"`                               | —             |
| `combobox.clear`       | `Clear`                                       | —             |
| `combobox.suggestions` | `Suggestions`                                 | —             |
| `combobox.count`       | `{count} option` / `{count} options` (plural) | —             |

- Formatting: plural rules through the locale catalog (`Intl.PluralRules`); matching is case- and accent-insensitive with `String.prototype.normalize('NFD')` and `toLocaleLowerCase(locale)`.

## Right-to-left

- Layout: logical utilities only (`ps-`/`pe-`, `text-start`, `ms-auto`); the list anchors at `bottom-start` and mirrors.
- Icons: the search glyph and the check mark are not mirrored.
- Keyboard: arrows are vertical, no change under rtl; `Home`/`End` keep their meaning.
- User data: option labels and the field value render with `dir="auto"` / `<bdi>`, so Latin identifiers inside rtl text keep their order.

## Responsive

- Container queries: none; the field fills its container and the list is at least as wide as the field (`matchTriggerWidth` floor, may grow to the longest row within the viewport).
- Narrow (≤ 640 px): the list flips above the field when there is no room below, and rows truncate with an ellipsis.
- Touch: rows grow to 44 px on `pointer: coarse`; no hover-only affordance (the highlight follows the pointer and the keyboard).
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: see `.size-limit.json` entry `combobox` (Input, Spinner and usePlacement included).
- Runtime budget: 1,000 options filter and render in < 50 ms per keystroke; the list renders only the matches.
- Heavy parts: none; long server lists should be paged by the server (`search`).

## Stories (Storybook)

- Default — a Field-wrapped Combobox of variable names with descriptions and free entry.
- Grouped — options with `group` (Recent / Suggested).
- Server — `filter: false`, `search` and `loading` driving a fake request.

Justification: Combobox has no `kind`; `size` is shown in Default's controls. Grouped and Server show the two data shapes a consumer must wire differently.

## Decisions and open questions

- **Commit on leave, not on each keystroke.** The value changes on pick, Enter, Tab, blur and clear; `search` carries the keystrokes. Forms validate a stable value and `Escape` can restore it. The design sample wrote on each keystroke; its visible design is kept.
- **The field shows the label** of the matching option, the value otherwise. The sample shows the value with the label muted beside it; here the row shows `label ?? value` with `description` muted, which covers both.
- **Opens on focus** like the sample, so the suggestions are visible without a key press.
- **No virtualisation.** Very long lists go through server filtering.

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
