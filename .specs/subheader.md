---
name: subheader
category: layout
structure: monolithic
status: implemented
checksum: 3489bd4583d18f527d2f4bf744f3082069944aa316c612819faa5b47addb8441
spec_version: 7
template: 2
created: 2026-11-10
last_updated: 2026-11-25
---

# Subheader — Component Spec

## Purpose

The heading of one band inside a page: an h2 with a one-line description, a copy-link button that appears when the heading is hovered or focused (when it has an `anchor`), and the band's own actions on the right. Below `md` the actions drop under the copy.

## When to use

- Use Subheader for the h2 heading of one band inside a console page; for marketing pages use ModuleHeader, and for a settings band use SettingsGroup.
- A band of a page that holds a card, a table or a list: Payment information on Billing, Get started on a resource, General in a create form.
- A band that someone should be able to link to (`anchor`).

## When NOT to use

- The page title → use `page-header`.
- A settings band whose guidance sits in a Hint and whose body is a card of setting rows → use `settings-group`.

## Related

- `page-header` — the page's h1.
- `settings-group` — the settings band with a Hint, a gutter copy-link and an optional disclosure; use it, not this, for a band of `SettingsRow`s.
- `module-header` — the marketing section heading (centred, left or horizontal); use it on site pages, this one in the console.
- `copy-button` — the copy-link affordance it renders, with the `az az-link` glyph that `settings-group` uses for the same action.

## Best practices

- Keep the description to one sentence; put longer guidance in the band body.
- Set `anchor` on bands people link to, so the h2 takes the id and the copy-link button appears.
- Keep band actions to one or two outlined medium buttons.
- Help for a band: the `description` first (level A of the in-product help standard). Subheader has no slot on its title line, so it takes no help glyph and never an `Info` link: the page's one `Info` link (`ConsoleLayout.ToolsTrigger`) sits after the h1 in `PageHeader`. A settings band that needs a click-open note uses `SettingsGroup`, whose `hint` renders a `Hint` after its title (level C).

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Subheader from '@aziontech/webkit/subheader'
</script>

<template>
  <Subheader
    title="Payment methods"
    description="Every card on the account. Invoices are charged to the default one."
    anchor="payment-methods"
  >
    <template #actions>
      <Button
        label="Add payment method"
        variant="outline"
        size="medium"
        icon="az az-plus"
      />
    </template>
  </Subheader>
</template>
```

## Props

| Prop          | Type                  | Default    | Required | JSDoc                                                                                                           |
| ------------- | --------------------- | ---------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `title`       | `string`              | `—`        | true     | The band title, rendered as an h2.                                                                              |
| `description` | `string`              | `''`       | false    | One sentence under the title.                                                                                   |
| `size`        | `'small' \| 'medium'` | `'medium'` | false    | Kept for compatibility: in the console type set (CT-1) both sizes render the title at 14px medium.              |
| `anchor`      | `string`              | `''`       | false    | Id of the h2 that a hash link targets; when set, a copy-link button appears beside the title on hover or focus. |

## Events

| _none_ | — | — |

## Slots

| Slot          | Scope | Notes                                                                                                                          |
| ------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------ |
| `description` | —     | Rich description content (links, inline code); replaces the `description` prop.                                                |
| `actions`     | —     | The band's own actions, on the right of the copy.                                                                              |
| `info`        | —     | An affordance right after the title and outside the h2, before the copy-link: a help button that opens the page's `HelpPanel`. |

## States

- Visual states: `default`, `hover` / `focus-within` (reveals the copy-link button)
- `data-size` mirrors the `size` prop on the root and the h2
- Responsive: the root is the `@container/subheader`; the actions take the full width under the copy below `@md` of the box and sit beside it from `@md`.
- Hover-free devices: the copy-link stays visible where the primary pointer cannot hover (`@media (hover: none)`), so it is never a hover-only affordance.

## Motion & Animations

| Trigger                      | Animation / Transition                     | Token (see `contributing/docs/TOKENS.md` § Animations) | Reduced-motion fallback         |
| ---------------------------- | ------------------------------------------ | ------------------------------------------------------ | ------------------------------- |
| heading hover / focus-within | `transition-opacity duration-150 ease-out` | inline (matches catalog)                               | `motion-reduce:transition-none` |

## Tokens

| Region         | Token (TOKENS.md)                                                                         |
| -------------- | ----------------------------------------------------------------------------------------- |
| title          | `.text-title-sm` (14px medium, both sizes; console type set CT-1) · `var(--text-default)` |
| description    | `.text-body-sm` · `var(--text-muted)`                                                     |
| inline padding | none: the title starts on the same edge as the content it heads                           |
| row gap        | `var(--spacing-md)`                                                                       |
| actions gap    | `var(--spacing-xs)`                                                                       |
| scroll margin  | `var(--spacing-xl)`                                                                       |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: the copy-link `CopyButton` and the actions carry their own focus ring; focusing the copy-link reveals it.
- Keyboard map: `Tab` reaches the `info` slot's controls, the copy-link button, then the actions; `Enter`/`Space` copies the link.
- ARIA: the `info` slot sits outside the h2, so its button's name never joins the heading's name; name it after the topic (`Help: Domains`).
- ARIA: the copy-link button is named "Copy link to the {title} section" and announces "Link copied".
- Contrast ≥4.5:1 for the title and the description.
- `motion-reduce:transition-none` on the reveal.

## Internationalization

| Key                    | English source                     | Override prop |
| ---------------------- | ---------------------------------- | ------------- |
| `subheader.copyLink`   | `Copy link to the {title} section` | —             |
| `subheader.linkCopied` | `Link copied`                      | —             |

- Formatting: none. The `title`, `description` and slots are the consumer's text.

## Right-to-left

- Layout: logical utilities only (`px-`, `gap-`, `justify-between`); the `info` slot and the copy-link follow the title on its inline end, and the actions sit at the inline end of the row.
- Icons: the copy glyph does not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Responsive

- Container queries: the root is `@container/subheader`; the actions take the full width under the copy below `@md` and sit beside it from `@md`.
- Narrow (≤ 640 px or a narrow container): the title wraps (`text-balance`); the `info` slot stays on the title's line.
- Touch: the copy-link stays visible where the pointer cannot hover (`@media (hover: none)`).
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: 10.6 KB gzip for `subheader` in `.size-limit.json` (it carries `CopyButton`).
- Runtime budget: none: static.
- Heavy parts: none.

## Examples

- Default — an anchored heading with one action.
- WithActions — the Billing payment-methods heading.
- Sizes — every `size` value stacked.
- WithInfo — a help button in the `info` slot opening a `HelpPanel` in a non-modal `Drawer`; justified because the slot's place, after the title and outside the h2, is the contract.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + per `variant` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
