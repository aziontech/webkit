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
  // The hero is a BannerContainer — a full-bleed band, so its floor is one rule running
  // the whole width of the window, and the framed column starts under it. Same opening as
  // Functions and Home; the three pages of the site draw their first horizontal one way.
  // The headline still sits on the same content column as the plan names under it and
  // every row label in the matrix below: the band reads `--layout-boundary-inline` and
  // caps at `--layout-measure-site`, which is exactly what the column below it does.
  import Accordion from '@aziontech/webkit/accordion'
  import Button from '@aziontech/webkit/button'
  import CardPricing from '@aziontech/webkit/card-pricing'
  import FrameBox from '@aziontech/webkit/frame-box'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionTitle from '@aziontech/webkit/section-title'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import BrandCarousel from '@shared/ui/brand/BrandCarousel.vue'
  import {
    BannerContainer,
    CardGrid,
    SectionContainer,
    SectionModule
  } from '@shared/ui/layout/index.js'
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
  <!-- ══ The hero — a full-bleed band, closing on the page's first rule ═══════
       THE HERO'S FLOOR RUNS TO THE WINDOW'S EDGE, the way Functions' and Home's do. It is
       a BannerContainer, so the band is the full width of the viewport and its `border-b`
       is the page's first horizontal — one uninterrupted line, edge to edge, with the
       framed column starting UNDER it. The rule used to stop at the frame: the hero was
       the opening band of the plans brick INSIDE the column, so its floor ran the column's
       own width and the site's three pages opened three different ways.

       The old objection to a band here was alignment — a hero in a column of its own put
       the H1 at the band's `xl` against the column's `lg` boundary, a step to the right of
       every plan name under it. That is gone: BannerContainer reads
       `--layout-boundary-inline`, the same token the plan names and every matrix row label
       open at, and its column is `--layout-measure-site`, the same measure SectionContainer
       takes below. (The nav's logo joins them only below the caps: the bar has its own,
       wider column — see SiteNav.) So the H1 lands on the page's ONE content column by
       construction rather than by two numbers kept equal by hand.

       `:padded="false"` because the band's own `xl` rhythm is not this hero's: the copy
       opens on the column's `xxl` with a 96px FLOOR (`--spacing-24`), because
       `--spacing-xxl` only reaches 6rem at `xl` — below that it steps down to 4rem and
       2rem, which put the H1 64px and 32px under the nav's rule on a laptop and a phone.
       `max()` keeps the semantic token in charge wherever it is the larger of the two, so
       the page opens on at least 96px at EVERY width. `pb-(--spacing-xl)` sets the floor
       48px under the description against the switch row's 24 below it, so the rule reads as
       the hero's own floor rather than as the control strip's ceiling.

       `max-w-(--container-3xl)` folds the headline onto two lines so `text-balance` splits
       it evenly instead of leaving an orphan word, and the description takes a narrower cap
       so it reads as a second, shorter block rather than a full-width line under it. -->
  <BannerContainer
    banner="dot-grid"
    max-width="site"
    :padded="false"
  >
    <div class="pt-[max(var(--spacing-xxl),var(--spacing-24))] pb-(--spacing-xl)">
      <HeroTitle
        eyebrow="Pricing"
        title="Plans for every stage of your application"
        description="Every product and feature is available on every plan. Start free and scale as you grow."
        class="[&>h1]:max-w-(--container-3xl) [&>p]:max-w-(--container-xl)"
      />
    </div>
  </BannerContainer>

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
         The control and the thing it controls belong to the same brick: the switch is the
         cards' own header strip, not a band of its own above them, so both live under one
         frame and the reader never loses which row the term applies to.

         First brick in the column, so `:divided="false"` — its top edge is the hero band's
         own full-bleed rule. The block is a registration frame: `borders="y"` hands the
         vertical rules back to the column, `flush` drops the top rule it would otherwise
         draw against that same hero rule, and `marks="bottom"` ticks the one junction
         nothing else draws. -->
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
        <!-- The term switch is a STRIP between two rules — the hero's floor above it, its
             own `border-b` below, which is also the edge the card grid's verticals terminate
             on. That stack of horizontals (hero floor → switch strip → the grid's own top
             rule) is what CONNECTS the headline to the tiers: the three cards read as the
             continuation of the sentence above them rather than as a separate object that
             happens to sit lower on the page. The row runs one even `--spacing-lg`: it used
             to carry a phone-only 48px below, because the first card arrived 16px under the
             control with nothing between them, and the strip's own rules are the break that
             extra padding was standing in for. -->
        <div class="flex justify-center border-b border-(--border-default) p-(--spacing-lg)">
          <SegmentedButton
            v-model="period"
            :options="BILLING_PERIODS"
            aria-label="Billing period"
          />
        </div>

        <!-- ── THE ROW OF CARDS IS ITS OWN FRAMED BOX ────────────────────────
             The inset belongs to the OUTER CONTAINER, and it is the page boundary itself:
             the wrapper takes `layout-boundary-inline` on the inline axis and nothing on
             the block one, so the box steps one boundary in from the band's sides and
             NOTHING in from its two rules. Its
             left edge therefore lands on the same vertical as the H1 above it and the nav's
             logo above that — the boundary the whole page opens on. It is a
             container's padding rather than a margin on the grid for the reason the
             token's own utility gives (`layouts.data.js`): the boundary is padding, never
             margin, and it belongs to the container, not to the thing inside it.

             AND THE INSET LIVES ONLY IN THE TWO-UP BAND — `sm:max-lg:`. It is a step, and a
             step only reads as one when there is room for it: at `sm`…`lg` the boundary is
             24px, the frame's rule lands under the H1's first letter, and the pair of tiers
             reads as a column indented from the page's own. Outside that band the same
             construction fails from both ends. From `lg` up the row takes the band's FULL
             WIDTH, so the three tiers are FLUID inside the parent frame — every column as
             wide as the page can make it, and the outer seams landing on the
             SectionContainer's own `border-x` rather than a second pair of rules inside it.

             AND BELOW `sm` IT IS FULL WIDTH FOR THE OPPOSITE REASON: the boundary is 16px
             there, so the step is not an indent, it is TWO HAIRLINES 16px APART — the
             column's own `border-x` at the window edge and the frame's rule beside it, with
             a strip of dead canvas between them running the whole height of the stacked
             tiers. Measured at 390px: the column's rule at x=0–1 and the frame's at 17–18.
             That reads as a doubled, misregistered edge rather than as an inset column, and
             it buys nothing — the card's own `p-(--spacing-lg)` puts its text at 41px
             regardless, nowhere near the H1's 16. So a phone gets what the desktop gets: ONE
             rule at the page edge, the column's, exactly like the nav above it.

             The frame's verticals follow the inset at both ends (`max-sm:border-none
             lg:border-none`): at full bleed they would sit 1px inside that `border-x` and
             thicken it into a 2px edge — the doubled hairline `flush` exists to prevent.

             And it is the boundary FLAT — not the boundary minus the card's own
             `p-(--spacing-lg)`. Compensating for that padding would register the card's
             TEXT with the column and leave its box hanging 24px outside the inset, which
             is the wrong edge to align: these are filled cells (the recommended one paints
             `--bg-surface`), so what the reader sees as a card's start is its box.

             Pulled off the band's rules, the row needs rules of its own — otherwise three
             cells float in the middle of a frame with nothing registering them. So the
             grid goes in a FrameBox, drawn at the same `--border-default` as the band
             around it. The seams inside stay the grid's `gap-px`, which is why
             `kind="transparent"` cards each fill their own background.

             The box SPANS THE BAND'S TWO RULES: no vertical padding on the wrapper and
             `flush="y"` on the frame, so the switch row's `border-b` is the box's top edge,
             the band's own floor is its bottom edge, and what the frame actually draws is
             the PAIR OF VERTICALS between them — running the full height of the cards and
             MEETING a rule at each end. That continuity is the whole point: a box floating
             with air above and below reads as a fourth, unrelated object inside the band,
             where two rules stepped in by one boundary and terminated by the band's own
             horizontals read as the band's own column. `flush` is also what keeps each
             junction ONE hairline instead of two lines a pixel apart, and `marks="none"`
             follows from it — a corner tick registers a junction nothing else draws, and
             here both horizontals belong to the band. -->
        <div class="sm:max-lg:layout-boundary-inline">
          <FrameBox
            flush="y"
            marks="none"
            class="max-sm:border-none lg:border-none"
          >
            <CardGrid
              variant="divider"
              :columns="3"
            >
              <!-- THREE TIERS IN A TWO-UP GRID LEAVE ONE CELL EMPTY, and an empty cell of a
                   `divider` grid is not empty: it shows the wrapper's `--border-default`,
                   which paints a grey quarter-screen block beside the last tier. So the
                   last card takes that cell whenever the count is odd — one wide tier
                   closing the pair above it — and drops back to one column at `lg`, where
                   three columns divide the row exactly. -->
              <CardPricing
                v-for="(card, index) in cards"
                :key="card.id"
                :class="[
                  card.highlighted ? 'bg-(--bg-surface)' : 'bg-(--bg-canvas)',
                  index === cards.length - 1 && cards.length % 2 === 1
                    ? 'sm:col-span-2 lg:col-span-1'
                    : ''
                ]"
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
        </div>
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
        <CardGrid
          variant="divider"
          :columns="4"
          :mobile-columns="1"
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
        <div
          class="grid gap-px bg-(--border-default) [--accordion-inset:var(--spacing-lg)] lg:grid-cols-3 lg:[--accordion-inset:var(--spacing-xl)]"
        >
          <!-- The heading takes the BAND'S OWN INSET across — `--accordion-inset`,
               declared once on the grid above and read by both cells — and the ROW's step
               down (`md`), so its first line lands on the first question's and the two
               cells open on one line.

               ── THE INSET IS ONE PROPERTY, AND IT STEPS AT `lg` ──

               BELOW `lg` THE TWO CELLS STACK IN ONE COLUMN: the title sits directly over
               the questions, so the two have to open on the same vertical. They read the
               same property, so that alignment is a fact rather than two numbers kept
               equal by hand — and the value there is the page column itself (`lg`: 24
               from `sm`, 16 on a phone), which is what puts the title, every question and
               every answer on the vertical the H1 and the matrix rows already run
               (measured at 900px: all three at 25). A hard `xl` here put the title 8px
               right of every question under it, which is where that alignment argument
               came from.

               FROM `lg` UP THERE IS NOTHING STACKED OVER ANYTHING — two cells side by
               side, each opening on its own edge — so the alignment the tight inset was
               buying no longer exists to buy, and the band takes the marketing step
               instead: `xl`, 32 on a laptop and 48 from `xl`, the same inset every
               SectionTitle on this page opens at. Heading, questions and answers all
               widen together, because what moves is the one property they share.

               It is still the one box in this band that does not run a single token on all
               four sides, because its top edge belongs to the stack beside it rather than
               to itself. -->
          <div class="bg-(--bg-canvas) px-(--accordion-inset) py-(--spacing-md)">
            <h2 class="m-0 mt-(--spacing-md) text-balance text-heading-lg text-(--text-default)">
              Frequently Asked Questions
            </h2>
          </div>
          <div class="bg-(--bg-canvas) lg:col-span-2">
            <!-- `large` because this is a reading surface, not a console panel: the
                 question is body-md and the answer body-sm.

                 ── THE ROW IS THE MATRIX'S ROW ──

                 This band is the page's second ruled stack, so while it is STACKED it
                 takes the first one's box: `--spacing-lg` across, `--spacing-md` down —
                 the same pair every matrix row uses, landing a 54px row against the
                 matrix's 53. From `lg` the across step widens with the band (see
                 `--accordion-inset` above) and the down step does NOT: twelve questions
                 gain nothing from a taller row, and the row's height is what keeps the
                 stack scannable. What it held before was not a box but two decisions: 48
                 across against 12 down (`sm`), so the question floated in a field of side
                 space while sitting tight against the rule above it — a wide inset is
                 only wrong when it is not also the band's.

                 `--accordion-inset` is the component's own hook for that horizontal step,
                 set once on the BAND'S GRID (custom properties inherit) so the heading
                 cell beside it, the trigger and the ANSWER below all take the same
                 property and start on the question's column — one content column, at whatever the
                 token itself steps to per breakpoint. The answer had NO padding at all,
                 so it began 48px left of its own question, ran the cell's full width, and
                 touched the rules above and below it. `--container-2xl` caps its measure
                 at ~73 characters stacked and ~68 on desktop — the cap is on the box, so
                 the wider inset comes out of the text — against 99 uncapped, which is a
                 rule, not prose.

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
