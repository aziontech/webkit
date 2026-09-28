<script setup>
  // Landing-page example: the azion.com/pt-br/planos pricing page, recreated from
  // @aziontech/webkit components and theme tokens. Rendered inside SiteLayout (website
  // nav + footer, no console sidebar).
  //
  // Sections, top to bottom: the hero, the three tiers behind a monthly/annual toggle, then
  // the feature matrix → platform primitives → FAQ → closing CTA.
  //
  // WHAT THIS PAGE DROPPED FROM THE SOURCE, stated because it was real copy: the trust
  // strip, a band two thirds down titled "The Infrastructure Behind High-Performance
  // Applications" over the eyebrow "Trusted by industry leaders". It is gone, marks and
  // all — this page argues on price, and a marquee of logos between the hero and the tiers
  // delays that argument without adding to it.
  //
  // THE ONE BAND WITH NO MARKETING PRIMITIVE BEHIND IT is the feature matrix
  // (PricingComparison): a 100-row comparison table with a sticky plan header is a data
  // surface, not a marketing band, and the system ships no component for it.
  //
  // Copy is the pt-BR page verbatim and lives in ../data/pricing.js, so this file is the
  // page's LAYOUT and nothing else. See that module for the transcription rules.
  //
  // ── THE CARDS ARE `CardPricing`, IN ITS `middle` COMPOSITION ──
  //
  // `slotPosition="middle"` is the full-tier composition: the amount becomes the headline
  // figure, the feature list takes the card's slack, and the action is pinned to the
  // bottom edge — which is what puts three buttons on ONE line whatever each tier's list
  // holds. `aligned` is the other half of reading three cards as one comparison: it
  // reserves the caveat's two lines, so a tier whose sentence runs to one still starts its
  // feature list on the same line as the others.
  //
  // `kind="transparent"` because these cards are cells in the hairline grid, not three
  // surfaces floating on it, so each fills the page itself and the grid's `gap-px` draws
  // the seams between them (CONTAINERS.md § the hairline box grid).
  //
  // The recommended tier is the ONE exception: it fills `--bg-surface` instead of
  // `--bg-canvas`. Two cells of the same grid, one step apart on the surface scale — so
  // the column reads as lifted out of the row without a border, a shadow or a scale that
  // would break the grid's own hairlines. It is the same claim the 2px accent bar makes at
  // the top of that column in the matrix below, carried by the surface here because a card
  // has an interior to fill and a table column does not.
  //
  // ── THE FRAME, PER CONTAINERS.md ──
  //
  // The SectionContainer owns border-x; every brick owns its own border-t and its own
  // padding, which is why the column is unpadded and no module draws a side border. A
  // frame stacked under another is `flush`, so it simply does not draw the rule its
  // neighbour already has.
  //
  // The hero is a Hero — a full-bleed band, so its floor is one rule running
  // the whole width of the window, and the framed column starts under it. Same opening as
  // Functions and Home; the three pages of the site draw their first horizontal one way.
  // The headline still sits on the same content column as the plan names under it and
  // every row label in the matrix below: the band reads `--layout-boundary-inline` and
  // caps at `--layout-measure-site`, which is exactly what the column below it does.
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import CardPricing from '@aziontech/webkit/card-pricing'
  import ColumnNavigation from '@aziontech/webkit/column-navigation'
  import Faq from '@aziontech/webkit/faq'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import {
    BILLING_PERIODS,
    COMPARISON_SECTIONS,
    FAQ,
    ON_DEMAND_LINK,
    PLANS,
    PRIMITIVE_GROUPS
  } from '../data/pricing.js'
  import PricingComparison from './PricingComparison.vue'

  const router = useRouter()

  // ColumnNavigation.Item renders a real anchor and reports the destination it was asked
  // for. An internal one is routed rather than followed, so the app never reloads.
  const openDestination = (event, item) => {
    if (!item.href.startsWith('/')) return
    event.preventDefault()
    router.push(item.href)
  }

  // The billing term drives both the amount and the line under it, so the cards read the
  // period once here rather than each holding two prices.
  const period = ref('monthly')

  // The card carries ONE prose region, under the price, so each tier resolves to one
  // sentence for it: the billing caveat where the tier has one, and the tier's own
  // positioning line where it does not (Hobby is free — "billed monthly" would be a lie).
  const cards = computed(() =>
    PLANS.map((plan) => {
      const price = plan.price[period.value]
      return { ...plan, ...price, caveat: price.details || plan.description }
    })
  )

  // Every tier's action goes where the tier goes: signup for the two self-serve plans,
  // the closing CTA band for the one that needs a conversation.
  const choose = (plan) => {
    if (plan.action.to.startsWith('#')) {
      document.querySelector(plan.action.to)?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    router.push(plan.action.to)
  }

  const goSignup = () => router.push('/signup')
</script>

<template>
  <!-- ══ The hero — a full-bleed band, closing on the page's first rule ═══════
       THE HERO'S FLOOR RUNS TO THE WINDOW'S EDGE, the way Functions' and Home's do. It is
       a Hero, so the band is the full width of the viewport and its `border-b` is the
       page's first horizontal — one uninterrupted line, edge to edge, with the framed
       column starting UNDER it.

       The H1 still lands on the page's ONE content column: the band reads
       `--layout-boundary-inline`, the same token every matrix row label opens at, and its
       column caps at `--layout-measure-site`, the same measure SectionContainer takes
       below — so the alignment holds by construction rather than by two numbers kept equal
       by hand.

       It is a `band`, not a `screen`, AND IT IS SIZED TO A BUDGET: the whole row of tiers —
       plan name, price, caveat, feature list, button, and the card's own floor — has to
       stand inside the first screen, because a price cut in half at the fold is the one
       thing this page cannot afford. The hatched SectionGap under the row is NOT in that
       budget; it is the junction to the matrix and belongs to the second screen. Header 56
       + band + switch strip 89 + card 519.5 is the sum, so the band gets whatever is left
       under the viewport — 231.8 of it at a 900-tall screen. Every number below is set
       against that. -->
  <Hero
    kind="band"
    max-width="site"
    texture="dots"
    texture-fade="bottom"
    :padded="false"
  >
    <!-- THE BAND'S AIR IS ALL AT THE TOP, and that asymmetry is the whole trick. A 56px
         headline sitting 48px under the nav reads as crammed against it; `--spacing-xxl`
         (96px) above gives the texture room to register and the headline room to land.
         The band opens and closes on `--spacing-xxl` — the top rung of the scale, and the
         most the block axis can take (there is no rung above it). The wrapper exists only
         to carry it: `padded` would apply the band's own `--spacing-xl`, one rung short.

         THE TITLE BLOCK BREATHES ON ITS OWN MARGIN. `Hero.Title` sets `--spacing-md` (16px)
         between every part of the block, which is right for a heading and tight for a 56px
         one — headline and description read as glued. The description takes its own
         `mt-(--spacing-md)`, which STACKS on the flex gap (a flex item's margin adds to it)
         for 32px, so the pair reads as headline-then-support. It is a margin and not a
         wider `gap` class because `Hero.Title` composes its own classes without `cn`, so a
         second `gap-*` from here would win or lose on stylesheet order, not on intent.

         ONE MEASURE, ON THE BLOCK, NOT TWO ON ITS PARTS. `--container-4xl` on the wrapper
         is what both the headline and the description read, so the block has a single
         measure instead of a per-element cap that has to be kept in step. The headline
         folds to two lines at 56px there, which is the shape a hero headline wants.

         The description runs on its OWN, much narrower measure — `--container-md` — so it
         breaks to two lines under the headline instead of running the block's full width.
         472px is the rung that breaks it on the SENTENCE, one per line; the wider rungs all
         break mid-phrase (`2xl` leaves "you grow." as an 88px widow, `xl` splits "and /
         scale", `lg` splits "Start / free", which is the page's own CTA). The paragraph is
         764px set solid and the type token's wrap style wins over `text-pretty`, so the
         break has to be chosen by measure rather than left to the browser to balance.

         The page's opening statement, and the only thing on the band: the tiers are the
         page's argument, so the hero states the offer and hands straight over to them. It
         opens on the page's own boundary, the vertical every plan name and matrix row label
         below it starts at. -->
    <div class="max-w-(--container-4xl) py-(--spacing-xxl)">
      <Hero.Title
        title="Plans for every stage of your application"
        description="Every product and feature is available on every plan. Start free and scale as you grow."
        class="[&>p]:mt-(--spacing-md) [&>p]:max-w-(--container-md)"
      />
    </div>
  </Hero>

  <!-- ══ The framed column ═════════════════════════════════════════════════ ─
       THE COLUMN IS INSET FROM THE WINDOW, AT EVERY WIDTH. On a wide screen that inset is
       free: `--layout-measure-site` (1388px) is narrower than the window, `mx-auto` centres the
       column, and its `border-x` reads as the page's vertical frame with canvas either side.
       Below the cap it stops doing anything — the column becomes the window — and the two
       rules land ON the window edges, where a 1px hairline is not a frame, it is a seam
       against the bezel. So the page frame that organises the whole desktop layout simply
       ceased to exist on a phone.

       ONE SYMMETRIC PADDING FIXES IT AT EVERY WIDTH, WITH NO BREAKPOINT. `mx-auto` centres
       inside the PADDING box, so while `window - 2 × boundary ≥ --layout-measure-site` the column
       is capped, not squeezed, and the padding shifts it by exactly nothing: at 1440 the
       column sits at 124…1316 with the wrapper and 124…1316 without it. The padding only
       starts to bite once the window is narrower than the cap — precisely where the cap has
       stopped working — and from there the boundary IS the inset. One declaration covers the
       whole range because the two mechanisms hand off to each other.

       It is `--layout-boundary-inline`, the same token the nav and the hero pad by, so the
       column's rules land on the vertical the page already opens on rather than on a number
       chosen for this page.

       THE HORIZONTALS STAY FULL-BLEED AND THAT IS THE POINT: the hero's `border-b` above and
       the footer's `border-t` below run the whole window, and the column's two verticals run
       between them, inset. That is exactly the desktop relationship — a full-width rule, a
       narrower framed column hanging off it — carried down to the phone instead of collapsing
       there. The header is untouched: it is chrome, and chrome is full-bleed. -->
  <SectionContainer max-width="site">
    <!-- ── The term switch and the three tiers — ONE block ─────────────────
         First brick in the column, so `:divided="false"` — its top edge is the hero band's
         own full-bleed rule. The FrameBox hands the vertical rules back to the column
         (`borders="y"`), drops the top rule it would otherwise draw against the hero's
         (`flush`), and ticks the one junction nothing else draws (`marks="bottom"`).

         The cards are `transparent`: in a hairline grid each cell fills its own background,
         so the recommended tier takes `--bg-surface` and the other two `--bg-canvas` — one
         step apart on the surface scale, which lifts that column out of the row without a
         border, a shadow or a scale that would break the grid's seams. -->
    <SectionModule
      id="plans"
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="flex justify-center border-b border-(--border-default) p-(--spacing-md)">
          <SegmentedButton
            v-model="period"
            :options="BILLING_PERIODS"
            aria-label="Billing period"
          />
        </div>
        <CardGrid
          kind="divider"
          :columns="3"
        >
          <CardPricing
            v-for="card in cards"
            :key="card.id"
            aligned
            slot-position="middle"
            kind="transparent"
            :class="card.highlighted ? 'bg-(--bg-surface)' : 'bg-(--bg-canvas)'"
            :plan-title="card.name"
            :value="card.value"
            :prefix="card.prefix"
            :suffix="card.suffix"
            :show-prefix="Boolean(card.prefix)"
            :show-suffix="Boolean(card.suffix)"
            :pricing-details="card.caveat"
            :show-tag="card.highlighted"
            :tag-label="card.tagLabel"
            action-label=""
            :data-testid="`pricing-card-${card.id}`"
          >
            <!-- What the tier includes: the lead-in the real page states, then the list.
                 The lead-in is a caption on the list, not a heading — it says how to read
                 the lines under it ("everything available", "scale beyond the included
                 limits"), which is a different claim per tier. -->
            <div class="flex flex-col gap-(--spacing-md)">
              <p class="m-0 text-body-sm text-(--text-muted)">{{ card.featuresTitle }}</p>
              <ul class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0">
                <li
                  v-for="feature in card.features"
                  :key="feature.label"
                  class="flex items-start gap-(--spacing-sm)"
                >
                  <i
                    :class="[feature.icon, 'mt-0.5 shrink-0 text-body-sm text-(--primary)']"
                    aria-hidden="true"
                  />
                  <span class="text-body-sm text-(--text-default)">{{ feature.label }}</span>
                </li>
              </ul>
            </div>

            <!-- One filled button in the row, and it is the brand fill: the recommended
                 tier gets `primary`, the other two `outlined`. Three filled buttons side
                 by side name no primary action at all. -->
            <template #actions>
              <Button
                :label="card.action.label"
                :kind="card.action.kind"
                size="large"
                class="w-full"
                @click="choose(card)"
              />
            </template>
          </CardPricing>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- The tiers and the matrix are two readings of the same comparison, and they were
         sharing one hairline — the cards' floor doubling as the matrix's ceiling, which
         read as one 1500px-tall table. A hatched Spacer between them is the page's own
         way of saying "same subject, new section": it registers the junction with its own
         rules and ticks, and gives the sticky plan header a band to arrive over. -->
    <SectionGap hatch />

    <!-- ── The feature matrix ─────────────────────────────────────────────
         `:divided="false"`: the matrix's own sticky plan header carries the rule that
         divides it from the cards band above. `:padded="false"` because every cell in it
         owns its own inset. -->
    <SectionModule
      id="comparison"
      :divided="false"
      :padded="false"
    >
      <PricingComparison
        :plans="PLANS"
        :sections="COMPARISON_SECTIONS"
        :link="ON_DEMAND_LINK"
        @select="choose"
      />
    </SectionModule>

    <SectionGap hatch />

    <!-- ── Platform primitives ────────────────────────────────────────────
         The same `ColumnNavigation` directory the homepage carries, in this page's pt-BR
         wording. The component owns the four tracks, the `lg` inset that puts the column
         heading and every product name on one content column, and the `gap-px` seams —
         which is why no column carries a border of its own. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Platform primitives"
          title="Serverless AI-Native Primitives"
          description="Enterprise-grade reliability, security and performance, without requiring specialized operational expertise."
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
          aria-label="Platform primitives"
        >
          <ColumnNavigation.Column
            v-for="group in PRIMITIVE_GROUPS"
            :key="group.label"
            :title="group.label"
          >
            <ColumnNavigation.Item
              v-for="primitive in group.items"
              :key="primitive.title"
              :icon="primitive.icon"
              :title="primitive.title"
              :description="primitive.description"
              :href="primitive.href || '#'"
              @click="openDestination"
            />
          </ColumnNavigation.Column>
        </ColumnNavigation>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── FAQ ────────────────────────────────────────────────────────────
         Two cells at the design's split: the heading holds the left third and the
         questions the right two. The seam between them and the rules between the
         questions are the grid's `gap-px`, so neither cell draws a border — and each
         fills `--bg-canvas`, or the whole band goes border-coloured. -->
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

    <SectionGap hatch />

    <!-- The closing band, shared with the homepage. It takes no props here: its own
         defaults are this copy, so the two pages close identically. -->
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
        title-muted="Run anywhere."
        description="Get a faster path to launch, less latency, and less infrastructure overhead."
      >
        <template #actions>
          <Button
            label="Start for free"
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
  </SectionContainer>
</template>
