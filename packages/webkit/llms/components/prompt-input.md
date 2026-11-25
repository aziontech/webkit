# Prompt Input

> The composer of a generative AI chat (ChatGPT, Claude.ai and Gemini composers, AI Elements PromptInput, Cloudscape prompt input): a text area that grows with the prompt up to `maxRows`, a toolbar under it, files attached by a button, by dropping them on the box or by pasting them, a model and mode picker, dictation, a voice-conversation control that stands in for Submit while the prompt is empty, a Submit control that becomes Stop while a response is generated, a secondary row under the box (a context picker, tools, links), an optional character limit with a counter, and constraint text under it all. Enter submits on a fine pointer; Shift+Enter adds a line; on a coarse pointer (a phone keyboard) Enter adds a line and Submit sends; an IME composition never submits. It is controlled: the owner holds the text and the files, receives `submit` with the trimmed prompt, its references and its files, and clears them. While `status` is `pending` or `streaming` the reader can keep typing the next prompt, but cannot submit it until the response ends or they press Stop. With `queueable` the owner keeps a queue of prompts to send after the response (TanStack AI `useChat` queues a `sendMessage` made while it streams): Submit then stays beside Stop, and Enter or Submit sends the next prompt into that queue while Stop still ends the response. The anatomy is composed by the app: the root draws the box, the text area, Submit / Stop / voice and the file tokens; the controls the app wants (attach, dictate, model, context, tools) are sub-components it places in the `actions`, `end` and `footer` slots. Each reads the composer through `provide` / `inject`, so the app wires nothing but its own values. At rest it is one floating bar (Attach `+`, the text, the `end` controls, Submit, voice or Stop) on a translucent raised surface with a shadow and a backdrop blur, so a thread can scroll under it. A second line, attached files or references, or an open shortcut menu stack it into two rows (text on its own row) until the prompt is cleared.

- Import: `import PromptInputRoot from '@aziontech/webkit/prompt-input-root'`
- Compound import (dot notation, not tree-shakeable): `import PromptInput from '@aziontech/webkit/prompt-input'`
- Category: ai · Surface: app · Structure: composition
- API as JSON: [prompt-input.json](prompt-input.json)

## When to use

- The input of any conversation with the generative AI assistant.
- A single "Ask about this page" box that opens a conversation.

## Do

- Placeholder is a suggested question with no end punctuation (`Ask a question`); never the only instruction.
- Put the disclaimer and the shortcuts in `hint`, not in the placeholder.
- Set `status` from the request so Submit turns into Stop; wire `stop` to abort it.
- Set `queueable` only when the owner queues what is sent while a response runs, and shows the
- Clear `v-model` and `v-model:files` in the `submit` handler and keep focus in the input.
- Use `maxLength` only when the backend has a limit; the counter is the warning, and it stays hidden
- Default to the full composer in blocks and new AI surfaces (`PromptInput.AttachButton` in `actions`, `PromptInput.ModelPicker` and `PromptInput.DictateButton` in `end`, `voice`, `PromptInput.ContextPicker` in `footer`, the tools in one place only — the "+" menu (`PromptInput.AttachButton` with `tools`) or `PromptInput.Tools` in `footer`, never both, since each lists the enabled tools as chips — and the disclaimer in `hint`); omit a control only when the product explicitly does not offer that capability. Attach goes first at the inline start; model, dictate and Submit at the inline end, in that order; the secondary row holds what is not about this prompt (where the chat lives, the tools, a link to the desktop app).
- Show the upload state on each file (`loading`, `progress`, `error`); Submit waits for them.
- Set `voice` only when the product has a voice conversation; Submit replaces it as soon as there is

## Don’t

- A text field in a form → `textarea` inside `field`.
- Search over a list → `input` with a search icon or `property-filter`.
- A command palette → `command`.
- A file upload form → `file-dropzone` with `file-token-group` in a `field`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [textarea](textarea.md) — the form control; this one has no visible label and submits on Enter.
- [conversation](conversation.md) — the log above it; only the log scrolls.
- [suggestion-group](suggestion-group.md) — prompts the reader can send without typing.
- [file-token-group](file-token-group.md) — what the attached files render as (horizontal, removable).
- [file-dropzone](file-dropzone.md) — the drop target for a page-wide drop; the composer box is its own drop target.
- [dropdown-menu](dropdown-menu.md) — what the model, context and tools pickers open.
- [select](select.md) (`variant="ghost"`) — a plain single choice the app adds to the toolbar itself.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `''` | false | Hint shown while empty, a suggested question with no end punctuation. Empty uses the locale catalog (`Ask a question`). |
| `ariaLabel` | `string` | `''` | false | Accessible name of the text area; the input has no visible label. Empty uses the locale catalog (`Prompt`). |
| `maxLength` | `number` | `0` | false | Character limit; an `n/max` counter shows from 80% of it and submit is blocked over it. `0` means no limit. |
| `minRows` | `number` | `1` | false | Rows shown while empty. |
| `maxRows` | `number` | `6` | false | Rows the text area grows to before it scrolls. |
| `status` | `'ready' \| 'pending' \| 'streaming'` | `'ready'` | false | Request lifecycle: `pending` and `streaming` swap Submit for Stop and block another submit (unless `queueable`); typing stays allowed. |
| `disabled` | `boolean` | `false` | false | Disables the text area, the submit control and every control in the slots' rows. |
| `menus` | `PromptInputMenu[]` | `[]` | false | Shortcut menus opened by a trigger character at the start of a word: `/` for commands, `@` for things to reference. Choosing an option inserts `<trigger><label>` and adds it to `references`. |
| `accept` | `string` | `''` | false | File filter in the native accept syntax (extensions, MIME types, wildcards) for picked, dropped and pasted files. Empty accepts every file. |
| `maxFiles` | `number` | `0` | false | Most files attached at once; files past it are rejected. `0` means no limit. |
| `maxFileSize` | `number` | `0` | false | Largest file in bytes; larger files are rejected. `0` means no limit. |
| `voice` | `boolean` | `false` | false | Shows a Start voice conversation control in place of Submit while there is nothing to send; it emits `voice-start`. |
| `voiceActive` | `boolean` | `false` | false | Marks a live voice conversation as active: swaps the voice control to End voice conversation (`voice-end`) and disables `PromptInput.DictateButton` with a muted microphone icon. |
| `queueable` | `boolean` | `false` | false | While `status` is `pending` or `streaming`, keeps Submit beside Stop and lets Enter submit, so the owner queues the prompt for after the response. |
| `modelValue` | `string` | `''` | false | Two-way value (`v-model`). |
| `references` | `PromptInputReference[]` | `() => []` | false | Two-way value (`v-model:references`). |
| `files` | `PromptInputFile[]` | `() => []` | false | Two-way value (`v-model:files`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `submit` | `(event: MouseEvent \| KeyboardEvent, payload: { value: string; references: PromptInputReference[]; files: PromptInputFile[] })` |  |
| `stop` | `(event: MouseEvent)` |  |
| `voice-start` | `(event: MouseEvent)` |  |
| `voice-end` | `(event: MouseEvent)` |  |
| `reject` | `(event: Event, payload: { files: File[]; reason: PromptInputRejectReason })` |  |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `attachments` | — | Attached context the app draws itself, above the text, before the file tokens and the references. |
| `actions` | — | Controls at the inline start of the bar (`PromptInput.AttachButton`); inside a `fieldset` disabled with the input. |
| `end` | — | Controls at the inline end of the bar, before Submit (`PromptInput.ModelPicker`, `PromptInput.DictateButton`); disabled with the input. |
| `footer` | — | A secondary row under the bar (`PromptInput.ContextPicker`, `PromptInput.Tools`, links); wraps on narrow screens; disabled with the input. Optional: for the single-bar look, place the pickers in `actions` / `end` instead. |
| `hint` | — | Constraint text under everything; referenced by `aria-describedby`. |

## Sub-component imports

- `@aziontech/webkit/prompt-input-attach-button`
- `@aziontech/webkit/prompt-input-dictate-button`
- `@aziontech/webkit/prompt-input-model-picker`
- `@aziontech/webkit/prompt-input-context-picker`
- `@aziontech/webkit/prompt-input-tools`

## Sub-components

Compound API through `index.ts` (`PromptInput.AttachButton`, `PromptInput.DictateButton`,
`PromptInput.ModelPicker`, `PromptInput.ContextPicker`, `PromptInput.Tools`); standalone entries
`prompt-input-root`, `prompt-input-attach-button`, `prompt-input-dictate-button`,
`prompt-input-model-picker`, `prompt-input-context-picker`, `prompt-input-tools`. The root provides
the composer context (`injection-key.ts`): `disabled`, `voiceActive`, `accept`, `maxFiles`, `maxFileSize`,
`fileCount`, the text (read and write), `appendFiles`, `reject`, `setRejection`, `setDragging`,
`registerAttach(handlers)`, `setChips(count)`, `focus()`. `usePromptInputContext()` throws outside a `PromptInput`.
Every part disables with the composer. The compound attaches the three pickers as async
components, so `@aziontech/webkit/prompt-input` does not carry `DropdownMenu` until a picker
renders; their standalone paths are static.

- `prompt-input-attach-button/prompt-input-attach-button.vue` — the attach control: a ghost
  `IconButton` (`az az-plus`) that opens a hidden `input type="file"` with the root's `accept` and
  `multiple` unless `maxFiles` is `1`. Its presence turns on dropping and pasting files into the box:
  it registers drag and paste handlers with the root on setup and takes them back on dispose, sorts
  every picked, dropped or pasted batch against `accept`, `maxFileSize` and `maxFiles`, appends the
  accepted files and reports the rest through the root (`reject`, the line under the box). A
  composer that offers no way to attach does not take files silently. With `tools` the control is
  the composer's "+" menu: after mount it loads a private part (`parts/prompt-input-add-menu.vue`,
  a lazy chunk with `DropdownMenu` and `Chip`) whose `DropdownMenu` opens above the control with an
  `Add` group (Camera on coarse pointers, Photos while `accept` takes images, Files) and a `Tools`
  group of checkbox options. Camera opens a file input with `accept="image/*"` and
  `capture="environment"`, Photos one with `accept="image/*"`, Files the control's own input; every
  pick goes through the same sorting against `accept`, `maxFileSize` and `maxFiles`. The turned-on
  tools follow the control as removable `Chip`s (their icon before the label) in a list named
  `Enabled tools`, and while one shows the box stacks (the root's `setChips`), so the text keeps the
  full width. Until the part has loaded the control is the plain attach `IconButton`.
  - Props: `ariaLabel?: string` (default `''` — empty uses `Attach files`); `icon?: string` (default `''` — empty uses `az az-plus`); `tools?: PromptInputMenuOption[]` (default `[]` — given, the control opens the "+" menu).
  - v-model: `v-model` `string[]` (default `[]`; emits `update:modelValue`) — the turned-on tools, in `tools` order.
  - Events: _none_ (picked files go through the root: `update:files` / `reject`).
  - Slots: _none_.
  - `data-testid` fallback: `prompt-input-attach-button`.
- `prompt-input-dictate-button/prompt-input-dictate-button.vue` — dictation. With `transcriber`
  `browser` it uses the Web Speech API (`SpeechRecognition`, `webkitSpeechRecognition`) where the
  browser has it and renders nothing where it does not (checked after mount, so the server HTML
  never shows a control that will not work). While listening the transcript is written into the
  prompt after the text that was there, interim words included, and the control turns into Stop
  dictation. Its name changes with the action (`Dictate` / `Stop dictation`); it carries no
  `aria-pressed`. Errors end dictation: `not-allowed` reads `Microphone access is blocked`,
  `no-speech` and `aborted` read `Dictation stopped`, anything else `Dictation stopped. Try again`. With `transcriber` `app` the control only toggles `v-model:listening`; the app records
  and writes the text into the root's `v-model` itself (its own speech-to-text service).
  - Props: `ariaLabel?: string` (default `''` — empty uses `Dictate` / `Stop dictation`); `lang?: string` (default `''` — empty uses the provider locale); `transcriber?: 'browser' | 'app'` (default `'browser'`).
  - v-model: `v-model:listening` `boolean` (default `false`; emits `update:listening`) — whether dictation is on.
  - Events: _none_.
  - Slots: _none_.
  - `data-testid` fallback: `prompt-input-dictate-button`.
- `prompt-input-model-picker/prompt-input-model-picker.vue` — the model and mode picker: a ghost
  small `Button` showing the selected model's provider icon (when set), the model's label and the
  mode's label (muted), with a chevron, that opens a spacious `Popover` above it with an optional
  vertical provider filter rail (`providers`), a search input (`Search models...`), a scrollable
  `Model` menu of radio options (provider icon, label, checkmark, and shortcut or muted description)
  and, when `modes` is not empty, a side-by-side mode column of radio options. The panel stays open
  on a choice; Escape or an outside click closes it. With no `models` the control is disabled; a
  `v-model` that matches no model shows `Model`, and a mode that matches none shows no mode label.
  - Props: `models?: PromptInputMenuOption[]` (default `[]`); `providers?: PromptInputMenuOption[]` (default `[]` — optional provider rail at the inline start); `modes?: PromptInputMenuOption[]` (default `[]`); `modeLabel?: string` (default `''` — empty uses `Mode`; the mode column's label, such as `Thinking Level` or `Effort`).
  - v-model: `v-model` `string` (default `''`; emits `update:modelValue`) — the model; `v-model:mode` `string` (default `''`; emits `update:mode`).
  - Events: _none_.
  - Slots: _none_.
  - `data-testid` fallback: `prompt-input-model-picker`.
- `prompt-input-context-picker/prompt-input-context-picker.vue` — the context picker ("Choose
  project"): a ghost small `Button` with the option's icon (else `icon`) and the chosen label (else
  the placeholder) that opens a `DropdownMenu` of options (the chosen one checked; a choice closes
  the panel) and, once one is chosen, a `Remove context` action. With no `options` the control is
  disabled and shows the placeholder.
  - Props: `options?: PromptInputMenuOption[]` (default `[]`); `placeholder?: string` (default `''` — empty uses `Choose context`); `icon?: string` (default `''` — empty uses `az az-folder`).
  - v-model: `v-model` `string` (default `''`; emits `update:modelValue`) — the chosen option; `''` is none.
  - Events: _none_.
  - Slots: _none_.
  - `data-testid` fallback: `prompt-input-context-picker`.
- `prompt-input-tools/prompt-input-tools.vue` — the tools menu ("Plugins"): a ghost small `Button`
  (`az az-wrench`, `label` else `Tools`) that opens a `DropdownMenu` of checkbox options, followed by
  the enabled tools as removable `Chip`s in a list named `Enabled tools`.
  - Props: `tools?: PromptInputMenuOption[]` (default `[]`); `label?: string` (default `''` — empty uses `Tools`).
  - v-model: `v-model` `string[]` (default `[]`; emits `update:modelValue`) — the enabled tools, in `tools` order.
  - Events: _none_.
  - Slots: _none_.
  - `data-testid` fallback: `prompt-input-tools`.

Exported types: `PromptInputStatus`, `PromptInputMenu`, `PromptInputMenuOption`,
`PromptInputReference`, `PromptInputFile`, `PromptInputRejectReason`,
`PromptInputDictateTranscriber`. Composed DS components: `icon-button` (Submit, Stop, voice,
attach, dictate), `file-token-group` (files, loaded on first file), `button`, `dropdown-menu`,
`chip`.

```
packages/webkit/src/components/ai/prompt-input/
├── prompt-input.vue
├── prompt-input.test.ts
├── index.ts
├── injection-key.ts
├── composables/use-prompt-input-context.ts
├── parts/prompt-input-references.vue
├── parts/prompt-input-add-menu.vue
├── prompt-input-attach-button/prompt-input-attach-button.vue
├── prompt-input-dictate-button/prompt-input-dictate-button.vue
├── prompt-input-model-picker/prompt-input-model-picker.vue
├── prompt-input-context-picker/prompt-input-context-picker.vue
└── prompt-input-tools/prompt-input-tools.vue
```

## v-model

| Model                | Type                     | Default | Emits               | Notes                                                                                                                                                                                                                                       |
| -------------------- | ------------------------ | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`            | `string`                 | `''`    | `update:modelValue` | The prompt being written, via `defineModel`. The owner clears it in its `submit` handler.                                                                                                                                                   |
| `v-model:references` | `PromptInputReference[]` | `[]`    | `update:references` | What the prompt references, added by the menus and shown as removable chips above the text; removing a chip also removes its `<trigger><label>` text.                                                                                       |
| `v-model:files`      | `PromptInputFile[]`      | `[]`    | `update:files`      | The attached files, shown as removable tokens above the text. Accepted picks, drops and pastes are appended as `{ file }`; the owner adds `loading`, `progress`, `error` while it uploads them and clears the list in its `submit` handler. |

## States

- `data-status` mirrors `status`; `data-disabled`; `data-invalid` while over `maxLength`; `data-dragging` on the box while files are dragged over it (only with an `AttachButton`).
- `data-multiline` on the root and the box while the composer is stacked (text on its own row): the prompt took a second line (kept until it is cleared), `minRows` is above 1, files, references, the `attachments` slot or a turned-on tool chip of the `AttachButton` are shown, or a shortcut menu is open. Absent, it is the single bar.
- `ready`: Submit (primary `IconButton`, large, `az az-arrow-up`), disabled while there is nothing to send, the prompt is over the limit, a file is loading or failed, or `disabled`. With `voice` and nothing to send (no text, no files), Start voice conversation (secondary `IconButton`, `az az-audio-lines`) takes its place. While `voiceActive` is `true` and there is nothing to send, End voice conversation (primary `IconButton`, `az az-x`) takes its place and `PromptInput.DictateButton` is disabled with `az az-microphone-off`.
- `pending` / `streaming`: Stop (secondary `IconButton`, `az az-stop`) replaces Submit; Enter does nothing.
- `pending` / `streaming` with `queueable`: Stop stays, and Submit (primary, after Stop at the inline end) shows beside it while there is something to send; Enter and Submit emit `submit` as in `ready`. With nothing to send only Stop shows, and the voice control never does.
- Near the limit (the prompt holds 80% of `maxLength` or more): the `n/max` counter shows before Submit and the text area is described by it; below 80% it is not rendered.
- Over the limit: border turns `--danger-border`, the counter turns danger, `aria-invalid="true"`, and a polite live region says how many characters are over.
- Dragging files over the box: a dashed `--border-selected` panel on `--bg-selected` covers the box and reads `Drop files to attach`.
- Rejected files: a danger line under the box says how many were not added and why (`not an accepted type`, `larger than 10 MB`, `up to 3 files`), in a polite live region; it clears on the next accepted file, a removal or a submit.
- Dictating (`DictateButton`): the control is a secondary `IconButton` named `Stop dictation` (`az az-stop`); a polite status reads `Listening` when it starts and `Dictation stopped` (or `Microphone access is blocked`, or `Dictation stopped. Try again`) when it ends.
- No `loading` or `readonly` state on the composer: upload state is per file (`v-model:files`), and a composer that cannot be used is `disabled`.

## Accessibility

- Visible focus: the container shows `focus-within:ring-2 focus-within:ring-(--ring-color)`.
- Keyboard map: `Enter` submits on a fine pointer (while a response runs only with `queueable`), and adds a line on a coarse pointer, where Submit sends; `Shift+Enter` new line; `Tab` moves through the attachments, the toolbar start controls, the toolbar end controls, Submit / Stop / voice, then the footer row. IME composition (`isComposing`, or between `compositionstart` and `compositionend`) never submits.
- Shortcut menus (`menus`): typing a trigger at the start of a word opens a listbox above the input with up to eight options matching what follows it. Focus stays in the text area, which points at the list with `aria-controls` and at the highlighted option with `aria-activedescendant` (a `textarea` cannot take `role="combobox"` or `aria-expanded`, so it carries `aria-autocomplete="list"` while `menus` is set); `ArrowDown`/`ArrowUp` move, `Enter` or `Tab` choose, `Escape` closes, and Enter does not submit while the list is open. A polite status reads `3 suggestions` or `No matches`. The text area lists the triggers in `aria-keyshortcuts`. References are a list named `References` of removable `Chip`s.
- Files: the tokens are `FileTokenGroup`'s list (named `Files`) with a named remove button each; focus moves as that component defines. The drop panel is decorative (`aria-hidden`); the attach button is the keyboard path. Rejections are announced politely and shown as text.
- "+" menu (`AttachButton` with `tools`): a `DropdownMenu` like the pickers; Camera, Photos and Files are `menuitem`s that open the system picker, the tools `menuitemcheckbox`es that keep the menu open. The trigger keeps the name `Attach files`.
- Pickers: each opens a `DropdownMenu` (`menu` with `menuitemradio` / `menuitemcheckbox`), so arrows, typeahead, `Escape` and focus return come from it. The model trigger's name is its visible text (model and mode). Enabled tools are a list named `Enabled tools` of removable `Chip`s.
- Dictation: the control's name says what pressing it does (`Dictate` / `Stop dictation`), with no `aria-pressed`; the listening status is a polite live region. Where the browser has no speech recognition the control is not rendered.
- Queue: with `queueable`, Stop and Submit are two named buttons in tab order (Stop first); the owner announces the queued prompt through `PromptQueue`'s list, so the composer adds no live region of its own.
- Focus: Submit, Stop and Start voice conversation share one place, except with `queueable` while `pending` / `streaming`, when Stop and Submit sit side by side. When the control that has focus is swapped, removed or disabled (the owner clears the prompt after a submit, which hides a queue Submit; a request starts or ends), focus moves to the text area instead of falling to the page.
- ARIA: the `<textarea>` is named by `aria-label` (no visible label, as Cloudscape allows for an input with an action button), described by the counter (while it shows) and the hint, `aria-invalid` over the limit; Submit, Stop and Start voice conversation are named icon buttons.
- The placeholder never carries required information (it disappears on typing).
- Touch target: `IconButton` medium (44 px on coarse pointers); the small picker `Button`s get the 44 px hit area on coarse pointers from `Button`.

## Right-to-left

- Layout: logical utilities; actions at the inline start, the end slot and Submit at the inline end (`ms-auto` when stacked); the footer row starts at the inline start.
- Icons: the arrow-up, stop, plus, microphone, microphone-off, audio-lines, folder, wrench, camera, image, paperclip and chevron glyphs are not mirrored.
- Keyboard: arrows move in the shortcut menu only while it is open; vertical, so not mirrored. The pickers' arrow keys come from `DropdownMenu`.
- User data: the text area follows the document direction; mixed prompts render with the browser's bidi. File names render in `FileTokenGroup`'s `<bdi>`.

## Internationalization

| Key                            | English source                                             | Override prop                 |
| ------------------------------ | ---------------------------------------------------------- | ----------------------------- |
| `promptInput.label`            | `Prompt`                                                   | `ariaLabel`                   |
| `promptInput.placeholder`      | `Ask a question`                                           | `placeholder`                 |
| `promptInput.submit`           | `Submit`                                                   | —                             |
| `promptInput.stop`             | `Stop generating`                                          | —                             |
| `promptInput.count`            | `{count}/{max}`                                            | —                             |
| `promptInput.overLimit`        | `{count} characters over the limit`                        | —                             |
| `promptInput.menuResults`      | `{count} suggestion(s)` (plural)                           | —                             |
| `promptInput.noMatch`          | `No matches`                                               | —                             |
| `promptInput.menuReferences`   | `References`                                               | —                             |
| `promptInput.voice`            | `Start voice conversation`                                 | —                             |
| `promptInput.voiceEnd`         | `End voice conversation`                                   | —                             |
| `promptInput.attach`           | `Attach files`                                             | `ariaLabel` (AttachButton)    |
| `promptInput.drop`             | `Drop files to attach`                                     | —                             |
| `promptInput.rejectedAccept`   | `{count} file(s) not added: not an accepted type` (plural) | —                             |
| `promptInput.rejectedSize`     | `{count} file(s) not added: larger than {size}` (plural)   | —                             |
| `promptInput.rejectedCount`    | `{count} file(s) not added: up to {max} files` (plural)    | —                             |
| `promptInput.dictate`          | `Dictate`                                                  | `ariaLabel` (DictateButton)   |
| `promptInput.dictateStop`      | `Stop dictation`                                           | —                             |
| `promptInput.listening`        | `Listening`                                                | —                             |
| `promptInput.dictationEnded`   | `Dictation stopped`                                        | —                             |
| `promptInput.dictationBlocked` | `Microphone access is blocked`                             | —                             |
| `promptInput.dictationFailed`  | `Dictation stopped. Try again`                             | —                             |
| `promptInput.model`            | `Model`                                                    | —                             |
| `promptInput.mode`             | `Mode`                                                     | `modeLabel` (ModelPicker)     |
| `promptInput.searchModels`     | `Search models...`                                         | —                             |
| `promptInput.allProviders`     | `All providers`                                            | —                             |
| `promptInput.context`          | `Choose context`                                           | `placeholder` (ContextPicker) |
| `promptInput.contextRemove`    | `Remove context`                                           | —                             |
| `promptInput.tools`            | `Tools`                                                    | `label` (Tools)               |
| `promptInput.toolsEnabled`     | `Enabled tools`                                            | —                             |
| `promptInput.addMenu`          | `Add`                                                      | —                             |
| `promptInput.camera`           | `Camera`                                                   | —                             |
| `promptInput.photos`           | `Photos`                                                   | —                             |
| `promptInput.files`            | `Files`                                                    | —                             |

- Formatting: counts go through `Intl.NumberFormat` (the `t()` number formatting); the size limit through `formatFileSize` from `useLocale`.
- Dictation listens in `lang`, else the provider locale.

## Responsive

- Container queries: none; full width of its host. Every row is a wrapping flex row, so the line
  breaks where its controls stop fitting, at any width, with no breakpoint to keep in step.
- Narrow: the bar's row wraps its slot controls; Submit stays at the inline end; once the text wraps the composer stacks, so the text gets the full width. With `queueable` while busy, Stop and Submit stay together at the inline end and never wrap onto separate lines; each keeps the 44 px target on coarse pointers. The model `Button` truncates the mode label first. The footer row wraps onto more lines; nothing scrolls sideways.
- Shortcut menu (`/`, `@`): opens above the box, and below it when the space above the box in the visible viewport (the on-screen keyboard excluded) is shorter than the list and the space below is larger, so a composer at the top of a page or a panel never draws its list off-screen; the list carries `data-side="top|bottom"`.
- Height: the text area measures its height again whenever its own width changes (a resize observer, released when the component unmounts), so a composer mounted in a pane that starts near zero width (a split view opening on a phone) settles to one row once the pane has its width.
- Touch: `enterkeyhint="send"` on a fine pointer and `enterkeyhint="enter"` on a coarse pointer, where Enter adds a line so a multi-line prompt can be typed on a soft keyboard; targets 44 px on coarse pointers, shortcut menu rows included.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import PromptInput from '@aziontech/webkit/prompt-input'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { ref } from 'vue'

  const prompt = ref('')
  const files = ref([])
  const model = ref('gemini-4-neon')
  const mode = ref('medium')
  const project = ref('')
  const tools = ref([])
  const last = ref('')
  const voiceActive = ref(false)

  const providers = [
    { value: 'azion', label: 'Azion AI', icon: 'az az-azion' },
    { value: 'google', label: 'Google', icon: 'az az-gemini' },
    { value: 'anthropic', label: 'Anthropic', icon: 'az az-claude' },
    { value: 'openai', label: 'OpenAI', icon: 'az az-openai' },
    { value: 'meta', label: 'Meta', icon: 'az az-meta' }
  ]
  const models = [
    { value: 'gemini-4-neon', label: 'Gemini 4 Neon', provider: 'google', shortcut: '⌘1' },
    { value: 'gemini-4-carbon', label: 'Gemini 4 Carbon', provider: 'google', shortcut: '⌘2' },
    { value: 'gemini-3-8-flash', label: 'Gemini 3.8 Flash', provider: 'google', shortcut: '⌘3' },
    { value: 'claude-opus-4-5', label: 'Claude Opus 4.5', provider: 'anthropic', shortcut: '⌘4' },
    { value: 'claude-sonnet-4', label: 'Claude Sonnet 4', provider: 'anthropic', shortcut: '⌘5' },
    { value: 'gpt-5-2', label: 'GPT-5.2', provider: 'openai', shortcut: '⌘6' },
    { value: 'llama-4-maverick', label: 'Llama 4 Maverick', provider: 'meta', shortcut: '⌘7' },
    {
      value: 'azion-auto',
      label: 'Azion Auto',
      provider: 'azion',
      description: 'AI Gateway router'
    }
  ]
  const modes = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'extra', label: 'Extra' }
  ]
  const projects = [
    { value: 'acme-store', label: 'acme-store', description: 'Storefront and checkout' },
    { value: 'docs-site', label: 'docs-site', description: 'Product documentation' }
  ]
  const toolOptions = [
    { value: 'search', label: 'Web search', icon: 'az az-globe' },
    { value: 'images', label: 'Create images', icon: 'az az-image' },
    { value: 'research', label: 'Deep research', icon: 'az az-sparkles' }
  ]

  function send(event, { value, files: sent }) {
    last.value = `Submitted: ${value || 'files only'} (${sent.length} file${sent.length === 1 ? '' : 's'})`
    prompt.value = ''
    files.value = []
  }

  const VOICE_CLASS =
    'flex flex-wrap items-center justify-between gap-(--spacing-sm) rounded-(--shape-card) ' +
    'border border-(--border-input) bg-(--bg-surface-raised) px-(--spacing-md) py-(--spacing-sm) shadow-(--shadow-lg)'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <div
      v-if="voiceActive"
      role="region"
      aria-label="Live voice conversation"
      :class="VOICE_CLASS"
    >
      <div class="flex items-center gap-(--spacing-sm)">
        <i
          class="az az-audio-lines shrink-0 text-(--text-default)"
          aria-hidden="true"
        />
        <StatusIndicator
          severity="info"
          label="Listening…"
          loading
        />
      </div>
      <span class="text-body-xs text-(--text-muted)">
        Microphone dictation is disabled while live voice is active.
      </span>
    </div>
    <PromptInput
      v-model="prompt"
      v-model:files="files"
      :max-files="5"
      voice
      :voice-active="voiceActive"
      @submit="send"
      @voice-start="
        () => {
          voiceActive = true
          last = 'Voice conversation started'
        }
      "
      @voice-end="
        () => {
          voiceActive = false
          last = 'Voice conversation ended'
        }
      "
    >
      <template #actions>
        <PromptInput.AttachButton />
      </template>
      <template #end>
        <PromptInput.ModelPicker
          v-model="model"
          v-model:mode="mode"
          :providers="providers"
          :models="models"
          :modes="modes"
          mode-label="Thinking Level"
        />
        <PromptInput.DictateButton />
      </template>
      <template #footer>
        <PromptInput.ContextPicker
          v-model="project"
          :options="projects"
          placeholder="Choose project"
        />
        <Button
          label="Files"
          icon="az az-folder-open"
          variant="ghost"
          size="small"
        />
        <PromptInput.Tools
          v-model="tools"
          :tools="toolOptions"
          label="Plugins"
        />
        <Button
          label="Open desktop app"
          icon="az az-desktop"
          variant="ghost"
          size="small"
          href="https://example.com/download"
        />
      </template>
      <template #hint>The AI assistant can make mistakes. Check important information.</template>
    </PromptInput>
    <p
      v-if="last"
      class="text-body-sm text-(--text-muted)"
    >
      {{ last }}
    </p>
  </div>
</template>
```

### Streaming

```vue
<script setup>
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import { onBeforeUnmount, ref } from 'vue'

  const prompt = ref('Why did my cache hit ratio drop?')
  const status = ref('ready')
  let timer

  function send() {
    prompt.value = ''
    status.value = 'pending'
    timer = setTimeout(() => {
      status.value = 'streaming'
      timer = setTimeout(() => (status.value = 'ready'), 4000)
    }, 800)
  }

  function stop() {
    clearTimeout(timer)
    status.value = 'ready'
  }

  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <PromptInput
      v-model="prompt"
      :status="status"
      @submit="send"
      @stop="stop"
    />
  </div>
</template>
```

### CharacterLimit

```vue
<script setup>
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import { ref } from 'vue'

  const prompt = ref(
    'Write a function that redirects every request from the old blog path to the new one, keeps the query string, ' +
      'answers with a permanent redirect and logs the original path so I can check later which links people still ' +
      'use. It should also skip the redirect for requests that already come from the new path, and it should run ' +
      'before the cache.'
  )
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <PromptInput
      v-model="prompt"
      :max-length="280"
    />
  </div>
</template>
```
