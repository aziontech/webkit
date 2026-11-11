---
name: otp-input
category: inputs
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 3c4c2f27dac43a97d7bcbaf994ad69a26cea772c261448207862d87a20cc1b6e
created: 2026-11-11
last_updated: 2026-11-11
---

# OtpInput — Component Spec

## Purpose

The field for a one-time code: the six digits an authenticator app shows, or a code sent by email or SMS. It looks like a row of boxes, one character each, but it is **one real text input** laid over the boxes, so the browser's one-time-code autofill (`autocomplete="one-time-code"`), password managers, paste and screen readers all see a single field. Typing fills the next box (auto-advance), Backspace empties the last one, and a pasted code (`123 456`, `123-456`, with a line break) keeps only its valid characters and fills every box. When the last box fills it emits `complete`, so the screen can submit without a button press. It replaces the Console Kit's six `InputText`s with hand-written focus moves (`mfa-setup-block`, `mfa-authenticate-block`).

## When to use

- Multi-factor authentication: set-up confirmation and sign-in challenge.
- Verifying an email address or a phone number with a short code.
- Any short, fixed-length code the user copies from somewhere else.

## When NOT to use

- A password or a secret of free length → use `PasswordInput`.
- A long token or API key → use `Input` with a copy affordance.
- A number with a range → use `NumberInput`.

## Related

- `field` — wrap it in a `Field` for the label, the description and the error; the label names the input.
- `password-input` — the other credential input of the auth screens.
- `input` — the plain text field it shares tokens with.

## Best practices

- Label it with what the code is and where it comes from: `Authentication code`, and a description `The 6-digit code from your authenticator app.`
- Submit on `complete` only when the code is the last thing to fill; keep a Verify button for keyboard users and for a failed attempt.
- After a rejected code, mark it `invalid`, clear it, and keep focus in it.
- Use `group="3"` for codes people read aloud or copy from a phone; it draws a separator between groups and does not change the value.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import Field from '@aziontech/webkit/field'
  import OtpInput from '@aziontech/webkit/otp-input'

  const code = ref('')
</script>

<template>
  <Field>
    <Field.Label>Authentication code</Field.Label>
    <OtpInput
      v-model="code"
      @complete="(value) => console.log(value)"
    />
    <Field.Description>The 6-digit code from your authenticator app.</Field.Description>
  </Field>
</template>
```

## Props

| Prop         | Type                          | Default     | Required | JSDoc                                                                                                    |
| ------------ | ----------------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `modelValue` | `string`                      | `''`        | false    | The code typed so far, without separators.                                                               |
| `length`     | `number`                      | `6`         | false    | How many characters the code has; one box each.                                                          |
| `mode`       | `'numeric' \| 'alphanumeric'` | `'numeric'` | false    | `numeric` keeps digits and opens the number keypad; `alphanumeric` keeps letters and digits, upper case. |
| `group`      | `number`                      | `0`         | false    | Draw a separator after every `group` boxes (`3` gives `123 – 456`). `0` draws none.                      |
| `disabled`   | `boolean`                     | `false`     | false    | Disables the field while a code is being checked.                                                        |
| `invalid`    | `boolean`                     | `false`     | false    | Danger borders on every box and `aria-invalid`; set after a rejected code.                               |
| `required`   | `boolean`                     | `false`     | false    | Native `required` and `aria-required`.                                                                   |
| `autofocus`  | `boolean`                     | `false`     | false    | Focus the field on mount, for a screen whose only task is the code.                                      |

## Events

| Event               | Payload  | When                                                                  |
| ------------------- | -------- | --------------------------------------------------------------------- |
| `update:modelValue` | `string` | Every change, already filtered by `mode` and cut to `length`.         |
| `complete`          | `string` | The last box fills (typed, pasted or autofilled), once per full code. |

## Slots

_none_

## States

- `data-state` on each box: `empty` | `filled`; `data-active` on the box the next character goes to while the field has focus (the last box when the code is full).
- `data-invalid`, `data-disabled` on the root.
- Separators render between groups when `group` > 0.

## Motion & Animations

| Trigger            | Animation / Transition               | Token                    | Reduced-motion fallback         |
| ------------------ | ------------------------------------ | ------------------------ | ------------------------------- |
| box becomes active | `transition-colors duration-fast-02` | `semantic/animations.js` | `motion-reduce:transition-none` |

## Tokens

| Region             | Token                                         |
| ------------------ | --------------------------------------------- |
| box                | `var(--bg-surface)`                           |
| box border         | `var(--border-default)`                       |
| active box ring    | `var(--ring-color)`                           |
| invalid box border | `var(--danger-border)`                        |
| disabled box       | `var(--bg-disabled)` · `var(--text-disabled)` |
| character          | `.text-label-lg` · `var(--text-default)`      |
| separator          | `var(--text-muted)`                           |
| box radius         | `var(--shape-elements)`                       |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- One `input` carries the value, the name (from the `Field` label, an `aria-label`, or the catalog's `One-time code` when nothing else names it), `aria-describedby` from the `Field`, `aria-invalid`, `aria-required`, `maxlength`, `autocomplete="one-time-code"`, `inputmode` (`numeric` or `text`) and `enterkeyhint="done"`. The boxes and separators are `aria-hidden`; a screen reader reads the input's value as typed.
- Keyboard: type to fill, Backspace to clear the last character, Tab leaves the field in one stop; the caret stays at the end, so Arrow and Home keys do not move it into the middle of the code.
- Focus: the active box takes the focus ring; the whole field takes one focus stop.
- Contrast: characters `--text-default` on `--bg-surface`, borders `--border-default` (3:1 non-text) in both themes.

## Internationalization

| Key              | English source  | Override prop        |
| ---------------- | --------------- | -------------------- |
| `otpInput.label` | `One-time code` | `aria-label` (attrs) |

- Characters are not localized: digits stay ASCII so the code matches what the app shows.

## Right-to-left

- Layout: the box row is `dir="ltr"`: a code reads left to right in every locale, like a phone number, so the first character stays on the left under `dir="rtl"`.
- Icons: none.
- Keyboard: unchanged.
- User data: the value is ASCII letters and digits.

## Responsive

- Container queries: none.
- Narrow: boxes are 40 px with an 8 px gap; six boxes plus a separator fit in 320 px.
- Touch: the whole row is the input's hit area.
- Reflow: no horizontal scroll at 320 px for `length` up to 6 with a separator.

## Performance

- Bundle budget: 3.2 KB gzip for `./otp-input` in `.size-limit.json`.
- Runtime budget: one input, `length` boxes.
- Heavy parts: none.

## Stories (Storybook)

- Default — the 6-digit code in a `Field`.
- Grouped — `group="3"` with a separator; the alphanumeric mode with an 8-character recovery code.
- States — invalid after a rejected code, disabled while checking.

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
