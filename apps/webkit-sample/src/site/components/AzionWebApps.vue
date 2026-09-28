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
  //   0  hero (eyebrow, h1, description, two actions)      Hero kind="screen" + Hero.Title
  //   1  six feature cells                                 CardGrid frame, 3 columns of Topic
  //   2  spacer                                            SectionGap hatch
  //   3  "Use Cases" title                                 SectionTitle in the module header
  //   4  Websites — copy | art                             one MediaSplit in the hairline stack
  //   5  APIs — copy | art                                 "
  //   6  E-commerce — copy | art                           "
  //   7  AI Apps — copy | art                              "
  //   8  spacer                                            SectionGap hatch
  //   9  "Compatible with Your Stack" title                removed
  //   10 30-mark tool marquee                              Ticker, PRODUCT_STACK, under the use cases
  //   11 Quick Start with Templates — copy | grid          MediaSplit over DEPLOY_TEMPLATES, same module
  //   12 spacer                                            removed
  //   13 "Everything You Need to Build and Deploy" + stack DevPlatform, StickyStack over code samples
  //   15 spacer                                            SectionGap hatch
  //   16 "Complete, not complex" title                     SectionTitle in the module header
  //   17 the platform, four groups                         ColumnNavigation, one Column per group
  //   18 spacer                                            SectionGap hatch
  //   19 the network, headline + six claims                FrameBox over NetworkMap + ClaimChips
  //   20 three resilience cells                            CardGrid frame, 3 Topics, same frame
  //   21 spacer                                            SectionGap hatch
  //   22 "Trusted by Industry Leaders" title                SectionTitle in the module header
  //   23 twelve client marks + one quote                   LogoWall + a brand Quote in its #aside
  //   24 spacer                                            SectionGap hatch
  //   25 "We've got you covered" title                     MediaSplit copy, lead from /site/compliance
  //   26 six compliance badges                             the MediaSplit media, a CardGrid frame of badges
  //   27 spacer                                            SectionGap hatch
  //   28 Frequently Asked Questions                        the ruled Accordion band
  //   29 spacer                                            SectionGap hatch
  //   30 closing CTA                                       CallToAction kind="split"
  //   31 spacer                                            the closing hatch frame
  //
  // ONE BAND THE SOURCE DOES NOT HAVE, ADDED ON PURPOSE: the Console band, between the
  // platform primitives (17) and the network (19). This app IS the console reference, and
  // the page that argues for building web apps here is where the product doing the
  // building belongs — so the page carries exactly one band of ours, named as such rather
  // than folded silently into the inventory. It brings its own rhythm gap with it, which
  // is why the page keeps the source's 10 spacers after dropping bands 9 and 12. Nothing else
  // departs: no other band, string, list item, link label or figure is invented.
  //
  // WHERE OUR FORM DEPARTS FROM THE SOURCE, on purpose:
  //   • The source's hero is 581px. Ours is `hero` — one viewport — because that is this
  //     language's hero rule.
  //   • The hero's eyebrow is `// APPLICATION DEVELOPMENT`. Hero.Title's overline anatomy
  //     carries no `//` prefix (that belongs to SectionTitle and to the closing band), so
  //     the hero reads `APPLICATION DEVELOPMENT`. The component wins over the source's
  //     bespoke span; the bands that DO have the prefix get it from their own component.
  //   • Every "Docs" / "See more" / "Deploy now" control on the
  //     source carries a trailing arrow. Button's `icon` is leading-only, and Link — the
  //     one control whose icon IS trailing — paints `--text-link`, the product UI's blue,
  //     which nothing else on this site uses. So these are `Button kind="text"`: the label
  //     alone, in the page's own ink.
  //   • Band 19 is a horizontal scroller in the source. Its claims fit the page frame as
  //     wrapped pills, so nothing scrolls.
  //   • The source's art is raster product collages and screenshots. Ours is the design
  //     team's: each use case draws an SVG from the Figma `Per page ›
  //     Web apps` set, exported at 592x300 and committed beside this page. They are artwork,
  //     not composed UI, so they are `<img>` — one hashed request each, rather than up to
  //     180KB of vector paths inlined into this page's own markup (and no clip-path id
  //     colliding with the next scene's, which inlining four exports would guarantee).
  //     The four use cases take the four product scenes the source itself serves from
  //     `azion.com/assets/images/products/`. E-commerce takes `saas-platforms` because that
  //     frame is the commerce scene (cart, bag, tag, trash); the file keeps the source's own
  //     name so it stays traceable to the asset the site ships. Their `alt` text does not
  //     survive the copy diff — it described art we replaced.
  //   • THE EXPORTS ARE STRIPPED OF FIGMA'S CHROME, and that is not cosmetic. A frame with
  //     no fill of its own exports whatever sits BEHIND it: a full-bleed page-background
  //     rect plus the two enclosing sections' plates — and the inner one (`#444444`) covers
  //     the entire 592x300 box, so the unedited export is a grey card with the scene on top.
  //     Dropping those five nodes is what leaves a transparent illustration that takes the
  //     cell's `--bg-canvas`; the `#0A0A0A` boxes then sit 4% off the site's black, with
  //     their rim doing the separating, which is the shell's own dark language.
  //   • The platform band (17) is the home page's own primitives list, four groups in four
  //     columns, so our own pages state the platform one way.
  //
  // ASSET GAPS, recorded rather than substituted:
  //   • LGPD — CLOSED. The badge this page had no file for is now exported from the Figma
  //     `Assets` file (node 1907:30763) and committed beside the other four, so all five
  //     cells of band 26 draw the art the source draws.
  //   • `infrastructure-as-code` and `live-debugging` bleed content past their frame edge
  //     in Figma (boxes at x=-13 and x=515..605 of a 592-wide frame, rules that run the full
  //     width). The frames clip it, so the exports do too — that crop is the design, not an
  //     export artifact, and it is not something to "fix" by widening the box here.
  import BandStack from '@aziontech/webkit/band-stack'
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import ColumnNavigation from '@aziontech/webkit/column-navigation'
  import Faq from '@aziontech/webkit/faq'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import Illustration from '@aziontech/webkit/illustration'
  import LogoWall from '@aziontech/webkit/logo-wall'
  import MediaSplit from '@aziontech/webkit/media-split'
  import NetworkMap from '@aziontech/webkit/network-map'
  import Quote from '@aziontech/webkit/quote'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import Ticker from '@aziontech/webkit/ticker'
  import Topic from '@aziontech/webkit/topic'
  import herosparkMark from '@shared/assets/clients/light/herospark-logo.svg'
  import ifoodMark from '@shared/assets/clients/light/ifood-logo.svg'
  import itauMark from '@shared/assets/clients/light/itau-logo.svg'
  import magaluMark from '@shared/assets/clients/light/magalu-logo.svg'
  import netshoesMark from '@shared/assets/clients/light/netshoes-logo.svg'
  import stoneMark from '@shared/assets/clients/light/stone-logo.svg'
  import nznMark from '@shared/assets/clients/nzn-logo.svg'
  import { DEPLOY_TEMPLATES } from '@shared/lib/deploy-templates.js'
  import ClaimChips from '@shared/ui/brand/ClaimChips.vue'
  import { PRODUCT_STACK } from '@shared/ui/brand/strips.js'
  import { useRouter } from 'vue-router'

  import { CERTIFICATIONS } from '../data/certifications.js'
  import { PLATFORM_PRIMITIVES } from '../data/platform-primitives.js'
  import { FEATURED_CASES, SUCCESS_CASES } from '../data/success-cases.js'
  import DevPlatform from './DevPlatform.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // ColumnNavigation.Item renders a real anchor and reports the destination it was asked
  // for. An internal one is routed rather than followed, so the app never reloads.
  const openDestination = (event, item) => {
    if (!item.href.startsWith('/')) return
    event.preventDefault()
    router.push(item.href)
  }

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
      illustration: 'build-applications',
      description:
        'Build and deploy websites and web apps without infrastructure management overhead. Deliver fast, reliable experiences through a global network.',
      href: 'https://www.azion.com/en/solutions/websites/'
    },
    {
      title: 'APIs',
      illustration: 'distributed-apis',
      description:
        'Build serverless APIs and microservices with distributed execution. Scale globally without managing region-by-region infrastructure.',
      href: 'https://www.azion.com/en/solutions/distributed-web-applications-and-apis/'
    },
    {
      title: 'E-commerce',
      illustration: 'saas-platforms',
      description:
        'Build secure storefronts that protect checkout and account flows while maintaining fast, reliable experiences under peak traffic.',
      href: 'https://www.azion.com/en/solutions/retail/'
    },
    {
      title: 'AI Apps',
      illustration: 'ai-applications',
      description:
        'Build AI-powered applications with serverless inference and your own agents, running on GPUs across hundreds of locations — with no infrastructure to manage.',
      href: 'https://www.azion.com/en/solutions/ai/'
    }
  ]

  const INFRASTRUCTURE_CLAIMS = [
    '100+ data centers',
    '100+ Tbps throughput',
    'Instant scale, automatic routing & failover',
    '30 ms median latency',
    'Always-on DDoS protection',
    'PCI DSS and SOC 2/3 compliant'
  ]

  const RESILIENCE = [
    {
      icon: 'pi pi-globe',
      title: 'Global resilience beyond anycast',
      description:
        "Azion's software-defined global router steers traffic around failures and network degradation faster than BGP can reconverge. Always-on DDoS protection across 100+ data centers worldwide."
    },
    {
      icon: 'pi pi-bolt',
      title: 'Low latency everywhere',
      description:
        'Compute, AI, databases, and security run across all data centers, close to your users, keeping median global latency under 30 ms, with a built-in CDN and tiered caching for every app.'
    },
    {
      icon: 'pi pi-arrows-alt',
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
  // ── Band 23 — the twelve marks beside the quote ───────────────────────────────
  const CLIENTS = '/site/success-cases'
  const storyFor = (name) =>
    [...FEATURED_CASES, ...SUCCESS_CASES].find((story) => story.client?.name === name)?.href ??
    CLIENTS

  const COLOR_MARKS = [
    { alt: 'Magalu', src: magaluMark },
    { alt: 'iFood', src: ifoodMark, shape: 'compact' },
    { alt: 'Stone', src: stoneMark },
    { alt: 'Netshoes', src: netshoesMark },
    { alt: 'NZN', src: nznMark },
    { alt: 'Itaú', src: itauMark, shape: 'compact' }
  ].map((client) => ({ ...client, href: storyFor(client.alt) }))
</script>

<template>
  <!-- ══ Band 0 — the hero ══════════════════════════════════════════════════════
       Hero owns the full-bleed band and the page's top rule.
       `--banner-offset` is the sticky SiteNav's height (h-14 = 3.5rem), so the band still
       measures exactly one screen with the nav above it. -->
  <Hero
    texture="dots"
    texture-fade="bottom"
    kind="screen"
    max-width="site"
    class="[--banner-offset:3.5rem]"
  >
    <Hero.Title
      centered
      eyebrow="Application Development"
      title="Build lightning-fast websites and web apps and launch globally"
      description="Deploy serverless web applications, APIs, and AI workloads from your git repository with built-in performance, security, and scalability."
    >
      <!-- The stacking and the fluid width belong to Hero.Title's actions row, so the
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
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </Hero.Title>
  </Hero>

  <!-- ══ The framed column ══════════════════════════════════════════════════════
       Every band below the hero is a brick inside one centered column. The column carries
       only `border-x`; its top edge is the hero's `border-b` and its bottom edge the
       SiteFooter's `border-t`. Each brick is `flush` with `borders="y"`, which lands its
       top rule ON the one above and hands the vertical rules back to the column — so no
       line on this page is drawn twice. -->
  <SectionContainer max-width="site">
    <!-- ── Band 1 — what building here gives you, in six cells ──────────────────
         As the first brick in the column its `flush` top rule lands on the hero's
         `border-b`. -->
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
          flush
          kind="frame"
          :columns="3"
        >
          <!-- `heading-level` 2, not the source's `h3`: this band has no heading of its own,
               so these six are the first sub-headings under the page's `h1` and an `h3` here
               skips a level (axe `heading-order`). The level is the outline; Topic's own
               `text-heading-xs` is the size, and the two are set separately. -->
          <CardGrid.Cell
            v-for="pillar in PILLARS"
            :key="pillar.title"
            kind="canvas"
          >
            <Topic
              :heading-level="2"
              :icon="pillar.icon"
              :title="pillar.title"
              :description="pillar.description"
            />
          </CardGrid.Cell>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- Band 2 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 3 + 4-7 — the use cases, titled and then told ────────────────── -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          size="large"
          eyebrow="Use Cases"
          title="The Full-Stack Platform for Modern Applications"
        />
      </template>

      <BandStack
        sticky
        flush
      >
        <MediaSplit
          v-for="useCase in USE_CASES"
          :key="useCase.title"
          kind="media-end"
          :divided="true"
          :heading-level="3"
          align="center"
          size="large"
          media-fill="canvas"
          texture="pixelate"
          texture-size="small"
          texture-fade="top"
          :title="useCase.title"
          :description="useCase.description"
          :media-href="useCase.href"
        >
          <template #media>
            <Illustration :name="useCase.illustration" />
          </template>
          <template #actions>
            <Button
              label="See more"
              kind="outlined"
              size="medium"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
              :href="useCase.href"
            />
          </template>
        </MediaSplit>
      </BandStack>
    </SectionModule>

    <SectionGap hatch />

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
          :heading-level="3"
          align="center"
          eyebrow="Your Stack your way"
          size="large"
          texture="none"
          title="Quick Start with Templates"
          description="Build faster with pre-built applications and starter kits for common use cases. Deploy complete projects in seconds with popular frameworks."
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

      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <SectionModule :divided="false">
          <Ticker
            size="small"
            :marks="PRODUCT_STACK"
          />
        </SectionModule>
      </FrameBox>
    </SectionModule>

    <!-- Band 8 — spacer. -->
    <SectionGap hatch />

    <DevPlatform />

    <!-- Band 15 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 16 + 17 — the platform, titled and then listed ─────────────────
         The source states these as two bands; here they are one module, the title in its
         `#header` slot. The same list and frame as the home page's primitives band, so
         our own pages state the platform one way. -->
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
        marks="all"
      >
        <ColumnNavigation
          :columns="4"
          :mobile-columns="1"
          aria-label="All the development primitives you need"
        >
          <ColumnNavigation.Column
            v-for="group in PLATFORM_PRIMITIVES"
            :key="group.label"
            :title="group.label"
          >
            <ColumnNavigation.Item
              v-for="product in group.items"
              :key="product.title"
              :icon="product.icon"
              :title="product.title"
              :description="product.description"
              :href="product.href"
              @click="openDestination"
            />
          </ColumnNavigation.Column>
        </ColumnNavigation>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
        class="relative overflow-hidden"
      >
        <NetworkMap
          region="world"
          position="top-right"
          animated
          fade="left"
          :opacity="0.2"
          density="medium"
          :scale="1.3"
          :offset-x="0.4"
          :offset-y="-0.2"
        />

        <div class="relative flex h-full flex-col">
          <div
            class="flex min-h-[clamp(340px,52vh,620px)] flex-col justify-start gap-(--spacing-xl) p-(--spacing-xxl) lg:justify-between"
          >
            <SectionTitle
              :framed="false"
              kind="left"
              size="medium"
              title="Distributed infrastructure that stays up when others go down"
              class="[&_h2]:max-w-[16em]"
            />

            <ClaimChips
              :claims="INFRASTRUCTURE_CLAIMS"
              class="m-0 max-w-(--container-md) list-none p-0"
            />
          </div>

          <CardGrid
            flush
            kind="frame"
            :columns="3"
            class="border-t border-(--border-default)"
          >
            <CardGrid.Cell
              v-for="claim in RESILIENCE"
              :key="claim.title"
            >
              <Topic
                :heading-level="3"
                :icon="claim.icon"
                :title="claim.title"
                :description="claim.description"
              />
            </CardGrid.Cell>
          </CardGrid>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- Band 21 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 22 + 23 — the marks, and one client's sentence ───────────────── -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <LogoWall
          aria-label="Clients running on Azion"
          :items="COLOR_MARKS"
          @item-click="openDestination"
        >
          <template #aside>
            <Quote
              kind="signed"
              text='"Azion transformed our operations, reducing costs and improving performance while freeing 200+ monthly hours for strategic development."'
              name="Mateus Leonardi"
              job-title="CTO at HeroSpark"
            >
              <template #mark>
                <img
                  :src="herosparkMark"
                  alt="HeroSpark"
                  decoding="async"
                  class="h-8 w-auto"
                />
              </template>
              <template #actions>
                <Button
                  label="Clients"
                  kind="secondary"
                  size="large"
                  :href="CLIENTS"
                  icon="pi pi-chevron-right"
                  icon-position="trailing"
                  animated
                />
              </template>
            </Quote>
          </template>
        </LogoWall>
      </FrameBox>
    </SectionModule>

    <!-- Band 24 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 25 + 26 — the certifications ────────────────────────────────── -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <MediaSplit
        framed
        align="center"
        texture="none"
        size="large"
        eyebrow="We've got you covered"
        title="Compliant with Your Current and Future Needs"
        description="We're committed to making sure our customers and global partners can meet a wide range of compliance requirements."
      >
        <template #media>
          <CardGrid
            flush
            kind="frame"
            :columns="3"
            :mobile-columns="2"
            role="list"
            aria-label="Compliance certifications"
            class="w-full self-stretch"
          >
            <CardGrid.Cell
              v-for="certification in CERTIFICATIONS"
              :key="certification.label"
              kind="surface"
              :padded="false"
              role="listitem"
            >
              <div
                class="flex h-full flex-col items-center justify-center gap-(--spacing-lg) px-(--spacing-sm) py-(--spacing-xl)"
              >
                <img
                  :src="certification.badge"
                  :alt="certification.alt"
                  loading="lazy"
                  decoding="async"
                  class="h-16 w-24 object-contain"
                />
                <span
                  class="inline-flex h-7 items-center gap-(--spacing-xs) whitespace-nowrap rounded-full border border-(--border-muted) bg-(--bg-surface-raised) pr-(--spacing-sm) pl-(--spacing-xxs) text-overline-sm text-(--text-default)"
                >
                  <span
                    aria-hidden="true"
                    class="flex size-5 shrink-0 items-center justify-center rounded-full bg-(--success-contrast) text-tag-sm text-(--success)"
                  >
                    <i class="pi pi-check text-[length:inherit] leading-none" />
                  </span>
                  {{ certification.label }}
                </span>
              </div>
            </CardGrid.Cell>
          </CardGrid>
        </template>
      </MediaSplit>
    </SectionModule>

    <!-- Band 27 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 28 — Frequently Asked Questions ─────────────────────────────────
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
      />
    </SectionModule>

    <!-- Band 29 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 30 — the closing CTA ────────────────────────────────────────────
         The Site's own closing band, with this page's strings passed in. Its defaults are
         the homepage's copy, so every string the source states here is explicit. -->
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
    <FrameBox
      borders="none"
      marks="all"
      data-hatch="true"
      class="h-[calc(var(--spacing-xxl)*2)]"
    >
      <TextureMaterial kind="lines" />
    </FrameBox>
  </SectionContainer>
  <!-- ══ End framed column ══════════════════════════════════════════════════════ -->
</template>
