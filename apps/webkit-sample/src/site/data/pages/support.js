import { quotesLedBy } from '../solutions.js'
import {
  SUPPORT_CLOSING,
  SUPPORT_FAQ,
  SUPPORT_HERO,
  SUPPORT_MARKS,
  SUPPORT_PRICING_LINK,
  SUPPORT_REASONS
} from '../support.js'

const linkInto = (item, link) => {
  const [answer, answerAfter] = item.answer.split(link.label)
  return answerAfter === undefined ? item : { ...item, answer, link, answerAfter }
}

export const SUPPORT_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-band',
    eyebrow: SUPPORT_HERO.eyebrow,
    eyebrowPrefix: '//',
    title: SUPPORT_HERO.title,
    description: SUPPORT_HERO.description,
    actions: [
      { label: 'Start Free', href: '/signup', kind: 'secondary' },
      { label: 'Contact Us', href: '/site/contact', kind: 'outlined', trailing: true }
    ],
    carouselLabel: SUPPORT_HERO.carouselLabel,
    carouselMarks: SUPPORT_MARKS
  },
  { section: 'CapabilityGrid', items: SUPPORT_REASONS },
  { section: 'CompareSupportTiers' },
  {
    section: 'ClientQuotes',
    quotes: quotesLedBy('contabilizei'),
    actions: [{ label: 'Clients', href: '/site/success-cases', kind: 'secondary', trailing: true }]
  },
  {
    section: 'FaqSection',
    items: SUPPORT_FAQ.map((item) =>
      item.value === 'pricing' ? linkInto(item, SUPPORT_PRICING_LINK) : item
    )
  },
  {
    section: 'ClosingCallToAction',
    eyebrow: SUPPORT_CLOSING.eyebrow,
    title: SUPPORT_CLOSING.title,
    description: SUPPORT_CLOSING.description,
    actions: [
      {
        label: SUPPORT_CLOSING.action.label,
        href: SUPPORT_CLOSING.action.to,
        kind: 'secondary',
        trailing: true
      }
    ],
    aside: { label: SUPPORT_CLOSING.aside.label, href: SUPPORT_CLOSING.aside.to }
  }
]
