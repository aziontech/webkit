import FeatureScroll from '../feature-scroll/feature-scroll.vue'
import FeatureTiles from '../feature-tiles/feature-tiles.vue'
import FeatureWidgets from '../feature-widgets/feature-widgets.vue'
import NetworkSection from '../network-section/network-section.vue'
import StatsBand from '../stats-band/stats-band.vue'
import UseCaseLinks from '../use-case-links/use-case-links.vue'
import UseCases from '../use-cases/use-cases.vue'
import { registry } from './registry'
import Sections from './sections.vue'

type CompoundSections = typeof Sections & {
  FeatureScroll: typeof FeatureScroll
  FeatureTiles: typeof FeatureTiles
  FeatureWidgets: typeof FeatureWidgets
  NetworkSection: typeof NetworkSection
  StatsBand: typeof StatsBand
  UseCaseLinks: typeof UseCaseLinks
  UseCases: typeof UseCases
  registry: typeof registry
}

const SectionsRoot = Object.assign(Sections, {
  FeatureScroll,
  FeatureTiles,
  FeatureWidgets,
  NetworkSection,
  StatsBand,
  UseCaseLinks,
  UseCases,
  registry
}) as CompoundSections

export default SectionsRoot
export { registry }
