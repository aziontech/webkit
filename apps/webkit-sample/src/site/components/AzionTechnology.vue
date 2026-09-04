<script setup>
  // Solution page: Technology — a translation of
  // https://www.azion.com/en/solutions/technology/ into this site's own page language.
  // The source is the specification for WHAT the page says; CONTAINERS.md is the
  // specification for HOW it is drawn. Every line of copy below is the source's, verbatim;
  // none of its grid, spacing, borders, colours or radii came across.
  //
  // A SOLUTION page by AUDIENCE, where /site/financial-services is by industry and
  // /site/web-apps is by use case: the reader here is the team building the digital
  // product, not the sector it serves. The source states the same twenty bands in the same
  // order as its two siblings, so the three pages are composed the same way — which is the
  // point: one language, three arguments.
  //
  // The source's 20 bands, in order, and what each becomes here:
  //
  //   0  hero (eyebrow, h1, description, two actions)      BannerContainer hero + HeroTitle
  //   1  11-mark client marquee                            BrandCarousel, on the hero's floor
  //   2  spacer                                            SectionGap hatch
  //   3  three capability cells                            CardGrid divider, 3 columns
  //   4  spacer                                            SectionGap hatch
  //   5  "The Infrastructure Behind Leading Tech…"         SectionTitle in the module header
  //   6  two success-story cards                           CardGrid divider, 2 columns
  //   7  spacer                                            SectionGap hatch
  //   8  art | copy — "Implement API Gateway security…"    FrameBox, lg:grid-cols-2
  //   9  spacer                                            SectionGap hatch
  //   10 "Guides and Resources" — three doc cards          SectionTitle left + CardGrid, 3 cols
  //   11 spacer                                            SectionGap hatch
  //   12 "Security and Compliance for High-Stakes…"        SectionTitle in the module header
  //   13 five certification cells                          gap-px hairline grid
  //   14 spacer                                            SectionGap hatch
  //   15 "Primitives that Scale with You"                  SectionTitle in the module header
  //   16 the platform, four columns                        CardGrid divider + NavColumn/NavItem
  //   17 spacer                                            SectionGap hatch
  //   18 closing CTA                                       SiteCta, every string a prop
  //   19 spacer                                            the closing hatch frame
  //
  // WHERE OUR FORM DEPARTS FROM THE SOURCE, on purpose:
  //   • The source's hero is 631px. Ours is `hero` — one viewport — because that is this
  //     language's hero rule.
  //   • The source runs the client marquee as its own bordered band under the hero. Here it
  //     stands on the hero's floor and the hero's own `border-b` is the rule that divides it
  //     from the column — the same single line, one owner. Every other /site page seats its
  //     strip this way, so they read as one site.
  //   • The source states bands 5+6, 12+13 and 15+16 as SEPARATE bands: a heading band, then
  //     the thing it titles. Here each pair is ONE module with the title in its `#header`
  //     slot, so the rule between them is the header's own `border-b` rather than two bands'
  //     edges meeting on one pixel (CONTAINERS.md, the one-frame principle).
  //   • Bands 6 and 10 are horizontal scrollers with prev/next controls in the source. Two
  //     and three cards fit the page frame exactly, and a row that cannot be over-scrolled
  //     needs no controls — nor a carousel library (.claude/rules/dependencies.md).
  //   • The source's "View success story" / "Read documentation" / "Docs" controls carry a
  //     trailing arrow. `MiniButton` is the one control in this system whose icon IS
  //     trailing, so the arrow survives here rather than being dropped.
  //   • The source's fifth band-16 eyebrow (`DNS`) is a product NAME, not a fifth column:
  //     its four columns are Compute, AI, Data and Security, and DNS is the last product
  //     under Security — the same reading the two sibling pages take of the same component.
  //   • Band 18's headline is one sentence in two tones; SiteCta expresses that as `title` +
  //     `titleMuted` rather than as one string with a span in it. The source's DOM reports
  //     the muted half a second time as a bare number node — an artifact of how it splits
  //     the line, not a string the page renders twice.
  //
  // ASSETS: all five certification badges resolve to a file. The LGPD mark was the one gap
  // this page recorded; it is now exported from the Figma `Assets` file (node 1907:30763)
  // and committed beside the other four, so no cell in band 13 draws a name with no art.
  // Every one of the eleven marquee marks resolves against the shared CLIENTS registry.
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import MiniButton from '@aziontech/webkit/mini-button'
  import Overline from '@aziontech/webkit/overline'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Tag from '@aziontech/webkit/tag'
  import BrandCarousel from '@shared/ui/brand/BrandCarousel.vue'
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
  import {
    BannerContainer,
    CardGrid,
    SectionContainer,
    SectionModule
  } from '@shared/ui/layout/index.js'
  import { useRouter } from 'vue-router'

  // Band 8's art, exported from the Figma `Assets` file (node 1888:224694, named for the
  // band's own headline). Vite resolves it to a hashed asset URL, exactly as the marks in
  // the CLIENTS registry are resolved — the same idiom band 8 of the Financial Services
  // page uses for its own drawing, at the same 592×300 frame.
  import implementApiGatewaySecurity from '../assets/illustrations/implement-api-gateway-security.svg'
  import { NavColumn, NavItem } from '../ui/index.js'
  import SiteCta from './SiteCta.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // ── Band 1 — the eleven marks the strip states ────────────────────────────────
  // The source's marquee, in the source's order. Every name resolves against the shared
  // CLIENTS registry, so a mark this page draws and a mark the home page's trust strip
  // draws can never be two different files.
  const registered = (name) => CLIENTS.find((client) => client.name === name) ?? { name }

  const TRUST_MARKS = [
    registered('Global Fashion Group'),
    registered('HeroSpark'),
    // The source spells it Banco Itaú; Itaú is this repo's registry name for the same client.
    registered('Itaú'),
    registered('NZN'),
    registered('Netshoes'),
    registered('Caixa'),
    registered('Agibank'),
    registered('Prime Video'),
    // The source spells it America Movil; América Móvil is the registry's name for it.
    registered('América Móvil'),
    // The source spells it Grupo Pão de Açucar; GPA is the registry's name for it.
    registered('GPA'),
    registered('Fourbank')
  ]

  // ── Band 3 — what the solution is, in three cells ─────────────────────────────
  // The source draws a bolt, a shield and a code bracket over each cell. Ours are the same
  // three glyphs from the icon library the rest of the page's icons come from.
  const PILLARS = [
    {
      icon: 'pi pi-bolt',
      title: 'API performance',
      description:
        'Build high-performance APIs and microservices with low latency and automatic scalability, maintaining consistency even during traffic spikes.'
    },
    {
      icon: 'pi pi-shield',
      title: 'API security',
      description:
        'Protect APIs and services with multilayer security integrated into distributed infrastructure, with automated threat detection and real-time monitoring.'
    },
    {
      icon: 'pi pi-code',
      title: 'Modern development',
      description:
        'Create serverless applications using your preferred frameworks, running code closer to users while simplifying deployments and operations.'
    }
  ]

  // ── Band 6 — the two stories ──────────────────────────────────────────────────
  const STORIES = [
    {
      eyebrow: 'Tech',
      title:
        'Contabilizei improves the performance of its accounting platform by 73% and reduces front-end costs by 96% by creating advanced caching rules with Azion',
      href: 'https://www.azion.com/en/success-case/contabilizei/'
    },
    {
      eyebrow: 'Tech',
      title:
        'GetNinjas processes 70% of requests on distributed infrastructure while supporting 60% monthly growth',
      href: 'https://www.azion.com/en/success-case/getninjas/'
    }
  ]

  // ── Band 10 — the three documentation entries ─────────────────────────────────
  const RESOURCES = [
    {
      eyebrow: 'Documentation',
      title: 'New at Azion? Start your Azion journey seamlessly',
      description: 'This documentation will guide you through your first steps with Azion.',
      action: 'Read documentation',
      href: 'https://www.azion.com/en/documentation/products/azion-platform-overview/'
    },
    {
      eyebrow: 'Documentation',
      title: 'Build modern applications with Functions',
      description: 'Learn how to create serverless functions that run closer to users.',
      action: 'Read documentation',
      href: 'https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/'
    },
    {
      eyebrow: 'Documentation',
      title: 'SQL Database for modern applications',
      description:
        'Discover how to leverage SQL Database to build data-driven applications on distributed infrastructure.',
      action: 'Read documentation',
      href: 'https://www.azion.com/en/documentation/products/store/edge-sql/'
    }
  ]

  // ── Band 13 — the five certifications ─────────────────────────────────────────
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

  // ── Band 16 — the platform, in four columns ───────────────────────────────────
  // The same four columns and fourteen products the source lists on every product and
  // solution page, so two pages cannot describe one product two ways.
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
</script>

<template>
  <!-- ══ Band 0 + 1 — the hero, and the marks standing on its floor ═════════════
       BannerContainer owns the full-bleed band and the page's top rule. `--banner-offset`
       is the sticky SiteNav's height (h-14 = 3.5rem), so the band still measures exactly
       one screen with the nav above it.

       The wrapper declares that height and hands the leftover to the copy with
       `justify-between`: the claim sits in the middle of what is left, the strip stands on
       the floor. That is what puts the source's second band inside the first without either
       one losing its place in the running order. -->
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
          eyebrow="Technology"
          title="Build high-performance applications"
          description="Develop modern applications with high-performance APIs and microservices on distributed infrastructure. Ensure low latency, scalability during traffic spikes, and advanced security for serverless applications, reducing operational complexity and bringing processing closer to users."
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
           rule: one ink, so eleven brand palettes in one row do not become the loudest
           thing on the page. -->
      <BrandCarousel
        monochrome
        :clients="TRUST_MARKS"
      />
    </div>
  </BannerContainer>

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

    <!-- ── Band 3 — what the solution is, in three cells ────────────────────────
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
                 three are the first sub-headings under the page's `h1` and an `h3` here
                 skips a level (axe `heading-order`). The level is the outline;
                 `text-heading-xs` is the size, and the two are set separately. -->
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

    <!-- ── Bands 5 + 6 — the stories, titled and then told ──────────────────────
         SectionTitle is the opener in the module's `#header` slot: it draws its own rules
         and leaves the top pair of marks to the gap above, so the grid below takes that
         junction as given and owns only its floor. `centered` because the source centres
         this heading; the `//` prefix and the cursor come from SectionTitle's own overline
         anatomy.

         The source's cards carry their own border and radius and scroll sideways behind
         prev/next controls. Here they are two cells of one hairline grid — the seams are
         the grid's `gap-px`, and two cards that fit the frame cannot be over-scrolled. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Success Stories"
          title="The Infrastructure Behind Leading Tech Companies"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          variant="divider"
          :columns="2"
        >
          <div
            v-for="story in STORIES"
            :key="story.href"
            class="flex flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <Overline>{{ story.eyebrow }}</Overline>
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
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- Band 7 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 8 — the art, then the copy ──────────────────────────────────────
         The source sets an API Gateway architecture diagram against the claim, art on the
         start edge. Ours is the design file's own drawing of that path (Figma `Assets`,
         node 1888:224694): the users and the API calling in, the three protected services
         on the platform tray, the origin behind them, all threaded on one live dashed run.

         THE SCENE SCALES INSTEAD OF BEING SCALED. The export carries a `viewBox`, so
         `w-full` + the frame's own `aspect-[592/300]` reflows it to whatever the cell
         offers and the ratio holds at every rung. The cell is flush and the scene uncapped:
         the export already centres its subject with its own air around it, so a padded cell
         would pay for that margin twice, and it is vector, so it scales up as cleanly as
         down. The `width`/`height` attributes reserve the box before the file lands, so the
         band does not shift as it loads. Below `lg` the art is the grid's second row, so
         the copy leads on a phone. -->
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
            class="order-last flex min-w-0 items-center justify-center border-t border-(--border-default) lg:order-first lg:border-r lg:border-t-0"
          >
            <img
              :src="implementApiGatewaySecurity"
              alt="API Gateway Security Architecture Diagram"
              width="592"
              height="300"
              class="block aspect-[592/300] w-full"
            />
          </div>

          <!-- `justify-center`, not the `justify-between` the product pages use: their copy
               halves carry a paragraph and a list that fill the cell, and this one is a
               heading and its one control. Pushed apart they read as two unrelated things
               at opposite ends of a cell the art makes tall. -->
          <div class="flex flex-col justify-center gap-(--spacing-xl) p-(--spacing-xl)">
            <h2 class="m-0 text-balance text-heading-md text-(--text-default)">
              Implement API Gateway security on distributed infrastructure
            </h2>

            <div>
              <MiniButton
                label="Docs"
                icon="pi pi-arrow-right"
                href="https://www.azion.com/en/documentation/architectures/api-gateways/implement-api-gateways-security/"
                target="_blank"
              />
            </div>
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- Band 9 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 10 — Guides and Resources ───────────────────────────────────────
         The source sets this heading against the start edge of its own band, with the three
         cards under it and prev/next controls opposite — so `kind="left"`, in the module's
         header, over the same hairline grid. Three cards fit the frame; nothing to scroll.

         The `Documentation` overline belongs to each CARD, not to the band: the source's
         band has no eyebrow of its own, and the reader's inventory picks up the first
         card's. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          kind="left"
          title="Guides and Resources"
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
            v-for="resource in RESOURCES"
            :key="resource.title"
            class="flex flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <Overline>{{ resource.eyebrow }}</Overline>
            <h3 class="m-0 text-balance text-heading-xs text-(--text-default)">
              {{ resource.title }}
            </h3>
            <p class="m-0 flex-1 text-pretty text-body-sm text-(--text-muted)">
              {{ resource.description }}
            </p>
            <div>
              <MiniButton
                :label="resource.action"
                icon="pi pi-arrow-right"
                :href="resource.href"
                target="_blank"
              />
            </div>
          </div>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- Band 11 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 12 + 13 — the certifications, titled and then shown ────────────
         Five cells, which is one more than CardGrid's widest step, so the hairline grid is
         written out here: `gap-px` over the border colour, every cell filling `--bg-canvas`.
         No badge is filtered on this shell: three carry their own brand colours and the
         fourth is already drawn in the near-white ink a dark-only page wants.

         SIX CELLS BELOW `sm`, FIVE FROM `sm` UP. The wrapper's background IS the hairline,
         so at two columns the sixth slot is not empty space — it is a solid block of border
         colour closing the band. One filler cell absorbs it, and it is gone at the
         five-column step where the row is exact. It is decorative: there is nothing in it
         to reach. -->
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
            <!-- `justify-end` keeps the five labels on one baseline whatever each badge's
                 own aspect ratio is: the art hangs above the pill rather than the pill
                 being pushed off a shared line. `v-if` stays — a certification is named by
                 its pill, and a cell whose file is ever missing draws no empty box. -->
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

          <div
            class="bg-(--bg-canvas) sm:hidden"
            aria-hidden="true"
          />
        </div>
      </FrameBox>
    </SectionModule>

    <!-- Band 14 — spacer. -->
    <SectionGap hatch />

    <!-- ── Bands 15 + 16 — the platform, titled and then listed ─────────────────
         One module, the title in its `#header` slot, so the rule between them is the
         header's own `border-b` rather than two bands' edges meeting. The source's fifth
         eyebrow (`DNS`) is a product name, not a fifth column: its four columns are
         Compute, AI, Data and Security, and DNS is the last product under Security. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Complete, not complex"
          title="Primitives that Scale with You"
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

    <!-- Band 17 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 18 — the closing CTA ────────────────────────────────────────────
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

    <!-- Band 19 — the spacer the source closes on, hatched. A bare FrameBox at SectionGap's
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
