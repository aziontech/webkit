---
name: webkit-in-product-help
description: Add in-product help to an Azion product screen built on @aziontech/webkit — the explanation beside a field, a section or a whole page. Picks the level (a visible description first, then a Hint glyph that opens a short note on click, then an Info trigger beside the page title that opens a HelpPanel in the console's tools region; a Tooltip only names a control in a few words), places it (the glyph 4px after the label text, the Info trigger after the page title), and writes it (1 to 3 sentences, one Learn more link). Use whenever a screen needs to explain a field, a setting, a metric, a column or a page, or when someone asks for help text, an info icon, a question-mark icon, a help tooltip, a toggletip, contextual help or in-product documentation.
scope: general
status: active
last_updated: 2026-11-23
enforced_by: [webkit-prefer-over-custom, webkit-accessibility, webkit-strings, ui-verify, review]
---

# Skill: webkit-in-product-help

In-product help explains the screen in place: what a field asks for, what a setting changes, what a
metric counts, what a page is for. WebKit gives it one standard, the same three levels AWS
(Cloudscape), IBM (Carbon), Google Cloud and GitHub use: text people see without looking for it,
a short note they open on purpose, and a side panel for a whole page. Every level is a shipped
component. Help is never drawn by hand.

## The levels

Pick the lowest level that holds the help. Most help is level 1.

| Level | What                                          | Component                                                                                                                                     | Holds                                                     |
| ----- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1     | A muted line under the label or title         | `Field.Description` (`FieldDescription`), the `description` prop of `PageHeader`, `Subheader`, `SettingsGroup`, `SettingsRow`, `Card` headers | One sentence the person needs to fill or decide           |
| 2     | A Hint glyph that opens a short note on click | `Hint`, or the `hint` prop of `Field.Label`, `SettingsRow`, `SettingsGroup`                                                                   | 1 to 3 sentences of extra detail and one Learn more link  |
| 3     | An Info trigger after the page title          | `ConsoleLayout.ToolsTrigger` in `PageHeader`, opening a `HelpPanel` in the `ConsoleLayout` `tools` slot                                       | A topic: a few short sections and the documentation links |

Two more pieces, each for one job:

- **`Tooltip`** names a control in a few words (an icon-only button, a truncated label, an
  abbreviation). It is never an explanation: no sentence, no link, never more than about 80
  characters.
- **`HoverCard`** on a term in running text gives its definition (documentation and long
  descriptions only, never a label).

## Which level

1. **Does the person need it to complete the field or make the choice?** Level 1. Required
   information (a format, a limit, what happens on save) is always visible, never behind a glyph.
2. **Is it extra detail some people want** (why a setting matters, how a metric is counted, the
   edge case)? Level 2, beside the label it explains.
3. **Is it about the page as a whole, or longer than three sentences, or does it need several
   links?** Level 3.
4. **Is it the name of an icon-only control?** A `Tooltip` (and the control's own `aria-label`).

## Placement

- **Field:** the Hint glyph sits 4px after the label text on the label's line (`Field.Label hint`
  places it). Never at the far end of the row, never under the field.
- **Section, card or settings band:** the `hint` prop of `SettingsGroup` / `SettingsRow`, or a `Hint`
  right after the `Subheader` or card title text. The section's `description` comes first.
- **Table column:** a `Hint` after the header text, for what a metric or a column means.
- **Page:** the Info trigger right after the page title, on the title's line (`PageHeader` `meta`
  slot). The panel opens in the console's tools region beside the work, so the form stays visible.
- **Docs link of a card or a form:** one `Link` with `target="_blank"` in the footer
  (`Learn more about rate limits`), not one link per field.
- **One glyph per label.** A form where every field has a Hint needs better labels and descriptions,
  not more glyphs.

## Example

```vue
<script setup>
  import { ref } from 'vue'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import PageHeader from '@aziontech/webkit/page-header'
  import HelpPanel from '@aziontech/webkit/help-panel'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Hint from '@aziontech/webkit/hint'
  import Link from '@aziontech/webkit/link'

  const toolsOpen = ref(false)
  const limit = ref('100')
</script>

<template>
  <ConsoleLayout v-model:tools-open="toolsOpen">
    <PageHeader
      title="Rate limiting"
      description="Block clients that send too many requests in a short window."
    >
      <template #meta>
        <ConsoleLayout.ToolsTrigger />
      </template>
    </PageHeader>

    <Field>
      <Field.Label hint="Each client IP has its own counter. Requests over the limit get a 429 until the window resets.">
        Requests per window
      </Field.Label>
      <Input v-model="limit" inputmode="numeric" />
      <Field.Description>From 1 to 10,000.</Field.Description>
    </Field>

    <template #tools>
      <HelpPanel aria-label="Help: Rate limiting">
        <HelpPanel.Header title="Rate limiting" />
        <HelpPanel.Group label="How is the window counted?">
          <p>The window starts at a client's first request and resets after the time you set.</p>
        </HelpPanel.Group>
        <HelpPanel.Footer>
          <Link label="Rate limiting documentation" href="https://example.com/docs/rate-limiting" target="_blank" />
        </HelpPanel.Footer>
      </HelpPanel>
    </template>
  </ConsoleLayout>
</template>
```

A Hint with a documentation link, beside any label or column header:

```vue
<Hint
  content="Hits count every request the rule matched, blocked or not."
  href="https://example.com/docs/firewall/metrics"
  link-label="How hits are counted"
/>
```

## Writing the help

- **Say what the person gets or must do**, in their words: "Each client IP has its own counter", not
  "Configures the per-origin rate bucket".
- **1 to 3 sentences** in a Hint, ending with a period. More than that is level 3.
- **Never repeat the label** ("Name: the name of the resource"). If the label is unclear, rename it.
- **Link text names the destination** ("How hits are counted", "Rate limiting documentation"), never
  "click here". Links to the documentation open in a new tab.
- **The page topic's sections are questions** the person is asking ("How is the window counted?").
- Words and tone: `/webkit-microcopy`, rule `webkit-strings`.

## How it behaves

- **Hint** opens on click, tap, Enter or Space, and stays open to read; Esc, a click outside or a
  second click closes it and focus returns to the glyph. It does not open on hover, so it works the
  same on a phone. A screen reader hears the note when the glyph is focused, before it opens.
- **The Info trigger** opens and closes the tools region, says whether it is open (`aria-expanded`)
  and emits `click` first, so the page can switch the `HelpPanel` to its own topic.
- **Tooltip** opens on hover and focus and holds plain text only.

## Do

- Start with a description; add a Hint only when there is more to say.
- Use `Hint` (or the `hint` prop of the label or settings component) for every info glyph.
- Keep each Hint to 1 to 3 sentences and at most one link.
- Give a page with real guidance an Info trigger and a `HelpPanel` topic.
- Write help for the person reading the screen, in plain words.

## Don't

- Don't draw a help trigger: no typed `?`, no boxed icon button, no `az-circle-info` or
  `az-circle-help` icon inside a `Tooltip`.
- Don't put a sentence, a paragraph or a link in a `Tooltip`.
- Don't center multi-line help text.
- Don't hide required information (format, limits, errors, consequences) behind a glyph.
- Don't put more than one glyph on a label, or a glyph on every field.
- Don't open help in a `Dialog`: it blocks the form the help is about.

## How it is checked

- ESLint `webkit/prefer-hint` (in the `recommended` preset) flags a `Tooltip` whose text is longer
  than 80 characters, a typed `?` or an info icon used as a help trigger, and a `Hint` longer than
  280 characters.
- Rule `webkit-prefer-over-custom` covers the rest of hand-built help: use the shipped component.
- `/webkit-ui-verify` opens every Hint and Info trigger with the keyboard and on a narrow screen.
