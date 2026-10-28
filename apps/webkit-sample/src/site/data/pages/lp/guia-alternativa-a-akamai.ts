import { AKAMAI_GUIDE } from '../../alternative-guides'
import { alternativeGuidePage } from '../alternative-guide'
import type { LandingPage } from '.'

export default {
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/guia-alternativa-a-akamai/',
  sections: alternativeGuidePage(AKAMAI_GUIDE)
} satisfies LandingPage
