# Language Select

> A searchable picker for the interface language: a `Select` whose trigger and rows show each language's flag and its name in that language (`English`, `Português (Brasil)`, `Español`), with a search box at the top of the list that filters by language name, BCP 47 tag or country. `v-model` holds the BCP 47 tag of the picked language, ready to hand to `ConfigProvider`'s `locale`. It offers the languages WebKit ships catalogs for (`en`, `pt-BR`, `es`) and takes the consumer's own list through `options`. It is the language counterpart of the country picker inside `phone-input`, and reuses its flag sprite and search behaviour.

- Import: `import LanguageSelect from '@aziontech/webkit/language-select'`
- Category: input · Surface: app · Structure: monolithic
- API as JSON: [language-select.json](language-select.json)

## When to use

- A language switch for the whole app or a page: a header, a footer, a settings page or a sign-in screen.
- A form field that asks which language a user, a page or a notification is written in.

## Do

- Bind `v-model` to the same value as `ConfigProvider`'s `locale`, so the picker and the strings move together.
- Name languages in their own language (`Português (Brasil)`, not `Portuguese (Brazil)`): a reader who cannot read the current language still finds theirs.
- Give each option a `country` only when it tells regional variants apart or the tag has no region (`en` → `US`); a flag stands for a country, never for a language on its own, so the name always sits next to it.
- Put it in a `Field` with a `Field.Label` in a form; on a toolbar or a footer, give it an `aria-label` only if the built-in `Language` name does not fit.

## Don’t

- Two or three languages that must stay visible side by side on a toolbar → use `toggle-group`.
- Picking a country (for a phone number, an address) → use `phone-input` or `select`.
- Setting the language of WebKit's own strings → that is `config-provider`'s `locale`; bind this picker's `v-model` to it.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [config-provider](config-provider.md) — takes the picked tag as `locale` and translates everything below it.
- [select](select.md) — the picker this component is built on; use it directly for any other list of choices.
- [phone-input](phone-input.md) — the same flag sprite and searchable list, for the dial code of a phone number.
- [field](field.md) — wraps the picker with a label and a description when it sits in a form.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options` | `LanguageSelectOption[]` | `(the languages WebKit ships — see Notes)` | false | Languages offered, in order: `{ value, label, country? }` where `value` is a BCP 47 tag, `label` the language named in itself, and `country` the ISO 3166-1 alpha-2 code of the flag (taken from the tag's region when omitted). |
| `placeholder` | `string` | `''` | false | Trigger text while no language is picked. Empty uses the locale catalog (`Language`). |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token forwarded to the Select trigger. Heights: small=28px, medium=32px, large=40px. |
| `disabled` | `boolean` | `false` | false | Disables the trigger and keeps the list closed. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the trigger when no Field labels it. Empty uses the locale catalog (`Language`). |
| `searchPlaceholder` | `string` | `''` | false | Placeholder and accessible name of the search box. Empty uses the locale catalog (`Search language`). |
| `emptyTitle` | `string` | `''` | false | Shown in the list when no language matches the search. Empty uses the locale catalog (`No language found.`). |
| `modelValue` | `string` | `''` | false | Two-way value (`v-model`). |

## v-model

| Model | Type | Default | Emits | Notes |
|---|---|---|---|---|
| `v-model` | `string` | `''` | `update:modelValue` | BCP 47 tag of the picked language (`'pt-BR'`). Empty shows the placeholder. Via `defineModel`, so the picker also works unbound. |

## States

- Visual states delegated to `Select`: `default`, `hover`, `focus-visible`, `open`, `disabled`, and the `invalid` / `required` / `disabled` of an enclosing `Field`.
- `data-state="open|closed"` lives on the `Select` trigger; `data-disabled` mirrors `disabled`.
- The trigger shows the picked language's flag in its `#leading` slot and its name as the value, and no tag; with nothing picked it shows the placeholder and no flag.
- `invalid` and `required` have no prop of their own: they come only from an enclosing `Field`, which `Select` reads, and show as the trigger's `data-invalid` / `aria-invalid` and `aria-required`.
- States that cannot occur: `loading` and `error` (the options are static data, never fetched), and `readonly` (no prop; a fixed language is shown as text, or with `select` and its `readonly`).
- An empty `options` array: the trigger still opens, and the list shows only the empty line (`No language found.`).
- Each row shows the flag, the language name, and the BCP 47 tag in muted monospace text at the inline end; the picked row carries the Select's check mark.
- Search: typing in the open list filters by the language name, its tag, its country code, and its name in English and in the active locale (`Intl.DisplayNames`), accent-insensitive. No match shows the empty line as a `role="status"`.
- The flag sprite (`src/images/country-flags.webp`, shared with `phone-input`) loads with a dynamic `import()` after mount in the browser; until it arrives the flag boxes stay blank.

## Accessibility

- Visible focus: the `Select` trigger ring (`focus-visible:ring-(--ring-color)`); inside the list, the active row is highlighted (`data-active`) and announced through `aria-activedescendant` on the search box.
- Keyboard map: `Tab` focuses the trigger; `Enter`, `Space` or `ArrowDown` opens the list with focus in the search box; typing a printable key on the closed trigger opens it and starts the search; `ArrowUp` / `ArrowDown` move the active row; `Home` / `End` jump to the first / last; `Enter` picks and returns focus to the trigger; `Esc` closes and returns focus to the trigger; `Tab` closes the list without picking and focus moves on in page order; `Space` and every other printable key type into the search box and never pick.
- ARIA: the WAI-ARIA APG select-only combobox with a listbox popup: the trigger is the `Select` combobox button with `aria-expanded`, `aria-haspopup="listbox"`, and its name from the enclosing `Field.Label`, else `ariaLabel`, else the catalog (`Language`); rows are `role="option"` with `aria-selected`; the search box inside the listbox popup has an accessible name and drives `aria-activedescendant`; flags are `aria-hidden="true"` (the name carries the meaning).
- Each option row renders the label inside the row with `lang` set to its own tag, so a screen reader reads `Español` with Spanish pronunciation.
- Contrast ≥4.5:1 for names and tags, including the disabled trigger.
- Touch target follows `size` (40px at `large`).

## Right-to-left

- Layout: logical utilities only; the flag sits at the inline start of each row and of the trigger, and the tag at the inline end of each row, so both swap sides under `dir="rtl"`.
- Icons: the flags and the search glyph are not mirrored; the Select chevron is not directional.
- Keyboard: `ArrowUp` / `ArrowDown` move through the vertical list in both directions; no horizontal arrows.
- User data: each tag renders in a `dir="ltr"` span (`pt-BR` keeps its order on a right-to-left page); each option label carries `lang` and `dir="auto"`, so an Arabic or Hebrew name reads right-to-left in a left-to-right list.

## Internationalization

| Key | English source | Override prop |
|---|---|---|
| `languageSelect.label` | `Language` | `placeholder`, `ariaLabel` |
| `languageSelect.search` | `Search language` | `searchPlaceholder` |
| `languageSelect.noMatch` | `No language found.` | `emptyTitle` |

- Formatting: `Intl.DisplayNames` (type `language`) in English and in the active locale, for search keywords only; option labels are never translated, since a language is named in itself.

## Responsive

- Container queries: none: the trigger fills the width its container gives it, like `Select`.
- Narrow (≤ 640 px or a narrow container): the trigger truncates the name with an ellipsis; the open list keeps full names and is at least as wide as its widest row.
- Touch: targets ≥ 24 px (the rows are 32 px; `size="large"` gives a 40 px trigger); on `pointer: coarse` the trigger and every row grow to at least 44 px (`pointer-coarse:min-h-11`); no hover-only affordance.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import Field from '@aziontech/webkit/field'
  import LanguageSelect from '@aziontech/webkit/language-select'
  import { es } from '@aziontech/webkit/locales/es'
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import Pagination from '@aziontech/webkit/pagination-root'
  import { ref } from 'vue'

  const locale = ref('en')
  const page = ref(1)
  const catalogs = { 'pt-BR': ptBR, es }
</script>

<template>
  <ConfigProvider
    :locale="locale"
    :catalogs="catalogs"
  >
    <div class="flex flex-col gap-(--spacing-md)">
      <Field class="max-w-(--container-xs)">
        <Field.Label>Language</Field.Label>
        <LanguageSelect v-model="locale" />
      </Field>
      <Pagination
        v-model:page="page"
        :total="120"
        :page-size="10"
      />
    </div>
  </ConfigProvider>
</template>
```

### Options

```vue
<script setup>
  import LanguageSelect from '@aziontech/webkit/language-select'
  import { ref } from 'vue'

  const locale = ref('en-GB')
  const options = [
    { value: 'en-US', label: 'English (United States)' },
    { value: 'en-GB', label: 'English (United Kingdom)' },
    { value: 'fr-FR', label: 'Français (France)' },
    { value: 'fr-CA', label: 'Français (Canada)' },
    { value: 'de-DE', label: 'Deutsch' },
    { value: 'ja-JP', label: '日本語' },
    { value: 'ar', label: 'العربية', country: 'SA' }
  ]
</script>

<template>
  <LanguageSelect
    v-model="locale"
    :options="options"
    class="max-w-(--container-xs)"
  />
</template>
```

### Sizes

```vue
<script setup>
  import LanguageSelect from '@aziontech/webkit/language-select'
  import { ref } from 'vue'

  const locale = ref('pt-BR')
  const sizes = ['small', 'medium', 'large']
</script>

<template>
  <div class="flex max-w-(--container-xs) flex-col gap-(--spacing-sm)">
    <LanguageSelect
      v-for="size in sizes"
      :key="size"
      v-model="locale"
      :size="size"
      :aria-label="`Language, ${size}`"
    />
  </div>
</template>
```
