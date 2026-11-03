import { F5_GUIDE } from '../../alternative-guides'
import { alternativeGuidePage } from '../alternative-guide'
import type { LandingPage } from '.'

export default {
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/guia-alternativa-a-f5/',
  sections: alternativeGuidePage(F5_GUIDE)
} satisfies LandingPage
