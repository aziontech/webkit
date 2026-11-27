---
name: markdown-editor
category: input
structure: monolithic
status: implemented
stability: preview
spec_version: 2
template: 2
checksum: f39f8767659b36b23ff450f91b3c9fa2c225c0b8fab7d1f534491b520e0a5a6a
created: 2026-11-23
last_updated: 2026-11-25
---

# MarkdownEditor — Component Spec

## Purpose

The text area of a reply composer: a person writes Markdown in a `Textarea`, formats it from a toolbar (bold, italic, link, bulleted list, numbered list, quote, code) or with Ctrl/⌘+B, I and K, checks the result on a Preview tab, and mentions a teammate by typing `@`, which opens a filtered list of people. It is the GitHub comment box pattern (decision SUP-02): plain Markdown text with helpers, never a rich-text (WYSIWYG) editor, so no editor library enters the package. The value is the Markdown string.

## When to use

- Write a reply to a support ticket, a customer or a teammate.
- Add an internal note or a comment that can carry bold text, links, lists, quotes and code.
- Let the writer mention a teammate with `@` so the app can notify them.
- Any long free-text field whose content is shown later as formatted Markdown (a release note, an incident update).

## When NOT to use

- Plain text that is never formatted (a description, a reason) → use `textarea`.
- A question to an AI assistant, with send, model picker and attachments → use `prompt-input`.
- Code that people edit with highlighting and line numbers → use `code-editor`.
- Showing Markdown that nobody edits → use `streaming-response` (or `doc-markdown` on a docs page).

## Related

- `textarea` — the field this component is built on; every field prop (`placeholder`, `disabled`, `readonly`, `invalid`, `required`) means the same here.
- `prompt-input` — the AI prompt box; it shares the `@` menu list with this component (the private part `prompt-input/parts/prompt-input-menu-list.vue`, imported across components as `doc-layout` imports a `console-layout` part; it moves to a shared folder only if a third component needs it).
- `streaming-response` — the Markdown renderer the Preview tab uses; render the sent message with it so the preview and the posted message match. This build changes its root to merge the consumer `class` with `cn` (no API change, its test extended).
- `tabs` — Write and Preview are a controlled `Tabs` (the editor owns the value, `data-tab`, so a disabled editor still shows Write). This build moves `Tabs.Content`'s `tabindex="0"` before its attribute passthrough, so a panel whose first content is focusable can take `tabindex="-1"` (APG tabs pattern; no API change, its test extended).

Changes this build makes to code it reuses, each with no public API change and its own test extended in the same commit:

- `prompt-input/composables/use-prompt-input-menu.ts` exports its pure `findQuery` and `filterOptions` (the `@` token before the caret, at the start of the text or after whitespace; case-insensitive match on label or value; at most eight), which the editor reuses. The editor keeps its own small pick and key handler, because it inserts `@value` (not the label) through the undo-friendly path and stops Escape from propagating.
- `prompt-input/parts/prompt-input-menu-list.vue` renders each option's label and description with `dir="auto"`.
- `streaming-response/streaming-response.vue` merges the consumer `class` with `cn`.
- `navigation/tabs/tabs-content.vue` lets a consumer `tabindex` replace its default `0`.
- `field` — wraps the editor with its label, description and error.

## Best practices

- Wrap it in a `Field` with a visible label ("Reply", "Internal note"); without one, the field is named by the built-in "Message" label.
- Pass `mentions` only with the people who can be mentioned in this ticket; the menu shows the first eight matches, so a long list is filtered by typing.
- Listen to `mention-select` to record who was mentioned; the inserted text is `@` plus the person's `value`, so `value` is a handle with no spaces (`jane.doe`).
- Put the send button and the attachment control in the `footer` slot, not above the field.
- Render the posted message with `StreamingResponse` so it reads as the preview did.
- Keep `maxRows` so a long reply scrolls inside the field instead of pushing the page down.
- The preview and the posted message read `[1]` or `[2, 3]` as a citation chip (the `StreamingResponse` rule); write a bracketed number as `\[1]` when it is plain text.

## Usage

```vue
<script setup>
  import { ref } from 'vue'

  import Button from '@aziontech/ui/button'
  import Field from '@aziontech/ui/field'
  import MarkdownEditor from '@aziontech/ui/markdown-editor'

  const reply = ref('')
  const people = [
    { value: 'jane.doe', label: 'Jane Doe', description: 'jane.doe@example.com' },
    { value: 'john.smith', label: 'John Smith', description: 'john.smith@example.com' }
  ]
</script>

<template>
  <Field>
    <Field.Label>Reply</Field.Label>
    <MarkdownEditor
      v-model="reply"
      placeholder="Write a reply"
      :mentions="people"
    >
      <template #footer>
        <Button label="Send reply" />
      </template>
    </MarkdownEditor>
  </Field>
</template>
```

## Props

| Prop          | Type                      | Default | Required | JSDoc                                                                                                                                      |
| ------------- | ------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `placeholder` | `string`                  | `''`    | false    | Placeholder shown in the empty field.                                                                                                      |
| `ariaLabel`   | `string`                  | `''`    | false    | Accessible name of the field when no Field label or aria-labelledby names it; empty uses the built-in Message label. Write it as the aria-label attribute. |
| `disabled`    | `boolean`                 | `false` | false    | Disables the field, the toolbar, the tabs and the mention menu.                                                                            |
| `readonly`    | `boolean`                 | `false` | false    | Shows the value without letting it change: opens on the Preview tab, hides the toolbar and never opens the mention menu; the Write tab still shows the source. |
| `invalid`     | `boolean`                 | `false` | false    | Applies the invalid border to the field and the preview and sets aria-invalid on the field.                                                |
| `required`    | `boolean`                 | `false` | false    | Marks the field as required and sets aria-required.                                                                                        |
| `mentions`    | `MarkdownEditorMention[]` | `[]`    | false    | People the menu offers after `@`; each is `{ value, label, description?, icon? }` and inserts `@` plus its `value`. Empty turns the menu off. |
| `minRows`     | `number`                  | `4`     | false    | Lines the empty field shows; the field grows with its content from here.                                                                   |
| `maxRows`     | `number`                  | `12`    | false    | Lines the field grows to before it scrolls; `0` sets no limit.                                                                             |

`MarkdownEditorMention` and `MarkdownEditorProps` are exported types.

Attributes: the consumer `class` and `data-testid` go on the root; every other attribute (`id`, `name`, `aria-labelledby`, `aria-describedby`, `maxlength`, `spellcheck`) goes on the field (`inheritAttrs: false`). `ariaLabel` is bound to the field as `ariaLabel || undefined`, and the built-in label only applies when neither a `Field`, `ariaLabel`, `aria-labelledby` nor an `id` (a host `label for`) names it. The field is always a `Textarea` with `autoResize` on, so `minRows` and `maxRows` take effect.

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                     |
| --------- | -------- | ------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `v-model` | `string` | `''`    | `update:modelValue` | The Markdown text via `defineModel`; updates on every input, toolbar action and mention. |

## Events

| Event            | Payload                                                                 | Notes                                                                                                              |
| ---------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `mention-select` | `(event: MouseEvent \| KeyboardEvent, mention: MarkdownEditorMention)` | Fires when a person is picked from the `@` menu (click, Enter or Tab), after `@value` is inserted into the text. |

## Slots

| Slot     | Scope | Notes                                                                                                    |
| -------- | ----- | -------------------------------------------------------------------------------------------------------- |
| `footer` | —     | A row under the field for attachments and actions (an attach button, a Send button); omitted when empty. |

## Exposed

| Method    | Notes                                                                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `focus()` | Switches to the Write tab and moves focus to the field, for a host that opens the composer from a "Reply" button and wants the caret ready. |
| `insert(text: string): Promise<void>` | Inserts `text` at the caret, or in place of the selected text, for a host that adds a token from its own control (an Insert placeholder menu, a saved reply, a snippet). It switches to the Write tab when Preview is open, closes the `@` menu, writes through the browser's editing command so Ctrl/⌘+Z undoes it in one step, updates `v-model`, and leaves focus in the field with the caret after the inserted text. The edit runs after the current task's focus changes settle, so a menu that returns focus to its trigger on select does not take it back; the promise resolves once the text is in. Where the text goes: the field's current selection; when Preview was open, the selection the field had when Write was last left (the component remembers it); when the field has never had focus, the end of the value. Inserted text never opens the `@` menu. Empty `text`, `disabled` (the prop or a disabled wrapping `Field`) and `readonly` resolve the promise with no change and do not move focus; so does an editor unmounted before the edit runs. |

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
  - Link `[text](url)` with `url` selected; with no selection `[](url)` with the caret between the brackets. The `url` word is the `markdownEditor.linkPlaceholder` string.
  - Bulleted list `- `, Numbered list `1. `, `2. `…, Quote `> `: the selection grows to whole lines and every line gets the prefix; when every line already has it, it is removed.
  - Code: a selection inside one line becomes `` `text` ``; a selection over several lines becomes a fenced block (three backticks on their own lines around it).
- Switching to Preview unmounts the field (a `Tabs.Content` panel renders only when active), so the browser's undo history does not survive a round trip through Preview; the value does.
- The preview box has the field's minimum height (`minRows` lines), so switching tabs on a short reply does not change the height.

## Motion & Animations

_none_

The component adds no motion of its own; the tabs, tooltips, buttons and field it composes carry their own transitions with their `motion-reduce:` fallbacks.

## Tokens

| Region                       | Token (TOKENS.md)          |
| ---------------------------- | -------------------------- |
| gap (rows)                   | `var(--spacing-xs)`        |
| gap (toolbar buttons)        | `var(--spacing-2xs)`       |
| preview typography           | `.text-body-xs`            |
| preview typography (coarse)  | `.text-body-md`            |
| preview surface              | `var(--bg-surface)`        |
| preview surface (disabled)   | `var(--bg-disabled)`       |
| preview border               | `var(--border-input)`      |
| preview border (invalid)     | `var(--danger-border)`     |
| preview padding              | `var(--spacing-sm)`        |
| preview shape                | `var(--shape-control)`     |
| preview text                 | `var(--text-default)`      |
| preview empty text           | `var(--text-muted)`        |
| preview text (disabled)      | `var(--text-disabled)`     |
| preview focus ring           | `var(--ring-color)`        |
| preview focus ring offset    | `var(--bg-canvas)`         |
| panel top gap                | `var(--spacing-xs)`        |

The panel top gap replaces `Tabs.Content`'s `--layout-group-gap` through its `cn`; the coarse-pointer typography matches the field's. The preview renders through `StreamingResponse`, which merges the consumer `class` with `cn` so it wins (CODE_QUALITY § 3.5, point 1; this component's build makes that change in `streaming-response.vue`); the preview passes the field's typography, so the preview and the field read at one size. Headings in the preview keep `StreamingResponse`'s heading sizes, and its parser shifts every heading two levels down (`#` → `h3`, `##` → `h4`, deeper ones stop at `h6`), so a reply that starts with `# Title` never puts an `h1` or `h2` inside the host page.

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| none           | —                   | —         |

## Accessibility (WCAG 2.1 AA)

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

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `justify-between`); the tabs sit at the start and the toolbar at the end of the header row.
- Icons: bold, italic, link, lists, quote and code glyphs are not directional and do not mirror.
- Keyboard: in the toolbar, ArrowLeft moves to the next button and ArrowRight to the previous under `dir="rtl"`; the tabs follow `Tabs`.
- User data: the field keeps `Textarea`'s `dir="auto"`, so a reply in Arabic or Hebrew sets its own direction; the preview box carries `dir="auto"` too, so it reads in the same direction as the field; each mention option's label and description render with `dir="auto"` (set in the shared menu-list part), so a name in another script is isolated.

## Responsive

- Container queries: none; the header row is a wrapping flex row.
- Narrow container: the header row wraps by content width (no breakpoint); the toolbar keeps `ms-auto`, wraps onto its own line under the tabs, aligned to the end; the field and the preview take the full width; the mention menu spans the field's width.
- The mention menu is positioned with CSS only (`absolute` against the field wrapper, no teleport, no positioning library): it opens above the field and moves below it when there is not enough room above and more room below (`data-side=top|bottom`, the shared part's behaviour, unchanged). Inside an `overflow: hidden` or scrolling parent (a dialog body) it can be clipped like any in-flow popup; the host leaves room under the composer, as for `PromptInput`.
- Touch: toolbar buttons keep `IconButton`'s 44 × 44 px hit area and menu options are 44 px tall on `pointer: coarse`; the tooltips are hover/focus extras, every button still has its accessible name and does its job with a tap.
- Reflow: no horizontal scroll at 320 px and 200 % zoom (WCAG 1.4.10); a long line in the field wraps; a code block in the preview scrolls inside its own box.

## Performance

- Bundle budget: at most 32 KB gzip for the entry and its static imports (`entryOnly`; the `.size-limit.json` entry is the size measured at build plus a small headroom, under that ceiling); the preview renderer (`StreamingResponse` with its code highlighter) is a lazy chunk loaded the first time the Preview tab opens.
- Runtime budget: a keystroke or a toolbar action updates the value without re-rendering the toolbar; filtering 500 mentions on each keystroke stays under 16 ms (the menu shows at most eight).
- Heavy parts: the preview renderer, lazy as above; no virtualization (the menu is capped at eight options).

## Examples

Canonical layout — state examples change only the prop they demonstrate.

- Default — the first example, file `default.vue`: in a `Field` labelled "Reply", with mentions, empty.
- Disabled — `disabled.vue`: the same editor with `disabled` and a short value.
- Readonly — `readonly.vue`: the same editor with `readonly` and a value that uses every format, so the Preview tab shows them.
- Invalid — `invalid.vue`: inside a `Field` with an error message ("Write a reply before sending.") and `invalid`.
- With footer — `with-footer.vue`: the `footer` slot holding an attach `IconButton` and a "Send reply" `Button`, the composer layout of a ticket. Justified because the slot is the reply composer's main composition and the docs must show where actions go.

## Constraints — DO NOT

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/ui/*` path must exist in `packages/ui/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/primitives/animations/animate.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Variants + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Variants/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
