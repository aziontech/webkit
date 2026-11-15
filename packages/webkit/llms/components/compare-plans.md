# Compare Plans

> The feature-by-feature matrix under the plan cards on Pricing: one column per plan with its name and action button pinned in the header while the page scrolls, one band per product with an overline, a title and a lead, and one row per feature saying what each plan includes — an included mark, a not-included mark, or the allowance as text. The recommended plan carries an accent bar, and below the large breakpoint the table folds to one plan picked from a searchable select. It is a page section — the site places it from a `{ _id: 'compare-plans', props }` entry and binds `props` straight onto it — and it composes `section-module`, `select`, `input`, `button`, `icon-button`, `popover`, `tooltip`, `overline`, `tag` and `link`.

- Import: `import ComparePlans from '@aziontech/webkit/compare-plans'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [compare-plans.json](https://github.com/aziontech/webkit/blob/main/.specs/compare-plans.json)

## When to use

- Use ComparePlans for a feature matrix across plans or support tiers: on Pricing under the plan cards, product by product, and on Support with one column per support tier.

## Do

- Give every plan a stable `id`; the narrow-screen picker selects by it.
- Mark one plan `highlighted`; it gets the accent bar, the secondary button and opens the picker.
- Give every row's `values` one entry per plan, in plan order.
- Use a row's `hint` to define the term its label names; it opens in a popover titled with the label, so it can run to a sentence or two.
- Set `includedLabel` and `excludedLabel` to the page's words; left empty, the marks read the locale's Included and Not included.

## Don’t

- To compare Azion with one competitor → use `comparison-table`.
- For price cards with a billing-period toggle → use `pricing-plans`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [pricing-plans](pricing-plans.md) — the plan cards this matrix sits under.
- [comparison-table](comparison-table.md) — Azion against one competitor.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `caption` | `string` | `''` | false | Screen-reader caption naming the table. |
| `columnLabel` | `string` | `''` | false | Heading of the feature column, shown from the large breakpoint up. |
| `pickerAriaLabel` | `string` | `''` | false | Accessible name of the plan picker shown below the large breakpoint. |
| `includedLabel` | `string` | `''` | false | Tooltip and screen-reader text of an included cell; empty uses the locale catalog (`Included`). |
| `excludedLabel` | `string` | `''` | false | Tooltip and screen-reader text of a not-included cell; empty uses the locale catalog (`Not included`). |
| `plans` | `ComparePlansPlan[]` | `[]` | false | The plan columns, in order; each is `{ id, name, description?, highlighted?, action }` with `action` as `{ label, href }`; a plan without a name is dropped. |
| `sections` | `ComparePlansSection[]` | `[]` | false | The product bands, in order; each is `{ eyebrow, title, description, rows, action? }` (`action` closes the band, `{ label, href }`) and a row is `{ label, values, group?, hint?, tag? }` with one value per plan: `true` or `✓` is included, `—` is not included, other text shows as written, empty is blank; `hint` defines the label in a popover. |
| `primaryAction` | `ComparePlansAction` | `undefined` | false | Closing link under the table, opened in a new tab; `{ label, href }`. Omitted when absent. |

## States

- Visual states: `default`
- The highlighted plan carries the accent bar and the secondary button; the others carry an outlined button
- Below the large breakpoint only the picked plan's column shows (`data-folded` on the others); the picker opens on the highlighted plan, or the first
- Picker search: the picker's list carries a search field that narrows the plans by name; with no match it shows a `role="status"` line from the locale catalog (`No results found.`); the query clears each time the list opens or closes
- Cells: an included cell is a `pi pi-check-circle` mark and a not-included cell an `ai ai-circle-minus` mark, each with a tooltip of its label on hover and the same label as `sr-only` text
- Hint: a row with `hint` ends its label with an info icon button that opens a popover titled with the label and described by the hint
- Closing rule: when neither the last band nor the table carries a closing link, the last row draws a bottom rule (`data-closing`) so the table never ends open
- Below the large breakpoint the plan button's label wraps (auto height, at least 40 px) instead of widening the table, so the folded matrix fits a 320 px screen whatever the font metrics.
- A group row (`group: true`) reads in the default text colour and draws a top rule unless it opens its band
- Empty: when no plan has a name the band renders nothing but its root

## Accessibility

- Visible focus: owned by the composed `select`, `input`, `button`, `icon-button` and `link`.
- Keyboard map: `Tab` reaches the picker (below `lg`), each plan button, each hint button and the closing link; the picker's keyboard map is `select`'s and its search field takes typing while the list is open; `Enter` or `Space` on a hint button opens its popover and `Escape` closes it, returning focus to the button (`popover`'s map).
- ARIA: the table carries a `caption`, `scope="col"` plan heads, a `scope="colgroup"` head per band and a `scope="row"` head per feature, so each value is announced with its row and plan. The included and not-included marks are `aria-hidden` and carry their label as `sr-only` text (the tooltip repeats it for pointer users); each hint button is named `About <label>` from the locale catalog and its popover is titled by the label; the picker's search field is named `Search <picker name>` and its no-match line is a `status`; the accent bar is decorative; the plan names stay readable to screen readers below `lg`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text colours are the tokens above.
- `motion-reduce:transition-none motion-reduce:transform-none` — the composed controls carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the plan buttons and the picker are `large`.
- Reflow: below `lg` (one plan column beside the row labels) the header cells, the section headings and the row labels use `var(--spacing-sm)` side padding instead of `var(--spacing-lg)`, so the two columns fit a 640px box at 200% zoom; from `lg` the padding is unchanged.

## Examples

### Band links

```vue
<script setup>
  import ComparePlans from '@aziontech/webkit/compare-plans'

  const plans = [
    {
      id: 'hobby',
      name: 'Hobby',
      description: 'For side projects.',
      action: { label: 'Start for free', href: '/signup' }
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For teams in production.',
      highlighted: true,
      action: { label: 'Start trial', href: '/signup?plan=pro' }
    }
  ]

  const sections = [
    {
      eyebrow: 'Compute',
      title: 'Functions',
      description: 'Run code close to users.',
      rows: [
        { label: 'Requests per month', values: ['1M', '10M'] },
        { label: 'Custom domains', values: [true, true] },
        { label: 'Usage alerts', values: ['—', true] }
      ],
      action: { label: 'See compute rates', href: '/pricing/compute' }
    },
    {
      eyebrow: 'Storage',
      title: 'Object Storage',
      rows: [
        { label: 'Storage included', values: ['5 GB', '100 GB'] },
        { label: 'Versioning', values: ['—', true] }
      ],
      action: { label: 'See storage rates', href: '/pricing/storage' }
    }
  ]
</script>

<template>
  <ComparePlans
    caption="Hobby and Pro compared feature by feature"
    column-label="Features"
    picker-aria-label="Plan being compared"
    included-label="Included"
    excluded-label="Not included"
    :plans="plans"
    :sections="sections"
  />
</template>
```

### Hints and marks

```vue
<script setup>
  import ComparePlans from '@aziontech/webkit/compare-plans'

  const plans = [
    { id: 'starter', name: 'Starter', action: { label: 'Start for free', href: '/signup' } },
    {
      id: 'team',
      name: 'Team',
      highlighted: true,
      action: { label: 'Start with Team', href: '/signup?plan=team' }
    },
    { id: 'scale', name: 'Scale', action: { label: 'Talk to sales', href: '/contact' } }
  ]

  const sections = [
    {
      eyebrow: 'Security',
      title: 'Protection',
      description: 'Keep applications and APIs safe from attacks and abuse.',
      rows: [
        {
          label: 'Web application firewall',
          hint: 'Inspects every request and blocks common attacks, such as SQL injection and cross-site scripting, before they reach your application.',
          values: [true, true, true]
        },
        {
          label: 'Bot management',
          hint: 'Tells people from automated traffic and blocks the bots you choose.',
          values: ['—', true, true]
        },
        { label: 'Custom rules', values: ['5 rules', '50 rules', 'Unlimited'] },
        { label: 'Dedicated support engineer', values: ['—', '—', true] }
      ]
    }
  ]
</script>

<template>
  <ComparePlans
    caption="What each plan includes for security."
    column-label="Features"
    picker-aria-label="Plan being compared"
    included-label="Included"
    excluded-label="Not included"
    :plans="plans"
    :sections="sections"
  />
</template>
```

### Support tiers

```vue
<script setup>
  import ComparePlans from '@aziontech/webkit/compare-plans'

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
  <ComparePlans
    anchor="tiers"
    caption="Support and Professional Services comparison across the Developer, Business, Enterprise and Mission-Critical tiers."
    column-label="Support"
    picker-aria-label="Tier being compared"
    included-label="Included"
    excluded-label="Not included"
    :plans="tiers"
    :sections="sections"
  />
</template>
```
