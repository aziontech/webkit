<script setup>
  // Product page: Application Accelerator — a translation of
  // https://www.azion.com/en/products/application-accelerator/ into this site's own page
  // language. The source is the specification for WHAT the page says; CONTAINERS.md is the
  // specification for HOW it is drawn. Every line of copy below is the source's, verbatim;
  // none of its grid, spacing, borders, colours or radii came across.
  //
  // The source's 19 bands, in order, and what each becomes here:
  //
  //   0  hero (eyebrow, h1, description, two actions)      Hero kind="screen" + Hero.Title
  //   1  30-mark tool marquee                              Ticker, on the hero's floor
  //   2  spacer                                            SectionGap hatch
  //   3  three feature cells                               CardGrid divider, 3 columns
  //   4  spacer                                            SectionGap hatch
  //   5  copy | art — "Optimize dynamic delivery"          BandStack band, MediaSplit
  //   6  art | copy — "Advanced Cache Key…"                BandStack band, MediaSplit
  //   7  copy | code — "From basic caching…"               FrameBox flush + CodeBlock
  //   8  spacer                                            SectionGap hatch
  //   9  "See how to use" — six cards                      SectionTitle left + CardGrid, 3 cols
  //   10 spacer                                            SectionGap hatch
  //   11 client marks + one quote                          FrameBox, lg:grid-cols-2
  //   12 "A full-stack platform that scales instantly"     SectionTitle in the module header
  //   13 the platform, four columns                        CardGrid divider + NavColumn/NavItem
  //   14 spacer                                            SectionGap hatch
  //   15 Frequently Asked Questions                        the ruled Accordion band
  //   16 spacer                                            SectionGap hatch
  //   17 closing CTA                                       CallToAction kind="split"
  //   18 spacer                                            the closing hatch frame
  //
  // WHERE OUR FORM DEPARTS FROM THE SOURCE, on purpose:
  //   • The source's hero is 580px. Ours is `hero` — one viewport — because that is this
  //     language's hero rule.
  //   • The source runs the tool strip as its own bordered band under the hero. Here it
  //     stands on the hero's floor and the hero's own `border-b` is the rule that divides
  //     it from the column — the same single line, one owner. AzionHome and AzionFunctions
  //     both seat their strip this way, so the three pages read as one site.
  //   • The hero's eyebrow is `// APPLICATION ACCELERATOR`. Hero.Title's overline anatomy
  //     carries no `//` prefix (that belongs to SectionTitle and to the closing band), so
  //     the hero reads `APPLICATION ACCELERATOR`. The component wins over the source's
  //     bespoke span; the two bands that DO have the prefix get it from their own component.
  //   • The source's "Docs" / "Learn more" / "View example" controls carry a trailing arrow.
  //     Button's `icon` is leading-only, and Link — the one control whose icon IS trailing —
  //     paints `--text-link`, the product UI's blue, which nothing else on this site uses. So
  //     these are `Button kind="text"`: the label alone, in the page's own ink. The arrow was
  //     decoration on the source's control, and the label is the control either way. Band 9 is
  //     the exception: its cells carry no control at all — each claim is itself the link, so
  //     the arrow lands on the headline where Topic draws it.
  //   • Bands 9 and 15 are horizontal scrollers with prev/next controls in the source. Six
  //     cards fit the page frame as two rows of three, and a row that cannot be over-scrolled
  //     needs no controls — nor a carousel library (.claude/rules/dependencies.md).
  //   • The source's art is two raster product collages. Ours is the design system's own:
  //     band 5 selects the registered `infrastructure-as-code` scene, band 6 the
  //     `distributed-apis` one. Their `alt` text therefore does not survive the copy
  //     diff: it described art we replaced.
  //
  // ASSET GAPS: none on the tool strip — all 30 marks the source names have a file in
  // `@aziontech/webkit/assets/*`. On the client strip, Axur, Arezzo, Crefisa and Contabilizei
  // are not CLIENTS registry entries but their marks are in `clients/dark/`, so they
  // are declared locally (see STORY_CLIENTS); NZN and Zoop have no mark in this repo at all
  // and render as ClientMark's typographic wordmark, so no name is quietly dropped.
  // The four client marks that are not CLIENTS registry entries; Vite resolves each to an
  // asset URL, exactly as the registries do.
  import arezzo from '@aziontech/webkit/assets/arezzo-extended-reversed.svg'
  import axur from '@aziontech/webkit/assets/axur-extended-reversed.svg'
  import contabilizei from '@aziontech/webkit/assets/contabilizei-extended-reversed.svg'
  import crefisa from '@aziontech/webkit/assets/crefisa-extended-reversed.svg'
  import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
  import BandStack from '@aziontech/webkit/band-stack'
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Faq from '@aziontech/webkit/faq'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
  import Quote from '@aziontech/webkit/quote'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Ticker from '@aziontech/webkit/ticker'
  import Topic from '@aziontech/webkit/topic'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { PRODUCT_STACK } from '@shared/ui/brand/strips.js'
  import { useRouter } from 'vue-router'

  import { NavColumn, NavItem } from '../ui/index.js'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // The page's one outbound destination, stated once: every "Docs" / "Learn more" /
  // "View docs" control on the source page points at the same Application Accelerator
  // reference. Naming it once is what keeps six controls from drifting to five URLs.
  const DOCS = '/site/docs'

  // ── Band 1 — the stack the strip states ───────────────────────────────────────
  // The source's marquee, in the source's order, all 30 marks — shared with every other
  // product page's hero, so two pages cannot state the platform's compatibility two ways.
  // See PRODUCT_STACK for why it is not `TOOLS` (the home page's own, shorter list).

  // ── Band 3 — what the module is, in three cells ───────────────────────────────
  // The source draws a bolt, a gear and a grid over each cell. Ours are the same three
  // ideas from the icon library the rest of the page glyphs come from.
  const PILLARS = [
    {
      icon: 'pi pi-bolt',
      title: 'Faster dynamic applications',
      description:
        'Accelerate APIs and web apps with protocol optimizations, connection reuse, and cache rules that reduce latency before requests reach your origin.'
    },
    {
      icon: 'pi pi-sliders-h',
      title: 'Fine-grained cache control',
      description:
        'Define how content varies by method, path, query string, cookie, or header so teams can cache dynamic experiences without breaking personalization.'
    },
    {
      icon: 'pi pi-th-large',
      title: 'Global acceleration without replatforming',
      description:
        'Apply acceleration on a distributed architecture in front of existing origins, improving performance without rewriting applications or changing where data lives.'
    }
  ]

  // ── Band 5 — the four surfaces the rules are written from ─────────────────────
  const SURFACES = [
    { icon: 'ai ai-azion', label: 'Console' },
    { icon: 'ai ai-azion-cli', label: 'CLI' },
    { icon: 'ai ai-azion-api', label: 'API' },
    { icon: 'ai ai-terraform', label: 'Terraform' }
  ]

  // ── Band 6 — what Advanced Cache Key gives you ────────────────────────────────
  const CACHE_KEY = [
    { icon: 'ai ai-filter-alt', label: 'Query string rules' },
    { icon: 'ai ai-variables', label: 'Cookie variation' },
    { icon: 'ai ai-json', label: 'Header support' },
    { icon: 'ai ai-tiered-cache', label: '64 cache keys' }
  ]

  // ── Band 7 — the sample the band is talking about ─────────────────────────────
  // One tab, so CodeBlock renders the filename bar and no tab strip — the source's shape.
  const CACHE_SETTINGS = `{
  "cache_settings": {
    "name": "api-cache",
    "browser_cache_settings": {
      "ttl": 60
    },
    "cdn_cache_settings": {
      "ttl": 30
    },
    "cache_key": {
      "query_string": "whitelist",
      "query_string_fields": ["user_id", "category"],
      "cookie": "whitelist",
      "cookie_names": ["session_id", "region"]
    },
    "methods": ["GET", "POST", "OPTIONS"],
    "stale_cache": true
  }
}`

  const codeTabs = [
    {
      label: 'cache-settings.json',
      value: 'cache-settings',
      language: 'json',
      code: CACHE_SETTINGS,
      fileName: 'cache-settings.json',
      fileIcon: 'ai ai-json'
    }
  ]

  // ── Band 9 — six ways the module is used ──────────────────────────────────────
  const USE_CASES = [
    {
      icon: 'ai ai-azion-api',
      title: 'Accelerate REST and GraphQL APIs',
      description:
        'Cache API responses with query string and cookie-based segmentation for faster client applications.',
      href: '/site/home'
    },
    {
      icon: 'pi pi-shopping-cart',
      title: 'Optimize product catalogs',
      description:
        'Segment listings by category, region, and user preferences with cache key rules.',
      href: '/site/home'
    },
    {
      icon: 'ai ai-layers',
      title: 'Personalize multi-tenant apps',
      description: 'Serve tenant-specific content with cookie-based cache variation rules.',
      href: DOCS
    },
    {
      icon: 'ai ai-live-ingest',
      title: 'Stream content faster',
      description:
        'Cache playlists and user preferences while serving browsing content efficiently.',
      href: DOCS
    },
    {
      icon: 'pi pi-bolt',
      title: 'Reduce API latency',
      description: 'Short TTLs for rapidly changing data endpoints and real-time applications.',
      href: DOCS
    },
    {
      icon: 'pi pi-user',
      title: 'Deliver personalized experiences',
      description:
        'Cache user-specific content with session-based cookie variation for tailored delivery.',
      href: DOCS
    }
  ]

  // ── Band 11 — the twelve marks beside the quote ───────────────────────────────
  // Eight resolve against the shared CLIENTS registry, so a mark this page draws and a mark
  // the trust strip draws can never be two different files. Four are named by the source but
  // are not registry entries — their artwork sits in `clients/dark/` — so they are
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
    { name: 'Crefisa', logo: crefisa, artwork: 'light' },
    registered('Netshoes'),
    registered('Dafiti'),
    registered('Global Fashion Group'),
    registered('Zoop')
  ]

  // ── Band 13 — the platform, in four columns ───────────────────────────────────
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
          description: 'Accelerate content delivery and reduce origin load'
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

  // ── Band 15 — the ten questions ───────────────────────────────────────────────
  const FAQ = [
    {
      value: 'what-is',
      question: 'What is Application Accelerator?',
      answer:
        'Application Accelerator is an Applications module for accelerating web applications and APIs through protocol optimizations and advanced cache rules. It enables protocol optimization for dynamic content, Advanced Cache Key processing with query strings and cookies, POST and OPTIONS request caching, and short TTL support. The module reduces latency and improves throughput for data-intensive applications on Azion Web Platform.'
    },
    {
      value: 'advanced-cache-key',
      question: 'What is Advanced Cache Key?',
      answer:
        'Advanced Cache Key lets you control how content is segmented in cache beyond the URL path. You can configure cache variation rules based on query strings, cookies, and headers—enabling fine-grained control over which parameters differentiate cached objects. This supports up to 64 custom cache keys per edge application.'
    },
    {
      value: 'query-string-fields',
      question: 'Can I vary cached content by query string fields?',
      answer:
        'Yes. You can configure cache variation by specific query string fields using four modes: Whitelist (only listed fields considered), Blocklist (ignores specified fields), All fields (considers all variations), and Query String Sort (order becomes irrelevant). This lets you control exactly which parameters affect cache segmentation.'
    },
    {
      value: 'cookies',
      question: 'Can I vary cached content by cookies?',
      answer:
        'Yes. You can configure cache variation by specific cookie names, which is useful for session-based or personalized content. Modes include: URL-based only, Whitelist (allowed cookies), Blocklist (exceptions), and All cookies. This enables content segmentation by user profiles, browsing sessions, access regions, and targeting needs.'
    },
    {
      value: 'production',
      question: 'How do I apply cache settings in production?',
      answer:
        'Create cache settings in the Applications module, then activate them with Rules Engine rules. You can use request or response phase logic to decide when a cache policy should apply. This allows granular control over caching behavior based on URL patterns, headers, cookies, or other request attributes.'
    },
    {
      value: 'short-ttl',
      question: 'Can I set short cache TTLs?',
      answer:
        'Yes. With Application Accelerator enabled, you can customize short cache TTL values, including immediate expiration. This is ideal for rapidly changing content and real-time applications that require near-instant cache invalidation.'
    },
    {
      value: 'post-options',
      question: 'Can I cache POST or OPTIONS requests?',
      answer:
        'Yes. Application Accelerator enables caching for POST and OPTIONS requests, extending beyond the default GET and HEAD methods. When enabled, the request body becomes part of the cache key, so different payloads are cached separately. This is optimized for frequently accessed or data-intensive API endpoints.'
    },
    {
      value: 'vs-cdn',
      question: 'How does Application Accelerator compare to traditional CDN caching?',
      answer:
        'Traditional CDN caching typically supports only GET and HEAD requests with limited cache key customization. Application Accelerator provides protocol optimization for dynamic content, Advanced Cache Key with query string and cookie support, POST/OPTIONS caching, and short TTLs, all on a distributed architecture without cold starts. This enables caching strategies not possible with standard CDN configurations.'
    },
    {
      value: 'ttl-limits',
      question: 'What are the default TTL limits?',
      answer:
        'Default cache TTL limits include a configurable minimum and maximum range. You can choose values based on your content requirements, with short TTL support available when Application Accelerator is enabled.'
    },
    {
      value: 'costs',
      question: 'Does enabling Application Accelerator affect costs?',
      answer:
        'Application Accelerator is a premium module with usage-based pricing. Advanced cache features require the module to be active, and data transfer may generate additional costs depending on your configuration. Contact Azion support for specific pricing details based on your plan and expected usage.'
    }
  ]
</script>

<template>
  <!-- ══ Band 0 + 1 — the hero, and the stack standing on its floor ═════════════
       Hero owns the full-bleed band and the page's top rule. `--banner-offset`
       is the sticky SiteNav's height (h-14 = 3.5rem), so the band still measures exactly one
       screen with the nav above it.

       The wrapper declares that height and hands the leftover to the copy with
       `justify-between`: the claim sits in the middle of what is left, the strip stands on
       the floor. That is what puts the source's second band inside the first without either
       one losing its place in the running order. -->
  <Hero
    texture="dots"
    texture-fade="bottom"
    kind="screen"
    max-width="site"
    class="[--banner-offset:3.5rem]"
  >
    <Hero.Title
      centered
      eyebrow="Application Accelerator"
      title="Accelerate dynamic APIs and apps"
      description="Speed up web applications with protocol optimizations and advanced cache rules. Cache POST requests and use short TTLs for real-time data."
    >
      <!-- The stacking and the fluid width belong to Hero.Title's actions row, so the
               controls go in bare. `text` is the source's second action: a label and an
               arrow, no fill — the kind, not a restyled button. -->
      <template #actions>
        <Button
          label="Start free"
          kind="secondary"
          size="large"
          @click="goSignup"
        />
        <Button
          label="Docs"
          kind="outlined"
          size="large"
          :href="DOCS"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </Hero.Title>

    <!-- No label — the source's band is the marks alone. `monochrome` is the strip's own
           rule: one ink, so thirty brand palettes in one row do not become the loudest
           thing on the page. -->
    <template #bottom>
      <Ticker
        kind="band"
        size="small"
        :marks="PRODUCT_STACK"
      />
    </template>
  </Hero>

  <!-- ══ The framed column ═════════════════════════════════════════════════════
       Every band below the hero is a brick inside one centered column. The column carries
       only `border-x`; its top edge is the hero's `border-b` and its bottom edge the
       SiteFooter's `border-t`. Each brick is `flush` with `borders="y"`, which lands its
       top rule ON the one above and hands the vertical rules back to the column — so no
       line on this page is drawn twice. -->
  <SectionContainer max-width="site">
    <!-- Band 2 — spacer. As the first frame in the column its `flush` top rule lands on the
         hero's border-b, and its own bottom rule is what divides it from the band below. -->
    <SectionGap hatch />

    <!-- ── Band 3 — what the module is, in three cells ──────────────────────────
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
                 three are the first sub-headings under the page's `h1` and an `h3` here skips
                 a level (axe `heading-order`). The level is the outline; `text-heading-xs` is
                 the size, and the two are set separately. -->
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

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <BandStack
        sticky
        flush
      >
        <!-- ── Band 5 — copy beside the art ─────────────────────────────────────────
             The source's art is a raster collage of the product's own configuration screens
             with a Lighthouse card over them. Ours is the registered `infrastructure-as-code`
             scene: the provider declared once, the resources it raises standing beside it.
             It carries no texture and no inset: the scene covers the cell, so it runs off
             every edge instead of sitting letterboxed on a ground. `h-full!` is the only way
             past the component's own `h-auto`. -->
        <MediaSplit
          :media-href="DOCS"
          texture="none"
          title="Optimize dynamic delivery"
          description="Define acceleration rules for APIs, personalized content, and dynamic routes without changing your stack. Azion Web Platform helps improve performance, SEO, and reliability across distributed applications."
        >
          <template #content>
            <ul class="m-0 grid list-none grid-cols-2 gap-(--spacing-md) p-0">
              <li
                v-for="surface in SURFACES"
                :key="surface.label"
                class="flex items-center gap-(--spacing-sm) text-body-md text-(--text-default)"
              >
                <i
                  :class="surface.icon"
                  aria-hidden="true"
                  class="text-(--primary)"
                />
                {{ surface.label }}
              </li>
            </ul>
          </template>
          <template #media>
            <Illustration
              name="infrastructure-as-code"
              aria-label="An Azion provider declared in Terraform, raising the resources beside it"
              class="h-full! w-full object-cover"
            />
          </template>
          <template #actions>
            <Button
              label="Docs"
              kind="secondary"
              size="small"
              :href="DOCS"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </MediaSplit>

        <!-- ── Band 6 — the art, then the copy ──────────────────────────
             The source mirrors the band above it: art on the start edge, copy on the end edge.

             The art is the official `distributed-apis` scene — one request fanning out across the
             platform, the closest drawing the library carries to a key segmenting a request. Below
             `lg` it is the grid's second row, so the copy leads on a phone. -->
        <MediaSplit
          :media-href="DOCS"
          kind="media-start"
          title="Advanced Cache Key for personalized content delivery"
          description="Control how content is segmented in cache beyond the URL path. Configure cache variation rules based on query strings, cookies, and headers—enabling fine-grained control for personalized experiences."
        >
          <template #content>
            <ul class="m-0 grid list-none grid-cols-2 gap-(--spacing-md) p-0">
              <li
                v-for="feature in CACHE_KEY"
                :key="feature.label"
                class="flex items-center gap-(--spacing-sm) text-body-md text-(--text-default)"
              >
                <i
                  :class="feature.icon"
                  aria-hidden="true"
                  class="text-(--primary)"
                />
                {{ feature.label }}
              </li>
            </ul>
          </template>
          <template #media>
            <Illustration
              name="distributed-apis"
              aria-label="One request segmented into cache by query string, cookie and header"
            />
          </template>
          <template #actions>
            <Button
              label="Learn more"
              kind="secondary"
              size="small"
              :href="DOCS"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </MediaSplit>
      </BandStack>
    </SectionModule>

    <!-- ── Band 7 — the argument beside the sample ──────────────────────────────
         One tab, so CodeBlock draws the filename bar and no tab strip — the source's own
         shape. The panel sits on `--bg-surface` so the block reads as a file laid on the
         frame rather than as a listing floating in the band. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="grid lg:grid-cols-[4fr_5fr]">
          <div class="flex flex-col justify-between gap-(--spacing-xxl) p-(--spacing-xl)">
            <div class="flex flex-col gap-(--spacing-lg)">
              <h2 class="m-0 text-balance text-heading-md text-(--text-default)">
                From basic caching to advanced acceleration
              </h2>
              <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                Application Accelerator extends Cache with protocol optimizations and advanced cache
                rules for dynamic content.
              </p>
            </div>

            <div>
              <Button
                label="Learn More"
                kind="text"
                size="large"
                :href="DOCS"
                icon="pi pi-chevron-right"
                icon-position="trailing"
                animated
              />
            </div>
          </div>

          <div
            class="min-w-0 border-t border-(--border-default) bg-(--bg-surface) p-(--spacing-xl) lg:border-l lg:border-t-0"
          >
            <!-- Wrapped so the elevation is cast by a shell of the block's own shape:
                 CodeBlock rounds to --shape-elements and clips its overflow, so the shadow
                 goes on a wrapper at the same radius instead of being clipped away.
                 `animate-lines` is CodeBlock's own staggered entrance, which ships with its
                 motion-reduce fallback. -->
            <div class="min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)">
              <CodeBlock
                :tabs="codeTabs"
                default-value="cache-settings"
                show-line-numbers
                animate-lines
                copy-aria-label="Copy the cache settings sample"
              />
            </div>
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- Band 8 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 9 — six ways the module is used ─────────────────────────────────
         The source scrolls these sideways behind prev/next controls. Six cells fit the page
         frame as two rows of three, and a row that cannot be over-scrolled needs no
         controls — which is also the only way to draw this band without a carousel library
         (.claude/rules/dependencies.md).

         SectionTitle is the opener in the module's `#header` slot: it draws its own rules
         and leaves the top pair of marks to the gap above, so the grid below takes that
         junction as given and owns only its floor. `left` because the source sets the
         heading against the start edge, not centered. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          kind="left"
          title="See how to use"
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
          <div
            v-for="useCase in USE_CASES"
            :key="useCase.title"
            class="flex bg-(--bg-canvas)"
          >
            <Topic
              :icon="useCase.icon"
              :title="useCase.title"
              :description="useCase.description"
              :href="useCase.href"
              :heading-level="3"
              class="w-full p-(--spacing-xl)"
            />
          </div>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- Band 10 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 11 — the marks, and one client's sentence ───────────────────────
         Two cells of one frame at the source's split: twelve marks on the start edge, the
         quotation on the end edge. The marks are a static grid, not this site's marquee —
         the source lays them out as a block of twelve beside a quote, and a marquee in half
         a column shows two marks at a time.

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

          <!-- The mark is the client SIGNING the quote, which the source names separately from
               the `Zoop` cell in the grid beside it (`Zoop Logo` in its inventory) — not a
               thirteenth logo in the strip. This repo holds no Zoop artwork, so ClientMark
               writes the wordmark, which is exactly what the source renders. The quotation
               keeps the source's straight ASCII quotes. -->
          <Quote
            kind="signed"
            text='"Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results."'
            name="Ismael Aguilar"
            job-title="Information Security Manager at Zoop"
            class="border-t border-(--border-default) p-(--spacing-xl) lg:border-t-0 lg:border-l"
          >
            <template #mark>
              <ClientMark
                :client="registered('Zoop')"
                mark="h-8 w-auto max-w-40 object-contain"
              />
            </template>
            <template #actions>
              <Button
                label="Customers"
                kind="outlined"
                size="large"
                href="/site/home"
                icon="pi pi-chevron-right"
                icon-position="trailing"
                animated
              />
            </template>
          </Quote>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- ── Bands 12 + 13 — the platform, titled and then listed ─────────────────
         The source states these as two bands; here they are one module, the title in its
         `#header` slot, so the rule between them is the header's own `border-b` rather than
         two bands' edges meeting. SectionTitle supplies the `//` prefix and the cursor from
         its own overline anatomy. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Complete, not complex"
          title="A full-stack platform that scales instantly"
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

    <!-- Band 14 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 15 — Frequently Asked Questions ─────────────────────────────────
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

    <!-- Band 16 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 17 — the closing CTA ────────────────────────────────────────────
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

    <!-- Band 18 — the spacer the source closes on, hatched. A bare FrameBox at SectionGap's
         own `medium` height drawing NO rules: the footer below opens with a full-bleed rule,
         and SectionGap's fixed `borders="y"` would land a second hairline on that pixel. -->
    <FrameBox
      borders="none"
      marks="none"
      hatch
      class="h-[calc(var(--spacing-xxl)*2)]"
    />
  </SectionContainer>
  <!-- ══ End framed column ═════════════════════════════════════════════════════ -->
</template>
