---
name: page-header
category: layout
structure: monolithic
status: implemented
checksum: ec76194f793c8c9ac101fc1b127f7b9f42d1373c283976f938535e9b99bd6f01
spec_version: 9
template: 2
created: 2026-11-10
last_updated: 2026-11-23
---

# PageHeader — Component Spec

## Purpose

The heading that opens a console page: an h1 in the console type set: 16px medium on a top-level page, 14px semibold on a deeper page (one with `breadcrumbs`, or `size="small"`), a one-line description, and the actions the page owns on the right. When the row runs out of room the actions move below the copy together; on a phone they stack, each at full width. Four optional regions complete a detail page's header without local markup: a `breadcrumbs` trail above the title, an `icon` before it, `meta` (a status tag, a version) beside it, and `tabs` across the bottom. It replaces the header markup every list, detail, settings and create page used to copy by hand.

## When to use

- Use PageHeader once per console page for the h1, description and page actions; a band inside the page uses Subheader.
- The top of any console page: a first-level list (`medium`), a detail tab or settings sub-page (`small`), a creation hub headline (`large`).
- A page that owns actions (Documentation, a create action) that belong next to its title.
- A resource detail page whose header carries the trail back to the list, the resource's icon, its status and the tabs of its sections (`breadcrumbs`, `icon`, `meta`, `tabs`).

## When NOT to use

- The heading of one band inside a page → use `subheader`.
- A settings band with a Hint and a card of rows → use `settings-group`.
- A documentation page heading → use `doc-page-header`.

## Related

- `subheader` — the h2 band heading inside a page.
- `page-tabs` — the second-level navigation strip that sits above a detail page's header; a header-local tab row goes in the `tabs` slot.
- `breadcrumb` — the usual content of the `breadcrumbs` slot.
- `tag` — the usual content of the `meta` slot (a status, an environment, a version).
- `console-layout` — `ConsoleLayout.ToolsTrigger`, the page's `Info` link, goes first in the `meta` slot and opens the page's `HelpPanel` in the layout's tools region.
- `button` — the usual content of the `actions` slot (`size="medium"`; the create action primary, the others outlined).

## Best practices

- One PageHeader per page; it renders the page's only h1.
- Put the Documentation link first and the create action on the outer edge. Every action is `size="medium"`, so the row keeps one height; the create action is `variant="primary"`, Documentation and the others `variant="outline"` (`webkit/consistent-header-action-size`).
- Do not set `class="w-full"` on the action buttons; the header makes them full width on a phone.
- Set `titleId` when a form or landmark names itself with `aria-labelledby`.
- `breadcrumbs`: pass a `Breadcrumb` with `items`; its last entry is the current page and should match the title.
- `icon`: one decorative glyph or a square `Avatar`, at most 32 px; it is `aria-hidden` by default, since the title already names the page.
- `meta`: one or two small `Tag`s (status, environment). Longer facts (owner, created date) belong in the page body, not the header.
- Page help: put `ConsoleLayout.ToolsTrigger` first in `meta`, so the `Info` link sits right after the title on the same line and opens the page's `HelpPanel` in the console's tools region. One per page. Never a boxed `IconButton`, a typed `?` or a `Tooltip` beside the title; a one-line explanation is the `description`.
- `tabs`: a `Tabs` row of the page's sections. A page that already shows `PageTabs` above the header leaves this slot empty; never both.

## Usage

```vue
<script setup>
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const tab = ref('overview')
</script>

<template>
  <PageHeader
    title="Resources"
    description="View and manage your resources."
  >
    <template #actions>
      <Button
        label="Documentation"
        icon="az az-book"
        variant="outline"
        size="medium"
        href="https://example.com/docs/resources"
        target="_blank"
      />
      <Button
        label="Create Resource"
        icon="az az-plus"
        variant="primary"
        size="medium"
      />
    </template>
  </PageHeader>

  <!-- A resource detail header: trail, icon, status and section tabs -->
  <PageHeader
    title="acme-store"
    description="Storefront served from three regions."
  >
    <template #breadcrumbs>
      <Breadcrumb :items="[{ label: 'Resources', href: '/resources' }, { label: 'acme-store' }]" />
    </template>
    <template #icon>
      <i class="az az-box" />
    </template>
    <template #meta>
      <Tag
        label="Active"
        severity="success"
        size="small"
      />
    </template>
    <template #tabs>
      <Tabs v-model="tab">
        <Tabs.List>
          <Tabs.Trigger
            value="overview"
            label="Overview"
          />
          <Tabs.Trigger
            value="settings"
            label="Settings"
          />
        </Tabs.List>
      </Tabs>
    </template>
  </PageHeader>
</template>
```

## Props

| Prop          | Type                             | Default    | Required | JSDoc                                                                            |
| ------------- | -------------------------------- | ---------- | -------- | -------------------------------------------------------------------------------- |
| `title`       | `string`                         | `—`        | true     | The page title, rendered as the page h1.                                         |
| `description` | `string`                         | `''`       | false    | One sentence under the title that says what the page is for.                     |
| `size`        | `'small' \| 'medium' \| 'large'` | `'medium'` | false    | `small` marks a deeper page (14px semibold title); `medium` and `large` are 16px |
| `titleId`     | `string`                         | `''`       | false    | Id set on the h1, so a landmark or form can name itself with aria-labelledby.    |

## Events

| _none_ | — | — |

## Slots

| Slot          | Scope | Notes                                                                                                                                                                 |
| ------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `description` | —     | Rich description content (links, inline buttons); replaces the `description` prop.                                                                                    |
| `actions`     | —     | The actions the page owns, Documentation first and the create action on the outer edge.                                                                               |
| `breadcrumbs` | —     | The trail back to the parent pages, above the title row; usually a `Breadcrumb` with `items`.                                                                         |
| `icon`        | —     | A leading glyph or square avatar before the title, decorative (`aria-hidden`).                                                                                        |
| `meta`        | —     | Short facts beside the title, such as a status `Tag`, and the page's `Info` link (`ConsoleLayout.ToolsTrigger`, first); wraps under the title when the row is narrow. |
| `tabs`        | —     | The tabs of the page's sections, across the full width under the title and actions.                                                                                   |

## States

- Visual states: `default`
- `data-size` mirrors the `size` prop on the root and the h1
- `data-nested` on the h1 when the page is a deeper page (a `breadcrumbs` slot, or `size="small"`)
- Each region renders only when its slot is filled: `__breadcrumbs` (a full-width row above the title row), `__icon` (before the h1, `aria-hidden`), `__meta` (after the h1 on the same line, wrapping under it), `__tabs` (a full-width row after the copy and the actions). With no region slot the header renders exactly as before.
- Responsive: the root is the `@container/page-header`. Below `@md` of its own box the actions drop under the copy and each one stretches to the full width; from `@md` they sit beside the title at their own width. A header inside a drawer or a split view lays out for that box, not the window.

## Motion & Animations

_none_

## Tokens

| Region           | Token (DESIGN.md)                                                      |
| ---------------- | ---------------------------------------------------------------------- |
| title typography | `.text-title-md` (top-level page) · `.text-title-nested` (deeper page) |
| title text       | `var(--text-default)`                                                  |
| description      | `.text-body-sm` · `var(--text-muted)`                                  |
| row gap          | `var(--spacing-md)`                                                    |
| copy gap         | `var(--spacing-2xs)`                                                   |
| actions gap      | `var(--spacing-sm)`                                                    |
| icon             | `var(--text-muted)` · `.text-title-md` glyph size                      |
| title-row gap    | `var(--spacing-xs)` (icon, title, meta)                                |
| breadcrumb, tabs | full-width rows separated by the row gap, `var(--spacing-md)`          |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the controls in the `actions` slot.
- Keyboard map: `Tab` moves through the actions in DOM order; the header itself is not interactive.
- ARIA: the root is a `header` element and the title is the page's only `h1`. The `h1` carries `tabindex="-1"` and no focus ring (`outline-none`): it is not a tab stop, but a router or a page can move focus to it on navigation so a screen reader announces the page (the console keyboard standard, `rules/webkit-keyboard.md`); it is a heading, not a control, so it draws no ring; `titleId` lets a form or landmark reference it with `aria-labelledby`. The breadcrumb comes first in reading order (its own `nav` landmark), then the h1, the meta, the description, the actions and the tabs. The icon wrapper is `aria-hidden`.
- Keyboard map with regions: `Tab` reaches the breadcrumb links, then the actions, then the tabs (which own their arrow-key model).
- Contrast ≥4.5:1 for the title and the muted description.
- Touch target: the actions keep the Button sizes; on a phone they stretch to full width.

## Internationalization

No built-in strings: the title, description and every region come from the consumer.

- Formatting: none

## Right-to-left

- Layout: flex order and logical utilities only, so the icon leads the title and the actions trail under `dir="rtl"`.
- Icons: the `icon` region is consumer content; the header mirrors nothing itself.
- Keyboard: no arrow-key logic in the header; the tabs in the `tabs` slot own theirs.
- User data: the title is consumer text; a resource name in another script can be wrapped in `bdi` by the consumer.

## Responsive

- Container queries: the root is `@container/page-header`; below `@md` the actions drop under the copy at full width.
- Narrow (≤ 640 px or a narrow container): the meta wraps under the title; the breadcrumb collapses on its own (`Breadcrumb` `items` mode); the tabs row scrolls inside `Tabs`.
- Touch: the actions keep the Button sizes; no hover-only affordance.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: 1.1 KB gzip for `page-header` in `.size-limit.json`; the regions are slots, so the header imports no other component.
- Runtime budget: none: static.
- Heavy parts: none.

## Examples

- ListPage — medium title with the Documentation and create actions.
- SettingsPage — small title, no actions.
- Sizes — every `size` value stacked.
- DetailPage — justified: the `breadcrumbs`, `icon`, `meta` and `tabs` regions only appear together on a resource detail header, which none of the other examples shows.
- RichDescription — the `description` slot with inline buttons; justified because a hub description carries inline controls.
- WithInfo — `ConsoleLayout.ToolsTrigger` first in `meta`, the `Info` link right after the title; justified because page help is placed through this slot and no other example shows it.

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
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
