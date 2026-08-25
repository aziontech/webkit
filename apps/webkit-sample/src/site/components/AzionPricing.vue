<script setup>
  // Landing-page example: the azion.com/pt-br/planos pricing page, recreated from
  // @aziontech/webkit components and theme tokens. Rendered inside SiteLayout (website
  // nav + footer, no console sidebar).
  //
  // Sections, top to bottom: the headline and the three tiers behind a monthly/annual
  // toggle — ONE block — then the feature matrix → trust strip → platform primitives →
  // FAQ → closing CTA.
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
  // There is NO hero band. The page opens on the first brick of the column — the headline
  // and the three tiers in one block — so the nav's own rule is the page's top rule, and
  // the headline sits on the same content column as the plan names under it and every row
  // label in the matrix below. A separate full-bleed band would have centred that headline
  // in a column of its own, at its own inset, above the very cards it introduces.
  import Accordion from '@aziontech/webkit/accordion'
  import Button from '@aziontech/webkit/button'
  import CardPricing from '@aziontech/webkit/card-pricing'
  import FrameBox from '@aziontech/webkit/frame-box'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionTitle from '@aziontech/webkit/section-title'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import BrandCarousel from '@shared/ui/brand/BrandCarousel.vue'
  import { CardGrid, SectionContainer, SectionModule } from '@shared/ui/layout/index.js'
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
  import { CLIENTS, NavColumn, NavItem } from '../ui/index.js'
  import PricingComparison from './PricingComparison.vue'
  import SiteCta from './SiteCta.vue'

  const router = useRouter()

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
</script>

<template>
  <!-- ══ The framed column ═════════════════════════════════════════════════ -->
  <SectionContainer max-width="site">
    <!-- ── The headline and the three tiers — ONE block ────────────────────
         The page's opening claim and the thing it is claiming about belong to the same
         brick: the reader's whole job here is to get to the three columns, so the
         headline is the block's opening band and the cards are its floor, under one
         frame. It used to be a full-bleed hero band of its own above the column, which put
         the H1 in a second centred column at a second inset — the band's own `xl` against
         the column's `lg` boundary — so the page's first line landed a step to the right of
         every plan name under it.

         First brick in the column, so `:divided="false"` — its top edge is the nav's own
         rule. The band is a registration frame: `borders="y"` hands the vertical rules
         back to the column, `flush` drops the top rule it would otherwise draw against
         that same nav rule, and `marks="bottom"` ticks the one junction nothing else
         draws. -->
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
        <!-- The headline takes the PAGE BOUNDARY and nothing else: `layout-boundary-inline`
             is the same token the plan names beside it, every matrix row label and every
             action footer in this app open at, so the H1, the tiers and the comparison all
             start on ONE content column at whatever the token steps to per breakpoint. The
             vertical air is the band's, not the boundary's — one `xxl` to open the page —
             and the switch's own row closes it. `max-w-(--container-3xl)` folds the
             headline onto two lines so `text-balance` splits it evenly instead of leaving
             an orphan word, and the description takes a narrower cap so it reads as a
             second, shorter block rather than a full-width line under it. -->
        <div class="layout-boundary-inline pt-(--spacing-xxl)">
          <HeroTitle
            eyebrow="Pricing"
            title="Plans for every stage of your application"
            description="Every product and feature is available on every plan. Start free and scale as you grow."
            class="[&>h1]:max-w-(--container-3xl) [&>p]:max-w-(--container-xl)"
          />
        </div>

        <!-- The term switch closes the opening band — no rule between it and the headline,
             so the two read as one opening — and ITS bottom rule is the cards' top edge,
             so the grid below draws none. -->
        <div class="flex justify-center border-b border-(--border-default) p-(--spacing-lg)">
          <SegmentedButton
            v-model="period"
            :options="BILLING_PERIODS"
            aria-label="Billing period"
          />
        </div>

        <CardGrid
          variant="divider"
          :columns="3"
        >
          <CardPricing
            v-for="card in cards"
            :key="card.id"
            :class="card.highlighted ? 'bg-(--bg-surface)' : 'bg-(--bg-canvas)'"
            aligned
            slot-position="middle"
            kind="transparent"
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
                 the five lines under it ("everything available", "scale beyond the
                 included limits"), which is a different claim per tier. -->
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

    <!-- ── Trust ──────────────────────────────────────────────────────────
         The claim, then the marks that stand behind it. The SectionTitle in the `#header`
         slot is itself a frame and draws its own bottom rule and ticks, so the strip
         below it is `flush` with `marks="bottom"` and owns only its floor. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Trusted by industry leaders"
          title="The Infrastructure Behind High-Performance Applications"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <!-- The strip carries no inset of its own — it is a full-bleed marquee — so the
             band gives it the vertical air. Without it the first row of marks sat directly
             on the SectionTitle's bottom rule. -->
        <div class="py-(--spacing-xl)">
          <BrandCarousel
            :clients="CLIENTS"
            monochrome
          />
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── Platform primitives ────────────────────────────────────────────
         The same four-column link grid the homepage carries, in this page's pt-BR
         wording. The column heading shares the `lg` inset with its rows, so the label and
         every product name start on one content column; the grid's `gap-px` draws the
         seams, which is why no column carries a border of its own. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          title="Serverless AI-Native Primitives"
          description="Enterprise-grade reliability, security and performance, without requiring specialized operational expertise."
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
            v-for="group in PRIMITIVE_GROUPS"
            :key="group.label"
            :title="group.label"
          >
            <NavItem
              v-for="primitive in group.items"
              :key="primitive.title"
              :icon="primitive.icon"
              :title="primitive.title"
              :description="primitive.description"
              :href="primitive.href || '#'"
            />
          </NavColumn>
        </CardGrid>
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
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="grid gap-px bg-(--border-default) lg:grid-cols-3">
          <!-- The heading keeps the page's prose start line across (`xl` — the column the
               hero and the closing CTA also begin on) and takes the ROW's step down (`md`),
               so its first line lands on the first question's and the two cells open on one
               line. It is the one box in this band that does not run a single token on all
               four sides, because its top edge belongs to the stack beside it rather than to
               itself: padded `xl` down, the title floated below the two questions it heads. -->
          <div class="bg-(--bg-canvas) px-(--spacing-xl) py-(--spacing-md)">
            <h2 class="m-0 text-balance text-heading-lg text-(--text-default)">
              Frequently Asked Questions
            </h2>
          </div>
          <div class="bg-(--bg-canvas) lg:col-span-2">
            <!-- `large` because this is a reading surface, not a console panel: the
                 question is body-md and the answer body-sm.

                 ── THE ROW IS THE MATRIX'S ROW ──

                 This band is the page's second ruled stack, so it takes the first one's
                 box: `--spacing-lg` across, `--spacing-md` down — the same pair every
                 matrix row uses, landing a 54px row against the matrix's 53. What it held
                 before was not a box but two decisions: 48 across (`xl`) against 12 down
                 (`sm`), so the question floated in a field of side space while sitting
                 tight against the rule above it, and halving the inset is what closes
                 that gap.

                 `--accordion-inset` is the component's own hook for that horizontal step,
                 set once on the group so the ANSWER can take the same property below and
                 start on the question's column — one content column, at whatever the
                 token itself steps to per breakpoint. The answer had NO padding at all,
                 so it began 48px left of its own question, ran the cell's full width, and
                 touched the rules above and below it. `--container-2xl` caps its measure
                 at ~73 characters: uncapped it reads 99, which is a rule, not prose.

                 ── ONE RULE PER ITEM, AT THE ITEM'S OWN EDGE ──

                 The component's default moves that rule UNDER THE TRIGGER while an item
                 is open and drops the item's own, which leaves the answer in the same
                 band as the NEXT question and closed by nothing. Held at the item's edge
                 instead, an open item is one cell — question plus its answer — and the
                 stack keeps exactly one rule per row whatever is open. A hairline between a
                 question and its own answer is the graph paper the matrix refuses for the
                 same reason.

                 The last row is the exception in BOTH states: it sits directly on the
                 band's floor, which the FrameBox already draws, so a rule of its own
                 would be a second hairline 1px above it.

                 ── THE ANSWER IS BOUND TO ITS QUESTION ──

                 The answer's own box carries its vertical air — `pt-(--spacing-xs)` to bind
                 it to the question it answers, `pb-(--spacing-md)` for the cell's floor:
                 the matrix's title / description step, so the pair reads as one block
                 rather than two evenly spaced lines. For that `pt` to BE the gap the
                 trigger gives up its bottom padding while the row is open, and its `min-h`
                 with it — left at `min-h-10` the button springs back to 40px and pushes the
                 question 1px down on open. Its `pt` is untouched, so the question itself
                 never moves.

                 The air cannot sit on `Accordion.Content` either way: that is the
                 height-animated box, so padding there cannot compress past itself and jumps
                 at both ends of the transition, and it clips to `overflow-hidden`, so a
                 negative pull on its child is sliced off across the answer's first line. -->
            <Accordion
              type="single"
              collapsible
              size="large"
              class="[--accordion-inset:var(--spacing-lg)]"
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

    <SectionGap hatch />

    <!-- The closing band, shared with the homepage. It takes no props here: its own
         defaults are this copy, so the two pages close identically. -->
    <SiteCta />
  </SectionContainer>
</template>
