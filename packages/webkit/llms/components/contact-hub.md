# Contact Hub

> The band under the Contact title band: the team lanes side by side (Sales and Support), each with its scope in one sentence and the action that reaches that team, over a row of self-serve channels. It is a page section — the site places it from a `{ _id: 'contact-hub', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `card-grid`, `topic` and `button`. A lane can carry a second link to the system status page, so a reader can check for an incident before opening a ticket.

- Import: `import ContactHub from '@aziontech/webkit/contact-hub'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [contact-hub.json](https://github.com/aziontech/webkit/blob/main/.specs/contact-hub.json)

## When to use

- On the Contact page, to route a reader to the team or channel that answers them.

## Do

- Keep two lanes so they split the frame evenly, and three channels for the three-column row.
- Keep each lane's description to one sentence that states what that team handles.
- Set `target: '_blank'` on a channel or status link that leaves the site.

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
| `lanes` | `ContactHubLane[]` | `[]` | false | The team lanes side by side, in order; each is `{ icon, title, description, action?, statusLink? }` where `action` is the lane's button and `statusLink` the system status link beside it. |
| `channels` | `ContactHubChannel[]` | `[]` | false | The self-serve channels under the lanes, in order; each is `{ icon, title, description, href, target? }`, rendered as a linked topic. |

## States

- Visual states: `default`
- Empty: the lanes frame renders only when `lanes` is set and the channels frame only when `channels` is set; with neither the band renders nothing but its root
- A lane's action and status link render only when given

## Accessibility

- Visible focus: the status link carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; buttons and topics own theirs.
- Keyboard map: `Tab` reaches each lane action, the status link and each channel; `Enter` follows it.
- ARIA: the band is an unnamed `<section>`; each lane heading and each channel is an `h2`, so the outline reads one entry per route. Glyphs and the status dot are `aria-hidden`. A link with `target: '_blank'` carries `rel="noopener noreferrer"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): lane heading `var(--text-muted)`, description `var(--text-default)`.
- `motion-reduce:transition-none` on the status link's colour transition.
- Touch target ≥40×40 px — the status link is at least `h-10` (`min-h-10`), buttons are large, channels are whole-cell links.
- Reflow: the status link has `min-h-10` and wraps its label inside `max-w-full`, so it never overflows a narrow column or a 200% zoom.

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
        icon: 'pi pi-briefcase',
        title: 'Sales',
        description:
          'Discuss your requirements, get custom pricing, or see the platform running on your own workload.',
        action: { label: 'Talk to sales', href: '/contact/sales' }
      },
      {
        icon: 'pi pi-headphones',
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
        icon: 'pi pi-shield',
        title: 'Under a cyberattack?',
        description:
          'Get emergency mitigation for an attack in progress, even before you become a customer.',
        href: 'https://www.azion.com/en/lp/under-attack-mitigation/',
        target: '_blank'
      },
      {
        icon: 'pi pi-discord',
        title: 'Join the community',
        description: 'Ask developers and the Azion team on Discord. Open to everyone, on any plan.',
        href: 'https://discord.com/invite/pM8ANzztuB',
        target: '_blank'
      },
      {
        icon: 'pi pi-book',
        title: 'Read the docs',
        description: 'Guides, API reference, and troubleshooting for every Azion product.',
        href: 'https://www.azion.com/en/documentation/',
        target: '_blank'
      }
    ]"
  />
</template>
```
