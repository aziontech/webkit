---
name: webkit-provider
category: utils
structure: monolithic
status: implemented
checksum: e3d99a8a34298c9c52644eb402439fba480fc726b766e41438944b947088c7c3
spec_version: 5
created: 2026-11-11
last_updated: 2026-11-15
---

# WebkitProvider — Component Spec

## Purpose

Sets the language and text direction of every WebKit component below it. It wraps the app once, at the root, with the user's BCP 47 locale: components then read their built-in strings (close buttons, pagination, empty states, assistive labels) from the locale catalog and format dates, numbers, file sizes, relative times and plurals with `Intl` for that locale. English is built in; Portuguese (`@aziontech/webkit/locales/pt-BR`) and Spanish (`@aziontech/webkit/locales/es`) are separate entries the app imports and passes through `catalogs`, so an English-only app does not ship them. The catalogs are static imports, so the server and the client render the same strings and hydration never flips after the first render. Digits are Latin unless the tag picks a numbering system (`ar-u-nu-arab`): engines ship different CLDR defaults (Node and Chromium format `ar` with Latin digits, Safari with Arabic-Indic ones), so every `Intl` formatter receives the tag through `intlLocale`, and server and client render the same text. By default everything follows the person's device: an unset `locale` (and every component with no provider mounted) uses the device locale (`navigator.language`) for the `Intl` formats and picks its catalog when one is registered, falling back to English text. The server cannot know the device, so the server render and the hydrating client render `en-US`, and the device locale applies right after mount; an explicit `locale` (the user's saved choice) renders the same on both from the start. Only what people read follows the device: values that components hand back through `v-model` stay unambiguous (Calendar a `Date`, DateRangePicker ISO 8601 instants, TagEditor `key`/`value` pairs). It also carries the reference time of relative times (`now`), so a page that must render the same text on the server and the client, or an example, fixes it once instead of on every cell. The element it renders carries `lang` and `dir`.

## When to use

- Once at the root of every app, with the catalogs of the languages the app offers; pass `locale` when the user chose one (`pt-BR`, `en`, `es`), leave it unset to follow the device.
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

- Mount one `WebkitProvider` at the app root and pass the locale the user chose, or leave it unset to follow the device; do not nest one per page.
- Register every language the app offers in `catalogs` (`{ 'pt-BR': ptBR, es }`), imported from `@aziontech/webkit/locales/<tag>`; a `pt-BR` or `es` locale with no registered catalog falls back to English and warns once in development.
- Use a full BCP 47 tag (`pt-BR`, not `pt`); a tag with no registered catalog falls back to the same language, then to English.
- Override built-in strings through `messages` (partial, deep-merged), not by forking components.
- Leave `dir` on `auto`: Arabic, Hebrew, Persian and Urdu locales turn the subtree right-to-left (a device locale does so only when its catalog is registered, so English text never reads right-to-left).
- Leave `now` unset in an app: relative times then read the real clock and `Table.CellTime` re-renders every minute. Set it to a fixed moment where the text must not depend on when it renders: an example or a test (`const NOW = Date.UTC(2026, 10, 10, 12)`, sample dates counted back from it), or a server render whose markup the browser hydrates. Never compute that moment from `Date.now()` / `new Date()` in setup: the server and the browser read different clocks.

## Usage

```vue
<script setup>
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import Pagination from '@aziontech/webkit/pagination'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'
</script>

<template>
  <WebkitProvider
    locale="pt-BR"
    :catalogs="{ 'pt-BR': ptBR }"
  >
    <Pagination :total="120" />
  </WebkitProvider>
</template>
```

## Props

| Prop       | Type                       | Default     | Required | JSDoc                                                                                                                                                                                                                                                                             |
| ---------- | -------------------------- | ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `locale`   | `string`                   | `''`        | false    | BCP 47 locale of everything below the provider; picks the catalog from `catalogs` (English is built in) and the `Intl` formats. Empty follows the device locale, `en-US` on the server and until mount.                                                                           |
| `catalogs` | `Record<string, Messages>` | `undefined` | false    | Extra catalogs keyed by locale tag, imported from `@aziontech/webkit/locales/<tag>` (`{ 'pt-BR': ptBR, es }`); a locale with no catalog falls back to English.                                                                                                                    |
| `messages` | `PartialMessages`          | `undefined` | false    | Partial catalog deep-merged over the built-in one, keyed by component group (`{ pagination: { next: 'Seguinte' } }`).                                                                                                                                                             |
| `dir`      | `'ltr' \| 'rtl' \| 'auto'` | `'auto'`    | false    | Text direction of the subtree; `auto` derives it from the locale (`ar`, `he`, `fa`, `ur` are right-to-left).                                                                                                                                                                      |
| `now`      | `string \| number \| Date` | `undefined` | false    | Reference time for every relative time below the provider (`Table.CellTime`, `useLocale().formatRelativeTime`, the day groups of `ConversationHistory`, the relative ranges of `DateRangePicker` when their own `now` is unset); unset reads the real clock, ticking each minute. |
| `timeZone` | `string`                   | `''`        | false    | IANA time zone every `Timestamp` below the provider shows its local time in, and every `DateRangePicker` with no `v-model:time-zone` formats in (`America/New_York`, `UTC`), for an app-wide time zone picker; empty reads the browser's zone.                                                                                                        |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                               |
| --------- | ----- | --------------------------------------------------- |
| `default` | —     | The app, or the part of it that shares this locale. |

## States

- No visual states; the root carries `lang` (the locale) and `dir` (`ltr` | `rtl`).
- `locale` unset: `lang` and the formats are `en-US` in the server render and during hydration, then the device locale after mount.
- `now` set: every relative time below reads it instead of the real clock; changing it re-renders them. An empty or unparseable value reads the real clock.
- `timeZone` set: every `Timestamp` below shows its local time in that zone and renders it on the server too, and every `DateRangePicker` without its own `timeZone` formats and edits its range in it; `useLocale().formatDate` and the other formatters are unchanged. Empty reads the browser's zone after mount.

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
- Overlays that teleport to `body` (Dialog, Drawer, Popover, Tooltip, DropdownMenu, Select, MultiSelect, Toaster, DatePicker, DateRangePicker, PropertyFilter, NavigationMenu.Viewport, the doc overlays) read the provider through `usePortalLocale()` (`@aziontech/webkit/use-locale`) and set the same `dir` and `lang` on their teleported root, so they do not fall back to the document's direction and language. A consumer's own `<Teleport>` does the same with `v-bind="usePortalLocale().value"` on its root.
- Every assistive label WebKit ships (close buttons, pagination, sort state, empty states) is read in the provider's language.
- No focusable element of its own; it adds no role and no landmark.

## Examples

- Default — Pagination and a ConfirmDialog in Portuguese, with the pt-BR catalog registered.
- CustomMessages — `messages` overrides one built-in string; justified because the override is the provider's second job.
- Rtl — `locale="ar"` turns the subtree right-to-left; justified because `dir` is derived from the locale.
- DeviceLocale — no `locale`: a DateRangePicker prints dates in the device's language and format while its `v-model` keeps ISO 8601 instants; justified because following the device is the provider's default.
- `now` is shown by `table/cell-presets` (a fixed reference around a table whose `Table.CellTime` cells count back from it), not by a provider example of its own.
- `timeZone` is shown by `timestamp/time-zone` (a time zone picker bound to the provider around a few timestamps), not by a provider example of its own.

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
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
