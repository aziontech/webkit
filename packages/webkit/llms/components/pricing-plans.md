# Pricing Plans

> The plan cards at the top of Pricing: a billing-period toggle over a framed row of pricing cards, each with its plan name, its price for the picked period, what it includes and one button. The recommended plan sits on a raised surface and carries a tag. It is a page section — the site places it from a `{ _id: 'pricing-plans', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `toggle-group`, `card-grid`, `card-pricing` and `button`; the picked period is local state.

- Import: `import PricingPlans from '@aziontech/webkit/pricing-plans'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [pricing-plans.json](https://github.com/aziontech/webkit/blob/main/.specs/pricing-plans.json)

## When to use

- At the top of Pricing, to lay the plans side by side with a price per billing period.

## Do

- Give every plan one price per period, matched by `period`; a price without a `period` applies to every period.
- Highlight one plan; it is raised and is the only card that shows its tag.
- Keep `features` to five or so short labels led by an icon.

## Don’t

- To compare plans feature by feature → use `compare-plans`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [card-pricing](card-pricing.md) — the card each plan renders with.
- [compare-plans](compare-plans.md) — the matrix that sits under these cards.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `periods` | `PricingPlansPeriod[]` | `[]` | false | The billing periods of the toggle, in order; each is `{ label, value }`. The toggle shows with two or more and opens on the first. |
| `periodsAriaLabel` | `string` | `''` | false | Accessible name of the billing-period toggle. |
| `plans` | `PricingPlansPlan[]` | `[]` | false | The plan cards, in order; each is `{ name, highlighted?, tagLabel?, prices, featuresTitle?, features?, action? }` where a price is `{ period?, value, prefix?, suffix?, details? }`, a feature is `{ icon, label }` and `action` is `{ label, href }`; a plan without a name is dropped, and an action without a label or href is dropped. |

## States

- Visual states: `default`
- The picked period selects each plan's price; a plan with no price for it falls back to its period-less price
- The highlighted plan sits on `var(--bg-surface)`, shows its tag and carries the secondary button; the others sit on `var(--bg-canvas)` with an outlined button
- Empty: when no plan has a name the band renders nothing but its root

## Accessibility

- Visible focus: owned by the composed `toggle-group` and `button`.
- Keyboard map: `Tab` reaches the toggle and each card's button; the toggle's arrow-key map is `toggle-group`'s.
- ARIA: the toggle is named by `periodsAriaLabel`; each plan is a `card-pricing` article with its name as `h3`; the features are a list and their glyphs are `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text colours are the tokens above.
- `motion-reduce:transition-none motion-reduce:transform-none` — the toggle indicator belongs to `toggle-group`, which carries its own fallback; this band adds no motion.
- Touch target ≥40×40 px — the toggle and the buttons are `large`.

## Examples

### Default

```vue
<script setup>
  import PricingPlans from '@aziontech/webkit/pricing-plans'

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
          icon: 'pi pi-globe',
          label: 'Global infrastructure'
        },
        {
          icon: 'ai ai-edge-functions',
          label: 'Serverless functions'
        },
        {
          icon: 'ai ai-edge-storage',
          label: 'Storage and database'
        },
        {
          icon: 'pi pi-image',
          label: 'Image Processor'
        },
        {
          icon: 'ai ai-edge-firewall',
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
          icon: 'ai ai-workloads',
          label: 'Additional workloads'
        },
        {
          icon: 'ai ai-edge-application',
          label: 'Higher application limits'
        },
        {
          icon: 'ai ai-store',
          label: 'More storage capacity'
        },
        {
          icon: 'ai ai-waf-rules',
          label: 'Broader security coverage'
        },
        {
          icon: 'pi pi-wallet',
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
      highlighted: false,
      prices: [
        {
          value: 'Custom',
          details: 'Custom terms and payment schedule. Commit up front and save on usage.'
        }
      ],
      featuresTitle: 'All Pro features, plus:',
      features: [
        {
          icon: 'pi pi-chart-line',
          label: 'On-demand pricing'
        },
        {
          icon: 'pi pi-arrow-down',
          label: 'Cut costs with commitments'
        },
        {
          icon: 'ai ai-layers',
          label: 'Capacity Reservation available'
        },
        {
          icon: 'pi pi-calendar',
          label: 'Savings Plan available'
        },
        {
          icon: 'ai ai-business-support',
          label: 'Advanced support available'
        }
      ],
      action: {
        label: 'Talk to a specialist',
        href: '#contact'
      }
    }
  ]
</script>

<template>
  <PricingPlans
    anchor="plans"
    :periods="periods"
    periods-aria-label="Billing period"
    :plans="plans"
  />
</template>
```
