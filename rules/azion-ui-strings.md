# Rule: strings — never re-type a string an Azion UI component already ships

Azion UI components carry their own interface text: close buttons, pagination, empty states,
calendar fields, keycaps, wizard steps, screen-reader labels. Each one is read from a locale
catalog (`en`, `pt-BR`, `es`) through `useLocale`, so it follows the language set on
`ConfigProvider`. A string typed by hand next to the component, or passed into a prop to repeat the
default, is stuck in one language and drifts from the rest of the product.

## Do

- Leave a component's built-in text alone. `<Pagination>` already says "Previous page" and
  "Página anterior"; `<Dialog>` already names its close button; `<Kbd key-name="escape" />` prints
  `Esc` from the catalog.
- Set the language once, at the app root: `<ConfigProvider locale="pt-BR" :catalogs="{ 'pt-BR': ptBR }">`,
  with `ptBR` from `@aziontech/ui/locales/pt-BR` (`es` from `/locales/es`; English is built
  in). Every component below it switches, dates and numbers included (`Intl` through the same
  locale).
- Let people change the language with `LanguageSelect` (`@aziontech/ui/language-select`)
  bound to the same `locale` the provider reads: `<LanguageSelect v-model="locale" variant="ghost" />`
  in a header, a toolbar or a footer (a round flag and the language tag, `EN` or `PT-BR`), and the default full field
  `<LanguageSelect v-model="locale" />` on a settings page or in a form. Name every option with a
  BCP 47 tag: the bare language for its main variant (`en`, `es`) and the ISO 3166-1 region for a
  regional one (`pt-BR`, `en-GB`, never `en-UK`). A regional variant reads its language's catalog
  (`en-GB` → `en`) unless you register one under its own tag. Your own
  screen copy follows it too: read `useLocale().locale` and pick the text from a table keyed by
  locale, as the `auth/auth-sign-in` block does.
- Rename a built-in string for the whole app with `messages` on `ConfigProvider`:
  `:messages="{ wizard: { submit: 'Deploy' }, kbd: { ctrl: 'Strg' } }"`. The keys are the
  catalog's (`group.key`): `group` is the component's camelCase name (`sidebarMenu`,
  `feedbackReasonDialog`) and strings several components share are in `common` (`common.copy`,
  `common.newTab`); anything you leave out keeps the built-in text.
- Pass a prop only when the text is product copy specific to that screen (a dialog title, a field
  label, the action of this form), and write it by the `azion-ui-microcopy` skill: sentence case, one
  word per concept, no em dash.
- Format dates, numbers, file sizes, relative times and lists with `useLocale()`
  (`formatDate`, `formatNumber`, `formatFileSize`, `formatRelativeTime`, `formatList`), not with
  string concatenation.

## Don't

- Re-type a built-in string into a prop to "make sure": `close-label="Close"`,
  `placeholder="Select a Date Range"`, `next-label="Next"`. It freezes the English text and stops
  the provider's locale from reaching it.
- Fork a component, or wrap it, only to change one of its words: use `messages`.
- Hard-code key names (`Ctrl`, `Esc`, `Enter`) next to a `Kbd`: use its modifier props and
  `key-name`; `⌘`, `⌥` and `⇧` stay symbols on macOS.
- Build a sentence from fragments (`'Step ' + n + ' of ' + total`): plural rules and word order
  differ by language. Azion UI's catalog keys take parameters (`Step {step} of {total}`).

## Example

```vue
<script setup lang="ts">
  import { ptBR } from '@aziontech/ui/locales/pt-BR'
  import ConfigProvider from '@aziontech/ui/config-provider'
  import Wizard from '@aziontech/ui/wizard'
  import { ref } from 'vue'

  const step = ref(0)
  const messages = { wizard: { submit: 'Implantar' } }
</script>

<template>
  <ConfigProvider
    locale="pt-BR"
    :catalogs="{ 'pt-BR': ptBR }"
    :messages="messages"
  >
    <Wizard
      v-model="step"
      aria-label="Criar aplicação"
    >
      <Wizard.Step title="Configurar">…</Wizard.Step>
      <Wizard.Step title="Revisar">…</Wizard.Step>
    </Wizard>
  </ConfigProvider>
</template>
```

## Notes

- A `scope: general` standard: it applies to any screen in an app that uses Azion UI, not only to
  Azion UI's own components.
- Inside the package the same check runs at write time (the authoring hook) and in CI
  (`scripts/check-authoring.mjs`): a literal UI string in a component template attribute, or an
  English prop default, is blocked; the text goes to `src/locales/*.ts`.
- Product copy, the text no component ships, follows the `azion-ui-microcopy` skill.
