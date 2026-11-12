# Webkit Provider

> Sets the language and text direction of every WebKit component below it. It wraps the app once, at the root, with the user's BCP 47 locale: components then read their built-in strings (close buttons, pagination, empty states, assistive labels) from the locale catalog and format dates, numbers, file sizes, relative times and plurals with `Intl` for that locale. English is built in; Portuguese (`@aziontech/webkit/locales/pt-BR`) and Spanish (`@aziontech/webkit/locales/es`) are separate entries the app imports and passes through `catalogs`, so an English-only app does not ship them. The catalogs are static imports, so the server and the client render the same strings and hydration never flips after the first render. Digits are Latin unless the tag picks a numbering system (`ar-u-nu-arab`): engines ship different CLDR defaults (Node and Chromium format `ar` with Latin digits, Safari with Arabic-Indic ones), so every `Intl` formatter receives the tag through `intlLocale`, and server and client render the same text. With no provider mounted every component falls back to English. It also carries the reference time of relative times (`now`), so a page that must render the same text on the server and the client, or an example, fixes it once instead of on every cell. The element it renders carries `lang` and `dir`.

- Import: `import WebkitProvider from '@aziontech/webkit/webkit-provider'`
- Category: utils · Surface: product · Structure: monolithic
- API as JSON: [webkit-provider.json](https://github.com/aziontech/webkit/blob/main/.specs/webkit-provider.json)

## When to use

- Once at the root of every app, with the locale the user chose (`pt-BR`, `en`, `es`) and the catalogs of the languages the app offers.
- Around one region that must read in another language than the rest of the page (a preview of an email in the customer's language).
- To rename a built-in string for the whole app (`messages`), instead of passing the same label prop to every instance.

## Do

- Mount one `WebkitProvider` at the app root and pass the locale the user chose; do not nest one per page.
- Register every language the app offers in `catalogs` (`{ 'pt-BR': ptBR, es }`), imported from `@aziontech/webkit/locales/<tag>`; a `pt-BR` or `es` locale with no registered catalog falls back to English and warns once in development.
- Use a full BCP 47 tag (`pt-BR`, not `pt`); a tag with no registered catalog falls back to the same language, then to English.
- Override built-in strings through `messages` (partial, deep-merged), not by forking components.
- Leave `dir` on `auto`: Arabic, Hebrew, Persian and Urdu locales turn the subtree right-to-left.
- Leave `now` unset in an app: relative times then read the real clock and `Table.CellTime` re-renders every minute. Set it to a fixed moment where the text must not depend on when it renders: an example or a test (`const NOW = Date.UTC(2026, 10, 10, 12)`, sample dates counted back from it), or a server render whose markup the browser hydrates. Never compute that moment from `Date.now()` / `new Date()` in setup: the server and the browser read different clocks.

## Don’t

- Translating your own product copy (titles, descriptions, button labels you pass in) → keep it in your app's own i18n; the provider only covers the strings WebKit ships.
- Changing one instance's label → pass the component's label prop (`aria-label`, `confirm-label`); a prop always wins over the catalog.
- Only flipping the layout for a right-to-left language → still use the provider with that locale; `dir` follows it.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- use-locale` — the composable components use to read the active locale, translate a key and format with `Intl`; use it in your own components to match WebKit's formatting.
- [pagination](pagination.md) — reads its labels and the "Showing x to y of z" line from the catalog.
- [confirm-dialog](confirm-dialog.md) — reads Confirm and Cancel from the catalog when no label is passed.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `locale` | `string` | `'en'` | false | BCP 47 locale of everything below the provider; picks the catalog from `catalogs` (English is built in) and the `Intl` formats. |
| `catalogs` | `Record<string, Messages>` | `undefined` | false | Extra catalogs keyed by locale tag, imported from `@aziontech/webkit/locales/<tag>` (`{ 'pt-BR': ptBR, es }`); a locale with no catalog falls back to English. |
| `messages` | `PartialMessages` | `undefined` | false | Partial catalog deep-merged over the built-in one, keyed by component group (`{ pagination: { next: 'Seguinte' } }`). |
| `dir` | `'ltr' \| 'rtl' \| 'auto'` | `'auto'` | false | Text direction of the subtree; `auto` derives it from the locale (`ar`, `he`, `fa`, `ur` are right-to-left). |
| `now` | `string \| number \| Date` | `undefined` | false | Reference time for every relative time below the provider (`Table.CellTime`, `useLocale().formatRelativeTime`, the day groups of `ConversationHistory`, the relative ranges of `DateRangePicker` when their own `now` is unset); unset reads the real clock, ticking each minute. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The app, or the part of it that shares this locale. |

## States

- No visual states; the root carries `lang` (the locale) and `dir` (`ltr` | `rtl`).
- `now` set: every relative time below reads it instead of the real clock; changing it re-renders them. An empty or unparseable value reads the real clock.

## Accessibility

- `lang` on the root lets screen readers pick the right voice and pronunciation (WCAG 3.1.1 / 3.1.2).
- `dir` on the root mirrors reading order for right-to-left languages.
- Overlays that teleport to `body` (Dialog, Drawer, Popover, Tooltip, DropdownMenu, Select, MultiSelect, Toaster, Calendar, PropertyFilter, NavigationMenu.Portal, the doc overlays) read the provider through `usePortalLocale()` (`@aziontech/webkit/use-locale`) and set the same `dir` and `lang` on their teleported root, so they do not fall back to the document's direction and language. A consumer's own `<Teleport>` does the same with `v-bind="usePortalLocale().value"` on its root.
- Every assistive label WebKit ships (close buttons, pagination, sort state, empty states) is read in the provider's language.
- No focusable element of its own; it adds no role and no landmark.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import PaginationRoot from '@aziontech/webkit/pagination-root'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'
  import { ref } from 'vue'

  const page = ref(1)
  const open = ref(false)
</script>

<template>
  <WebkitProvider
    locale="pt-BR"
    :catalogs="{ 'pt-BR': ptBR }"
  >
    <div class="flex flex-col gap-(--spacing-md)">
      <PaginationRoot
        v-model:page="page"
        :total="120"
      />
      <ConfirmDialog
        v-model:open="open"
        title="Remover domínio"
        description="shop.example.com deixa de responder por este recurso."
        @confirm="open = false"
      >
        <template #trigger>
          <Button
            label="Remover domínio"
            kind="outlined"
            size="medium"
          />
        </template>
      </ConfirmDialog>
    </div>
  </WebkitProvider>
</template>
```

### CustomMessages

```vue
<script setup>
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import PaginationRoot from '@aziontech/webkit/pagination-root'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'

  const messages = {
    pagination: { info: '{start}–{end} de {total} domínios' }
  }
</script>

<template>
  <WebkitProvider
    locale="pt-BR"
    :catalogs="{ 'pt-BR': ptBR }"
    :messages="messages"
  >
    <PaginationRoot :total="48" />
  </WebkitProvider>
</template>
```

### RightToLeft

```vue
<script setup>
  import PaginationRoot from '@aziontech/webkit/pagination-root'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'
</script>

<template>
  <WebkitProvider locale="ar">
    <PaginationRoot :total="48" />
  </WebkitProvider>
</template>
```
