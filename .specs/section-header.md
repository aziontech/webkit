---
name: section-header
category: layout
structure: monolithic
status: implemented
checksum: 378389afe3b71bd22912efaacb39b33eda01d57dbbd6abecceed57e4d350e98e
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-10
---

# SectionHeader — Component Spec

## Purpose

The heading of one band inside a page: an h2 with a one-line description, a copy-link button that appears when the heading is hovered or focused (when it has an `anchor`), and the band's own actions on the right. Below `md` the actions drop under the copy.

## When to use

- A band of a page that holds a card, a table or a list: Payment information on Billing, Get started on a resource, General in a create form.
- A band that someone should be able to link to (`anchor`).

## When NOT to use

- The page title → use `page-header`.
- A settings band whose guidance sits in a Hint and whose body is a card of setting rows → use `settings-section`.

## Related

- `page-header` — the page's h1.
- `settings-section` — the settings band with a Hint, a gutter copy-link and an optional disclosure.
- `copy-button` — the copy-link affordance it renders.

## Best practices

- Keep the description to one sentence; put longer guidance in the band body.
- Set `anchor` on bands people link to, so the h2 takes the id and the copy-link button appears.
- Keep band actions to one or two outlined medium buttons.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import SectionHeader from '@aziontech/webkit/section-header'
</script>

<template>
  <SectionHeader
    title="Payment methods"
    description="Every card on the account. Invoices are charged to the default one."
    anchor="payment-methods"
  >
    <template #actions>
      <Button
        label="Add payment method"
        kind="outlined"
        size="medium"
        icon="pi pi-plus"
      />
    </template>
  </SectionHeader>
</template>
```

## Props

| Prop          | Type                  | Default    | Required | JSDoc                                                                                                          |
| ------------- | --------------------- | ---------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `title`       | `string`              | `—`        | true     | The band title, rendered as an h2.                                                                             |
| `description` | `string`              | `''`       | false    | One sentence under the title.                                                                                  |
| `size`        | `'small' \| 'medium'` | `'medium'` | false    | Heading scale of the title (subset: no `large`).                                                               |
| `anchor`      | `string`              | `''`       | false    | Id of the h2 that a hash link targets; when set, a copy-link button appears beside the title on hover or focus. |

## Events

| _none_ | — | — |

## Slots

| Slot          | Scope | Notes                                                                        |
| ------------- | ----- | ---------------------------------------------------------------------------- |
| `description` | —     | Rich description content (links, inline code); replaces the `description` prop. |
| `actions`     | —     | The band's own actions, on the right of the copy.                            |

## States

- Visual states: `default`, `hover` / `focus-within` (reveals the copy-link button)
- `data-size` mirrors the `size` prop on the root and the h2

## Motion & Animations

| Trigger                    | Animation / Transition                          | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| -------------------------- | ----------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| heading hover / focus-within | `transition-opacity duration-150 ease-out`    | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region           | Token (DESIGN.md)                                                         |
| ---------------- | ------------------------------------------------------------------------- |
| title (medium)   | `.text-heading-xs` · `var(--text-default)`                                |
| title (small)    | `.text-label-md` · `var(--text-muted)`                                    |
| description      | `.text-body-sm` · `var(--text-muted)`                                     |
| inline padding   | `var(--spacing-xs)`                                                       |
| row gap          | `var(--spacing-md)`                                                       |
| actions gap      | `var(--spacing-xs)`                                                       |
| scroll margin    | `var(--spacing-xl)`                                                       |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: the copy-link `CopyButton` and the actions carry their own focus ring; focusing the copy-link reveals it.
- Keyboard map: `Tab` reaches the copy-link button, then the actions; `Enter`/`Space` copies the link.
- ARIA: the copy-link button is named "Copy link to the {title} section" and announces "Link copied".
- Contrast ≥4.5:1 for the title and the description.
- `motion-reduce:transition-none` on the reveal.

## Stories (Storybook)

- Default — an anchored heading with one action.
- WithActions — the Billing payment-methods heading.
- Sizes — every `size` value stacked.

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
