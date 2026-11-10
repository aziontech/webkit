import herosparkColor from '@aziontech/webkit/assets/herospark-extended-color.svg'
import type { QuoteTabsItem } from '@aziontech/webkit/quote-tabs'

import { quotesLedBy } from '../../../solutions.js'

export const quoteWall = (lead: QuoteTabsItem): QuoteTabsItem[] => [
  lead,
  ...quotesLedBy('magalu').filter((quote: QuoteTabsItem) => quote.name !== lead.name)
]

export const HEROSPARK_STORAGE_PT_BR: QuoteTabsItem = {
  logo: herosparkColor,
  clientName: 'HeroSpark',
  text: '20% de redução de custos com Object Storage, combinando armazenamento confiável de arquivos com desempenho aprimorado na infraestrutura distribuída da Azion.',
  name: 'Mateus Leonardi',
  jobTitle: 'CTO na HeroSpark'
}

export const GPA_SECURITY_PT_BR: QuoteTabsItem = {
  mark: 'gpa',
  text: 'A Azion nos protegeu de ciberataques sofisticados e nos possibilitou modernizar nossa infraestrutura, reduzir custos e disponibilizar as melhores experiências de compra a milhões de clientes em toda a América Latina.',
  name: 'Allan Monteiro',
  jobTitle: 'CISO e Head of Technology no GPA'
}

export const GPA_ENTERPRISE_PT_BR: QuoteTabsItem = {
  ...GPA_SECURITY_PT_BR,
  jobTitle: 'CISO & Head of Technology'
}

export const GPA_SECURITY_EN: QuoteTabsItem = {
  mark: 'gpa',
  text: 'Azion shielded us from sophisticated cyberattacks and empowered us to modernize our infrastructure, reduce costs, and deliver the best shopping experiences to millions of customers.',
  name: 'Allan Monteiro',
  jobTitle: 'CISO and Head of Technology at GPA'
}
