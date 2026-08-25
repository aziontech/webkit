// The Azion plans — the whole content library for the entrance, in one file.
//
// A plan is a contract tier, and the console shows it as one (the tag under an
// organization's name in the switcher, the tier on Billing). But nobody arriving
// at Azion for the first time thinks in tiers — they think in what they are about
// to build. So the ENTRANCE never asks "which tier do you want": it asks what the
// user is working on, in their own words, and the tier is the CONSEQUENCE, shown
// as a tag on the row they pick. One question, two things learned.
//
// That is why each plan carries two strings for what is nominally one label:
//   · `name` — the tier, as the contract and the rest of the console call it
//     ("Pro"). It is the tag, and it is what `createOrganization` stores.
//   · `headline` — the same tier as a sentence about the user's work ("I'm working
//     on commercial projects"). It is the row's label, and it is the only part the
//     user actually has to read to choose correctly.
//
// The severities climb deliberately — neutral, blue, brand — so the three rows
// read as a ladder at a glance instead of three equally-weighted options.
//
// ── WHY THE UPGRADE CONTENT LIVES HERE ──
//
// Everything the upgrade drawer renders is DATA on the plan: the section heading,
// the feature checklist, the reference links, and the charge table for each
// billing period. Nothing about a tier is written into the drawer's markup.
//
// That is the point. A tier's feature list changes far more often than its
// interface does — a new limit, a new compliance certification, a price move —
// and each of those has to be a one-line edit in this file, made by whoever owns
// the pricing, without opening a `.vue`. It is also what lets ONE drawer serve
// Pro and Enterprise (and any tier added later): the drawer renders whatever the
// selected plan declares, so a fourth tier is a new entry here and no new
// component.
//
// The shape each plan must hold for the drawer to render it:
// A tier's price is carried TWICE, on purpose, because two surfaces read it two
// different ways:
//   · `price` — one string ("From $20/mo"), for anywhere a tier is named in passing:
//     a row's supporting line, a toast, an aria-label.
//   · `card`  — the same figure DECOMPOSED for the pricing card's Currency
//     ({ value, prefix, suffix }), because Currency renders the symbol, the amount
//     and the period as three separately-styled parts. Passing it "From $20/mo" as a
//     value with the prefix turned off makes it a plain string in a component whose
//     whole job is to typeset money — the symbol loses its size, the period loses
//     its muted treatment, and the number no longer aligns with the card beside it.
//     A free tier has no symbol and no period, so it carries only `value`.
//
//     The card's period is the ABBREVIATED unit ("/ mon"), not the prose one this
//     file's `price` string uses. On the pricing card the figure is the 56px headline
//     and the unit sits beside it inside a 256px measure — "per month" fits next to
//     "$20" and wraps to two lines next to "$2.000", which is the tier whose price
//     most needs to be read at a glance. The abbreviation is what the design
//     specifies for this surface for exactly that reason.
//
// ── THE COMPARISON CONTENT IS THE PRICING PAGE'S, NOT A SECOND COPY OF IT ──
//
// `description`, `cardDetails` and `comparison` are what the console's plan CARDS read
// (../components/billing/ChangePlanDrawer.vue). They carry the same claims the public
// pricing page makes, in the console's own voice: sentence-case tier names, console
// button labels, and English rather than the page's pt-BR. That matters because the two
// surfaces answer the same question minutes apart — somebody who compared tiers on the
// pricing page and then opened Change Plan must not be shown a different set of
// promises. What the console does NOT inherit is the page's presentation: no uppercase
// mono actions (see `webkit-microcopy`), no marketing-band type scale.
//
//   description   · one line, what the tier is FOR. Two lines at the card's measure.
//   card          · keyed by BILLING PERIOD, because the toggle above the cards changes
//                   the figure and its caveat together (Pro is $25 monthly / $20
//                   yearly). Each entry is the figure decomposed for Currency plus
//                   `details`, the caveat under it — '' when the tier has none. Hobby
//                   has none; the card reserves the band anyway, so the row of cards
//                   still aligns (CardPricing's `aligned`). Read it with `cardFor`.
//   comparison    · { featuresTitle, features: [{ icon, label }] } — the five claims
//                   the card lists. `icon` is a full icon-font class ('pi pi-globe',
//                   'ai ai-workloads'), because the `ai` / `pi` prefix is part of the
//                   class and an icon name alone renders nothing.
//
//                   This block is the SAME comparison the marketing pricing page shows
//                   (@site/data/pricing.js) — same lead-ins, same glyphs, same labels —
//                   so a reader who priced the tiers on the site and then opened this
//                   drawer is not handed a second, differently-worded version of the
//                   claim. `featuresTitle` is cumulative: each tier names the one below
//                   it ("All Hobby features, plus:") instead of restating it, which is
//                   what keeps the five lines under it to only what that tier ADDS.
//
//   requiresPayment  · false skips the drawer entirely (Hobby is free)
//   upgrade.features · [{ title, detail }] — `detail` is the metered rate after
//                      the included allowance, and is optional
//   upgrade.links    · [{ label, href }] rendered under the checklist — in-app paths onto
//                      the pricing page, see `pricingLinks` below
//   charge.periods   · [{ value, label }] for the Monthly/Yearly control
//   charge.rows      · per period, [{ label, value, suffix }] — the summary lines
//   charge.total     · per period, { value, suffix }
//
// The figures below are the ones the design specifies. They are demo data: this
// sample has no billing backend, and the drawer never contacts one.

// Shared across every paid tier: the compliance guarantees do not vary by tier in
// the design, so they are declared once and spread into each plan's checklist
// rather than repeated. A guarantee that ever becomes tier-specific moves back
// into that tier's own list.
const complianceFeatures = [
  { title: 'DDoS Protection included' },
  { title: 'PCI DSS 4.0.1 Level 1' },
  { title: 'SOC 2 Type 2 / SOC 3' },
  { title: 'Universal Data Migration Service' }
]

// The two doors onto the public pricing page. In this prototype that page is a route
// of its own (@site/views/LandingPricing.vue at /site/pricing) rather than azion.com,
// so the drawer and the page it defers to are the same artefact — which is the whole
// point of the block above: the reader who priced the tiers on the site and then opened
// this drawer sees one set of claims, and can walk back to the page that made them.
//
// They are two DESTINATIONS, not one link written twice: `Learn more` lands on the page
// from the top (its lead, then the tiers), while `Compare Plans` deep-links the feature
// matrix (`#comparison` in @site/components/AzionPricing.vue), which is the section
// somebody who asked to compare actually came for. Landing them both on the hero would
// make the second link a lie the reader has to scroll past.
const pricingLinks = [
  { label: 'Learn more about Pricing', href: '/site/pricing' },
  { label: 'Compare Plans', href: '/site/pricing#comparison' }
]

export const azionPlans = [
  {
    id: 'hobby',
    name: 'Hobby',
    headline: "I'm working on personal projects",
    description: 'Start free for personal projects and experimentation',
    price: 'Free',
    // Keyed by billing period, like every tier — free is free on both terms, and a
    // tier that opted out of the shape would need the reader of `cardFor` to handle two.
    // No symbol and no period: "Free" is the whole figure. And no caveat: nothing about
    // a free tier needs qualifying, and inventing a line to fill the band would be copy
    // that exists to occupy space. The card reserves the band anyway (`aligned`), so
    // the row still lines up.
    card: {
      monthly: { value: 'Free', showPrefix: false, showSuffix: false, details: '' },
      yearly: { value: 'Free', showPrefix: false, showSuffix: false, details: '' }
    },
    severity: 'contrast',
    // The free tier takes no payment, so selecting it never opens the drawer.
    requiresPayment: false,
    comparison: {
      featuresTitle: 'All Features Included.',
      features: [
        { icon: 'pi pi-globe', label: 'Global infrastructure' },
        { icon: 'ai ai-edge-functions', label: 'Serverless functions' },
        { icon: 'ai ai-edge-storage', label: 'Storage and database' },
        { icon: 'pi pi-image', label: 'Image optimization' },
        { icon: 'ai ai-edge-firewall', label: 'DDoS mitigation and firewall' }
      ]
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    headline: "I'm working on commercial projects",
    description: 'For growing applications with higher usage demand',
    price: 'From $20/mo',
    // The toggle moves the FIGURE and its caveat together, which is what makes the
    // control mean something: $25 a month on the monthly term, $20 on the annual one,
    // and the line under it says which term the reader is looking at. Stating one
    // figure for both terms and only swapping the caveat would claim the annual
    // discount without ever showing it.
    card: {
      monthly: {
        value: '25',
        prefix: '$',
        suffix: '/ mon',
        details: 'Billed monthly, cancel anytime'
      },
      yearly: { value: '20', prefix: '$', suffix: '/ mon', details: 'Billed annually, save 20%' }
    },
    severity: 'info',
    requiresPayment: true,
    comparison: {
      featuresTitle: 'All Hobby features, plus:',
      features: [
        { icon: 'ai ai-workloads', label: 'Additional workloads' },
        { icon: 'ai ai-edge-application', label: 'Higher application limits' },
        { icon: 'ai ai-store', label: 'More storage capacity' },
        { icon: 'ai ai-waf-rules', label: 'Broader security coverage' },
        { icon: 'pi pi-wallet', label: 'Configurable spend limit' }
      ]
    },
    upgrade: {
      featuresTitle: "What's included",
      features: [
        { title: '100 Workloads', detail: 'then $0.10 per workload per month' },
        { title: '10M Application requests', detail: 'then as low as $0.90 per 1M' },
        { title: '50 hours Function compute time', detail: 'then $0.18 per hour' },
        { title: '10 GB Real-Time Events Storage', detail: 'then $0.10 per GB-month' },
        { title: '100 GB Object Storage', detail: 'then as low as $0.021 per GB-month' },
        { title: '1 GB SQL Database Storage', detail: 'then $0.75 per GB-month' },
        { title: '100M Firewall requests', detail: 'then as low as $0.30 per 1M' },
        ...complianceFeatures
      ],
      links: pricingLinks
    },
    charge: {
      periods: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' }
      ],
      monthly: {
        rows: [
          { label: 'Next Charge Value', value: '$ 200' },
          { label: 'Subtotal', value: '$ 3.000', suffix: 'per month' }
        ],
        total: { value: '$ 3.000', suffix: 'per year' }
      },
      yearly: {
        rows: [
          { label: 'Next Charge Value', value: '$ 200' },
          { label: 'Subtotal', value: '$ 3.000', suffix: 'per month' },
          { label: 'Yearly Discount', value: '$ 2.200', suffix: 'per month' }
        ],
        total: { value: '$ 2.200', suffix: 'per year' }
      }
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    headline: "I'm running production at scale",
    description: 'Optimize costs with usage or spend commitments',
    price: 'From $2.000/mo',
    // "Custom" is a price too, so it is a `value` with the symbol and the unit switched
    // off — not a second way of typesetting the same row. A negotiated contract has no
    // figure to state, and stating a starting figure next to "Contact sales" would be a
    // number nobody is charged. The terms are negotiated, so neither the figure nor the
    // caveat moves with the toggle.
    card: {
      monthly: {
        value: 'Custom',
        showPrefix: false,
        showSuffix: false,
        details: 'Tailored to your usage requirements and payment terms'
      },
      yearly: {
        value: 'Custom',
        showPrefix: false,
        showSuffix: false,
        details: 'Tailored to your usage requirements and payment terms'
      }
    },
    severity: 'primary',
    requiresPayment: true,
    comparison: {
      featuresTitle: 'All Pro features, plus:',
      features: [
        { icon: 'pi pi-chart-line', label: 'On-demand pricing' },
        { icon: 'pi pi-arrow-down', label: 'Cut costs with commitments' },
        { icon: 'ai ai-layers', label: 'Capacity Reservation available' },
        { icon: 'pi pi-calendar', label: 'Savings Plan available' },
        { icon: 'ai ai-business-support', label: 'Advanced support available' }
      ]
    },
    // Sales-led: the tier is a negotiated contract (committed volume, SLAs, a named
    // account team), so there is no card to enter — the figure on the card is a
    // starting point, not a price anyone is charged by pressing a button. The
    // console's plan comparison therefore offers "Contact Sales" instead of an
    // upgrade that would take payment for terms nobody has agreed yet.
    contactSales: true,
    upgrade: {
      featuresTitle: "What's included",
      features: [
        { title: 'Unlimited Workloads' },
        { title: '1B Application requests', detail: 'then as low as $0.60 per 1M' },
        { title: '500 hours Function compute time', detail: 'then $0.12 per hour' },
        { title: '1 TB Real-Time Events Storage', detail: 'then $0.08 per GB-month' },
        { title: '10 TB Object Storage', detail: 'then as low as $0.015 per GB-month' },
        { title: '100 GB SQL Database Storage', detail: 'then $0.50 per GB-month' },
        { title: '1B Firewall requests', detail: 'then as low as $0.20 per 1M' },
        ...complianceFeatures,
        { title: '99.99% uptime SLA' },
        { title: 'Named account team' }
      ],
      links: pricingLinks
    },
    charge: {
      periods: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' }
      ],
      monthly: {
        rows: [
          { label: 'Next Charge Value', value: '$ 2.000' },
          { label: 'Subtotal', value: '$ 24.000', suffix: 'per month' }
        ],
        total: { value: '$ 24.000', suffix: 'per year' }
      },
      yearly: {
        rows: [
          { label: 'Next Charge Value', value: '$ 2.000' },
          { label: 'Subtotal', value: '$ 24.000', suffix: 'per month' },
          { label: 'Yearly Discount', value: '$ 4.800', suffix: 'per month' }
        ],
        total: { value: '$ 19.200', suffix: 'per year' }
      }
    }
  }
]

// No default: the entrance requires the user to pick one (see the Plan step). A
// pre-selected tier would be a contract nobody chose, agreed to by pressing
// Continue.
export const planFor = (id) => azionPlans.find((plan) => plan.id === id)

// The same lookup by the tier's NAME, which is what an organization stores (see
// `createOrganization`, which is handed `planNameFor(...)` by the entrance). It is
// what lets a surface showing an organization's plan — the switcher's tag — paint it
// in the tier's own severity instead of inventing a neutral one, so a tier reads the
// same colour everywhere it appears: the entrance's plan step, the upgrade drawer,
// the profile tag and the organization row.
export const planByName = (name) =>
  azionPlans.find((plan) => plan.name.toLowerCase() === String(name ?? '').toLowerCase())

// A tier's severity by name, falling back to the neutral tag: an organization whose
// plan predates the current tier list still renders, just without a claim about
// which tier it is.
export const planSeverityFor = (name) => planByName(name)?.severity ?? 'secondary'

// The tier name a plan id resolves to, which is what is stored on the
// organization. Falls back to Hobby — the free tier is the only safe assumption
// to make on someone's behalf.
export const planNameFor = (id) => planFor(id)?.name ?? azionPlans[0].name

// Whether choosing this plan has to go through the upgrade drawer before it
// counts. Reading it from the plan (rather than testing for `id !== 'hobby'`)
// is what keeps a future free or trial tier from silently demanding payment.
export const planRequiresPayment = (id) => Boolean(planFor(id)?.requiresPayment)

// The charge table for one plan and one billing period, ready to render.
export const chargeFor = (id, period) => planFor(id)?.charge?.[period] ?? null

// The pricing CARD's figure for one plan and one billing period. Falls back to the
// tier's `price` string with the symbol and unit switched off, so a tier added without
// a `card` block still renders its price rather than an empty figure.
export const cardFor = (id, period) => {
  const plan = planFor(id)
  if (!plan) return null
  return (
    plan.card?.[period] ?? {
      value: plan.price,
      showPrefix: false,
      showSuffix: false,
      details: ''
    }
  )
}
