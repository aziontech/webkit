# Doc Agent Card

> The "Your AI agent, fluent in Azion" card that opens the first section of a documentation home. Two columns in one framed card: on the left the title, one or two sentences on what the prompt gives the agent, and the inline `CopyPromptButton` with the agent marks; on the right, behind a vertical divider, the question "Prefer the guided route?" over an orange `Agent setup` button, set on an orange halftone panel that fades in from the bottom corner. Below the card's `@3xl` container size the columns stack and the divider turns horizontal. All four strings default to the catalog, so `<DocAgentCard :prompt="…" />` is the whole reference card.

- Import: `import DocAgentCard from '@aziontech/webkit/doc-agent-card'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-agent-card.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-agent-card.json)

## When to use

- The first block under "Start by interface" (or the hero) of a documentation home, to hand the reader's coding agent the platform in one prompt and offer the guided setup next to it.

## Do

- Pass the exact prompt in `prompt`; leave the strings to the catalog unless the product differs.
- Point `action-href` at the agent setup guide.
- Follow it with a three-column `DocCardGroup` (Console, CLI, API) in the same section.
- Do not add an overline or an eyebrow above the title; the card has none.

## Don’t

- To show the prompt text itself → use `DocPrompt`.
- As a generic two-column banner → use `DocCard`, `DocCta` or a marketing `Banner`.
- On an article page → put `CopyPromptButton` in `DocPageHeader`'s meta actions instead.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- CopyPromptButton` — the left column's action.
- DocHero` — the masthead above it on a docs home.
- DocCardGroup` — the Console / CLI / API cards that follow it; both share `FrameBox`'s corner marks.
- TextureMaterial` — the `dither` halftone behind the guided action.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `prompt` | `string` | `—` | true | The prompt `CopyPromptButton` copies. |
| `title` | `string` | `''` | false | Card heading (an `h3`); empty uses the catalog's `Your AI agent, fluent in Azion`. |
| `description` | `string` | `''` | false | One or two sentences on what the prompt gives the agent; empty uses the catalog's. |
| `agents` | `CopyPromptAgent[]` | `undefined` | false | The agents whose marks the copy button shows; unset keeps the button's default list. |
| `asideTitle` | `string` | `''` | false | Question over the guided action; empty uses the catalog's `Prefer the guided route?`. |
| `actionLabel` | `string` | `''` | false | Label of the guided action; empty uses the catalog's `Agent setup`. |
| `actionHref` | `string` | `''` | false | Destination of the guided action; empty renders it as a button that only emits `action`. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `copy` | `string` | Re-emitted from `CopyPromptButton` after a successful copy. |
| `action` | `MouseEvent` | The guided action was activated. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `actions` |  | Replaces the copy button in the left column. |

## States

- Wide (container ≥ `@3xl`): two columns, 7 : 3, vertical divider. Narrow: one column, horizontal divider.
- The copy button carries its own `idle` / `copied` / `disabled` states.
- Not applicable: `loading`, `empty`, `error`, `open`/`closed`.

## Accessibility

- A `<section>` named by its title (`aria-label`), with the title as an `h3` (it sits under the section's `h2`).
- The halftone is `aria-hidden` and never sits under text that needs contrast: the question and the button keep ≥ 4.5:1 on the surface.
- The actions keep their own roles, names and focus rings; reading order is left column, then right.

## Right-to-left

- Layout: logical utilities only (`border-s`, `end-0`); the divider and the halftone move to the mirrored side, and the dither ramp runs toward the bottom-left.

## Internationalization

| Key                       | English source                   | Override prop |
| ------------------------- | -------------------------------- | ------------- |
| `docAgentCard.title`      | `Your AI agent, fluent in Azion` | `title`       |
| `docAgentCard.description`| `One prompt teaches any coding agent the platform: …` | `description` |
| `docAgentCard.asideTitle` | `Prefer the guided route?`       | `asideTitle`  |
| `docAgentCard.action`     | `Agent setup`                    | `actionLabel` |

## Responsive

- Container query on the card itself (`@container`): two columns from `@3xl`, stacked below it.
- Reflow: no horizontal scroll at 320 px; the copy button truncates its label before overflowing.

## Examples

### Default

```vue
<script setup>
  import DocAgentCard from '@aziontech/webkit/doc-agent-card'

  const prompt =
    'Set up the Azion CLI, connect the Azion docs over MCP and link this project to my Azion account.'
</script>

<template>
  <DocAgentCard
    :prompt="prompt"
    action-href="#"
  />
</template>
```

### Narrow

```vue
<script setup>
  import DocAgentCard from '@aziontech/webkit/doc-agent-card'

  const prompt = 'Set up the Azion CLI and link this project to my Azion account.'
</script>

<template>
  <div class="w-full max-w-(--container-sm)">
    <DocAgentCard
      :prompt="prompt"
      action-href="#"
    />
  </div>
</template>
```
