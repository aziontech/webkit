---
name: settings-group
category: layout
structure: monolithic
status: implemented
checksum: 03dbc09a05be53ed001271343836f6ffc7556c2ab94c7bfb8a590224b3cbde18
spec_version: 8
template: 2
created: 2026-11-10
last_updated: 2026-11-21
---

# SettingsGroup — Component Spec

## Purpose

A band of a settings page: an h2 with a `Hint` glyph that carries the one-sentence guidance, over the band body (usually a flush `Card` of `SettingsRow` rows). Bands stack at the section gap with no rule between them. An anchored band shows a copy-link button in the gutter when the heading is hovered or focused; a collapsible band turns the heading into a disclosure that unfolds the body along the grid track.

## When to use

- Use SettingsGroup for a band of a settings page whose body is SettingsRow rows; any other band heading is a Subheader.
- Every settings page and create page: a resource's Settings tab, Account Settings, a create form, a create drawer.
- An Advanced band that starts closed (`collapsible`).

## When NOT to use

- A band whose heading carries a description line and actions → use `subheader`.
- The page title → use `page-header`.
- A disclosure list of several independent panels → use `accordion`.

## Related

- `settings-row` — the rows inside the band's card.
- `card` — the flush (`:padded="false"`) surface the rows sit on.
- `hint` — the guidance glyph beside the title.
- `subheader` — the band heading with a description and actions. Pick by content: a settings band of `SettingsRow`s (a Hint, a gutter copy-link, an optional disclosure) is `SettingsGroup`; a console band heading with a description and its own actions is `Subheader`; a marketing section heading is `module-header`. The three share the h2 and the copy-link anchor; folding SettingsGroup's heading onto Subheader is a planned refactor, not a behaviour change.

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
  import SettingsRow from '@aziontech/webkit/settings-row'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import { ref } from 'vue'

  const name = ref('web-app')
</script>

<template>
  <SettingsGroup
    label="General"
    hint="How this resource is identified, and whether it is serving traffic."
    anchor="general"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="Name"
            description="A unique and descriptive name to identify the resource."
          >
            <Input
              v-model="name"
              size="large"
              class="w-full"
              aria-label="Name"
            />
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
```

## Props

| Prop          | Type      | Default | Required | JSDoc                                                                                                        |
| ------------- | --------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `label`       | `string`  | `—`     | true     | The group heading, rendered as an h2.                                                                        |
| `hint`        | `string`  | `''`    | false    | One-sentence guidance shown in a Hint glyph beside the label.                                                |
| `anchor`      | `string`  | `''`    | false    | Id of the h2 that a hash link targets; when set, a copy-link button appears in the gutter on hover or focus. |
| `collapsible` | `boolean` | `false` | false    | Turns the label into a disclosure that folds the band body.                                                  |
| `icon`        | `string`  | `''`    | false    | Glyph shown before the label of a collapsible band (e.g. `az az-settings`).                                  |

## v-model

- **`v-model:open`** — `boolean`, default `false`. Whether a collapsible band is unfolded; it updates when the disclosure toggles. Ignored unless `collapsible`.

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                                                                                                                                     |
| --------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default` | —     | The band body, usually a flush Card of SettingsRow rows.                                                                                                                                  |
| `label`   | —     | Rich label content; replaces the `label` prop text in the h2.                                                                                                                             |
| `info`    | —     | An affordance beside the heading, after the `hint` glyph and outside the h2 and the disclosure button: a help button that opens the page's `HelpPanel`. Clicking it never folds the band. |

## States

- Visual states: `default`, `hover` / `focus-within` (reveals the copy-link button)
- `data-state` on the root: `open` | `closed` when `collapsible`
- `data-state` on the body: `open` | `closed`, mirroring whether it is unfolded
- Only a collapsible band folds along the `0fr`/`1fr` grid track (`data-collapsible` on the body); a band that is not collapsible lays its body out in normal flow, so it has no track that can resolve to zero height.
- Responsive: the body is the `@container/settings-group`, so rows and fields inside lay out for the section, not the window.
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
| title            | `.text-heading-2xs` · `var(--text-default)` |
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
- Keyboard map: `Tab` reaches the copy-link, the disclosure, the `hint` glyph, the `info` slot's controls and then the body; `Enter`/`Space` toggles the disclosure.
- ARIA: the `info` slot sits outside the h2, so its button's name never joins the heading's name or the disclosure's; name it after the topic (`Help: Advanced`).
- ARIA: the disclosure is a `button` inside the h2 with `aria-expanded` and `aria-controls` pointing at the body (`useId`); a folded body is `inert` and `aria-hidden`. The copy-link button is named "Copy link to the {title} section"; after a successful copy its glyph turns into a check and its name into "Link copied" for two seconds, then both return.
- Contrast ≥4.5:1 for the title.
- `motion-reduce:transition-none` on every transition.

## Internationalization

| Key                        | English source                     | Override prop |
| -------------------------- | ---------------------------------- | ------------- |
| `settingsGroup.copyLink`   | `Copy link to the {title} section` | —             |
| `settingsGroup.linkCopied` | `Link copied`                      | —             |

- Formatting: none. The `label`, `hint` and the `info` slot are the consumer's text.

## Right-to-left

- Layout: logical utilities only (`-start-`, `gap-`, `text-start`); the copy-link floats outside the inline start edge, so it moves to the right under `rtl`, and the `hint` glyph and the `info` slot follow the title on its inline end.
- Icons: the chevron and the link glyph do not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Responsive

- Container queries: the body is `@container/settings-group`, so the rows inside lay out for the band, not the window.
- Narrow (≤ 640 px or a narrow container): the title wraps (`text-balance`); the `hint` glyph and the `info` slot stay on the title's line.
- Touch: the copy-link is shown inline after the title where the pointer cannot hover (`@media (hover: none)`).
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: 8.05 KB gzip for `settings-group` in `.size-limit.json` (it carries `Hint` and its `Tooltip`).
- Runtime budget: none: static.
- Heavy parts: none.

## Examples

- Default — one anchored band.
- Stacked — two bands stacked; justified because the stacking margin is part of the contract.
- Collapsible — the Advanced disclosure, closed; justified because the disclosure is a distinct rendered state.
- WithInfo — a help button in the `info` slot of a collapsible band, opening a `HelpPanel` in a non-modal `Drawer`; justified because the slot's place outside the disclosure is the contract.

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
