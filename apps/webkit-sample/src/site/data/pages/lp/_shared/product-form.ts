import type { QuoteTabsItem } from '@aziontech/webkit/quote-tabs'

import type { PageSection, SiteAction, SiteTopic } from '../../../../ui/sections'
import type { LandingPage } from '..'
import { quoteWall } from './lead-quotes'

type Props = Record<string, unknown>

export interface ProductFormPage {
  lang: LandingPage['lang']
  source: string
  /** HeroForm props: copy, form fields and labels, client strip, and highlights beside the form; trials add a Start free action. */
  hero: Props & { title: string }
  /** Sections right under the hero, such as a card grid of the product's pillars. */
  overview?: PageSection[]
  /** MediaSplitStack props: how the product works, one band per mechanism. */
  features: Props & { eyebrow: string; title: string; bands: Props[] }
  /** The client the quote wall opens on, in the page's language. */
  leadQuote: QuoteTabsItem
  /** ClientQuotes props other than the quotes. */
  quotes?: { ariaLabel?: string; actions?: SiteAction[] }
  /** Product-specific proof between the quotes and the use cases: code, stats, badges, awards. */
  proof?: PageSection[]
  /** UseCases props. */
  useCases: { title: string; description: string; action: SiteAction; items: SiteTopic[] }
  faq: { title: string; items: Props[] }
  /** ClosingCallToAction props for the primary register: Start free first, then Talk to a specialist. */
  closing: { title: string; description: string; actions: SiteAction[] }
}

export const productFormPage = (page: ProductFormPage): LandingPage => ({
  lang: page.lang,
  source: page.source,
  sections: [
    { section: 'HeroForm', ...page.hero, formTitle: '' },
    ...(page.overview ?? []),
    { section: 'MediaSplitStack', ...page.features },
    {
      section: 'ClientQuotes',
      quotes: quoteWall(page.leadQuote),
      ...page.quotes
    },
    ...(page.proof ?? []),
    { section: 'UseCases', ...page.useCases },
    { section: 'FaqSection', ...page.faq },
    { section: 'ClosingCallToAction', kind: 'primary', ...page.closing }
  ]
})
