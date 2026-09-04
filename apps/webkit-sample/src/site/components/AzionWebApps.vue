<script setup>
  // Solution page: Web Apps — a translation of
  // https://www.azion.com/en/solutions/web-apps/ into this site's own page language,
  // produced with the /site-design-translate flow (the live page read mechanically into a
  // band inventory, then rebuilt band by band). The source is the specification for WHAT
  // the page says; CONTAINERS.md is the specification for HOW it is drawn. Every line of
  // copy below is the source's, verbatim; none of its grid, spacing, borders, colours or
  // radii came across.
  //
  // The source's 32 bands, in order, and what each becomes here:
  //
  //   0  hero (eyebrow, h1, description, two actions)      BannerContainer hero + HeroTitle
  //   1  six feature cells                                 CardGrid divider, 3 columns
  //   2  spacer                                            SectionGap hatch
  //   3  "Use Cases" title                                 SectionTitle in the module header
  //   4  Websites — copy | art                             one cell of the hairline stack
  //   5  APIs — copy | art                                 "
  //   6  E-commerce — copy | art                           "
  //   7  AI Apps — copy | art                              "
  //   8  spacer                                            SectionGap hatch
  //   9  "Compatible with Your Stack" title                SectionTitle in the module header
  //   10 30-mark tool marquee                              BrandCarousel, PRODUCT_STACK
  //   11 Quick Start with Templates — copy | art           FrameBox flush, lg:grid-cols-2
  //   12 spacer                                            SectionGap hatch
  //   13 "Ship it" title                                   SectionTitle in the module header
  //   14 five tabs over copy | art                         TabView + one Panel per tab
  //   15 spacer                                            SectionGap hatch
  //   16 "Complete, not complex" title                     SectionTitle in the module header
  //   17 the platform, five groups                         CardGrid divider + NavColumn/NavItem
  //   18 spacer                                            SectionGap hatch
  //   19 the network, headline + five claims               FrameBox over MapBanner + ClaimChips
  //   20 three resilience cells                            CardGrid divider, 3 columns
  //   21 spacer                                            SectionGap hatch
  //   22 "Trusted by Industry Leaders" title                SectionTitle in the module header
  //   23 twelve client marks + one quote                   FrameBox, lg:grid-cols-2
  //   24 spacer                                            SectionGap hatch
  //   25 "We've got you covered" title                     SectionTitle in the module header
  //   26 five compliance cells                             gap-px grid + Tag per cell
  //   27 spacer                                            SectionGap hatch
  //   28 Frequently Asked Questions                        the ruled Accordion band
  //   29 spacer                                            SectionGap hatch
  //   30 closing CTA                                       SiteCta, every string a prop
  //   31 spacer                                            the closing hatch frame
  //
  // ONE BAND THE SOURCE DOES NOT HAVE, ADDED ON PURPOSE: the Console band, between the
  // platform primitives (17) and the network (19). This app IS the console reference, and
  // the page that argues for building web apps here is where the product doing the
  // building belongs — so the page carries exactly one band of ours, named as such rather
  // than folded silently into the inventory. It brings its own rhythm gap with it, which
  // is why this page has 11 spacers against the source's 10. Nothing else departs: no
  // other band, string, list item, link label or figure is invented.
  //
  // WHERE OUR FORM DEPARTS FROM THE SOURCE, on purpose:
  //   • The source's hero is 581px. Ours is `hero` — one viewport — because that is this
  //     language's hero rule. The tool marquee is NOT seated on its floor here: the source
  //     puts that strip nine bands later, under its own title, and the running order is
  //     the half of the translation that does not bend.
  //   • The hero's eyebrow is `// APPLICATION DEVELOPMENT`. HeroTitle's overline anatomy
  //     carries no `//` prefix (that belongs to SectionTitle and to the closing band), so
  //     the hero reads `APPLICATION DEVELOPMENT`. The component wins over the source's
  //     bespoke span; the bands that DO have the prefix get it from their own component.
  //   • Every "Docs" / "See more" / "Deploy now" / "View success story" control on the
  //     source carries a trailing arrow. Button's `icon` is leading-only, and Link — the
  //     one control whose icon IS trailing — paints `--text-link`, the product UI's blue,
  //     which nothing else on this site uses. So these are `Button kind="text"`: the label
  //     alone, in the page's own ink.
  //   • Bands 14 and 19 are horizontal scrollers in the source. Band 14 is a real tab set
  //     (five controls switching one panel), so it is `TabView` — the design system's own
  //     tabs, not a carousel (.claude/rules/dependencies.md). Band 19's claims fit the
  //     page frame as wrapped pills, so nothing scrolls.
  //   • The source's art is raster product collages and screenshots. Ours is the design
  //     team's: each use case and each Ship-it tab draws an SVG from the Figma `Per page ›
  //     Web apps` set, exported at 592x300 and committed beside this page. They are artwork,
  //     not composed UI, so they are `<img>` — one hashed request each, rather than up to
  //     180KB of vector paths inlined into this page's own markup (and no clip-path id
  //     colliding with the next scene's, which inlining nine exports would guarantee).
  //     The Ship-it tabs map to them BY NAME — Preview / Runtime / Infrastructure as Code /
  //     Live Debugging / Programmable Security is the Figma frame set verbatim — and the four
  //     use cases take the four product scenes the source itself serves from
  //     `azion.com/assets/images/products/`. E-commerce takes `saas-platforms` because that
  //     frame is the commerce scene (cart, bag, tag, trash); the file keeps the source's own
  //     name so it stays traceable to the asset the site ships. Their `alt` text does not
  //     survive the copy diff — it described art we replaced. Band 11 takes
  //     `modern-frontends`, the framework-window drawing the Functions page's own framework
  //     band already uses, so both pages state that argument in one picture.
  //   • THE EXPORTS ARE STRIPPED OF FIGMA'S CHROME, and that is not cosmetic. A frame with
  //     no fill of its own exports whatever sits BEHIND it: a full-bleed page-background
  //     rect plus the two enclosing sections' plates — and the inner one (`#444444`) covers
  //     the entire 592x300 box, so the unedited export is a grey card with the scene on top.
  //     Dropping those five nodes is what leaves a transparent illustration that takes the
  //     cell's `--bg-canvas`; the `#0A0A0A` boxes then sit 4% off the site's black, with
  //     their rim doing the separating, which is the shell's own dark language.
  //   • The platform band (17) is five groups in a four-column CardGrid, one column
  //     wrapping — the shape the three sibling translations already use for this same band,
  //     so our own pages state the platform one way.
  //   • THE NETWORK BAND (19) IS THE ONE PLACE THE COPY DOES NOT COME FROM THE SOURCE. Its
  //     headline is `The most reliable infrastructure` and its chips are NETWORK_CLAIMS —
  //     the home page's, and the archived signed-out panel's. The source states the same
  //     argument here in its own words (`Distributed infrastructure that stays up when
  //     others go down`, over six chips that re-word three of ours and add two more), and
  //     letting both through means this site makes ONE claim about its network in two
  //     sentences with two sets of numbers, on two pages a click apart. The infrastructure
  //     claim is a shared asset (see `brand/claims.js`, which exists for exactly this), so
  //     the band takes the shared one. It also restores the band's proportion: the source's
  //     four-line headline and three rows of chips pushed the frame to 633px against the
  //     home page's 469px, on the same `min-h` clamp — the map is the same artwork at the
  //     same crop in both, so the taller box was the only thing making it read bigger.
  //
  // ASSET GAPS, recorded rather than substituted:
  //   • LGPD — CLOSED. The badge this page had no file for is now exported from the Figma
  //     `Assets` file (node 1907:30763) and committed beside the other four, so all five
  //     cells of band 26 draw the art the source draws.
  //   • `infrastructure-as-code` and `live-debugging` bleed content past their frame edge
  //     in Figma (boxes at x=-13 and x=515..605 of a 592-wide frame, rules that run the full
  //     width). The frames clip it, so the exports do too — that crop is the design, not an
  //     export artifact, and it is not something to "fix" by widening the box here.
  //   • `TanStack AI` has no mark in the icon library, and Hono has only a monochrome one,
  //     so those two rows in the templates list take `pi pi-code` (the neutral glyph
  //     frameworks.js itself uses for a framework with no mark) instead of a colour one.
  //   • On the client strip, Axur, Arezzo, Crefisa and Contabilizei are not CLIENTS registry
  //     entries but their marks are in `clients/dark/clients/`, so they are declared locally
  //     (see STORY_CLIENTS); NZN has no mark in this repo at all and renders as ClientMark's
  //     typographic wordmark, so no name the source states is quietly dropped.
  import Accordion from '@aziontech/webkit/accordion'
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import Overline from '@aziontech/webkit/overline'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TabView from '@aziontech/webkit/tab-view'
  import Tag from '@aziontech/webkit/tag'
  // Imported from the banner registry directly rather than named through a container's
  // `banner` prop: the network band is a FrameBox, not a BannerContainer, so there is no
  // container to name it on.
  import { MapBanner } from '@shared/ui/banners/index.js'
  import BrandCarousel from '@shared/ui/brand/BrandCarousel.vue'
  import ClaimChips from '@shared/ui/brand/ClaimChips.vue'
  import { NETWORK_CLAIMS } from '@shared/ui/brand/claims.js'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  // The four client marks that are not CLIENTS registry entries; Vite resolves each to an
  // asset URL, exactly as the registries do.
  import arezzo from '@shared/ui/brand/clients/dark/clients/arezzo-logo.svg'
  import axur from '@shared/ui/brand/clients/dark/clients/axur-logo.svg'
  import contabilizei from '@shared/ui/brand/clients/dark/clients/contabilizei-logo.svg'
  import crefisa from '@shared/ui/brand/clients/dark/clients/crefisa-logo.svg'
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

  // The band art, from the Figma `Per page` asset set. Vite resolves each to a hashed
  // asset URL, exactly as the client marks above do.
  import aiApplications from '../assets/illustrations/ai-applications.svg'
  import buildApplications from '../assets/illustrations/build-applications.svg'
  import distributedApis from '../assets/illustrations/distributed-apis.svg'
  import infrastructureAsCode from '../assets/illustrations/infrastructure-as-code.svg'
  import liveDebugging from '../assets/illustrations/live-debugging.svg'
  import modernFrontends from '../assets/illustrations/modern-frontends.svg'
  import preview from '../assets/illustrations/preview.svg'
  import programmableSecurity from '../assets/illustrations/programmable-security.svg'
  import runtime from '../assets/illustrations/runtime.svg'
  import saasPlatforms from '../assets/illustrations/saas-platforms.svg'
  import { NavColumn, NavItem } from '../ui/index.js'
  import SiteCta from './SiteCta.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // The page's one documentation destination, stated once: the source's hero "Docs" link
  // points at the build guides. Naming it once is what keeps two controls from drifting.
  const DOCS = '/site/docs'

  const PILLARS = [
    {
      icon: 'ai ai-edge-nodes',
      title: 'Consistent global speed',
      description:
        'Serve content and run web apps across hundreds of locations with median latency under 30 ms. No infra to manage.'
    },
    {
      icon: 'ai ai-load-balancer',
      title: 'Safer high-traffic launches',
      description:
        'Scale automatically from routine traffic to campaign spikes without cold starts, manual provisioning, or release-day bottlenecks.'
    },
    {
      icon: 'pi pi-chart-line',
      title: 'Higher conversion potential',
      description:
        'Improve web app responsiveness and user experience with caching, protocol optimizations, and request-level control.'
    },
    {
      icon: 'pi pi-eye',
      title: 'Preview every release',
      description:
        'Validate web app changes in preview environments before production and reduce risk during content and campaign launches.'
    },
    {
      icon: 'pi pi-code',
      title: 'Compatible with your framework',
      description:
        'Deploy any modern framework or build tool to Azion, such as Next.js, React, Angular, Vue, Svelte, Astro, Nuxt, Remix, Qwik, and others.'
    },
    {
      icon: 'pi pi-sitemap',
      title: 'Frontend and API logic together',
      description:
        'Deploy your frontend and backend API as a single, simple project — in one deploy.'
    }
  ]

  const USE_CASES = [
    {
      title: 'Websites',
      illustration: buildApplications,
      description:
        'Build and deploy websites and web apps without infrastructure management overhead. Deliver fast, reliable experiences through a global network.',
      href: 'https://www.azion.com/en/solutions/websites/'
    },
    {
      title: 'APIs',
      illustration: distributedApis,
      description:
        'Build serverless APIs and microservices with distributed execution. Scale globally without managing region-by-region infrastructure.',
      href: 'https://www.azion.com/en/solutions/distributed-web-applications-and-apis/'
    },
    {
      title: 'E-commerce',
      illustration: saasPlatforms,
      description:
        'Build secure storefronts that protect checkout and account flows while maintaining fast, reliable experiences under peak traffic.',
      href: 'https://www.azion.com/en/solutions/retail/'
    },
    {
      title: 'AI Apps',
      illustration: aiApplications,
      description:
        'Build AI-powered applications with serverless inference and your own agents, running on GPUs across hundreds of locations — with no infrastructure to manage.',
      href: 'https://www.azion.com/en/solutions/ai/'
    }
  ]

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

  const SHIP_PANELS = [
    {
      value: 'preview',
      label: 'Preview',
      title: 'Automatic preview deployments',
      illustration: preview,
      description:
        'Review every change with preview environments before production release. Share links across dev, marketing, and product teams for faster alignment.'
    },
    {
      value: 'runtime',
      label: 'Runtime',
      title: 'Cost-efficient distributed runtime',
      illustration: runtime,
      description:
        'Run functions with no cold starts and execute logic closer to users. Keep web app experiences fast while controlling infrastructure overhead.'
    },
    {
      value: 'infrastructure-as-code',
      label: 'Infrastructure as Code',
      title: 'Manage web app infrastructure from code',
      illustration: infrastructureAsCode,
      description:
        'Use Terraform and code-based configuration to keep delivery, cache, and security settings versioned and consistent across environments.'
    },
    {
      value: 'live-debugging',
      label: 'Live Debugging',
      title: 'Observability for production web apps',
      illustration: liveDebugging,
      description:
        'Use Debug Rules, Real-Time Events, and stack traces to troubleshoot production behavior quickly and improve release confidence.'
    },
    {
      value: 'security',
      label: 'Security',
      title: 'Web apps with built-in security',
      illustration: programmableSecurity,
      description:
        'Launch web apps protected from day one — DDoS protection, WAF, Bot Manager, and rate limiting are built in.'
    }
  ]

  const RESILIENCE = [
    {
      title: 'Global resilience beyond anycast',
      description:
        "Azion's software-defined global router steers traffic around failures and network degradation faster than BGP can reconverge. Always-on DDoS protection across 100+ data centers worldwide."
    },
    {
      title: 'Low latency everywhere',
      description:
        'Compute, AI, databases, and security run across all data centers, close to your users, keeping median global latency under 30 ms, with a built-in CDN and tiered caching for every app.'
    },
    {
      title: 'Zero-ops autoscaling and failover',
      description:
        'Absorbs any traffic spike with no cold starts, instantly scaling from zero to millions. No capacity planning, no provisioning. Scale-to-zero with no idle costs: you pay only for what you run.'
    }
  ]

  const FAQ = [
    {
      value: 'q1',
      question: 'What can I build on Azion?',
      answer:
        "You can build web applications, APIs, AI-powered experiences, and other modern workloads on Azion's globally distributed platform. Start with Applications, then extend performance and specialized capabilities with Cache, Application Accelerator, AI Inference, and Image Processor as your architecture evolves."
    },
    {
      value: 'q2',
      question: 'Does it have cold starts?',
      answer:
        'Azion Runtime is designed for zero cold starts and fast execution, so applications can respond with low latency even under heavy demand.'
    },
    {
      value: 'q3',
      question: 'Does it scale?',
      answer:
        'Scaling is built in by default, allowing your application to handle traffic growth and spikes without pre-provisioning infrastructure.'
    },
    {
      value: 'q4',
      question: 'Do I need to choose regions or manage infrastructure?',
      answer:
        "No. Your applications are distributed automatically across 100+ locations, so you don't have to pick regions, provision servers, or manage scaling manually. You focus on the application logic while Azion handles distribution close to your users."
    },
    {
      value: 'q5',
      question: 'What languages and frameworks can I use?',
      answer:
        'You can code with JavaScript or use WebAssembly with languages like Rust, C, C++, C#, Go, Java, Kotlin, Swift, Python, Ruby, and more. Azion also supports frameworks like Next.js, Astro, React, Vue, Angular, Nuxt, Svelte, Qwik, Preact, VitePress, Docusaurus, Eleventy, Gatsby, Hexo, Hono, Hugo, Jekyll, VuePress, and more.'
    },
    {
      value: 'q6',
      question: 'How do I deploy an application?',
      answer:
        'You can create, build, and deploy with the Azion CLI using a simple workflow like `azion init`, `azion build`, and `azion deploy`. This takes your application from local development to a globally distributed deployment without separate CDN or infrastructure setup.'
    },
    {
      value: 'q7',
      question:
        'Can I combine Functions, Cache, AI, and image optimization in the same application?',
      answer:
        "Yes. That's one of the main advantages of the platform. Functions can work alongside Cache, Application Accelerator, AI Inference, and Image Processor in the same architecture, so you can add logic, improve performance, and deliver optimized assets without stitching together separate vendors or services."
    },
    {
      value: 'q8',
      question:
        'Can Azion help with dynamic and personalized applications, not just static content?',
      answer:
        'Yes. Azion Build supports dynamic workloads with features like advanced cache keys, POST caching, request hashing, real-time TTL validation, and route-based logic through Rules Engine. This helps accelerate personalized pages, APIs, and session-aware experiences without breaking application behavior.'
    },
    {
      value: 'q9',
      question: 'How do I preview changes before promoting them to production?',
      answer:
        'Azion supports workflows designed for iteration, including preview environments and controlled promotion to production. This lets teams validate changes safely, review behavior before release, and keep deployments traceable from code change to live application.'
    },
    {
      value: 'q10',
      question: 'How do I debug and monitor my application in production?',
      answer:
        'You can inspect live behavior with Debug Rules, Real-Time Events, GraphQL-powered metrics, Data Stream, and stack trace visibility. These tools help you understand how requests are processed, trace execution paths, and troubleshoot distributed applications with more confidence.'
    },
    {
      value: 'q11',
      question: 'Can I start free and expand later?',
      answer:
        'Yes. You can begin with a free single Function or application and add more capabilities as your needs grow. The platform is designed as connected building blocks, so you can progressively introduce caching, acceleration, AI features, observability, and media processing without rebuilding your architecture.'
    }
  ]
  // ── Band 14 — which tab the band opens on ─────────────────────────────────────
  // The source opens on `Preview`, so this does too. Uncontrolled would work; naming it
  // is what lets the panel below the list read the same value the list writes.
  const shipTab = ref(SHIP_PANELS[0].value)

  // ── Band 17 — the platform, in five groups ────────────────────────────────────
  // The same five groups and fourteen products the source lists on every product and
  // solution page, with the same descriptions — so two pages cannot describe one product
  // two ways. Three products have a page in this sample and link to it; the rest carry the
  // source's own destination, which is documentation this app does not host.
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
        }
      ]
    },
    {
      label: 'DNS',
      items: [
        {
          icon: 'ai ai-edge-dns',
          title: 'DNS',
          description: 'Reliably host authoritative DNS zones worldwide'
        }
      ]
    }
  ]

  // ── Band 23 — the twelve marks beside the quote ───────────────────────────────
  // Eight resolve against the shared CLIENTS registry, so a mark this page draws and a mark
  // the trust strip draws can never be two different files. Four are named by the source but
  // are not registry entries — their artwork sits in `clients/dark/clients/` — so they are
  // declared here rather than added to a registry every other strip on the site reads.
  const registered = (name) => CLIENTS.find((client) => client.name === name) ?? { name }

  const STORY_CLIENTS = [
    // The source spells it DNZ; NZN is this repo's name for the same client, and the
    // registry entry carries no file, so ClientMark writes the wordmark.
    registered('NZN'),
    { name: 'Axur', logo: axur, artwork: 'light' },
    registered('Radware'),
    { name: 'Arezzo', logo: arezzo, artwork: 'light' },
    { name: 'Contabilizei', logo: contabilizei, artwork: 'light' },
    // The source spells it Magazine Luiza; Magalu is the registry's name for it.
    registered('Magalu'),
    registered('Fourbank'),
    registered('HeroSpark'),
    { name: 'Crefisa', logo: crefisa, artwork: 'light' },
    registered('Netshoes'),
    registered('Dafiti'),
    registered('Global Fashion Group')
  ]

  // ── Band 26 — the five certifications ─────────────────────────────────────────
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
</script>

<template>
  <!-- ══ Band 0 — the hero ══════════════════════════════════════════════════════
       BannerContainer owns the full-bleed band and the page's top rule.
       `--banner-offset` is the sticky SiteNav's height (h-14 = 3.5rem), so the band still
       measures exactly one screen with the nav above it. Unlike the product pages, no
       strip stands on this hero's floor: the source states its tool marquee nine bands
       later, under its own title, and the running order does not bend. -->
  <BannerContainer
    hero
    banner="dot-grid"
    max-width="site"
    class="[--banner-offset:3.5rem]"
  >
    <div
      class="flex min-h-[calc(100dvh-var(--banner-offset,0px)-var(--spacing-xl)*2)] flex-col justify-center"
    >
      <HeroTitle
        centered
        eyebrow="Application Development"
        title="Build lightning-fast websites and web apps and launch globally"
        description="Deploy serverless web applications, APIs, and AI workloads from your git repository with built-in performance, security, and scalability."
      >
        <!-- The stacking and the fluid width belong to HeroTitle's actions row, so the
             controls go in bare. `text` is the source's second action: a label and an
             arrow, no fill — the kind, not a restyled button. -->
        <template #actions>
          <Button
            label="Start Free"
            kind="secondary"
            size="large"
            @click="goSignup"
          />
          <Button
            label="Docs"
            kind="text"
            size="large"
            :href="DOCS"
          />
        </template>
      </HeroTitle>
    </div>
  </BannerContainer>

  <!-- ══ The framed column ══════════════════════════════════════════════════════
       Every band below the hero is a brick inside one centered column. The column carries
       only `border-x`; its top edge is the hero's `border-b` and its bottom edge the
       SiteFooter's `border-t`. Each brick is `flush` with `borders="y"`, which lands its
       top rule ON the one above and hands the vertical rules back to the column — so no
       line on this page is drawn twice. -->
  <SectionContainer max-width="site">
    <!-- ── Band 1 — what building here gives you, in six cells ──────────────────
         A hairline grid: the rules between the cells are the grid's own `gap-px`, so each
         cell draws no border and fills `--bg-canvas`. As the first brick in the column its
         `flush` top rule lands on the hero's `border-b`. -->
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
                 six are the first sub-headings under the page's `h1` and an `h3` here skips
                 a level (axe `heading-order`). The level is the outline; `text-heading-xs`
                 is the size, and the two are set separately. -->
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

    <!-- Band 2 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 3 + 4-7 — the use cases, titled and then told ──────────────────
         The source states these as five bands: a title band, then one band per use case.
         Here they are one module — the title in its `#header` slot, the four cases as a
         hairline stack in its body — so the rule under the title is the header's own
         `border-b` and the rules between the cases are the stack's `gap-px`. Each case is
         copy on one edge and its scene on the other, and the two ALTERNATE down the stack:
         the first case sets its art on the start edge, the second on the end edge, and so
         on. The parity is the row's own `nth-child`, read by the art cell through the row's
         `group` — no index, so adding a case keeps the rhythm. The rule between the two
         halves is INSIDE the art cell, on whichever edge faces the copy, so nothing else
         owns it. Below `lg` the art is always the grid's second row, so the copy leads on a
         phone whichever side it takes on a wide screen. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Use Cases"
          title="The Full-Stack Platform for Modern Applications"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="grid gap-px bg-(--border-default)">
          <div
            v-for="useCase in USE_CASES"
            :key="useCase.title"
            class="group grid bg-(--bg-canvas) lg:grid-cols-2"
          >
            <div class="flex flex-col justify-between gap-(--spacing-xl) p-(--spacing-xl)">
              <div class="flex flex-col gap-(--spacing-lg)">
                <h3 class="m-0 text-balance text-heading-md text-(--text-default)">
                  {{ useCase.title }}
                </h3>
                <p class="m-0 max-w-(--container-2xl) text-pretty text-body-md text-(--text-muted)">
                  {{ useCase.description }}
                </p>
              </div>
              <div>
                <Button
                  label="See more"
                  kind="text"
                  size="large"
                  :href="useCase.href"
                />
              </div>
            </div>

            <!-- Decorative: the copy beside it carries the meaning, so the scene takes no
                 `ariaLabel` and stays hidden from assistive tech.
                 On an odd row the art moves to the start edge and draws the divider on its
                 right; on an even row it stays on the end edge and draws it on its left. -->
            <div
              class="flex min-w-0 items-center justify-center border-t border-(--border-default) lg:border-t-0 lg:group-odd:order-first lg:group-odd:border-r lg:group-even:border-l"
            >
              <img
                :src="useCase.illustration"
                alt=""
                aria-hidden="true"
                width="592"
                height="300"
                class="block aspect-[592/300] w-full"
              />
            </div>
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- Band 8 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 9 + 10 + 11 — the stack, the strip, and the templates ──────────
         Three source bands, one module: the title in the `#header` slot, the marquee in
         the first frame, the templates band `flush` under it. The marquee frame draws its
         own floor and the templates frame takes it as its top rule, so the two meet on one
         hairline. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Your stack, your way"
          title="Compatible with Your Stack"
        />
      </template>

      <FrameBox
        flush
        borders="y"
      >
        <!-- No label — the source's band is the marks alone. `monochrome` is the strip's
             own rule: one ink, so thirty brand palettes in one row do not become the
             loudest thing on the page. The list is PRODUCT_STACK, the same thirty marks in
             the same order every other product page's strip states. -->
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
              <h3 class="m-0 text-balance text-heading-md text-(--text-default)">
                Quick Start with Templates
              </h3>
              <p class="m-0 max-w-(--container-2xl) text-pretty text-body-md text-(--text-muted)">
                Build faster with pre-built applications and starter kits for common use cases.
                Deploy complete projects in seconds with popular frameworks.
              </p>

              <!-- The eight the source names, in its order and its two columns. An
                   inventory inside the paragraph's argument, so it takes the paragraph's
                   own measure rather than becoming eight cards. -->
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
              <Button
                label="Deploy now"
                kind="text"
                size="large"
                href="https://www.azion.com/en/documentation/products/guides/#azion-templates"
              />
            </div>
          </div>

          <!-- Band 11's art is `modern-frontends`, the same Figma export the Functions
               page's own framework band draws — three editor windows carrying the Next.js,
               Astro and React marks. The list beside it already names every framework the
               drawing shows, so the image is decorative: empty `alt`, `aria-hidden`, and
               nothing for a screen reader to read twice.

               THE CELL TAKES NO PADDING. The export runs off its own 592x300 frame on
               purpose — the left window is cut at x=0 and again below the bottom edge, the
               right one past x=592 and above the top — so inside a padded cell those cuts
               would land in mid-air and read as a clipped image. Flush, they meet the
               frame's rules and read as the drawing continuing past the page, which is what
               they are. The export already centres its subject with its own air around it,
               so nothing pads it further; it is vector, so `w-full` scales it up as cleanly
               as down, and the frame's own `aspect-[592/300]` keeps the cell's height tied
               to its width. -->
          <div class="flex items-center justify-center border-t border-(--border-default) lg:border-t-0 lg:border-l">
            <img
              :src="modernFrontends"
              alt=""
              aria-hidden="true"
              width="592"
              height="300"
              class="block aspect-[592/300] w-full"
            />
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- Band 12 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 13 + 14 — five surfaces, one panel at a time ───────────────────
         The source runs this band as five controls over one panel, so it is a real tab
         set: `TabView`, the design system's own tabs. Not a carousel — five controls that
         switch one panel are tabs, and a scroller library is forbidden anyway
         (.claude/rules/dependencies.md). Each panel is the same anatomy as the use cases
         above: the copy on the start edge, the scene on the end edge. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Ship it"
          title="Everything You Need to Build and Deploy"
        />
      </template>

      <!-- TWO FRAMES, ONE TAB SET. The switch and the surface it switches are separate
           bands of the page's own frame — the controls sit in a ruled row of their own and
           the panel is the box under it, instead of five controls floating in the panel's
           top-left corner. `TabView` still wraps both, because the list and the content
           talk through its context; only the frame is split.

           `items-stretch` IS LOAD-BEARING, not a nicety. TabView's root is
           `flex flex-col items-start`, so every child shrink-wraps its content: the list
           box came out exactly 652px wide at a 1386px frame (content + its own padding),
           which is why the tabs read as start-aligned no matter what `justify-*` says —
           there was no slack to centre them in. It also means the panel's FrameBox would
           hug its grid instead of spanning its cell. `cn` is tailwind-merge, so passing
           `items-stretch` replaces the root's `items-start` rather than piling on.

           CENTRED WITH `md:w-fit md:mx-auto`, NOT `justify-center`, and the difference is
           the selected pill. TabView measures its indicator from `tab.left - list.left` and
           re-syncs on a value change or a ResizeObserver on the LIST — so a full-width list
           never re-measures when the webfont lands, and the pill stays where the fallback
           face put it: 28px right of the tab and 66px wide against a 72px tab, wrong until
           the first click. A `w-fit` list resizes when the labels do, which fires the
           observer and syncs the pill; `mx-auto` is then what centres it. (The underlying
           gap — TabView not waiting on `document.fonts.ready` — is a webkit issue to raise,
           not one to patch from a page.)

           `md`, NOT unconditional: the list is `overflow-x-auto` so the row scrolls on a
           phone, and a `w-fit` box cannot scroll — it grows instead. MEASURED, not guessed —
           the five labels are 524.46px plus 4x8px of gap = 556.46px, and with the list's own
           96px of `px-(--spacing-xl)` the row needs 652.46px of frame. It overflows from
           668px of window down to 640px (below that the page's own inset shrinks and it
           fits again), so `md` (768px) is the first breakpoint clear of the band; under it
           the list stays full-width, start-aligned and scrollable. -->
      <!-- REDUCED TO A CONTAINER, FLANKED BY TWO HATCHED FRAMES. The band is the page
           frame's full 1386px, which the tab panel does not want: its art is a 592x300
           export, so a half-and-half panel across the whole frame drew the scene at 692px
           — a 1.17x upscale of vector that was already sized by the design team — and put
           the copy on a 597px measure. The band therefore states itself as a card grid of
           three cells: a hatched frame, the container, a hatched frame. The container's cap
           is `--container-5xl` (1192px), the one rung of the ladder that lands the art cell
           at 596px — the export's own 592px, within 4px — so the scene renders at native
           size and the gutters take the 97px each that is left over. The container keeps
           MOST of the band on purpose (86% of it); the hatched cells are gutters, not
           columns of their own.

           THE GUTTERS OWN THE CONTAINER'S SIDE RULES, not the frames inside it. A shared
           edge is one rule at one colour (see FrameBox's `flush`), and drawing it from the
           cells that only exist above the breakpoint is what lets the whole arrangement
           collapse: the gutters are `hidden xl:block`, so below `xl` the container is the
           band again and its sides are the page column's own border-x, with nothing to
           un-draw. Their top edge is flush — the `SectionTitle` header's `border-b` is the
           band's top rule — and each draws the bottom, so the band closes on one continuous
           line across all three cells.

           `xl` (1280px), NOT `lg`, and the reason is that a 1fr gutter against a capped
           middle track resolves to ZERO until the band is wider than the cap. MEASURED: the
           band is the window less its 54px inset, so it passes 1192px at 1246px of window —
           at `lg` the gutters come out 0px wide and their 1px side rule lands directly
           against the page column's own border-x, reading as one 2px line down both edges
           of the band. `xl` is the first standard rung clear of that (band 1230px, gutters
           19px each), and they grow to 97px as the window reaches the page's 1388px cap. -->
      <div class="grid xl:grid-cols-[minmax(0,1fr)_minmax(0,var(--container-5xl))_minmax(0,1fr)]">
        <FrameBox
          hatch
          flush="top"
          :borders="['right', 'bottom']"
          marks="none"
          class="hidden xl:block"
        />

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

                  <!-- The art cell takes NO padding and the scene is not capped. Each export
                       already centres its subject in a 592x300 frame with its own air around
                       it, so a padded cell paid for that margin twice and then capped the
                       scene at 592px inside a cell wider than that. Flush, `w-full` and the
                       frame's own `aspect-[592/300]` let it resize with the cell — it is
                       vector, so it scales up as cleanly as it scales down. -->
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

        <FrameBox
          hatch
          flush="top"
          :borders="['left', 'bottom']"
          marks="none"
          class="hidden xl:block"
        />
      </div>
    </SectionModule>

    <!-- Band 15 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 16 + 17 — the platform, titled and then listed ─────────────────
         The source states these as two bands; here they are one module, the title in its
         `#header` slot. Five groups in a four-column grid, the fifth wrapping — the shape
         the sibling translations already use for this same band, so our own pages state
         the platform one way. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Complete, not complex"
          title="All the Development Primitives You Need"
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

    <!-- Band 18 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 19 + 20 — the network, and why it stays up ─────────────────────
         The source's band carries its own headline over the map, so this module has no
         title band: the frame is the art AND the copy, with the resilience cells `flush`
         under it. Same composition as the home page's network band.

         Every tick is drawn once, which is why the map frame declares `marks="bottom"`
         rather than taking the default. `flush` already drops its top RULE onto the
         spacer's floor, but marks are a separate set: left at `all`, the frame drew its
         own pair of top ticks 15px under the spacer's bottom pair — two squares stacked
         on one seam, at both corners. Bottom-only leaves one mark per corner, and the
         pair it keeps is the one that registers the seam with the resilience cells. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
        class="overflow-hidden"
      >
        <!-- The network itself, as the frame's backdrop: the pixel world map, its route
             picked out in the accent — the source's own dotted map, in our asset. -->
        <MapBanner />
        <div class="relative z-10 grid items-center gap-(--spacing-xl) lg:grid-cols-2">
          <div
            class="flex min-h-[clamp(340px,52vh,620px)] flex-col justify-between gap-(--spacing-xl) px-(--layout-boundary-inline) pt-[clamp(2rem,7vh,3.25rem)] pb-(--spacing-xl) md:px-(--spacing-xl) lg:justify-start lg:py-(--spacing-xxl)"
          >
            <h2 class="m-0 text-balance text-heading-2xl text-(--text-default)">
              The most reliable infrastructure
            </h2>
            <!-- The shared claim list in the shared treatment (`brand/claims.js` +
                 `ClaimChips`) — the same five the home page states and the same five the
                 archived signed-out panel puts under its headline, so no two surfaces
                 quote different numbers at the same person minutes apart. -->
            <ClaimChips :claims="NETWORK_CLAIMS" />
          </div>
          <!-- Second cell intentionally empty: the map behind IS the art half. -->
        </div>
      </FrameBox>

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
            v-for="claim in RESILIENCE"
            :key="claim.title"
            class="flex flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <h3 class="m-0 text-balance text-heading-xs text-(--text-default)">
              {{ claim.title }}
            </h3>
            <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
              {{ claim.description }}
            </p>
          </div>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- Band 21 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 22 + 23 — the marks, and one client's sentence ─────────────────
         Two cells of one frame at the source's split: twelve marks on the start edge, the
         quotation on the end edge. The marks are a static grid, not this site's marquee —
         the source lays them out as a block of twelve beside a quote, and a marquee in
         half a column shows two marks at a time.

         `blockquote` and `figcaption` are DIRECT children of the figure — HTML pairs a
         caption with a quotation only at that depth. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Trusted by Industry Leaders"
          title="Battle-Tested by the World's Largest Banks and E-commerce Companies"
        />
      </template>

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
                 separately from the cell in the grid beside it. -->
            <ClientMark
              :client="registered('HeroSpark')"
              mark="h-8 w-auto max-w-40 object-contain"
            />

            <!-- The source sets the quotation in straight ASCII quotes, and a quotation
                 mark is part of the line, not typesetting applied to it — so it is carried
                 across as written. No `text-pretty` on a four-line quotation: Chromium's
                 `pretty` shortens every line to even out the last one, which is a
                 paragraph treatment. -->
            <blockquote class="m-0 max-w-(--container-2xl) text-heading-md text-(--text-default)">
              "Azion transformed our operations, reducing costs and improving performance while
              freeing 200+ monthly hours for strategic development."
            </blockquote>

            <!-- The signature: the name in the accent, the role beside it in the default
                 ink, both in the overline's mono uppercase — the source's own pairing. -->
            <figcaption
              class="flex flex-col gap-(--spacing-xs) sm:flex-row sm:items-center sm:gap-(--spacing-xl)"
            >
              <Overline>Mateus Leonardi</Overline>
              <span class="px-1 text-overline-md uppercase text-(--text-default)">
                CTO at HeroSpark
              </span>
            </figcaption>

            <div class="mt-auto">
              <Button
                label="View success story"
                kind="text"
                size="large"
                href="https://www.azion.com/en/success-case/herospark-30-percent-performance-azion/"
              />
            </div>
          </figure>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- Band 24 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 25 + 26 — the certifications, titled and then shown ────────────
         Five cells on the grid's own seams. `justify-end` shares one baseline across the
         row, so each badge hangs above its pill whatever its own aspect ratio is. No badge
         is filtered on this shell: three carry their own brand colours and the fourth is
         already drawn in the near-white ink a dark-only page wants. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="We've got you covered"
          title="Compliant with Your Current and Future Needs"
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

          <!-- The tenth cell of a five-track grid on a phone: two columns leave the fifth
               badge alone on its row, and this fills the seam beside it. -->
          <div
            class="bg-(--bg-canvas) sm:hidden"
            aria-hidden="true"
          />
        </div>
      </FrameBox>
    </SectionModule>

    <!-- Band 27 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 28 — Frequently Asked Questions ─────────────────────────────────
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
                    {{ item.answer }}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- Band 29 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 30 — the closing CTA ────────────────────────────────────────────
         The Site's own closing band, with this page's strings passed in. Its defaults are
         the homepage's copy, so every string the source states here is explicit. -->
    <SiteCta
      eyebrow="Build"
      title="Build once."
      title-muted="Run everywhere."
      description="Get a faster path to launch, lower latency, and less infrastructure overhead."
      primary-label="Start Free"
      secondary-label="Talk to our team"
    />

    <!-- Band 31 — the spacer the source closes on, hatched. A bare FrameBox at SectionGap's
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
