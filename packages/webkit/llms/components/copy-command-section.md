# Copy Command Section

> A one-line command or agent prompt with a copy button, set in a large `InputGroup` under hero or section copy ("npm create azion", "Ask your agent to …"). With `shell` a `$` prompt leads the line. From the design sample's site `CopyCommandSection`.

- Import: `import CopyCommandSection from '@aziontech/webkit/copy-command-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [copy-command-section.json](copy-command-section.json)

## When to use

- Use CopyCommandSection for a one-line command or agent prompt with a copy button on a marketing page.
- The one command that starts a product, beside or instead of a call to action.
- A prompt to paste into an AI agent (`shell` off).

## Do

- One line that works when pasted as is.
- Place it in a hero or section-title actions slot.

## Don’t

- For several lines or output — use `CodeBlock` or `CliTerminalSection`.
- For an editable field — use `Input`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `CopyButton`, `InputGroup` — the parts.
- `CliTerminalSection` — a full terminal session.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `—` | true | Text on the line, copied as written. |
| `shell` | `boolean` | `true` | false | Draws the shell prompt before the text; turn off for a prompt meant for an agent. |

## States

- Read-only input; the copy button shows its copied state (from `CopyButton`).

## Accessibility

- The read-only input is named "Command" or "Prompt"; the copy button is named "Copy command" or "Copy prompt".
- The `$` is decorative (`aria-hidden`).
- Keyboard: `Tab` reaches the field (text can be selected) and the copy button.

## Right-to-left

- Layout: logical utilities.
- The command is `dir="ltr"` so a shell line keeps its order inside right-to-left pages.
- Keyboard: unchanged.

## Internationalization

| Key                                     | English source | Override prop |
| --------------------------------------- | -------------- | ------------- |
| `copyCommandSection.command`            | `Command`      | —             |
| `copyCommandSection.prompt`             | `Prompt`       | —             |
| `copyCommandSection.copyCommandSection` | `Copy command` | —             |
| `copyCommandSection.copyPrompt`         | `Copy prompt`  | —             |

- The command itself is content.

## Responsive

- Fills its column up to `--container-xs`; fixed at that width from large.

## Examples

### Default

```vue
<script setup>
  import CopyCommandSection from '@aziontech/webkit/copy-command-section'
</script>

<template>
  <CopyCommandSection value="npm create azion@latest" />
</template>
```

### Prompt

```vue
<script setup>
  import CopyCommandSection from '@aziontech/webkit/copy-command-section'
</script>

<template>
  <CopyCommandSection
    :shell="false"
    value="Deploy this repository to Azion and give me the URL"
  />
</template>
```
