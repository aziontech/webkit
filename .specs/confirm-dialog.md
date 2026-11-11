---
name: confirm-dialog
category: overlay
structure: monolithic
status: implemented
checksum: 19868b56bb04687263cddaee84ef4d4ddc78aff5c68db3cc57f5fc48af748f6d
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-11
---

# ConfirmDialog — Component Spec

## Purpose

A small confirmation dialog: a title with a close button, one sentence of description, and a Cancel plus a confirm button whose `kind` says how destructive the outcome is (`danger` for a removal or a discard, `primary` for a commit). The unsaved-changes guard uses the same shell; the `actions` slot replaces the two buttons when the guard can also save. Built from `Dialog`, `Panel` parts and `Button`.

## When to use

- Before a removal (Remove domain, Delete resource) or a re-run (Clear again).
- When someone leaves a form with unsaved changes.
- A deletion that needs typed confirmation: put the field in the default slot and set `disabled` until it matches.

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
- `kind="danger"` only when the outcome removes or discards something; a commit is `primary`.
- Close the dialog from `@confirm` once the action has run; keep it open with `loading` while it runs.

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
        kind="outlined"
        size="medium"
      />
    </template>
  </ConfirmDialog>
</template>
```

## Props

| Prop           | Type                    | Default    | Required | JSDoc                                                                   |
| -------------- | ----------------------- | ---------- | -------- | ----------------------------------------------------------------------- |
| `title`        | `string`                | `—`        | true     | The question or the outcome, as the dialog title.                       |
| `description`  | `string`                | `''`       | false    | One sentence that says what happens on confirm.                         |
| `confirmLabel` | `string`                | `''`       | false    | Label of the confirm button. Empty uses the locale catalog (`Confirm`). |
| `cancelLabel`  | `string`                | `''`       | false    | Label of the cancel button. Empty uses the locale catalog (`Cancel`).   |
| `kind`         | `'danger' \| 'primary'` | `'danger'` | false    | Kind of the confirm button.                                             |
| `size`         | `'small' \| 'medium'`   | `'small'`  | false    | Width of the dialog.                                                    |
| `loading`      | `boolean`               | `false`    | false    | Shows a spinner on the confirm button while the action runs.            |
| `disabled`     | `boolean`               | `false`    | false    | Disables the confirm button, for a confirmation that needs input first. |

## v-model

- **`v-model:open`** — `boolean`, default `false`. Whether the dialog is open; the trigger, the close button, `Esc` and Cancel update it.

## Events

| Event     | Payload | Notes                                                                        |
| --------- | ------- | ---------------------------------------------------------------------------- |
| `confirm` | `void`  | The confirm button was activated; not emitted while `disabled` or `loading`. |
| `cancel`  | `void`  | The cancel button was activated; the dialog closes.                          |

## Slots

| Slot      | Scope                   | Notes                                                               |
| --------- | ----------------------- | ------------------------------------------------------------------- |
| `trigger` | —                       | The control that opens the dialog.                                  |
| `default` | —                       | Body content under the description: a field, an alert.              |
| `actions` | `{ close: () => void }` | Replaces the Cancel and confirm buttons; receives a close function. |

## States

- Visual states: `closed`, `open`
- `data-state` on the root: `open` | `closed` (from `dialog`)

## Motion & Animations

_none_ — the open and close motion is owned by `dialog`.

## Tokens

| Region      | Token (DESIGN.md)   |
| ----------- | ------------------- |
| actions gap | `var(--spacing-sm)` |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the buttons and `dialog`.
- Keyboard map: `Esc` closes; `Tab` is trapped in the dialog and focus returns to the trigger on close (from `dialog`).
- ARIA: the dialog is named by its title and described by its description (`DialogTitle`, `DialogDescription`).
- Contrast ≥4.5:1, owned by the composed parts.

## Stories (Storybook)

- Confirm — a removal.
- DiscardChanges — the unsaved-changes guard.
- RunAgain — `kind="primary"`.
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
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Stories (Storybook)" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
