---
name: field-password
category: inputs
structure: monolithic
status: approved
spec_version: 1
checksum: 713291f3843578f4197bea2c70bae9d153b348f0e2ffd4811d75d68e58a40cc8
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-3212&m=dev
  node_id: 2027:3212
created: 2026-06-17
last_updated: 2026-08-10
---

# Field Password — Component Spec

## Purpose

Form field for password input that composes `Label`, `InputPassword`, and `HelperText` into a single vertical stack with consistent spacing. Use it whenever a password input needs a visible label or helper/error message — login, sign-up, and password-change forms. Acts as the canonical wrapper for `InputPassword` in form contexts, mirroring the `FieldText` pattern.

It also owns the **password-requirements row**: a captioned, wrapping set of rule chips rendered under the field, one chip per rule, each switching to a satisfied treatment (check glyph + success tokens) as soon as the bound value satisfies that rule's `test`. This is the "strength meter" surface that `InputPassword` deliberately does not own — the bare input stays the field only. The row exposes exactly **two** levers and nothing else: a bare `requirements` attribute turns it on with the built-in rule set, and passing an array replaces that set with the consumer's own rules. Appearance is not configurable — a chip has two treatments, both fixed by the design. The field **evaluates** the rules against the value it already owns, so the chips track what is typed with no recomputation on the consumer's side. This stays inside `.claude/rules/component-states.md`: enabling the row (or supplying rules) is the trigger the app provides, and applying them to the bound value is derived render state, not business logic the field invents.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import FieldPassword from '@aziontech/webkit/field-password'
  import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'

  const password = ref('')

  // Optional: start from the built-in set, drop one rule by its stable key, add your own.
  const requirements = [
    ...DEFAULT_PASSWORD_REQUIREMENTS.filter((rule) => rule.key !== 'special'),
    { key: 'no-spaces', label: 'No spaces', test: (value) => !/\s/.test(value) }
  ]
</script>

<template>
  <!-- Built-in rule set: the bare attribute is the whole opt-in. -->
  <FieldPassword
    v-model="password"
    label="Password"
    placeholder="Enter your password"
    helper-text="At least 8 characters."
    autocomplete="new-password"
    requirements
    required
  />

  <!-- Or bring your own rules; the array replaces the built-in set. -->
  <FieldPassword
    v-model="password"
    label="Password"
    :requirements="requirements"
  />
</template>
```

## Props

| Prop                | Type                                            | Default              | Required | JSDoc                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------- | ----------------------------------------------- | -------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `modelValue`        | `string`                                        | `''`                 | false    | Two-way bound value of the underlying `InputPassword`.                                                                                                                                                                                                                                                                                                                                        |
| `label`             | `string`                                        | `''`                 | false    | Text rendered inside the `Label`. When empty, the label row is omitted.                                                                                                                                                                                                                                                                                                                       |
| `placeholder`       | `string`                                        | `''`                 | false    | Placeholder forwarded to the `InputPassword`.                                                                                                                                                                                                                                                                                                                                                 |
| `helperText`        | `string`                                        | `''`                 | false    | Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted — including while `disabled`: the field never substitutes copy of its own, so a field disabled for the length of a request grows no line (and no lock glyph) in the one moment it has nothing to say.                                                                                                      |
| `maxLength`         | `number \| undefined`                           | `undefined`          | false    | Native `maxlength` forwarded to the `InputPassword`.                                                                                                                                                                                                                                                                                                                                          |
| `disabled`          | `boolean`                                       | `false`              | false    | Disables the input; a supplied `helperText` switches to `kind="disabled"` (lock icon).                                                                                                                                                                                                                                                                                                        |
| `readonly`          | `boolean`                                       | `false`              | false    | Marks the input read-only; value is visible but not editable. Native pass-through.                                                                                                                                                                                                                                                                                                            |
| `required`          | `boolean`                                       | `false`              | false    | Adds the `Required` tag to the `Label` and sets native `required` + `aria-required` on the input.                                                                                                                                                                                                                                                                                             |
| `invalid`           | `boolean`                                       | `false`              | false    | Switches the helper to `kind="invalid"` and applies invalid border/ring tokens on the input.                                                                                                                                                                                                                                                                                                  |
| `toggleable`        | `boolean`                                       | `true`               | false    | Forwards to `InputPassword`. When true, renders the visibility toggle on the trailing edge; when false, the field behaves as a plain password input.                                                                                                                                                                                                                                          |
| `autocomplete`      | `'current-password' \| 'new-password' \| 'off'` | `'current-password'` | false    | Forwarded to the `InputPassword` for password-manager hints. Use `new-password` for sign-up and password-change flows.                                                                                                                                                                                                                                                                        |
| `inputId`           | `string`                                        | `''`                 | false    | id for the native input; consumed by `Label` via `for` and by `aria-describedby` wiring.                                                                                                                                                                                                                                                                                                      |
| `name`              | `string`                                        | `''`                 | false    | HTML name for the underlying input (form + vee-validate integration).                                                                                                                                                                                                                                                                                                                         |
| `requirements`      | `boolean \| PasswordRequirement[]`              | `false`              | false    | Enables the password-requirements row. `true` (a bare attribute) renders the built-in rule set; an array replaces that set entirely, one chip per entry. Each rule carries a `test` the field evaluates against the current value; a satisfied rule renders the check glyph + success tokens, otherwise the muted treatment. `false` or an empty array omits the whole row, caption included. |
| `requirementsTitle` | `string`                                        | `'Must contain:'`    | false    | Caption that opens the requirements row and names the group for assistive tech. Rendered only when the row is enabled.                                                                                                                                                                                                                                                                        |

`PasswordRequirement`: `{ key?: string; label: string; test: RegExp | ((value: string) => boolean) }`

The interface and the built-in rule set live in the co-located `password-requirements.ts`, published as `@aziontech/webkit/password-requirements` (`DEFAULT_PASSWORD_REQUIREMENTS`) — a `.ts` module because `export const` cannot live inside `<script setup>`. `FieldPassword` re-exports the type, so `PasswordRequirement` stays reachable from the component as well.

The built-in set, in the design's order: `length` (`8-128 characters`), `uppercase` (`Uppercase letter`), `special` (`Special character`), `number` (`Number`), `lowercase` (`Lowercase letter`). Every entry carries a **stable `key`** so a consumer removes or replaces one by key and never by the localizable `label` — `DEFAULT_PASSWORD_REQUIREMENTS.filter((rule) => rule.key !== 'special')`. A consumer rule may omit `key`, in which case its `label` is the render identity.

**Nothing about a chip's appearance is configurable.** A chip has exactly two treatments, both fixed by the design: unsatisfied is `var(--bg-placeholder)` + `var(--text-muted)` with no glyph, satisfied is `var(--success)` + `var(--text-default)` with a hardcoded `pi pi-check`. The field's own `invalid` never reaches them either: it drives the input border and the helper, while the chips keep reporting what the current value does and does not satisfy.

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
- `data-has-requirements` mirrors an enabled requirements row (`requirements` resolved to a non-empty rule set); it is the presence flag for the row
- Per requirement chip: `data-validated` is present on a rule the current value satisfies and is the single switch between the two chip treatments — present is satisfied (check glyph + success tokens), absent is unsatisfied (muted tokens)

## Motion & Animations

| Trigger                                                                         | Animation / Transition                                                                                                                                                                                  | Token  | Reduced-motion fallback         |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------- |
| requirement chip flipping between unsatisfied and satisfied (background + text) | `transition-colors duration-fast-02 ease-productive-entrance`                                                                                                                                           | inline | `motion-reduce:transition-none` |
| check glyph entering/leaving a chip (box width + slide-in)                      | `transition-[width,margin,translate,opacity] duration-fast-02 ease-productive-entrance` — the glyph box goes `w-0 opacity-0 -translate-x-1` to `w-[14px] opacity-100 translate-x-0` on `data-validated` | inline | `motion-reduce:transition-none` |
| requirements row height when the widened chips rewrap                           | `transition-[height] duration-fast-02 ease-productive-entrance` on the row root, height pinned to the measured inner wrap (`useElementSize`)                                                            | inline | `motion-reduce:transition-none` |
| field chrome (border/ring/bg)                                                   | — owned by the underlying `InputPassword`                                                                                                                                                               | —      | —                               |

**The glyph is always in the DOM; its box animates from zero.** An unsatisfied chip still
reserves no visible space (the box is `w-0` with no margin), and the chip widens smoothly as
the rule is satisfied while the glyph slides in from the left. The satisfied gap between
glyph and label is the glyph's own transitioned margin — not a static `gap` on the chip —
so it collapses together with the box. The row transitions its `height` between measured
values: a wrap-driven `auto` height change cannot be transitioned in CSS, so the row pins
its height to the inner wrap's measured content height (VueUse `useElementSize`) and lets
the transition interpolate between measurements; until the first measurement the height
stays `auto`, so mounting does not animate.

The row is rendered by an internal sub-component (`field-password-requirements`), mounted
only when the resolved rule set is non-empty. It owns the rule evaluation; the
`PasswordRequirement` interface and the built-in set live in the co-located
`password-requirements.ts`, which `FieldPassword` re-exports the type from. The row is not a
compound member: `FieldPassword` stays monolithic and the consumer drives the row through
the prop, never by composing it.

## Tokens

| Region                                                              | Token (DESIGN.md)                            |
| ------------------------------------------------------------------- | -------------------------------------------- |
| gap (between label / input / helper / requirements rows)            | `var(--spacing-xs)`                          |
| requirements row — gap between caption and chips, and between chips | `var(--spacing-xs)`                          |
| requirements caption — typography                                   | `.text-label-sm`                             |
| requirements caption — text                                         | `var(--text-default)`                        |
| requirement chip — shape                                            | `var(--shape-elements)`                      |
| requirement chip — padding                                          | `var(--spacing-xxs)`                         |
| requirement chip — gap between check glyph and label                | `var(--spacing-xxs)`                         |
| requirement chip — typography                                       | `.text-label-sm`                             |
| requirement chip (unsatisfied) — surface                            | `var(--bg-placeholder)`                      |
| requirement chip (unsatisfied) — text                               | `var(--text-muted)`                          |
| requirement chip (satisfied) — surface                              | `var(--success)`                             |
| requirement chip (satisfied) — text                                 | `var(--text-default)`                        |
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
- When `disabled`, the input is disabled and the label dims via inherited `var(--text-muted)`. A supplied `helperText` switches to `kind="disabled"` (lock icon), so the lock never appears alone; an empty `helperText` renders no helper row at all — the field writes no copy of its own, and `aria-describedby` is dropped with the row.
- The requirements row is a named group: the container carries `role="group"` + `aria-labelledby` pointing at the caption's generated id, so assistive tech announces "Must contain:" as the group's name before walking the chips. The caption id derives from the same id base as the input, so it is stable and unique per instance.
- Each requirement chip is static, non-interactive content (no `role`, no `tabindex`) — it reports state, it is not a control, so it never enters the tab order.
- The satisfied state is carried by a **shape** change (the `pi pi-check` glyph appears) in addition to the color change, so it does not rely on color alone (WCAG 1.4.1). The glyph itself is `aria-hidden="true"`, matching how `HelperText` treats its lock icon.
- **Known gap:** the per-chip satisfied/unsatisfied distinction is conveyed visually (glyph + tokens) but is not announced as text, because naming it needs microcopy ("met" / "not met") that the design does not define. It is deliberately not invented here; adding it is a follow-up that must ship the copy as a localizable prop.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including all derived states. Both requirement-chip treatments clear it in both themes: unsatisfied `var(--text-muted)` on `var(--bg-placeholder)`, satisfied `var(--text-default)` on `var(--success)`.
- Touch target: the underlying `InputPassword` owns the ≥40×40 px hit area for both the input and the visibility toggle button. The requirement chips are not interactive and so carry no touch-target minimum.

## Stories (Storybook)

- Default — includes the bare `requirements` attribute, so the built-in row is the documented default usage.
- Required — `required: true`; documents the Label's Required tag plus the input's `aria-required` wiring.
- Invalid — `invalid: true` with a sample `helperText`; documents the danger-tokened helper and invalid input border, and that the chips are untouched by it.
- Disabled — `disabled: true` with an explicit `helperText`; documents the disabled input tokens and the lock-icon helper the copy earns (with no `helperText` the row is absent).
- Toggle — composite story with `toggleable=true` (default) and `toggleable=false` side by side; documents the toggle pass-through.
- Icons — documents the `#iconLeft` slot forwarded to the underlying `InputPassword` (with `pi pi-lock`).
- Requirements — justification: the requirements row is a two-state axis (satisfied / not) that no single-value story can show. This composite renders one empty field beside one seeded with a partially-satisfying value, which is the only way to document both chip treatments at rest plus the wrapping behaviour; both fields use the bare `requirements` attribute, so the story is also the reference for the built-in rule set.
- CustomRequirements — justification: the prop's second form (an array replacing the built-in set) cannot be shown by the arg-driven stories, because a RegExp / predicate is not expressible in a Storybook control. This composite documents the two customization paths side by side — the built-in set filtered by a rule's stable `key` plus an appended consumer rule, and a fully replaced localized set with a matching `requirementsTitle` — and makes it visible that customizing _which_ rules appear never changes how a chip looks.

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
