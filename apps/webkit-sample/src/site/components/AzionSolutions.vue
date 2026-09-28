<script setup>
  // The solutions index — the destination the Solutions mega-menu has been describing, and
  // the counterpart to AzionProducts.vue: where that page's argument is the platform's
  // shape, this one's is the READER's. A solution page argues an industry, a use case or an
  // audience; a product page argues one product. The index says which is which and opens
  // each of them.
  //
  // It is composed the same way its sibling is — entirely from the marketing bands, with
  // nothing hand-drawn around them — so the two indexes read as one pair rather than two
  // pages that happen to list things.
  //
  // THE TWO GROUP ANCHORS ARE PART OF THE NAV CONTRACT. The Solutions mega-menu's headings
  // point at `#use-cases` and `#industries`, exactly as the Products menu's four headings
  // point at PlatformProducts' group ids, so a reader who opened the panel on `By Industry`
  // lands on that group rather than on the top of the page.
  //
  // FORM is the page language of CONTAINERS.md: a full-bleed `Hero` owning the top rule,
  // one `SectionContainer` owning the sides, and modules inside it owning their own rules
  // and padding. The footer owns the bottom, so every edge is drawn exactly once.
  //
  // EVERY ILLUSTRATION `name` BELOW IS A KEY THE REGISTRY SHIPS. `Illustration` falls back
  // to a `PLACE DESIGN ASSET` placeholder for a name it does not know, silently — so a grid
  // of placeholders looks deliberate until you compare it with the registry.
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import ColumnNavigation from '@aziontech/webkit/column-navigation'
  import ContentColumns from '@aziontech/webkit/content-columns'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import Illustration from '@aziontech/webkit/illustration'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'
  import { RouterLink, useRouter } from 'vue-router'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // A card opens either one of this sample's own pages or the live azion.com page for a
  // solution it does not ship. The first is a RouterLink (routed, no reload), the second a
  // plain anchor — so the cell is a real link either way and the card itself is the control.
  const isInternal = (href) => href.startsWith('/')
  const cardTag = (href) => (isInternal(href) ? RouterLink : 'a')
  const cardLink = (href) =>
    isInternal(href) ? { to: href } : { href, target: '_blank', rel: 'noreferrer' }

  // ColumnNavigation.Item renders a real anchor and reports the destination it was asked
  // for. An internal one is routed rather than followed, so the app never reloads.
  const openDestination = (event, item) => {
    if (!item.href.startsWith('/')) return
    event.preventDefault()
    router.push(item.href)
  }

  // What every solution shares, stated once so the two groups below do not each repeat it.
  const guarantees = [
    {
      title: 'One platform, every workload',
      description:
        'A solution is the same products configured for one reader — not a separate stack, a separate bill or a separate team.'
    },
    {
      title: 'Proven where it is hardest',
      description:
        'Each page carries the clients already running it in production, with the numbers they measured.'
    },
    {
      title: 'Live in an afternoon',
      description:
        'Templates, a CLI and a Terraform provider, so the architecture on the page is the one you deploy.'
    }
  ]

  // The two groups the Solutions mega-menu declares, in its order: use case first, then
  // industry. `href` is the solution's own page where this sample ships one, and the live
  // azion.com page where it does not — the same convention AzionProducts.vue's index uses.
  const useCases = [
    {
      name: 'modern-frontends',
      title: 'Web Apps',
      description:
        'Deploy serverless web applications, APIs and AI workloads straight from a git repository.',
      href: '/site/solutions/web-apps'
    },
    {
      name: 'ai-applications',
      title: 'AI',
      description: 'Run inference and agents next to the data they answer from.',
      href: 'https://www.azion.com/en/solutions#ai'
    },
    {
      name: 'implement-api-gateway-security',
      title: 'Application Security',
      description: 'Filter, rate-limit and authenticate at the edge, before the origin sees it.',
      href: 'https://www.azion.com/en/solutions/application-security/'
    }
  ]

  const industries = [
    {
      name: 'protect-financial-applications',
      title: 'Financial Services',
      description:
        'High availability, low latency and continuous compliance for financial applications and APIs.',
      href: '/site/solutions/financial-services'
    },
    {
      name: 'saas-platforms',
      title: 'Technology',
      description:
        'High-performance APIs and microservices for the team building the digital product.',
      href: '/site/solutions/technology'
    },
    {
      name: 'retail-application-modernization',
      title: 'Retail',
      description:
        'Storefronts that hold up through a peak event, with fraud stopped before checkout.',
      href: '/site/solutions/retail'
    }
  ]

  // The index, so a reader who came for one solution leaves for it rather than scrolling
  // back up — and the one place the two groups and the migration guides sit in one list.
  const directory = [
    {
      label: 'By Use Case',
      items: [
        {
          icon: 'ai ai-edge-application',
          title: 'Web Apps',
          description: 'Websites, APIs, e-commerce and AI apps',
          href: '/site/solutions/web-apps'
        },
        {
          icon: 'ai ai-edge-ai',
          title: 'AI',
          description: 'Inference and agents at the edge',
          href: 'https://www.azion.com/en/solutions#ai'
        },
        {
          icon: 'ai ai-waf-rules',
          title: 'Application Security',
          description: 'WAF, bot management and API protection',
          href: 'https://www.azion.com/en/solutions/application-security/'
        }
      ]
    },
    {
      label: 'By Industry',
      items: [
        {
          icon: 'pi pi-building-columns',
          title: 'Financial Services',
          description: 'Banks, fintechs and payment platforms',
          href: '/site/solutions/financial-services'
        },
        {
          icon: 'pi pi-microchip',
          title: 'Technology',
          description: 'SaaS platforms and digital products',
          href: '/site/solutions/technology'
        },
        {
          icon: 'pi pi-shopping-cart',
          title: 'Retail',
          description: 'Storefronts, marketplaces and peak events',
          href: '/site/solutions/retail'
        }
      ]
    },
    {
      label: 'Migrating',
      items: [
        {
          icon: 'pi pi-arrow-right-arrow-left',
          title: 'Vercel alternative',
          description: 'What maps onto what, feature by feature',
          href: '/site/guides/vercel-alternative'
        },
        {
          icon: 'ai ai-azion-cli',
          title: 'Every product',
          description: 'The catalogue behind all of these',
          href: '/site/products'
        }
      ]
    },
    {
      label: 'Proof',
      items: [
        {
          icon: 'pi pi-star',
          title: 'Success cases',
          description: '35 stories, filtered by industry and product',
          href: '/site/success-cases'
        },
        {
          icon: 'ai ai-medium',
          title: 'Learning',
          description: '78 articles on how the platform works',
          href: '/site/learning'
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
    carousel-label="Running these solutions in production"
    :carousel-marks="CLIENT_STRIP"
    class="[--banner-offset:3.5rem]"
  >
    <Hero.Title
      centered
      eyebrow="Solutions"
      highlight="The platform,"
      title="argued for your case"
      description="The same products, configured for what you are building and the sector you build it in — with the clients already running it and the numbers they measured."
    >
      <template #actions>
        <Button
          label="Start Free"
          kind="secondary"
          size="large"
          @click="goSignup"
        />
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
    </Hero.Title>
  </Hero>

  <!-- ══ The framed column ══════════════════════════════════════════════════════
       Every band after the hero is a brick inside one centered column. The column carries
       only `border-x`; its top edge is the hero's `border-b` and its bottom edge the
       SiteFooter's `border-t`. -->
  <SectionContainer max-width="site">
    <!-- ── What every solution shares ───────────────────────────────────────────
         First brick in the column, so `:divided="false"` — its top edge is the hero's own
         full-bleed rule. -->
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
          eyebrow="What a solution is"
          title="Not a different stack"
          description="Every page below is the same platform, pointed at one reader's problem."
          :items="guarantees"
          :columns="3"
          class="p-(--spacing-xl)"
        />
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── By use case ──────────────────────────────────────────────────────────
         The group's own anchor: the Solutions mega-menu's `By Use Case` heading points
         here, so a reader who opened the panel on it lands on this group. -->
    <SectionModule
      id="use-cases"
      :divided="false"
      :padded="false"
      class="scroll-mt-(--spacing-xxl)"
    >
      <template #header>
        <SectionTitle
          eyebrow="By use case"
          title="What you are building"
          description="The argument is the workload — the same one whatever sector runs it."
        />
      </template>

      <CardGrid
        kind="divider"
        :columns="3"
      >
        <!-- The cell is a real anchor: it routes internally through RouterLink and follows
             an external destination, so the whole card is the control rather than a strip
             of copy with a button under it. The seams are the grid's own `gap-px`, so the
             cell draws no border and fills the canvas over that gap. -->
        <component
          :is="cardTag(solution.href)"
          v-for="solution in useCases"
          :key="solution.title"
          v-bind="cardLink(solution.href)"
          class="group flex min-w-0 flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-lg) no-underline transition-colors duration-150 ease-out hover:bg-(--bg-surface) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
        >
          <Illustration
            :name="solution.name"
            :aria-label="`${solution.title}: ${solution.description}`"
          />
          <div class="flex flex-col gap-(--spacing-xxs)">
            <h3 class="m-0 text-heading-xxs text-(--text-default)">{{ solution.title }}</h3>
            <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
              {{ solution.description }}
            </p>
          </div>
        </component>
      </CardGrid>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── By industry ──────────────────────────────────────────────────────────
         The Solutions mega-menu's `By Industry` heading points here. -->
    <SectionModule
      id="industries"
      :divided="false"
      :padded="false"
      class="scroll-mt-(--spacing-xxl)"
    >
      <template #header>
        <SectionTitle
          eyebrow="By industry"
          title="Where you build it"
          description="Same platform, stated in the terms the sector is audited on."
        />
      </template>

      <CardGrid
        kind="divider"
        :columns="3"
      >
        <RouterLink
          v-for="solution in industries"
          :key="solution.title"
          :to="solution.href"
          class="group flex min-w-0 flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-lg) no-underline transition-colors duration-150 ease-out hover:bg-(--bg-surface) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
        >
          <Illustration
            :name="solution.name"
            :aria-label="`${solution.title}: ${solution.description}`"
          />
          <div class="flex flex-col gap-(--spacing-xxs)">
            <h3 class="m-0 text-heading-xxs text-(--text-default)">{{ solution.title }}</h3>
            <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
              {{ solution.description }}
            </p>
          </div>
        </RouterLink>
      </CardGrid>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── The index ────────────────────────────────────────────────────────────
         The same `ColumnNavigation` directory the products, home and pricing pages carry,
         so a reader who came for one destination leaves for it directly. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Go straight there"
          title="Every solution, one list"
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
          aria-label="Solution index"
        >
          <ColumnNavigation.Column
            v-for="group in directory"
            :key="group.label"
            :title="group.label"
          >
            <ColumnNavigation.Item
              v-for="item in group.items"
              :key="item.title"
              :icon="item.icon"
              :title="item.title"
              :description="item.description"
              :href="item.href"
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
  </SectionContainer>
</template>
