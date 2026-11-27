# Config Provider

> Sets the language, text direction, reference clock and time zone of every Azion UI component below it. It wraps the app once, at the root, with the user's BCP 47 locale: components then read their built-in strings (close buttons, pagination, empty states, assistive labels) from the locale catalog and format dates, numbers, file sizes, relative times and plurals with `Intl` for that locale. English is built in; Portuguese (`@aziontech/ui/locales/pt-BR`) and Spanish (`@aziontech/ui/locales/es`) are separate entries the app imports and passes through `catalogs`, so an English-only app does not ship them. The catalogs are static imports, so the server and the client render the same strings and hydration never flips after the first render. Digits are Latin unless the tag picks a numbering system (`ar-u-nu-arab`): engines ship different CLDR defaults (Node and Chromium format `ar` with Latin digits, Safari with Arabic-Indic ones), so every `Intl` formatter receives the tag through `intlLocale`, and server and client render the same text. By default everything follows the person's device: an unset `locale` (and every component with no provider mounted) uses the device locale (`navigator.language`) for the `Intl` formats and picks its catalog when one is registered, falling back to English text. The server cannot know the device, so the server render and the hydrating client render `en-US`, and the device locale applies right after mount; an explicit `locale` (the user's saved choice) renders the same on both from the start. Only what people read follows the device: values that components hand back through `v-model` stay unambiguous (Calendar a `Date`, DateRangePicker ISO 8601 instants, TagEditor `key`/`value` pairs). It also carries the reference time of relative times (`now`), so a page that must render the same text on the server and the client, or an example, fixes it once instead of on every cell. The element it renders carries `lang` and `dir`.

- Import: `import ConfigProvider from '@aziontech/ui/config-provider'`
- Category: layout · Surface: app · Structure: monolithic
- API as JSON: [config-provider.json](config-provider.json)

## When to use

- Once at the root of every app, with the catalogs of the languages the app offers; pass `locale` when the user chose one (`pt-BR`, `en`, `es`), leave it unset to follow the device.
- Around one region that must read in another language than the rest of the page (a preview of an email in the customer's language).
- To rename a built-in string for the whole app (`messages`), instead of passing the same label prop to every instance.

## Do

- Mount one `ConfigProvider` at the app root and pass the locale the user chose, or leave it unset to follow the device; do not nest one per page.
- A nested provider changes only what it sets: every prop it leaves unset (`locale`, `catalogs`, `messages`, `now`, `timeZone`, `dir`) comes from the provider above it, and at the root from the device and the page. A provider placed only for `now` (a fixed sample clock) keeps the app's language, catalogs, overrides and time zone; `catalogs` adds to the ones above and `messages` merges over the overrides above.
- Register every language the app offers in `catalogs` (`{ 'pt-BR': ptBR, es }`), imported from `@aziontech/ui/locales/<tag>`; a `pt-BR` or `es` locale with no registered catalog falls back to English and warns once in development.
- Use a full BCP 47 tag (`pt-BR`, not `pt`); a tag with no registered catalog falls back to the same language, then to English.
- Override built-in strings through `messages` (partial, deep-merged), not by forking components.
- Leave `dir` on `auto`: Arabic, Hebrew, Persian and Urdu locales turn the subtree right-to-left (a device locale does so only when its catalog is registered, so English text never reads right-to-left). With no `locale` and `dir` on `auto` the provider sets no direction of its own: its root carries no `dir`, so a provider placed only for `now` or `timeZone` keeps the direction of the page or the provider around it, and its components read that provider's direction.
- Leave `now` unset in an app: relative times then read the real clock and `TableCellTime` re-renders every minute. Set it to a fixed moment where the text must not depend on when it renders: an example or a test (`const NOW = Date.UTC(2026, 10, 10, 12)`, sample dates counted back from it), or a server render whose markup the browser hydrates. Never compute that moment from `Date.now()` / `new Date()` in setup: the server and the browser read different clocks.

## Don’t

- Translating your own product copy (titles, descriptions, button labels you pass in) → keep it in your app's own i18n; the provider only covers the strings Azion UI ships.
- Changing one instance's label → pass the component's label prop (`aria-label`, `confirm-label`); a prop always wins over the catalog.
- Only flipping the layout for a right-to-left language → still use the provider with that locale; `dir` follows it.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `use-locale` — the composable components use to read the active locale, translate a key and format with `Intl`; use it in your own components to match Azion UI's formatting.
- [pagination](pagination.md) — reads its labels and the "Showing x to y of z" line from the catalog.
- [confirm-dialog](confirm-dialog.md) — reads Confirm and Cancel from the catalog when no label is passed.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `locale` | `string` | `''` | false | BCP 47 locale of everything below the provider; picks the catalog from `catalogs` (English is built in) and the `Intl` formats. Empty inherits the provider above; at the root it follows the device locale, `en-US` on the server and until mount. |
| `catalogs` | `Record<string, Messages>` | `undefined` | false | Extra catalogs keyed by locale tag, imported from `@aziontech/ui/locales/<tag>` (`{ 'pt-BR': ptBR, es }`), added to those of the provider above; a locale with no catalog falls back to English. |
| `messages` | `PartialMessages` | `undefined` | false | Partial catalog deep-merged over the built-in one and the provider above's overrides, keyed by component group (`{ pagination: { next: 'Seguinte' } }`). |
| `dir` | `'ltr' \| 'rtl' \| 'auto'` | `'auto'` | false | Text direction of the subtree; `auto` derives it from `locale` (`ar`, `he`, `fa`, `ur` are right-to-left), and with no `locale` inherits the direction around the provider. |
| `now` | `string \| number \| Date` | `undefined` | false | Reference time for every relative time below the provider (`TableCellTime`, `useLocale().formatRelativeTime`, the day groups of `ConversationHistory`, the relative ranges of `DateRangePicker` when their own `now` is unset); unset inherits the provider above, and at the root reads the real clock, ticking each minute. |
| `timeZone` | `string` | `''` | false | IANA time zone every `Timestamp` below the provider shows its local time in, and every `DateRangePicker` with no `v-model:time-zone` formats in (`America/New_York`, `UTC`), for an app-wide time zone picker; empty inherits the provider above, and at the root reads the browser's zone. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The app, or the part of it that shares this locale. |

## States

- No visual states; the root carries `lang` (the locale) and `dir` (`ltr` | `rtl`) whenever `dir` or `locale` is set; with neither it carries no `dir` and inherits.
- Direction with neither `dir` nor `locale`: a nested provider takes the direction of the provider above; a root provider takes the page's. The page's direction is read after mount from the nearest `dir` around the provider's element, and again when a `dir` attribute changes; the server render and hydration read `ltr` for `useLocale().dir` and write no `dir` anywhere, so the markup never changes on hydration.
- Nested: each unset prop comes from the provider above (`locale`, `dir`, `now`, `timeZone`), `catalogs` add to the ones above and `messages` merge over the overrides above; an explicit prop always wins.
- `locale` unset: `lang` and the formats are `en-US` in the server render and during hydration, then the device locale after mount.
- `now` set: every relative time below reads it instead of the real clock; changing it re-renders them. An empty or unparseable value reads the real clock.
- `timeZone` set: every `Timestamp` below shows its local time in that zone and renders it on the server too, and every `DateRangePicker` without its own `timeZone` formats and edits its range in it; `useLocale().formatDate` and the other formatters are unchanged. Empty reads the browser's zone after mount.

## Accessibility

- `lang` on the root lets screen readers pick the right voice and pronunciation (WCAG 3.1.1 / 3.1.2).
- `dir` on the root mirrors reading order for right-to-left languages.
- Overlays that teleport to `body` (Dialog, Drawer, Popover, Tooltip, DropdownMenu, Select, MultiSelect, Toaster, DatePicker, DateRangePicker, PropertyFilter, NavigationMenu.Viewport, the doc overlays) read the provider through `usePortalLocale()` (`@aziontech/ui/use-locale`) and set the same `dir` and `lang` on their teleported root, so they do not fall back to the document's direction and language. When no provider in the chain sets a direction (no `dir`, no `locale`, no registered right-to-left device locale), `usePortalLocale()` returns no `dir`, and the teleported root inherits the page's direction from `body` (a Drawer with `side="end"` under `<html dir="rtl">` opens on the left). A consumer's own `<Teleport>` does the same with `v-bind="usePortalLocale().value"` on its root.
- Every assistive label Azion UI ships (close buttons, pagination, sort state, empty states) is read in the provider's language.
- No focusable element of its own; it adds no role and no landmark.

## Right-to-left

- Layout: renders one block `div` with no styling of its own; it sets `dir` on it only when `dir` or `locale` asks for one, otherwise the subtree keeps the direction around it.
- Icons: none.
- Keyboard: none of its own; components below read `useLocale().dir` (the resolved direction, the page's after mount when no provider sets one) to swap ArrowLeft and ArrowRight.
- User data: none.

## Internationalization

No built-in strings: the provider renders none. It is the source of the locale, the catalogs and the `Intl` formats every other component reads (`useLocale()`).

| Key | English source | Override prop |
| --- | -------------- | ------------- |
| —   | —              | —             |

- Formatting: none of its own; it hands the locale (`intlLocale`, Latin digits unless the tag picks a numbering system) to every `Intl` formatter below it.

## Responsive

- Container queries: none: the root is an unstyled block wrapper.
- Narrow (≤ 640 px or a narrow container): no change.
- Touch: no interactive element.
- Reflow: adds no width of its own; consumer classes (`class="min-w-0 flex-1"`) reach the root.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/ui/button'
  import ConfigProvider from '@aziontech/ui/config-provider'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import Field from '@aziontech/ui/field'
  import LanguageSelect from '@aziontech/ui/language-select'
  import { es } from '@aziontech/ui/locales/es'
  import { ptBR } from '@aziontech/ui/locales/pt-BR'
  import PaginationRoot from '@aziontech/ui/pagination-root'
  import Select from '@aziontech/ui/select'
  import Timestamp from '@aziontech/ui/timestamp'
  import ToggleGroup from '@aziontech/ui/toggle-group'
  import { ref } from 'vue'

  const NOW = Date.UTC(2026, 10, 14, 12, 10)
  const DEPLOYED_AT = '2026-11-14T12:04:31Z'
  const catalogs = { 'pt-BR': ptBR, es }

  const locale = ref('pt-BR')
  const dir = ref('auto')
  const timeZone = ref('America/Sao_Paulo')
  const page = ref(1)
  const open = ref(false)

  const directions = [
    { label: 'Auto', value: 'auto' },
    { label: 'LTR', value: 'ltr' },
    { label: 'RTL', value: 'rtl' }
  ]

  const zones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/Sao_Paulo', label: 'São Paulo' },
    { value: 'America/New_York', label: 'New York' },
    { value: 'Asia/Tokyo', label: 'Tokyo' }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div class="flex flex-wrap items-end gap-(--spacing-sm)">
      <div class="w-48 max-w-full">
        <Field>
          <Field.Label>Language</Field.Label>
          <LanguageSelect
            v-model="locale"
            size="medium"
          />
        </Field>
      </div>
      <div class="w-44 max-w-full">
        <Field>
          <Field.Label>Time zone</Field.Label>
          <Select
            v-model="timeZone"
            size="medium"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item
                v-for="zone in zones"
                :key="zone.value"
                :value="zone.value"
                >{{ zone.label }}</Select.Item
              >
            </Select.Content>
          </Select>
        </Field>
      </div>
      <div class="flex flex-col gap-(--spacing-2xs)">
        <span class="text-label-md text-(--text-default)">Direction</span>
        <ToggleGroup
          v-model="dir"
          :options="directions"
          aria-label="Direction"
          size="medium"
        />
      </div>
    </div>

    <ConfigProvider
      :locale="locale"
      :catalogs="catalogs"
      :dir="dir"
      :now="NOW"
      :time-zone="timeZone"
    >
      <div
        class="flex flex-col gap-(--spacing-md) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
      >
        <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
          <div class="flex flex-wrap items-baseline gap-(--spacing-xs) text-body-sm">
            <span class="text-(--text-muted)">Last deploy</span>
            <Timestamp :value="DEPLOYED_AT" />
          </div>
          <ConfirmDialog
            v-model:open="open"
            title="Delete domain"
            description="edge.example.com will stop serving traffic for this resource."
            size="small"
            @confirm="open = false"
          >
            <template #trigger>
              <Button
                label="Delete domain"
                variant="outline"
                size="medium"
              />
            </template>
          </ConfirmDialog>
        </div>
        <PaginationRoot
          v-model:page="page"
          :total="120"
        />
      </div>
    </ConfigProvider>
  </div>
</template>
```

### CustomMessages

```vue
<script setup>
  import ConfigProvider from '@aziontech/ui/config-provider'
  import { ptBR } from '@aziontech/ui/locales/pt-BR'
  import PaginationRoot from '@aziontech/ui/pagination-root'

  const messages = {
    pagination: { info: '{start}–{end} de {total} domínios' }
  }
</script>

<template>
  <ConfigProvider
    locale="pt-BR"
    :catalogs="{ 'pt-BR': ptBR }"
    :messages="messages"
  >
    <PaginationRoot :total="48" />
  </ConfigProvider>
</template>
```

### Rtl

```vue
<script setup>
  import ConfigProvider from '@aziontech/ui/config-provider'
  import PaginationRoot from '@aziontech/ui/pagination-root'
</script>

<template>
  <ConfigProvider locale="ar">
    <PaginationRoot :total="48" />
  </ConfigProvider>
</template>
```
