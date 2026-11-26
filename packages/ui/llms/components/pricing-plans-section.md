# Pricing Plans Section

> The plan cards at the top of Pricing: a billing-period toggle over a framed row of pricing cards, each with its plan name, its price for the picked period, what it includes and one button. The recommended plan sits on a raised surface and carries a tag. It is a page section — the site places it from a `{ _id: 'pricing-plans-section', props }` entry and binds `props` straight onto it — and it composes `registration-frame`, `toggle-group`, `card-grid`, `pricing-card` and `button`; the picked period is local state. The band runs full bleed (the page's inline inset only, closed by a bottom rule) and centres its frame at the site measure, with rules on its sides.

- Import: `import PricingPlansSection from '@aziontech/webkit/pricing-plans-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [pricing-plans-section.json](pricing-plans-section.json)

## When to use

- Use PricingPlansSection for price cards with a billing-period toggle on the public pricing page, the plans side by side at the top of Pricing.

## Do

- Give every plan one price per period, matched by `period`; a price without a `period` applies to every period.
- Highlight one plan; it is raised and is the only card that shows its tag.
- Put terms that hold for every period in the plan's `description`; a price's own `details` replaces it for that period.
- Keep `features` to five or so short labels led by an icon.

## Don’t

- To compare plans or support tiers feature by feature → use `plan-comparison-section`.
- To compare Azion with one competitor → use `competitor-comparison-section`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [pricing-card](pricing-card.md) — the card each plan renders with.
- [plan-comparison-section](plan-comparison-section.md) — the matrix that sits under these cards.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `periods` | `PricingPlansSectionPeriod[]` | `[]` | false | The billing periods of the toggle, in order; each is `{ label, value }`. The toggle shows with two or more and opens on the first. |
| `periodsAriaLabel` | `string` | `''` | false | Accessible name of the billing-period toggle. |
| `plans` | `PricingPlansSectionPlan[]` | `[]` | false | The plan cards, in order; each is `{ name, description?, highlighted?, tagLabel?, prices, featuresTitle?, features?, action? }` where a price is `{ period?, value, prefix?, suffix?, details? }`, a feature is `{ icon, label }` and `action` is `{ label, href }`; `description` stands in for a price without `details`, a plan without a name is dropped, and an action without a label or href is dropped. |

## States

- Visual states: `default`
- The picked period selects each plan's price; a plan with no price for it falls back to its period-less price
- Price change: every card is `animated`, so a period switch fades the old price out and the new one in (the card's reduced-motion fallback swaps it in place)
- Terms: the line under the price is the price's `details`, else the plan's `description`, else empty
- Layout: a full-width band (`__band`) on `var(--bg-canvas)` with the page's inline inset `var(--layout-boundary-inline)` and a bottom rule, and inside it a `registration-frame` with side rules and bottom marks capped at `var(--layout-measure-site)` and centred
- The highlighted plan sits on `var(--bg-surface)`, shows its tag and carries the secondary button; the others sit on `var(--bg-canvas)` with an outlined button
- Empty: when no plan has a name the band renders nothing but its root

## Accessibility

- Visible focus: owned by the composed `toggle-group` and `button`.
- Keyboard map: `Tab` reaches the toggle and each card's button; the toggle's arrow-key map is `toggle-group`'s.
- ARIA: the toggle is named by `periodsAriaLabel`; each plan is a `pricing-card` article with its name as `h3`; the features are a list and their glyphs are `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text colours are the tokens above.
- `motion-reduce:transition-none motion-reduce:transform-none` — the toggle indicator belongs to `toggle-group` and the price fade to `pricing-card`, each with its own reduced-motion fallback; this band adds no motion of its own.
- Touch target ≥40×40 px — the toggle and the buttons are `large`.

## Right-to-left

- Layout: logical utilities and the composed components' own mirroring, so the plan cards fill from the inline start.
- Icons: action chevrons mirror (owned by `button`).
- Keyboard: unchanged.

## Internationalization

- No built-in strings: every visible string arrives through props.

## Responsive

- The plan cards follow `card-grid`: stacked on phones, side by side as the grid widens; the billing `toggle-group` stays above them.
- No horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import PricingPlansSection from '@aziontech/webkit/pricing-plans-section'

  const periods = [
    {
      label: 'Monthly',
      value: 'monthly'
    },
    {
      label: 'Annual',
      value: 'annual'
    }
  ]

  const plans = [
    {
      name: 'Hobby',
      highlighted: false,
      prices: [
        {
          value: 'Free',
          details: 'Free forever, no card required. Included limits reset every month.'
        }
      ],
      featuresTitle: 'All features included.',
      features: [
        {
          icon: 'az az-globe',
          label: 'Global infrastructure'
        },
        {
          icon: 'az az-functions',
          label: 'Serverless functions'
        },
        {
          icon: 'az az-object-storage',
          label: 'Storage and database'
        },
        {
          icon: 'az az-image',
          label: 'Image Processor'
        },
        {
          icon: 'az az-firewall',
          label: 'DDoS mitigation and firewall'
        }
      ],
      action: {
        label: 'Start for free',
        href: 'https://console.azion.com/signup?plan=hobby'
      }
    },
    {
      name: 'Pro',
      highlighted: true,
      tagLabel: 'Popular',
      prices: [
        {
          period: 'monthly',
          value: '25',
          prefix: '$',
          suffix: '/mo',
          details:
            'Billed monthly, cancel anytime. Usage past the included limits is charged on demand.'
        },
        {
          period: 'annual',
          value: '20',
          prefix: '$',
          suffix: '/mo',
          details: 'Billed annually, save 20%. Usage past the included limits is charged on demand.'
        }
      ],
      featuresTitle: 'All Hobby features, plus:',
      features: [
        {
          icon: 'az az-workloads',
          label: 'Additional workloads'
        },
        {
          icon: 'az az-applications',
          label: 'Higher application limits'
        },
        {
          icon: 'az az-store-pillar',
          label: 'More storage capacity'
        },
        {
          icon: 'az az-waf',
          label: 'Broader security coverage'
        },
        {
          icon: 'az az-wallet',
          label: 'Configurable spend limit'
        }
      ],
      action: {
        label: 'Start with Pro',
        href: 'https://console.azion.com/signup?plan=pro&billing-cycle=monthly'
      }
    },
    {
      name: 'Enterprise',
      description: 'Custom terms and payment schedule. Commit up front and save on usage.',
      highlighted: false,
      prices: [{ value: 'Custom' }],
      featuresTitle: 'All Pro features, plus:',
      features: [
        {
          icon: 'az az-chart-line',
          label: 'On-demand pricing'
        },
        {
          icon: 'az az-arrow-down',
          label: 'Cut costs with commitments'
        },
        {
          icon: 'az az-layers',
          label: 'Capacity Reservation available'
        },
        {
          icon: 'az az-calendar',
          label: 'Savings Plan available'
        },
        {
          icon: 'az az-business-support',
          label: 'Advanced support available'
        }
      ],
      action: {
        label: 'Talk to sales',
        href: '#contact'
      }
    }
  ]
</script>

<template>
  <PricingPlansSection
    anchor="plans"
    :periods="periods"
    periods-aria-label="Billing period"
    :plans="plans"
  />
</template>
```
