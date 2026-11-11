# Compare Support Tiers

> The tier-by-tier comparison on the Support page: one column per support tier with its name, who it is for and its action button pinned in the header while the page scrolls, one band per service family with an overline and a title, and one row per service saying what each tier includes — a tick, a dash, or the allowance as text. Each band closes on its own link to the matching pricing documentation, the recommended tier carries an accent bar, and below the large breakpoint the table folds to one tier picked from a select. It is a page section — the site places it from a `{ _id: 'compare-support-tiers', props }` entry and binds `props` straight onto it — and it composes `section-module`, `select`, `button`, `overline` and `link`.

- Import: `import CompareSupportTiers from '@aziontech/webkit/compare-support-tiers'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [compare-support-tiers.json](https://github.com/aziontech/webkit/blob/main/.specs/compare-support-tiers.json)

## When to use

- On the Support page, to show what each support tier includes service by service.

## Do

- Give every tier a stable `id`; the narrow-screen picker selects by it.
- Mark one tier `highlighted`; it gets the accent bar, the secondary button and opens the picker.
- Give every row's `values` one entry per tier, in tier order.

## Don’t

- To compare platform plans → use `compare-plans`.
- To compare Azion with a competitor → use `comparison-table`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [compare-plans](compare-plans.md) — the same matrix for platform plans, with hints and tags on rows and one closing link.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `caption` | `string` | `''` | false | Screen-reader caption naming the table. |
| `columnLabel` | `string` | `''` | false | Heading of the service column, shown from the large breakpoint up. |
| `pickerAriaLabel` | `string` | `''` | false | Accessible name of the tier picker shown below the large breakpoint. |
| `includedLabel` | `string` | `''` | false | Screen-reader text of a ticked cell. |
| `excludedLabel` | `string` | `''` | false | Screen-reader text of a dashed cell. |
| `tiers` | `CompareSupportTiersTier[]` | `[]` | false | The tier columns, in order; each is `{ id, name, description, highlighted?, action }` with `action` as `{ label, href }`; a tier without a name is dropped. |
| `sections` | `CompareSupportTiersSection[]` | `[]` | false | The service bands, in order; each is `{ eyebrow, title, action?, rows }` where `action` is the closing `{ label, href }` link, and a row is `{ label, values, group? }` with one value per tier: `true` or `✓` ticks, `—` dashes, other text shows as written, empty is blank. |

## States

- Visual states: `default`
- The highlighted tier carries the accent bar and the secondary button; the others carry an outlined button
- Below the large breakpoint only the picked tier's column shows (`data-folded` on the others); the picker opens on the highlighted tier, or the first
- A group row (`group: true`) reads in the default text colour and draws a top rule unless it opens its band
- Empty: when no tier has a name the band renders nothing but its root

## Accessibility

- Visible focus: owned by the composed `select`, `button` and `link`.
- Keyboard map: `Tab` reaches the picker (below `lg`), each tier button and each band's closing link; the picker's keyboard map is `select`'s.
- ARIA: the table carries a `caption`, `scope="col"` tier heads, a `scope="colgroup"` head per band and a `scope="row"` head per service, so each value is announced with its row and tier. The tick and dash glyphs are `aria-hidden` and carry `includedLabel` / `excludedLabel` as `sr-only` text; the accent bar is decorative; the tier names stay readable to screen readers below `lg`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text colours are the tokens above.
- `motion-reduce:transition-none motion-reduce:transform-none` — the composed controls carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the tier buttons and the picker are `large`.
- Reflow: below `lg` (one tier column beside the row labels) the header cells, the section headings and the row labels use `var(--spacing-sm)` side padding instead of `var(--spacing-lg)`, so the two columns fit a 640px box at 200% zoom; from `lg` the padding is unchanged.

## Examples

### Default

```vue
<script setup>
  import CompareSupportTiers from '@aziontech/webkit/compare-support-tiers'

  const tiers = [
    {
      id: 'developer',
      name: 'Developer',
      description: 'Ideal for exploring the platform independently.',
      highlighted: false,
      action: {
        label: 'Start for free',
        href: '/signup'
      }
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Ideal for teams that need support from specialists.',
      highlighted: false,
      action: {
        label: 'Talk to a specialist',
        href: '/contact'
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Ideal for organizations that require advanced support and ongoing services.',
      highlighted: true,
      action: {
        label: 'Talk to a specialist',
        href: '/contact'
      }
    },
    {
      id: 'mission-critical',
      name: 'Mission-Critical',
      description:
        'Ideal for mission-critical operations that need priority and proactive support.',
      highlighted: false,
      action: {
        label: 'Talk to a specialist',
        href: '/contact'
      }
    }
  ]

  const sections = [
    {
      eyebrow: 'Support',
      title: 'Get help when it matters most',
      action: {
        label: 'See pricing',
        href: 'https://www.azion.com/en/documentation/products/pricing/#support'
      },
      rows: [
        {
          label: 'Self-service support',
          group: true,
          values: ['', '', '', '']
        },
        {
          label: 'Learning Center',
          values: [true, true, true, true]
        },
        {
          label: 'Azion Copilot (AI)',
          values: [true, true, true, true]
        },
        {
          label: 'Technical Support',
          group: true,
          values: ['', '', '', '']
        },
        {
          label: 'Community Support (Discord)',
          values: [true, true, true, true]
        },
        {
          label: '24/7 support via ticket and email',
          values: ['—', true, true, true]
        },
        {
          label: 'Phone and video support',
          values: ['—', '—', true, true]
        },
        {
          label: 'Slack channel',
          values: ['—', '—', 'Paid add-on', 'Paid add-on']
        },
        {
          label: 'First response time',
          group: true,
          values: ['', '', '', '']
        },
        {
          label: 'General guidance',
          values: ['—', '< 24 hours', '< 24 hours', '< 12 hours']
        },
        {
          label: 'System impaired',
          values: ['—', '< 12 hours', '< 12 hours', '< 12 hours']
        },
        {
          label: 'Production system impaired',
          values: ['—', '< 4 hours', '< 4 hours', '< 2 hours']
        },
        {
          label: 'Production system down',
          values: ['—', '< 2 hours', '< 1 hour', '< 30 minutes']
        },
        {
          label: 'Business system down',
          values: ['—', '—', '< 15 minutes', '< 15 minutes']
        }
      ]
    },
    {
      eyebrow: 'Professional Services',
      title: 'Move faster with specialist guidance',
      action: {
        label: 'See pricing',
        href: 'https://www.azion.com/en/documentation/products/pricing/#professional-services'
      },
      rows: [
        {
          label: 'Integration Services',
          group: true,
          values: ['—', '5 hours/year included', '20 hours/year included', '60 hours/year included']
        },
        {
          label: 'Best Practices Review',
          group: true,
          values: ['—', 'Paid add-on', '20 hours/year included', '40 hours/year included']
        },
        {
          label: 'Business Events Support',
          group: true,
          values: ['—', '—', '1 event per year', '100 hours/year included']
        },
        {
          label: 'Technical Account Manager',
          group: true,
          values: ['—', '—', 'Paid add-on', '20 hours/month included']
        },
        {
          label: 'Instructor-Led Training',
          group: true,
          values: ['—', '—', 'Paid add-on', 'Paid add-on']
        },
        {
          label: 'Managed Configuration Service',
          group: true,
          values: ['—', '—', 'Paid add-on', 'Paid add-on']
        },
        {
          label: 'Security Response Team',
          group: true,
          values: ['—', '—', 'Paid add-on', 'Paid add-on']
        }
      ]
    }
  ]
</script>

<template>
  <CompareSupportTiers
    anchor="tiers"
    caption="Support and Professional Services comparison across the Developer, Business, Enterprise and Mission-Critical tiers."
    column-label="Support"
    picker-aria-label="Tier being compared"
    included-label="Included"
    excluded-label="Not included"
    :tiers="tiers"
    :sections="sections"
  />
</template>
```
