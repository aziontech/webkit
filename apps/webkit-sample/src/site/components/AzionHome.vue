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
  //   ONE BAND IS EXEMPT. The closing CTA (band 19) states this platform's own ask, in
  //   this app's own words — the same closing band every other page on this site carries.
  //
  //   FORM is ours. The source's grid, spacing, borders and colours are not carried over.
  //   Layout is the framed grid of CONTAINERS.md — the same three-layer skeleton the Hub
  //   and Docs homes use, on theme tokens:
  //
  //     Hero kind="screen"  → the full-bleed hero band, exactly one viewport tall,
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
  //   • The awards row is the source's carousel, drawn as a ticker of sourced
  //     recognitions that runs edge to edge between the frame's rules and pauses on hover.
  //
  // ASSET GAPS, recorded rather than substituted: NZN and Zoop have no client mark here
  // and render as typographic wordmarks (ClientMark's own fallback), so no list quietly
  // loses a name.
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import ClientKpiQuote from '@aziontech/webkit/client-kpi-quote'
  import ColumnNavigation from '@aziontech/webkit/column-navigation'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import NetworkMap from '@aziontech/webkit/network-map'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  // The one colour mark this band names as a file. It stays page-local rather than
  // becoming a `logoLight` on the shared CLIENTS entry, which every other strip reads.
  import rennerColor from '@shared/assets/clients/light/renner-logo.svg'
  import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'
  import { useRouter } from 'vue-router'

  import { PLATFORM_PRIMITIVES } from '../data/platform-primitives.js'
  import { ClientMark, CLIENTS, NETWORK_CLAIMS } from '../ui/index.js'
  import ClientStories from './ClientStories.vue'
  import MarketLeader from './MarketLeader.vue'
  import WhyAzion from './WhyAzion.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // ColumnNavigation.Item renders a real anchor and reports the destination it was asked
  // for. An internal one is routed rather than followed, so the app never reloads; an
  // external one is left to the browser.
  const openDestination = (event, item) => {
    if (!item.href.startsWith('/')) return
    event.preventDefault()
    router.push(item.href)
  }

  const clientNamed = (name) => CLIENTS.find((client) => client.name === name)

  // The outcome row under the network panel. Its four figures used to be unattributed and
  // were marked a PLACEHOLDER from the day they landed ("Real attributions before this
  // ships"); each is now a published success case, signed by the client it belongs to and
  // read the way `ClientKpiQuote` states one — the result leads, the rest of the sentence
  // follows it. Netshoes and GPA are not here: they already speak in band 17.
  //
  // `ink` is MEASURED, not chosen. SiteLayout pins the site dark, so the cell's canvas is
  // #000; a mark keeps its brand colour when that colour clears 3:1 on it (WCAG 1.4.11)
  // and takes the one white ink when it does not — or, as for three of these four, when
  // no colour file exists at all. Renner #D72027 measures 4.13:1; Dafiti draws in
  // `currentColor` and MadeiraMadeira and Fourbank ship white artwork only.
  const outcomes = [
    {
      key: 'dafiti',
      mark: clientNamed('Dafiti'),
      ink: 'white',
      kpi: '86% faster',
      text: 'load times, with a 45% cost reduction in data transfer.'
    },
    {
      key: 'madeiramadeira',
      mark: clientNamed('MadeiraMadeira'),
      ink: 'white',
      kpi: '90% lower',
      text: 'cloud costs, and faster product delivery at scale.'
    },
    {
      key: 'renner',
      mark: { name: 'Renner', logoLight: rennerColor },
      ink: 'brand',
      kpi: '67% saved',
      text: 'on data transfer costs, through massive traffic spikes.'
    },
    {
      key: 'fourbank',
      mark: clientNamed('Fourbank'),
      ink: 'white',
      kpi: 'DDoS mitigated',
      text: 'on applications and APIs, behind a programmable security layer.'
    }
  ]
</script>

<template>
  <!-- ── Band 0 + 1: hero and trust strip ─────────────────────────────────────
       Hero owns the full-bleed band and the page's top rule. The copy is centred on the
       dot field the `texture` prop paints, which fades out before the floor the trust
       marks stand on. `--banner-offset` is the sticky SiteNav's height (h-14 = 3.5rem),
       so the hero still measures one screen. -->
  <Hero
    kind="screen"
    align="center"
    max-width="site"
    texture="dots"
    texture-fade="bottom"
    carousel
    carousel-label="Trusted by mission-critical workloads"
    :carousel-marks="CLIENT_STRIP"
    class="[--banner-offset:3.5rem]"
  >
    <!-- Hero copy anatomy: accent phrase → headline → description → actions. No eyebrow:
         the accent phrase opens the page and reads as one sentence with the title. -->
    <Hero.Title
      centered
      highlight="Distributed Infrastructure"
      title="for Modern Workloads"
      description="Networking, compute, AI, data, and security that autonomously scale up and down instantly. And it stays up when others go down."
    >
      <!-- The stacking and the fluid width belong to Hero.Title's actions row, so the
           CTAs go in bare. -->
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
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </Hero.Title>
  </Hero>

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

         A framed headline block over `ColumnNavigation` — the system's own product
         directory: one column per group, an overline heading over a rule, then the
         group's products as link rows. The component owns the column count, the `lg`
         inset that puts the label and every product name on ONE content column, and the
         `gap-px` seams, which is why no column carries a border of its own. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle title="Serverless AI-Native Primitives for Autonomous Workloads" />
      </template>

      <!-- Only `y` — the left and right edges are the column's own border-x, and drawing
           them here would put two hairlines on one line. `flush` says the same of the rule
           ABOVE: the SectionTitle in the `#header` slot is itself a frame and already draws
           it, so this band owns only its floor. The ticks are not shared the way the rule
           is — every corner of every frame on the page is registered. -->
      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <ColumnNavigation
          :columns="4"
          :mobile-columns="1"
          aria-label="Platform primitives"
        >
          <ColumnNavigation.Column
            v-for="group in PLATFORM_PRIMITIVES"
            :key="group.label"
            :title="group.label"
          >
            <ColumnNavigation.Item
              v-for="primitive in group.items"
              :key="primitive.title"
              :icon="primitive.icon"
              :title="primitive.title"
              :description="primitive.description"
              :href="primitive.href"
              @click="openDestination"
            />
          </ColumnNavigation.Column>
        </ColumnNavigation>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── Bands 4 + 5: the network, and what it produces ─────────────────── -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="all"
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
          <!-- From `lg` the headline hangs from the top edge and the claim tags are pushed
               to the floor, so the map's own body is what sits between them rather than a
               solid stack of copy over it. Below `lg` the map is nearly full-bleed and its
               dots sit low and right, so the same split would open a band of empty canvas
               between the two — there the copy stays one block at the top and the map takes
               the whole floor. -->
          <div
            class="flex min-h-[clamp(340px,52vh,620px)] flex-col justify-start gap-(--spacing-xl) p-(--spacing-xxl) lg:justify-between"
          >
            <SectionTitle
              :framed="false"
              kind="left"
              size="medium"
              title="The most reliable infrastructure"
              class="[&_h2]:max-w-[9em]"
            />

            <ul class="m-0 flex max-w-(--container-md) list-none flex-wrap gap-(--spacing-xs) p-0">
              <li
                v-for="claim in NETWORK_CLAIMS"
                :key="claim"
                class="inline-flex h-6 items-center rounded-(--shape-elements) border border-(--primary) bg-[color-mix(in_srgb,var(--primary)_10%,var(--bg-canvas))] px-(--spacing-xs) text-label-sm text-(--text-default)"
              >
                {{ claim }}
              </li>
            </ul>
          </div>

          <CardGrid
            kind="divider"
            :columns="4"
            class="border-t border-(--border-default)"
          >
            <ClientKpiQuote
              v-for="outcome in outcomes"
              :key="outcome.key"
              :kpi="outcome.kpi"
              :text="outcome.text"
            >
              <template #mark>
                <ClientMark
                  :client="outcome.mark"
                  :colored="outcome.ink === 'brand'"
                  :monochrome="outcome.ink === 'white'"
                  mark="h-full w-auto max-w-32 object-contain"
                />
              </template>
            </ClientKpiQuote>
          </CardGrid>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <WhyAzion />

    <SectionGap hatch />

    <!-- ── Bands 14 + 15: recognized as a market leader ───────────────────── -->
    <MarketLeader />

    <SectionGap hatch />

    <!-- ── Band 17: client stories ────────────────────────────────────────── -->
    <ClientStories />

    <SectionGap hatch />

    <!-- ── Band 19: the closing CTA ───────────────────────────────────────────
         The Site's own closing band, on the same words every other page closes with: the
         raised lead cell states the ask and floors the primary way in, the aside carries
         the way to a conversation. Two ways in, one each side of the rule, so neither
         reads as the other's footnote. -->
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
        title="Build, run, and protect applications."
        title-muted="Everywhere."
        description="Get faster launches, lower latency, and less infrastructure overhead from day one."
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
      marks="all"
      data-hatch="true"
      class="h-[calc(var(--spacing-xxl)*2)]"
    >
      <TextureMaterial kind="lines" />
    </FrameBox>
  </SectionContainer>
  <!-- ══ End framed column ═════════════════════════════════════════════════ -->
</template>
