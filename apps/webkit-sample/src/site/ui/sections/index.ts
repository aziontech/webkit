import type { Component } from 'vue'

import CapabilityGrid from './CapabilityGrid.vue'
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
import Heroes from './Heroes.vue'
import HeroForm from './HeroForm.vue'
import ListingBrowser from './ListingBrowser.vue'
import ListingTable from './ListingTable.vue'
import LogoWallQuote from './LogoWallQuote.vue'
import MediaSplitBand from './MediaSplitBand.vue'
import MediaSplitStack from './MediaSplitStack.vue'
import NetworkSection from './NetworkSection.vue'
import PhotoMarquee from './PhotoMarquee.vue'
import PlatformDirectory from './PlatformDirectory.vue'
import PricingPlans from './PricingPlans.vue'
import QuoteBand from './QuoteBand.vue'
import RecognitionMarquee from './RecognitionMarquee.vue'
import ResourceGrid from './ResourceGrid.vue'
import StatsBand from './StatsBand.vue'
import StickyScrollCode from './StickyScrollCode.vue'
import SubjectLibrary from './SubjectLibrary.vue'
import TemplateGallery from './TemplateGallery.vue'

export const SECTIONS: Record<string, Component> = {
  CapabilityGrid,
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
  HeroForm,
  Heroes,
  ListingBrowser,
  ListingTable,
  LogoWallQuote,
  MediaSplitBand,
  MediaSplitStack,
  NetworkSection,
  PhotoMarquee,
  PlatformDirectory,
  PricingPlans,
  QuoteBand,
  RecognitionMarquee,
  ResourceGrid,
  StatsBand,
  StickyScrollCode,
  SubjectLibrary,
  TemplateGallery
}

export const HERO_SECTIONS = new Set(['Heroes', 'HeroForm'])

export type { PageSection, SiteAction, SiteFaqItem, SiteLink, SiteTopic } from './types'
