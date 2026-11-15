# Contact Hub

> The band under the Contact title band: the team lanes side by side (Sales and Support), each with its scope in one sentence and the action that reaches that team, over a row of self-serve channels. It is a page section — the site places it from a `{ _id: 'contact-hub', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `card-grid`, `topic`, `button` and `status-indicator`. Lanes and channels share one frame, the channels in the rows under the lanes. A lane can carry a second button and a link to the system status page, so a reader can check for an incident before opening a ticket.

- Import: `import ContactHub from '@aziontech/webkit/contact-hub'`
- Category: sections · Surface: site · Structure: monolithic
- API as JSON: [contact-hub.json](https://github.com/aziontech/webkit/blob/main/.specs/contact-hub.json)

## When to use

- On the Contact page, to route a reader to the team or channel that answers them.

## Do

- Give it as many lanes and channels as the page has: both rows balance themselves (`card-grid` `layout: 'balanced'`), so two channels split the row in halves, three in thirds, four into 2 × 2 and five into 3 + 2, with no empty cell.
- Don't pad `channels` to three or drop one to make the row fit.
- Keep each lane's description to one sentence that states what that team handles.
- Set `target: '_blank'` on a channel or status link that leaves the site.
- Lead each lane with its `action`; add a `secondaryAction` only for a second route to the same team (an outlined button after the first).
- Give the band an `anchor` when a page links to it with a `#hash`.

## Don’t

- For a closing ask at the end of a page → use `closing-call-to-action`.
- For a grid of product use cases → use `use-cases`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [topic](topic.md) — each self-serve channel is a linked topic.
- [use-cases](use-cases.md) — the sibling band of icon-led topics.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `lanes` | `ContactHubLane[]` | `[]` | false | The team lanes side by side, in order; each is `{ icon, title, description, action?, secondaryAction?, statusLink? }` where `action` is the lane's leading button, `secondaryAction` an outlined button after it, and `statusLink` the system status link beside them. |
| `channels` | `ContactHubChannel[]` | `[]` | false | The self-serve channels in the rows under the lanes, in order; each is `{ icon, title, description, href, target? }`, rendered as a linked topic. |

## States

- Visual states: `default`
- Empty: with neither `lanes` nor `channels` the band renders nothing but its root
- Empty frame: with neither lanes nor channels the frame is left out; lanes alone or channels alone still draw one frame
- A lane's action, secondary action and status link render only when given, in that order
- Status link: the pill carries a `status-indicator` (success dot and the link's label)
- One frame: lanes fill rows of up to two and the channels the rows under them, up to three per row, each group balanced so every row is full
- Anchor: the root carries `id` = `anchor` when set, with a scroll margin so a `#hash` jump clears a sticky header

## Accessibility

- Visible focus: the status link carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; buttons and topics own theirs.
- Keyboard map: `Tab` reaches each lane action, its secondary action, the status link and each channel; `Enter` follows it.
- ARIA: the band is an unnamed `<section>`; each lane heading and each channel is an `h2`, so the outline reads one entry per route. Glyphs are `aria-hidden`; the status pill's dot belongs to `status-indicator`, which hides it and keeps the label as the link's name. A link with `target: '_blank'` carries `rel="noopener noreferrer"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): lane heading `var(--text-muted)`, description `var(--text-default)`.
- `motion-reduce:transition-none` on the status link's colour transition.
- Touch target ≥40×40 px — the status link is at least `h-10` (`min-h-10`), buttons are large, channels are whole-cell links.
- Reflow: the status link has `min-h-10` and `max-w-full`, and the lane floor wraps its buttons and the status link onto new lines, so nothing overflows a narrow column or a 200% zoom.

## Examples

### Default

```vue
<script setup>
  import ContactHub from '@aziontech/webkit/contact-hub'
</script>

<template>
  <ContactHub
    :lanes="[
      {
        icon: 'ai ai-briefcase',
        title: 'Sales',
        description:
          'Discuss your requirements, get custom pricing, or see the platform running on your own workload.',
        action: { label: 'Talk to sales', href: '/contact/sales' }
      },
      {
        icon: 'ai ai-headphones',
        title: 'Support',
        description:
          'Log in with your Azion account to open a ticket. Our engineers pick it up 24/7 on paid support plans.',
        action: {
          label: 'Log in to open a ticket',
          href: 'https://console.azion.com/login',
          trailing: true
        },
        statusLink: { label: 'System status', href: 'https://status.azion.com/', target: '_blank' }
      }
    ]"
    :channels="[
      {
        icon: 'ai ai-shield',
        title: 'Under a cyberattack?',
        description:
          'Get emergency mitigation for an attack in progress, even before you become a customer.',
        href: 'https://www.azion.com/en/lp/under-attack-mitigation/',
        target: '_blank'
      },
      {
        icon: 'ai ai-discord',
        title: 'Join the community',
        description: 'Ask developers and the Azion team on Discord. Open to everyone, on any plan.',
        href: 'https://discord.com/invite/pM8ANzztuB',
        target: '_blank'
      },
      {
        icon: 'ai ai-book',
        title: 'Read the docs',
        description: 'Guides, API reference, and troubleshooting for every Azion product.',
        href: 'https://www.azion.com/en/documentation/',
        target: '_blank'
      }
    ]"
  />
</template>
```

### Secondary action

```vue
<script setup>
  import ContactHub from '@aziontech/webkit/contact-hub'
</script>

<template>
  <ContactHub
    anchor="contact"
    :lanes="[
      {
        icon: 'ai ai-briefcase',
        title: 'Sales',
        description: 'Discuss your requirements, get custom pricing, or see the platform running.',
        action: { label: 'Talk to sales', href: '/contact/sales', trailing: true },
        secondaryAction: { label: 'See pricing', href: '/pricing' }
      },
      {
        icon: 'ai ai-headphones',
        title: 'Support',
        description: 'Open a ticket from your account. Engineers pick it up 24/7 on paid plans.',
        action: { label: 'Open a ticket', href: '/support', trailing: true },
        statusLink: {
          label: 'System status',
          href: 'https://status.example.com/',
          target: '_blank'
        }
      }
    ]"
    :channels="[
      {
        icon: 'ai ai-users',
        title: 'Join the community',
        description: 'Ask other developers and the team. Open to everyone, on any plan.',
        href: 'https://community.example.com/',
        target: '_blank'
      },
      {
        icon: 'ai ai-book',
        title: 'Read the docs',
        description: 'Guides, API reference and troubleshooting for every product.',
        href: 'https://example.com/docs',
        target: '_blank'
      }
    ]"
  />
</template>
```
