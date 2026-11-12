# Copy Prompt Button

> The "Copy prompt" button of a docs or product home: one dark chip that copies a ready-made prompt for a coding agent and, after its label, shows the marks of the agents it works with (Claude, ChatGPT, Gemini and Cursor by default). The chip is dark in both themes (it renders under `data-theme="dark"`) with a faint accent glow on its top and bottom edges, so it reads as the AI entry point next to a primary button. The marks are single-colour and decorative; their names reach screen readers as the button's description ("Works with Claude, ChatGPT, Gemini, Cursor").

- Import: `import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'`
- Category: actions · Surface: product · Structure: monolithic
- API as JSON: [copy-prompt-button.json](https://github.com/aziontech/webkit/blob/main/.specs/copy-prompt-button.json)

## When to use

- The hero of a documentation home or a product landing, beside the primary action (`Get started`), when the page hands its reader a prompt for their agent.
- Inside `DocAgentCard`, the "Your AI agent, fluent in Azion" card of a docs home (it renders this button by default).

## Do

- Put it second, after the primary `Button` (`Get started`), and explain what the prompt does in one line below the row (`DocHero`'s `note` slot).
- Keep the default agents unless the product supports a different set; pass `:agents="[]"` to draw the label alone.
- Pass the exact prompt in `value`; the button copies it as it stands.
- Do not recolour the marks: they are single-colour by design and follow the chip's ink.

## Don’t

- To show the prompt text itself on the page → use `DocPrompt` (it renders the text with its own copy control).
- To copy a value, a token or a code snippet → use `CopyButton`.
- As a generic dark button → use `Button kind="secondary"`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- DocPrompt` — the prompt rendered in full, with a copy control.
- DocAgentCard` — the docs-home card that places this button in its left column.
- DocHero` — the docs-home masthead whose `actions` slot holds `Get started` and this button.
- CopyButton` — the icon-only copy control; this button shares its clipboard fallback.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `—` | true | The prompt copied to the clipboard on activation. |
| `label` | `string` | `''` | false | Visible text and accessible name while idle; empty uses the catalog's `Copy prompt`. |
| `copiedLabel` | `string` | `''` | false | Visible text announced after a copy; empty uses the catalog's `Copied`. |
| `agents` | `CopyPromptAgent[]` | `Claude, ChatGPT, Gemini, Cursor` | false | The agents whose marks follow the label, in order; an empty list draws no marks. |
| `disabled` | `boolean` | `false` | false | Disables the button; `copy` is not emitted. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `copy` | `string` | Fires with `value` after the clipboard write succeeds. When the write is refused, the copy fallback popover opens instead. |

## States

- Visual states: `idle`, `hover` (a hover layer lightens the chip), `focus-visible` (outline ring), `copied` (the label swaps to a check and `Copied` for two seconds, without changing the width), `disabled`.
- `data-state` is `idle` or `copied`; `data-disabled` mirrors `disabled`.
- Not applicable: `loading`, `empty`, `error`, `readonly`, `invalid`, `open`/`closed`.

## Accessibility

- Pattern: a WAI-ARIA APG **button** (`<button type="button">`); its accessible name is the label (`Copy prompt`, then `Copied` while the copied state shows).
- The agent marks are `aria-hidden`; their names form the description through `aria-describedby` ("Works with Claude, ChatGPT, Gemini, Cursor").
- A polite `role="status"` region next to the button announces `Copied` after a successful copy.
- Keyboard map: `Tab` focuses; `Enter` and `Space` copy.
- Visible focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)`.
- Contrast: label and marks ≥ 4.5:1 on the dark chip in both page themes.
- Touch target: 40 px tall; `pointer-coarse:min-h-11` raises it to 44 px.
- `motion-reduce:transition-none` on every transition.

## Right-to-left

- Layout: logical utilities only (`ps-`/`pe-`, `gap-`, `inset-x-`); the label leads at the inline start and the marks follow it.
- Icons: brand marks are not mirrored.
- Keyboard: no arrow keys.

## Internationalization

| Key                          | English source       | Override prop |
| ---------------------------- | -------------------- | ------------- |
| `copyPromptButton.label`     | `Copy prompt`        | `label`       |
| `copyPromptButton.copied`    | `Copied`             | `copiedLabel` |
| `copyPromptButton.worksWith` | `Works with {agents}` | `agents`      |

- Agent names are brand names and are not translated.

## Responsive

- The chip keeps its intrinsic width; the label truncates with an ellipsis before the marks shrink when the row is narrower than the chip.
- Touch: 40 px tall, 44 px on `pointer: coarse`.
- Reflow: no horizontal scroll at 320 px; the chip wraps to its own line inside a wrapping action row.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'

  const prompt =
    'Set up the Azion CLI, connect the Azion docs over MCP and link this project to my Azion account.'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-sm)">
    <Button
      label="Get started"
      kind="primary"
      size="large"
      href="#"
    />
    <CopyPromptButton :value="prompt" />
  </div>
</template>
```

### Agents

```vue
<script setup>
  import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'

  const prompt = 'Deploy this repository to Azion with the Azion CLI.'
  const agents = [
    { name: 'Claude', icon: 'ai ai-claude' },
    { name: 'GitHub Copilot', icon: 'ai ai-microsoft-copilot' },
    { name: 'Windsurf', icon: 'ai ai-windsurf' }
  ]
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-sm)">
    <CopyPromptButton
      :value="prompt"
      :agents="agents"
    />
    <CopyPromptButton
      :value="prompt"
      :agents="[]"
    />
  </div>
</template>
```

### Disabled

```vue
<script setup>
  import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'
</script>

<template>
  <CopyPromptButton
    value="Set up the Azion CLI."
    disabled
  />
</template>
```
