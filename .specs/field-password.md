---
name: field-password
category: inputs
structure: monolithic
status: approved
spec_version: 1
checksum: 5da97f726db4f134471c14bc37e81f0a748571ba8d1bc6a5402fce3d60afd66c
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-3212&m=dev
  node_id: 2027:3212
created: 2026-06-17
last_updated: 2026-08-03
---

# Field Password — Component Spec

## Purpose

Form field for password input that composes `Label`, `InputPassword`, and `HelperText` into a single vertical stack with consistent spacing. Use it whenever a password input needs a visible label or helper/error message — login, sign-up, and password-change forms. Acts as the canonical wrapper for `InputPassword` in form contexts, mirroring the `FieldText` pattern.

It also owns the **password-requirements row**: a captioned, wrapping set of rule chips rendered under the field, one chip per entry of the `requirements` array, each switching to a satisfied treatment (check glyph + success tokens) as soon as the bound value satisfies that entry's `test`. This is the "strength meter" surface that `InputPassword` deliberately does not own — the bare input stays the field only. The consumer supplies the **rules**; the field **evaluates** them against the value it already owns, so the chips track what is typed with no recomputation on the consumer's side. This stays inside `.claude/rules/component-states.md`: the rules are the trigger the app supplies, and applying them to the bound value is derived render state, not business logic the field invents.

## Usage

```vue
<script setup>
  import { computed, ref } from 'vue'
  import FieldPassword from '@aziontech/webkit/field-password'

  const password = ref('')

  // The application evaluates the rules; the field only renders them.
  const requirements = computed(() => [
    { label: '8-128 characters', test: /^.{8,128}$/ },
    { label: 'Uppercase letter', test: /[A-Z]/ },
    { label: 'Number', test: /\d/ }
  ])
</script>

<template>
  <FieldPassword
    v-model="password"
    label="Password"
    placeholder="Enter your password"
    helper-text="At least 8 characters."
    autocomplete="new-password"
    :requirements="requirements"
    required
  />
</template>
```

## Props

| Prop                | Type                                            | Default              | Required | JSDoc                                                                                                                                                                                                                                                                                                  |
| ------------------- | ----------------------------------------------- | -------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `modelValue`        | `string`                                        | `''`                 | no       | Two-way bound value of the underlying `InputPassword`.                                                                                                                                                                                                                                                 |
| `label`             | `string`                                        | `''`                 | no       | Text rendered inside the `Label`. When empty, the label row is omitted.                                                                                                                                                                                                                                |
| `placeholder`       | `string`                                        | `''`                 | no       | Placeholder forwarded to the `InputPassword`.                                                                                                                                                                                                                                                          |
| `helperText`        | `string`                                        | `''`                 | no       | Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted **except** when `disabled` is true — in that case the component falls back to a default disabled message so the lock icon always has matching copy.                                                                 |
| `maxLength`         | `number \| undefined`                           | `undefined`          | no       | Native `maxlength` forwarded to the `InputPassword`.                                                                                                                                                                                                                                                   |
| `disabled`          | `boolean`                                       | `false`              | no       | Disables the input and switches the helper to `kind="disabled"` (lock icon).                                                                                                                                                                                                                           |
| `readonly`          | `boolean`                                       | `false`              | no       | Marks the input read-only; value is visible but not editable. Native pass-through.                                                                                                                                                                                                                     |
| `required`          | `boolean`                                       | `false`              | no       | Adds the `Required` tag to the `Label` and sets native `required` + `aria-required` on the input.                                                                                                                                                                                                      |
| `invalid`           | `boolean`                                       | `false`              | no       | Switches the helper to `kind="invalid"` and applies invalid border/ring tokens on the input.                                                                                                                                                                                                           |
| `toggleable`        | `boolean`                                       | `true`               | no       | Forwards to `InputPassword`. When true, renders the visibility toggle on the trailing edge; when false, the field behaves as a plain password input.                                                                                                                                                   |
| `autocomplete`      | `'current-password' \| 'new-password' \| 'off'` | `'current-password'` | no       | Forwarded to the `InputPassword` for password-manager hints. Use `new-password` for sign-up and password-change flows.                                                                                                                                                                                 |
| `inputId`           | `string`                                        | `''`                 | no       | id for the native input; consumed by `Label` via `for` and by `aria-describedby` wiring.                                                                                                                                                                                                               |
| `name`              | `string`                                        | `''`                 | no       | HTML name for the underlying input (form + vee-validate integration).                                                                                                                                                                                                                                  |
| `requirements`      | `PasswordRequirement[]`                         | `() => []`           | no       | Password rules rendered as a wrapping chip row under the field, one chip per entry. Each entry carries a `test` the field evaluates against the current value; a satisfied rule renders the check glyph + success tokens, otherwise the muted treatment. When the array is empty the whole requirements row — caption included — is omitted. |
| `requirementsTitle` | `string`                                        | `'Must contain:'`    | no       | Caption that opens the requirements row and names the group for assistive tech. Rendered only when `requirements` is non-empty.                                                                                                                                                                        |
| `requirementsIcon` | `string` | `'pi pi-check'` | no | Glyph for a satisfied rule chip. |
| `requirementsPendingIcon` | `string` | `''` | no | Glyph for a rule chip not yet satisfied. Empty by default: nothing shows while a rule is being typed, and no box is reserved, so a chip never carries an empty space. The chip does grow when its glyph mounts. In a field with a definite width both guarantees hold together (measured: the input stays at 274.0px through the whole transition, with no empty box). In an auto-width host the field's width is derived from the row's own content, so the growth reaches it (353.4px to 368.0px); giving the field a width is what resolves that, and `contain: inline-size` on the row was tried and rejected because it changed the field's resting width. |

`PasswordRequirement`: `{ label: string; test: RegExp | ((value: string) => boolean); icon?: string; pendingIcon?: string }`

Both glyphs are configurable on two levels: the `requirements*Icon` props set the default for the row, and any entry of the validation object overrides its own. An empty string means "render none", so a rule can opt out of a glyph entirely (`??` resolves the override, not `||`, so `''` is honoured). A chip has exactly two treatments — unsatisfied and satisfied — and the field's own `invalid` never reaches them: it drives the input border and the helper, while the chips keep reporting what the current value does and does not satisfy.

## Events

| Event               | Payload  | Notes                                                                |
| ------------------- | -------- | -------------------------------------------------------------------- |
| `update:modelValue` | `string` | Re-emitted from the underlying `InputPassword` on every input event. |

## Slots

| Slot        | Scope | Notes                                                                                                                                                         |
| ----------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `iconLeft`  | —     | Forwarded to the underlying `InputPassword#iconLeft` slot.                                                                                                    |
| `iconRight` | —     | Forwarded to the underlying `InputPassword#iconRight` slot. Only honored when `toggleable=false` — the visibility toggle occupies this position when enabled. |

## States

- Visual states: `default`, `required`, `invalid`, `disabled`
- `data-required` mirrors the `required` prop
- `data-invalid` mirrors the `invalid` prop
- `data-disabled` mirrors the `disabled` prop
- `data-has-requirements` mirrors a non-empty `requirements` array; it is the presence flag for the requirements row
- Per requirement chip: `data-validated` is present on a rule the current value satisfies and is the single switch between the two chip treatments — present is satisfied (check glyph + success tokens), absent is unsatisfied (muted tokens)

## Motion & Animations

| Trigger                                                                         | Animation / Transition                    | Token  | Reduced-motion fallback         |
| ------------------------------------------------------------------------------- | ----------------------------------------- | ------ | ------------------------------- |
| requirement chip flipping between unsatisfied and satisfied (background + text) | `transition-colors duration-fast-02 ease-productive-entrance` | inline | `motion-reduce:transition-none` |
| check glyph revealed when a rule becomes satisfied (opacity only) | `transition-opacity duration-fast-02 ease-productive-entrance` | inline | `motion-reduce:transition-none` |
| field chrome (border/ring/bg)                                                   | — owned by the underlying `InputPassword` | —      | —                               |

**No animation here changes a size or moves a line break.** The check glyph is rendered only for a satisfied rule, so an unsatisfied chip reserves no box and shows no empty space; the chip is wider once satisfied, which is what the design shows. Mounting the glyph on satisfaction was tried and rejected: it widened the chip,
pushed every chip after it, and could re-wrap the row mid-transition. For the same reason
the row animates neither `height` nor `width`.

The row is rendered by an internal sub-component (`field-password-requirements`), mounted
only when the `requirements` prop is non-empty. It owns the rule evaluation and declares
`PasswordRequirement`, which `FieldPassword` re-exports as the public type. It is not a
compound member: `FieldPassword` stays monolithic and the consumer drives the row through
the prop, never by composing it.

## Tokens

| Region                                                              | Token (DESIGN.md)          |
| ------------------------------------------------------------------- | -------------------------- |
| gap (between label / input / helper / requirements rows)            | `var(--spacing-xs)`        |
| requirements row — gap between caption and chips, and between chips | `var(--spacing-xs)`        |
| requirements caption — typography                                   | `.text-label-sm`           |
| requirements caption — text                                         | `var(--text-default)`      |
| requirement chip — shape                                            | `var(--shape-elements)`    |
| requirement chip — padding                                          | `var(--spacing-xxs)`       |
| requirement chip — gap between check glyph and label                | `var(--spacing-xxs)`       |
| requirement chip — typography                                       | `.text-label-sm`           |
| requirement chip (unsatisfied) — surface                            | `var(--bg-surface-raised)` |
| requirement chip (unsatisfied) — text                               | `var(--text-muted)`        |
| requirement chip (satisfied) — surface                              | `var(--success)`           |
| requirement chip (satisfied) — text                                 | `var(--text-default)`      |
| requirement chip (satisfied) — check glyph                          | inherits `var(--text-default)` from the chip |

(Typography and color tokens of the field itself are owned by the children — `Label`, `InputPassword`, `HelperText` — and not redeclared here.)

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The `Label`'s native `<label>` is wired to the input via `for="<inputId>"`; when the consumer omits `inputId`, the component auto-generates one (via `useId()`) so the association still works.
- When `helperText` is set, the input receives `aria-describedby="<helperId>"` so assistive tech announces the helper alongside the value.
- When `required`, the input receives native `required` + `aria-required="true"`; the visual Required tag lives on the `Label`.
- When `invalid`, the input receives `aria-invalid="true"` and the helper switches color tokens to `var(--danger-contrast)` — the helper text remains the human-readable error message.
- When `disabled`, the input is disabled, the helper switches to `kind="disabled"` (lock icon) — if `helperText` is empty, the component falls back to the default disabled message `'This field is locked.'` so the lock icon never appears alone — and the label dims via inherited `var(--text-muted)`.
- The requirements row is a named group: the container carries `role="group"` + `aria-labelledby` pointing at the caption's generated id, so assistive tech announces "Must contain:" as the group's name before walking the chips. The caption id derives from the same id base as the input, so it is stable and unique per instance.
- Each requirement chip is static, non-interactive content (no `role`, no `tabindex`) — it reports state, it is not a control, so it never enters the tab order.
- The satisfied state is carried by a **shape** change (the `pi pi-check` glyph appears) in addition to the color change, so it does not rely on color alone (WCAG 1.4.1). The glyph itself is `aria-hidden="true"`, matching how `HelperText` treats its lock icon.
- **Known gap:** the per-chip satisfied/unsatisfied distinction is conveyed visually (glyph + tokens) but is not announced as text, because naming it needs microcopy ("met" / "not met") that the design does not define. It is deliberately not invented here; adding it is a follow-up that must ship the copy as a localizable prop.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including all derived states. Both requirement-chip treatments clear it in both themes: unsatisfied `var(--text-muted)` on `var(--bg-surface-raised)`, satisfied `var(--text-default)` on `var(--success)`.
- Touch target: the underlying `InputPassword` owns the ≥40×40 px hit area for both the input and the visibility toggle button. The requirement chips are not interactive and so carry no touch-target minimum.

## Stories (Storybook)

- Default
- Required — `required: true`; documents the Label's Required tag plus the input's `aria-required` wiring.
- Invalid — `invalid: true` with a sample `helperText`; documents the danger-tokened helper and invalid input border.
- Disabled — `disabled: true`; documents the lock-icon helper and disabled input tokens.
- Toggle — composite story with `toggleable=true` (default) and `toggleable=false` side by side; documents the toggle pass-through.
- Icons — documents the `#iconLeft` slot forwarded to the underlying `InputPassword` (with `pi pi-lock`).
- Requirements — justification: the requirements row is a two-state axis (satisfied / not) that no single-value story can show. This composite renders one field with a partially-satisfied rule set beside one with none satisfied, which is the only way to document both chip treatments and the wrapping behaviour of the row; it also documents the `requirementsTitle` override.

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
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
