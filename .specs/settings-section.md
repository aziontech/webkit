---
name: settings-section
category: layout
structure: monolithic
status: implemented
checksum: ebbc0145e394f757f02329ff9f71e5932b383f545f346fad9e71733c55c22497
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-14
---

# SettingsSection — Component Spec

## Purpose

A band of a settings page: an h2 with a `Hint` glyph that carries the one-sentence guidance, over the band body (usually a flush `Card` of `SettingRow` rows). Bands stack at the section gap with no rule between them. An anchored band shows a copy-link button in the gutter when the heading is hovered or focused; a collapsible band turns the heading into a disclosure that unfolds the body along the grid track.

## When to use

- Every settings page and create page: a resource's Settings tab, Account Settings, a create form, a create drawer.
- An Advanced band that starts closed (`collapsible`).

## When NOT to use

- A band whose heading carries a description line and actions → use `section-header`.
- The page title → use `page-header`.
- A disclosure list of several independent panels → use `accordion`.

## Related

- `setting-row` — the rows inside the band's card.
- `card` — the flush (`:padded="false"`) surface the rows sit on.
- `hint` — the guidance glyph beside the title.
- `section-header` — the band heading with a description and actions.

## Best practices

- One sentence of guidance in `hint`; the title names the band in one or two words.
- Set `anchor` on bands people link to.
- Use `collapsible` only for an Advanced band whose defaults are right for most people; it starts closed.
- Stack the bands inside one form column (`layout-column-form`); the first band takes no top margin.

## Usage

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import { ref } from 'vue'

  const name = ref('web-app')
</script>

<template>
  <SettingsSection
    title="General"
    hint="How this resource is identified, and whether it is serving traffic."
    anchor="general"
  >
    <Card :padded="false">
      <template #content>
        <Item.List>
          <SettingRow
            title="Name"
            description="A unique and descriptive name to identify the resource."
          >
            <Input
              v-model="name"
              size="large"
              class="w-full"
              aria-label="Name"
            />
          </SettingRow>
        </Item.List>
      </template>
    </Card>
  </SettingsSection>
</template>
```

## Props

| Prop          | Type      | Default | Required | JSDoc                                                                                                        |
| ------------- | --------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `title`       | `string`  | `—`     | true     | The band title, rendered as an h2.                                                                           |
| `hint`        | `string`  | `''`    | false    | One-sentence guidance shown in a Hint glyph beside the title.                                                |
| `anchor`      | `string`  | `''`    | false    | Id of the h2 that a hash link targets; when set, a copy-link button appears in the gutter on hover or focus. |
| `collapsible` | `boolean` | `false` | false    | Turns the title into a disclosure that folds the band body.                                                  |
| `icon`        | `string`  | `''`    | false    | Glyph shown before the title of a collapsible band (e.g. `pi pi-cog`).                                       |

## v-model

- **`v-model:open`** — `boolean`, default `false`. Whether a collapsible band is unfolded; it updates when the disclosure toggles. Ignored unless `collapsible`.

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                         |
| --------- | ----- | ------------------------------------------------------------- |
| `default` | —     | The band body, usually a flush Card of SettingRow rows.       |
| `title`   | —     | Rich title content; replaces the `title` prop text in the h2. |

## States

- Visual states: `default`, `hover` / `focus-within` (reveals the copy-link button)
- `data-state` on the root: `open` | `closed` when `collapsible`
- `data-open` on the body mirrors whether it is unfolded
- Only a collapsible band folds along the `0fr`/`1fr` grid track (`data-collapsible` on the body); a band that is not collapsible lays its body out in normal flow, so it has no track that can resolve to zero height.
- Responsive: the body is the `@container/settings-section`, so rows and fields inside lay out for the section, not the window.
- Hover-free devices: the copy-link button is shown inline after the title where the pointer cannot hover (`@media (hover: none)`), instead of floating outside the start edge on hover.

## Motion & Animations

| Trigger                  | Animation / Transition                                                          | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| copy-link reveal         | `transition-opacity duration-fast-02 ease-productive-entrance`                  | semantic                                          | `motion-reduce:transition-none` |
| disclosure hover         | `transition-colors duration-fast-02 ease-productive-entrance`                   | semantic                                          | `motion-reduce:transition-none` |
| chevron rotate           | `transition-transform duration-fast-02 ease-productive-entrance`                | semantic                                          | `motion-reduce:transition-none` |
| body unfold (grid track) | `transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance` | semantic                                          | `motion-reduce:transition-none` |
| body fade and lift       | `transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance`  | semantic                                          | `motion-reduce:transition-none` |

## Tokens

| Region           | Token (DESIGN.md)                           |
| ---------------- | ------------------------------------------- |
| title            | `.text-heading-xxs` · `var(--text-default)` |
| band gap         | `var(--layout-section-gap)`                 |
| heading-body gap | `var(--spacing-md)`                         |
| body gap         | `var(--spacing-lg)`                         |
| copy-link glyph  | `.text-body-xs` · `var(--text-muted)`       |
| copy-link shape  | `var(--shape-button)`                       |
| ring             | `var(--ring-color)`                         |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the copy-link and the disclosure button (plus `ring-offset` on the disclosure).
- Keyboard map: `Tab` reaches the copy-link, the disclosure and then the body; `Enter`/`Space` toggles the disclosure.
- ARIA: the disclosure is a `button` inside the h2 with `aria-expanded` and `aria-controls` pointing at the body (`useId`); a folded body is `inert` and `aria-hidden`. The copy-link button is named "Copy link to the {title} section"; after a successful copy its glyph turns into a check and its name into "Link copied" for two seconds, then both return.
- Contrast ≥4.5:1 for the title.
- `motion-reduce:transition-none` on every transition.

## Examples

- Default — one anchored band.
- Stacked — two bands stacked; justified because the stacking margin is part of the contract.
- Collapsible — the Advanced disclosure, closed; justified because the disclosure is a distinct rendered state.

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
