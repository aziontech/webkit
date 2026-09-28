// THE OPEN POSITIONS AND THEIR FILTERS, read off the live page rather than retyped from it.
//
// Source: https://www.azion.com/en/careers/jobs/ — the unfiltered listing, read on 2026-09-24.
// Every string below is verbatim from it. The postings came from the rendered page; the FILTER
// CONTRACT came from the page's own island payload, which is the only place it exists (below).
//
// ── THE FILTERS ARE THE SOURCE'S, NOT OURS ──
//
// The live page reserves a 240px sticky rail for an area/location filter and renders NOTHING in
// it — the `job-table` island never hydrates, so what ships is a hole beside the list. An
// earlier pass of this translation therefore left the control out, on the rule that a page may
// not invent a control its source does not render.
//
// It is in the source. The island's `props` attribute carries the whole contract server-side,
// and that payload is as much the page's stated content as its DOM is:
//
//   areas        All areas · Engineering · Marketing · Revenue · Operations · Security
//   locations    All locations · Palo Alto, USA · São Paulo, Brazil · Porto Alegre, Brazil ·
//                Mexico City, Mexico · Remote
//   t            areas: `Areas`  ·  selectLocation: `Select Location`  ·  buttonText: `Read more`
//   emptyState   `Nothing here yet` + its description and its `View all open positions` action
//
// So every option label, every field label and every line of the no-results state below is a
// source string. Nothing here was written for this page. What our version adds is that the
// control WORKS — the source's own contract, hydrated.
//
// A LIST WITH A DATE ON IT. A careers page is the one kind of marketing page whose content is a
// live query — the source builds this list from an ATS at request time, and by the time anyone
// reads this file some of these roles will be closed. That is a property of the SOURCE, not a
// defect here: this app is a design reference, so what it must reproduce is the page's shape and
// language, and the snapshot is dated so nobody mistakes it for a feed.

/** Where a posting lives. The source's hrefs are site-relative; ours resolve to the real page. */
const POSTING = 'https://www.azion.com/en/careers/job/?id='

/**
 * The area filter's options, in the source's order. `All` is the source's own reset value, and
 * its label is the source's own `All areas` — not a placeholder this file made up.
 */
export const CAREERS_AREAS = [
  { value: 'All', label: 'All areas' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Revenue', label: 'Revenue' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Security', label: 'Security' }
]

/**
 * The location filter's options, in the source's order. The label and the value differ here
 * because the source's do: it prints `Palo Alto, USA` and matches on `Palo Alto`. Two of these
 * (`Ciudad de Mexico`, `Remote`) match no posting in this snapshot — that is the source's list,
 * not an oversight, and it is what makes the no-results state below reachable.
 */
export const CAREERS_LOCATIONS = [
  { value: 'All', label: 'All locations' },
  { value: 'Palo Alto', label: 'Palo Alto, USA' },
  { value: 'São Paulo', label: 'São Paulo, Brazil' },
  { value: 'Porto Alegre', label: 'Porto Alegre, Brazil' },
  { value: 'Ciudad de Mexico', label: 'Mexico City, Mexico' },
  { value: 'Remote', label: 'Remote' }
]

/** The two fields' labels and the row action's label, all from the island's `t` block. */
export const CAREERS_LABELS = {
  areas: 'Areas',
  location: 'Select Location',
  readMore: 'Read more'
}

/** What the source says when a filter pair matches nothing. Verbatim, including the action. */
export const CAREERS_EMPTY = {
  title: 'Nothing here yet',
  description: 'At this time, we do not have any open positions that match your search criteria.',
  action: 'View all open positions'
}

/**
 * THE VALUE THE FILTERS REST AT. The source's own reset value for both fields, so the page has
 * one name for "no filter applied" instead of an empty string in the view and `All` in the data.
 */
export const CAREERS_ALL = 'All'

/**
 * Which locations a posting is open in, read out of its own meta line rather than stored beside
 * it. The source writes the location as the second pipe-separated field and separates two cities
 * with a slash (`Porto Alegre / São Paulo`), so the facet is DERIVED from the verbatim string —
 * one copy of the fact, and a filter that cannot drift from the line the row prints.
 */
export function jobLocations(job) {
  return job.meta
    .split('|')[1]
    .split('/')
    .map((location) => location.trim())
}

/**
 * The posting's id, read out of its own `href` rather than stored beside it — the same one-copy
 * rule `jobLocations` follows. It is the source's own ATS id, and it is what routes this app's
 * internal posting page, so a row's link and the page it opens cannot name two different jobs.
 */
export function jobId(job) {
  return job.href.slice(job.href.indexOf('id=') + 3)
}

/**
 * The four facets the meta line states, in its own order: department, location, arrangement,
 * contract. Derived from the verbatim string for the same reason as the locations above, so the
 * posting page's header row and the list row can never disagree about a posting.
 */
export function jobFacets(job) {
  return job.meta.split('|').map((facet) => facet.trim())
}

/**
 * The 23 roles, in the source's order, grouped by the `area` it files each one under — the same
 * five areas the filter offers. `meta` is one string on purpose: the source writes the
 * department, the city, the arrangement and the contract as a single pipe-separated line, and
 * splitting it into four fields here would be this file deciding what those fields ARE.
 */
export const CAREERS_JOBS = [
  {
    area: 'Engineering',
    title: 'Senior Platform Engineer',
    meta: 'Delivery Engineering | Porto Alegre | Hybrid | Full-time',
    href: `${POSTING}07f7d281-aaac-465b-bf69-a66d43e3e704`
  },
  {
    area: 'Engineering',
    title: 'Senior Quality Automation Engineer',
    meta: 'Delivery Engineering | Porto Alegre | Hybrid | Full-time',
    href: `${POSTING}9bca9459-65bf-4088-ae95-435e4890a96f`
  },
  {
    area: 'Engineering',
    title: 'Software Engineer (Go)',
    meta: 'Engineering | Porto Alegre | Hybrid | Full-time',
    href: `${POSTING}3c7c7e44-a6a0-4df5-a84f-987d9d4a2827`
  },
  {
    area: 'Engineering',
    title: 'Software Engineer (Rust and/or C/C++)',
    meta: 'Platform Engineering/ Application & Security | Porto Alegre / São Paulo | Hybrid | Full-time',
    href: `${POSTING}35bd5800-ffab-4b88-92ae-be15e7012ee2`
  },
  {
    area: 'Engineering',
    title: '[Talent Pool] Analista de Infraestrutura Senior',
    meta: 'SRE | Porto Alegre / São Paulo | Hybrid | Full-time',
    href: `${POSTING}5c864897-be91-45ed-9fdf-91e5e98b1f41`
  },
  {
    area: 'Engineering',
    title: 'Software Engineer (Frontend)',
    meta: 'UX Engineering | Porto Alegre | Hybrid | Full-time',
    href: `${POSTING}4229ae16-3c02-4c97-8e26-35afc010e872`
  },
  {
    area: 'Marketing',
    title: 'Chief Marketing Officer (CMO)',
    meta: 'Executive | Palo Alto | Hybrid | Full-time',
    href: `${POSTING}53abb6b7-0379-4c58-ad08-639c3ceca0c5`
  },
  {
    area: 'Marketing',
    title: 'Events Senior Analyst',
    meta: 'Strategic Marketing | São Paulo | Hybrid | Full-time',
    href: `${POSTING}d803eea5-2ef7-44eb-a46c-208045d33e66`
  },
  {
    area: 'Marketing',
    title: 'Head of Growth',
    meta: 'Growth Marketing | Palo Alto | Hybrid | Full-time',
    href: `${POSTING}079e42ed-a005-4d81-bed8-e9e3c23bc2b5`
  },
  {
    area: 'Revenue',
    title: 'Account Executive (Mid-Market/Hunter)',
    meta: 'Sales | São Paulo | Hybrid | Full-time',
    href: `${POSTING}7ebc1cbe-9f49-413a-a3a8-e338a83913ca`
  },
  {
    area: 'Revenue',
    title: 'Head of Sales',
    meta: 'Sales | São Paulo | Hybrid | Full-time',
    href: `${POSTING}42c8e032-82b4-4a2a-9cdb-c26c939b1e64`
  },
  {
    area: 'Revenue',
    title: 'Key Account Executive (Hunter/Farmer)',
    meta: 'Sales | São Paulo | Hybrid | Full-time',
    href: `${POSTING}6110a2e8-f7ed-433c-91ab-c47ecc4907cc`
  },
  {
    area: 'Revenue',
    title: 'Sales Director',
    meta: 'Sales | São Paulo | Hybrid | Full-time',
    href: `${POSTING}1d3badfa-bbed-4fe9-b822-b6ae78ffb816`
  },
  {
    area: 'Revenue',
    title: 'Sales Manager',
    meta: 'Sales | São Paulo | Hybrid | Full-time',
    href: `${POSTING}e6b7ff5d-51b8-419a-8659-7237ce27b3ba`
  },
  {
    area: 'Revenue',
    title: 'Senior Sales Manager',
    meta: 'Sales | São Paulo | Hybrid | Full-time',
    href: `${POSTING}d9473cb2-df52-4564-9544-ca662d32b0bb`
  },
  {
    area: 'Revenue',
    title: 'Senior Solutions Engineer',
    meta: 'Sales | São Paulo | Hybrid | Full-time',
    href: `${POSTING}0af3c6c1-c1e3-4075-adb6-4d6bb58282ab`
  },
  {
    area: 'Revenue',
    title: 'Technical Support Engineer [English Speaker]',
    meta: 'Customer Support | Porto Alegre | Hybrid | Full-time',
    href: `${POSTING}8a1631d6-d092-4f23-b6fb-46a99a214ad2`
  },
  {
    area: 'Revenue',
    title: 'Technical Support Engineer [Spanish Speaker]',
    meta: 'Customer Success | Porto Alegre / São Paulo | Hybrid | Full-time',
    href: `${POSTING}f55c6b6b-25d3-46ff-816e-f77890e1fb90`
  },
  {
    area: 'Revenue',
    title: 'VP of Sales',
    meta: 'Sales | São Paulo | Hybrid | Full-time',
    href: `${POSTING}e50e6bd6-4b31-4d18-9496-1efccce1e2d2`
  },
  {
    area: 'Revenue',
    title: '[Banco de Talentos] Business Development Representative (BDR)',
    meta: 'Business Development | Porto Alegre / São Paulo | Hybrid | Full-time',
    href: `${POSTING}42cba0ba-b03d-4dd4-899b-9c3cb814e23a`
  },
  {
    area: 'Operations',
    title: 'Analista Financeiro',
    meta: 'Controllership/ Account Receivable | Porto Alegre | Hybrid | Full-time',
    href: `${POSTING}7d1c7dcb-d061-4332-af37-0f1b073f15a8`
  },
  {
    area: 'Security',
    title: 'Defensive Security Engineer (SOC)',
    meta: 'Cybersecurity | Porto Alegre / São Paulo | On-Site | Full-time',
    href: `${POSTING}e4fa0986-4f1a-4d94-8385-558b1a082aaa`
  },
  {
    area: 'Security',
    title: 'GRC Analyst (Governance, Risk & Compliance)',
    meta: 'Compliance and Corporate IT | Porto Alegre / São Paulo | Hybrid | Full-time',
    href: `${POSTING}9a51e4b4-4b19-4c99-b4ed-654329606b69`
  }
]
