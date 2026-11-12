# Doc Hero

> The masthead of a documentation home: a display-size `h1`, a deck capped at a readable measure, an action row (the primary `Get started`, then `CopyPromptButton`) and one muted note under it that says what the prompt does. It carries the air the home needs — `--spacing-xxl` above and below, `--spacing-xl` between the deck and the actions — so the front door reads as a front door and not as one more article. An article page uses `DocPageHeader` instead.

- Import: `import DocHero from '@aziontech/webkit/doc-hero'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-hero.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-hero.json)

## When to use

- The top of a documentation home or a docs section landing (`shells/documentation`, variant `Landing`).

## Do

- Keep the title short (`Welcome to Azion Docs`) and the deck to one or two sentences.
- Put `Button kind="primary" size="large"` first and `CopyPromptButton` second in `#actions`; say what the prompt does in `#note`.
- Do not wrap it in `DocProse`; it is page chrome (`data-doc-chrome`).

## Don’t

- On an article or reference page → use `DocPageHeader` (breadcrumb, last updated, page actions).
- On the marketing site → use `Hero` or a page section.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- DocPageHeader` — the article masthead.
- CopyPromptButton` — the second action of the row.
- DocAgentCard` — the agent card that usually opens the first section under the hero.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | The page title, set at display size as the page's `h1`. |
| `description` | `string` | `''` | false | The deck under the title: what the docs cover, in one or two sentences. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `title` |  | Replaces the title text, for a title that is more than a string. |
| `default` |  | Replaces the description text. |
| `actions` |  | The action row: the primary `Button` first, then `CopyPromptButton`. |
| `note` |  | One muted line under the actions that says what the prompt does. |

## States

- Static; renders only the parts it receives (no deck, no action row, no note when empty).
- Not applicable: `hover`, `focus`, `disabled`, `loading`, `empty`, `error`, `open`/`closed`.

## Accessibility

- A `<header>` holding the page's single `h1`; the deck and note are paragraphs.
- No interactive parts of its own; the actions bring their own roles and focus.
- Contrast: muted deck and note ≥ 4.5:1 on the canvas in both themes.

## Right-to-left

- Layout: block flow and `gap-` only; the action row starts at the inline start.

## Internationalization

| Key    | English source | Override prop |
| ------ | -------------- | ------------- |
| _none_ | —              | —             |

- All text is content passed in.

## Responsive

- The title steps 30 → 36 → 48 px with `.text-heading-2xl`; the top space is `--spacing-xl` on a phone and `--spacing-xxl` from `sm`.
- The action row wraps; at 390 px `CopyPromptButton` drops under `Get started`.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'
  import DocHero from '@aziontech/webkit/doc-hero'

  const prompt =
    'Set up the Azion CLI, connect the Azion docs over MCP and link this project to my Azion account.'
</script>

<template>
  <DocHero
    title="Welcome to Azion Docs"
    description="We make every application fast and reliable. Deploy on a global network with enterprise-grade security and no cold starts."
  >
    <template #actions>
      <Button
        label="Get started"
        kind="primary"
        size="large"
        href="#"
      />
      <CopyPromptButton :value="prompt" />
    </template>
    <template #note>
      The prompt hands your coding agent the CLI, live docs over MCP, and this project linked.
    </template>
  </DocHero>
</template>
```

### Title only

```vue
<script setup>
  import DocHero from '@aziontech/webkit/doc-hero'
</script>

<template>
  <DocHero
    title="Guides"
    description="Step-by-step walkthroughs, from a first deploy to a hardened production setup."
  />
</template>
```
