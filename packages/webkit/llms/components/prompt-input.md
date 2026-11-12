# Prompt Input

> The composer of a generative AI chat (Cloudscape prompt input, AI Elements PromptInput): a text area that grows with the prompt up to `maxRows`, a Submit control that becomes Stop while a response is being generated, a toolbar row for secondary controls (attach, mode), an attachments row above the text, an optional character limit with a counter, and constraint text under it (a disclaimer or the shortcuts it accepts). Enter submits; Shift+Enter adds a line; an IME composition never submits. It is controlled: the owner holds the text, receives `submit` with the trimmed prompt, and clears it. While `state` is `submitted` or `streaming` the reader can keep typing the next prompt, but cannot submit it until the response ends or they press Stop.

- Import: `import PromptInput from '@aziontech/webkit/prompt-input'`
- Category: ai · Surface: product · Structure: monolithic
- API as JSON: [prompt-input.json](https://github.com/aziontech/webkit/blob/main/.specs/prompt-input.json)

## When to use

- The input of any conversation with the generative AI assistant.
- A single "Ask about this page" box that opens a conversation.

## Do

- Placeholder is a suggested question with no end punctuation (`Ask a question`); never the only instruction.
- Put the disclaimer and the shortcuts in `hint`, not in the placeholder.
- Set `state` from the request so Submit turns into Stop; wire `stop` to abort it.
- Clear `v-model` in the `submit` handler and keep focus in the input.
- Use `maxLength` only when the backend has a limit; the counter is the warning.

## Don’t

- A text field in a form → `textarea` inside `field`.
- Search over a list → `input` with a search icon or `property-filter`.
- A command palette → `command`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [textarea](textarea.md) — the form control; this one has no visible label and submits on Enter.
- [conversation](conversation.md) — the log above it; only the log scrolls.
- [suggestion-group](suggestion-group.md) — prompts the reader can send without typing.
- [file-dropzone](file-dropzone.md), `chip` — what attachment flows compose into the `attachments` slot.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `''` | false | Hint shown while empty, a suggested question with no end punctuation. Empty uses the locale catalog (`Ask a question`). |
| `ariaLabel` | `string` | `''` | false | Accessible name of the text area; the input has no visible label. Empty uses the locale catalog (`Prompt`). |
| `maxLength` | `number` | `0` | false | Character limit; shows an `n/max` counter and blocks submit over it. `0` means no limit. |
| `minRows` | `number` | `1` | false | Rows shown while empty. |
| `maxRows` | `number` | `6` | false | Rows the text area grows to before it scrolls. |
| `state` | `'ready' \| 'submitted' \| 'streaming'` | `'ready'` | false | Request lifecycle: `submitted` and `streaming` swap Submit for Stop and block another submit; typing stays allowed. |
| `disabled` | `boolean` | `false` | false | Disables the text area, the submit control and every control in the slots' row. |
| `menus` | `PromptInputMenu[]` | `[]` | false | Shortcut menus opened by a trigger character at the start of a word: `/` for commands, `@` for things to reference. Choosing an option inserts `<trigger><label>` and adds it to `references`. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `submit` | `(value: string, references: PromptInputReference[])` |  |
| `stop` | `—` |  |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `attachments` | — | Attached files or context chips, above the text. |
| `actions` | — | Secondary controls at the inline start of the toolbar; inside a `fieldset` disabled with the input. |
| `hint` | — | Constraint text under the input; referenced by `aria-describedby`. |

## Sub-components

_None — monolithic with slots. Exports: `"./prompt-input": "./src/components/ai/prompt-input/prompt-input.vue"`.
Exported type: `PromptInputState = 'ready' | 'submitted' | 'streaming'`. Composed DS components:
`icon-button` (Submit, Stop). Exposes `focus()`._

## v-model

| Model                | Type                     | Default | Emits               | Notes                                                                                                                                                 |
| -------------------- | ------------------------ | ------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`            | `string`                 | `''`    | `update:modelValue` | The prompt being written, via `defineModel`. The owner clears it in its `submit` handler.                                                             |
| `v-model:references` | `PromptInputReference[]` | `[]`    | `update:references` | What the prompt references, added by the menus and shown as removable chips above the text; removing a chip also removes its `<trigger><label>` text. |

## States

- `data-status` mirrors `state`; `data-disabled`; `data-invalid` while over `maxLength`.
- `ready`: Submit (primary `IconButton`, `pi pi-arrow-up`), disabled while the prompt is empty, over the limit or `disabled`.
- `submitted` / `streaming`: Stop (secondary `IconButton`, `pi pi-stop`) replaces Submit; Enter does nothing.
- Over the limit: border turns `--danger-border`, the counter turns danger, `aria-invalid="true"`, and a polite live region says how many characters are over.

## Accessibility

- Visible focus: the container shows `focus-within:ring-2 focus-within:ring-(--ring-color)`.
- Keyboard map: `Enter` submits; `Shift+Enter` new line; `Tab` moves to the slot controls, then Submit / Stop. IME composition (`isComposing`) never submits.
- Shortcut menus (`menus`): typing a trigger at the start of a word opens a listbox above the input with up to eight options matching what follows it. Focus stays in the text area, which points at the list with `aria-controls` and at the highlighted option with `aria-activedescendant` (a `textarea` cannot take `role="combobox"`); `ArrowDown`/`ArrowUp` move, `Enter` or `Tab` choose, `Escape` closes, and Enter does not submit while the list is open. A polite status reads `3 suggestions` or `No matches`. The text area lists the triggers in `aria-keyshortcuts`. References are a list named `References` of removable `Chip`s.
- ARIA: the `<textarea>` is named by `aria-label` (no visible label, as Cloudscape allows for an input with an action button), described by the counter and the hint, `aria-invalid` over the limit; Submit and Stop are named icon buttons.
- The placeholder never carries required information (it disappears on typing).
- Touch target: `IconButton` medium (44 px on coarse pointers).

## Right-to-left

- Layout: logical utilities; actions at the inline start, Submit at the inline end.
- Icons: the arrow-up and stop glyphs are not mirrored.
- Keyboard: arrows move in the shortcut menu only while it is open; vertical, so not mirrored.
- User data: the text area follows the document direction; mixed prompts render with the browser's bidi.

## Internationalization

| Key                          | English source                      | Override prop |
| ---------------------------- | ----------------------------------- | ------------- |
| `promptInput.label`          | `Prompt`                            | `ariaLabel`   |
| `promptInput.placeholder`    | `Ask a question`                    | `placeholder` |
| `promptInput.submit`         | `Submit`                            | —             |
| `promptInput.stop`           | `Stop generating`                   | —             |
| `promptInput.count`          | `{count}/{max}`                     | —             |
| `promptInput.overLimit`      | `{count} characters over the limit` | —             |
| `promptInputMenu.results`    | `{count} suggestion(s)` (plural)    | —             |
| `promptInputMenu.noMatches`  | `No matches`                        | —             |
| `promptInputMenu.references` | `References`                        | —             |

- Formatting: counts go through `Intl.NumberFormat` (the `t()` number formatting).

## Responsive

- Container queries: none; full width of its host.
- Narrow: the toolbar wraps its slot controls; Submit stays at the inline end.
- Touch: `enterkeyhint="send"` on mobile keyboards; targets 44 px on coarse pointers.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import PromptInput from '@aziontech/webkit/prompt-input'
  import { ref } from 'vue'

  const prompt = ref('')
  const last = ref('')

  function send(text) {
    last.value = text
    prompt.value = ''
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <PromptInput
      v-model="prompt"
      @submit="send"
    >
      <template #hint>The AI assistant can make mistakes. Check important information.</template>
    </PromptInput>
    <p
      v-if="last"
      class="text-body-sm text-(--text-muted)"
    >
      Submitted: {{ last }}
    </p>
  </div>
</template>
```

### Streaming

```vue
<script setup>
  import PromptInput from '@aziontech/webkit/prompt-input'
  import { onBeforeUnmount, ref } from 'vue'

  const prompt = ref('Why did my cache hit ratio drop?')
  const state = ref('ready')
  let timer

  function send() {
    prompt.value = ''
    state.value = 'submitted'
    timer = setTimeout(() => {
      state.value = 'streaming'
      timer = setTimeout(() => (state.value = 'ready'), 4000)
    }, 800)
  }

  function stop() {
    clearTimeout(timer)
    state.value = 'ready'
  }

  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <PromptInput
      v-model="prompt"
      :state="state"
      @submit="send"
      @stop="stop"
    />
  </div>
</template>
```

### CharacterLimit

```vue
<script setup>
  import PromptInput from '@aziontech/webkit/prompt-input'
  import { ref } from 'vue'

  const prompt = ref(
    'Write a function that redirects every request from the old blog path to the new one, keeps the query string, answers with a permanent redirect and logs the original path so I can check later which links people still use. It should also skip the redirect for requests that already come from the new path, and it should run before the cache.'
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
