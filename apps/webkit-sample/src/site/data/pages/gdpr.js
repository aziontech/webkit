import { GDPR_FAQ } from '../gdpr.js'

export const GDPR_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-carousel',
    title: 'GDPR',
    description: 'Azion is GDPR compliant. We have made it a priority to protect your data.'
  },
  {
    section: 'FaqSection',
    items: GDPR_FAQ.map((item) => ({
      value: item.id,
      question: item.question,
      answer: '',
      body: item.body
    }))
  },
  { section: 'ClosingCallToAction', kind: 'frame' }
]
