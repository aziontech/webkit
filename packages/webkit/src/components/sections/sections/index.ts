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
import { registry } from './registry'
import Sections from './sections.vue'

type CompoundSections = typeof Sections & {
  ClientMosaic: typeof ClientMosaic
  ClientMosaicColumns: typeof ClientMosaicColumns
  ClientQuotes: typeof ClientQuotes
  ComplianceBadges: typeof ComplianceBadges
  FeatureScroll: typeof FeatureScroll
  FeatureTiles: typeof FeatureTiles
  FeatureWidgets: typeof FeatureWidgets
  InvestorMarks: typeof InvestorMarks
  LogoWallQuote: typeof LogoWallQuote
  NetworkSection: typeof NetworkSection
  PhotoMarquee: typeof PhotoMarquee
  RecognitionMarquee: typeof RecognitionMarquee
  StatsBand: typeof StatsBand
  UseCaseLinks: typeof UseCaseLinks
  UseCases: typeof UseCases
  registry: typeof registry
}

const SectionsRoot = Object.assign(Sections, {
  ClientMosaic,
  ClientMosaicColumns,
  ClientQuotes,
  ComplianceBadges,
  FeatureScroll,
  FeatureTiles,
  FeatureWidgets,
  InvestorMarks,
  LogoWallQuote,
  NetworkSection,
  PhotoMarquee,
  RecognitionMarquee,
  StatsBand,
  UseCaseLinks,
  UseCases,
  registry
}) as CompoundSections

export default SectionsRoot
export { registry }
