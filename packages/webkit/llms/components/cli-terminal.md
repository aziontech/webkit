# Cli Terminal

> The Azion CLI band of a product page: a horizontal section title with one outlined button, over a terminal session on the pixelate texture that runs off the frame's bottom rule, its lines entering one after another. It is a page section — the site places it from a `{ _id: 'cli-terminal', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `button`, `frame-box`, `texture-material` and `code-block`.

- Import: `import CliTerminal from '@aziontech/webkit/cli-terminal'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [cli-terminal.json](https://github.com/aziontech/webkit/blob/main/.specs/cli-terminal.json)

## When to use

- To close a product argument on how little it takes to ship from the terminal, like Functions and Workloads.

## Do

- Keep the session to a few commands and their output; comment the output lines so the copied text still runs.
- Name the copy button with `copyAriaLabel` so a screen reader says what it copies.

## Don’t

- For a config file or handler beside the claim → use `code-split`.
- For several capabilities, each with its own file → use `sticky-scroll-code`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [code-block](code-block.md) — the terminal session the band shows.
- [code-split](code-split.md) — the sibling band with the sample beside the copy.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Supporting sentence beside the headline. |
| `session` | `string` | `''` | false | The terminal session shown under the header, commands and their output verbatim, highlighted as bash; the band renders nothing when empty. |
| `copyAriaLabel` | `string` | `''` | false | Accessible name of the session's copy button; empty keeps the code block's own. |
| `primaryAction` | `CliTerminalAction` | `undefined` | false | Outlined button in the section title; `{ label, href, trailing?, target? }`. Omitted when absent. |

## States

- Visual states: `default`; the copy button and the button own their hover and focus states
- Empty: when `session` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set

## Accessibility

- Visible focus: owned by `code-block` (copy button) and `button`.
- Keyboard map: `Tab` reaches the button and the copy button; `Enter` follows the button.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the headline is the section title's `h2`; the copy button is named by `copyAriaLabel`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`, `code-block` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the session's line entrance is owned by `code-block` and draws at once under reduced motion.
- Touch target ≥40×40 px: the large button.

## Examples

### Default

```vue
<script setup>
  import CliTerminal from '@aziontech/webkit/cli-terminal'

  const session =
    'azion link --preset javascript --name auth-handler --auto\n# Project successfully configured\n\nazion deploy --auto\n# Upload completed successfully!\n# Your Application was deployed successfully\n# Domain: https://k7q2fmx4ze.map.azionedge.net\n\ncurl https://k7q2fmx4ze.map.azionedge.net/\n# Hello World'

  const primaryAction = {
    label: 'Install the CLI',
    href: 'https://www.azion.com/en/documentation/products/azion-cli/overview/',
    trailing: true
  }
</script>

<template>
  <CliTerminal
    eyebrow="Azion CLI"
    title="Deploy your first function in two commands"
    description="Link a project, deploy it, and curl the domain the CLI hands back. Builds run on your machine with --local, or on Azion."
    :session="session"
    copy-aria-label="Copy the deploy session"
    :primary-action="primaryAction"
  />
</template>
```
