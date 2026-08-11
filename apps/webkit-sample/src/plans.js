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
// Everything the upgrade drawer renders is DATA on the plan: the lead sentence,
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
//   requiresPayment  · false skips the drawer entirely (Hobby is free)
//   upgrade.lead     · one sentence, with `{name}` where the tier is emphasised
//   upgrade.features · [{ title, detail }] — `detail` is the metered rate after
//                      the included allowance, and is optional
//   upgrade.links    · [{ label, href }] rendered under the checklist
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
  { title: "DDoS Protection included" },
  { title: "PCI DSS 4.0.1 Level 1" },
  { title: "SOC 2 Type 2 / SOC 3" },
  { title: "Universal Data Migration Service" },
];

const pricingLinks = [
  { label: "Learn more about Pricing", href: "https://www.azion.com/en/pricing/" },
  { label: "Compare Plans", href: "https://www.azion.com/en/pricing/" },
];

export const azionPlans = [
  {
    id: "hobby",
    name: "Hobby",
    headline: "I'm working on personal projects",
    description: "Side projects, learning and demos. One workspace, community support.",
    price: "Free",
    severity: "contrast",
    // The free tier takes no payment, so selecting it never opens the drawer.
    requiresPayment: false,
  },
  {
    id: "pro",
    name: "Pro",
    headline: "I'm working on commercial projects",
    description: "Production traffic for a team, billed on what you use. Priority support.",
    price: "From $20/mo",
    severity: "info",
    requiresPayment: true,
    upgrade: {
      lead: "Upgrade to {name} to power your businesses with advanced security and compliance.",
      featuresTitle: "Upgrade features",
      features: [
        { title: "100 Workloads", detail: "then $0.10 per workload per month" },
        { title: "10M Application requests", detail: "then as low as $0.90 per 1M" },
        { title: "50 hours Function compute time", detail: "then $0.18 per hour" },
        { title: "10 GB Real-Time Events Storage", detail: "then $0.10 per GB-month" },
        { title: "100 GB Object Storage", detail: "then as low as $0.021 per GB-month" },
        { title: "1 GB SQL Database Storage", detail: "then $0.75 per GB-month" },
        { title: "100M Firewall requests", detail: "then as low as $0.30 per 1M" },
        ...complianceFeatures,
      ],
      links: pricingLinks,
    },
    charge: {
      periods: [
        { value: "monthly", label: "Monthly" },
        { value: "yearly", label: "Yearly" },
      ],
      monthly: {
        rows: [
          { label: "Next Charge Value", value: "$ 200" },
          { label: "Subtotal", value: "$ 3.000", suffix: "per month" },
        ],
        total: { value: "$ 3.000", suffix: "per year" },
      },
      yearly: {
        rows: [
          { label: "Next Charge Value", value: "$ 200" },
          { label: "Subtotal", value: "$ 3.000", suffix: "per month" },
          { label: "Yearly Discount", value: "$ 2.200", suffix: "per month" },
        ],
        total: { value: "$ 2.200", suffix: "per year" },
      },
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    headline: "I'm running production at scale",
    description: "Committed volume, SLAs and a named account team. Sales gets in touch.",
    price: "From $2.000/mo",
    severity: "primary",
    requiresPayment: true,
    upgrade: {
      lead: "Upgrade to {name} for committed volume, a named account team and contractual SLAs.",
      featuresTitle: "Upgrade features",
      features: [
        { title: "Unlimited Workloads" },
        { title: "1B Application requests", detail: "then as low as $0.60 per 1M" },
        { title: "500 hours Function compute time", detail: "then $0.12 per hour" },
        { title: "1 TB Real-Time Events Storage", detail: "then $0.08 per GB-month" },
        { title: "10 TB Object Storage", detail: "then as low as $0.015 per GB-month" },
        { title: "100 GB SQL Database Storage", detail: "then $0.50 per GB-month" },
        { title: "1B Firewall requests", detail: "then as low as $0.20 per 1M" },
        ...complianceFeatures,
        { title: "99.99% uptime SLA" },
        { title: "Named account team" },
      ],
      links: pricingLinks,
    },
    charge: {
      periods: [
        { value: "monthly", label: "Monthly" },
        { value: "yearly", label: "Yearly" },
      ],
      monthly: {
        rows: [
          { label: "Next Charge Value", value: "$ 2.000" },
          { label: "Subtotal", value: "$ 24.000", suffix: "per month" },
        ],
        total: { value: "$ 24.000", suffix: "per year" },
      },
      yearly: {
        rows: [
          { label: "Next Charge Value", value: "$ 2.000" },
          { label: "Subtotal", value: "$ 24.000", suffix: "per month" },
          { label: "Yearly Discount", value: "$ 4.800", suffix: "per month" },
        ],
        total: { value: "$ 19.200", suffix: "per year" },
      },
    },
  },
];

// No default: the entrance requires the user to pick one (see the Plan step). A
// pre-selected tier would be a contract nobody chose, agreed to by pressing
// Continue.
export const planFor = (id) => azionPlans.find((plan) => plan.id === id);

// The tier name a plan id resolves to, which is what is stored on the
// organization. Falls back to Hobby — the free tier is the only safe assumption
// to make on someone's behalf.
export const planNameFor = (id) => planFor(id)?.name ?? azionPlans[0].name;

// Whether choosing this plan has to go through the upgrade drawer before it
// counts. Reading it from the plan (rather than testing for `id !== 'hobby'`)
// is what keeps a future free or trial tier from silently demanding payment.
export const planRequiresPayment = (id) => Boolean(planFor(id)?.requiresPayment);

// The charge table for one plan and one billing period, ready to render.
export const chargeFor = (id, period) => planFor(id)?.charge?.[period] ?? null;

// The lead sentence, split around the `{name}` placeholder so the tier can be
// emphasised without the component owning the wording or the punctuation around
// it. Returns the text before and after the name.
export const leadPartsFor = (id) => {
  const plan = planFor(id);
  if (!plan?.upgrade?.lead) return null;
  const [before, after = ""] = plan.upgrade.lead.split("{name}");
  return { before, name: plan.name, after };
};
