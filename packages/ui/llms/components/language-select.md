# Language Select

> A searchable picker for the interface language, built like the country picker inside `phone-input`: every option is a BCP 47 language tag (`en`, `pt-BR`, `es`, `en-GB`), shown with its country's round flag and the language named in itself (`English`, `Português (Brasil)`, `Español`), and a search box at the top of the list filters by name, tag or country. `v-model` holds the BCP 47 tag of the picked option, ready to hand to `ConfigProvider`'s `locale`. It comes in two forms: the full field (`variant="outline"`, round flag and name, field-sized) for a form or a settings page, and the compact switcher (`variant="ghost"`, round flag and the tag in capitals such as `EN` or `PT-BR`, no border until hover) for a header, a toolbar or a footer. It offers the languages Azion UI ships catalogs for and takes the consumer's own list through `options`.

- Import: `import LanguageSelect from '@aziontech/ui/language-select'`
- Category: input · Surface: app · Structure: monolithic
- API as JSON: [language-select.json](language-select.json)

## When to use

- A language switch in a header, a toolbar or a footer: `variant="ghost"`, the compact round flag and short code, beside the search and the icon buttons.
- A language setting on a settings page or a form field that asks which language a user, a page or a notification is written in: the default `variant="outline"` inside a `Field` or a `SettingsRow`.

## Do

- Bind `v-model` to the same value as `ConfigProvider`'s `locale`, so the picker and the strings move together.
- Name languages in their own language (`Português (Brasil)`, not `Portuguese (Brazil)`): a reader who cannot read the current language still finds theirs.
- Name every option with a BCP 47 tag (RFC 5646): the ISO 639 language, then the ISO 3166-1 region only when the option is a regional variant. The main variant of a language is the bare language (`en`, `es`); each regional variant adds its region (`en-GB`, `en-CA`, `pt-BR`), never an invented one (`en-UK` is not a tag; the United Kingdom is `GB`). The compact switcher shows the tag as it is, in capitals (`EN`, `EN-GB`, `PT-BR`).
- A regional variant needs no catalog of its own: `ConfigProvider` reads `en-GB` from the `en-GB` catalog when one is registered, else from `en`. Register one only where the wording differs.
- A tag with no region takes the flag of its likely region (`en` → `US`, `ar` → `EG`); set `country` when that is not the one you mean (`ar` → `SA`).
- Use `variant="ghost"` in a header, a toolbar or a footer, never the field: a field outline next to the toolbar's buttons draws two border colours in one row. Use the default `outline` in a form, where the field outline is the control's boundary (WCAG 1.4.11).
- Put it in a `Field` with a `Field.Label` in a form; on a toolbar or a footer, give it an `aria-label` only if the built-in `Language` name does not fit.

## Don’t

- Two or three languages that must stay visible side by side on a toolbar → use `toggle-group`.
- Picking a country (for a phone number, an address) → use `phone-input` or `select`.
- Setting the language of Azion UI's own strings → that is `config-provider`'s `locale`; bind this picker's `v-model` to it.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [config-provider](config-provider.md) — takes the picked tag as `locale` and translates everything below it.
- [select](select.md) — the picker this component is built on; use it directly for any other list of choices.
- [phone-input](phone-input.md) — the same flag sprite and searchable list, for the dial code of a phone number; LanguageSelect draws the flags round.
- [field](field.md) — wraps the picker with a label and a description when it sits in a form.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options` | `LanguageSelectOption[]` | `(the languages Azion UI ships — see Notes)` | false | Languages offered, in order: `{ value, label?, country? }` where `value` is a BCP 47 tag, `label` the language named in itself (derived from the tag when omitted), and `country` the ISO 3166-1 alpha-2 code of the flag (taken from the tag's region, else its likely region, when omitted). |
| `variant` | `'outline' \| 'ghost'` | `'outline'` | false | Trigger look: `outline` is the full field (round flag and name) for forms and settings; `ghost` is the compact switcher (round flag and the BCP 47 tag in capitals, such as EN or PT-BR, no border until hover) for a header, a toolbar or a footer. |
| `placeholder` | `string` | `''` | false | Trigger text while no language is picked. Empty uses the locale catalog (`Language`). |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token forwarded to the Select trigger. Heights: small=28px, medium=32px, large=40px. |
| `disabled` | `boolean` | `false` | false | Disables the trigger and keeps the list closed. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the trigger when no Field labels it. Empty uses the locale catalog (`Language`). |
| `searchPlaceholder` | `string` | `''` | false | Placeholder and accessible name of the search box. Empty uses the locale catalog (`Search language`). |
| `emptyTitle` | `string` | `''` | false | Shown in the list when no language matches the search. Empty uses the locale catalog (`No language found.`). |
| `modelValue` | `string` | `''` | false | Two-way value (`v-model`). |

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                                                            |
| --------- | -------- | ------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `string` | `''`    | `update:modelValue` | BCP 47 tag of the picked language (`'pt-BR'`). Empty shows the placeholder. Via `defineModel`, so the picker also works unbound. |

## States

- Visual states delegated to `Select`: `default`, `hover`, `focus-visible`, `open`, `disabled`, and the `invalid` / `required` / `disabled` of an enclosing `Field`.
- `data-state="open|closed"` lives on the `Select` trigger; `data-disabled` mirrors `disabled`; `data-variant` on the root, the trigger and the panel mirrors `variant`.
- `variant="outline"`: the trigger is the field (`--border-input` outline, fills its container's width) and shows the picked option's round flag in its `#leading` slot and its name as the value; with nothing picked it shows the placeholder and no flag.
- `variant="ghost"`: the trigger is Select's `ghost` trigger (no border or fill until hover, sized to its content) and shows the round flag and a short code, both `aria-hidden`; the name stays in the value as visually hidden text, so the combobox still announces `Português (Brasil)`. The short code is the option's BCP 47 tag in capitals, exactly as the option names it: `EN` for `en`, `PT-BR` for `pt-BR`, `EN-GB` for `en-GB` (an underscore reads as a hyphen). With nothing picked the placeholder shows.
- Flags are round: the sprite flag cropped to a 16 px circle with a 1 px inset `--border-muted` ring, so a white flag keeps its edge on a white panel.
- `invalid` and `required` have no prop of their own: they come only from an enclosing `Field`, which `Select` reads, and show as the trigger's `data-invalid` / `aria-invalid` and `aria-required`.
- States that cannot occur: `loading` and `error` (the options are static data, never fetched), and `readonly` (no prop; a fixed language is shown as text, or with `select` and its `readonly`).
- An empty `options` array: the trigger still opens, and the list shows only the empty line (`No language found.`).
- Each row shows the round flag and the language name; the picked row carries the Select's check mark. The tag is not shown; the search still matches it.
- Search: typing in the open list filters by the language name, its tag, its country code, and its name in English and in the active locale (`Intl.DisplayNames`), accent-insensitive. No match shows the empty line as a `role="status"`.
- The flag sprite (`src/images/country-flags.webp`, shared with `phone-input`) loads with a dynamic `import()` after mount in the browser; until it arrives the flag boxes stay blank.

## Accessibility

- Visible focus: the `Select` trigger ring (`focus-visible:ring-(--ring-color)`); inside the list, the active row is highlighted (`data-active`) and announced through `aria-activedescendant` on the search box.
- Keyboard map: `Tab` focuses the trigger; `Enter`, `Space` or `ArrowDown` opens the list with focus in the search box; typing a printable key on the closed trigger opens it and starts the search; `ArrowUp` / `ArrowDown` move the active row; `Home` / `End` jump to the first / last; `Enter` picks and returns focus to the trigger; `Esc` closes and returns focus to the trigger; `Tab` closes the list without picking and focus moves on in page order; `Space` and every other printable key type into the search box and never pick.
- ARIA: the WAI-ARIA APG select-only combobox with a listbox popup: the trigger is the `Select` combobox button with `aria-expanded`, `aria-haspopup="listbox"`, and its name from the enclosing `Field.Label`, else `ariaLabel`, else the catalog (`Language`); rows are `role="option"` with `aria-selected`; the search box inside the listbox popup has an accessible name and drives `aria-activedescendant`; flags are `aria-hidden="true"` (the name carries the meaning).
- Each option row renders the label inside the row with `lang` set to its own tag, so a screen reader reads `Español` with Spanish pronunciation.
- Contrast ≥4.5:1 for names and short codes, including the disabled trigger. The `outline` field keeps the `--border-input` outline (3:1 against the surface, WCAG 1.4.11); the `ghost` switcher is identified by its flag, code and chevron like every ghost control.
- In `variant="ghost"` the visible short code is `aria-hidden`; the trigger's value is the full name in visually hidden text.
- Touch target follows `size` (40px at `large`).

## Right-to-left

- Layout: logical utilities only; the flag sits at the inline start of each row and of the trigger, and the short code follows it, so both swap sides under `dir="rtl"`.
- Icons: the flags and the search glyph are not mirrored; the Select chevron is not directional.
- Keyboard: `ArrowUp` / `ArrowDown` move through the vertical list in both directions; no horizontal arrows.
- User data: the short code renders in a `dir="ltr"` span (`PT-BR` keeps its order on a right-to-left page); each option label carries `lang` and `dir="auto"`, so an Arabic or Hebrew name reads right-to-left in a left-to-right list.

## Internationalization

| Key                      | English source       | Override prop              |
| ------------------------ | -------------------- | -------------------------- |
| `languageSelect.label`   | `Language`           | `placeholder`, `ariaLabel` |
| `languageSelect.search`  | `Search language`    | `searchPlaceholder`        |
| `languageSelect.noMatch` | `No language found.` | `emptyTitle`               |

- Formatting: `Intl.DisplayNames` (type `language`) in English and in the active locale, for search keywords only; option labels are never translated, since a language is named in itself.

## Responsive

- Container queries: none: the `outline` trigger fills the width its container gives it, like `Select`; the `ghost` trigger sizes to its flag and code (about 64 px at `medium`), so it fits a 390 px header.
- Narrow (≤ 640 px or a narrow container): the `outline` trigger truncates the name with an ellipsis; the open list keeps full names and is at least as wide as its widest row (at least `--container-3xs` under `ghost`).
- Touch: targets ≥ 24 px (the rows are 32 px; `size="large"` gives a 40 px trigger); on `pointer: coarse` the trigger and every row grow to at least 44 px (`pointer-coarse:min-h-11`); no hover-only affordance.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import ConfigProvider from '@aziontech/ui/config-provider'
  import Field from '@aziontech/ui/field'
  import LanguageSelect from '@aziontech/ui/language-select'
  import { es } from '@aziontech/ui/locales/es'
  import { ptBR } from '@aziontech/ui/locales/pt-BR'
  import Pagination from '@aziontech/ui/pagination-root'
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

### Variants

```vue
<script setup>
  import Field from '@aziontech/ui/field'
  import IconButton from '@aziontech/ui/icon-button'
  import LanguageSelect from '@aziontech/ui/language-select'
  import SearchTrigger from '@aziontech/ui/search-trigger'
  import { ref } from 'vue'

  const locale = ref('en')
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <div
      class="flex items-center justify-end gap-(--spacing-xs) border-b border-(--border-default) pb-(--spacing-sm)"
    >
      <SearchTrigger label="Search" />
      <LanguageSelect
        v-model="locale"
        variant="ghost"
      />
      <IconButton
        icon="az az-github"
        variant="outline"
        size="medium"
        aria-label="GitHub"
        href="https://github.com/aziontech/webkit"
        target="_blank"
      />
    </div>
    <Field class="max-w-(--container-xs)">
      <Field.Label>Interface language</Field.Label>
      <LanguageSelect v-model="locale" />
      <Field.Description>The language of menus, buttons and messages.</Field.Description>
    </Field>
  </div>
</template>
```

### Options

```vue
<script setup>
  import LanguageSelect from '@aziontech/ui/language-select'
  import { ref } from 'vue'

  const locale = ref('en')
  const options = [
    { value: 'en', label: 'English' },
    { value: 'en-CA', label: 'English (Canada)' },
    { value: 'en-GB', label: 'English (United Kingdom)' },
    { value: 'es', label: 'Español' },
    { value: 'es-AR', label: 'Español (Argentina)' },
    { value: 'es-MX', label: 'Español (México)' },
    { value: 'fr-FR' },
    { value: 'fr-BE', label: 'Français (Belgique)' },
    { value: 'fr-CA', label: 'Français (Canada)' },
    { value: 'de-DE', label: 'Deutsch (Deutschland)' },
    { value: 'it-IT' },
    { value: 'ja-JP' },
    { value: 'nl-BE', label: 'Nederlands (België)' },
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'pt-PT', label: 'Português (Portugal)' },
    { value: 'ar', label: 'العربية', country: 'SA' }
  ]
</script>

<template>
  <div class="flex flex-wrap items-start gap-(--spacing-md)">
    <LanguageSelect
      v-model="locale"
      variant="ghost"
      :options="options"
    />
    <LanguageSelect
      v-model="locale"
      :options="options"
      class="max-w-(--container-xs)"
    />
  </div>
</template>
```
