// The public website's routes — the azion.com-style landing pages and the
// developer documentation, everything that renders in SiteLayout's sidebar-less
// shell rather than the console's. Mounted under `/site`.
//
// THE URL SAYS WHAT KIND OF PAGE IT IS. A page family with more than one member owns a
// segment, and the segment's own path is that family's index: `/site/products` lists the
// products and `/site/products/cache` argues one of them; `/site/solutions` lists the
// solutions and `/site/solutions/retail` argues one. `/site/guides` holds the campaign
// landing pages, which are neither. Singletons the site reaches straight from its nav —
// pricing, careers, contact, learning, partners — stay one segment deep, because a
// `/site/company/careers` that holds exactly one page names a group that does not exist.
//
// Moving a page changes its URL, and this sample is deployed, so every path this tree
// used to serve is kept as a redirect at the bottom of the file rather than 404'd.
//
// The Hub lives under the same `/site` prefix but is its own area (its own shell,
// its own navigation): see ./hub.routes.js.

import { agentBySlug } from '@site/docs/lib/docs-agent-setup.js'
import { blogArticle } from '@site/data/blog-articles.js'
import { successCaseArticle } from '@site/data/success-case-articles.js'
import { hasDocsPage } from '@site/docs/lib/docs-pages.js'
import {
  AKAMAI_GUIDE,
  AWS_GUIDE,
  CLOUDFLARE_GUIDE,
  FASTLY_GUIDE
} from '@site/data/alternative-guides'
import LandingAlternativeGuide from '@site/views/LandingAlternativeGuide.vue'
import AzionDocs from '@site/docs/views/AzionDocs.vue'
import AzionDocsAgentPage from '@site/docs/views/AzionDocsAgentPage.vue'
import AzionDocsAgentSetup from '@site/docs/views/AzionDocsAgentSetup.vue'
import AzionDocsPage from '@site/docs/views/AzionDocsPage.vue'
import LandingAiInference from '@site/views/LandingAiInference.vue'
import LandingAiWorkloads from '@site/views/LandingAiWorkloads.vue'
import LandingApplicationAccelerator from '@site/views/LandingApplicationAccelerator.vue'
import LandingAzion from '@site/views/LandingAzion.vue'
import LandingAzionHeros from '@site/views/LandingAzionHeros.vue'
import LandingBlog from '@site/views/LandingBlog.vue'
import LandingBlogPost from '@site/views/LandingBlogPost.vue'
import LandingCache from '@site/views/LandingCache.vue'
import LandingCareers from '@site/views/LandingCareers.vue'
import LandingCareersHome from '@site/views/LandingCareersHome.vue'
import LandingCareersJob from '@site/views/LandingCareersJob.vue'
import LandingCompliance from '@site/views/LandingCompliance.vue'
import LandingComplianceEmbed from '@site/views/LandingComplianceEmbed.vue'
import LandingContact from '@site/views/LandingContact.vue'
import LandingFinancialServices from '@site/views/LandingFinancialServices.vue'
import LandingFunctions from '@site/views/LandingFunctions.vue'
import LandingGdpr from '@site/views/LandingGdpr.vue'
import LandingLearning from '@site/views/LandingLearning.vue'
import LandingOurNetwork from '@site/views/LandingOurNetwork.vue'
import LandingPartners from '@site/views/LandingPartners.vue'
import LandingPerformance from '@site/views/LandingPerformance.vue'
import LandingPricing from '@site/views/LandingPricing.vue'
import LandingProducts from '@site/views/LandingProducts.vue'
import LandingRetail from '@site/views/LandingRetail.vue'
import LandingSecurity from '@site/views/LandingSecurity.vue'
import LandingSolutions from '@site/views/LandingSolutions.vue'
import LandingStreaming from '@site/views/LandingStreaming.vue'
import LandingSuccessCasePost from '@site/views/LandingSuccessCasePost.vue'
import LandingSuccessCases from '@site/views/LandingSuccessCases.vue'
import LandingSupport from '@site/views/LandingSupport.vue'
import LandingTechnology from '@site/views/LandingTechnology.vue'
import LandingVercelAlternative from '@site/views/LandingVercelAlternative.vue'
import LandingWebApps from '@site/views/LandingWebApps.vue'
import LandingWorkloads from '@site/views/LandingWorkloads.vue'

// Every path this tree served before the pages were grouped. Kept so a link that is
// already out — a bookmark, a deployed URL, an ad — still lands on the page it named.
const MOVED = {
  '/site/functions': '/site/products/functions',
  '/site/application-accelerator': '/site/products/application-accelerator',
  '/site/cache': '/site/products/cache',
  '/site/ai-inference': '/site/products/ai-inference',
  '/site/workloads': '/site/products/workloads',
  '/site/our-network': '/site/products/our-network',
  '/site/financial-services': '/site/solutions/financial-services',
  '/site/web-apps': '/site/solutions/web-apps',
  '/site/technology': '/site/solutions/technology',
  '/site/retail': '/site/solutions/retail',
  '/site/vercel-alternative-guide': '/site/guides/vercel-alternative'
}

export const siteRoutes = [
  // Segregated marketing router: landing-page examples that render in the
  // sidebar-less SiteLayout (azion.com-style website nav + footer), separate
  // from the console app shell used by every other route.
  { path: '/site', redirect: '/site/home' },
  { path: '/site/home', name: 'site-home', component: LandingAzion },

  // ══ Products ══════════════════════════════════════════════════════════════════════
  // The catalogue, and one page per product under it. The index is the destination the
  // Products mega-menu has been describing: four groups over a hairline grid, with one
  // registered illustration per product, composed entirely from the marketing bands.
  { path: '/site/products', name: 'site-products', component: LandingProducts },
  // One product's argument, where /site/home is the platform's. The Products mega-menu's
  // Functions entry points here.
  { path: '/site/products/functions', name: 'site-functions', component: LandingFunctions },
  // The Products mega-menu's Application Accelerator entry.
  {
    path: '/site/products/application-accelerator',
    name: 'site-application-accelerator',
    component: LandingApplicationAccelerator
  },
  // The Products mega-menu's Cache entry.
  { path: '/site/products/cache', name: 'site-cache', component: LandingCache },
  // The Products mega-menu's AI Inference entry, a design prototype (Figma `Azion.com` node
  // 13031:161116).
  {
    path: '/site/products/ai-inference',
    name: 'site-ai-inference',
    component: LandingAiInference
  },
  // A product page whose hero is the product: the workload's own deployment topology, drawn
  // with the diagram the console renders, dissolved into the band by a dither ramp.
  { path: '/site/products/workloads', name: 'site-workloads', component: LandingWorkloads },
  // The one composed entirely from the MARKETING components rather than hand-built bricks —
  // the Products mega-menu's Our Network entry.
  { path: '/site/products/our-network', name: 'site-our-network', component: LandingOurNetwork },

  // ══ Solutions ═════════════════════════════════════════════════════════════════════
  // The index, and one page per solution under it. A solution page argues a NEED or an
  // INDUSTRY, where a product page argues one product and /site/home argues
  // the platform. The index says which is which and opens each of them; the Solutions
  // mega-menu's two group headings point at its `#needs` and `#industries` anchors.
  { path: '/site/solutions', name: 'site-solutions', component: LandingSolutions },
  // By INDUSTRIES. The Solutions mega-menu's Financial Services entry points here.
  {
    path: '/site/solutions/financial-services',
    name: 'site-financial-services',
    component: LandingFinancialServices
  },
  // By NEED. The Solutions mega-menu's `By Need › Web Apps` entry points here.
  { path: '/site/solutions/web-apps', name: 'site-web-apps', component: LandingWebApps },
  { path: '/site/solutions/ai', name: 'site-ai-workloads', component: LandingAiWorkloads },
  { path: '/site/solutions/performance', name: 'site-performance', component: LandingPerformance },
  { path: '/site/solutions/security', name: 'site-security', component: LandingSecurity },
  { path: '/site/solutions/streaming', name: 'site-streaming', component: LandingStreaming },
  // By INDUSTRIES: the technology sector. The Solutions mega-menu's
  // `By Industries › Technology` entry points here.
  { path: '/site/solutions/technology', name: 'site-technology', component: LandingTechnology },
  // By INDUSTRIES like Financial Services: the storefront argument. The Solutions mega-menu's
  // `By Industries › Retail` entry points here.
  { path: '/site/solutions/retail', name: 'site-retail', component: LandingRetail },

  // ══ Guides ════════════════════════════════════════════════════════════════════════
  // Campaign landing pages: not a product, a solution or the platform, but one migration's
  // argument. The site nav does not link them, because azion.com's does not either — a
  // guide is reached from a search result or an ad. One today, so the segment's own path
  // goes to it rather than to an index of one row.
  { path: '/site/guides', redirect: '/site/guides/vercel-alternative' },
  // The guide that maps a Vercel project onto Azion, and the capability matrix behind it.
  {
    path: '/site/guides/vercel-alternative',
    name: 'site-vercel-alternative-guide',
    component: LandingVercelAlternative
  },
  {
    path: '/site/guides/akamai-alternative',
    name: 'site-akamai-alternative-guide',
    component: LandingAlternativeGuide,
    props: { guide: AKAMAI_GUIDE }
  },
  {
    path: '/site/guides/aws-alternative',
    name: 'site-aws-alternative-guide',
    component: LandingAlternativeGuide,
    props: { guide: AWS_GUIDE }
  },
  {
    path: '/site/guides/cloudflare-alternative',
    name: 'site-cloudflare-alternative-guide',
    component: LandingAlternativeGuide,
    props: { guide: CLOUDFLARE_GUIDE }
  },
  {
    path: '/site/guides/fastly-alternative',
    name: 'site-fastly-alternative-guide',
    component: LandingAlternativeGuide,
    props: { guide: FASTLY_GUIDE }
  },

  // ══ The rest of the site ══════════════════════════════════════════════════════════
  // The pricing page in the same shell: the three tiers, the full feature matrix, and the
  // FAQ. The website nav's `Pricing` entry points here.
  { path: '/site/pricing', name: 'site-pricing', component: LandingPricing },
  { path: '/site/support', name: 'site-support', component: LandingSupport },
  { path: '/site/careers', name: 'site-careers', component: LandingCareersHome },
  // The careers listing in the same shell: a page whose content is a live ATS query rather
  // than an argument, so what it demonstrates is the frame doing the work — a hero with the
  // globe in it, and one ruled module holding an area label and its open positions.
  { path: '/site/careers/jobs', name: 'site-careers-jobs', component: LandingCareers },
  // One posting, opened from a row of that listing. The param is the source's own ATS id, which
  // is what the listing's data already stores in each posting's href — so the row and the page it
  // opens cannot name two different jobs. The header is per-posting; the description is the one
  // posting we read (stated in `site/data/careers-job.js`).
  { path: '/site/careers/:id', name: 'site-careers-job', component: LandingCareersJob },
  // The contact page in the same shell: the pitch and its form side by side in the hero, the
  // offices as a hairline grid, and the site's own closing CTA. The website nav's `Contact`
  // entry points here — it used to be a bare `#contact` anchor onto the closing band.
  { path: '/site/contact', name: 'site-contact', component: LandingContact },
  // The Learning Center in the same shell: 16 subjects and 78 articles, read verbatim off
  // azion.com/en/learning. The Resources mega-menu's `Learning` entry points here.
  { path: '/site/learning', name: 'site-learning', component: LandingLearning },
  // The partner programme page in the same shell, and the one composed ENTIRELY from the
  // marketing components: its hero, its proof band and its three reasons are `hero`,
  // `big-numbers` and `content-columns` configured, with nothing hand-drawn around them. The
  // site nav does not link it, because azion.com's does not either.
  { path: '/site/partners', name: 'site-partners', component: LandingPartners },
  // The success-case library in the same shell: the first /site page whose body is a
  // filtered index rather than an argument — three featured stories, 35 in a hairline grid
  // behind three pickers, and the analyst recognitions. The site nav does not link it,
  // because azion.com's does not either: its Resources menu lists Blog, Resource Hub,
  // Partners and Marketplace, and reaches the library only from the footer.
  { path: '/site/success-cases', name: 'site-success-cases', component: LandingSuccessCases },
  {
    path: '/site/success-cases/:slug',
    name: 'site-success-case-post',
    component: LandingSuccessCasePost,
    props: true,
    beforeEnter: (to) =>
      successCaseArticle(String(to.params.slug)) ? true : '/site/success-cases'
  },
  { path: '/site/blog', name: 'site-blog', component: LandingBlog },
  {
    path: '/site/blog/:slug',
    name: 'site-blog-post',
    component: LandingBlogPost,
    props: true,
    beforeEnter: (to) => (blogArticle(String(to.params.slug)) ? true : '/site/blog')
  },
  // The hero catalogue: every opening band the Site ships, in one column, rendered by the
  // component with the props a page would pass. Not an azion.com page — it is the Site's
  // own reference for choosing an opening, so the nav does not link it.
  { path: '/site/azion-heros', name: 'site-azion-heros', component: LandingAzionHeros },
  // The compliance page in the same shell: the certifications and the privacy regulations,
  // one module of cards under a shared responsibility-model intro. Reached by direct URL only,
  // the same way Careers is — neither is a Products/Solutions mega-menu entry.
  { path: '/site/compliance', name: 'site-compliance', component: LandingCompliance },
  // The same page with NO SiteNav/SiteFooter — for embedding it on its own where a surrounding
  // surface already provides navigation/closing (see LandingComplianceEmbed).
  {
    path: '/site/compliance/embed',
    name: 'site-compliance-embed',
    component: LandingComplianceEmbed
  },
  // The GDPR page in the same shell: a translation of resend.com/security/gdpr (see
  // .claude/skills/site-design-translate), rebranded to Azion. Reached by direct URL only, the
  // same way Compliance and Careers are — not a Products/Solutions mega-menu entry.
  { path: '/site/gdpr', name: 'site-gdpr', component: LandingGdpr },

  // ══ Documentation ═════════════════════════════════════════════════════════════════
  { path: '/site/docs', name: 'site-docs', component: AzionDocs },
  // A docs reading page COMPOSED in Vue: prose, but with a filtering tool picker and
  // cards carrying other vendors' real marks — neither of which MDX can express. Every
  // block in it still comes from @aziontech/webkit-docs.
  {
    path: '/site/docs/agent-setup',
    name: 'site-docs-agent-setup',
    component: AzionDocsAgentSetup
  },
  // ONE SETUP PAGE PER AGENT, from one route and one view — the index's card grid opens
  // these. Composed rather than written as MDX for the same reason the index is: the
  // closing "Other agents" grid draws six other companies' real logos, which are inline
  // SVG and therefore a slot. A slug with no agent behind it would render an empty page,
  // so it goes back to the index rather than to a blank column with a full rail beside it.
  {
    path: '/site/docs/agent-setup/:agent',
    name: 'site-docs-agent-page',
    component: AzionDocsAgentPage,
    beforeEnter: (to) => (agentBySlug(String(to.params.agent)) ? true : '/site/docs/agent-setup')
  },
  // EVERY OTHER DOCS PAGE, from one route and one view. A reading page is `.mdx` rendered by
  // @aziontech/webkit-docs — the other half of the docs example, and the way most of a real
  // documentation site is written — so the pages are files in `site/docs/content/` and the
  // route resolves the slug against that folder (see docs-pages.js). Adding a page is adding
  // the file and giving its row in the rail an `href`; no route, no view, no wiring.
  //
  // The static routes above win over this one regardless of order (Vue Router ranks static
  // segments higher), so the two hand-composed pages keep their own views. An unknown slug
  // has no file behind it and would render an empty page, so it goes to the docs home
  // instead of a blank column with a full rail beside it.
  {
    path: '/site/docs/:page',
    name: 'site-docs-page',
    component: AzionDocsPage,
    beforeEnter: (to) => (hasDocsPage(String(to.params.page)) ? true : '/site/docs')
  },

  // ══ Where the pages used to live ══════════════════════════════════════════════════
  // Declared last, and every one of them a static path, so none of them can shadow a page
  // above. The redirect is a FUNCTION rather than the target string: a string redirect
  // resolves to that path alone, so `/site/cache#pricing` would land at the top of the page
  // it moved to. Carrying `query` and `hash` across is what makes an old deep link still a
  // deep link.
  ...Object.entries(MOVED).map(([from, to]) => ({
    path: from,
    redirect: (route) => ({ path: to, query: route.query, hash: route.hash })
  }))
]
