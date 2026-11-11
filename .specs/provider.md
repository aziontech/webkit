---
name: provider
category: utils
structure: monolithic
status: implemented
checksum: abfc7da7f467c7b0a6f1246ebebf674f9dbc7105bc238a61f93afc03a55a1422
spec_version: 1
created: 2026-11-11
last_updated: 2026-11-11
---

# WebkitProvider — Component Spec

## Purpose

Sets the language and text direction of every WebKit component below it. It wraps the app once, at the root, with the user's BCP 47 locale: components then read their built-in strings (close buttons, pagination, empty states, assistive labels) from the locale catalog and format dates, numbers, file sizes, relative times and plurals with `Intl` for that locale. With no provider mounted every component falls back to English. The element it renders carries `lang` and `dir`.

## When to use

- Once at the root of every app, with the locale the user chose (`pt-BR`, `en`, `es`).
- Around one region that must read in another language than the rest of the page (a preview of an email in the customer's language).
- To rename a built-in string for the whole app (`messages`), instead of passing the same label prop to every instance.

## When NOT to use

- Translating your own product copy (titles, descriptions, button labels you pass in) → keep it in your app's own i18n; the provider only covers the strings WebKit ships.
- Changing one instance's label → pass the component's label prop (`aria-label`, `confirm-label`); a prop always wins over the catalog.
- Only flipping the layout for a right-to-left language → still use the provider with that locale; `dir` follows it.

## Related

- `use-locale` — the composable components use to read the active locale, translate a key and format with `Intl`; use it in your own components to match WebKit's formatting.
- `pagination` — reads its labels and the "Showing x to y of z" line from the catalog.
- `confirm-dialog` — reads Confirm and Cancel from the catalog when no label is passed.

## Best practices

- Mount one `WebkitProvider` at the app root and pass the locale the user chose; do not nest one per page.
- Use a full BCP 47 tag (`pt-BR`, not `pt`); a tag with no built-in catalog falls back to the same language, then to English.
- Override built-in strings through `messages` (partial, deep-merged), not by forking components.
- Leave `dir` on `auto`: Arabic, Hebrew, Persian and Urdu locales turn the subtree right-to-left.

## Usage

```vue
<script setup>
  import WebkitProvider from '@aziontech/webkit/provider'
  import Pagination from '@aziontech/webkit/pagination'
</script>

<template>
  <WebkitProvider locale="pt-BR">
    <Pagination :total="120" />
  </WebkitProvider>
</template>
```

## Props

| Prop       | Type                       | Default     | Required | JSDoc                                                                                                                    |
| ---------- | -------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `locale`   | `string`                   | `'en'`      | false    | BCP 47 locale of everything below the provider; picks the built-in catalog (`en`, `pt-BR`, `es`) and the `Intl` formats. |
| `messages` | `PartialMessages`          | `undefined` | false    | Partial catalog deep-merged over the built-in one, keyed by component group (`{ pagination: { next: 'Seguinte' } }`).    |
| `dir`      | `'ltr' \| 'rtl' \| 'auto'` | `'auto'`    | false    | Text direction of the subtree; `auto` derives it from the locale (`ar`, `he`, `fa`, `ur` are right-to-left).             |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                               |
| --------- | ----- | --------------------------------------------------- |
| `default` | —     | The app, or the part of it that shares this locale. |

## States

- No visual states; the root carries `lang` (the locale) and `dir` (`ltr` | `rtl`).

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
| ------ | ----------------- |
| _none_ | —                 |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- `lang` on the root lets screen readers pick the right voice and pronunciation (WCAG 3.1.1 / 3.1.2).
- `dir` on the root mirrors reading order for right-to-left languages.
- Every assistive label WebKit ships (close buttons, pagination, sort state, empty states) is read in the provider's language.
- No focusable element of its own; it adds no role and no landmark.

## Stories (Storybook)

- Default — Pagination and a ConfirmDialog in Portuguese.
- CustomMessages — `messages` overrides one built-in string; justified because the override is the provider's second job.
- RightToLeft — `locale="ar"` turns the subtree right-to-left; justified because `dir` is derived from the locale.

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
