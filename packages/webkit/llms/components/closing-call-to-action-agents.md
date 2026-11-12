# Closing Call To Action Agents

> The close for a reader who may be a person or an agent: one centred ask in the loud `primary` register of the call to action, under a pixelated, waving texture, with a small segmented switch under the title that picks the way in. Each audience carries an optional copyable line and its actions; under them, a line types its words one after another behind a blinking cursor, then a closing sentence, both the same for every audience so the band keeps its height when the switch changes. The hatched closing frame follows. It is a page section — the site places it from a `{ _id: 'closing-call-to-action-agents', props }` entry and binds `props` straight onto it — and it composes `section-module`, `call-to-action`, `toggle-group`, `input-group`, `copy-button`, `button`, `frame-box` and `texture-material`. The switch and the typed word are local state.

- Import: `import ClosingCallToActionAgents from '@aziontech/webkit/closing-call-to-action-agents'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [closing-call-to-action-agents.json](https://github.com/aziontech/webkit/blob/main/.specs/closing-call-to-action-agents.json)

## When to use

- To close a developer page whose reader may be a person or the person's agent.

## Do

- Keep two audiences; the first one opens.
- Keep each copyable line short enough to fit the field; the copy button copies exactly what it shows.
- Keep `typedWords` to a few short words; screen readers and reduced motion get the whole list at once.

## Don’t

- For a close on one or two link actions → use `closing-call-to-action` (`primary` for the same loud register without the switch).
- For a newsletter sign-up → use `closing-call-to-action-newsletter`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [closing-call-to-action](closing-call-to-action.md) — the same close without the audience switch.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the call to action as its `h2`; the band renders nothing when empty. |
| `typedLead` | `string` | `''` | false | Fixed opening of the typed line, before the typed word. |
| `typedWords` | `string[]` | `[]` | false | Words typed, held, erased and typed again in order after `typedLead`; the typed line renders only when there are words. |
| `description` | `string` | `''` | false | Closing sentence under the typed line, the same for every audience. |
| `audiences` | `ClosingCallToActionAgentsAudience[]` | `[]` | false | The ways in, in switch order; each is `{ value, label, copy?, actions? }` and the first one opens. The switch renders only with two or more. |
| `audiencesAriaLabel` | `string` | `''` | false | Accessible name of the audience switch. |
| `lineAriaLabel` | `string` | `''` | false | Accessible name of the read-only field that shows an audience's copyable line. |

## States

- Visual states: `default`
- Audience switch: picking an audience swaps the copyable line and the actions; the swapped row sits in a polite live region and fades in
- Typed word: after mount the words are typed (90 ms a character), held (1.8 s), erased (45 ms a character) and the next one typed (after 270 ms), in a loop; the timer is cleared on scope dispose
- Reduced motion: the typed word shows every word at once, joined by commas, and the cursor is hidden
- Empty: when `title` is empty the band renders nothing but its root; an audience without `copy` shows no field; without `typedWords` the typed line is omitted

## Accessibility

- Visible focus: owned by `toggle-group`, `copy-button` and `button`.
- Keyboard map: `Tab` reaches the switch, the copy button and each action; the arrow keys move the switch (owned by `toggle-group`).
- ARIA: the root is a plain `div`; the call to action owns the band's named region. The switch is a `radiogroup` named by `audiencesAriaLabel`; the swapped row is `aria-live="polite"`; the read-only field is named by `lineAriaLabel` and the copy button by the audience's `copy.label`. The typed line reads its whole sentence from a visually hidden copy while the animated letters are `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the typed line uses `var(--text-muted)` and `var(--text-default)`.
- `motion-reduce:transition-none motion-reduce:transform-none` — see the Motion table; under reduced motion nothing types or blinks.
- Touch target ≥40×40 px — the switch, the copy button and the actions are large.

## Examples

### Default

```vue
<script setup>
  import ClosingCallToActionAgents from '@aziontech/webkit/closing-call-to-action-agents'

  const typedWords = ['Console', 'CLI', 'MCP server']

  const audiences = [
    {
      value: 'humans',
      label: 'For humans',
      actions: [
        {
          label: 'Start for free',
          href: '/signup',
          kind: 'secondary',
          trailing: true
        },
        {
          label: 'Talk to a specialist',
          href: '/site/contact',
          kind: 'outlined',
          trailing: true
        }
      ]
    },
    {
      value: 'agents',
      label: 'For agents',
      copy: {
        label: 'Copy prompt',
        text: 'Connect Azion MCP: https://mcp.azion.com'
      },
      actions: [
        {
          label: 'Read the agent docs',
          href: '/site/docs/agent-setup',
          kind: 'outlined',
          trailing: true
        }
      ]
    }
  ]
</script>

<template>
  <ClosingCallToActionAgents
    anchor="contact"
    title="Built by you, or your agents."
    typed-lead="Drive one platform from the"
    :typed-words="typedWords"
    description="A person and an agent ship the same way."
    audiences-aria-label="Audience"
    line-aria-label="Prompt"
    :audiences="audiences"
  />
</template>
```
