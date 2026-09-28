<script setup>
  // Solution page: Retail — a translation of https://www.azion.com/en/solutions/retail/
  // into this site's own page language, produced with the /site-design-translate flow (the
  // live page read mechanically into a band inventory, then rebuilt band by band). The
  // source is the specification for WHAT the page says; CONTAINERS.md is the specification
  // for HOW it is drawn. Every line of copy below is the source's, verbatim; none of its
  // grid, spacing, borders, colours or radii came across.
  //
  // A SOLUTION page by INDUSTRY, beside /site/solutions/financial-services — but on azion.com's LONG
  // solution template (29 bands), the one /site/solutions/web-apps runs, not the 20-band template the
  // other two industry pages run. So its bricks come from AzionWebApps.vue (the marquee +
  // templates module, the tab set, the marks-beside-a-quote frame, the ruled FAQ) and its
  // register from AzionFinancialServices.vue / AzionTechnology.vue, the pages it sits next
  // to in the Solutions menu.
  //
  // The source's 29 bands, in order, and what each becomes here:
  //
  //   0  hero (eyebrow, h1, description, two actions)      Hero kind="screen" + Hero.Title
  //   1  11-mark client marquee                            Ticker, on the hero's floor
  //   2  spacer                                            SectionGap hatch
  //   3  six argument cells                                CardGrid divider, 3 columns
  //   4  spacer                                            SectionGap hatch
  //   5  "Compatible with Your Stack" title                SectionTitle in the module header
  //   6  30-mark stack marquee                             Ticker, PRODUCT_STACK
  //   7  Quick Start with Templates — copy | grid          FrameBox flush, lg:grid-cols-2
  //   8  spacer                                            SectionGap hatch
  //   9  "Everything You Need to Build and Deploy"         SectionTitle in the module header
  //   10 four tabs over copy | art                         MediaTabs, one row per tab
  //   11 spacer                                            SectionGap hatch
  //   12 art | copy — retail modernization                 FrameBox, lg:grid-cols-2
  //   13 spacer                                            SectionGap hatch
  //   14 twelve marks + one client's sentence              FrameBox, lg:grid-cols-2
  //   15 spacer                                            SectionGap hatch
  //   16 "The Infrastructure Behind Leading E-Commerce…"   SectionTitle in the module header
  //   17 eleven success-story cards                        CardGrid divider, 3 columns
  //   18 spacer                                            SectionGap hatch
  //   19 "Security and Compliance for High-Stakes…"        SectionTitle in the module header
  //   20 five certification cells                          gap-px hairline grid
  //   21 spacer                                            SectionGap hatch
  //   22 "Composable Primitives for Performance and…"      SectionTitle in the module header
  //   23 the platform, four columns                        CardGrid divider + NavColumn/NavItem
  //   24 spacer                                            SectionGap hatch
  //   25 Frequently Asked Questions                        the ruled Accordion band
  //   26 spacer                                            SectionGap hatch
  //   27 closing CTA                                       CallToAction kind="split"
  //   28 spacer                                            the closing hatch frame
  //
  // Nothing is added and nothing is dropped: no extra band, string, list item, link label
  // or figure. The source places 11 rhythm bands and so does this page: ten are
  // `SectionGap hatch`, and the eleventh is the closing hatch frame at band 28, which
  // draws no rules because the footer under it opens with one.
  //
  // WHERE OUR FORM DEPARTS FROM THE SOURCE, on purpose:
  //   • The source's hero is 606px. Ours is `hero` — one viewport — because that is this
  //     language's hero rule.
  //   • The source runs the client strip as its own bordered band under the hero. Here it
  //     stands on the hero's floor and the hero's own `border-b` is the rule that divides it
  //     from the column — the same single line, one owner. Every other /site page seats its
  //     strip this way, so they read as one site.
  //   • The hero's eyebrow is `// RETAIL`. Hero.Title's overline anatomy carries no `//`
  //     prefix (that belongs to SectionTitle and to the closing band), so the hero reads
  //     `RETAIL`. The bands that DO have the prefix get it from SectionTitle's own overline.
  //   • The source breaks the h1 across two lines (`Shopping experiences` / `that convert`).
  //     That is a wrap, not two tones — so it is one string here and `text-balance` decides
  //     where it breaks at each width.
  //   • The source states bands 5+6+7, 9+10, 16+17, 19+20 and 22+23 as separate bands: a
  //     heading band, then the thing it titles. Here each group is ONE module with the title
  //     in its `#header` slot, so the rule between them is the header's own `border-b`
  //     rather than two bands' edges meeting on one pixel (CONTAINERS.md, one-frame).
  //   • Band 3's six titles are `h3` on the source. This band has no heading of its own, so
  //     they are the first sub-headings under the page's `h1` and an `h3` would skip a level
  //     (axe `heading-order`). They are `h2` here; `text-heading-xs` is the size, and the
  //     level and the size are set separately.
  //   • Band 10 is a real tab set on the source — four controls switching one panel — so it
  //     is `MediaTabs`, the design system's own tabbed media band, never a carousel
  //     (.claude/rules/dependencies.md). Its rows ARE the controls, so the source's short
  //     labels (`Preview`, `Runtime`, …) fold into the claims they opened.
  //   • Band 17 is a horizontal scroller with prev/next controls on the source. ELEVEN cards
  //     do not fit one row, so unlike the sibling pages this one cannot simply drop the
  //     controls: the cards become a four-row hairline grid instead. That trades the
  //     source's 342px band for a tall one, and it is the honest trade — this language has
  //     no carousel, and a sideways scroller inside a bordered column fights its own frame.
  //   • Band 17's cards are SIGNED, not labelled. The source tags every card with the same
  //     `RETAIL` eyebrow and states the outcome as one sentence; here the client's own mark
  //     takes that slot — it says which client, which the sector tag never did — and the
  //     sentence is read the way `ClientKpiQuote` states one: the result leads (`86% faster`),
  //     the rest of the source's own sentence follows it. NO FIGURE IS INVENTED — a story the
  //     source titles without one leads with its own words (`Automated security`).
  //   • The source's `Deploy now` / `Docs` / `Customers` controls carry a trailing chevron.
  //     `MiniButton` is the one control in this system whose icon IS trailing and whose ink is
  //     the page's own, so the chevron survives — the same choice AzionFinancialServices and
  //     AzionTechnology make. Button's `icon` is leading-only, and Link paints `--text-link`,
  //     the product UI's blue, which nothing else here uses.
  //   • Band 17's cards carry NO `View success story` control. Eleven cells each repeating one
  //     label is eleven tab stops to reach eleven destinations; the cell is the link instead,
  //     so the target is the whole card and the grid is one stop per story. What the removed
  //     label said out loud, `aria-label` now says to a screen reader — see `storyLabel`.
  //   • The source's `DNS` eyebrow in band 23 is a product NAME, not a fifth column: its
  //     four columns are Compute, AI, Data and Security, and DNS is the last product under
  //     Security — the same reading the three sibling pages take of the same component.
  //   • Band 27's headline is one sentence in two tones; CallToAction expresses that as `title` +
  //     `titleMuted`. The source's DOM reports the muted half a second time as a bare number
  //     node — an artifact of how it splits the line, not a string the page renders twice.
  //   • Band 3's six glyphs are ours. The source draws its own set; these are the same six
  //     ideas from the icon library the rest of the page's glyphs come from.
  //
  // THE ART, and where it comes from:
  //   • Bands 7, 10 and 12 draw SVGs from the Figma `Per page › Varejo` set, exported at
  //     592x300. They are artwork, not composed UI, so they are `<img>` — one hashed request
  //     each, rather than vector paths inlined into this page's own markup.
  //   • THE EXPORTS ARE STRIPPED OF FIGMA'S CHROME. A frame with no fill of its own exports
  //     whatever sits behind it — a full-bleed page-background rect, the `Per page` plate and
  //     the `Varejo` section plate — and the section plate (`#444444`) covers the entire
  //     592x300 box, so the unedited export is a grey card with the scene on top of it.
  //     Dropping those five nodes leaves a transparent illustration that takes the cell's own
  //     `--bg-canvas`.
  //   • Band 10's four scenes are the files AzionWebApps.vue already commits. The `Varejo`
  //     section holds its own copies of all four, and they were exported and diffed against
  //     the committed ones before being reused: `runtime` is byte-identical, and `preview`
  //     differs by 0.001px on one x coordinate (an export-run rounding artifact). Same
  //     artwork — so this page imports the existing files rather than committing a second,
  //     visually identical 164KB copy of each.
  //   • BAND 7'S MEDIA IS NOT ART. It is the deploy flow's own published catalog, drawn as
  //     a scrolling `CardGrid kind="frame"` — one cell per template, each a real frame with
  //     the console route behind it, the same band AzionWebApps.vue carries. The source's
  //     own art strings (`Search your apps`, and the three CLI verbs labelling its scene) do
  //     not survive the copy diff: they described art we replaced. Its list is
  //     `@shared/lib/deploy-templates.js`: `@site` may not import `@console`, so that module
  //     mirrors the catalog rather than importing it.
  //
  // ASSET GAPS, recorded rather than substituted:
  //   • Marisa — CLOSED. The source loads `dark/clients/marisa-logo.svg`, which this repo has
  //     no copy of, but it does hold `light/marisa-logo.svg` — the same mark as dark-ink
  //     artwork, which `monochrome` collapses to the one silhouette every mark here takes. So
  //     bands 14 and 17 both draw it, rather than one drawing a wordmark beside the other.
  //   • NZN is a CLIENTS registry entry that carries no file, so it renders as that same
  //     wordmark — by the registry's design, not a gap opened here.
  //   • Quero-Quero and B2W have no mark in the webkit brand registry and no file here
  //     either, so their band-17 cells sign with the typographic wordmark ClientKpiQuote
  //     falls back to. The name is stated; no similar mark is substituted.
  //   • Pernambucanas, Marisa and Panvel are the reverse case — files this repo holds that
  //     the registry does not carry — so those cells pass the asset through the component's
  //     `mark` slot. (Band 14's Marisa cell reads the CLIENTS registry, which still has no
  //     entry for it, so that one stays a wordmark.)
  //   • LGPD — CLOSED. The badge this page had no file for is now exported from the Figma
  //     `Assets` file (node 1907:30763) and committed beside the other four, so all five
  //     cells of band 20 draw the art the source draws — on the three sibling pages too.
  //   • The source's eighth marquee mark loads `radware-logo.svg` under `alt="Prime Video"` —
  //     a mislabel on the source, verified against its own HTML. The mark it RENDERS is
  //     Radware's, so that is the mark here, under this repo's registry name for it.
  //   • `TanStack AI` has no mark in the icon library and Hono has only a monochrome one, so
  //     those two rows of band 7's list take `pi pi-code` — the neutral glyph the framework
  //     registry itself uses for a framework with no colour mark.
  import Ticker from '@aziontech/webkit/ticker'
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import ClientKpiQuote from '@aziontech/webkit/client-kpi-quote'
  import Faq from '@aziontech/webkit/faq'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
  import MediaTabs from '@aziontech/webkit/media-tabs'
  import MiniButton from '@aziontech/webkit/mini-button'
  import Quote from '@aziontech/webkit/quote'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Tag from '@aziontech/webkit/tag'
  // Marks this page names as files rather than as CLIENTS registry entries, so they are not
  // added to a registry every other strip on the site reads. Vite resolves each to an asset
  // URL. These two sit in `clients/dark/clients/`.
  import arezzo from '@shared/assets/clients/dark/clients/arezzo-logo.svg'
  import pernambucanas from '@shared/assets/clients/dark/clients/pernambucanas-logo.svg'
  // The four certification badges this repo holds. Vite resolves each to an asset URL,
  // exactly as the client registries do. NONE is filtered, and each for its own reason: the
  // three colour badges carry their own brand colours, and the LGPD mark is one flat
  // near-white ink (#C1BFBF, its drop shadow drawn as the same ink at a lower opacity),
  // which is the correct ink here because SiteLayout pins every marketing page to the dark
  // theme. Were this band ever placed on a THEMED surface, LGPD — and only LGPD — would
  // need the registry's `light` artwork route: #C1BFBF on a light `--bg-canvas` measures
  // 1.8:1 and effectively disappears.
  import gdprBadge from '@shared/assets/clients/GDPR-logo.svg'
  import { CLIENTS } from '@shared/assets/clients/index.js'
  import lgpdBadge from '@shared/assets/clients/LGPD-logo.svg'
  // Two more, as dark-ink artwork — which `monochrome` expects either way: it collapses any
  // file to one silhouette and inverts it on dark. Marisa signs band 14 and a band-17 cell.
  import marisa from '@shared/assets/clients/light/marisa-logo.svg'
  import panvel from '@shared/assets/clients/light/panvel-logo.svg'
  import pciBadge from '@shared/assets/clients/PCI-logo.svg'
  import socBadge from '@shared/assets/clients/SOC-logo.svg'
  import { DEPLOY_TEMPLATES } from '@shared/lib/deploy-templates.js'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { CLIENT_STRIP_RADWARE, PRODUCT_STACK } from '@shared/ui/brand/strips.js'
  import { useRouter } from 'vue-router'

  // The art, from the Figma `Per page › Varejo` set. The four tab scenes are the files the
  // web-apps translation already committed — same frames, same artwork (see THE ART above).
  import { NavColumn, NavItem } from '../ui/index.js'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // A template card closes on `Button`, whose root IS an `<a>`, so the card itself is a
  // plain div — an anchor around it would nest two links on one destination. The button
  // carries the resolved URL so middle-click and cmd-click still open a tab; a plain left
  // click is routed instead of followed, so the app never reloads.
  const templateHref = (to) => router.resolve(to).href
  const openTemplate = (event, to) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return
    }
    event.preventDefault()
    router.push(to)
  }
  const followTemplate = (event, to) => {
    if (event.target.closest('a, button') || globalThis.getSelection()?.toString()) return
    if (event.metaKey || event.ctrlKey) {
      globalThis.open(templateHref(to), '_blank', 'noopener')
      return
    }
    router.push(to)
  }

  // The page's outbound destinations, stated once. Naming the one this page reuses twelve
  // times is what keeps the story links and the `Customers` control from drifting apart.
  const SUCCESS_CASES = 'https://www.azion.com/en/success-case/'

  // ── Band 1 — the eleven marks the strip states ────────────────────────────────
  // The source's marquee, in the source's order. Every name resolves against the shared
  // CLIENTS registry, so a mark this page draws and a mark the home page's trust strip draws
  // can never be two different files.
  const registered = (name) => CLIENTS.find((client) => client.name === name) ?? { name }

  // ── Band 3 — the argument, in six cells ───────────────────────────────────────
  const PILLARS = [
    {
      icon: 'pi pi-bolt',
      title: 'Speed that converts',
      description:
        'Deliver fast storefront experiences with consistent page speed and Core Web Vitals, lifting conversion, SEO visibility, and average order value across web and mobile.'
    },
    {
      icon: 'pi pi-chart-line',
      title: 'Built for peak season',
      description:
        'Stay online during Black Friday, Cyber Monday, and flash sales with automatic scaling and a distributed architecture that absorbs traffic surges without overprovisioning.'
    },
    {
      icon: 'pi pi-shield',
      title: 'Security built in',
      description:
        'Protect transactions, customer data, and storefront availability with DDoS mitigation, WAF, and zero trust controls integrated into the same distributed architecture.'
    },
    {
      icon: 'pi pi-lock',
      title: 'Fraud and bots blocked',
      description:
        'Block bots, scraping, credential stuffing, account takeover, and payment fraud with bot management and application security applied before requests reach your origin.'
    },
    {
      icon: 'pi pi-sparkles',
      title: 'AI-powered personalization',
      description:
        'Deliver tailored recommendations, search, and content with AI Inference and Functions executed at request time, improving conversion without round-tripping to centralized origins.'
    },
    {
      icon: 'pi pi-credit-card',
      title: 'Lower costs at scale',
      description:
        'Offload origin traffic, optimize images, and serve cached responses from a distributed architecture to cut cloud, egress, and CDN costs while scaling automatically with demand.'
    }
  ]

  // ── Band 10 — the four surfaces, one claim at a time ──────────────────────────
  const SHIP_PANELS = [
    {
      title: 'Automatic Preview Deployments',
      illustration: 'preview',
      description:
        'Validate every change in preview environments before going live, so campaigns, content, and product updates ship with confidence.'
    },
    {
      title: 'Cost-Efficient Infrastructure',
      illustration: 'runtime',
      description:
        'Run Functions on V8 isolates with zero cold starts and consistent performance during traffic spikes.'
    },
    {
      title: 'Manage Resources with Application Code',
      illustration: 'infrastructure-as-code',
      description:
        'Use Terraform and code-based configuration to keep workloads, cache, and security rules versioned and consistent across regions and brands.'
    },
    {
      title: 'Observability Built-In for All Requests',
      illustration: 'live-debugging',
      description:
        'Trace requests in production with Debug Rules, Real-Time Events, and stack traces to resolve issues fast during revenue-critical moments.'
    }
  ]

  // ── Band 14 — the twelve marks beside the quote ───────────────────────────────
  // Nine resolve against the shared CLIENTS registry. Three are named by the source but are
  // not registry entries, so this page names their files directly.
  const STORY_CLIENTS = [
    registered('Global Fashion Group'),
    registered('Netshoes'),
    registered('Dafiti'),
    { name: 'Arezzo', logo: arezzo, artwork: 'light' },
    // The source spells it Magazine Luiza; Magalu is the registry's name for it.
    registered('Magalu'),
    // The source spells it Lojas Renner; Renner is the registry's name for it.
    registered('Renner'),
    // The source spells it Grupo Pão de Açúcar; GPA is the registry's name for it.
    registered('GPA'),
    { name: 'Marisa', logo: marisa, artwork: 'light' },
    registered('América Móvil'),
    registered('MadeiraMadeira'),
    registered('NZN'),
    { name: 'Pernambucanas', logo: pernambucanas, artwork: 'light' }
  ]

  // ── Band 17 — the eleven stories, and the source's own URLs ───────────────────
  // Each story is read as ClientKpiQuote states one: the mark says which client, `kpi` is the
  // result that story is titled by, and `text` carries the rest of the source's own sentence.
  // A story the source titles with no figure leads with its own words — no number is invented
  // to fill the slot. `client` is a mark-registry name; `mark` is the local asset for the one
  // client the registry has no entry for. See ASSET GAPS.
  const STORIES = [
    {
      client: 'magalu',
      clientName: 'Magalu',
      kpi: 'Hundreds of applications',
      text: 'at global scale, kept highly available behind an enhanced security perimeter.',
      href: `${SUCCESS_CASES}magalu/`
    },
    {
      client: 'renner',
      clientName: 'Lojas Renner',
      kpi: '67% saved',
      text: 'on data transfer costs, through massive traffic spikes.',
      href: `${SUCCESS_CASES}renner/`
    },
    {
      client: 'dafiti',
      clientName: 'Dafiti',
      kpi: '86% faster',
      text: 'load times, with a 45% cost reduction in data transfer.',
      href: `${SUCCESS_CASES}dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/`
    },
    {
      client: 'madeiramadeira',
      clientName: 'MadeiraMadeira',
      kpi: '90% lower',
      text: 'cloud costs, and faster product delivery at scale.',
      href: `${SUCCESS_CASES}madeiramadeira/`
    },
    {
      clientName: 'Pernambucanas',
      mark: { name: 'Pernambucanas', logo: pernambucanas, artwork: 'light' },
      kpi: 'Faster e-commerce',
      text: 'on a platform that modernizes the customer experience.',
      href: `${SUCCESS_CASES}pernambucanas/pernambucanas-relies-on-azion-to-speed-up-its-e-commerce-platform-and-innovate-customer-experience-through-edge-applications/`
    },
    {
      client: 'netshoes',
      clientName: 'Netshoes',
      kpi: '4M+ threats',
      text: 'blocked in six months, protecting every shopping journey.',
      href: `${SUCCESS_CASES}netshoes/`
    },
    {
      client: 'gpa',
      clientName: 'GPA',
      kpi: '100+ applications',
      text: 'secured through a targeted cyberattack, at 30% lower cost.',
      href: `${SUCCESS_CASES}gpa-solved-cyberattack/`
    },
    {
      clientName: 'Quero-Quero',
      kpi: 'Stronger API security',
      text: 'keeping its e-commerce highly available.',
      href: `${SUCCESS_CASES}quero-quero/`
    },
    {
      clientName: 'Marisa',
      mark: { name: 'Marisa', logo: marisa, artwork: 'light' },
      kpi: '85% of traffic',
      text: 'delivered from distributed infrastructure, on a faster storefront.',
      href: `${SUCCESS_CASES}marisa/`
    },
    {
      clientName: 'B2W',
      kpi: 'Automated security',
      text: 'across its e-commerce platforms, on a programmable firewall.',
      href: `${SUCCESS_CASES}b2w/`
    },
    {
      clientName: 'Panvel',
      mark: { name: 'Panvel', logo: panvel, artwork: 'light' },
      kpi: '60% faster',
      text: 'e-commerce, at 100% availability under load.',
      href: `${SUCCESS_CASES}panvel/`
    }
  ]

  // Each cell is its own link, so nothing in it carries a link label. The accessible name has
  // to say the destination and the claim both, and that it leaves the site.
  const storyLabel = (story) =>
    `${story.clientName} success story: ${story.kpi} ${story.text} (opens in a new tab)`

  // ── Band 20 — the five certifications ─────────────────────────────────────────
  // `label` is the source's own check pill; `alt` is the source's own alt text for the badge
  // art. The source draws the SAME AICPA SOC badge for SOC 2 Type 2 and for SOC 3, so one
  // file serves both cells here too. All five cells now draw art — the LGPD badge was this
  // page's one recorded asset gap.
  const CERTIFICATIONS = [
    { label: 'SOC 2 Type 2', badge: socBadge, alt: 'AICPA SOC 2 Type 2 badge' },
    { label: 'SOC 3', badge: socBadge, alt: 'AICPA SOC 3 badge' },
    { label: 'PCI DSS', badge: pciBadge, alt: 'PCI DSS badge' },
    { label: 'GDPR', badge: gdprBadge, alt: 'GDPR' },
    { label: 'LGPD', badge: lgpdBadge, alt: 'LGPD badge' }
  ]

  // ── Band 23 — the platform, in four groups ────────────────────────────────────
  // The same four groups and fourteen products the source lists on every product and
  // solution page, with the same descriptions — so two pages cannot describe one product two
  // ways. Two products have a page in this sample and link to it; the rest carry the source's
  // own destination, which is documentation this app does not host.
  const PRODUCT_GROUPS = [
    {
      label: 'Compute',
      items: [
        {
          icon: 'ai ai-edge-functions',
          title: 'Functions',
          description: 'Run serverless code closer to users',
          href: '/site/products/functions'
        },
        {
          icon: 'ai ai-edge-orchestrator',
          title: 'Rules Engine',
          description: 'Automate request handling with programmable rules'
        },
        {
          icon: 'ai ai-load-balancer',
          title: 'Load Balancer',
          description: 'Distribute traffic for performance and availability'
        },
        {
          icon: 'ai ai-layers',
          title: 'Image Processor',
          description: 'Optimize and transform images in real time'
        }
      ]
    },
    {
      label: 'AI',
      items: [
        {
          icon: 'ai ai-edge-ai',
          title: 'AI Inference',
          description: 'Run AI models closer to users'
        },
        {
          icon: 'ai ai-gateway',
          title: 'AI Gateway',
          description: 'Secure, manage, and optimize AI traffic'
        }
      ]
    },
    {
      label: 'Data',
      items: [
        {
          icon: 'ai ai-edge-storage',
          title: 'Object Storage',
          description: 'Scalable, durable storage for unstructured data'
        },
        {
          icon: 'ai ai-edge-sql',
          title: 'SQL Database',
          description: 'Relational database built for distributed applications'
        },
        {
          icon: 'ai ai-edge-kv',
          title: 'KV Store',
          description: 'Globally distributed, low-latency key-value store'
        },
        {
          icon: 'ai ai-tiered-cache',
          title: 'Cache',
          description: 'Accelerate content delivery and reduce origin load',
          href: '/site/products/cache'
        }
      ]
    },
    {
      label: 'Security',
      items: [
        {
          icon: 'ai ai-waf-rules',
          title: 'Web Application Firewall',
          description: 'Protect human and AI applications from threats'
        },
        {
          icon: 'ai ai-gateway',
          title: 'API Gateway',
          description: 'Secure, manage, and scale API traffic'
        },
        {
          icon: 'ai ai-network-lists',
          title: 'Bot Management',
          description: 'Detect and stop automated threats instantly'
        },
        {
          icon: 'ai ai-edge-dns',
          title: 'DNS',
          description: 'Reliably host authoritative DNS zones worldwide'
        }
      ]
    }
  ]

  // ── Band 25 — the ten questions ───────────────────────────────────────────────
  // `q2`'s answer carries an inline link on the source. It is split across `answer` / `link`
  // / `answerAfter` so the anchor stays a real control instead of its label being flattened
  // into the sentence.
  const FAQ = [
    {
      value: 'q1',
      question: 'What types of storefronts can I build and deploy on Azion?',
      answer:
        'You can build and deploy storefronts, marketplaces, marketing campaign pages, and supporting retail apps, but in fact any web app or website runs on Azion. The platform also provides the primitives to build not only the storefront but much of the backend, with support for static and dynamic workloads on a distributed architecture.'
    },
    {
      value: 'q2',
      question: 'Which frameworks are compatible?',
      answer:
        'Azion is compatible with modern frameworks such as Next.js, React, Vue, Astro, Angular, Nuxt, Svelte, and others, so you can reuse your current stack without a full rewrite. See the full ',
      link: {
        label: 'frameworks compatibility list',
        href: 'https://www.azion.com/en/documentation/products/devtools/azion-edge-runtime/frameworks-compatibility/'
      },
      answerAfter: '.'
    },
    {
      value: 'q3',
      question: 'How do preview deployments work?',
      answer:
        'You can validate storefront changes in preview environments before release, share results across teams, and promote approved versions to production with a controlled workflow.'
    },
    {
      value: 'q4',
      question: 'Can I personalize pages without hurting performance?',
      answer:
        'Yes. You can run request-time logic for personalization by route, headers, cookies, and geography while maintaining fast page delivery through integrated caching and runtime controls.'
    },
    {
      value: 'q5',
      question: 'Can I integrate my existing commerce platform, CMS, and APIs?',
      answer:
        'Yes. Azion integrates with modern headless commerce, CMS, and API-based architectures, enabling teams to keep existing workflows while improving performance and reliability.'
    },
    {
      value: 'q6',
      question: 'How does Azion help with SEO and Core Web Vitals?',
      answer:
        'By reducing latency, optimizing content delivery, and improving responsiveness, Azion helps improve user experience signals that affect Core Web Vitals and search performance.'
    },
    {
      value: 'q7',
      question: 'What happens during peak shopping events like Black Friday?',
      answer:
        'Scaling is automatic. Azion handles traffic surges without manual provisioning, helping teams maintain availability and performance during launches, campaigns, and seasonal peaks.'
    },
    {
      value: 'q8',
      question: 'Can I migrate gradually from my current cloud or CDN setup?',
      answer:
        'Yes. You can modernize incrementally by routing selected paths and workloads through Azion first, then expanding over time without disrupting your existing storefronts.'
    },
    {
      value: 'q9',
      question: 'Is Azion ready for enterprise compliance requirements?',
      answer:
        'Yes. Azion supports enterprise requirements with certifications such as SOC 2 Type 2, SOC 3, and PCI DSS, in addition to privacy commitments aligned with major regulations.'
    },
    {
      value: 'q10',
      question: 'How do I get started quickly?',
      answer:
        'Start with the Azion CLI and templates. A simple workflow like `azion init`, `azion build`, and `azion deploy` takes your storefront from a local project to global deployment.'
    }
  ]
</script>

<template>
  <!-- ══ Band 0 + 1 — the hero, and the clients standing on its floor ═══════════
       Hero owns the full-bleed band and the page's top rule. `--banner-offset`
       is the sticky SiteNav's height (h-14 = 3.5rem), so the band still measures exactly one
       screen with the nav above it. The wrapper declares that height and hands the leftover
       to the copy with `justify-between`: the claim sits in the middle of what is left, the
       strip stands on the floor. -->
  <Hero
    texture="dots"
    texture-fade="top"
    kind="screen"
    max-width="site"
    class="[--banner-offset:3.5rem]"
  >
    <Hero.Title
      centered
      eyebrow="Retail"
      title="Shopping experiences that convert"
      description="Deploy fast, secure storefronts on distributed infrastructure designed for high-stakes retail experiences. Handle peak events, prevent fraud, and lower cloud costs without overprovisioning."
    >
      <template #actions>
        <Button
          label="Start Free"
          kind="secondary"
          size="large"
          @click="goSignup"
        />
        <Button
          label="Talk to a Specialist"
          kind="outlined"
          size="large"
          href="#contact"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </Hero.Title>

    <!-- No label — the source's band is the marks alone. `monochrome` is the strip's own
           rule: one ink, so eleven brand palettes in one row do not become the loudest thing
           on the page. -->
    <template #bottom>
      <div
        class="hidden animate-content-enter justify-center px-(--layout-boundary-inline) pb-(--spacing-xl) motion-reduce:animate-none [--content-enter-delay:120ms] lg:flex"
      >
        <Illustration
          name="retail-application-modernization"
          aria-label="A retail storefront modernized onto distributed infrastructure"
          class="max-w-(--container-2xl)"
        />
      </div>
      <Ticker
        kind="band"
        size="small"
        :marks="CLIENT_STRIP_RADWARE"
      />
    </template>
  </Hero>

  <!-- ══ The framed column ═════════════════════════════════════════════════════
       Every band below the hero is a brick inside one centered column. The column carries
       only `border-x`; its top edge is the hero's `border-b` and its bottom edge the
       SiteFooter's `border-t`. Each brick is `flush` with `borders="y"`, which lands its top
       rule ON the one above and hands the vertical rules back to the column — so no line on
       this page is drawn twice. -->
  <SectionContainer max-width="site">
    <!-- Band 2 — spacer. As the first frame in the column its `flush` top rule lands on the
         hero's border-b, and its own bottom rule is what divides it from the band below. -->
    <SectionGap hatch />

    <!-- ── Band 3 — the argument, in six cells ──────────────────────────────────
         A hairline grid: the rules between the cells are the grid's own `gap-px`, so each
         cell draws no border and fills `--bg-canvas` (or the whole band goes the colour of
         the gap). The frame owns the top and bottom; the column owns the sides. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          kind="divider"
          :columns="3"
        >
          <div
            v-for="pillar in PILLARS"
            :key="pillar.title"
            class="flex flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <i
              :class="pillar.icon"
              aria-hidden="true"
              class="text-heading-sm text-(--primary)"
            />
            <!-- `h2`, not the source's `h3`: this band has no heading of its own, so these
                 six are the first sub-headings under the page's `h1`. -->
            <h2 class="m-0 text-balance text-heading-xs text-(--text-default)">
              {{ pillar.title }}
            </h2>
            <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
              {{ pillar.description }}
            </p>
          </div>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- Band 4 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 5 + 6 + 7 — the stack, the strip, and the templates ────────────
         Three source bands, one module: the title in the `#header` slot, the marquee in the
         first frame, the templates band `flush` under it. The marquee frame draws its own
         floor and the templates frame takes it as its top rule, so the two meet on one
         hairline. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Your Stack, Your Way"
          title="Compatible with Your Stack"
        />
      </template>

      <FrameBox
        flush
        borders="y"
      >
        <!-- No label — the source's band is the marks alone. The list is PRODUCT_STACK, the
             same thirty marks in the same order the source states and every other product
             page's strip draws. -->
        <div class="py-(--spacing-xxl)">
          <Ticker :marks="PRODUCT_STACK" />
        </div>
      </FrameBox>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <MediaSplit
          :heading-level="3"
          align="center"
          size="large"
          texture="none"
          title="Quick Start with Templates"
          description="Launch storefronts faster with pre-built templates and starter kits for headless commerce, marketing pages, and product catalogs. Deploy complete projects in seconds with popular frameworks."
        >
          <template #media>
            <div class="relative min-h-[36rem] w-full self-stretch lg:min-h-[44rem]">
              <ScrollArea
                aria-label="Templates you can deploy"
                class="absolute inset-0 mask-t-from-[calc(100%_-_2rem)] mask-b-from-[calc(100%_-_6rem)]"
              >
                <CardGrid
                  flush
                  kind="frame"
                  :columns="2"
                >
                  <CardGrid.Cell
                    v-for="template in DEPLOY_TEMPLATES"
                    :key="template.slug"
                    kind="none"
                    :padded="false"
                  >
                    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -- the card's Deploy now link is the keyboard path to the same route -->
                    <div
                      class="group/template flex h-full min-w-0 cursor-pointer flex-col gap-(--spacing-md) bg-(--bg-surface) p-(--spacing-xl)"
                      @click="followTemplate($event, template.to)"
                    >
                      <span
                        class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                      >
                        <i
                          :class="[template.icon, template.markClass]"
                          aria-hidden="true"
                          class="text-[1.25rem] leading-none text-(--text-default)"
                        />
                      </span>
                      <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                        <span class="text-body-md text-(--text-default)">{{ template.title }}</span>
                        <span class="text-pretty text-body-sm text-(--text-muted)">
                          {{ template.description }}
                        </span>
                      </div>
                      <Button
                        label="Deploy now"
                        kind="outlined"
                        size="medium"
                        icon="pi pi-chevron-right"
                        icon-position="trailing"
                        animated
                        :href="templateHref(template.to)"
                        class="mt-auto self-start group-hover/template:before:opacity-100 group-active/template:after:opacity-100 group-hover/template:[&_[data-animated]]:translate-x-0.5"
                        @click="openTemplate($event, template.to)"
                      >
                        <template #prefix>
                          <i
                            class="ai ai-azion text-(--primary)"
                            aria-hidden="true"
                          />
                        </template>
                      </Button>
                    </div>
                  </CardGrid.Cell>
                </CardGrid>
                <div
                  aria-hidden="true"
                  class="h-16"
                />
              </ScrollArea>
            </div>
          </template>
          <template #actions>
            <Button
              label="Deploy now"
              kind="primary"
              size="large"
              href="https://www.azion.com/en/documentation/products/guides/#azion-templates"
              target="_blank"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </MediaSplit>
      </FrameBox>
    </SectionModule>

    <!-- Band 8 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 9 + 10 — four surfaces, one claim at a time ───────────────────
         The source runs this band as four controls over one panel. `MediaTabs` is that
         band in this language: the four claims stack as rows on the start edge and the one
         selected draws its scene on the end edge, so the control and the copy it selects
         are the same element rather than a short label above a panel that repeats it.
         The rotation is the source's own autoplay; it pauses under the pointer and stops
         for good on a click.

         The band draws its own top and bottom rules and the seam between its columns, so
         the frame around it carries the registration marks only. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Ship It"
          title="Everything You Need to Build and Deploy"
        />
      </template>

      <FrameBox
        flush
        borders="none"
        marks="bottom"
      >
        <MediaTabs :items="SHIP_PANELS">
          <template #media="{ index }">
            <Illustration :name="SHIP_PANELS[index].illustration" />
          </template>
        </MediaTabs>
      </FrameBox>
    </SectionModule>

    <!-- Band 11 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 12 — the art, then the copy ─────────────────────────────────────
         The source sets a retail modernization diagram against the claim, art on the start
         edge. Ours is the design file's own drawing of that path: the client's own surfaces
         on one side, the platform in the middle, the customer's systems behind it. Below
         `lg` the art is the grid's second row, so the copy leads on a phone. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <MediaSplit
          media-href="https://www.azion.com/en/documentation/architectures/edge-application/application-modernization/"
          kind="media-start"
          title="Accelerate retail application modernization with a distributed architecture"
        >
          <template #media>
            <Illustration
              name="retail-application-modernization"
              aria-label="A client's applications reaching the customer's systems through the Azion Web Platform"
            />
          </template>

          <template #actions>
            <Button
              label="Docs"
              kind="secondary"
              size="small"
              href="https://www.azion.com/en/documentation/architectures/edge-application/application-modernization/"
              target="_blank"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </MediaSplit>
      </FrameBox>
    </SectionModule>

    <!-- Band 13 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 14 — the marks, and one client's sentence ───────────────────────
         Two cells of one frame at the source's split: twelve marks on the start edge, the
         quotation on the end edge. The marks are a static grid, not this site's marquee —
         the source lays them out as a block of twelve beside a quote, and a marquee in half
         a column shows two marks at a time. The band carries no heading of its own on the
         source, so none is invented here.

         `blockquote` and `figcaption` are DIRECT children of the figure — HTML pairs a
         caption with a quotation only at that depth. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="grid lg:grid-cols-2">
          <ul
            class="m-0 grid list-none grid-cols-2 items-center gap-(--spacing-xl) p-(--spacing-xl) sm:grid-cols-4"
          >
            <li
              v-for="client in STORY_CLIENTS"
              :key="client.name"
              class="flex items-center justify-center"
            >
              <ClientMark
                :client="client"
                monochrome
                mark="h-8 w-auto max-w-32 object-contain"
              />
            </li>
          </ul>

          <!-- Julian H is at Dafiti Group; the mark the source draws over the quotation is its
               parent group's, named separately from the cell in the grid beside it. The
               quotation keeps the source's straight ASCII quotes. -->
          <Quote
            kind="signed"
            text='"One of the best CDN and WAF solutions I have ever used. Easy to implement and integrate, with the speed and low latency that make a real difference for our customers."'
            name="Julian H"
            job-title="IT OPS, SRE &amp; SEC Manager at Dafiti Group"
            class="border-t border-(--border-default) p-(--spacing-xl) lg:border-t-0 lg:border-l"
          >
            <template #mark>
              <ClientMark
                :client="registered('Global Fashion Group')"
                mark="h-8 w-auto max-w-40 object-contain"
              />
            </template>
            <template #actions>
              <MiniButton
                label="Customers"
                icon="pi pi-angle-right"
                :href="SUCCESS_CASES"
                target="_blank"
              />
            </template>
          </Quote>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- Band 15 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 16 + 17 — the stories, titled and then told ────────────────────
         The source scrolls eleven cards sideways behind prev/next controls. Eleven do not fit
         one row of this frame, so they become a four-row hairline grid — the seams are the
         grid's own `gap-px`, and nothing scrolls. The twelfth slot is filled so the last row
         closes on the frame instead of leaving a border-coloured gap.
         Every cell is its own link: `href` makes the card the anchor, so hover lifts the whole
         surface and the focus ring is drawn INSET — an offset ring would be clipped by the
         one-pixel seam of the next cell. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Success Stories"
          title="The Infrastructure Behind Leading E-Commerce Brands"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          kind="divider"
          :columns="3"
        >
          <ClientKpiQuote
            v-for="story in STORIES"
            :key="story.href"
            :client="story.client"
            :client-name="story.clientName"
            :kpi="story.kpi"
            :text="story.text"
            :href="story.href"
            :aria-label="storyLabel(story)"
            target="_blank"
          >
            <!-- The one mark this repo holds as a file rather than as a registry entry;
                 `monochrome` paints it in the same single ink the registry marks take. -->
            <template
              v-if="story.mark"
              #mark
            >
              <ClientMark
                :client="story.mark"
                monochrome
                mark="h-full w-auto max-w-32 object-contain"
              />
            </template>
          </ClientKpiQuote>

          <!-- The twelfth cell of an eleven-card grid: it fills the seam the last row would
               otherwise leave open, at every column count the grid takes. -->
          <div
            class="bg-(--bg-canvas)"
            aria-hidden="true"
          />
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- Band 18 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 19 + 20 — the certifications, titled and then shown ────────────
         Five cells on the grid's own seams. `justify-end` shares one baseline across the row,
         so each badge hangs above its pill whatever its own aspect ratio is. No badge is
         filtered on this shell: three carry their own brand colours and the fourth is already
         drawn in the near-white ink a dark-only page wants. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Scale with Confidence"
          title="Security and Compliance for High-Stakes Digital Experiences"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="grid grid-cols-2 gap-px bg-(--border-default) sm:grid-cols-5">
          <div
            v-for="certification in CERTIFICATIONS"
            :key="certification.label"
            class="flex flex-col items-center justify-end gap-(--spacing-lg) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <img
              v-if="certification.badge"
              :src="certification.badge"
              :alt="certification.alt"
              class="h-16 w-auto max-w-24 object-contain"
            />
            <Tag
              rounded
              severity="success"
              icon="pi pi-check"
              :label="certification.label"
            />
          </div>

          <!-- The sixth cell of a two-track grid on a phone: two columns leave the fifth
               badge alone on its row, and this fills the seam beside it. -->
          <div
            class="bg-(--bg-canvas) sm:hidden"
            aria-hidden="true"
          />
        </div>
      </FrameBox>
    </SectionModule>

    <!-- Band 21 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 22 + 23 — the platform, titled and then listed ─────────────────
         Four groups in a four-column grid — the shape the three sibling translations already
         use for this same band, so our own pages state the platform one way. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Built for Speed"
          title="Composable Primitives for Performance and Personalization"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          kind="divider"
          :columns="4"
          :mobile-columns="2"
        >
          <NavColumn
            v-for="group in PRODUCT_GROUPS"
            :key="group.label"
            :title="group.label"
          >
            <NavItem
              v-for="product in group.items"
              :key="product.title"
              :icon="product.icon"
              :title="product.title"
              :description="product.description"
              :href="product.href || '#'"
            />
          </NavColumn>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- Band 24 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 25 — Frequently Asked Questions ─────────────────────────────────
         `Faq` in its hairline register, framed so the band draws its own floor. -->
    <SectionModule
      id="faq"
      :divided="false"
      :padded="false"
    >
      <Faq
        framed
        title="Frequently Asked Questions"
        :items="FAQ"
      >
        <template #answer="{ item }">
          {{ item.answer
          }}<a
            v-if="item.link"
            :href="item.link.href"
            target="_blank"
            rel="noopener"
            class="text-(--text-default) underline underline-offset-2 transition-colors hover:text-(--primary) motion-reduce:transition-none"
            >{{ item.link.label }}</a
          >{{ item.answerAfter }}
        </template>
      </Faq>
    </SectionModule>

    <!-- Band 26 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 27 — the closing CTA ────────────────────────────────────────────
         The Site's own closing band, with this page's strings passed in. Its defaults are the
         homepage's copy, so every string the source states here is explicit. -->
    <SectionModule
      id="contact"
      :divided="false"
      :padded="false"
      class="scroll-mt-(--spacing-xxl)"
    >
      <CallToAction
        framed
        kind="split"
        eyebrow="Build"
        title="Build once."
        title-muted="Run everywhere."
        description="Get a faster path to launch, lower latency, and less infrastructure overhead."
      >
        <template #actions>
          <Button
            label="Start Free"
            kind="secondary"
            size="large"
            @click="goSignup"
          />
        </template>
        <template #aside>
          <Button
            label="Talk to our team"
            kind="outlined"
            size="large"
            href="#"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </CallToAction>
    </SectionModule>

    <!-- Band 28 — the spacer the source closes on, hatched. A bare FrameBox at SectionGap's
         own `medium` height drawing NO rules: the footer below opens with a full-bleed rule,
         and SectionGap's fixed `borders="y"` would land a second hairline on that pixel. -->
    <FrameBox
      borders="none"
      marks="none"
      hatch
      class="h-[calc(var(--spacing-xxl)*2)]"
    />
  </SectionContainer>
  <!-- ══ End framed column ══════════════════════════════════════════════════════ -->
</template>
