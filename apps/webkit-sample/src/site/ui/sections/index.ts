import type { Component } from 'vue'

import CapabilityGrid from './CapabilityGrid.vue'
import CardCarousel from './CardCarousel.vue'
import ClientMosaic from './ClientMosaic.vue'
import ClientQuotes from './ClientQuotes.vue'
import ClosingCallToAction from './ClosingCallToAction.vue'
import CodeSplit from './CodeSplit.vue'
import ComparePlans from './ComparePlans.vue'
import CompareSupportTiers from './CompareSupportTiers.vue'
import ComparisonTable from './ComparisonTable.vue'
import ComplianceBadges from './ComplianceBadges.vue'
import FaqSection from './FaqSection.vue'
import FeatureTabs from './FeatureTabs.vue'
import FeatureTiles from './FeatureTiles.vue'
import GuaranteeColumns from './GuaranteeColumns.vue'
import HeroForm from './HeroForm.vue'
import Heroes from './Heroes.vue'
import IllustratedCards from './IllustratedCards.vue'
import IntroBand from './IntroBand.vue'
import LogoWallQuote from './LogoWallQuote.vue'
import MediaSplitBand from './MediaSplitBand.vue'
import MediaSplitStack from './MediaSplitStack.vue'
import NetworkSection from './NetworkSection.vue'
import PlatformDirectory from './PlatformDirectory.vue'
import PricingPlans from './PricingPlans.vue'
import QuoteBand from './QuoteBand.vue'
import RecognitionMarquee from './RecognitionMarquee.vue'
import ResourceGrid from './ResourceGrid.vue'
import StatsBand from './StatsBand.vue'
import StickyScrollCode from './StickyScrollCode.vue'
import TemplateGallery from './TemplateGallery.vue'
import UseCaseLinks from './UseCaseLinks.vue'

export const SECTIONS: Record<string, Component> = {
  CapabilityGrid,
  CardCarousel,
  ClientMosaic,
  ClientQuotes,
  ClosingCallToAction,
  CodeSplit,
  ComparePlans,
  CompareSupportTiers,
  ComparisonTable,
  ComplianceBadges,
  FaqSection,
  FeatureTabs,
  FeatureTiles,
  GuaranteeColumns,
  HeroForm,
  Heroes,
  IllustratedCards,
  IntroBand,
  LogoWallQuote,
  MediaSplitBand,
  MediaSplitStack,
  NetworkSection,
  PlatformDirectory,
  PricingPlans,
  QuoteBand,
  RecognitionMarquee,
  ResourceGrid,
  StatsBand,
  StickyScrollCode,
  TemplateGallery,
  UseCaseLinks
}

export const HERO_SECTIONS = new Set(['Heroes', 'HeroForm'])

export type { PageSection, SiteAction, SiteFaqItem, SiteLink, SiteTopic } from './types'
