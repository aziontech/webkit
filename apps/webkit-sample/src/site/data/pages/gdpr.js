import { ASK_AI_LINKS, GDPR_FAQ } from '../gdpr.js'

export const GDPR_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-carousel',
    title: 'GDPR',
    description: 'Azion is GDPR compliant. We have made it a priority to protect your data.'
  },
  {
    section: 'IntroBand',
    kind: 'tools',
    title: 'Ask AI to explain',
    description: 'Get a concise, human-readable summary of this security page.',
    actions: ASK_AI_LINKS.map((tool) => ({
      label: tool.label,
      href: tool.href,
      kind: 'secondary',
      size: 'small',
      icon: 'pi pi-sparkles',
      external: true
    }))
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
