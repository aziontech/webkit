---
name: page-tabs
category: navigation
structure: monolithic
status: implemented
checksum: 6a49f22126a977279b16d78d7d581a58e4a30d6c2daf60faf2aa28a9e4ee2ede
spec_version: 4
template: 2
created: 2026-11-10
last_updated: 2026-11-15
---

# PageTabs — Component Spec

## Purpose

The second-level navigation strip of a resource detail page: a full-bleed bar ruled at the bottom, its `Tabs` at the page boundary inset, with room for the actions the whole resource owns on the right (a staged-changes `Tag`, Deploy). It is `Tabs` plus the strip and the actions region, so every detail page stops re-creating the same bar.

## When to use

- Use PageTabs for the second-level navigation strip of a resource detail page; to switch peer views inside a page or panel use Tabs.
- The top of every resource detail page, under the global header.
- An account page split into tabs, such as Billing.

## When NOT to use

- Tabs inside a card, a drawer or a panel → use `tabs`.
- Steps of a flow → use `stepper` or `wizard`.
- Navigation between pages of the app → use `sidebar` or `navigation-menu`.

## Related

- `tabs` — the tablist it renders; pass one `Tabs.Item` per section in the default slot.
- `page-header` — the page heading under the strip.
- `tag` and `button` — the usual content of the `actions` slot.

## Best practices

- Bind `v-model` to the route (or a ref) and render the section below from it. PageTabs renders only the tab list, so it takes no `Tabs.Content` / `Tabs.Panel`: the page renders the active section itself from the `v-model` value.
- Keep the labels to one word where possible.
- Put only actions that apply to the whole resource in `actions`; page-level actions go in the `page-header`.
- Set `column` to the column the page body uses (`form` over a settings form, `data` over a list) so the tabs start where the content starts.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Tabs from '@aziontech/webkit/tabs'
  import { ref } from 'vue'

  const activeTab = ref('overview')
</script>

<template>
  <PageTabs v-model="activeTab">
    <Tabs.Item
      value="overview"
      label="Overview"
    />
    <Tabs.Item
      value="settings"
      label="Settings"
    />
    <template #actions>
      <Button
        label="Deploy"
        kind="outlined"
        size="medium"
        icon="pi pi-cloud-upload"
      />
    </template>
  </PageTabs>
</template>
```

## Props

| Prop     | Type                                      | Default  | Required | JSDoc                                                                                                    |
| -------- | ----------------------------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `column` | `'full' \| 'data' \| 'form' \| 'focused'` | `'full'` | false    | The page column the tab row lines up with: the full width, or the data, form or focused column below it. |

## v-model

- **`v-model`** (`modelValue`) — `string | number | null`, default `null`. The active tab; it updates when a tab is picked.

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                                         |
| --------- | ----- | --------------------------------------------------------------------------------------------- |
| `default` | —     | One Tabs.Item per section of the resource.                                                    |
| `actions` | —     | The actions the whole resource owns, on the right of the strip: a staged-changes Tag, Deploy. |

## States

- Visual states: `default`; the tab states are owned by `tabs`
- `data-column` mirrors the `column` prop on the root. The strip and its rule stay full bleed; with `data`, `form` or `focused` the tab row inside is capped at the same measure as the page column it sits over (`layout-column`, `layout-column-form`, `layout-column-focused`) and centred, so the first tab lines up with the content below. `full` leaves the row at the page boundary inset.

## Motion & Animations

_none_ — the active-tab indicator motion is owned by `tabs`.

## Tokens

| Region        | Token (DESIGN.md)       |
| ------------- | ----------------------- |
| bottom rule   | `var(--border-default)` |
| strip padding | `var(--spacing-sm)`     |
| tab inset     | `var(--spacing-xs)`     |
| actions gap   | `var(--spacing-xs)`     |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `Tabs.Item` and the actions.
- Keyboard map: the tablist follows `tabs` (arrows move between tabs, `Home`/`End` jump); `Tab` leaves the tablist for the actions.
- ARIA: `role="tablist"` and `role="tab"` come from `tabs`.
- Contrast ≥4.5:1, owned by `tabs`.

## Internationalization

No built-in strings: the tab labels and the actions come from the consumer's slots.

- Formatting: none.

## Right-to-left

- Layout: logical utilities only (`-ms-`, `margin-inline` from the column utilities); the tabs start at the inline start and the actions sit at the inline end.
- Icons: none of its own.
- Keyboard: owned by `tabs` (the arrow keys follow the reading direction).
- User data: none.

## Responsive

- Container queries: none; the column utilities cap the tab row at the page column's measure and fall back to the full width below it.
- Narrow (≤ 640 px or a narrow container): the tablist scrolls inline inside its own region (owned by `tabs`); the actions keep their size at the inline end.
- Touch: tab targets are owned by `tabs`; no hover-only affordance.
- Reflow: no page-level horizontal scroll at 320 px and 200 % zoom; only the tablist scrolls.

## Performance

- Bundle budget: 14.5 KB gzip for `./page-tabs` (it carries `tabs`) in `.size-limit.json`.
- Runtime budget: none: static strip.
- Heavy parts: none.

## Examples

- Default — the detail-page strip.
- WithActions — the strip with a Tag and Deploy; justified because the actions region is the part `tabs` does not have.
- FormColumn — the strip over a settings form with `column="form"`; justified because `column` changes where the tab row starts.

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
