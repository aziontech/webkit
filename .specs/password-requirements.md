---
name: password-requirements
category: inputs
structure: monolithic
status: implemented
spec_version: 1
checksum: ba0896a8875d8df80936175a7fdfe040756ece9c7589960d10e9639f976928c6
created: 2026-11-10
last_updated: 2026-11-11
---

# PasswordRequirements — Component Spec

## Purpose

Live checklist of password rules shown under a `PasswordInput`: a caption followed by one chip per rule, each chip turning to the success tone with a check as the typed value satisfies it. It replaces the requirements row of the v5 `field-password`; the entry also exports `DEFAULT_PASSWORD_REQUIREMENTS` and the `PasswordRequirement` type so a form validates with the same rules it shows.

## When to use

- A new-password field (sign-up, reset, change password) where the user must meet explicit rules.

## When NOT to use

- A sign-in password field → render `password-input` alone; the rules do not apply to an existing password.
- A free-form strength meter → not provided; compose your own.

## Related

- `password-input` — the control whose value this checklist evaluates.
- `field` — place both inside one `Field` so the label and description stay together.

## Best practices

- Bind `value` to the same ref as the `PasswordInput` `v-model`.
- Validate on submit with `DEFAULT_PASSWORD_REQUIREMENTS` (or your own array) so the error and the chips never disagree.
- Pass `requirements` to replace the rule set and `title` to localize the caption.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import Field from '@aziontech/webkit/field'
  import PasswordInput from '@aziontech/webkit/password-input'
  import PasswordRequirements, {
    DEFAULT_PASSWORD_REQUIREMENTS
  } from '@aziontech/webkit/password-requirements'

  const password = ref('')
  const valid = () =>
    DEFAULT_PASSWORD_REQUIREMENTS.every((rule) =>
      typeof rule.test === 'function' ? rule.test(password.value) : rule.test.test(password.value)
    )
</script>

<template>
  <Field required>
    <Field.Label>Password</Field.Label>
    <PasswordInput
      v-model="password"
      autocomplete="new-password"
    />
    <PasswordRequirements :value="password" />
  </Field>
</template>
```

## Props

| Prop           | Type                    | Default                         | Required | JSDoc                                                                                                               |
| -------------- | ----------------------- | ------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `requirements` | `PasswordRequirement[]` | `DEFAULT_PASSWORD_REQUIREMENTS` | false    | Rules rendered as chips, one per entry. Defaults to the built-in rule set; an empty array renders only the caption. |
| `title`        | `string`                | `''`                            | false    | Caption that opens the row and names the group for assistive tech. Empty uses the locale catalog (`Must contain:`). |
| `value`        | `string`                | `''`                            | false    | Password every rule is evaluated against; pass the PasswordInput value.                                             |

## Events

| Event | Payload | Notes |
| ----- | ------- | ----- |

## Slots

| Slot | Scope | Notes |
| ---- | ----- | ----- |

## States

- Each chip carries `data-validated` when its rule passes.
- The row animates its height as chips wrap.

## Motion & Animations

| Trigger           | Animation / Transition                                                                  | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ----------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| row height change | `transition-[height] duration-fast-02 ease-productive-entrance`                         | semantic (`fast-02` · `productive-entrance`)      | `motion-reduce:transition-none` |
| chip validated    | `transition-colors duration-fast-02 ease-productive-entrance`                           | semantic (`fast-02` · `productive-entrance`)      | `motion-reduce:transition-none` |
| check icon reveal | `transition-[width,margin,translate,opacity] duration-fast-02 ease-productive-entrance` | semantic (`fast-02` · `productive-entrance`)      | `motion-reduce:transition-none` |

## Tokens

| Region                 | Token (DESIGN.md)       |
| ---------------------- | ----------------------- |
| chip gap               | `var(--spacing-xs)`     |
| chip padding           | `var(--spacing-xxs)`    |
| chip shape             | `var(--shape-elements)` |
| chip surface           | `var(--bg-placeholder)` |
| chip validated surface | `var(--success)`        |
| chip text              | `var(--text-muted)`     |
| caption text           | `var(--text-default)`   |
| typography             | `.text-label-sm`        |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not focusable; the checklist is read-only.
- Keyboard map: _none_.
- ARIA: root `role="group"` named by the caption through `aria-labelledby`; the check icons are `aria-hidden`.
- Contrast ≥4.5:1 for chip text in both tones.
- `motion-reduce:transition-none` on every transition.

## Stories (Storybook)

The examples in `packages/webkit/examples/password-requirements/` render in Storybook through the shared example stories:

- Default — inside a `Field` under a `PasswordInput`.

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
