import type { Component } from 'vue'

import ArchitectureTabs from './ArchitectureTabs.vue'
import ArticleBody from './ArticleBody.vue'
import ArticleCards from './ArticleCards.vue'
import ArticleHighlight from './ArticleHighlight.vue'
import ArticleIndex from './ArticleIndex.vue'
import CapabilityGrid from './CapabilityGrid.vue'
import ClientMosaic from './ClientMosaic.vue'
import ClientQuotes from './ClientQuotes.vue'
import CliTerminal from './CliTerminal.vue'
import ClosingCallToAction from './ClosingCallToAction.vue'
import CodeSplit from './CodeSplit.vue'
import CompareCompetitors from './CompareCompetitors.vue'
import ComparePlans from './ComparePlans.vue'
import CompareSupportTiers from './CompareSupportTiers.vue'
import ComplianceBadges from './ComplianceBadges.vue'
import ConsolePanel from './ConsolePanel.vue'
import FaqSection from './FaqSection.vue'
import FeatureScroll from './FeatureScroll.vue'
import FeatureTabs from './FeatureTabs.vue'
import FeatureTiles from './FeatureTiles.vue'
import FeatureWidgets from './FeatureWidgets.vue'
import Heroes from './Heroes.vue'
import HeroForm from './HeroForm.vue'
import HeroWithOpening from './HeroWithOpening.vue'
import IntegrationCode from './IntegrationCode.vue'
import InvestorMarks from './InvestorMarks.vue'
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
import StoryLibrary from './StoryLibrary.vue'
import SubjectLibrary from './SubjectLibrary.vue'
import TemplateGallery from './TemplateGallery.vue'
import UseCases from './UseCases.vue'

export const SECTIONS: Record<string, Component> = {
  ArchitectureTabs,
  ArticleBody,
  ArticleCards,
  ArticleHighlight,
  ArticleIndex,
  CapabilityGrid,
  ClientMosaic,
  ClientQuotes,
  CliTerminal,
  ClosingCallToAction,
  CodeSplit,
  CompareCompetitors,
  ComparePlans,
  CompareSupportTiers,
  ComplianceBadges,
  ConsolePanel,
  FaqSection,
  FeatureScroll,
  FeatureTabs,
  FeatureTiles,
  FeatureWidgets,
  Heroes,
  HeroForm,
  HeroWithOpening,
  IntegrationCode,
  InvestorMarks,
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
  StoryLibrary,
  SubjectLibrary,
  TemplateGallery,
  UseCases
}

export const HERO_SECTIONS = new Set([
  'ArticleBody',
  'Heroes',
  'HeroForm',
  'HeroWithOpening',
  'PricingPlans'
])

export type { PageSection, SiteAction, SiteFaqItem, SiteLink, SiteTopic } from './types'
