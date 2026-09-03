// THE OPEN POSITIONS, read off the live page rather than retyped from it.
//
// Every string below is verbatim from
// https://www.azion.com/en/careers/jobs/?area=Engineering — the six Engineering roles that
// page listed on 2026-09-03, in the order it listed them, each one's meta line exactly as
// written (including the space after the slash in `Platform Engineering/ Application &
// Security`, which is the source's own), and each one's real posting id.
//
// It is a FILE rather than a const in the page for the reason every repeating band on this
// site is: this is the half a reviewer diffs against the extractor's `blocks.md`, and it
// should be readable as a list of strings with no markup around it. The page renders it
// through one `v-for`; nothing here is hand-authored twice.
//
// A LIST WITH A DATE ON IT. A careers page is the one kind of marketing page whose content
// is a live query — the source builds this list from an ATS at request time, and by the time
// anyone reads this file some of these roles will be closed. That is a property of the
// SOURCE, not a defect here: this app is a design reference, so what it must reproduce is the
// page's shape and language, and the snapshot is dated so nobody mistakes it for a feed.

/** Where a posting lives. The source's hrefs are site-relative; ours resolve to the real page. */
const POSTING = 'https://www.azion.com/en/careers/job/?id='

/** The area the source page is filtered to (`?area=Engineering`), and the label it prints. */
export const CAREERS_AREA = 'Engineering'

// THE SOURCE'S TRAIL IS NOT HERE. It draws `Careers > Jobs` above the headline; this page
// does not, so the two segments are not carried as data either — an exported constant with no
// reader is the same drift as a rendered control with no job. Why the page drops it is stated
// where the decision lives, in AzionCareers.vue's header.

/**
 * The six roles. `meta` is one string on purpose: the source writes the department, the city,
 * the arrangement and the contract as a single pipe-separated line, and splitting it into four
 * fields here would be this file deciding what those fields ARE — a schema the source does not
 * state and one the next area's postings might not share.
 */
export const CAREERS_JOBS = [
  {
    title: 'Senior Platform Engineer',
    meta: 'Delivery Engineering | Porto Alegre | Hybrid | Full-time',
    href: `${POSTING}07f7d281-aaac-465b-bf69-a66d43e3e704`
  },
  {
    title: 'Senior Quality Automation Engineer',
    meta: 'Delivery Engineering | Porto Alegre | Hybrid | Full-time',
    href: `${POSTING}9bca9459-65bf-4088-ae95-435e4890a96f`
  },
  {
    title: 'Software Engineer (Go)',
    meta: 'Engineering | Porto Alegre | Hybrid | Full-time',
    href: `${POSTING}3c7c7e44-a6a0-4df5-a84f-987d9d4a2827`
  },
  {
    title: 'Software Engineer (Rust and/or C/C++)',
    meta: 'Platform Engineering/ Application & Security | Porto Alegre / São Paulo | Hybrid | Full-time',
    href: `${POSTING}35bd5800-ffab-4b88-92ae-be15e7012ee2`
  },
  {
    title: '[Talent Pool] Analista de Infraestrutura Senior',
    meta: 'SRE | Porto Alegre / São Paulo | Hybrid | Full-time',
    href: `${POSTING}5c864897-be91-45ed-9fdf-91e5e98b1f41`
  },
  {
    title: 'Software Engineer (Frontend)',
    meta: 'UX Engineering | Porto Alegre | Hybrid | Full-time',
    href: `${POSTING}4229ae16-3c02-4c97-8e26-35afc010e872`
  }
]
