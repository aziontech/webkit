import ClientMosaic from '../client-mosaic/client-mosaic.vue'
import ClientMosaicColumns from '../client-mosaic-columns/client-mosaic-columns.vue'
import ClientQuotes from '../client-quotes/client-quotes.vue'
import ComplianceBadges from '../compliance-badges/compliance-badges.vue'
import FeatureScroll from '../feature-scroll/feature-scroll.vue'
import FeatureTiles from '../feature-tiles/feature-tiles.vue'
import FeatureWidgets from '../feature-widgets/feature-widgets.vue'
import InvestorMarks from '../investor-marks/investor-marks.vue'
import LogoWallQuote from '../logo-wall-quote/logo-wall-quote.vue'
import NetworkSection from '../network-section/network-section.vue'
import PhotoMarquee from '../photo-marquee/photo-marquee.vue'
import RecognitionMarquee from '../recognition-marquee/recognition-marquee.vue'
import StatsBand from '../stats-band/stats-band.vue'
import UseCaseLinks from '../use-case-links/use-case-links.vue'
import UseCases from '../use-cases/use-cases.vue'

export type SectionRegistry = {
  'client-mosaic': typeof ClientMosaic
  'client-mosaic-columns': typeof ClientMosaicColumns
  'client-quotes': typeof ClientQuotes
  'compliance-badges': typeof ComplianceBadges
  'feature-scroll': typeof FeatureScroll
  'feature-tiles': typeof FeatureTiles
  'feature-widgets': typeof FeatureWidgets
  'investor-marks': typeof InvestorMarks
  'logo-wall-quote': typeof LogoWallQuote
  'network-section': typeof NetworkSection
  'photo-marquee': typeof PhotoMarquee
  'recognition-marquee': typeof RecognitionMarquee
  'stats-band': typeof StatsBand
  'use-case-links': typeof UseCaseLinks
  'use-cases': typeof UseCases
}

export const registry: SectionRegistry = {
  'client-mosaic': ClientMosaic,
  'client-mosaic-columns': ClientMosaicColumns,
  'client-quotes': ClientQuotes,
  'compliance-badges': ComplianceBadges,
  'feature-scroll': FeatureScroll,
  'feature-tiles': FeatureTiles,
  'feature-widgets': FeatureWidgets,
  'investor-marks': InvestorMarks,
  'logo-wall-quote': LogoWallQuote,
  'network-section': NetworkSection,
  'photo-marquee': PhotoMarquee,
  'recognition-marquee': RecognitionMarquee,
  'stats-band': StatsBand,
  'use-case-links': UseCaseLinks,
  'use-cases': UseCases
}

export type SectionId = keyof SectionRegistry
