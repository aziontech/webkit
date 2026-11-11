---
name: page-header
category: layout
structure: monolithic
status: implemented
checksum: 60bf9de47717f95e8ba323bc71b3b67f5ac43abd8ebdb55afdd441a85a797c82
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-11
---

# PageHeader — Component Spec

## Purpose

The heading that opens a console page: an h1 whose `size` picks the heading token by page level, a one-line description, and the actions the page owns on the right. When the row runs out of room the actions move below the copy together; on a phone they stack, each at full width. It replaces the header markup every list, detail, settings and create page used to copy by hand.

## When to use

- The top of any console page: a first-level list (`medium`), a detail tab or settings sub-page (`small`), a creation hub headline (`large`).
- A page that owns actions (Documentation, a create action) that belong next to its title.

## When NOT to use

- The heading of one band inside a page → use `section-header`.
- A settings band with a Hint and a card of rows → use `settings-section`.
- A documentation page heading → use `doc-page-header`.

## Related

- `section-header` — the h2 band heading inside a page.
- `page-tabs` — the second-level navigation strip that sits above a detail page's header.
- `button` — the usual content of the `actions` slot (outlined, `size="medium"`).

## Best practices

- One PageHeader per page; it renders the page's only h1.
- Put the Documentation link first and the create action on the outer edge, both outlined at the medium size.
- Do not set `class="w-full"` on the action buttons; the header makes them full width on a phone.
- Set `titleId` when a form or landmark names itself with `aria-labelledby`.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import PageHeader from '@aziontech/webkit/page-header'
</script>

<template>
  <PageHeader
    title="Resources"
    description="View and manage your resources."
  >
    <template #actions>
      <Button
        label="Documentation"
        icon="pi pi-book"
        kind="outlined"
        size="medium"
        href="https://example.com/docs/resources"
        target="_blank"
      />
      <Button
        label="Create Resource"
        icon="pi pi-plus"
        kind="outlined"
        size="medium"
      />
    </template>
  </PageHeader>
</template>
```

## Props

| Prop          | Type                             | Default    | Required | JSDoc                                                                         |
| ------------- | -------------------------------- | ---------- | -------- | ----------------------------------------------------------------------------- |
| `title`       | `string`                         | `—`        | true     | The page title, rendered as the page h1.                                      |
| `description` | `string`                         | `''`       | false    | One sentence under the title that says what the page is for.                  |
| `size`        | `'small' \| 'medium' \| 'large'` | `'medium'` | false    | Heading scale of the title.                                                   |
| `titleId`     | `string`                         | `''`       | false    | Id set on the h1, so a landmark or form can name itself with aria-labelledby. |

## Events

| _none_ | — | — |

## Slots

| Slot          | Scope | Notes                                                                                   |
| ------------- | ----- | --------------------------------------------------------------------------------------- |
| `description` | —     | Rich description content (links, inline buttons); replaces the `description` prop.      |
| `actions`     | —     | The actions the page owns, Documentation first and the create action on the outer edge. |

## States

- Visual states: `default`
- `data-size` mirrors the `size` prop on the root and the h1
- Responsive: the root is the `@container/page-header`. Below `@md` of its own box the actions drop under the copy and each one stretches to the full width; from `@md` they sit beside the title at their own width. A header inside a drawer or a split view lays out for that box, not the window.

## Motion & Animations

_none_

## Tokens

| Region           | Token (DESIGN.md)                                                                     |
| ---------------- | ------------------------------------------------------------------------------------- |
| title typography | `.text-heading-xs` (small) · `.text-heading-sm` (medium) · `.text-heading-lg` (large) |
| title text       | `var(--text-default)`                                                                 |
| description      | `.text-body-sm` · `var(--text-muted)`                                                 |
| row gap          | `var(--spacing-md)`                                                                   |
| copy gap         | `var(--spacing-xxs)`                                                                  |
| actions gap      | `var(--spacing-sm)`                                                                   |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the controls in the `actions` slot.
- Keyboard map: `Tab` moves through the actions in DOM order; the header itself is not interactive.
- ARIA: the root is a `header` element and the title is the page's only `h1`; `titleId` lets a form or landmark reference it with `aria-labelledby`.
- Contrast ≥4.5:1 for the title and the muted description.
- Touch target: the actions keep the Button sizes; on a phone they stretch to full width.

## Stories (Storybook)

- ListPage — medium title with the Documentation and create actions.
- SettingsPage — small title, no actions.
- Sizes — every `size` value stacked.
- RichDescription — the `description` slot with inline buttons; justified because a hub description carries inline controls.

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
