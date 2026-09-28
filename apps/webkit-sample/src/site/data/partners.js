// THE PARTNERS PAGE'S REPEATING COPY, read off the live page rather than retyped from it.
//
// Every string below is verbatim from https://www.azion.com/en/partners/ as that page rendered
// it on 2026-09-23 — the three figures of its proof band, the three reasons under its section
// heading, and the forty roles and fifty-eight countries its two selects offer, each in the
// source's own order.
//
// It is a FILE rather than a const in the page for the reason every repeating band on this
// site is: this is the half a reviewer diffs against the extractor's `blocks.md`, and it should
// be readable as a list of strings with no markup around it.
//
// THE SOURCE'S OWN INCONSISTENCIES ARE KEPT. The third figure's caption opens lowercase
// (`availability, guaranteed by SLA`) where the other two are sentence case; the role list
// mixes hyphens with en-dashes in the C-level titles (`CDO - Chief Data Officer` but
// `CEO – Chief Executive Officer`); and the country list runs alphabetically only as far as
// `Venezuela`, after which four later additions are appended out of order. None of that is
// tidied — normalising it would be rewriting the page's content, and the content is the one
// half of this translation that does not get rewritten.
//
// CASE IS THE DOM'S, NOT THE PAINT'S. The source sets the three captions in `text-transform:
// uppercase`, so they READ as `DATACENTERS WORLDWIDE`. The verbatim string is the DOM's, and
// our own `text-overline-sm` uppercases it again on the way out — same render, honest source.

/**
 * The proof band's three figures, in the source's order.
 *
 * Split into `prefix` / `value` / `suffix` the way `big-numbers` reads them: the source paints
 * the `+` and the `%` as separate glyphs beside the figure, which is exactly that component's
 * qualifier-and-unit anatomy.
 */
export const PARTNER_FIGURES = [
  { prefix: '+', value: '100', label: 'Datacenters worldwide' },
  { prefix: '+', value: '3k', label: 'ASNs directly connected to the Azion network' },
  { value: '100', suffix: '%', label: 'availability, guaranteed by SLA' }
]

/** The three reasons under `Why you should be a partner of the Azion Marketplace?`. */
export const PARTNER_REASONS = [
  {
    title: 'Agile',
    description:
      'Run code and deploy in minutes. From prototype to enterprise scale with NoOps, just code.'
  },
  {
    title: 'Diverse Use Cases',
    description:
      'Fraud detection, authentication and authorization, bot mitigation, and facial recognition, utilizing technologies such as visual computing and artificial intelligence executed at the edge.'
  },
  {
    title: 'Cost-Effective',
    description: 'Pricing is based on the edge resources and/or private edge locations in use.'
  }
]

/**
 * The `Role` select's options, in the source's order.
 *
 * The label IS the value: the source's option values are its own form-backend codes, which this
 * sample has no reader for and would be inventing if it made some up.
 */
export const PARTNER_ROLES = [
  'Administrator',
  'Advisor',
  'Analyst',
  'Architect',
  'Assistant',
  'Auditor',
  'Buyer',
  'CDO - Chief Data Officer',
  'CDO - Chief Digital Officer',
  'CEO – Chief Executive Officer',
  'CFO – Chief Financial Officer',
  'CHRO – Chief Human Resources Officer',
  'CIO - Chief Information Officer',
  'CISO - Chief Information Security Officer',
  'CMO – Chief Marketing Officer',
  'Consultant',
  'Controller',
  'COO – Chief Operating Officer',
  'Coordinator',
  'CPO - Chief Product Owner',
  'CRO - Chief Revenue Officer',
  'CTO - Chief Technology Officer',
  'CXO - Chief Experience officer',
  'Dean',
  'Designer',
  'Developer',
  'Director',
  'Engineer',
  'Expert',
  'Founder',
  'Head',
  'Manager',
  'Owner',
  'Partner',
  'President',
  'Secretary',
  'Specialist',
  'Superintendent',
  'Supervisor',
  'Vice President'
].map((role) => ({ value: role, label: role }))

/** The `Country` select's options, in the source's order — see the note about it above. */
export const PARTNER_COUNTRIES = [
  'Angola',
  'Argentina',
  'Australia',
  'Belgium',
  'Bolivia',
  'Botswana',
  'Brazil',
  'Brunei',
  'Canada',
  'Cayman Islands',
  'Chile',
  'China',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Czech Republic',
  'Denmark',
  'Dominican Republic',
  'Ecuador',
  'El Salvador',
  'Estonia',
  'France',
  'Germany',
  'Guatemala',
  'Haiti',
  'Honduras',
  'India',
  'Israel',
  'Italy',
  'Japan',
  'Lebanon',
  'Luxembourg',
  'Mexico',
  'Mozambique',
  'Netherlands',
  'Nicaragua',
  'Norway',
  'Panama',
  'Paraguay',
  'Peru',
  'Poland',
  'Portugal',
  'Singapore',
  'Slovakia',
  'Spain',
  'Sweden',
  'Switzerland',
  'Taiwan',
  'Tunisia',
  'Turkey',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Venezuela',
  'Eswatini',
  'Ukraine',
  'Bulgaria',
  'Niger'
].map((country) => ({ value: country, label: country }))
