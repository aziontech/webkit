<script setup>
  // The product catalogue page — the destination the Products mega-menu has been describing
  // and nothing has been linking to. It is the one page on this site COMPOSED ENTIRELY from
  // the marketing bands: hero, brand strip, section titles, hairline grids, content columns
  // and the closing ask are components configured, with nothing hand-drawn around them.
  //
  // The page's argument is the platform's shape, not one product's: four groups — Build,
  // Store, Protect, Observe — each opening with what the group is for and then listing its
  // products with the illustration that draws each one. That stack IS `PlatformProducts`,
  // which already emits the four modules; this page frames them and says what surrounds them.
  //
  // FORM is the page language of CONTAINERS.md, the same three layers every other page here
  // uses: a full-bleed `Hero` owning the top rule, one `SectionContainer` owning the sides,
  // and modules inside it owning their own rules and padding. The footer owns the bottom, so
  // every edge is drawn exactly once.
  import BigNumbers from '@aziontech/webkit/big-numbers'
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import ColumnNavigation from '@aziontech/webkit/column-navigation'
  import ContentColumns from '@aziontech/webkit/content-columns'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'
  import { useRouter } from 'vue-router'

  import PlatformProducts from './PlatformProducts.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // ColumnNavigation.Item renders a real anchor and reports the destination it was asked
  // for. An internal one is routed rather than followed, so the app never reloads.
  const openDestination = (event, item) => {
    if (!item.href.startsWith('/')) return
    event.preventDefault()
    router.push(item.href)
  }

  // What every product on the page shares, stated once so the four groups below do not each
  // have to repeat it.
  const guarantees = [
    {
      title: 'One platform, one bill',
      description:
        'Every product runs on the same network and the same account. Nothing to integrate, nothing to reconcile.'
    },
    {
      title: 'Provisioned in seconds',
      description:
        'A product is a capability you switch on, not infrastructure you size. Capacity follows the traffic.'
    },
    {
      title: 'Programmable end to end',
      description:
        'Every product answers to the same API, the same CLI and the same Terraform provider.'
    }
  ]

  const reach = [
    { value: '100', suffix: 'ms', label: 'Median response, worldwide' },
    { value: '24', suffix: '/7', label: 'Support on every plan' },
    { value: '99.99', suffix: '%', label: 'Availability, contractual' }
  ]

  // The catalogue's own index, so a reader who came for one product can leave for it
  // directly instead of scrolling the four groups. Same directory the home and pricing
  // pages carry; `href` is the product's own page, and Functions is the one this sample
  // ships itself.
  const directory = [
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
          icon: 'ai ai-edge-application',
          title: 'Application Accelerator',
          description: 'Tune delivery for dynamic and API traffic',
          href: '/site/products/application-accelerator'
        },
        {
          icon: 'ai ai-tiered-cache',
          title: 'Cache',
          description: 'Hold content at the point closest to the request',
          href: '/site/products/cache'
        }
      ]
    },
    {
      label: 'AI',
      items: [
        {
          icon: 'ai ai-edge-ai',
          title: 'AI Inference',
          description: 'Run AI models closer to users',
          href: 'https://www.azion.com/en/products/ai-inference/'
        },
        {
          icon: 'ai ai-gateway',
          title: 'AI Gateway',
          description: 'Secure, manage, and optimize AI traffic',
          href: 'https://www.azion.com/en/solutions#ai'
        }
      ]
    },
    {
      label: 'Data',
      items: [
        {
          icon: 'ai ai-edge-storage',
          title: 'Object Storage',
          description: 'Scalable, durable storage for unstructured data',
          href: 'https://www.azion.com/en/products/object-storage/'
        },
        {
          icon: 'ai ai-edge-sql',
          title: 'SQL Database',
          description: 'Query relational data at the edge',
          href: 'https://www.azion.com/en/products/sql-database/'
        }
      ]
    },
    {
      label: 'Security',
      items: [
        {
          icon: 'ai ai-waf-rules',
          title: 'WAF',
          description: 'Filter malicious requests before the origin',
          href: 'https://www.azion.com/en/products/web-application-firewall/'
        },
        {
          icon: 'pi pi-android',
          title: 'Bot Management',
          description: 'Detect and stop automated threats instantly',
          href: 'https://www.azion.com/en/products/bot-manager/'
        },
        {
          icon: 'ai ai-edge-dns',
          title: 'DNS',
          description: 'Reliably host authoritative DNS zones worldwide',
          href: 'https://www.azion.com/en/products/edge-dns/'
        }
      ]
    }
  ]
</script>

<template>
  <!-- ══ The hero ═══════════════════════════════════════════════════════════════
       The site's default opening: centred copy on the dot field, and the brand strip
       standing on the band's own floor under an overline naming what the marks are evidence
       of. `--banner-offset` is the sticky SiteNav's height, so the band still measures
       exactly one screen with the nav above it. -->
  <Hero
    kind="screen"
    align="center"
    max-width="site"
    texture="dots"
    texture-fade="bottom"
    carousel
    carousel-label="Running in production on these products"
    :carousel-marks="CLIENT_STRIP"
    class="[--banner-offset:3.5rem]"
  >
    <Hero.Title
      centered
      eyebrow="Products"
      highlight="Everything you need"
      title="on one distributed platform"
      description="Compute, storage, security and observability as products you switch on — provisioned in seconds, billed on one account, and running on the same network."
    >
      <template #actions>
        <Button
          label="Start Free"
          kind="secondary"
          size="large"
          @click="goSignup"
        />
        <Button
          label="See pricing"
          kind="outlined"
          size="large"
          href="/site/pricing"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </Hero.Title>
  </Hero>

  <!-- ══ The framed column ══════════════════════════════════════════════════════
       Every band after the hero is a brick inside one centered column. The column carries
       only `border-x`; its top edge is the hero's `border-b` and its bottom edge the
       SiteFooter's `border-t`. -->
  <SectionContainer max-width="site">
    <!-- ── What every product shares ────────────────────────────────────────────
         `ContentColumns` states the three guarantees under one headline. First brick in the
         column, so `:divided="false"` — its top edge is the hero's own full-bleed rule. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <ContentColumns
          eyebrow="The platform"
          title="Products, not infrastructure"
          description="Each one is a capability with an API, a console surface and a line on the same bill."
          :items="guarantees"
          :columns="3"
          class="p-(--spacing-xl)"
        />
      </FrameBox>
    </SectionModule>

    <!-- ── The reach behind all of them ──────────────────────────────────────── -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <BigNumbers :items="reach" />
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── The catalogue, group by group ────────────────────────────────────────
         `PlatformProducts` unframed: it emits one module per group, each opening with the
         group's name and what it is for, over a hairline grid of its products. This page
         already owns the column, so the component draws no frame of its own. -->
    <!-- The title band goes in BARE, not in a `SectionModule`: a module with a `#header` and
         no body draws the header's frame and then an empty one under it, and the catalogue's
         first group is the body here. `SectionTitle` is already a frame of its own. -->
    <SectionTitle
      eyebrow="Catalogue"
      title="Four groups, twelve products"
      description="Build what the request needs, store what it produces, protect what it touches, and see all of it."
    />

    <PlatformProducts :framed="false" />

    <SectionGap hatch />

    <!-- ── The index ────────────────────────────────────────────────────────────
         The same `ColumnNavigation` directory the home and pricing pages carry, so a reader
         who came for one product leaves for it rather than scrolling back up. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Go straight there"
          title="Every product, one list"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <ColumnNavigation
          :columns="4"
          :mobile-columns="1"
          aria-label="Product index"
        >
          <ColumnNavigation.Column
            v-for="group in directory"
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

    <!-- ── The closing ask, on the words every page on this site closes with ──── -->
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
            href="/site/contact"
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
</template>
