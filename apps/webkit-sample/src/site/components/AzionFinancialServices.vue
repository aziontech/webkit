<script setup>
  // Solution page: Financial Services — a translation of
  // https://www.azion.com/en/solutions/financial-services/ into this site's own page
  // language. The source is the specification for WHAT the page says; CONTAINERS.md is the
  // specification for HOW it is drawn. Every line of copy below is the source's, verbatim;
  // none of its grid, spacing, borders, colours or radii came across.
  //
  // It is azion.com's SOLUTION template — the same 20-band rhythm the product pages run,
  // with the product argument replaced by an industry one — so this page is built the same
  // way as AzionCache.vue and AzionApplicationAccelerator.vue: same skeleton, same bricks,
  // the same closing band. Where the three differ, the source differs.
  //
  //   0  hero (eyebrow, h1, description, two actions)      BannerContainer hero + HeroTitle
  //   1  11-mark client marquee                            BrandCarousel, on the hero's floor
  //   2  spacer                                            SectionGap hatch
  //   3  three argument cells                              CardGrid divider, 3 columns
  //   4  spacer                                            SectionGap hatch
  //   5  "The Infrastructure Behind Leading…"              SectionTitle in the module header
  //   6  three success-story cards                         CardGrid divider, 3 columns
  //   7  spacer                                            SectionGap hatch
  //   8  art | copy — the WAAP architecture                FrameBox, lg:grid-cols-2
  //   9  spacer                                            SectionGap hatch
  //   10 "Guides and Resources" — three cards              SectionTitle left + CardGrid, 3 cols
  //   11 spacer                                            SectionGap hatch
  //   12 "Security and Compliance for High-Stakes…"        SectionTitle in the module header
  //   13 five certification badges                         gap-px grid, 5 cells
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
  //   • The source runs the client strip as its own bordered band under the hero. Here it
  //     stands on the hero's floor and the hero's own `border-b` is the rule that divides it
  //     from the column — the same single line, one owner.
  //   • The hero's eyebrow is `// FINANCIAL SERVICES`. HeroTitle's overline anatomy carries
  //     no `//` prefix (that belongs to SectionTitle and to the closing band), so the hero
  //     reads `FINANCIAL SERVICES`. The three bands that DO have the prefix get it from
  //     SectionTitle's own overline.
  //   • The source states bands 5+6, 12+13 and 15+16 as two bands each: a title, then the
  //     thing it titles. Here each pair is ONE module with the title in its `#header` slot,
  //     so the rule between them is the header's own `border-b` rather than two bands' edges
  //     meeting on one pixel.
  //   • Band 3's three titles are `h3` on the source. This band has no heading of its own, so
  //     they are the first sub-headings under the page's `h1` and an `h3` would skip a level
  //     (axe `heading-order`). They are `h2` here; `text-heading-xs` is the size, and the two
  //     are set separately.
  //   • Bands 6 and 10 are horizontal scrollers with prev/next controls in the source. Three
  //     cards fit the page frame as one row, and a row that cannot be over-scrolled needs no
  //     controls — nor a carousel library (.claude/rules/dependencies.md).
  //   • The source's `Docs` / `View success story` / `Read article` controls carry a trailing
  //     arrow. `MiniButton` is the one control in the system whose icon IS trailing and whose
  //     ink is the page's own, so those are MiniButtons; Button's `icon` is leading-only and
  //     Link paints `--text-link`, the product UI's blue, which nothing else on this site uses.
  //   • Band 8's art is a raster WAAP diagram on the source. Ours is the design team's own
  //     drawing of the same path — the Figma `Per page › Finantial services › Protect
  //     financial applications` frame, exported at 592x300 and committed beside this page —
  //     so the band states the application, the protection modules it passes through and the
  //     payment origin behind them in the art the design file actually holds, rather than as
  //     a picture pasted from the source. Its `alt` names what OUR art shows, so the source's
  //     own alt text does not survive the copy diff: it described art we replaced.
  //   • THE EXPORT IS STRIPPED OF FIGMA'S CHROME. A frame with no fill of its own exports
  //     whatever sits behind it — a full-bleed page-background rect plus both enclosing
  //     sections' plates — and the inner plate (`#444444`) covers the entire 592x300 box, so
  //     the unedited export is a grey card with the scene on top of it. Dropping those five
  //     nodes leaves a transparent illustration that takes the cell's `--bg-canvas`.
  //
  // ASSET GAPS, recorded:
  //   • LGPD — CLOSED. The badge this page had no file for is now exported from the Figma
  //     `Assets` file (node 1907:30763) and committed beside the other four, so all five
  //     cells of band 13 draw the art the source draws.
  //   • The source's eighth marquee mark is `radware-logo.svg` carrying `alt="Prime Video"` —
  //     a mislabel on the source. The mark it actually RENDERS is Radware's, so that is the
  //     mark here, under this repo's registry name for it.
  //   • NZN is a CLIENTS entry with no file, so ClientMark writes its typographic wordmark and
  //     no name is quietly dropped from the eleven.
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

  // Band 8's art, from the Figma `Per page` asset set. Vite resolves it to a hashed asset
  // URL, exactly as the marks in the CLIENTS registry are resolved.
  import protectFinancialApplications from '../assets/illustrations/protect-financial-applications.svg'
  import { NavColumn, NavItem } from '../ui/index.js'
  import SiteCta from './SiteCta.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // The page's outbound destinations, stated once. The source points nine controls at seven
  // URLs; naming the two this page reuses is what keeps them from drifting apart.
  const DOCS = '/site/docs'

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

  // ── Band 3 — the argument, in three cells ─────────────────────────────────────
  // The source draws a stack of rows, a shield and a check over the three cells. Ours are the
  // same three ideas from the icon library the rest of the page glyphs come from.
  const PILLARS = [
    {
      icon: 'pi pi-server',
      title: 'High availability',
      description:
        'Ensure operational continuity for latency-sensitive financial applications and APIs, with automatic scalability and real-time responses, even during transaction peaks.'
    },
    {
      icon: 'pi pi-shield',
      title: 'Advanced security',
      description:
        'Protect financial data and transactions with multilayer security integrated into the application, mitigating API attacks, DDoS, and bots without increasing operational complexity.'
    },
    {
      icon: 'pi pi-check-circle',
      title: 'Continuous compliance',
      description:
        'Meet regulatory requirements with consistent security policies and continuous auditing across distributed environments, without compromising performance or development agility.'
    }
  ]

  // ── Band 6 — the three institutions, and the source's own URLs ────────────────
  const STORIES = [
    {
      eyebrow: 'Financial',
      title:
        'Crefisa uses Azion’s distributed infrastructure-native solutions to scale applications and APIs with higher performance and security',
      href: 'https://www.azion.com/en/success-case/crefisa/'
    },
    {
      eyebrow: 'Tech',
      title:
        'FourBank uses a programmable security layer on distributed infrastructure to mitigate DDoS attacks on applications and APIs',
      href: 'https://www.azion.com/en/success-case/fourbank/'
    },
    {
      eyebrow: 'Tech',
      title:
        'Contabilizei improves the performance of its accounting platform by 73% and reduces front-end costs by 96% by creating advanced cache rules with Azion',
      href: 'https://www.azion.com/en/success-case/contabilizei/'
    }
  ]

  // ── Band 10 — the three things to read next ───────────────────────────────────
  const RESOURCES = [
    {
      eyebrow: 'Documentation',
      title: 'New at Azion? Start your Azion journey seamlessly',
      description: 'This documentation will guide you through your first steps with Azion.',
      action: 'Read documentation',
      href: DOCS
    },
    {
      eyebrow: 'Blog',
      title: 'How Technology Can Help You Comply with Regulations for Fintech',
      description:
        'Distributed infrastructure provides robust security, regulatory compliance, and intelligent monitoring for reliable, scalable operations.',
      action: 'Read article',
      href: 'https://www.azion.com/en/blog/how-technology-can-help-comply-with-regulations-for-fintech/'
    },
    {
      eyebrow: 'Content',
      title: 'How Justa is evolving its technology to meet modern digital demands',
      description:
        'Discover how Justa uses the Azion Web Platform to optimize security and performance in PIX and QR Code transactions.',
      action: 'Read article',
      href: 'https://www.azion.com/en/blog/how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands/'
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
          eyebrow="Financial Services"
          title="Accelerate financial services with security and compliance"
          description="High availability, low latency, and advanced security for financial applications and APIs on distributed infrastructure. Reduce cloud costs, reliance on legacy CDNs, and operational complexity with continuous compliance."
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

    <!-- ── Band 3 — the argument, in three cells ────────────────────────────────
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
         SectionTitle is the opener in the module's `#header` slot: it draws its own rules and
         leaves the top pair of marks to the gap above, so the grid below takes that junction
         as given and owns only its floor. `centered` because the source centres this heading;
         the `//` prefix and the cursor come from SectionTitle's own overline anatomy.

         The source's cards carry their own border and radius and scroll sideways behind
         prev/next controls. Here they are three cells of one hairline grid — the seams are
         the grid's `gap-px`, and three cards that fit the frame cannot be over-scrolled. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Success Stories"
          title="The Infrastructure Behind Leading Financial Institutions"
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
         The source sets a WAAP architecture diagram against the claim, art on the start edge.
         Ours is the design file's own drawing of that path: the application, the four
         protection modules it passes through, the payment origin behind them.

         THE SCENE SCALES INSTEAD OF BEING SCALED. The export carries a `viewBox`, so
         `w-full` + the frame's own `aspect-[592/300]` reflows it to whatever the cell offers
         and the ratio holds at every rung — which is why the measured `scale-*` ladder that
         stood here is gone, along with the `overflow-hidden` that existed only to clip what
         a fixed-width row could not fit. The cell is flush and the scene uncapped: the
         export already centres its subject with its own air around it, so a padded cell paid
         for that margin twice, and it is vector, so it scales up as cleanly as down. The
         `width`/`height` attributes reserve the box before the file lands, so the band does
         not shift as it loads. Below `lg` the art is the grid's second row, so the copy leads
         on a phone. -->
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
              :src="protectFinancialApplications"
              alt="An application passing through the protection modules on its way to the payment origin"
              width="592"
              height="300"
              class="block aspect-[592/300] w-full"
            />
          </div>

          <!-- `justify-center`, not the `justify-between` the sibling pages use: their copy
               halves carry a paragraph and a list that fill the cell, and this one is a
               heading and its one control. Pushed apart they read as two unrelated things at
               opposite ends of a cell the art makes tall. -->
          <div class="flex flex-col justify-center gap-(--spacing-xl) p-(--spacing-xl)">
            <h2 class="m-0 text-balance text-heading-md text-(--text-default)">
              Protect financial applications with advanced security on distributed infrastructure
            </h2>

            <div>
              <MiniButton
                label="Docs"
                icon="pi pi-arrow-right"
                href="https://www.azion.com/en/documentation/architectures/edge-firewall/web-application-and-api-protection-waap/"
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
         header, over the same hairline grid. Three cards fit the frame; nothing to scroll. -->
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

         SIX CELLS BELOW `sm`, FIVE FROM `sm` UP. The wrapper's background IS the hairline, so
         at two columns the sixth slot is not empty space — it is a solid block of border
         colour closing the band. One filler cell absorbs it, and it is gone at the five-column
         step where the row is exact. It is decorative: there is nothing in it to reach. -->
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
            <!-- `justify-end` keeps the five labels on one baseline whatever each badge's own
                 aspect ratio is: the art hangs above the pill rather than the pill being pushed
                 off a shared line. `v-if` stays — a certification is named by its pill, and a
                 cell whose file is ever missing draws no empty box. -->
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
         One module, the title in its `#header` slot, so the rule between them is the header's
         own `border-b` rather than two bands' edges meeting. The source's fifth eyebrow
         (`DNS`) is a product name, not a fifth column: its four columns are Compute, AI, Data
         and Security, and DNS is the last product under Security. -->
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
         The Site's own closing band, with this page's strings passed in. The source closes
         every solution page on the same words as its product pages, so these match
         AzionCache's exactly — stated explicitly rather than left to the component's
         defaults, which are the homepage's. -->
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
