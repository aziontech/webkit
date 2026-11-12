# Section Command

> A one-line command or agent prompt with a copy button, set in a large `InputGroup` under hero or section copy ("npm create azion", "Ask your agent to …"). With `shell` a `$` prompt leads the line. From the design sample's site `SectionCommand`.

- Import: `import SectionCommand from '@aziontech/webkit/section-command'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [section-command.json](https://github.com/aziontech/webkit/blob/main/.specs/section-command.json)

## When to use

- The one command that starts a product, beside or instead of a call to action.
- A prompt to paste into an AI agent (`shell` off).

## Do

- One line that works when pasted as is.
- Place it in a hero or section-title actions slot.

## Don’t

- For several lines or output — use `CodeBlock` or `CliTerminal`.
- For an editable field — use `InputText`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- CopyButton`, `InputGroup` — the parts.
- CliTerminal` — a full terminal session.

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

| Key                          | English source | Override prop |
| ---------------------------- | -------------- | ------------- |
| `sectionCommand.command`     | `Command`      | —             |
| `sectionCommand.prompt`      | `Prompt`       | —             |
| `sectionCommand.copyCommand` | `Copy command` | —             |
| `sectionCommand.copyPrompt`  | `Copy prompt`  | —             |

- The command itself is content.

## Responsive

- Fills its column up to `--container-xs`; fixed at that width from large.

## Examples

### Default

```vue
<script setup>
  import SectionCommand from '@aziontech/webkit/section-command'
</script>

<template>
  <SectionCommand value="npm create azion@latest" />
</template>
```

### Prompt

```vue
<script setup>
  import SectionCommand from '@aziontech/webkit/section-command'
</script>

<template>
  <SectionCommand
    :shell="false"
    value="Deploy this repository to Azion and give me the URL"
  />
</template>
```
