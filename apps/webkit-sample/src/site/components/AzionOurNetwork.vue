<script setup>
  // Product page: Our Network — a translation of
  // https://www.azion.com/en/products/our-network/ into this site's own page language.
  // The source is the specification for WHAT the page says; CONTAINERS.md is the
  // specification for HOW it is drawn. Every line of copy below is the source's, verbatim.
  //
  //   0  hero (eyebrow, h1, description, two actions)   Hero kind="screen" + Hero.Title
  //   1  11-mark client marquee                          Ticker, on the hero's floor
  //  2+3 heading, five claims and four figures on map   one FrameBox, backdrop + Tag row
  //                                                      + BigNumbers on its floor
  //   4  "Stop managing regions and capacity by hand"    SectionTitle centered
  //   5  art | copy — "Run closer to users"              FrameBox flush, lg:grid-cols-2
  //   6  copy | art — "Keep delivery, logic, and data"   FrameBox flush, lg:grid-cols-2
  //   7  art | copy — "Get better routes"                FrameBox flush, lg:grid-cols-2
  //   8  copy | art — "Stop attack traffic earlier"      FrameBox flush, lg:grid-cols-2
  //   9  spacer                                          SectionGap hatch
  //   10 client marks + one quote                        FrameBox flush, ClientMark + Quote
  //   11 "Build, run, and protect applications…"         SectionTitle in the module header
  //   12 the platform, four columns                      CardGrid divider + NavColumn/NavItem
  //   13 spacer                                          SectionGap hatch
  //   14 closing CTA                                     CallToAction kind="split"
  //   15 spacer                                          the closing hatch frame
  //
  // THE FRAME. Every band is a brick in one column: the hero owns the page's top rule
  // (`border-b`), the column owns the sides (`border-x`), the footer owns the bottom. Each
  // brick is `:divided="false"` with a `FrameBox flush borders="y" marks="bottom"`, so its
  // top rule lands ON the floor above it and the vertical rules stay the column's. No line
  // on this page is drawn twice.
  //
  // WHERE OUR FORM DEPARTS FROM THE SOURCE, on purpose:
  //   • The source's hero is 606px. Ours is `hero` — one viewport — this language's rule.
  //   • The hero eyebrow is `// INFRASTRUCTURE`; Hero.Title's overline carries no prefix, so
  //     it reads `Infrastructure`. The bands that show the prefix get it from SectionTitle.
  //   • The source's art for bands 5-8 is four bespoke raster collages. Ours is composed
  //     from Illustration parts, so the source's `alt` strings describe art we replaced and
  //     do not survive the copy diff. Each scene is a fixed-width row inside a cell that is
  //     not, so it is SCALED rather than reflowed and the cell clips.
  //   • The source's quote attribution is two lines. Quote's `inline` register sets the name
  //     and the job title as one line; both strings are present.
  //
  // ASSET GAPS: none. All 11 hero marks are CLIENTS entries. On the quote band, Axur,
  // Arezzo, Contabilizei and Crefisa are not registry entries but their marks live in
  // `clients/dark/clients/`, so they are declared locally — as AzionCache.vue does.
  import BigNumbers from '@aziontech/webkit/big-numbers'
  import Ticker from '@aziontech/webkit/ticker'
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
  import Quote from '@aziontech/webkit/quote'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Tag from '@aziontech/webkit/tag'
  import arezzo from '@shared/assets/clients/dark/clients/arezzo-logo.svg'
  import axur from '@shared/assets/clients/dark/clients/axur-logo.svg'
  import contabilizei from '@shared/assets/clients/dark/clients/contabilizei-logo.svg'
  import crefisa from '@shared/assets/clients/dark/clients/crefisa-logo.svg'
  import { CLIENTS } from '@shared/assets/clients/index.js'
  import { NetworkBanner } from '@shared/ui/banners/index.js'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'
  import { useRouter } from 'vue-router'

  import { NavColumn, NavItem } from '../ui/index.js'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  const CONTACT = '/site/contact'
  const CLIENT_STORIES = '/site/home'

  const byName = (name) => CLIENTS.find((client) => client.name === name)

  // The four marks with no CLIENTS entry, declared with the same shape the registry uses so
  // ClientMark filters them by theme exactly as it filters a registered one.
  const STORY_CLIENTS = [
    byName('NZN'),
    { name: 'Axur', logo: axur, artwork: 'light' },
    byName('Radware'),
    { name: 'Arezzo', logo: arezzo, artwork: 'light' },
    { name: 'Contabilizei', logo: contabilizei, artwork: 'light' },
    byName('Magalu'),
    byName('Fourbank'),
    { name: 'Crefisa', logo: crefisa, artwork: 'light' },
    byName('Netshoes'),
    byName('Dafiti'),
    byName('Global Fashion Group'),
    byName('GPA')
  ]

  const QUOTED_CLIENT = byName('GPA')

  const RELIABILITY_CLAIMS = [
    '100+ data centers',
    '100+ Tbps throughput',
    'High availability',
    '30 ms median latency',
    'PCI and SOC 2/3 compliant'
  ]

  const FIGURES = [
    { value: '7', suffix: 'x', label: 'faster pages' },
    { value: '90', suffix: '%', label: 'lower cloud costs' },
    { value: '40', suffix: 'x', label: 'more simultaneous connections' },
    { value: '100', suffix: '%', label: 'OWASP Top 10 mitigation' }
  ]

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
</script>

<template>
  <!-- ══ Band 0 + 1 — the hero, and the marks standing on its floor ═════════════
       The full-bleed band owns the page's top rule. `--banner-offset` is the sticky nav's
       height, so the band still measures exactly one screen with the bar above it. -->
  <Hero
    texture="dots"
    texture-fade="bottom"
    kind="screen"
    max-width="site"
    class="[--banner-offset:3.5rem]"
  >
    <Hero.Title
      centered
      eyebrow="Infrastructure"
      title="A global network built for fast applications"
    >
      Run closer to users with low-latency delivery, stable routing, and built-in DDoS protection
      across <strong class="text-(--text-default)">100+ data centers</strong> and
      <strong class="text-(--text-default)">3.3k directly connected ASNs</strong>.

      <template #actions>
        <Button
          label="Start free"
          kind="secondary"
          size="large"
          @click="goSignup"
        />
        <Button
          label="Talk to a Specialist"
          kind="text"
          size="large"
          :href="CONTACT"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </Hero.Title>

    <template #bottom>
      <Ticker
        kind="band"
        size="small"
        :marks="CLIENT_STRIP"
      />
    </template>
  </Hero>

  <!-- ══ The framed column ═════════════════════════════════════════════════════
       Every band below the hero is a brick inside one centered column carrying only
       `border-x`; its top edge is the hero's `border-b` and its bottom the footer's
       `border-t`. -->
  <SectionContainer max-width="site">
    <!-- ── Bands 2 + 3 — the claim and its figures, over the map ─────────────── -->
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
        <NetworkBanner kind="band" />

        <div class="relative flex h-full flex-col">
          <div
            class="flex min-h-[clamp(280px,38vh,460px)] flex-col justify-center gap-(--spacing-md) p-(--spacing-xxl)"
          >
            <SectionTitle
              :framed="false"
              kind="left"
              title="The most reliable infrastructure"
            />

            <ul class="m-0 flex list-none flex-wrap gap-(--spacing-sm) p-0">
              <li
                v-for="claim in RELIABILITY_CLAIMS"
                :key="claim"
              >
                <Tag severity="secondary">
                  <span
                    aria-hidden="true"
                    class="size-1 shrink-0 bg-(--primary)"
                  />
                  {{ claim }}
                </Tag>
              </li>
            </ul>
          </div>

          <BigNumbers
            :items="FIGURES"
            class="border-t border-(--border-default)"
          />
        </div>
      </FrameBox>
    </SectionModule>

    <!-- ── Band 4 — the section's claim ─────────────────────────────────────────
         SectionTitle already renders its own `FrameBox flush borders="y"`, so it is a brick
         in its own right and needs no wrapper frame. -->
    <SectionTitle
      kind="centered"
      eyebrow="Managed Infrastructure"
      title="Stop managing regions and capacity by hand"
    />

    <!-- ── Band 5 — Run closer to users ──
         MediaSplit draws no frame; this module's FrameBox is the band's rule. The scene carries a
         viewBox, so it reflows to the cell the band gives it, on the band's own grid ground. -->
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
          kind="media-start"
          title="Run closer to users"
          description="Handle requests closer to users instead of sending everything back to a few central regions. That helps cut latency, absorb spikes automatically, and reduce backhaul overhead."
        >
          <template #media>
            <Illustration
              name="fastest-path-to-live-website"
              aria-label="Requests served from the location nearest the user"
            />
          </template>
        </MediaSplit>
      </FrameBox>
    </SectionModule>

    <!-- ── Band 6 — Keep delivery, logic, and data in one place ──
         MediaSplit draws no frame; this module's FrameBox is the band's rule. The scene carries a
         viewBox, so it reflows to the cell the band gives it, on the band's own grid ground. -->
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
          kind="media-end"
          title="Keep delivery, logic, and data in one place"
          description="Use one platform for delivery, distributed execution, and data workflows. Support APIs and dynamic applications with real-time request handling, origin protection, and state kept close to execution with services like KV Store."
        >
          <template #media>
            <Illustration
              name="runtime"
              aria-label="Delivery, execution and data served from one platform"
            />
          </template>
        </MediaSplit>
      </FrameBox>
    </SectionModule>

    <!-- ── Band 7 — Get better routes and more stable delivery ──
         MediaSplit draws no frame; this module's FrameBox is the band's rule. The scene carries a
         viewBox, so it reflows to the cell the band gives it, on the band's own grid ground. -->
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
          kind="media-start"
          title="Get better routes and more stable delivery"
          description="Place traffic entry points inside ISP last-mile networks and connect through IXPs, peering, and Tier 1 transit. Reduce hops, improve route quality, and keep delivery stable during traffic spikes, upstream issues, and regional incidents."
        >
          <template #media>
            <Illustration
              name="distributed-apis"
              aria-label="Entry points inside ISP networks, connected through IXPs and transit"
            />
          </template>
        </MediaSplit>
      </FrameBox>
    </SectionModule>

    <!-- ── Band 8 — Stop attack traffic earlier ──
         MediaSplit draws no frame; this module's FrameBox is the band's rule. The scene carries a
         viewBox, so it reflows to the cell the band gives it, on the band's own grid ground. -->
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
          kind="media-end"
          title="Stop attack traffic earlier"
          description="Block attack traffic in the delivery path before it reaches your origin. Deploy code and policies while the platform handles scaling, execution, and traffic steering, so your team spends less time managing regions, capacity, scaling rules, and extra layers."
        >
          <template #media>
            <Illustration
              name="automate-threat-mitigation"
              aria-label="Attack traffic stopped in the delivery path, before the origin"
            />
          </template>
        </MediaSplit>
      </FrameBox>
    </SectionModule>

    <!-- Band 9 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 10 — the marks, and the quotation they sign ─────────────────────
         ClientMark reads each mark's `artwork` classification and inverts it per theme, so
         a black-artwork mark (Dafiti) is legible on this surface. -->
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
                mark="h-8 w-auto max-w-32 object-contain"
              />
            </li>
          </ul>

          <div
            class="flex flex-col items-start gap-(--spacing-xl) border-t border-(--border-default) p-(--spacing-xl) lg:border-l lg:border-t-0"
          >
            <Quote
              text="Azion shielded us from sophisticated cyberattacks and empowered us to modernize our infrastructure, reduce costs, and deliver the best shopping experiences to millions of customers across Latin America."
              name="Allan Monteiro"
              job-title="CISO &amp; Head of Technology"
              :logo="QUOTED_CLIENT.logo"
              logo-alt="GPA"
            >
              <template #actions>
                <Button
                  label="Clients"
                  kind="text"
                  size="large"
                  :href="CLIENT_STORIES"
                  icon="pi pi-chevron-right"
                  icon-position="trailing"
                  animated
                />
              </template>
            </Quote>
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- ── Bands 11 + 12 — the platform's claim, and the platform ───────────────
         One module: the claim is its header row, the four columns its body. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          kind="centered"
          eyebrow="Platform"
          title="Build, run, and protect applications on one platform"
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

    <!-- Band 13 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 14 — the closing CTA ────────────────────────────────────────────
         The Site's own closing band, with this page's strings passed in. `titleMuted` is
         what carries the source's two-tone headline. -->
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

    <!-- Band 15 — the spacer the source closes on, hatched. A bare FrameBox drawing NO
         rules: the footer below opens with a full-bleed rule of its own. -->
    <FrameBox
      borders="none"
      marks="none"
      hatch
      class="h-[calc(var(--spacing-xxl)*2)]"
    />
  </SectionContainer>
</template>
