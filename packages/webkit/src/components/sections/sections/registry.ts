import FeatureScroll from '../feature-scroll/feature-scroll.vue'
import FeatureTiles from '../feature-tiles/feature-tiles.vue'
import FeatureWidgets from '../feature-widgets/feature-widgets.vue'
import NetworkSection from '../network-section/network-section.vue'
import StatsBand from '../stats-band/stats-band.vue'
import UseCaseLinks from '../use-case-links/use-case-links.vue'
import UseCases from '../use-cases/use-cases.vue'

export type SectionRegistry = {
  'feature-scroll': typeof FeatureScroll
  'feature-tiles': typeof FeatureTiles
  'feature-widgets': typeof FeatureWidgets
  'network-section': typeof NetworkSection
  'stats-band': typeof StatsBand
  'use-case-links': typeof UseCaseLinks
  'use-cases': typeof UseCases
}

export const registry: SectionRegistry = {
  'feature-scroll': FeatureScroll,
  'feature-tiles': FeatureTiles,
  'feature-widgets': FeatureWidgets,
  'network-section': NetworkSection,
  'stats-band': StatsBand,
  'use-case-links': UseCaseLinks,
  'use-cases': UseCases
}

export type SectionId = keyof SectionRegistry
