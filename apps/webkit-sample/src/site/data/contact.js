// THE CONTACT PAGE'S REPEATING COPY, read off the live page rather than retyped from it.
//
// Every string below is verbatim from https://www.azion.com/en/contact/ as that page rendered
// it on 2026-09-03 — the four offices in the order it lists them, each address line exactly as
// written, and the forty roles its `Role` select offers, in its own order.
//
// It is a FILE rather than a const in the page for the reason every repeating band on this
// site is: this is the half a reviewer diffs against the extractor's `blocks.md`, and it
// should be readable as a list of strings with no markup around it. The page renders each
// list through one `v-for`; nothing here is hand-authored twice.
//
// THE SOURCE'S OWN INCONSISTENCIES ARE KEPT. Two offices are both labelled `Brazil` (São Paulo
// and Porto Alegre are distinguished only by their address lines); the two Brazilian offices
// publish the SAME phone number; and the role list mixes hyphens with en-dashes in the C-level
// titles (`CDO - Chief Data Officer` but `CEO – Chief Executive Officer`). None of that is
// tidied here — normalising it would be rewriting the page's content, and the content is the
// one half of this translation that does not get rewritten.

/**
 * The four offices, in the source's order.
 *
 * `lines` is the address as the source breaks it — one entry per rendered paragraph, so the
 * page never has to re-split a joined string. `phone` is the printed label and `phoneHref`
 * the `tel:` target the source links it to; the two differ because a dialable number carries
 * no spaces or punctuation. `map` is the source's own maps URL for that office.
 */
export const CONTACT_OFFICES = [
  {
    country: 'USA',
    lines: ['425 Page Mill Rd, Suite 200', 'Palo Alto, California, USA, 94306'],
    phone: '+1 833-332-9466',
    phoneHref: 'tel:+18333329466',
    map: 'https://maps.app.goo.gl/irZ9MKYpYWcZ1nGW6'
  },
  {
    country: 'Mexico',
    lines: [
      '505 Av. Santa Fe',
      'Col. Cruz Manca , Cuajimalpa de Morelos, Mexico City, Mexico, 01219'
    ],
    phone: '+52 800 872 0565',
    phoneHref: 'tel:+528008720565',
    map: 'https://maps.app.goo.gl/JNANNz13nTFqGn4t7'
  },
  {
    country: 'Brazil',
    lines: ['R. Butantã, 194 - 4th floor', 'São Paulo, SP, Brazil, 05424-000'],
    phone: '0800 883 6313',
    phoneHref: 'tel:08008836313',
    map: 'https://maps.app.goo.gl/dyXFyANbdeu1PkWX6'
  },
  {
    country: 'Brazil',
    lines: ['Praça Dr. Maurício Cardoso, 71 - 4th floor', 'Porto Alegre, RS, Brazil, 90570-010'],
    phone: '0800 883 6313',
    phoneHref: 'tel:08008836313',
    map: 'https://www.google.com/maps/place/Azion+Technologies/@-30.0230879,-51.2028172,19.29z/data=!4m13!1m7!3m6!1s0x951979b79c535261:0xf7588aa4c46cd60c!2sPra%C3%A7a+Dr.+Maur%C3%ADcio+Cardoso,+71+-+Moinhos+de+Vento,+Porto+Alegre+-+RS,+90570-020!3b1!8m2!3d-30.0230911!4d-51.2027874!3m4!1s0x0:0x1ef1847a8ae37682!8m2!3d-30.0228381!4d-51.2027011'
  }
]

/**
 * The `Role` select's options, in the source's order.
 *
 * The label IS the value: the source's option values are its own form-backend codes, which
 * this sample has no reader for and would be inventing if it made some up. Keying each option
 * by its own label keeps the list one column of verbatim strings.
 */
export const CONTACT_ROLES = [
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

/**
 * The trust strip's eleven marks, in the source's order.
 *
 * The same eleven the home page states, under this app's registry names — `Itaú` for the
 * source's `Banco Itaú`, `América Móvil` for `America Movil`, `GPA` for `Grupo Pão de Açucar`.
 * Named rather than passed as the whole registry: the registry holds every client this app
 * knows, and this row is the eleven the contact page shows.
 */
export const CONTACT_TRUST_MARKS = [
  'Global Fashion Group',
  'HeroSpark',
  'Itaú',
  'NZN',
  'Netshoes',
  'Caixa',
  'Agibank',
  'Prime Video',
  'América Móvil',
  'GPA',
  'Fourbank'
]
