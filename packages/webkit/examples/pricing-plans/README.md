# PricingPlans

The plan cards at the top of Pricing. A toggle picks the billing period, and the plans sit side by side with their price, what they include and one button. The recommended plan is raised and carries a tag.

The band is the `PricingPlans` component from `@aziontech/webkit/pricing-plans`; it composes `SectionModule`, `FrameBox`, `SegmentedButton`, `CardGrid` and `CardPricing`, with a `Button` in each card, and keeps the picked billing period as local state.

## Stories

### Plans

Hobby, Pro and Enterprise. Only the Pro price changes with the toggle: 25 a month billed monthly, 20 billed annually. The Enterprise button points at the page's contact band.

Example: [`site-plans.vue`](./site-plans.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `periods` sets the toggle options and `periodsAriaLabel` names it. The toggle shows only with two or more periods, and opens on the first.
- `plans[].prices` holds one price per period, matched by `period`. A price without a period applies to every period.
- `highlighted` raises the recommended plan, and `tagLabel` sets its tag.
- `featuresTitle` and `features` (an `icon` and a `label` each) list what the plan includes.
- `action` is the card button (`label`, `href`); the highlighted plan gets the secondary button, the others an outlined one. It is dropped when its label or link is missing, and a plan without a name is dropped.
- `anchor` sets the band's `id`, so a page can link to `#plans`.

Example:

Site JSON: [`site-plans.json`](./site-plans.json)
