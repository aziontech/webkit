---
name: setting-row
category: layout
structure: monolithic
status: implemented
checksum: 9d7e80672f31933ae0b01d4a4d607ab6a80462d435087aa2962bd8d5bcc4e5f6
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-12
---

# SettingRow — Component Spec

## Purpose

One setting inside a flush `Card`: an `Item` whose content carries the title and description, with the control placed by what it needs. A typed or picked field sits in a right cell capped at the 3xs container so every field on the card ends at the same edge (`field`); a switch or a button sits hard right at its natural width (`compact`); a textarea, list, radio group or editor drops under the copy at the full measure (`stacked`). A child setting indents one or two levels under a rule (`level`). The copy top-aligns with the control, and the row keeps its two columns at every width (the description clamps to two lines); `stackable` opts a row into moving a `field` control under the copy in a narrow box.

## When to use

- Every row of a settings card: account settings, build settings, create pages, resource settings.
- A field with a validation message under it (put the `HelperText` in the default slot after the control).

## When NOT to use

- A stand-alone form field with a visible label above it → use `field-text` and the other `field-*` components.
- A read-only list of label and value pairs → use `key-value-pairs`.
- A navigable list row → use `item` directly.

## Related

- `settings-section` — the band the card of rows sits in.
- `item` — the row primitive it renders; place rows in an `Item.List` inside the card.
- `helper-text` — the required or invalid message under the control.

## Best practices

- The title is the label: give the control the same text as `aria-label`.
- Pick `kind` by the control: `field` for Input and Select, `compact` for Switch and Button, `stacked` for Textarea, radio groups and editors.
- Show a validation message only after Save was pressed.
- Use `level` only for a setting that applies when the row above it is on, and render it with `v-if` on that state.
- Keep the default two columns on a phone: the title and the clamped description sit on the start side, the control on the end side, both aligned to the top. This is the console layout at every width.
- Set `stackable` only when the field needs the full measure to be usable in a narrow box (a long URL or a code value in a side drawer); never to fix a centred or cramped look.
- Let a tall control (an input group of three nameservers, a textarea) sit beside the copy: the title stays at the top of the row.
- Do not wrap the row or its copy in your own flex box to change the alignment or to stack it; use `kind` and `stackable`.
- Do not set `stackable` on a `compact` row: a switch or a button always stays at the end side.

## Usage

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Switch from '@aziontech/webkit/switch'
  import { reactive } from 'vue'

  const form = reactive({ name: '', active: true })
</script>

<template>
  <Card :padded="false">
    <template #content>
      <Item.List>
        <SettingRow
          title="Name"
          description="Give a unique and descriptive name to identify the resource."
        >
          <Input
            v-model="form.name"
            size="large"
            class="w-full"
            aria-label="Name"
          />
        </SettingRow>
        <SettingRow
          title="Active"
          description="When disabled, the resource stops serving traffic."
          kind="compact"
        >
          <Switch
            v-model="form.active"
            aria-label="Active"
          />
        </SettingRow>
      </Item.List>
    </template>
  </Card>
</template>
```

## Props

| Prop          | Type                                | Default   | Required | JSDoc                                                                             |
| ------------- | ----------------------------------- | --------- | -------- | --------------------------------------------------------------------------------- |
| `title`       | `string`                            | `—`       | true     | The setting name; the control takes the same text as its aria-label.              |
| `description` | `string`                            | `''`      | false    | One sentence under the title that says what the setting does.                     |
| `kind`        | `'field' \| 'compact' \| 'stacked'` | `'field'` | false    | Where the control sits relative to the copy.                                      |
| `level`       | `0 \| 1 \| 2`                       | `0`       | false    | Indent depth under a rule, for a setting that only applies when its parent is on. |
| `stackable`   | `boolean`                           | `false`   | false    | Below the md container of the row, move a field control under the copy at full width. |

## Events

| _none_ | — | — |

## Slots

| Slot          | Scope | Notes                                                                           |
| ------------- | ----- | ------------------------------------------------------------------------------- |
| `default`     | —     | The control, plus the HelperText message under it when there is one.            |
| `title`       | —     | Rich title content (a Tag, a Hint); replaces the `title` prop.                  |
| `description` | —     | Rich description content (links, inline code); replaces the `description` prop. |

## States

- Visual states: `default`
- `data-row-kind` mirrors `kind` and `data-level` mirrors `level` on the root; `data-stackable` is set when `stackable` is on
- Alignment: the copy and the control align to the top of the row, so a title stays level with the first line of a tall control.
- Responsive: the row is the `@container/setting-row`. By default the row keeps its two columns at every width: the copy shrinks (the description clamps to two lines with an ellipsis) and a `field` control keeps the end cell, capped at the 3xs container. With `stackable`, below `@md` of the row a `field` control moves under the copy at full width.

## Motion & Animations

_none_

## Tokens

| Region              | Token (DESIGN.md)       |
| ------------------- | ----------------------- |
| field cell width    | `var(--container-3xs)`  |
| stacked gap         | `var(--spacing-sm)`     |
| control-message gap | `var(--spacing-xs)`     |
| level rule          | `var(--border-default)` |
| level indent        | `var(--spacing-md)`     |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the control in the default slot.
- Keyboard map: `Tab` reaches the control; the row is not interactive.
- ARIA: the row is an `Item` (a `listitem` inside `Item.List`); the control carries `aria-label` equal to the title, and a message is linked with `aria-describedby`.
- Contrast ≥4.5:1 for the title and the muted description.

## Examples

- SettingsCard — field and stacked rows.
- CompactRows — switches and a button; justified because `compact` changes where the control sits.
- WithMessage — a field with its required message; justified because the message placement is part of the contract.
- Nested — `level` 1 and 2; justified because the indent rule is a distinct rendered state.
- Stackable — a narrow drawer-width card whose Origin URL row sets `stackable` beside a default row; justified because the opt-in stacked layout is a distinct rendered state.

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
