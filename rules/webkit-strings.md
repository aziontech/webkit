# Rule: strings — never re-type a string a webkit component already ships

Webkit components carry their own interface text: close buttons, pagination, empty states,
calendar fields, keycaps, wizard steps, screen-reader labels. Each one is read from a locale
catalog (`en`, `pt-BR`, `es`) through `useLocale`, so it follows the language set on
`WebkitProvider`. A string typed by hand next to the component, or passed into a prop to repeat the
default, is stuck in one language and drifts from the rest of the product.

## Do

- Leave a component's built-in text alone. `<Pagination>` already says "Previous page" and
  "Página anterior"; `<Dialog>` already names its close button; `<Kbd key-name="escape" />` prints
  `Esc` from the catalog.
- Set the language once, at the app root: `<WebkitProvider locale="pt-BR" :catalogs="{ 'pt-BR': ptBR }">`,
  with `ptBR` from `@aziontech/webkit/locales/pt-BR` (`es` from `/locales/es`; English is built
  in). Every component below it switches, dates and numbers included (`Intl` through the same
  locale).
- Rename a built-in string for the whole app with `messages` on `WebkitProvider`:
  `:messages="{ wizard: { submit: 'Deploy' }, kbd: { ctrl: 'Strg' } }"`. The keys are the
  catalog's (`group.key`); anything you leave out keeps the built-in text.
- Pass a prop only when the text is product copy specific to that screen (a dialog title, a field
  label, the action of this form), and write it by the `webkit-microcopy` skill: sentence case, one
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
  differ by language. Webkit's catalog keys take parameters (`Step {step} of {total}`).

## Example

```vue
<script setup lang="ts">
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'
  import Wizard from '@aziontech/webkit/wizard'
  import { ref } from 'vue'

  const step = ref(0)
  const messages = { wizard: { submit: 'Implantar' } }
</script>

<template>
  <WebkitProvider
    locale="pt-BR"
    :catalogs="{ 'pt-BR': ptBR }"
    :messages="messages"
  >
    <Wizard
      v-model:active-step="step"
      aria-label="Criar aplicação"
    >
      <Wizard.Step title="Configurar">…</Wizard.Step>
      <Wizard.Step title="Revisar">…</Wizard.Step>
    </Wizard>
  </WebkitProvider>
</template>
```

## Notes

- A `scope: general` standard: it applies to any screen in an app that uses webkit, not only to
  webkit's own components.
- Inside the package the same check runs at write time (the authoring hook) and in CI
  (`scripts/check-authoring.mjs`): a literal UI string in a component template attribute, or an
  English prop default, is blocked; the text goes to `src/i18n/messages/*.ts`.
- Product copy, the text no component ships, follows the `webkit-microcopy` skill.
