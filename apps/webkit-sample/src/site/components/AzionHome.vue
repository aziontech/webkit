<script setup>
  // The Azion home page — a block-for-block translation of azion.com/en, produced with
  // the /site-design-translate flow: the live page is read mechanically into a band
  // inventory, and every band is rebuilt out of this app's own page primitives.
  //
  // TWO HALVES, AND NEITHER BENDS TOWARD THE OTHER.
  //
  //   CONTENT is the source's, verbatim. Every headline, category label, sentence, list
  //   item, link label, figure and mark below is what azion.com/en renders, in the order
  //   it renders them. Nothing is paraphrased, tightened or added — an eyebrow the source
  //   does not write does not appear here, and a band the source has is not dropped.
  //
  //   FORM is ours. The source's grid, spacing, borders and colours are not carried over.
  //   Layout is the framed grid of CONTAINERS.md — the same three-layer skeleton the Hub
  //   and Docs homes use, on theme tokens:
  //
  //     BannerContainer hero  → the full-bleed hero band, exactly one viewport tall,
  //                             owning the page's top rule (border-b).
  //     SectionContainer      → the centered column below it, owning border-x.
  //     SectionModule         → each brick inside it, owning its own border-t and its
  //                             own padding (which is why the column is unpadded).
  //
  //   The footer owns border-t, so every edge of the frame is drawn exactly once. Where a
  //   brick meets a rule it does not own it draws no second one: a frame stacked under
  //   another is `flush`, a row of cells takes its seams from the grid's `gap-px`, and a
  //   cell inside such a grid draws neither borders nor registration marks.
  //
  // WHERE OUR FORM DEPARTS FROM THE SOURCE, on purpose:
  //   • The source's opening band is ~514px. Ours is `hero` — one viewport — because that
  //     is this language's hero rule.
  //   • The source runs the trust strip as its own bordered band under the hero. Here it
  //     stands on the hero's floor, and the hero's own `border-b` is the rule that
  //     divides it from the column — the same single line, one owner.
  //   • The source states each "title band + body band" pair as two sections. Here a pair
  //     is ONE SectionModule with the title in its `#header` slot, so the rule between
  //     them is the header's `border-b` rather than two bands' edges meeting.
  //   • The awards row is a four-up grid, not the source's three-up carousel: all four
  //     fit the page frame, and a row that cannot be over-scrolled needs no controls
  //     (.claude/rules/dependencies.md).
  //
  // ASSET GAPS, recorded rather than substituted: the source's award-source logos (G2,
  // GigaOm, Frost & Sullivan) are not in this repo — MarketLeader states the source in
  // type. NZN and Zoop have no client mark here and render as typographic wordmarks
  // (ClientMark's own fallback), so no list quietly loses a name.
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionTitle from '@aziontech/webkit/section-title'
  // Imported directly rather than through BannerContainer's `banner` prop: this band is a
  // FrameBox, not a BannerContainer, so there is no container to name it on. The registry
  // still owns it — this is its named export.
  import { MapBanner } from '@shared/ui/banners/index.js'
  import BrandCarousel from '@shared/ui/brand/BrandCarousel.vue'
  import { TOOLS } from '@shared/ui/brand/tools.js'
  import {
    BannerContainer,
    CardGrid,
    SectionContainer,
    SectionModule
  } from '@shared/ui/layout/index.js'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  import {
    ClaimChips,
    ClientMark,
    CLIENTS,
    NavColumn,
    NavItem,
    NETWORK_CLAIMS
  } from '../ui/index.js'
  import CapabilitiesSection from './CapabilitiesSection.vue'
  import ClientStories from './ClientStories.vue'
  import DevPlatform from './DevPlatform.vue'
  import MarketLeader from './MarketLeader.vue'
  import SiteCta from './SiteCta.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  const clientNamed = (name) => CLIENTS.find((client) => client.name === name)

  // The outcome row under the network panel: one benefit per registration-framed cell,
  // written as a single sentence — the claim itself in the default colour, the rest of
  // the line muted — and signed with the client mark of the workload it came from. Reads
  // as proof rather than as a scoreboard of loose numbers.
  //
  // These are the source's four figures (7x faster pages, 90% lower cloud costs, 40x more
  // simultaneous connections, 100% OWASP Top 10 mitigation), stated as this page states
  // them: the same four facts, in the block this page already had for them.
  //
  // PLACEHOLDER PAIRING: the numbers are the platform's published claims; which client
  // each is signed with is illustrative, the same placeholder convention ClientStories
  // already carries. Real attributions before this ships.
  const benefits = [
    { claim: '7x faster', line: 'page loads under peak retail traffic.', client: 'Magalu' },
    { claim: '90% lower', line: 'cloud spend after moving workloads to the edge.', client: 'GPA' },
    { claim: '40x more', line: 'simultaneous connections held per origin.', client: 'Itaú' },
    {
      claim: '100% of',
      line: 'OWASP Top 10 threats mitigated before the origin.',
      client: 'Coca-Cola'
    }
  ].map((benefit) => ({ ...benefit, mark: clientNamed(benefit.client) }))

  // The trust strip, in the source's order. Named rather than passed as the whole
  // registry: the registry holds every client this app knows, and this row is the eleven
  // the home page states. A name with no mark still renders (ClientMark falls back to a
  // typographic wordmark), so the list stays the source's eleven either way.
  const TRUST_MARKS = [
    'Global Fashion Group',
    'HeroSpark',
    'Itaú',
    'NZN',
    'Netshoes',
    'Caixa',
    'Agibank',
    'Prime Video',
    'América Móvil',
    'GPA',
    'Fourbank'
  ]
  const trustMarks = computed(() =>
    TRUST_MARKS.map((name) => CLIENTS.find((client) => client.name === name) ?? { name })
  )

  // The platform primitives, in the source's four groups. One <NavColumn> per group, one
  // <NavItem> per primitive — the site's own link row, built to the Figma NavigationItem:
  // registration-framed glyph, name, one line of what it does.
  //
  // Every row is a link, because on the site every product row is one — and the hover
  // state the design draws only exists on a link. `href` is the source's own destination,
  // except Functions: this sample ships that page itself, and a demo whose links leave
  // the demo is not demonstrating anything.
  const primitiveGroups = [
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
          icon: 'pi pi-sitemap',
          title: 'Rules Engine',
          description: 'Automate request handling with programmable rules',
          href: 'https://www.azion.com/en/documentation/products/build/applications/rules-engine/'
        },
        {
          icon: 'ai ai-load-balancer',
          title: 'Load Balancer',
          description: 'Distribute traffic for performance and availability',
          href: 'https://www.azion.com/en/products/load-balancer/'
        },
        {
          icon: 'pi pi-image',
          title: 'Image Processor',
          description: 'Optimize and transform images in real time',
          href: 'https://www.azion.com/en/products/image-processor/'
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
          description: 'Relational database built for distributed applications',
          href: 'https://www.azion.com/en/products/sql-database/'
        },
        {
          icon: 'ai ai-edge-kv',
          title: 'KV Store',
          description: 'Globally distributed, low-latency key-value store',
          href: 'https://www.azion.com/en/products/kv-store/'
        },
        {
          icon: 'ai ai-tiered-cache',
          title: 'Cache',
          description: 'Accelerate content delivery and reduce origin load',
          href: 'https://www.azion.com/en/products/cache/'
        }
      ]
    },
    {
      label: 'Security',
      items: [
        {
          icon: 'ai ai-waf-rules',
          title: 'Web Application Firewall',
          description: 'Protect human and AI applications from threats',
          href: 'https://www.azion.com/en/products/web-application-firewall/'
        },
        {
          icon: 'ai ai-azion-api',
          title: 'API Gateway',
          description: 'Secure, manage, and scale API traffic',
          href: 'https://www.azion.com/en/solutions/api-gateway/'
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
  <!-- ── Band 0 + 1: hero and trust strip ─────────────────────────────────────
       BannerContainer owns the full-bleed band and the page's top rule; the copy goes in
       the default slot (z-10) over the `dot-grid` backdrop — the source's own hero
       texture, measured off its render and carried by every hero on this site.
       `--banner-offset` is the sticky SiteNav's height (h-14 =
       3.5rem), so the hero still measures one screen with the nav above it. -->
  <BannerContainer
    hero
    banner="dot-grid"
    max-width="site"
    class="[--banner-offset:3.5rem]"
  >
    <!-- The band holds two things, top to bottom: the copy, and the trust strip standing
         on the floor. The strip is part of the hero here rather than a band under it — so
         the wrapper declares the band's own height (`100dvh - --banner-offset`, less the
         container's own `py-xl` at each end) and hands the leftover to the copy with
         `justify-between`. That makes the band's `justify-center` a no-op instead of
         something to fight, and it is what puts the marks on the bottom edge of ONE
         screen rather than floating them a third of the way up it. -->
    <div
      class="flex min-h-[calc(100dvh-var(--banner-offset,0px)-var(--spacing-xl)*2)] flex-col justify-between gap-(--spacing-xxl)"
    >
      <!-- Hero copy anatomy: headline → description → actions. No eyebrow, because the
           source writes none: the headline opens the page on its own, and its accent
           phrase is the source's own first line.

           `flex-1` + `justify-center` is what keeps the headline optically centred in
           whatever the strip leaves rather than hanging from the nav. -->
      <div class="flex flex-1 flex-col justify-center">
        <HeroTitle
          centered
          highlight="Distributed Infrastructure"
          title="for Modern Workloads"
          description="Networking, compute, AI, data, and security that autonomously scale up and down instantly. And it stays up when others go down."
        >
          <!-- The stacking and the fluid width belong to HeroTitle's actions row, so the
               CTAs go in bare. -->
          <template #actions>
            <Button
              label="Start Free"
              kind="primary"
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

      <!-- The source's own band-1 label and its eleven marks. `monochrome`: one white ink
           for every mark, which is how the source paints this row — and the reason it
           does. Placed honestly (brand colours where the brand ships them) the row was
           ten white marks and one full-colour América Móvil, so the mark the eye landed
           on was the one that happened to ship a colour file, and on this dark band its
           mid-tone blues carried the least contrast of anything in the row.
           `brightness-0 invert` flattens all eleven to the same white silhouette. -->
      <BrandCarousel
        label="Trusted by mission-critical workloads"
        :clients="trustMarks"
        monochrome
      />
    </div>
  </BannerContainer>

  <!-- ══ The framed column ═════════════════════════════════════════════════════
       Every band after the hero is a brick inside one centered column. The column
       carries only `border-x`; its top edge is the hero's `border-b` and its bottom edge
       the SiteFooter's `border-t`, so the four sides read as one frame with no doubled
       lines. This matches the source exactly — its band 1 is the last full-bleed one and
       every band after it carries `border-x`. -->
  <SectionContainer max-width="site">
    <!-- ── Bands 2 + 3: platform primitives ───────────────────────────────────
         The title band and the grid it titles, as one module: `:divided="false"` because
         the header's top edge is already the hero's `border-b`.

         A framed headline block over a four-column hairline grid, one column per group —
         <NavColumn> and <NavItem>, the site's own link set. The column heading sits over
         its own rule and shares the `lg` inset with the rows beneath it, so the label and
         every product name start on ONE content column; the grid's `gap-px` draws the
         seams, which is why no column carries a border of its own. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle title="Serverless AI-Native Primitives for Autonomous Workloads" />
      </template>

      <!-- Only `y` — the left and right edges are the column's own border-x, and drawing
           them here would put two hairlines on one line. `flush` and `marks="bottom"` say
           the same thing about the rule ABOVE: the SectionTitle in the `#header` slot is
           itself a frame and already draws its own bottom rule and its own bottom pair of
           ticks, so this band draws neither again — it owns only its floor. -->
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          variant="divider"
          :columns="4"
          :mobile-columns="1"
        >
          <NavColumn
            v-for="group in primitiveGroups"
            :key="group.label"
            :title="group.label"
          >
            <NavItem
              v-for="primitive in group.items"
              :key="primitive.title"
              :icon="primitive.icon"
              :title="primitive.title"
              :description="primitive.description"
              :href="primitive.href"
            />
          </NavColumn>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- ── Bands 4 + 5: the network, and what it produces ─────────────────────
         The infrastructure claim, framed: the headline and the claim chips over the
         dotted world map, then the source's four outcome figures as their own row of
         registration-framed cells directly under it. No spacer anywhere in here — the
         source runs bands 3 → 4 → 5 with none between them, so this module's `flush` top
         rule lands on the primitives band's floor and the two frames inside it stack.

         Every rule and every tick is drawn exactly once. `borders="y"` on the full-width
         panel hands the vertical rules back to the column; `flush` drops its top rule
         onto the primitives band's bottom one instead of beside it, and `marks="bottom"`
         does the same for the ticks. The outcome row below it carries no borders of its
         own — its seams are the grid's `gap-px` over the border colour, so four adjacent
         cells produce three hairlines rather than six. Padding lives inside the frames
         only. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <div class="flex flex-col">
        <FrameBox
          flush
          borders="y"
          marks="bottom"
          class="overflow-hidden"
        >
          <!-- The network itself, as the frame's backdrop: the pixel world map, its route
             picked out in the accent — the source's own dotted map, in our asset. It
             parks in the RIGHT part of the band (see --map-inset-inline-start in
             MapBanner), so it reads as the art half beside the copy rather than spanning
             the whole frame behind it; its scrims stay full-bleed and wash left-to-right
             into the artwork's leading edge. -->
          <MapBanner />
          <div class="relative z-10 grid items-center gap-(--spacing-xl) lg:grid-cols-2">
            <!-- Copy hangs from the top edge rather than centring in the band: the map
               behind it is a full-height backdrop, so a centred block floated in the
               middle of the frame with no edge to hold onto.

               Below lg the map is no longer the art half beside the copy — it sits nearly
               full-bleed behind it — so the block splits instead: the title keeps a
               modest top pad and the claim chips are pushed to the floor of the band,
               which puts the map's own body between them rather than behind a solid stack
               of copy. From lg the copy has its own column again, hangs from the top
               edge, and falls back to the frame's vertical rhythm. -->
            <div
              class="flex min-h-[clamp(340px,52vh,620px)] flex-col justify-between gap-(--spacing-xl) md:px-(--spacing-xl) px-(--layout-boundary-inline) pt-[clamp(2rem,7vh,3.25rem)] pb-(--spacing-xl) lg:justify-start lg:py-(--spacing-xxl) lg:pt-(--spacing-xxl)"
            >
              <h2 class="text-balance text-heading-2xl text-(--text-default)">
                The most reliable infrastructure
              </h2>
              <!-- The claim chips, from the shared list and the shared treatment
                 (`brand/claims.js` + `ClaimChips`) — the same five the source states, and
                 the same five the signed-out NetworkPanel puts under its headline, so the
                 two surfaces cannot quote different numbers at the same person minutes
                 apart. -->
              <ClaimChips :claims="NETWORK_CLAIMS" />
            </div>
            <!-- Second cell intentionally empty: the map behind IS the art half. -->
          </div>
        </FrameBox>

        <!-- The outcome row: claim on top, client mark on the floor of every cell.
             `justify-between` is what aligns the marks with each other — the copy hangs
             from the top edge, the mark sits on the bottom one, so the row reads as a
             single baseline no matter how long a sentence runs.

             THE ROW IS THE FRAME, NOT THE CELLS. Its seams are the grid's `gap-px`
             showing the wrapper's border colour, the way every other hairline grid on
             this page is built — four bordered cells would draw each internal seam twice
             and the outer two a third time against the column's own `border-x`, and four
             marked cells would put a pair of ticks either side of every seam. So the
             cells declare `borders="none" marks="none"` and the row's own FrameBox owns
             the one edge nothing else draws: its floor, and the pair of ticks that
             register it. The top rule and its ticks are the panel's above; the sides are
             the column's; the SectionGap below is `flush`, so it takes this floor as its
             own ceiling. -->
        <FrameBox
          borders="bottom"
          marks="bottom"
        >
          <div class="grid grid-cols-2 gap-px bg-(--border-default) lg:grid-cols-4">
            <FrameBox
              v-for="benefit in benefits"
              :key="benefit.client"
              borders="none"
              marks="none"
              class="min-w-0 bg-(--bg-canvas)"
            >
              <div class="flex h-full flex-col justify-between gap-(--spacing-xl) p-(--spacing-xl)">
                <p class="m-0 text-pretty text-heading-sm text-(--text-muted)">
                  <span class="font-medium text-(--text-default)">{{ benefit.claim }}</span>
                  {{ benefit.line }}
                </p>
                <!-- The signature strip: a fixed 24px band every cell reserves, so the
                     four marks land on exactly one line and one left edge however long
                     the sentence above them runs. The band is also what keeps a flex
                     column from stretching a `w-auto` image sideways. -->
                <div
                  v-if="benefit.mark"
                  class="flex h-6 items-center"
                >
                  <ClientMark
                    colored
                    :client="benefit.mark"
                    mark="h-full w-auto max-w-32 object-contain object-left"
                  />
                </div>
              </div>
            </FrameBox>
          </div>
        </FrameBox>
      </div>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── Band 7: what the platform is for ───────────────────────────────── -->
    <CapabilitiesSection />

    <SectionGap hatch />

    <!-- ── Band 9: your stack, your way ───────────────────────────────────────
         The same component as the hero's trust strip with a different list: the source
         runs both rows as one marquee pattern, and so do we. `borders="y"` hands the
         vertical rules to the column and `flush` drops the top rule onto the SectionGap
         above; the band owns only its floor and the ticks that register it. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="py-(--spacing-xxl)">
          <BrandCarousel
            label="Your Stack, Your Way"
            :clients="TOOLS"
            monochrome
          />
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── Bands 11 + 12: complete development platform ───────────────────── -->
    <DevPlatform />

    <SectionGap hatch />

    <!-- ── Bands 14 + 15: recognized as a market leader ───────────────────── -->
    <MarketLeader />

    <SectionGap hatch />

    <!-- ── Band 17: client stories ────────────────────────────────────────── -->
    <ClientStories />

    <SectionGap hatch />

    <!-- ── Band 19: the closing CTA ───────────────────────────────────────────
         Every string is the source's. The headline is one sentence in two tones, which is
         how the source sets it (`Everywhere.` in the muted colour) and how this band's
         `title` / `titleMuted` pair already expresses it. -->
    <SiteCta
      eyebrow="Build"
      title="Build, run, and protect applications."
      title-muted="Everywhere."
      description="Get faster launches, lower latency, and less infrastructure overhead from day one."
      primary-label="Start Free"
      secondary-label="Talk to our team"
    />

    <!-- ── Band 20: the closing spacer ────────────────────────────────────────
         The band the source closes its column with, hatched: the one band on the page
         with no content of its own, so the texture reads as the page's own material.

         A bare FrameBox rather than SectionGap, at that component's own `medium` height,
         because this one must draw NO rules. The footer below opens with a full-bleed
         rule the way the hero closes with one, and SectionGap's fixed `borders="y"` would
         put a second hairline on that same pixel across the column's width. Its sides
         stay the column's border-x, as everywhere else on the page. -->
    <FrameBox
      borders="none"
      marks="none"
      hatch
      class="h-[calc(var(--spacing-xxl)*2)]"
    />
  </SectionContainer>
  <!-- ══ End framed column ═════════════════════════════════════════════════ -->
</template>
