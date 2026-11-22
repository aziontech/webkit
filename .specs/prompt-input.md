---
name: prompt-input
category: ai
structure: composition
status: implemented
spec_version: 8
template: 2
checksum: 849bc54680934bfe41411b90f5bbaddc0220f16e4979f992041462aa7e68b671
created: 2026-11-11
last_updated: 2026-11-22
---

# PromptInput — Component Spec

## Purpose

The composer of a generative AI chat (ChatGPT, Claude.ai and Gemini composers, AI Elements
PromptInput, Cloudscape prompt input): a text area that grows with the prompt up to `maxRows`, a
toolbar under it, files attached by a button, by dropping them on the box or by pasting them, a
model and mode picker, dictation, a voice-conversation control that stands in for Submit while the
prompt is empty, a Submit control that becomes Stop while a response is generated, a secondary row
under the box (a context picker, tools, links), an optional character limit with a counter, and
constraint text under it all. Enter submits; Shift+Enter adds a line; an IME composition never
submits.

It is controlled: the owner holds the text and the files, receives `submit` with the trimmed prompt,
its references and its files, and clears them. While `status` is `pending` or `streaming` the reader
can keep typing the next prompt, but cannot submit it until the response ends or they press Stop.
With `queueable` the owner keeps a queue of prompts to send after the response (TanStack AI
`useChat` queues a `sendMessage` made while it streams): Submit then stays beside Stop, and Enter
or Submit sends the next prompt into that queue while Stop still ends the response.

The anatomy is composed by the app: the root draws the box, the text area, Submit / Stop / voice and
the file tokens; the controls the app wants (attach, dictate, model, context, tools) are
sub-components it places in the `actions`, `end` and `footer` slots. Each reads the composer through
`provide` / `inject`, so the app wires nothing but its own values.

At rest it is one floating bar (Attach `+`, the text, the `end` controls, Submit, voice or
Stop) on a translucent raised surface with a shadow and a backdrop blur, so a thread can scroll
under it. A second line, attached files or references, or an open shortcut menu stack it into
two rows (text on its own row) until the prompt is cleared.

## When to use

- The input of any conversation with the generative AI assistant.
- A single "Ask about this page" box that opens a conversation.

## When NOT to use

- A text field in a form → `textarea` inside `field`.
- Search over a list → `input` with a search icon or `property-filter`.
- A command palette → `command`.
- A file upload form → `file-dropzone` with `file-token-group` in a `field`.

## Related

- `textarea` — the form control; this one has no visible label and submits on Enter.
- `conversation` — the log above it; only the log scrolls.
- `suggestion-group` — prompts the reader can send without typing.
- `file-token-group` — what the attached files render as (horizontal, removable).
- `file-dropzone` — the drop target for a page-wide drop; the composer box is its own drop target.
- `dropdown-menu` — what the model, context and tools pickers open.
- `select` (`variant="ghost"`) — a plain single choice the app adds to the toolbar itself.

## Best practices

- Placeholder is a suggested question with no end punctuation (`Ask a question`); never the only instruction.
- Put the disclaimer and the shortcuts in `hint`, not in the placeholder.
- Set `status` from the request so Submit turns into Stop; wire `stop` to abort it.
- Set `queueable` only when the owner queues what is sent while a response runs, and shows the
  queue (`PromptQueue` above the composer) so the reader can remove a prompt before it is sent.
- Clear `v-model` and `v-model:files` in the `submit` handler and keep focus in the input.
- Use `maxLength` only when the backend has a limit; the counter is the warning, and it stays hidden
  until the prompt reaches 80% of the limit, so a resting composer shows no number.
- Compose only the controls the product has. Attach first at the inline start; model, dictate and
  Submit at the inline end, in that order; the secondary row holds what is not about this prompt
  (where the chat lives, the tools, a link to the desktop app).
- Show the upload state on each file (`loading`, `progress`, `error`); Submit waits for them.
- Set `voice` only when the product has a voice conversation; Submit replaces it as soon as there is
  something to send.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import Button from '@aziontech/webkit/button'
  import PromptInput from '@aziontech/webkit/prompt-input'

  const prompt = ref('')
  const files = ref([])
  const status = ref('ready')
  const model = ref('sol')
  const mode = ref('medium')
  const context = ref('')
  const tools = ref([])

  const models = [
    { value: 'sol', label: 'Sol 6.1', description: 'Best for everyday tasks' },
    { value: 'terra', label: 'Terra 6.1', description: 'Fastest answers' }
  ]
  const modes = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]
  const projects = [{ value: 'acme-store', label: 'acme-store', icon: 'az az-folder' }]
  const toolOptions = [{ value: 'search', label: 'Web search', icon: 'az az-globe' }]

  function send(event, { value, files: sent }) {
    prompt.value = ''
    files.value = []
    status.value = 'pending'
  }

  function startVoiceChat(event) {
    status.value = 'ready'
  }
</script>

<template>
  <PromptInput
    v-model="prompt"
    v-model:files="files"
    :status="status"
    voice
    @submit="send"
    @stop="status = 'ready'"
    @voice-start="startVoiceChat"
  >
    <template #actions>
      <PromptInput.AttachButton />
    </template>
    <template #end>
      <PromptInput.ModelPicker
        v-model="model"
        v-model:mode="mode"
        :models="models"
        :modes="modes"
      />
      <PromptInput.DictateButton />
    </template>
    <template #footer>
      <PromptInput.ContextPicker
        v-model="context"
        :options="projects"
        placeholder="Choose project"
      />
      <PromptInput.Tools
        v-model="tools"
        :tools="toolOptions"
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
</template>
```

Tree-shaking alternative — the root and each part as standalone imports:

```vue
<script setup>
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import PromptInputAttachButton from '@aziontech/webkit/prompt-input-attach-button'
  import PromptInputDictateButton from '@aziontech/webkit/prompt-input-dictate-button'
  import PromptInputModelPicker from '@aziontech/webkit/prompt-input-model-picker'
  import PromptInputContextPicker from '@aziontech/webkit/prompt-input-context-picker'
  import PromptInputTools from '@aziontech/webkit/prompt-input-tools'
</script>
```

## Sub-components

Compound API through `index.ts` (`PromptInput.AttachButton`, `PromptInput.DictateButton`,
`PromptInput.ModelPicker`, `PromptInput.ContextPicker`, `PromptInput.Tools`); standalone entries
`prompt-input-root`, `prompt-input-attach-button`, `prompt-input-dictate-button`,
`prompt-input-model-picker`, `prompt-input-context-picker`, `prompt-input-tools`. The root provides
the composer context (`injection-key.ts`): `disabled`, `accept`, `maxFiles`, `maxFileSize`,
`fileCount`, the text (read and write), `appendFiles`, `reject`, `setRejection`, `setDragging`,
`registerAttach(handlers)`, `focus()`. `usePromptInputContext()` throws outside a `PromptInput`.
Every part disables with the composer. The compound attaches the three pickers as async
components, so `@aziontech/webkit/prompt-input` does not carry `DropdownMenu` until a picker
renders; their standalone paths are static.

- `prompt-input-attach-button/prompt-input-attach-button.vue` — the attach control: a ghost
  `IconButton` (`az az-plus`) that opens a hidden `input type="file"` with the root's `accept` and
  `multiple` unless `maxFiles` is `1`. Its presence turns on dropping and pasting files into the box:
  it registers drag and paste handlers with the root on setup and takes them back on dispose, sorts
  every picked, dropped or pasted batch against `accept`, `maxFileSize` and `maxFiles`, appends the
  accepted files and reports the rest through the root (`reject`, the line under the box). A
  composer that offers no way to attach does not take files silently.
  - Props: `ariaLabel?: string` (default `''` — empty uses `Attach files`); `icon?: string` (default `''` — empty uses `az az-plus`).
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
  small `Button` showing the model's label and the mode's label (muted), with a chevron, that opens
  a `DropdownMenu` above it with a `Model` group of radio options (label, description muted at the
  end of the row) and, when `modes` is not empty, a mode group of radio options. The panel stays
  open on a choice, as radio items do; Escape or an outside click closes it. With no `models` the
  control is disabled; a `v-model` that matches no model shows `Model`, and a mode that matches
  none shows no mode label.
  - Props: `models?: PromptInputMenuOption[]` (default `[]`); `modes?: PromptInputMenuOption[]` (default `[]`); `modeLabel?: string` (default `''` — empty uses `Mode`; the mode group's label, such as `Effort`).
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
├── prompt-input-attach-button/prompt-input-attach-button.vue
├── prompt-input-dictate-button/prompt-input-dictate-button.vue
├── prompt-input-model-picker/prompt-input-model-picker.vue
├── prompt-input-context-picker/prompt-input-context-picker.vue
└── prompt-input-tools/prompt-input-tools.vue
```

## Props

| Prop          | Type                                  | Default   | Required | JSDoc                                                                                                                                                                                          |
| ------------- | ------------------------------------- | --------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `placeholder` | `string`                              | `''`      | false    | Hint shown while empty, a suggested question with no end punctuation. Empty uses the locale catalog (`Ask a question`).                                                                        |
| `ariaLabel`   | `string`                              | `''`      | false    | Accessible name of the text area; the input has no visible label. Empty uses the locale catalog (`Prompt`).                                                                                    |
| `maxLength`   | `number`                              | `0`       | false    | Character limit; an `n/max` counter shows from 80% of it and submit is blocked over it. `0` means no limit.                                                                                    |
| `minRows`     | `number`                              | `1`       | false    | Rows shown while empty.                                                                                                                                                                        |
| `maxRows`     | `number`                              | `6`       | false    | Rows the text area grows to before it scrolls.                                                                                                                                                 |
| `status`      | `'ready' \| 'pending' \| 'streaming'` | `'ready'` | false    | Request lifecycle: `pending` and `streaming` swap Submit for Stop and block another submit (unless `queueable`); typing stays allowed.                                                         |
| `disabled`    | `boolean`                             | `false`   | false    | Disables the text area, the submit control and every control in the slots' rows.                                                                                                               |
| `menus`       | `PromptInputMenu[]`                   | `[]`      | false    | Shortcut menus opened by a trigger character at the start of a word: `/` for commands, `@` for things to reference. Choosing an option inserts `<trigger><label>` and adds it to `references`. |
| `accept`      | `string`                              | `''`      | false    | File filter in the native accept syntax (extensions, MIME types, wildcards) for picked, dropped and pasted files. Empty accepts every file.                                                    |
| `maxFiles`    | `number`                              | `0`       | false    | Most files attached at once; files past it are rejected. `0` means no limit.                                                                                                                   |
| `maxFileSize` | `number`                              | `0`       | false    | Largest file in bytes; larger files are rejected. `0` means no limit.                                                                                                                          |
| `voice`       | `boolean`                             | `false`   | false    | Shows a Start voice conversation control in place of Submit while there is nothing to send; it emits `voice-start`.                                                                            |
| `queueable`   | `boolean`                             | `false`   | false    | While `status` is `pending` or `streaming`, keeps Submit beside Stop and lets Enter submit, so the owner queues the prompt for after the response.                                             |

Types: `PromptInputMenu = { trigger: string; label: string; options: PromptInputMenuOption[] }`, `PromptInputMenuOption = { value: string; label: string; description?: string; icon?: string }` (also the option shape of the model, mode, context and tools pickers), `PromptInputReference = { trigger: string; value: string; label: string }`, `PromptInputFile = FileTokenGroupItem` (`{ file: File | FileTokenGroupFile; loading?: boolean; progress?: number; error?: string; warning?: string }`), `PromptInputRejectReason = 'accept' | 'max-files' | 'max-file-size'`, `PromptInputDictateTranscriber = 'browser' | 'app'`.

## v-model

| Model                | Type                     | Default | Emits               | Notes                                                                                                                                                                                                                                       |
| -------------------- | ------------------------ | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`            | `string`                 | `''`    | `update:modelValue` | The prompt being written, via `defineModel`. The owner clears it in its `submit` handler.                                                                                                                                                   |
| `v-model:references` | `PromptInputReference[]` | `[]`    | `update:references` | What the prompt references, added by the menus and shown as removable chips above the text; removing a chip also removes its `<trigger><label>` text.                                                                                       |
| `v-model:files`      | `PromptInputFile[]`      | `[]`    | `update:files`      | The attached files, shown as removable tokens above the text. Accepted picks, drops and pastes are appended as `{ file }`; the owner adds `loading`, `progress`, `error` while it uploads them and clears the list in its `submit` handler. |

## Events

| Event         | Payload                                                                                                                          | When                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `submit`      | `(event: MouseEvent \| KeyboardEvent, payload: { value: string; references: PromptInputReference[]; files: PromptInputFile[] })` | Enter (without Shift, outside an IME composition) or Submit, while `status` is `ready` (or any status with `queueable`), the prompt is within the limit, it has text or files, and no file is loading or failed. `event` is the Enter keydown or the Submit click; `payload.value` is trimmed; `payload.references` holds the references whose `<trigger><label>` is still in the text; `payload.files` is `files`. |
| `stop`        | `(event: MouseEvent)`                                                                                                            | Stop pressed while `pending` or `streaming`.                                                                                                                                                                                                                                                                                                                                                                        |
| `voice-start` | `(event: MouseEvent)`                                                                                                            | The Start voice conversation control was pressed (`voice`, nothing to send, `status` `ready`). The app opens and owns the audio session.                                                                                                                                                                                                                                                                            |
| `reject`      | `(event: Event, payload: { files: File[]; reason: PromptInputRejectReason })`                                                    | Picked, dropped or pasted files were not attached: they do not match `accept`, are larger than `maxFileSize`, or are past `maxFiles`. Once per reason; `event` is the change, drop or paste event. The composer also shows the reason under the box.                                                                                                                                                                |

## Slots

| Slot          | Scope | Notes                                                                                                                                                                                                                         |
| ------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `attachments` | —     | Attached context the app draws itself, above the text, before the file tokens and the references.                                                                                                                             |
| `actions`     | —     | Controls at the inline start of the bar (`PromptInput.AttachButton`); inside a `fieldset` disabled with the input.                                                                                                            |
| `end`         | —     | Controls at the inline end of the bar, before Submit (`PromptInput.ModelPicker`, `PromptInput.DictateButton`); disabled with the input.                                                                                       |
| `footer`      | —     | A secondary row under the bar (`PromptInput.ContextPicker`, `PromptInput.Tools`, links); wraps on narrow screens; disabled with the input. Optional: for the single-bar look, place the pickers in `actions` / `end` instead. |
| `hint`        | —     | Constraint text under everything; referenced by `aria-describedby`.                                                                                                                                                           |

## States

- `data-status` mirrors `status`; `data-disabled`; `data-invalid` while over `maxLength`; `data-dragging` on the box while files are dragged over it (only with an `AttachButton`).
- `data-multiline` on the root and the box while the composer is stacked (text on its own row): the prompt took a second line (kept until it is cleared), `minRows` is above 1, files, references or the `attachments` slot are shown, or a shortcut menu is open. Absent, it is the single bar.
- `ready`: Submit (primary `IconButton`, large, `az az-arrow-up`), disabled while there is nothing to send, the prompt is over the limit, a file is loading or failed, or `disabled`. With `voice` and nothing to send (no text, no files), Start voice conversation (primary `IconButton`, `az az-headphones`) takes its place.
- `pending` / `streaming`: Stop (secondary `IconButton`, `az az-stop`) replaces Submit; Enter does nothing.
- `pending` / `streaming` with `queueable`: Stop stays, and Submit (primary, after Stop at the inline end) shows beside it while there is something to send; Enter and Submit emit `submit` as in `ready`. With nothing to send only Stop shows, and the voice control never does.
- Near the limit (the prompt holds 80% of `maxLength` or more): the `n/max` counter shows before Submit and the text area is described by it; below 80% it is not rendered.
- Over the limit: border turns `--danger-border`, the counter turns danger, `aria-invalid="true"`, and a polite live region says how many characters are over.
- Dragging files over the box: a dashed `--border-selected` panel on `--bg-selected` covers the box and reads `Drop files to attach`.
- Rejected files: a danger line under the box says how many were not added and why (`not an accepted type`, `larger than 10 MB`, `up to 3 files`), in a polite live region; it clears on the next accepted file, a removal or a submit.
- Dictating (`DictateButton`): the control is a secondary `IconButton` named `Stop dictation` (`az az-stop`); a polite status reads `Listening` when it starts and `Dictation stopped` (or `Microphone access is blocked`, or `Dictation stopped. Try again`) when it ends.
- No `loading` or `readonly` state on the composer: upload state is per file (`v-model:files`), and a composer that cannot be used is `disabled`.

## Motion & Animations

| Trigger         | Animation / Transition                                        | Token                            | Reduced-motion fallback         |
| --------------- | ------------------------------------------------------------- | -------------------------------- | ------------------------------- |
| focus / invalid | `transition-colors duration-fast-02 ease-productive-entrance` | `fast-02`, `productive-entrance` | `motion-reduce:transition-none` |

## Tokens

| Region                   | Token                                                                                                                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| container                | `var(--bg-surface-raised)` at 88 % (`color-mix`), `backdrop-blur-md`, `var(--shadow-lg)`, `var(--border-default)`; `var(--shape-card)`, single row and stacked; focus `var(--border-strong)` + `var(--ring-color)` |
| invalid border           | `var(--danger-border)`                                                                                                                                                                                             |
| disabled surface         | `var(--bg-disabled)`                                                                                                                                                                                               |
| drop panel               | `var(--bg-selected)`, dashed `var(--border-selected)`, `.text-label-md`, `var(--text-default)`                                                                                                                     |
| text                     | `.text-body-md`, `var(--text-default)`; placeholder `var(--text-muted)`; 40 px minimum row                                                                                                                         |
| Submit, Stop, voice      | large `IconButton` (40 px), `var(--shape-button)`; Attach, Dictate and the pickers' triggers keep their own `var(--shape-button)` too                                                                              |
| counter, hint            | `.text-body-xs`, `var(--text-muted)`; over limit and rejected files `var(--danger-foreground)`                                                                                                                     |
| mode label               | `var(--text-muted)` inside the model `Button`                                                                                                                                                                      |
| padding / gaps           | `var(--spacing-xs)`, `var(--spacing-2xs)`, `var(--spacing-sm)`                                                                                                                                                     |
| row fill inset (2px gap) | `border-y border-transparent bg-clip-padding`                                                                                                                                                                      |

## Theme gaps

- None.

## Accessibility (WCAG 2.1 AA)

- Visible focus: the container shows `focus-within:ring-2 focus-within:ring-(--ring-color)`.
- Keyboard map: `Enter` submits (while a response runs only with `queueable`); `Shift+Enter` new line; `Tab` moves through the attachments, the toolbar start controls, the toolbar end controls, Submit / Stop / voice, then the footer row. IME composition (`isComposing`, or between `compositionstart` and `compositionend`) never submits.
- Shortcut menus (`menus`): typing a trigger at the start of a word opens a listbox above the input with up to eight options matching what follows it. Focus stays in the text area, which points at the list with `aria-controls` and at the highlighted option with `aria-activedescendant` (a `textarea` cannot take `role="combobox"`); `ArrowDown`/`ArrowUp` move, `Enter` or `Tab` choose, `Escape` closes, and Enter does not submit while the list is open. A polite status reads `3 suggestions` or `No matches`. The text area lists the triggers in `aria-keyshortcuts`. References are a list named `References` of removable `Chip`s.
- Files: the tokens are `FileTokenGroup`'s list (named `Files`) with a named remove button each; focus moves as that component defines. The drop panel is decorative (`aria-hidden`); the attach button is the keyboard path. Rejections are announced politely and shown as text.
- Pickers: each opens a `DropdownMenu` (`menu` with `menuitemradio` / `menuitemcheckbox`), so arrows, typeahead, `Escape` and focus return come from it. The model trigger's name is its visible text (model and mode). Enabled tools are a list named `Enabled tools` of removable `Chip`s.
- Dictation: the control's name says what pressing it does (`Dictate` / `Stop dictation`), with no `aria-pressed`; the listening status is a polite live region. Where the browser has no speech recognition the control is not rendered.
- Queue: with `queueable`, Stop and Submit are two named buttons in tab order (Stop first); the owner announces the queued prompt through `PromptQueue`'s list, so the composer adds no live region of its own.
- Focus: Submit, Stop and Start voice conversation share one place, except with `queueable` while `pending` / `streaming`, when Stop and Submit sit side by side. When the control that has focus is swapped, removed or disabled (the owner clears the prompt after a submit, which hides a queue Submit; a request starts or ends), focus moves to the text area instead of falling to the page.
- ARIA: the `<textarea>` is named by `aria-label` (no visible label, as Cloudscape allows for an input with an action button), described by the counter (while it shows) and the hint, `aria-invalid` over the limit; Submit, Stop and Start voice conversation are named icon buttons.
- The placeholder never carries required information (it disappears on typing).
- Touch target: `IconButton` medium (44 px on coarse pointers); the small picker `Button`s get the 44 px hit area on coarse pointers from `Button`.

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
| `promptInput.context`          | `Choose context`                                           | `placeholder` (ContextPicker) |
| `promptInput.contextRemove`    | `Remove context`                                           | —                             |
| `promptInput.tools`            | `Tools`                                                    | `label` (Tools)               |
| `promptInput.toolsEnabled`     | `Enabled tools`                                            | —                             |

- Formatting: counts go through `Intl.NumberFormat` (the `t()` number formatting); the size limit through `formatFileSize` from `useLocale`.
- Dictation listens in `lang`, else the provider locale.

## Right-to-left

- Layout: logical utilities; actions at the inline start, the end slot and Submit at the inline end (`ms-auto` when stacked); the footer row starts at the inline start.
- Icons: the arrow-up, stop, plus, microphone, headphones, folder, wrench and chevron glyphs are not mirrored.
- Keyboard: arrows move in the shortcut menu only while it is open; vertical, so not mirrored. The pickers' arrow keys come from `DropdownMenu`.
- User data: the text area follows the document direction; mixed prompts render with the browser's bidi. File names render in `FileTokenGroup`'s `<bdi>`.

## Responsive

- Container queries: none; full width of its host. Every row is a wrapping flex row, so the line
  breaks where its controls stop fitting, at any width, with no breakpoint to keep in step.
- Narrow: the bar's row wraps its slot controls; Submit stays at the inline end; once the text wraps the composer stacks, so the text gets the full width. With `queueable` while busy, Stop and Submit stay together at the inline end and never wrap onto separate lines; each keeps the 44 px target on coarse pointers. The model `Button` truncates the mode label first. The footer row wraps onto more lines; nothing scrolls sideways.
- Shortcut menu (`/`, `@`): opens above the box, and below it when the space above the box in the visible viewport (the on-screen keyboard excluded) is shorter than the list and the space below is larger, so a composer at the top of a page or a panel never draws its list off-screen; the list carries `data-side="top|bottom"`.
- Height: the text area measures its height again whenever its own width changes (a resize observer, released when the component unmounts), so a composer mounted in a pane that starts near zero width (a split view opening on a phone) settles to one row once the pane has its width.
- Touch: `enterkeyhint="send"` on mobile keyboards; targets 44 px on coarse pointers.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget (gzip, entry and its static imports, `.size-limit.json`): `prompt-input` 12.4 KB
  (the compound; pickers lazy), `prompt-input-root` 9.25 KB (was 7.15 KB as `prompt-input`; the
  raise carries files, drop and paste wiring, voice, the end and footer rows), `prompt-input-attach-button`
  5.6 KB, `prompt-input-dictate-button` 5.55 KB, `prompt-input-model-picker` 14.05 KB,
  `prompt-input-context-picker` 13.95 KB, `prompt-input-tools` 16.25 KB (each picker includes
  `DropdownMenu` and `Button`, shared when several are used).
- Runtime budget: one layout read per input event (auto-size); a drag over the box reads `dataTransfer.types` only.
- Heavy parts: `FileTokenGroup` and the references list load on first use (`defineAsyncComponent`); the pickers pull `DropdownMenu` only when the app imports them; dictation uses the browser's speech recognition, no library.

## Decisions and open questions

Benchmarks read 2026-11-17: ChatGPT composer (the reference: `+` attach, model and effort picker
`GPT-6.1 Sol Medium`, microphone, voice button that becomes Send, and a row under it with Choose
project, Files, Plugins, Open desktop app), Claude.ai composer (`+` menu for files and tools, model
picker with extended thinking, project, voice), Gemini (`+` upload, Tools, model and mode picker,
microphone), AI SDK Elements `PromptInput` (attachments with `accept` / `maxFiles` / `maxFileSize`
and an error code `accept` / `max_files` / `max_file_size`, drop on the form, model `Select`,
action menu, Web Speech API speech button, submit status `submitted` / `streaming` / `error`),
shadcn AI prompt-input pattern (attach button with a hidden input, paste and drop added by hand,
model and effort `DropdownMenu`s, send that becomes stop, IME-safe Enter).

| Feature                                  | Before (v5) | Now (v6) | ChatGPT | Claude.ai | Gemini | AI Elements | shadcn AI |
| ---------------------------------------- | ----------- | -------- | ------- | --------- | ------ | ----------- | --------- |
| Autosize, Enter / Shift+Enter, IME-safe  | yes         | yes      | yes     | yes       | yes    | yes         | yes       |
| Send becomes Stop while streaming        | yes         | yes      | yes     | yes       | yes    | yes         | yes       |
| Character limit and counter              | yes         | yes      | no      | no        | no     | no          | no        |
| `/` and `@` shortcut menus, references   | yes         | yes      | partial | partial   | `@`    | command     | no        |
| Attach button (file picker)              | slot only   | yes      | yes     | yes       | yes    | yes         | yes       |
| Drop files on the box                    | no          | yes      | yes     | yes       | yes    | yes         | by hand   |
| Paste files                              | no          | yes      | yes     | yes       | yes    | no          | by hand   |
| Accept, count and size limits, rejection | no          | yes      | yes     | yes       | yes    | yes         | no        |
| File tokens with upload state            | slot only   | yes      | yes     | yes       | yes    | yes         | yes       |
| Model and mode picker                    | slot only   | yes      | yes     | yes       | yes    | model only  | yes       |
| Dictation (speech to text)               | no          | yes      | yes     | yes       | yes    | yes         | no        |
| Voice conversation in place of Send      | no          | yes      | yes     | yes       | yes    | no          | no        |
| Context or project picker                | no          | yes      | yes     | yes       | no     | no          | no        |
| Tools menu with enabled-tool chips       | no          | yes      | yes     | yes       | yes    | action menu | no        |
| Secondary row under the box              | no          | yes      | yes     | no        | no     | no          | no        |

- **Composition, not config.** Every control is a part the app places; the root only draws what
  every composer has (text, Submit / Stop / voice, files). The pickers take their options as data
  (`models`, `modes`, `options`, `tools`) because they are lists of records, not UI.
- **Files are accepted only with an `AttachButton`.** Drop and paste follow the affordance: a
  composer that shows no attach control would otherwise take files the product cannot send.
- **`v-model:files` holds `FileTokenGroupItem`s**, so the owner shows upload progress and errors on
  the same records it receives, and Submit waits for them. No upload is done here.
- **Voice is a prop and an event, not a part**: it occupies Submit's place, which only the root
  draws. The app owns the audio session (no WebRTC, no audio code here).
- **Dictation falls back to the app.** `transcriber="app"` lets a product use its own speech
  service; the browser path needs no library and stays hidden where unsupported.
- **The `+` menu of Claude.ai and ChatGPT** (files and tools behind one button) is not a part: the
  attach button opens the picker directly and the tools have their own menu, which keeps each
  control one action. An app that wants one menu composes `DropdownMenu` itself.
- **Left out:** screenshot capture (AI Elements `AddScreenshot`, needs a browser permission flow
  the app owns), image thumbnails in the tokens (`FileTokenGroup` has none; `file-preview` can be
  placed in the `attachments` slot), a token count (the app knows its tokenizer; `maxLength` stays
  characters).
- **Non-breaking.** Every v5 prop, event and slot keeps its meaning, and the new `files` key in the
  `submit` payload is additive. `./prompt-input` (and its `typesVersions` entry) now resolves to
  `index.ts` / `index.d.ts`, whose default export is the same component with its parts attached and
  which re-exports every v5 type; `./prompt-input-root` points at the root `.vue`, and each part has
  its own export.
- **Queueing is opt-in (`queueable`, spec_version 7).** TanStack AI `useChat` queues a message sent
  while a run streams (`queue`, `cancelQueued`); ChatGPT and Claude.ai let the reader type and
  send the next message the same way. The composer only lets the submit through while busy; the
  owner holds the queue and draws it with `PromptQueue`. Off by default, so every v6 composer keeps
  blocking a submit while busy. The name is the capability adjective of `prop-vocabulary.md`.
- **Names.** `ModelPicker` and `ContextPicker`, not `…Select`: they open a `DropdownMenu`, not the
  `select` listbox, and `ContextMenu` is already the right-click menu's name.

## Spec review

Second-agent review (`spec-reviewer` checklist), 2026-11-17. Verdict on the first draft: return,
with nine findings, all folded into this version: frontmatter and review section; the export and
`typesVersions` move stated; the Usage handler no longer shadows `files` and defines its voice
handler; `ModelSelect` / `ContextSelect` renamed to `ModelPicker` / `ContextPicker`; Purpose names
the `end` slot; the empty and unmatched states of the pickers, the absence of `loading` / `readonly`,
and the other dictation errors stated; focus moves to the text area when the focused Submit / Stop /
voice control swaps; dictation uses a changing name, not `aria-pressed`; gzip budgets declared;
the wrapping rows explained. Tokens, right-to-left, internationalization and reuse passed.

spec_version 7 (`queueable`), second-agent review 2026-11-19: returned with two findings, both
folded in: the Focus bullet now covers Stop and Submit side by side, and Responsive keeps the pair
together at the inline end. Naming, reuse, states, internationalization, right-to-left, tokens and
performance passed.

## Examples

_Examples in `packages/webkit/examples/prompt-input/`: Default (the full composer), Streaming (Stop), Character limit, With attachments and actions, Disabled, Shortcut menus (`/` commands and `@` references), Queue (`queueable` with a `PromptQueue` above the composer)._

Default composes every part like the reference composer. With attachments and actions is justified
beyond the states: it shows `v-model:files` with upload state and the limits, which Default only
starts empty. Queue is justified by the `queueable` prop: it is the only example where Submit and
Stop show together and a prompt sent while busy lands in the queue.

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
