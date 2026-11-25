---
name: confirm-dialog
category: overlay
structure: monolithic
status: implemented
checksum: bcdbc07698483cd224e4b6f9d37727f2162d1b9ae9c9f78b462bb625822620b0
spec_version: 10
created: 2026-11-10
last_updated: 2026-11-25
---

# ConfirmDialog — Component Spec

## Purpose

A small confirmation dialog: a title, one sentence of description, and a Cancel plus a confirm button whose `variant` says how destructive the outcome is (`danger` for a removal or a discard, `primary` for a commit). The unsaved-changes guard uses the same shell; the `actions` slot replaces the two buttons when the guard can also save. Built from `Dialog`, `Panel` parts, `Button` and, for a typed confirmation, `Input`.

## When to use

- Use ConfirmDialog whenever the person must confirm an action they started (delete, discard, publish), including typed-name confirmation; an agent asking to run a tool uses ToolApproval, and a modal with your own body uses Dialog.
- Before a removal (Remove domain, Delete resource) or a re-run (Clear again).
- When someone leaves a form with unsaved changes.
- A deletion that needs typed confirmation: set `confirmation-phrase` to the resource name; the dialog renders the field and keeps the confirm button disabled until the text matches.

## When NOT to use

- A form of several fields → use `dialog` with your own body.
- A non-blocking notice → use `toast` or `alert`.
- A settings save that needs no decision → use `save-bar`.

## Related

- `dialog` — the overlay it composes; use it directly for anything that is not a yes-or-no decision.
- `button` — the trigger and the actions.
- `save-bar` — the unsaved-changes bar this dialog guards.

## Best practices

- The confirm label repeats the verb of the title (Remove Domain, Discard changes), never OK or Yes.
- `variant="danger"` only when the outcome removes or discards something; a commit is `primary`.
- Close the dialog from `@confirm` once the action has run; keep it open with `loading` while it runs.
- Typed confirmation has one rule everywhere: the reader types the resource name (`confirmation-phrase`), the match is case-sensitive after trimming the ends, the confirm button stays disabled until it matches, `Enter` in the field confirms once it matches, and the field empties every time the dialog opens. Do not hand-write the field.
- Below `md` the buttons stack full width in DOM and focus order, Cancel above and the confirm button last at the bottom nearest the thumb, the same order as `save-bar`, `Dialog` and `Drawer` footers.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Remove domain"
    description="shop.example.com stops answering for this resource once you save."
    confirm-label="Remove Domain"
    @confirm="open = false"
  >
    <template #trigger>
      <Button
        label="Remove domain"
        variant="outline"
        size="medium"
      />
    </template>
  </ConfirmDialog>
</template>
```

## Props

| Prop                 | Type                    | Default    | Required | JSDoc                                                                                                                                       |
| -------------------- | ----------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`              | `string`                | `—`        | true     | The question or the outcome, as the dialog title.                                                                                           |
| `description`        | `string`                | `''`       | false    | One sentence that says what happens on confirm.                                                                                             |
| `confirmLabel`       | `string`                | `''`       | false    | Label of the confirm button. Empty uses the locale catalog (`Confirm`).                                                                     |
| `cancelLabel`        | `string`                | `''`       | false    | Label of the cancel button. Empty uses the locale catalog (`Cancel`).                                                                       |
| `variant`            | `'danger' \| 'primary'` | `'danger'` | false    | Kind of the confirm button.                                                                                                                 |
| `size`               | `'small' \| 'medium'`   | `'medium'` | false    | Width of the dialog.                                                                                                                        |
| `loading`            | `boolean`               | `false`    | false    | Shows a spinner on the confirm button while the action runs; Cancel, `Esc` and the overlay stop closing the dialog until it clears.         |
| `disabled`           | `boolean`               | `false`    | false    | Disables the confirm button, for a confirmation that needs input first.                                                                     |
| `confirmationPhrase` | `string`                | `''`       | false    | A phrase the reader must type, exactly and with the same case, before confirm enables; usually the resource name. Empty asks for no typing. |
| `defaultOpen`        | `boolean`               | `false`    | false    | Initial open state when uncontrolled (`v-model:open` unbound).                                                                              |

## v-model

- **`v-model:open`** — `boolean`, default `undefined` (uncontrolled, starts at `defaultOpen`), the same open contract as `Dialog`. Whether the dialog is open; the trigger, `Esc`, the overlay and Cancel update it. `update:open` with `false` is the one signal that fires on every close; `cancel` fires only for the Cancel button. While `loading`, only the consumer closes it (set `open` to `false` from `@confirm` once the action settles).

## Events

| Event     | Payload               | Notes                                                                                                   |
| --------- | --------------------- | ------------------------------------------------------------------------------------------------------- |
| `confirm` | `(event: MouseEvent)` | The confirm button was activated; not emitted while `disabled`, `loading` or before the phrase matches. |
| `cancel`  | `(event: MouseEvent)` | The cancel button was activated; the dialog closes. Not emitted while `loading`.                        |

## Slots

| Slot      | Scope                   | Notes                                                               |
| --------- | ----------------------- | ------------------------------------------------------------------- |
| `trigger` | —                       | The control that opens the dialog.                                  |
| `default` | —                       | Body content under the description: a field, an alert.              |
| `actions` | `{ close: () => void }` | Replaces the Cancel and confirm buttons; receives a close function. |

## States

- Visual states: `closed`, `open`; with `confirmationPhrase`, the field is `invalid` after `Enter` on a phrase that does not match
- `data-state` on the root: `open` | `closed` (from `dialog`)

## Motion & Animations

_none_ — the open and close motion is owned by `dialog`.

## Tokens

| Region      | Token (DESIGN.md)                                             |
| ----------- | ------------------------------------------------------------- |
| actions gap | `var(--spacing-sm)`                                           |
| description | `.text-body-sm`, `var(--text-muted)` (`DialogDescription`)    |
| body        | `PanelBody`: `.text-body-sm`, `var(--spacing-lg)`, `min-h-24` |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the buttons and `dialog`.
- Keyboard map: with `confirmationPhrase`, focus lands on the phrase field (the confirm button is disabled until it matches), and `Enter` in the field confirms once the text matches. Otherwise, on open, focus lands on Cancel, the least destructive action (WAI-ARIA alert dialog pattern; Cancel carries `data-autofocus`, which the shared focus trap honours); with the `actions` slot it lands on the first focusable control, or on the slot control marked `data-autofocus`. `Esc` closes; `Tab` is trapped in the dialog and focus returns to the trigger on close (from `dialog`). There is no close button: an alert dialog is answered with Cancel, the confirm button or `Esc`. Tests: `confirm-dialog.test.ts` › opens with focus on Cancel.
- The phrase field is labelled by its sentence (`aria-labelledby`, "Type `name` to confirm." from the locale catalog, `confirmDialog.typeToConfirm`). It turns off spellcheck, autocomplete, autocapitalize and autocorrect, so a phone keyboard never changes the case of a typed name the match then rejects. Pressing `Enter` with a non-empty phrase that does not match marks the field invalid and shows "This does not match `name`. Type it exactly to confirm." under it (`confirmDialog.phraseMismatch`, `role="alert"`, tied to the field by `aria-describedby`); the message clears on the next keystroke and when the dialog opens. Tests: `confirm-dialog.test.ts` › typed confirmation.
- ARIA: the panel is `role="alertdialog"` (it interrupts with a decision), named by its title and described by its description (`DialogTitle`, `DialogDescription`; `aria-describedby` only when a description renders).
- Nested: opened from a `Drawer` or a `Dialog`, it is the top overlay layer, so `Esc` closes the confirm only, and while `loading` it closes nothing.
- Contrast ≥4.5:1, owned by the composed parts.

## Examples

- Confirm — a removal.
- DiscardChanges — the unsaved-changes guard.
- RunAgain — `variant="primary"`.
- TypedConfirmation — `confirmation-phrase`: the confirm button enables once the resource name is typed.
- SaveOrDiscard — the `actions` slot with three buttons; justified because the slot replaces the default footer.

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
- Do not add examples beyond Default + per `variant` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
