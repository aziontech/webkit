# Markdown Editor

> The text area of a reply composer: a person writes Markdown in a `Textarea`, formats it from a toolbar (bold, italic, link, bulleted list, numbered list, quote, code) or with Ctrl/⌘+B, I and K, checks the result on a Preview tab, and mentions a teammate by typing `@`, which opens a filtered list of people. It is the GitHub comment box pattern (decision SUP-02): plain Markdown text with helpers, never a rich-text (WYSIWYG) editor, so no editor library enters the package. The value is the Markdown string.

- Import: `import MarkdownEditor from '@aziontech/ui/markdown-editor'`
- Category: input · Surface: app · Structure: monolithic
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- API as JSON: [markdown-editor.json](markdown-editor.json)

## When to use

- Write a reply to a support ticket, a customer or a teammate.
- Add an internal note or a comment that can carry bold text, links, lists, quotes and code.
- Let the writer mention a teammate with `@` so the app can notify them.
- Any long free-text field whose content is shown later as formatted Markdown (a release note, an incident update).

## Do

- Wrap it in a `Field` with a visible label ("Reply", "Internal note"); without one, the field is named by the built-in "Message" label.
- Pass `mentions` only with the people who can be mentioned in this ticket; the menu shows the first eight matches, so a long list is filtered by typing.
- Listen to `mention-select` to record who was mentioned; the inserted text is `@` plus the person's `value`, so `value` is a handle with no spaces (`jane.doe`).
- Put the send button and the attachment control in the `footer` slot, not above the field.
- Render the posted message with `StreamingResponse` so it reads as the preview did.
- Keep `maxRows` so a long reply scrolls inside the field instead of pushing the page down.
- The preview and the posted message read `[1]` or `[2, 3]` as a citation chip (the `StreamingResponse` rule); write a bracketed number as `\[1]` when it is plain text.

## Don’t

- Plain text that is never formatted (a description, a reason) → use `textarea`.
- A question to an AI assistant, with send, model picker and attachments → use `prompt-input`.
- Code that people edit with highlighting and line numbers → use `code-editor`.
- Showing Markdown that nobody edits → use `streaming-response` (or `doc-markdown` on a docs page).
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [textarea](textarea.md) — the field this component is built on; every field prop (`placeholder`, `disabled`, `readonly`, `invalid`, `required`) means the same here.
- [prompt-input](prompt-input.md) — the AI prompt box; it shares the `@` menu list with this component (the private part `prompt-input/parts/prompt-input-menu-list.vue`, imported across components as `doc-layout` imports a `console-layout` part; it moves to a shared folder only if a third component needs it).
- [streaming-response](streaming-response.md) — the Markdown renderer the Preview tab uses; render the sent message with it so the preview and the posted message match. This build changes its root to merge the consumer `class` with `cn` (no API change, its test extended).
- [tabs](tabs.md) — Write and Preview are a controlled `Tabs` (the editor owns the value, `data-tab`, so a disabled editor still shows Write). This build moves `Tabs.Content`'s `tabindex="0"` before its attribute passthrough, so a panel whose first content is focusable can take `tabindex="-1"` (APG tabs pattern; no API change, its test extended).
- [prompt-input](prompt-input.md)/composables/use-prompt-input-menu.ts` exports its pure `findQuery` and `filterOptions` (the `@` token before the caret, at the start of the text or after whitespace; case-insensitive match on label or value; at most eight), which the editor reuses. The editor keeps its own small pick and key handler, because it inserts `@value` (not the label) through the undo-friendly path and stops Escape from propagating.
- [prompt-input](prompt-input.md)/parts/prompt-input-menu-list.vue` renders each option's label and description with `dir="auto"`.
- [streaming-response](streaming-response.md)/streaming-response.vue` merges the consumer `class` with `cn`.
- `navigation/tabs/tabs-content.vue` lets a consumer `tabindex` replace its default `0`.
- [field](field.md) — wraps the editor with its label, description and error.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `''` | false | Placeholder shown in the empty field. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the field when no Field label or aria-labelledby names it; empty uses the built-in Message label. Write it as the aria-label attribute. |
| `disabled` | `boolean` | `false` | false | Disables the field, the toolbar, the tabs and the mention menu. |
| `readonly` | `boolean` | `false` | false | Shows the value without letting it change: opens on the Preview tab, hides the toolbar and never opens the mention menu; the Write tab still shows the source. |
| `invalid` | `boolean` | `false` | false | Applies the invalid border to the field and the preview and sets aria-invalid on the field. |
| `required` | `boolean` | `false` | false | Marks the field as required and sets aria-required. |
| `mentions` | `MarkdownEditorMention[]` | `[]` | false | People the menu offers after `@`; each is `{ value, label, description?, icon? }` and inserts `@` plus its `value`. Empty turns the menu off. |
| `minRows` | `number` | `4` | false | Lines the empty field shows; the field grows with its content from here. |
| `maxRows` | `number` | `12` | false | Lines the field grows to before it scrolls; `0` sets no limit. |
| `modelValue` | `string` | `''` | false | Two-way value (`v-model`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `mention-select` | `(event: MouseEvent \| KeyboardEvent, mention: MarkdownEditorMention)` | Fires when a person is picked from the `@` menu (click, Enter or Tab), after `@value` is inserted into the text. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `footer` | — | A row under the field for attachments and actions (an attach button, a Send button); omitted when empty. |

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                     |
| --------- | -------- | ------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `v-model` | `string` | `''`    | `update:modelValue` | The Markdown text via `defineModel`; updates on every input, toolbar action and mention. |

## States

- Visual states: `default`, `hover`, `focus`, `filled`, `disabled`, `readonly`, `invalid`, `required` (no visual change: the wrapping `Field` label carries the Required marker); the field's own states come from `Textarea`.
- `data-tab` on the root: `write` | `preview`, the open tab.
- `data-disabled` and `data-invalid` on the root mirror the props or the wrapping `Field`'s state; `data-readonly` mirrors the `readonly` prop only (`Field` has no read-only state).
- Write tab: the toolbar shows; each button inserts its Markdown at the selection. Preview tab: the toolbar hides and the Markdown renders in a box the shape of the field (`data-slot="preview"`); an empty value shows the muted text "Nothing to preview".
- Mention menu: `data-mention-state="open|closed"` on the root. Open while the `@` token before the caret matches at least one person and the field is editable: the listbox renders above the field (or below it, when there is not enough room above and more below), the match count is spoken in the polite live region, and the field carries `aria-controls` (the listbox) and `aria-activedescendant` (the highlighted option). Closed: no listbox in the DOM, and the field carries neither attribute (`aria-autocomplete="list"` stays while `mentions` is not empty). No match, Escape, a pick, or the caret leaving the token closes it.
- `disabled`: field, toolbar buttons and tab triggers disabled; the mention menu never opens.
- `readonly`: the editor opens on the Preview tab, so a reader sees the rendered note first; the toolbar is not rendered (nothing in it could act), keyboard shortcuts do nothing, the mention menu never opens; the Write tab still shows the source for copying.
- Preview loading: the renderer is a lazy chunk (see Performance). Until it arrives the preview box keeps its `minRows` height, carries `aria-busy="true"` and `data-loading`, and shows the muted text "Loading preview" (`markdownEditor.previewLoading`). If the chunk fails to load, the box shows the Markdown source as plain text (`whitespace-pre-wrap`), so the writer still reads what they wrote; there is no retry button.
- Empty: an empty value shows the muted "Nothing to preview" (`markdownEditor.emptyTitle`). A send error belongs to the host's `Field` error, not to the editor.
- Every insertion (toolbar buttons, Ctrl/⌘+B, I, K, a picked mention, and `insert()`) keeps the browser's undo history: text goes in through `document.execCommand('insertText')`; where that returns false the component falls back to `setRangeText` plus an `input` event, which is not undoable.
- What each action inserts (GitHub's markers), on the selection or at the caret:
  - Bold `**text**`, Italic `_text_`; with no selection the empty markers go in with the caret between them; a selection already wrapped in the markers is unwrapped.
  - Link `[text](https://github.com/aziontech/webkit/blob/main/.specs/url)` with `url` selected; with no selection `[](https://github.com/aziontech/webkit/blob/main/.specs/url)` with the caret between the brackets. The `url` word is the `markdownEditor.linkPlaceholder` string.
  - Bulleted list `- `, Numbered list `1. `, `2. `…, Quote `> `: the selection grows to whole lines and every line gets the prefix; when every line already has it, it is removed.
  - Code: a selection inside one line becomes `` `text` ``; a selection over several lines becomes a fenced block (three backticks on their own lines around it).
- Switching to Preview unmounts the field (a `Tabs.Content` panel renders only when active), so the browser's undo history does not survive a round trip through Preview; the value does.
- The preview box has the field's minimum height (`minRows` lines), so switching tabs on a short reply does not change the height.

## Accessibility

- Visible focus: the field, tabs and toolbar buttons keep the focus rings of `Textarea`, `Tabs.Trigger` and `IconButton`. Both panels take `tabindex="-1"`, so neither `Tabs.Content` panel is a stop of its own: in Write the first content is the field; in Preview the preview box (`data-slot="preview"`, `tabindex="0"`) is the one focus stop, with `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the box itself.
- Keyboard map:
  - Tab order: the active tab (Write or Preview), then the toolbar (one stop, Write only), then the field (Write) or the preview box (Preview), then the controls in the `footer` slot.
  - In the field: Ctrl+B (⌘B on Apple) bold, Ctrl+I (⌘I) italic, Ctrl+K (⌘K) link; each wraps the selection, or inserts the empty markers with the caret between them.
  - `@` opens the menu only at the start of the text or after whitespace, so an email address (`jane@example.com`) never opens it mid-word; the text typed after `@` up to the caret filters the people by label or value, case-insensitively.
  - With the mention menu open: ArrowDown / ArrowUp move the highlight (wrapping), Enter or Tab insert `@value` and a space, Escape closes the menu and stops there (a surrounding dialog stays open); typing keeps filtering; the menu closes when the caret leaves the `@` token.
  - Toolbar (`role="toolbar"`, WAI-ARIA toolbar pattern): Tab enters on one button (roving `tabindex`), ArrowRight / ArrowLeft move to the next / previous button (swapped under `dir="rtl"`), Home / End go to the first / last; Enter or Space applies the format and returns focus to the field with the new selection.
  - Tabs: the `Tabs` keyboard map (arrows between Write and Preview, automatic activation).
- ARIA: the toolbar carries `aria-label` "Formatting" and `aria-controls` the field; each button has its accessible name ("Bold") and `aria-keyshortcuts` (`Meta+B Control+B`) for the three with shortcuts. The field keeps its native textbox role (ARIA in HTML allows no `combobox` role on `textarea`) and takes the combobox attributes the role allows: `aria-autocomplete="list"`, `aria-controls` (the listbox, while open) and `aria-activedescendant` (the highlighted option). The menu is `role="listbox"` with `aria-label` "People"; options are `role="option"` with `aria-selected`. The match count is announced in a polite live region ("3 people").
- Accessible name: from the wrapping `Field` label, or `aria-label` / `aria-labelledby` passed to the editor (forwarded to the field); with neither, the built-in "Message".
- Contrast: only documented token pairs (`rules/azion-ui-tokens.md` § Contrast); the muted empty-preview text is `--text-muted` on `--bg-surface`; the disabled preview is `--text-disabled` on `--bg-disabled`, the pair `Textarea` uses (disabled text is outside the WCAG 1.4.3 minimum).
- Motion: none of its own (see Motion).
- Touch targets: toolbar buttons are `IconButton` size `small` with its 44 × 44 px hit area on a coarse pointer (TT01); menu options take `min-h-11` on a coarse pointer.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `justify-between`); the tabs sit at the start and the toolbar at the end of the header row.
- Icons: bold, italic, link, lists, quote and code glyphs are not directional and do not mirror.
- Keyboard: in the toolbar, ArrowLeft moves to the next button and ArrowRight to the previous under `dir="rtl"`; the tabs follow `Tabs`.
- User data: the field keeps `Textarea`'s `dir="auto"`, so a reply in Arabic or Hebrew sets its own direction; the preview box carries `dir="auto"` too, so it reads in the same direction as the field; each mention option's label and description render with `dir="auto"` (set in the shared menu-list part), so a name in another script is isolated.

## Internationalization

| Key                              | English source                           | Override prop |
| -------------------------------- | ---------------------------------------- | ------------- |
| `markdownEditor.label`           | `Message`                                | `ariaLabel`   |
| `markdownEditor.write`           | `Write`                                  | —             |
| `markdownEditor.preview`         | `Preview`                                | —             |
| `markdownEditor.toolbar`         | `Formatting`                             | —             |
| `markdownEditor.bold`            | `Bold`                                   | —             |
| `markdownEditor.italic`          | `Italic`                                 | —             |
| `markdownEditor.link`            | `Link`                                   | —             |
| `markdownEditor.bulletedList`    | `Bulleted list`                          | —             |
| `markdownEditor.numberedList`    | `Numbered list`                          | —             |
| `markdownEditor.quote`           | `Quote`                                  | —             |
| `markdownEditor.code`            | `Code`                                   | —             |
| `markdownEditor.shortcut`        | `{label} ({keys})`                       | —             |
| `markdownEditor.linkPlaceholder` | `url`                                    | —             |
| `markdownEditor.emptyTitle`      | `Nothing to preview`                     | —             |
| `markdownEditor.previewLoading`  | `Loading preview`                        | —             |
| `markdownEditor.mentionMenu`     | `People`                                 | —             |
| `markdownEditor.mentionResults`  | one `{count} person`, other `{count} people` | —         |

- Every key is in `en.ts`, `pt-BR.ts` and `es.ts`; a `ConfigProvider` message override replaces any of them.
- The Ctrl key name in a tooltip comes from the shared `kbd.ctrl` key; on Apple platforms the tooltip prints ⌘.
- Formatting: `Intl.PluralRules` (through `useTranslate`) for `mentionResults`; no dates or numbers.
- The Markdown markers (`**`, `_`, `- `, `1. `, `> `, backticks) are syntax, not text, and are never translated.

## Responsive

- Container queries: none; the header row is a wrapping flex row.
- Narrow container: the header row wraps by content width (no breakpoint); the toolbar keeps `ms-auto`, wraps onto its own line under the tabs, aligned to the end; the field and the preview take the full width; the mention menu spans the field's width.
- The mention menu is positioned with CSS only (`absolute` against the field wrapper, no teleport, no positioning library): it opens above the field and moves below it when there is not enough room above and more room below (`data-side=top|bottom`, the shared part's behaviour, unchanged). Inside an `overflow: hidden` or scrolling parent (a dialog body) it can be clipped like any in-flow popup; the host leaves room under the composer, as for `PromptInput`.
- Touch: toolbar buttons keep `IconButton`'s 44 × 44 px hit area and menu options are 44 px tall on `pointer: coarse`; the tooltips are hover/focus extras, every button still has its accessible name and does its job with a tap.
- Reflow: no horizontal scroll at 320 px and 200 % zoom (WCAG 1.4.10); a long line in the field wraps; a code block in the preview scrolls inside its own box.

## Examples

### Default

```vue
<script setup>
  import Field from '@aziontech/ui/field'
  import MarkdownEditor from '@aziontech/ui/markdown-editor'
  import { ref } from 'vue'

  const reply = ref('')
  const people = [
    { value: 'jane.doe', label: 'Jane Doe', description: 'jane.doe@example.com' },
    { value: 'john.smith', label: 'John Smith', description: 'john.smith@example.com' },
    { value: 'alex.morgan', label: 'Alex Morgan', description: 'alex.morgan@example.com' },
    { value: 'priya.patel', label: 'Priya Patel', description: 'priya.patel@example.com' }
  ]
</script>

<template>
  <Field class="w-full max-w-(--container-md)">
    <Field.Label>Reply</Field.Label>
    <MarkdownEditor
      v-model="reply"
      placeholder="Write a reply. Type @ to mention a teammate."
      :mentions="people"
    />
  </Field>
</template>
```

### Disabled

```vue
<script setup>
  import Field from '@aziontech/ui/field'
  import MarkdownEditor from '@aziontech/ui/markdown-editor'
  import { ref } from 'vue'

  const reply = ref('Thanks for the report, we are looking into it.')
</script>

<template>
  <Field class="w-full max-w-(--container-md)">
    <Field.Label>Reply</Field.Label>
    <MarkdownEditor
      v-model="reply"
      disabled
    />
  </Field>
</template>
```

### Readonly

```vue
<script setup>
  import Field from '@aziontech/ui/field'
  import MarkdownEditor from '@aziontech/ui/markdown-editor'
  import { ref } from 'vue'

  const note = ref(
    [
      'Hi **Jane**, the purge finished at _10:42 UTC_.',
      '',
      '- Cache cleared for `app.example.com`',
      '- Logs are in [the dashboard](https://example.com/logs)',
      '',
      '1. Reload the page',
      '2. Reply here if the error is back',
      '',
      '> The old certificate is no longer served.'
    ].join('\n')
  )
</script>

<template>
  <Field class="w-full max-w-(--container-md)">
    <Field.Label>Internal note</Field.Label>
    <MarkdownEditor
      v-model="note"
      readonly
    />
    <Field.Description>Notes are locked once the ticket is closed.</Field.Description>
  </Field>
</template>
```
