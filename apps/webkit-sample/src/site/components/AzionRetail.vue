<script setup>
  // Solution page: Retail — a translation of https://www.azion.com/en/solutions/retail/
  // into this site's own page language, produced with the /site-design-translate flow (the
  // live page read mechanically into a band inventory, then rebuilt band by band). The
  // source is the specification for WHAT the page says; CONTAINERS.md is the specification
  // for HOW it is drawn. Every line of copy below is the source's, verbatim; none of its
  // grid, spacing, borders, colours or radii came across.
  //
  // A SOLUTION page by INDUSTRY, beside /site/financial-services — but on azion.com's LONG
  // solution template (29 bands), the one /site/web-apps runs, not the 20-band template the
  // other two industry pages run. So its bricks come from AzionWebApps.vue (the marquee +
  // templates module, the tab set, the marks-beside-a-quote frame, the ruled FAQ) and its
  // register from AzionFinancialServices.vue / AzionTechnology.vue, the pages it sits next
  // to in the Solutions menu.
  //
  // The source's 29 bands, in order, and what each becomes here:
  //
  //   0  hero (eyebrow, h1, description, two actions)      BannerContainer hero + HeroTitle
  //   1  11-mark client marquee                            BrandCarousel, on the hero's floor
  //   2  spacer                                            SectionGap hatch
  //   3  six argument cells                                CardGrid divider, 3 columns
  //   4  spacer                                            SectionGap hatch
  //   5  "Compatible with Your Stack" title                SectionTitle in the module header
  //   6  30-mark stack marquee                             BrandCarousel, PRODUCT_STACK
  //   7  Quick Start with Templates — copy | art           FrameBox flush, lg:grid-cols-2
  //   8  spacer                                            SectionGap hatch
  //   9  "Everything You Need to Build and Deploy"         SectionTitle in the module header
  //   10 four tabs over copy | art                         TabView + one Panel per tab
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
  //   27 closing CTA                                       SiteCta, every string a prop
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
  //   • The hero's eyebrow is `// RETAIL`. HeroTitle's overline anatomy carries no `//`
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
  //     is `TabView`, the design system's own tabs, never a carousel
  //     (.claude/rules/dependencies.md).
  //   • Band 17 is a horizontal scroller with prev/next controls on the source. ELEVEN cards
  //     do not fit one row, so unlike the sibling pages this one cannot simply drop the
  //     controls: the cards become a four-row hairline grid instead. That trades the
  //     source's 342px band for a tall one, and it is the honest trade — this language has
  //     no carousel, and a sideways scroller inside a bordered column fights its own frame.
  //   • The source's `Deploy now` / `Docs` / `Customers` / `View success story` controls
  //     carry a trailing arrow. `MiniButton` is the one control in this system whose icon IS
  //     trailing and whose ink is the page's own, so the arrow survives — the same choice
  //     AzionFinancialServices and AzionTechnology make. Button's `icon` is leading-only,
  //     and Link paints `--text-link`, the product UI's blue, which nothing else here uses.
  //   • The source's `DNS` eyebrow in band 23 is a product NAME, not a fifth column: its
  //     four columns are Compute, AI, Data and Security, and DNS is the last product under
  //     Security — the same reading the three sibling pages take of the same component.
  //   • Band 27's headline is one sentence in two tones; SiteCta expresses that as `title` +
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
  //   • Band 7 is the one place this page's art beats its sibling's: AzionWebApps.vue
  //     COMPOSES a skeleton template browser because its source only draws one, but the
  //     `Varejo` set holds a real `Quick start with templates` frame, so this band draws the
  //     design team's own scene. Its `alt` names what OUR art shows, so the source's own art
  //     strings (`Search your apps`, and the three CLI verbs labelling its scene) do not
  //     survive the copy diff: they described art we replaced. Ours states `azion init` /
  //     `azion build` / `azion deploy` as drawn vector, not as page text.
  //
  // ASSET GAPS, recorded rather than substituted:
  //   • Marisa — band 14 names it and the source loads `dark/clients/marisa-logo.svg`, which
  //     this repo has no copy of. ClientMark writes its typographic wordmark instead, so the
  //     name is not quietly dropped from the twelve and no similar mark is substituted.
  //   • NZN is a CLIENTS registry entry that carries no file, so it renders as that same
  //     wordmark — by the registry's design, not a gap opened here.
  //   • LGPD — CLOSED. The badge this page had no file for is now exported from the Figma
  //     `Assets` file (node 1907:30763) and committed beside the other four, so all five
  //     cells of band 20 draw the art the source draws — on the three sibling pages too.
  //   • The source's eighth marquee mark loads `radware-logo.svg` under `alt="Prime Video"` —
  //     a mislabel on the source, verified against its own HTML. The mark it RENDERS is
  //     Radware's, so that is the mark here, under this repo's registry name for it.
  //   • `TanStack AI` has no mark in the icon library and Hono has only a monochrome one, so
  //     those two rows of band 7's list take `pi pi-code` — the neutral glyph the framework
  //     registry itself uses for a framework with no colour mark.
  import Accordion from '@aziontech/webkit/accordion'
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import MiniButton from '@aziontech/webkit/mini-button'
  import Overline from '@aziontech/webkit/overline'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TabView from '@aziontech/webkit/tab-view'
  import Tag from '@aziontech/webkit/tag'
  import BrandCarousel from '@shared/ui/brand/BrandCarousel.vue'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  // The two band-14 marks that are not CLIENTS registry entries; their artwork sits in
  // `clients/dark/clients/`, so they are declared locally rather than added to a registry
  // every other strip on the site reads. Vite resolves each to an asset URL.
  import arezzo from '@shared/ui/brand/clients/dark/clients/arezzo-logo.svg'
  import pernambucanas from '@shared/ui/brand/clients/dark/clients/pernambucanas-logo.svg'
  // The four certification badges this repo holds. Vite resolves each to an asset URL,
  // exactly as the client registries do. NONE is filtered, and each for its own reason: the
  // three colour badges carry their own brand colours, and the LGPD mark is one flat
  // near-white ink (#C1BFBF, its drop shadow drawn as the same ink at a lower opacity),
  // which is the correct ink here because SiteLayout pins every marketing page to the dark
  // theme. Were this band ever placed on a THEMED surface, LGPD — and only LGPD — would
  // need the registry's `light` artwork route: #C1BFBF on a light `--bg-canvas` measures
  // 1.8:1 and effectively disappears.
  import gdprBadge from '@shared/ui/brand/clients/GDPR-logo.svg'
  import { CLIENTS } from '@shared/ui/brand/clients/index.js'
  import lgpdBadge from '@shared/ui/brand/clients/LGPD-logo.svg'
  import pciBadge from '@shared/ui/brand/clients/PCI-logo.svg'
  import socBadge from '@shared/ui/brand/clients/SOC-logo.svg'
  import { PRODUCT_STACK } from '@shared/ui/brand/tools.js'
  import {
    BannerContainer,
    CardGrid,
    SectionContainer,
    SectionModule
  } from '@shared/ui/layout/index.js'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  // The art, from the Figma `Per page › Varejo` set. The four tab scenes are the files the
  // web-apps translation already committed — same frames, same artwork (see THE ART above).
  import infrastructureAsCode from '../assets/illustrations/infrastructure-as-code.svg'
  import liveDebugging from '../assets/illustrations/live-debugging.svg'
  import preview from '../assets/illustrations/preview.svg'
  import quickStartWithTemplates from '../assets/illustrations/quick-start-with-templates.svg'
  import retailApplicationModernization from '../assets/illustrations/retail-application-modernization.svg'
  import runtime from '../assets/illustrations/runtime.svg'
  import { NavColumn, NavItem } from '../ui/index.js'
  import SiteCta from './SiteCta.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // The page's outbound destinations, stated once. Naming the one this page reuses twelve
  // times is what keeps the story links and the `Customers` control from drifting apart.
  const SUCCESS_CASES = 'https://www.azion.com/en/success-case/'

  // ── Band 1 — the eleven marks the strip states ────────────────────────────────
  // The source's marquee, in the source's order. Every name resolves against the shared
  // CLIENTS registry, so a mark this page draws and a mark the home page's trust strip draws
  // can never be two different files.
  const registered = (name) => CLIENTS.find((client) => client.name === name) ?? { name }

  const TRUST_MARKS = [
    registered('Global Fashion Group'),
    registered('HeroSpark'),
    // The source spells it Banco Itaú; Itaú is this repo's registry name for the same client.
    registered('Itaú'),
    // Registry entry with no file — ClientMark writes the wordmark. See ASSET GAPS above.
    registered('NZN'),
    registered('Netshoes'),
    registered('Caixa'),
    registered('Agibank'),
    // The source's alt for this slot says `Prime Video`; the file it loads is Radware's.
    registered('Radware'),
    registered('América Móvil'),
    // The source spells it Grupo Pão de Açucar; GPA is the registry's name for it.
    registered('GPA'),
    registered('Fourbank')
  ]

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

  // ── Band 7 — the eight frameworks the templates list names ────────────────────
  // The source's order, in its own two columns.
  const TEMPLATE_FRAMEWORKS = [
    { name: 'Next.js', icon: 'ai-cor ai-next' },
    { name: 'React', icon: 'ai-cor ai-react' },
    { name: 'Vue', icon: 'ai-cor ai-vue' },
    { name: 'Astro', icon: 'ai-cor ai-astro' },
    { name: 'Angular', icon: 'ai-cor ai-angular' },
    { name: 'Nuxt', icon: 'ai-cor ai-nuxt' },
    { name: 'Hono', icon: 'ai ai-hono' },
    { name: 'TanStack AI', icon: 'pi pi-code' }
  ]

  // ── Band 10 — the four surfaces, one panel at a time ──────────────────────────
  const SHIP_PANELS = [
    {
      value: 'preview',
      label: 'Preview',
      title: 'Automatic Preview Deployments',
      illustration: preview,
      description:
        'Validate every change in preview environments before going live, so campaigns, content, and product updates ship with confidence.'
    },
    {
      value: 'runtime',
      label: 'Runtime',
      title: 'Cost-Efficient Infrastructure',
      illustration: runtime,
      description:
        'Run Functions on V8 isolates with zero cold starts and consistent performance during traffic spikes.'
    },
    {
      value: 'infrastructure-as-code',
      label: 'Infrastructure as Code',
      title: 'Manage Resources with Application Code',
      illustration: infrastructureAsCode,
      description:
        'Use Terraform and code-based configuration to keep workloads, cache, and security rules versioned and consistent across regions and brands.'
    },
    {
      value: 'live-debugging',
      label: 'Live Debugging',
      title: 'Observability Built-In for All Requests',
      illustration: liveDebugging,
      description:
        'Trace requests in production with Debug Rules, Real-Time Events, and stack traces to resolve issues fast during revenue-critical moments.'
    }
  ]

  // The source opens on `Preview`, so this does too. Naming the value is what lets the panel
  // frame below the list frame read the same value the list writes.
  const shipTab = ref(SHIP_PANELS[0].value)

  // ── Band 14 — the twelve marks beside the quote ───────────────────────────────
  // Nine resolve against the shared CLIENTS registry. Two are named by the source but are not
  // registry entries — their artwork sits in `clients/dark/clients/` — and one (Marisa) has
  // no file at all, so ClientMark writes its wordmark. See ASSET GAPS.
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
    // No file in this repo — ClientMark writes the wordmark. See ASSET GAPS.
    { name: 'Marisa' },
    registered('América Móvil'),
    registered('MadeiraMadeira'),
    registered('NZN'),
    { name: 'Pernambucanas', logo: pernambucanas, artwork: 'light' }
  ]

  // ── Band 17 — the eleven stories, and the source's own URLs ───────────────────
  // Every card carries the same `Retail` eyebrow on the source.
  const STORIES = [
    {
      title:
        'Magalu guarantees high availability for hundreds of global-scale applications with enhanced security perimeter',
      href: `${SUCCESS_CASES}magalu/`
    },
    {
      title: 'Lojas Renner handles massive traffic spikes and saves 67% on data transfer costs',
      href: `${SUCCESS_CASES}renner/`
    },
    {
      title: 'Dafiti achieves 86% faster load times and 45% cost reduction in data transfer',
      href: `${SUCCESS_CASES}dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/`
    },
    {
      title: 'MadeiraMadeira cuts cloud costs by 90% and speeds up product delivery at scale',
      href: `${SUCCESS_CASES}madeiramadeira/`
    },
    {
      title: 'Pernambucanas accelerates its e-commerce platform and modernizes customer experience',
      href: `${SUCCESS_CASES}pernambucanas/pernambucanas-relies-on-azion-to-speed-up-its-e-commerce-platform-and-innovate-customer-experience-through-edge-applications/`
    },
    {
      title: 'Netshoes blocks 4M+ threats in six months and protects every shopping journey',
      href: `${SUCCESS_CASES}netshoes/`
    },
    {
      title: 'GPA stops a targeted cyberattack, secures 100+ apps, and reduces costs by 30%',
      href: `${SUCCESS_CASES}gpa-solved-cyberattack/`
    },
    {
      title: 'Quero-Quero strengthens API security and keeps its e-commerce highly available',
      href: `${SUCCESS_CASES}quero-quero/`
    },
    {
      title:
        'Marisa accelerates e-commerce and delivers 85% of traffic from distributed infrastructure',
      href: `${SUCCESS_CASES}marisa/`
    },
    {
      title: 'B2W automates security across its e-commerce platforms with a programmable firewall',
      href: `${SUCCESS_CASES}b2w/`
    },
    {
      title: 'Panvel speeds up its e-commerce by 60% and keeps 100% availability under load',
      href: `${SUCCESS_CASES}panvel/`
    }
  ]

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
          href: '/site/functions'
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
          href: '/site/cache'
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
       BannerContainer owns the full-bleed band and the page's top rule. `--banner-offset`
       is the sticky SiteNav's height (h-14 = 3.5rem), so the band still measures exactly one
       screen with the nav above it. The wrapper declares that height and hands the leftover
       to the copy with `justify-between`: the claim sits in the middle of what is left, the
       strip stands on the floor. -->
  <BannerContainer
    hero
    banner="dot-grid"
    max-width="site"
    class="[--banner-offset:3.5rem]"
  >
    <div
      class="flex min-h-[calc(100dvh-var(--banner-offset,0px)-var(--spacing-xl)*2)] flex-col justify-between gap-(--spacing-xxl)"
    >
      <div class="flex flex-1 flex-col justify-center">
        <HeroTitle
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
            />
          </template>
        </HeroTitle>
      </div>

      <!-- No label — the source's band is the marks alone. `monochrome` is the strip's own
           rule: one ink, so eleven brand palettes in one row do not become the loudest thing
           on the page. -->
      <BrandCarousel
        monochrome
        :clients="TRUST_MARKS"
      />
    </div>
  </BannerContainer>

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
          variant="divider"
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
          <BrandCarousel
            monochrome
            :clients="PRODUCT_STACK"
          />
        </div>
      </FrameBox>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="grid lg:grid-cols-2">
          <div class="flex flex-col justify-between gap-(--spacing-xl) p-(--spacing-xl)">
            <div class="flex flex-col gap-(--spacing-lg)">
              <!-- `h3`: the module's own `h2` is the SectionTitle above it. -->
              <h3 class="m-0 text-balance text-heading-md text-(--text-default)">
                Quick Start with Templates
              </h3>
              <p class="m-0 max-w-(--container-2xl) text-pretty text-body-md text-(--text-muted)">
                Launch storefronts faster with pre-built templates and starter kits for headless
                commerce, marketing pages, and product catalogs. Deploy complete projects in seconds
                with popular frameworks.
              </p>

              <!-- The eight the source names, in its order and its two columns. An inventory
                   inside the paragraph's argument, so it takes the paragraph's own measure
                   rather than becoming eight cards. -->
              <ul class="m-0 grid list-none grid-cols-2 gap-(--spacing-md) p-0">
                <li
                  v-for="framework in TEMPLATE_FRAMEWORKS"
                  :key="framework.name"
                  class="flex items-center gap-(--spacing-sm) text-body-md text-(--text-default)"
                >
                  <i
                    :class="framework.icon"
                    aria-hidden="true"
                    class="text-heading-xxs"
                  />
                  {{ framework.name }}
                </li>
              </ul>
            </div>

            <div>
              <MiniButton
                label="Deploy now"
                icon="pi pi-arrow-right"
                href="https://www.azion.com/en/documentation/products/guides/#azion-templates"
                target="_blank"
              />
            </div>
          </div>

          <!-- The art cell takes NO padding and the scene is not capped. The export already
               centres its subject in a 592x300 frame with its own air around it, so a padded
               cell would pay for that margin twice and then cap the scene at 592px inside a
               wider cell. Flush, `w-full` and the frame's own `aspect-[592/300]` let it
               resize with the cell — it is vector, so it scales up as cleanly as down. -->
          <div
            class="flex items-center justify-center border-t border-(--border-default) lg:border-t-0 lg:border-l"
          >
            <img
              :src="quickStartWithTemplates"
              alt="A project scaffolded from a template, with the azion init, build and deploy steps beside it"
              width="592"
              height="300"
              class="block aspect-[592/300] w-full"
            />
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- Band 8 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 9 + 10 — four surfaces, one panel at a time ────────────────────
         The source runs this band as four controls over one panel, so it is a real tab set:
         `TabView`, the design system's own tabs. Not a carousel — four controls that switch
         one panel are tabs, and a scroller library is forbidden anyway
         (.claude/rules/dependencies.md).

         TWO FRAMES, ONE TAB SET. The switch and the surface it switches are separate bands
         of the page's own frame — the controls sit in a ruled row of their own and the panel
         is the box under it. `TabView` still wraps both, because the list and the content
         talk through its context; only the frame is split.

         `items-stretch` IS LOAD-BEARING. TabView's root is `flex flex-col items-start`, so
         every child shrink-wraps its content — the panel's FrameBox would hug its grid
         instead of spanning the band. `cn` is tailwind-merge, so passing `items-stretch`
         replaces the root's `items-start` rather than piling on.

         CENTRED WITH `md:w-fit md:mx-auto`, NOT `justify-center`: TabView measures its
         selected pill from `tab.left - list.left` and re-syncs on a ResizeObserver on the
         LIST, so a full-width list never re-measures when the webfont lands and the pill
         stays where the fallback face put it. A `w-fit` list resizes when the labels do,
         which fires the observer; `mx-auto` is then what centres it. `md`, not
         unconditional: the list is `overflow-x-auto` so the row scrolls on a phone, and a
         `w-fit` box cannot scroll — it grows instead. -->
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

      <TabView
        v-model:value="shipTab"
        class="items-stretch"
      >
        <FrameBox
          flush
          borders="y"
          marks="none"
        >
          <TabView.List class="px-(--spacing-xl) py-(--spacing-md) md:mx-auto md:w-fit">
            <TabView.Item
              v-for="panel in SHIP_PANELS"
              :key="panel.value"
              :value="panel.value"
              :label="panel.label"
            />
          </TabView.List>
        </FrameBox>

        <FrameBox
          flush
          borders="y"
          marks="bottom"
        >
          <TabView.Content>
            <TabView.Panel
              v-for="panel in SHIP_PANELS"
              :key="panel.value"
              :value="panel.value"
            >
              <div class="grid lg:grid-cols-2">
                <div class="flex flex-col justify-center gap-(--spacing-lg) p-(--spacing-xl)">
                  <h3 class="m-0 text-balance text-heading-md text-(--text-default)">
                    {{ panel.title }}
                  </h3>
                  <p
                    class="m-0 max-w-(--container-2xl) text-pretty text-body-md text-(--text-muted)"
                  >
                    {{ panel.description }}
                  </p>
                </div>

                <div
                  class="flex items-center justify-center border-t border-(--border-default) lg:border-t-0 lg:border-l"
                >
                  <img
                    :src="panel.illustration"
                    alt=""
                    aria-hidden="true"
                    width="592"
                    height="300"
                    class="block aspect-[592/300] w-full"
                  />
                </div>
              </div>
            </TabView.Panel>
          </TabView.Content>
        </FrameBox>
      </TabView>
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
        <div class="grid lg:grid-cols-2">
          <div
            class="order-last flex min-w-0 items-center justify-center border-t border-(--border-default) lg:order-first lg:border-t-0 lg:border-r"
          >
            <img
              :src="retailApplicationModernization"
              alt="A client's applications reaching the customer's systems through the Azion Web Platform"
              width="592"
              height="300"
              class="block aspect-[592/300] w-full"
            />
          </div>

          <!-- `justify-center`, not `justify-between`: this half is a heading and its one
               control, and pushed apart they read as two unrelated things at opposite ends
               of a cell the art makes tall. -->
          <div class="flex flex-col justify-center gap-(--spacing-xl) p-(--spacing-xl)">
            <h2 class="m-0 text-balance text-heading-md text-(--text-default)">
              Accelerate retail application modernization with a distributed architecture
            </h2>

            <div>
              <MiniButton
                label="Docs"
                icon="pi pi-arrow-right"
                href="https://www.azion.com/en/documentation/architectures/edge-application/application-modernization/"
                target="_blank"
              />
            </div>
          </div>
        </div>
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

          <figure
            class="m-0 flex flex-col gap-(--spacing-xl) border-t border-(--border-default) p-(--spacing-xl) lg:border-t-0 lg:border-l"
          >
            <!-- The client SIGNING the quote, above the words — the source names its mark
                 separately from the cell in the grid beside it. Julian H is at Dafiti Group;
                 the mark the source draws over the quotation is its parent group's. -->
            <ClientMark
              :client="registered('Global Fashion Group')"
              mark="h-8 w-auto max-w-40 object-contain"
            />

            <!-- The source sets the quotation in straight ASCII quotes, and a quotation mark
                 is part of the line, not typesetting applied to it — so it is carried across
                 as written. No `text-pretty` on a four-line quotation: Chromium's `pretty`
                 shortens every line to even out the last one, a paragraph treatment. -->
            <blockquote class="m-0 max-w-(--container-2xl) text-heading-md text-(--text-default)">
              "One of the best CDN and WAF solutions I have ever used. Easy to implement and
              integrate, with the speed and low latency that make a real difference for our
              customers."
            </blockquote>

            <!-- The signature: the name in the accent, the role beside it in the default ink,
                 both in the overline's mono uppercase — the source's own pairing. -->
            <figcaption
              class="flex flex-col gap-(--spacing-xs) sm:flex-row sm:items-center sm:gap-(--spacing-xl)"
            >
              <Overline>Julian H</Overline>
              <span class="px-1 text-overline-md uppercase text-(--text-default)">
                IT OPS, SRE &amp; SEC Manager at Dafiti Group
              </span>
            </figcaption>

            <div class="mt-auto">
              <MiniButton
                label="Customers"
                icon="pi pi-arrow-right"
                :href="SUCCESS_CASES"
                target="_blank"
              />
            </div>
          </figure>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- Band 15 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 16 + 17 — the stories, titled and then told ────────────────────
         The source scrolls eleven cards sideways behind prev/next controls. Eleven do not fit
         one row of this frame, so they become a four-row hairline grid — the seams are the
         grid's own `gap-px`, and nothing scrolls. The twelfth slot is filled so the last row
         closes on the frame instead of leaving a border-coloured gap. -->
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
          variant="divider"
          :columns="3"
        >
          <div
            v-for="story in STORIES"
            :key="story.href"
            class="flex flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <Overline>Retail</Overline>
            <h3 class="m-0 flex-1 text-pretty text-heading-xs text-(--text-default)">
              {{ story.title }}
            </h3>
            <div>
              <MiniButton
                label="View success story"
                icon="pi pi-arrow-right"
                :href="story.href"
                target="_blank"
              />
            </div>
          </div>

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
          variant="divider"
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
         The source's split: the heading holds the first third, the questions the rest. The
         seam between them and the rules between the questions are the grid's `gap-px`, so
         neither cell draws a border — and each fills `--bg-canvas`, or the whole band goes
         border-coloured. `--accordion-inset` is declared once on the grid and read by the
         heading, every trigger and every answer, so all three open on one column. -->
    <SectionModule
      id="faq"
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div
          class="grid gap-px bg-(--border-default) [--accordion-inset:var(--spacing-lg)] lg:grid-cols-3 lg:[--accordion-inset:var(--spacing-xl)]"
        >
          <div class="bg-(--bg-canvas) px-(--accordion-inset) py-(--spacing-md)">
            <h2 class="m-0 mt-(--spacing-md) text-balance text-heading-lg text-(--text-default)">
              Frequently Asked Questions
            </h2>
          </div>
          <div class="bg-(--bg-canvas) lg:col-span-2">
            <Accordion
              type="single"
              collapsible
              size="large"
            >
              <Accordion.Item
                v-for="(item, index) in FAQ"
                :key="item.value"
                :value="item.value"
                :class="[
                  'border-(--border-default) data-[state=open]:border-b',
                  index === FAQ.length - 1 && 'border-b-0 data-[state=open]:border-b-0'
                ]"
              >
                <Accordion.Trigger
                  class="border-b-0! py-(--spacing-md) data-[state=open]:min-h-0 data-[state=open]:pb-0"
                >
                  <span class="text-body-md text-(--text-default)">{{ item.question }}</span>
                </Accordion.Trigger>
                <Accordion.Content>
                  <p
                    class="m-0 max-w-(--container-2xl) px-(--accordion-inset) pt-(--spacing-xs) pb-(--spacing-md) text-body-sm text-(--text-muted)"
                  >
                    {{ item.answer
                    }}<a
                      v-if="item.link"
                      :href="item.link.href"
                      target="_blank"
                      rel="noopener"
                      class="text-(--text-default) underline underline-offset-2 transition-colors hover:text-(--primary) motion-reduce:transition-none"
                      >{{ item.link.label }}</a
                    >{{ item.answerAfter }}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- Band 26 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 27 — the closing CTA ────────────────────────────────────────────
         The Site's own closing band, with this page's strings passed in. Its defaults are the
         homepage's copy, so every string the source states here is explicit. -->
    <SiteCta
      eyebrow="Build"
      title="Build once."
      title-muted="Run everywhere."
      description="Get a faster path to launch, lower latency, and less infrastructure overhead."
      primary-label="Start Free"
      secondary-label="Talk to our team"
    />

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
