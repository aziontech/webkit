---
name: language-select
category: input
structure: monolithic
status: implemented
spec_version: 2
template: 2
created: 2026-11-19
last_updated: 2026-11-22
checksum: f7eaca618166d4ef1b00259d6764461517a0647a8af3fb13e2b4141cbedfc756
---

# LanguageSelect — Component Spec

## Purpose

A searchable picker for the interface language, built like the country picker inside `phone-input`: every option is a BCP 47 language tag (`en`, `pt-BR`, `es`, `en-GB`), shown with its country's round flag and the language named in itself (`English`, `Português (Brasil)`, `Español`), and a search box at the top of the list filters by name, tag or country. `v-model` holds the BCP 47 tag of the picked option, ready to hand to `ConfigProvider`'s `locale`. It comes in two forms: the full field (`variant="outline"`, round flag and name, field-sized) for a form or a settings page, and the compact switcher (`variant="ghost"`, round flag and the tag in capitals such as `EN` or `PT-BR`, no border until hover) for a header, a toolbar or a footer. It offers the languages WebKit ships catalogs for and takes the consumer's own list through `options`.

## When to use

- A language switch in a header, a toolbar or a footer: `variant="ghost"`, the compact round flag and short code, beside the search and the icon buttons.
- A language setting on a settings page or a form field that asks which language a user, a page or a notification is written in: the default `variant="outline"` inside a `Field` or a `SettingsRow`.

## When NOT to use

- Two or three languages that must stay visible side by side on a toolbar → use `toggle-group`.
- Picking a country (for a phone number, an address) → use `phone-input` or `select`.
- Setting the language of WebKit's own strings → that is `config-provider`'s `locale`; bind this picker's `v-model` to it.

## Related

- `config-provider` — takes the picked tag as `locale` and translates everything below it.
- `select` — the picker this component is built on; use it directly for any other list of choices.
- `phone-input` — the same flag sprite and searchable list, for the dial code of a phone number; LanguageSelect draws the flags round.
- `field` — wraps the picker with a label and a description when it sits in a form.

## Best practices

- Bind `v-model` to the same value as `ConfigProvider`'s `locale`, so the picker and the strings move together.
- Name languages in their own language (`Português (Brasil)`, not `Portuguese (Brazil)`): a reader who cannot read the current language still finds theirs.
- Name every option with a BCP 47 tag (RFC 5646): the ISO 639 language, then the ISO 3166-1 region only when the option is a regional variant. The main variant of a language is the bare language (`en`, `es`); each regional variant adds its region (`en-GB`, `en-CA`, `pt-BR`), never an invented one (`en-UK` is not a tag; the United Kingdom is `GB`). The compact switcher shows the tag as it is, in capitals (`EN`, `EN-GB`, `PT-BR`).
- A regional variant needs no catalog of its own: `ConfigProvider` reads `en-GB` from the `en-GB` catalog when one is registered, else from `en`. Register one only where the wording differs.
- A tag with no region takes the flag of its likely region (`en` → `US`, `ar` → `EG`); set `country` when that is not the one you mean (`ar` → `SA`).
- Use `variant="ghost"` in a header, a toolbar or a footer, never the field: a field outline next to the toolbar's buttons draws two border colours in one row. Use the default `outline` in a form, where the field outline is the control's boundary (WCAG 1.4.11).
- Put it in a `Field` with a `Field.Label` in a form; on a toolbar or a footer, give it an `aria-label` only if the built-in `Language` name does not fit.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import LanguageSelect from '@aziontech/webkit/language-select'
  import { es } from '@aziontech/webkit/locales/es'
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'

  const locale = ref('en-US')
</script>

<template>
  <ConfigProvider
    :locale="locale"
    :catalogs="{ 'pt-BR': ptBR, es }"
  >
    <!-- In a header or a toolbar: the compact switcher -->
    <LanguageSelect
      v-model="locale"
      variant="ghost"
    />
  </ConfigProvider>
</template>
```

## Props

| Prop                | Type                             | Default                                  | Required | JSDoc                                                                                                                                                                                                                                                                                          |
| ------------------- | -------------------------------- | ---------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`           | `LanguageSelectOption[]`         | (the languages WebKit ships — see Notes) | false    | Languages offered, in order: `{ value, label?, country? }` where `value` is a BCP 47 tag, `label` the language named in itself (derived from the tag when omitted), and `country` the ISO 3166-1 alpha-2 code of the flag (taken from the tag's region, else its likely region, when omitted). |
| `variant`           | `'outline' \| 'ghost'`           | `'outline'`                              | false    | Trigger look: `outline` is the full field (round flag and name) for forms and settings; `ghost` is the compact switcher (round flag and the BCP 47 tag in capitals, such as EN or PT-BR, no border until hover) for a header, a toolbar or a footer.                                           |
| `placeholder`       | `string`                         | `''`                                     | false    | Trigger text while no language is picked. Empty uses the locale catalog (`Language`).                                                                                                                                                                                                          |
| `size`              | `'small' \| 'medium' \| 'large'` | `'medium'`                               | false    | Size token forwarded to the Select trigger. Heights: small=28px, medium=32px, large=40px.                                                                                                                                                                                                      |
| `disabled`          | `boolean`                        | `false`                                  | false    | Disables the trigger and keeps the list closed.                                                                                                                                                                                                                                                |
| `ariaLabel`         | `string`                         | `''`                                     | false    | Accessible name of the trigger when no Field labels it. Empty uses the locale catalog (`Language`).                                                                                                                                                                                            |
| `searchPlaceholder` | `string`                         | `''`                                     | false    | Placeholder and accessible name of the search box. Empty uses the locale catalog (`Search language`).                                                                                                                                                                                          |
| `emptyTitle`        | `string`                         | `''`                                     | false    | Shown in the list when no language matches the search. Empty uses the locale catalog (`No language found.`).                                                                                                                                                                                   |

Notes on the built-in `options`: `[{ value: 'en', label: 'English' }, { value: 'pt-BR', label: 'Português (Brasil)' }, { value: 'es', label: 'Español' }]`, the three locales `@aziontech/webkit/locales/*` ships under those same tags (English is built in). `ConfigProvider` finds a catalog by the tag, then by the tag cut from the right (`en-GB` → `en`), then by the language, so a regional variant reads its language's catalog unless it registers its own. `LanguageSelectOption` and `LanguageSelectVariant` are exported from the component. The flag comes from `country`, else the tag's two-letter region (`pt-BR`, `fr-CA`), else the tag's likely region (`Intl.Locale.prototype.maximize`: `en` → `US`); a tag none of these resolves shows no flag. An option with no `label` is named by `Intl.DisplayNames` in its own language, first letter upper-cased (`fr-CA` → `Français (Canada)`).

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                                                            |
| --------- | -------- | ------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `string` | `''`    | `update:modelValue` | BCP 47 tag of the picked language (`'pt-BR'`). Empty shows the placeholder. Via `defineModel`, so the picker also works unbound. |

## Events

_none_ — the only event is `update:modelValue`, emitted by the `v-model` above.

## Slots

| Slot | Scope | Notes |
| ---- | ----- | ----- |

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

## Motion & Animations

_none_ — motion is owned by `Select` (trigger colour transitions and the dropdown open/close).

## Tokens

| Region                      | Token (DESIGN.md)      |
| --------------------------- | ---------------------- |
| flag ring                   | `var(--border-muted)`  |
| ghost short code (disabled) | `var(--text-disabled)` |
| active row (keyboard)       | `var(--bg-hover)`      |
| empty line text             | `var(--text-muted)`    |
| empty line typography       | `.text-label-sm`       |
| empty line padding.x        | `var(--spacing-xs)`    |
| empty line padding.y        | `var(--spacing-2xs)`   |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the `Select` trigger ring (`focus-visible:ring-(--ring-color)`); inside the list, the active row is highlighted (`data-active`) and announced through `aria-activedescendant` on the search box.
- Keyboard map: `Tab` focuses the trigger; `Enter`, `Space` or `ArrowDown` opens the list with focus in the search box; typing a printable key on the closed trigger opens it and starts the search; `ArrowUp` / `ArrowDown` move the active row; `Home` / `End` jump to the first / last; `Enter` picks and returns focus to the trigger; `Esc` closes and returns focus to the trigger; `Tab` closes the list without picking and focus moves on in page order; `Space` and every other printable key type into the search box and never pick.
- ARIA: the WAI-ARIA APG select-only combobox with a listbox popup: the trigger is the `Select` combobox button with `aria-expanded`, `aria-haspopup="listbox"`, and its name from the enclosing `Field.Label`, else `ariaLabel`, else the catalog (`Language`); rows are `role="option"` with `aria-selected`; the search box inside the listbox popup has an accessible name and drives `aria-activedescendant`; flags are `aria-hidden="true"` (the name carries the meaning).
- Each option row renders the label inside the row with `lang` set to its own tag, so a screen reader reads `Español` with Spanish pronunciation.
- Contrast ≥4.5:1 for names and short codes, including the disabled trigger. The `outline` field keeps the `--border-input` outline (3:1 against the surface, WCAG 1.4.11); the `ghost` switcher is identified by its flag, code and chevron like every ghost control.
- In `variant="ghost"` the visible short code is `aria-hidden`; the trigger's value is the full name in visually hidden text.
- Touch target follows `size` (40px at `large`).

## Internationalization

| Key                      | English source       | Override prop              |
| ------------------------ | -------------------- | -------------------------- |
| `languageSelect.label`   | `Language`           | `placeholder`, `ariaLabel` |
| `languageSelect.search`  | `Search language`    | `searchPlaceholder`        |
| `languageSelect.noMatch` | `No language found.` | `emptyTitle`               |

- Formatting: `Intl.DisplayNames` (type `language`) in English and in the active locale, for search keywords only; option labels are never translated, since a language is named in itself.

## Right-to-left

- Layout: logical utilities only; the flag sits at the inline start of each row and of the trigger, and the short code follows it, so both swap sides under `dir="rtl"`.
- Icons: the flags and the search glyph are not mirrored; the Select chevron is not directional.
- Keyboard: `ArrowUp` / `ArrowDown` move through the vertical list in both directions; no horizontal arrows.
- User data: the short code renders in a `dir="ltr"` span (`PT-BR` keeps its order on a right-to-left page); each option label carries `lang` and `dir="auto"`, so an Arabic or Hebrew name reads right-to-left in a left-to-right list.

## Responsive

- Container queries: none: the `outline` trigger fills the width its container gives it, like `Select`; the `ghost` trigger sizes to its flag and code (about 64 px at `medium`), so it fits a 390 px header.
- Narrow (≤ 640 px or a narrow container): the `outline` trigger truncates the name with an ellipsis; the open list keeps full names and is at least as wide as its widest row (at least `--container-3xs` under `ghost`).
- Touch: targets ≥ 24 px (the rows are 32 px; `size="large"` gives a 40 px trigger); on `pointer: coarse` the trigger and every row grow to at least 44 px (`pointer-coarse:min-h-11`); no hover-only affordance.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: measured with `check-size.mjs` plus about 5 % headroom, on the order of 30 KB gzip like `phone-input` (it carries `Select` with its trigger, content and item, `Input` and the search composable); the `.size-limit.json` entry is `entryOnly: true`, so the lazily imported flag sprite chunk is left out of the count.
- Runtime budget: 300 options open and filter in under 50 ms per keystroke.
- Heavy parts: the flag sprite (72 KB WebP), loaded once per page with a dynamic `import()` and shared with `phone-input`.

## Examples

The examples in `packages/webkit/examples/language-select/` render on the docs site (`/components/language-select`):

- Default — the full field with the built-in languages inside a `Field` with a `Field.Label` (a settings form), wired to a `ConfigProvider` so a line of WebKit text under it changes language.
- Variants — `variant="ghost"` in a header row beside a search trigger and an outlined icon button, next to the `outline` field: where each form belongs.
- Options — a consumer list of languages and regional variants, each named in its own language (`en`, `en-CA`, `en-GB`, `es`, `es-AR`, … `pt-PT`), some with no `label` so the component names them; justified because `options`, the derived label, the short code and the flag-from-region rule change what the picker offers.
- Right-to-left — the compact switcher and the field under `dir="rtl"` with `ar-SA` picked; justified because the flag, the code and the name swap sides and the code keeps its order.
- Sizes — every `size` side by side, for both variants.
- Disabled — `disabled`.

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
