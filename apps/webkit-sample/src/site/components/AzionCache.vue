<script setup>
  // Product page: Cache — a translation of https://www.azion.com/en/products/cache/ into
  // this site's own page language. The source is the specification for WHAT the page says;
  // CONTAINERS.md is the specification for HOW it is drawn. Every line of copy below is the
  // source's, verbatim; none of its grid, spacing, borders, colours or radii came across.
  //
  // It is the SAME 19-BAND TEMPLATE azion.com runs for Application Accelerator, so this page
  // is deliberately built the same way as AzionApplicationAccelerator.vue — same skeleton,
  // same bricks, same shared strip and closing band. Where the two pages differ, the source
  // differs: Cache's second band ends on `Start Free` rather than a docs link, and its FAQ
  // runs twelve questions to the other's ten.
  //
  //   0  hero (eyebrow, h1, description, two actions)      BannerContainer hero + HeroTitle
  //   1  30-mark tool marquee                              BrandCarousel, on the hero's floor
  //   2  spacer                                            SectionGap hatch
  //   3  three feature cells                               CardGrid divider, 3 columns
  //   4  spacer                                            SectionGap hatch
  //   5  copy | art — "Configure smarter cache policies"   FrameBox, lg:grid-cols-2
  //   6  art | copy — "High-availability caching…"         FrameBox flush, lg:grid-cols-2
  //   7  copy | code — "Fine-tune cache policies…"         FrameBox flush + CodeBlock
  //   8  spacer                                            SectionGap hatch
  //   9  "Use cases" — six cards                           SectionTitle left + CardGrid, 3 cols
  //   10 spacer                                            SectionGap hatch
  //   11 client marks + one quote                          FrameBox, lg:grid-cols-2
  //   12 "A full-stack platform that scales instantly"     SectionTitle in the module header
  //   13 the platform, four columns                        CardGrid divider + NavColumn/NavItem
  //   14 spacer                                            SectionGap hatch
  //   15 Frequently Asked Questions (12)                   the ruled Accordion band
  //   16 spacer                                            SectionGap hatch
  //   17 closing CTA                                       SiteCta, every string a prop
  //   18 spacer                                            the closing hatch frame
  //
  // WHERE OUR FORM DEPARTS FROM THE SOURCE, on purpose:
  //   • The source's hero is 580px. Ours is `hero` — one viewport — because that is this
  //     language's hero rule.
  //   • The source runs the tool strip as its own bordered band under the hero. Here it
  //     stands on the hero's floor and the hero's own `border-b` is the rule that divides it
  //     from the column — the same single line, one owner.
  //   • The hero's eyebrow is `// CACHE`. HeroTitle's overline anatomy carries no `//`
  //     prefix (that belongs to SectionTitle and to the closing band), so the hero reads
  //     `CACHE`. The two bands that DO have the prefix get it from their own component.
  //   • The source's "Docs" / "Learn more" / "View docs" controls carry a trailing arrow.
  //     Button's `icon` is leading-only, and Link — the one control whose icon IS trailing —
  //     paints `--text-link`, the product UI's blue, which nothing else on this site uses. So
  //     these are `Button kind="text"`: the label alone, in the page's own ink.
  //   • Bands 9 and 15 are horizontal scrollers with prev/next controls in the source. Six
  //     cards fit the page frame as two rows of three, and a row that cannot be over-scrolled
  //     needs no controls — nor a carousel library (.claude/rules/dependencies.md).
  //   • The source's art is two raster product collages. Ours is composed from Illustration
  //     parts: band 5 is the request → cache → origin path the source draws in the corner of
  //     its card, band 6 the branch from one request into the cache layer's content types.
  //     Both are WORDLESS — each band's own copy already names what the art would label, and
  //     art that repeats the list beside it is the list twice. Their `alt` text therefore
  //     does not survive the copy diff: it described art we replaced.
  //
  // ASSET GAPS: none on the tool strip — all 30 marks have a file in `shared/ui/brand/
  // clients/`. On the client strip, Axur, Arezzo, Crefisa and Contabilizei are not CLIENTS
  // registry entries but their marks are in `clients/dark/clients/`, so they are declared
  // locally (see STORY_CLIENTS); NZN has no mark in this repo at all and renders as
  // ClientMark's typographic wordmark, so no name is quietly dropped.
  import Accordion from '@aziontech/webkit/accordion'
  import Button from '@aziontech/webkit/button'
  import CodeBlock from '@aziontech/webkit/code-block'
  import FrameBox from '@aziontech/webkit/frame-box'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import Illustration from '@aziontech/webkit/illustration'
  import Overline from '@aziontech/webkit/overline'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionTitle from '@aziontech/webkit/section-title'
  import BrandCarousel from '@shared/ui/brand/BrandCarousel.vue'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  // The four client marks that are not CLIENTS registry entries; Vite resolves each to an
  // asset URL, exactly as the registries do.
  import arezzo from '@shared/ui/brand/clients/dark/clients/arezzo-logo.svg'
  import axur from '@shared/ui/brand/clients/dark/clients/axur-logo.svg'
  import contabilizei from '@shared/ui/brand/clients/dark/clients/contabilizei-logo.svg'
  import crefisa from '@shared/ui/brand/clients/dark/clients/crefisa-logo.svg'
  import { CLIENTS } from '@shared/ui/brand/clients/index.js'
  import { PRODUCT_STACK } from '@shared/ui/brand/tools.js'
  import {
    BannerContainer,
    CardGrid,
    SectionContainer,
    SectionModule
  } from '@shared/ui/layout/index.js'
  import { useRouter } from 'vue-router'

  import { NavColumn, NavItem } from '../ui/index.js'
  import SiteCta from './SiteCta.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // The page's two outbound destinations, stated once. The source points its controls at two
  // different Cache references — the product page and the cache-settings page — and at the
  // console signup; naming them here is what keeps nine controls from drifting to six URLs.
  const DOCS = '/site/docs'
  const SIGNUP = '/signup'

  // ── Band 1 — the stack the strip states ───────────────────────────────────────
  // The source's marquee, in the source's order, all 30 marks — shared with every other
  // product page's hero, so two pages cannot state the platform's compatibility two ways.
  // See PRODUCT_STACK for why it is not `TOOLS` (the home page's own, shorter list).

  // ── Band 3 — what the product is, in three cells ──────────────────────────────
  // The source draws a globe, a bolt and a refresh loop over the three cells. Ours are the
  // same three ideas from the icon library the rest of the page glyphs come from.
  const PILLARS = [
    {
      icon: 'pi pi-globe',
      title: 'Global content delivery close to users',
      description:
        "Serve cached websites, APIs, and files from Azion's distributed architecture to reduce latency and absorb demand before it reaches your origin."
    },
    {
      icon: 'pi pi-bolt',
      title: 'Faster responses with less origin work',
      description:
        'Improve cache-hit performance while cutting repeated origin requests, infrastructure load, and bandwidth pressure during peak traffic.'
    },
    {
      icon: 'pi pi-sync',
      title: 'Simple control over freshness',
      description:
        'Configure TTLs, cache keys, stale content, and global purges so teams can keep content fast without complex CDN operations.'
    }
  ]

  // ── Band 5 — the four surfaces a policy is written from ───────────────────────
  const SURFACES = [
    { icon: 'ai ai-azion-cli', label: 'Azion CLI' },
    { icon: 'ai ai-azion-api', label: 'REST API' },
    { icon: 'ai ai-azion', label: 'Console UI' },
    { icon: 'ai ai-terraform', label: 'Terraform' }
  ]

  // ── Band 6 — what keeps critical traffic served ───────────────────────────────
  const AVAILABILITY = [
    { icon: 'ai ai-origin-shield', label: 'Stale cache' },
    { icon: 'pi pi-link', label: 'Persistent connections' },
    { icon: 'pi pi-cog', label: 'Protocol optimization' },
    { icon: 'pi pi-check-circle', label: 'High availability' }
  ]

  // ── Band 7 — the sample the band is talking about ─────────────────────────────
  // One tab, so CodeBlock renders the filename bar and no tab strip — the source's shape.
  const CACHE_SETTINGS = `{
  "browser_cache_settings": {
    "ttl": 3600,
    "honor_origin_headers": true
  },
  "cdn_cache_settings": {
    "ttl": 86400,
    "stale_cache_enabled": true,
    "tiered_cache_enabled": true
  },
  "cache_key_settings": {
    "query_strings": "all",
    "cookies": []
  },
  "large_file_optimization": {
    "enabled": true,
    "fragment_size_kb": 1024
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

  // ── Band 9 — six ways the product is used ─────────────────────────────────────
  const USE_CASES = [
    {
      eyebrow: 'E-commerce',
      title: 'Speed up checkout during flash sales',
      description:
        'Handle traffic spikes with intelligent caching that keeps checkout fast under load. E-commerce sites maintain conversion rates during peak events.',
      action: 'Learn more',
      href: '/site/home'
    },
    {
      eyebrow: 'Media',
      title: 'Stream content without buffering',
      description:
        'Deliver video and large files efficiently with large file optimization. Media companies reduce playback interruptions and improve viewer experience.',
      action: 'Learn more',
      href: '/site/home'
    },
    {
      eyebrow: 'APIs',
      title: 'Accelerate API responses',
      description:
        'Cache API responses on a distributed architecture to reduce latency and origin load. SaaS applications deliver consistent performance for repeated queries.',
      action: 'View docs',
      href: DOCS
    },
    {
      eyebrow: 'Configuration',
      title: 'Configure cache policies',
      description:
        'Set TTL, enable stale cache, and control cache keys for optimal performance. Fine-tune caching behavior for your specific content types.',
      action: 'View docs',
      href: DOCS
    },
    {
      eyebrow: 'Dynamic',
      title: 'Micro-cache dynamic content',
      description:
        'Use short TTLs to cache personalized content while maintaining freshness. Reduce origin load for semi-dynamic pages without sacrificing personalization.',
      action: 'Learn more',
      href: '/site/home'
    },
    {
      eyebrow: 'SaaS',
      title: 'Scale multi-tenant applications',
      description:
        'Reduce infrastructure costs with tiered cache for static assets. SaaS platforms serve shared assets efficiently across multiple tenants.',
      action: 'View docs',
      href: DOCS
    }
  ]

  // ── Band 11 — the marks beside the quote ──────────────────────────────────────
  // Seven resolve against the shared CLIENTS registry, so a mark this page draws and a mark
  // the trust strip draws can never be two different files. Four are named by the source but
  // are not registry entries — their artwork sits in `clients/dark/clients/` — so they are
  // declared here rather than added to a registry every other strip on the site reads.
  const registered = (name) => CLIENTS.find((client) => client.name === name) ?? { name }

  const STORY_CLIENTS = [
    // The source spells it DNZ; NZN is this repo's name for the same client, and the registry
    // entry carries no file, so ClientMark writes the wordmark.
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
    registered('Global Fashion Group')
  ]

  // The client SIGNING the quote, drawn above it. The source names it as its own mark
  // (`Contabilizei Logo` in the inventory, distinct from the `Contabilizei` cell in the
  // grid) — it is the signature, not a twelfth logo in the strip.
  const QUOTED_CLIENT = { name: 'Contabilizei', logo: contabilizei, artwork: 'light' }

  // ── Band 13 — the platform, in four columns ───────────────────────────────────
  // The same four columns and fourteen products the source lists on every product page, so
  // the two pages cannot describe one product two ways.
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

  // ── Band 15 — the twelve questions ────────────────────────────────────────────
  const FAQ = [
    {
      value: 'what-is',
      question: 'What is Azion Cache?',
      answer:
        'Azion Cache is a distributed caching solution for accelerating websites and APIs. Key features include: lower origin traffic, fast cache-hit response times, tiered cache architecture, stale-while-revalidate support, and large file optimization. It improves Core Web Vitals and stabilizes latency during traffic spikes.'
    },
    {
      value: 'browser-vs-cdn',
      question: "What's the difference between Browser Cache Settings and CDN Cache Settings?",
      answer:
        "Browser Cache Settings controls how long content is cached in the user's browser. CDN Cache Settings controls how long content is cached in the Azion Web Platform. You can honor origin headers or override TTLs for each layer."
    },
    {
      value: 'origin-headers',
      question: 'Can Cache honor Cache-Control and Expires headers from my origin?',
      answer:
        'Yes. You can configure both Browser Cache Settings and CDN Cache Settings to honor cache definitions sent by your origin through HTTP headers (Cache-Control and Expires).'
    },
    {
      value: 'short-ttl',
      question: 'How can I set short cache TTLs?',
      answer:
        'To set short CDN cache TTL values, you must enable the Application Accelerator module.'
    },
    {
      value: 'cache-key',
      question: 'How do I control what defines the cache key (cookies and query strings)?',
      answer:
        'Use Advanced Cache Key to customize caching behavior based on cookies and query strings. This helps you cache personalized or segmented content while keeping cache efficiency high.'
    },
    {
      value: 'purge',
      question: 'How do I purge or invalidate cached content?',
      answer:
        'Use Real-Time Purge to expire cached content by URL, cache key, or wildcard. Purges are queued for execution and may take time to propagate across the distributed infrastructure.'
    },
    {
      value: 'origin-down',
      question: 'What happens if my origin is slow or unavailable?',
      answer:
        'Enable Stale Cache to serve stale content when there is a problem with your origin servers, improving availability for end users during incidents.'
    },
    {
      value: 'large-files',
      question: 'How does Cache handle large files?',
      answer:
        'Large File Optimization splits large files into fragments with a default fragment size of 1024 kB. This improves delivery of large assets and allows caching of file segments.'
    },
    {
      value: 'post-options',
      question: 'Can I cache POST or OPTIONS requests?',
      answer:
        'By default, Cache caches GET and HEAD. You can enable caching for POST and OPTIONS, but these cache options require the request body to be part of the cache key and depend on Application Accelerator.'
    },
    {
      value: 'tiered-cache',
      question: 'How do I keep long-lived assets cached longer with an additional cache layer?',
      answer:
        'Azion offers an additional cache layer called Tiered Cache designed for assets that can remain cached for long periods. It can be enabled on cache policies with a Maximum TTL in Tiered Cache of 2,592,000 seconds (default TTL 60 seconds).'
    },
    {
      value: 'vs-cdn',
      question: 'What is the difference between Azion Cache and standard CDNs?',
      answer:
        'Azion Cache is integrated with the Azion Web Platform, providing unified management for caching, security, and compute. Unlike standalone CDNs, it works with Functions for dynamic cache manipulation, WAF for protected caching, and Application Accelerator for advanced TTL control.'
    },
    {
      value: 'integrations',
      question: 'How does Cache integrate with other Azion products?',
      answer:
        'Cache integrates with Rules Engine for conditional caching policies, Application Accelerator for short TTLs, Image Processor for optimized image caching, and Functions for programmatic cache key manipulation. This unified approach reduces complexity compared to multi-vendor solutions.'
    }
  ]
</script>

<template>
  <!-- ══ Band 0 + 1 — the hero, and the stack standing on its floor ═════════════
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
          eyebrow="Cache"
          title="Accelerate content delivery globally"
          description="Serve cached content with fast response times. Reduce origin load and keep applications fast during traffic spikes."
        >
          <template #actions>
            <Button
              label="Start free"
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

      <!-- No label — the source's band is the marks alone. `monochrome` is the strip's own
           rule: one ink, so thirty brand palettes in one row do not become the loudest thing
           on the page. -->
      <BrandCarousel
        monochrome
        :clients="PRODUCT_STACK"
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

    <!-- ── Band 3 — what the product is, in three cells ─────────────────────────
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

    <!-- ── Band 5 — copy beside the art ─────────────────────────────────────────
         The source's art is a raster collage: a configuration card over a world map, with a
         request → cache → origin path in its corner. That path IS the argument, so it is
         what our art draws — three parts and the flow between them, composed from
         Illustration parts on the design system's own canvas.

         THE SCENE IS A FIXED-WIDTH ROW AND THE CELL IS NOT. Illustration parts carry their
         own geometry, so the row does not reflow; it is SCALED rather than reflowed (`scale`
         leaves the layout box alone, so the cell also clips) which keeps the drawing whole
         and the page's width honest on a phone. -->
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
          <div class="flex flex-col justify-between gap-(--spacing-xxl) p-(--spacing-xl)">
            <div class="flex flex-col gap-(--spacing-lg)">
              <h2 class="m-0 text-balance text-heading-md text-(--text-default)">
                Configure smarter cache policies
              </h2>
              <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                Set browser and edge TTLs, enable tiered cache, and keep content fresh with stale
                revalidation. Azion Web Platform helps improve hit ratio, lower latency, and reduce
                origin bandwidth.
              </p>

              <!-- The four surfaces a policy can be written from. A two-column list, not four
                   cards: it is an inventory inside a paragraph's argument, so it takes the
                   paragraph's own measure. -->
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
            </div>

            <div>
              <Button
                label="Docs"
                kind="text"
                size="large"
                :href="DOCS"
              />
            </div>
          </div>

          <div
            class="flex min-w-0 items-center justify-center overflow-hidden border-t border-(--border-default) p-(--spacing-xl) lg:border-l lg:border-t-0"
          >
            <Illustration
              size="large"
              aria-label="A request served from cache, with the origin behind it"
              class="shrink-0 scale-[0.62] sm:scale-90 lg:scale-100"
            >
              <div class="flex items-center gap-(--spacing-xs)">
                <Illustration.Box icon="ai ai-edge-application" />
                <Illustration.Connector
                  kind="dashed"
                  animated
                />
                <Illustration.Box
                  icon="ai ai-tiered-cache"
                  active
                />
                <Illustration.Connector kind="dashed" />
                <Illustration.Box icon="pi pi-server" />
              </div>
            </Illustration>
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- ── Band 6 — the art, then the copy ──────────────────────────────────────
         The source mirrors the band above it: art on the start edge, copy on the end edge.
         `flush` lands this frame's top rule on that frame's floor, so the two butt together
         exactly as they do on the source page.

         The source's diagram fans one request into a cache layer of content types. Ours is
         that branch, drawn with Illustration's own trunk-and-tributary parts — a different
         shape from the linear flow above it, because it is a different argument. Below `lg`
         it is the grid's second row, so the copy leads on a phone. -->
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
            class="order-last flex min-w-0 items-center justify-center overflow-hidden border-t border-(--border-default) p-(--spacing-xl) lg:order-first lg:border-r lg:border-t-0"
          >
            <Illustration
              size="large"
              aria-label="One request fanning into the cache layer's content types"
              class="shrink-0 scale-[0.62] sm:scale-90 lg:scale-100"
            >
              <div class="flex items-center gap-(--spacing-xs)">
                <Illustration.Box icon="ai ai-edge-application" />
                <Illustration.Connector
                  kind="dashed"
                  animated
                />
                <Illustration.Box
                  icon="ai ai-tiered-cache"
                  active
                />
                <Illustration.Node />
                <Illustration.Connector kind="dashed" />

                <div class="flex flex-col gap-(--spacing-xs)">
                  <Illustration.Box
                    icon="ai ai-layers"
                    size="small"
                  />
                  <Illustration.Box
                    icon="pi pi-video"
                    size="small"
                  />
                  <Illustration.Box
                    icon="ai ai-json"
                    size="small"
                  />
                </div>
              </div>
            </Illustration>
          </div>

          <div class="flex flex-col justify-between gap-(--spacing-xxl) p-(--spacing-xl)">
            <div class="flex flex-col gap-(--spacing-lg)">
              <h2 class="m-0 text-balance text-heading-md text-(--text-default)">
                High-availability caching for critical traffic
              </h2>
              <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                Use protocol optimizations, persistent connections, and stale cache to keep serving
                the latest cached responses during origin failures or revalidation, so websites and
                APIs stay fast.
              </p>

              <ul class="m-0 grid list-none grid-cols-2 gap-(--spacing-md) p-0">
                <li
                  v-for="feature in AVAILABILITY"
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
            </div>

            <!-- The one band on the page whose control is the signup, not the docs — the
                 source's own choice here. -->
            <div>
              <Button
                label="Start Free"
                kind="text"
                size="large"
                :href="SIGNUP"
              />
            </div>
          </div>
        </div>
      </FrameBox>
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
                Fine-tune cache policies for your content
              </h2>
              <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                Configure caching policies that match your content strategy.
              </p>
            </div>

            <div>
              <Button
                label="Learn More"
                kind="text"
                size="large"
                :href="DOCS"
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

    <!-- ── Band 9 — six ways the product is used ────────────────────────────────
         The source scrolls these sideways behind prev/next controls. Six cells fit the page
         frame as two rows of three, and a row that cannot be over-scrolled needs no controls
         — which is also the only way to draw this band without a carousel library.

         SectionTitle is the opener in the module's `#header` slot: it draws its own rules and
         leaves the top pair of marks to the gap above, so the grid below takes that junction
         as given and owns only its floor. `left` because the source sets the heading against
         the start edge, not centered. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          kind="left"
          title="Use cases"
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
            v-for="useCase in USE_CASES"
            :key="useCase.title"
            class="flex flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <Overline>{{ useCase.eyebrow }}</Overline>
            <h3 class="m-0 text-balance text-heading-xs text-(--text-default)">
              {{ useCase.title }}
            </h3>
            <p class="m-0 flex-1 text-pretty text-body-sm text-(--text-muted)">
              {{ useCase.description }}
            </p>
            <div>
              <Button
                :label="useCase.action"
                kind="text"
                size="medium"
                :href="useCase.href"
              />
            </div>
          </div>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- Band 10 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 11 — the marks, and one client's sentence ───────────────────────
         Two cells of one frame at the source's split: the marks on the start edge, the
         quotation on the end edge. The marks are a static grid, not this site's marquee —
         the source lays them out as a block beside a quote, and a marquee in half a column
         shows two marks at a time.

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
            class="m-0 flex flex-col gap-(--spacing-xl) border-t border-(--border-default) p-(--spacing-xl) lg:border-l lg:border-t-0"
          >
            <!-- The client signing the quote, above the words. -->
            <ClientMark
              :client="QUOTED_CLIENT"
              mark="h-8 w-auto max-w-40 object-contain"
            />

            <!-- The source sets the quotation in straight ASCII quotes, and a quotation mark
                 is part of the line, not typesetting applied to it — so it is carried across
                 as written.

                 No `text-pretty` here, unlike every paragraph on the page: on a long
                 quotation Chromium's `pretty` shortens every line to even out the last one,
                 which is a paragraph treatment. Greedy wrapping fills the measure. -->
            <blockquote class="m-0 max-w-(--container-2xl) text-heading-sm text-(--text-default)">
              "I really like the depth of cache rules that I can apply at the edge. There are things
              that we would not be able to do using solutions from other vendors. In terms of
              performance, compliance to Contabilizei's rules and delivery standards, we are very
              satisfied with Azion's performance."
            </blockquote>

            <!-- The signature: the name in the accent, the role beside it in the default ink,
                 both in the overline's mono uppercase — the source's own pairing. -->
            <figcaption
              class="flex flex-col gap-(--spacing-xs) sm:flex-row sm:items-center sm:gap-(--spacing-xl)"
            >
              <Overline>Marcelo Pacheco</Overline>
              <span class="px-1 text-overline-md uppercase text-(--text-default)">
                DevOps Specialist at Contabilizei
              </span>
            </figcaption>

            <div class="mt-auto">
              <Button
                label="Clients"
                kind="text"
                size="large"
                href="/site/home"
              />
            </div>
          </figure>
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

    <!-- Band 14 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 15 — Frequently Asked Questions ─────────────────────────────────
         The source's three-column split: the heading holds the first third, the questions the
         other two. The seam between the cells and the rules between the questions are the
         grid's `gap-px`, so neither cell draws a border — and each fills `--bg-canvas`, or
         the whole band goes the colour of the gap.

         `--accordion-inset` is the component's own hook for the horizontal step, declared
         once on the grid so the heading, every trigger and every answer start on one content
         column at whatever the token steps to per breakpoint. The rule is held at the ITEM's
         edge rather than under the trigger, so an open item is one cell — question plus its
         answer — and the stack keeps exactly one rule per row whatever is open. The last row
         is the exception in both states: it sits on the band's floor, which the FrameBox
         already draws. -->
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

    <!-- Band 16 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 17 — the closing CTA ────────────────────────────────────────────
         The Site's own closing band, with this page's strings passed in. The source closes
         every product page on the same words, so these match the Application Accelerator
         page exactly — stated explicitly rather than left to the component's defaults, which
         are the homepage's. -->
    <SiteCta
      eyebrow="Build"
      title="Build once."
      title-muted="Run everywhere."
      description="Get a faster path to launch, lower latency, and less infrastructure overhead."
      primary-label="Start Free"
      secondary-label="Talk to our team"
    />

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
