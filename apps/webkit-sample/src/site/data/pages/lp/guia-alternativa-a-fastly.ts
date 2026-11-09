import { FASTLY_GUIDE } from '../../alternative-guides'
import { alternativeGuidePage } from '../alternative-guide'
import type { LandingPage } from '.'

export default {
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/guia-alternativa-a-fastly/',
  sections: alternativeGuidePage(FASTLY_GUIDE)
} satisfies LandingPage
