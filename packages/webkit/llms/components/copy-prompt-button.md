# Copy Prompt Button

> The "Copy prompt" button of a docs or product home: one dark chip that copies a ready-made prompt for a coding agent and, after its label, shows the marks of the agents it works with (Claude, ChatGPT, Gemini and Cursor by default). The chip carries the design system's AI treatment, the same three layers as `HighlightButton`: a blurred gradient glow rotating behind it, the brand-accent gradient over the glow, and a dark scrim over both that holds the white label at contrast; on hover the gradient and the scrim fade to a quarter and the glow blooms through. It is dark in both themes (it renders under `data-theme="dark"`), so it reads as the AI entry point next to a primary button, and a tooltip says what it does. The marks are single-colour and decorative, drawn in the chip's own ink; their names reach screen readers as the button's description ("Works with Claude, ChatGPT, Gemini, Cursor"). With `closable` a dismiss button sits beside the chip, and dismissing removes both from the layout.

- Import: `import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'`
- Category: action · Surface: app · Structure: monolithic
- API as JSON: [copy-prompt-button.json](copy-prompt-button.json)

## When to use

- Use CopyPromptButton to copy a ready-made agent prompt without showing its text; a visible value gets a CopyButton.
- The hero of a documentation home or a product landing, beside the primary action (`Get started`), when the page hands its reader a prompt for their agent.
- Inside `DocAgentCard`, the "Your AI agent, fluent in Azion" card of a docs home (it renders this button by default).

## Do

- Put it second, after the primary `Button` (`Get started`), and explain what the prompt does in one line below the row (`DocHero`'s `note` slot).
- Keep the default agents unless the product supports a different set; pass `:agents="[]"` to draw the label alone.
- Pass the exact prompt in `value`; the button copies it as it stands.
- Do not recolour the marks: they are single-colour by design and follow the chip's ink.
- To draw a mark from the agent's asset file instead of the icon font, give the agent a `logo` (`@aziontech/webkit/assets/claude-symbol-color.svg`); `ThirdPartyLogo` flattens it to the chip's ink.
- Set `closable` where the chip is guidance the reader can put away (a first-use overview), not where it is part of a page's composition (a hero). Bind `v-model:open` to remember or restore the choice (`close` still fires with the click).

## Don’t

- To show the prompt text itself on the page → use `DocPrompt` (it renders the text with its own copy control).
- To copy a value, a token or a code snippet → use `CopyButton`.
- As a generic dark button → use `Button variant="secondary"`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `DocPrompt` — the prompt rendered in full, with a copy control.
- `DocAgentCard` — the docs-home card that places this button in its left column.
- `DocHero` — the docs-home masthead whose `actions` slot holds `Get started` and this button.
- `CopyButton` — the icon-only copy control; this button shares its clipboard fallback.
- `HighlightButton` — the AI-flow button whose glow, gradient and scrim this chip shares.
- `ThirdPartyLogo` — draws an agent mark from its asset file in the chip's ink.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `—` | true | The prompt copied to the clipboard on activation. |
| `label` | `string` | `''` | false | Visible text and accessible name while idle; empty uses the catalog's `Copy prompt`. |
| `copiedLabel` | `string` | `''` | false | Visible text announced after a copy; empty uses the catalog's `Copied`. |
| `agents` | `CopyPromptButtonAgent[]` | `Claude, ChatGPT, Gemini, Cursor` | false | The agents whose marks follow the label, in order; each is `{ name, icon?, logo? }`, drawn from `logo` through `ThirdPartyLogo` when set and from the `icon` glyph otherwise; an empty list draws no marks. |
| `disabled` | `boolean` | `false` | false | Disables the button; `copy` is not emitted. |
| `closable` | `boolean` | `false` | false | Shows a dismiss button beside the chip; activating it removes both from the layout and emits `close`. |
| `open` | `boolean` | `true` | false | Two-way value (`v-model:open`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `copy` | `(event: MouseEvent, value: string)` | Fires with the click and `value` after the clipboard write succeeds (the async clipboard, or the copy-command fallback of `@aziontech/webkit/utils/clipboard` on an insecure origin). When both are refused, the copy fallback popover opens instead. |
| `close` | `MouseEvent` | Fires with the click on the dismiss button (`closable`), after the chip removes itself; whether it stays away is the page's decision. |

## v-model

| Model          | Type      | Default | Emits         | Notes                                                                                                                                                                             |
| -------------- | --------- | ------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `true`  | `update:open` | Whether the chip is shown, via `defineModel('open')`. The dismiss button sets it to `false`; set it back to `true` to show the chip again. Unbound, the chip keeps its own state. |

## States

- Visual states: `idle`, `hover` (the gradient and the scrim fade to 25% and the rotating glow blooms through), `focus-visible` (ring), `copied` (the label swaps to a check and `Copied` for two seconds, without changing the width), `disabled` (the AI layers hide and the chip takes the disabled fill), `dismissed` (`open` is false: the chip and its dismiss button unmount).
- `data-state` is `idle` or `copied`; `data-disabled` mirrors `disabled`.
- Not applicable: `loading`, `empty`, `error`, `readonly`, `invalid`, `open`/`closed` (the tooltip owns its own open state).

## Accessibility

- Pattern: a WAI-ARIA APG **button** (`<button type="button">`); its accessible name is the label (`Copy prompt`, then `Copied` while the copied state shows). A `Tooltip` on hover and focus says what it does (`Copies a setup prompt for your AI coding tool`).
- With `closable`, the dismiss control is a separate `IconButton` beside the chip (never inside it), named `Dismiss`; dismissing unmounts both, so neither stays in the tab order.
- The agent marks are `aria-hidden`; their names form the description through `aria-describedby` ("Works with Claude, ChatGPT, Gemini, Cursor").
- A polite `role="status"` region next to the button announces `Copied` after a successful copy.
- Keyboard map: `Tab` focuses the chip, then the dismiss button when `closable`; `Enter` and `Space` copy on the chip and dismiss on the dismiss button; `Esc` closes an open tooltip (owned by `Tooltip`).
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Contrast: the white label and marks sit on the 80% black scrim at rest (≥ 4.5:1 in both page themes); on hover the scrim thins over the accent gradient and the label stays above 3:1 for its large button type.
- Touch target: 40 px tall; `pointer-coarse:min-h-11` raises it to 44 px.
- `motion-reduce:animate-none` on the rotating glow and `motion-reduce:transition-none` on every transition.

## Right-to-left

- Layout: logical utilities only (`ps-`/`pe-`, `gap-`); the label leads at the inline start, the marks follow it and the dismiss button follows the chip. The glow, gradient and scrim layers are symmetric.
- Icons: brand marks and the dismiss `×` are not mirrored.
- Keyboard: no arrow keys.

## Internationalization

| Key                          | English source                                  | Override prop         |
| ---------------------------- | ----------------------------------------------- | --------------------- |
| `copyPromptButton.label`     | `Copy prompt`                                   | `label`               |
| `copyPromptButton.copied`    | `Copied`                                        | `copiedLabel`         |
| `copyPromptButton.worksWith` | `Works with {agents}`                           | `agents`              |
| `copyPromptButton.tooltip`   | `Copies a setup prompt for your AI coding tool` | — (provider messages) |
| `copyPromptButton.dismiss`   | `Dismiss`                                       | — (provider messages) |

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
      variant="primary"
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
    { name: 'Claude', icon: 'az az-claude' },
    { name: 'GitHub Copilot', icon: 'az az-microsoft-copilot' },
    { name: 'Windsurf', icon: 'az az-windsurf' }
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
