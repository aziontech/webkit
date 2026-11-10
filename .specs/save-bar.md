---
name: save-bar
category: layout
structure: monolithic
status: implemented
checksum: 92c278aa5567edd5e1f9fe68e40657500b8f714ddf11c52139f5acb8580f639e
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-10
---

# SaveBar — Component Spec

## Purpose

The bar at the bottom of a settings or create page that holds the status of unsaved work and its Discard (or Cancel) and Save actions. `floating` overlays the bottom of the scroll region without moving the content and is shown while the form is dirty; `docked` takes its own row at the bottom; `plain` closes a form column saved as one unit, always shown.

## When to use

- A settings page whose changes are staged and saved together: show the floating bar while the form is dirty or saving.
- A create page or account form with one Save for the whole page (`plain`).

## When NOT to use

- A card that saves on its own → put the actions in the card footer.
- A drawer or dialog form → use the `PanelFooter` of `drawer` or `dialog`.
- A one-off confirmation → use `confirm-dialog`.

## Related

- `button` — the actions: an outlined Discard or Cancel, then a primary Save with `loading` while it runs.
- `settings-section` — the bands the bar saves.
- `confirm-dialog` — the guard shown when someone leaves with unsaved changes.

## Best practices

- Render the floating bar with `v-if="dirty || saving"` inside a `Transition`, so it slides in when the first change is made.
- Say what changed and when it takes effect in the status sentence; keep it to one line.
- Disable Discard and set `loading` on Save while saving.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import SaveBar from '@aziontech/webkit/save-bar'
</script>

<template>
  <SaveBar>
    You have unsaved changes.
    <template #actions>
      <Button
        type="button"
        label="Discard"
        kind="outlined"
        size="medium"
      />
      <Button
        label="Save"
        kind="primary"
        size="medium"
      />
    </template>
  </SaveBar>
</template>
```

## Props

| Prop   | Type                                  | Default      | Required | JSDoc                                               |
| ------ | ------------------------------------- | ------------ | -------- | --------------------------------------------------- |
| `kind` | `'floating' \| 'docked' \| 'plain'`   | `'floating'` | false    | How the bar sits at the bottom of its scroll region. |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                              |
| --------- | ----- | ------------------------------------------------------------------ |
| `default` | —     | The status sentence on the left, such as You have unsaved changes. |
| `actions` | —     | Discard or Cancel, then Save, on the right.                        |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop on the root

## Motion & Animations

_none_ — the consumer wraps the bar in a `Transition` when it appears with the dirty state.

## Tokens

| Region              | Token (DESIGN.md)                                    |
| ------------------- | ---------------------------------------------------- |
| floating/docked surface | `var(--bg-canvas)` · border `var(--border-default)` |
| plain surface       | `var(--bg-surface)` · border `var(--border-muted)`   |
| status text         | `.text-body-sm` · `var(--text-default)`              |
| status glyph        | `var(--text-muted)`                                  |
| gaps                | `var(--spacing-xs)` · `var(--spacing-sm)` · `var(--spacing-xl)` |
| padding             | `var(--spacing-sm)` · `var(--spacing-md)`            |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the action buttons.
- Keyboard map: `Tab` reaches Discard, then Save, in reading order (the column is reversed visually on a phone so Save sits on top).
- ARIA: the root is a `footer`; the status glyph is `aria-hidden`.
- Contrast ≥4.5:1 for the status sentence.

## Stories (Storybook)

- Floating — the dirty-state bar over a scroll region.
- Docked — the bar on its own row; justified because `kind` changes the layout.
- Plain — the form footer; justified because `kind` changes the surface and width.

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
