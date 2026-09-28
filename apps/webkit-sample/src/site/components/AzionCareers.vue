<script setup>
  // Careers — a translation of https://www.azion.com/en/careers/jobs/ into this site's own page
  // language, produced with the /site-design-translate flow (the live page read mechanically
  // into a band inventory, then rebuilt band by band). The source is the specification for WHAT
  // the page says; CONTAINERS.md is the specification for HOW it is drawn. Every line of copy
  // here is the source's, verbatim; none of its grid, spacing, borders, colours or radii came
  // across.
  //
  // Read on 2026-09-24 against the UNFILTERED listing — 23 roles across five areas. The earlier
  // pass of this translation read `?area=Engineering`, so it saw six roles and one area label.
  //
  // ── THE SOURCE IS ONE BAND, AND ITS ANATOMY IS THE WHOLE BRIEF ──
  //
  // The extractor finds a single band 4643px tall. Read at the DOM, it is:
  //
  //   a breadcrumb            Careers > Jobs
  //   an h1                   We're hiring!
  //   a two-column grid       `md:grid-cols-[240px,_1fr]`
  //     · the 240px rail      the area + location filter — STICKY, and rendered EMPTY
  //     · the list column     five area labels, each over its own group of job cards
  //
  // What each becomes here:
  //
  //   breadcrumb              its first segment becomes the hero's eyebrow (below)
  //   the h1                  Hero kind="band" + Hero.Title
  //   the rail                the source's own sticky column, hydrated (below)
  //   the area labels         group rows inside the list column, the source's own order
  //   the 23 cards            ruled cells in one frame, each the anchor to its posting
  //
  // ── THE FILTERS ARE THE SOURCE'S OWN, AND THAT IS WHY THEY ARE HERE ──
  //
  // The live page's `job-table` island never hydrates: the rail it reserves renders nothing, so
  // what ships is a 240px hole beside the list. The earlier pass therefore left the control out,
  // on the rule that a page may not invent a control its source does not render, and gave the
  // rail the one string next to it (`Engineering`) so no drawn column was empty.
  //
  // The control is in the source. The island's `props` attribute carries the entire contract
  // server-side — both option lists, both field labels, the row action's label, and the
  // no-results state with its own action — and a payload the page ships is as much its stated
  // content as its DOM is. So every string in the rail below, and every string in the empty
  // state, is a source string; they are catalogued in `data/careers.js` beside the postings.
  // What this page adds is that the contract WORKS. Two of the source's own location options
  // (`Mexico City, Mexico`, `Remote`) match no posting in this snapshot, which is what makes its
  // `Nothing here yet` state reachable rather than decorative.
  //
  // ── WHERE OUR FORM DEPARTS FROM THE SOURCE, on purpose ──
  //
  //   • THE HEADLINE BECOMES A HERO — A BAND, NOT A SCREEN. The source sets `We're hiring!` at
  //     the top of a scrolling column, 40px tall, with the list starting immediately under it.
  //     Ours is `Hero kind="band"`: the headline and the floor under it measure well short of a
  //     viewport, so the first area of the listing is already on screen when the page lands.
  //     A screen-height hero would put every posting below the fold, which on a page whose
  //     content IS the postings is the one thing the form must not do. The source's single band
  //     therefore renders as a hero plus a framed column; that is a change of FORM, not of
  //     content or of running order, and the band counts are not comparable for that reason.
  //
  //   • THE HERO IS THE PLAIN PATTERN, NOT A BOX INSIDE A BAND. It is `Hero` + `Hero.Title`,
  //     the shape every other page on this site opens with — no `:padded="false"`, no FrameBox
  //     spanning the band, no negative inline margin taking the container's inset back. The
  //     earlier pass framed the hero so the column's two verticals would start at the top of the
  //     page; the cost was a hero that drew its own edges while every sibling's is a full-bleed
  //     band whose only rule is the `border-b` the column below hangs from. One pattern beats a
  //     local improvement on it.
  //
  //   • `Careers` IS THE EYEBROW. The source draws `Careers > Jobs` above the headline. A trail
  //     earns its place when a page is a leaf of something the reader can climb back to, and
  //     this one is not: it is a routed example reached from this app's own nav, and its last
  //     segment is the page you are on. So the trail goes — but its first segment is a real
  //     string the source renders over this headline, and `Hero.Title`'s eyebrow is where this
  //     language puts exactly that. Content kept, chrome dropped.
  //
  //   • THE COPY IS CENTRED on the bare band. That is this site's default opening, and with no
  //     texture under it the headline is the only thing in the band — which is the point: the
  //     page's content starts at the rule below it.
  //
  //   • THE RAIL IS THE SOURCE'S OWN STICKY COLUMN. It was briefly a strip across the top of
  //     the band — the shape this site gives a control that governs the band under it (the
  //     pricing page's billing switch) — which is right for one switch and wrong for a facet
  //     beside 23 rows: a reader four screens down the list has to climb back to the top to
  //     narrow it. The source states the answer in its own markup, `md:grid-cols-[240px,_1fr]`
  //     with the rail sticky, so the column is back and it sticks under the bar. Its width is
  //     `--container-3xs` (256px), the nearest rung of our own ladder to the source's 240.
  //     The vertical between the two columns runs the band's whole height — the rail's own
  //     `border-r` under the heading row, the spacer frame's above it, one continuous rule
  //     because they stack; below `lg` the grid is one column and it becomes the rail's
  //     `border-b`. The two field labels are set in the overline face in `--text-muted`, not
  //     in the accent `Overline` paints: the rail names facets, and a label in the brand
  //     colour reads as the selected one before a chip has been touched.
  //
  //   • THE FILTERS ARE CHIPS, NOT SELECTS. Same two fields, same option lists, same labels —
  //     a different control. A select hides five of its six options behind an overlay, which
  //     costs a click to learn what the page can even be narrowed to, and puts a teleported
  //     panel inside a sticky column. Chips print every option at once, so the rail states the
  //     facets AND the current selection in one read, and the source's own `All areas` /
  //     `All locations` options are the reset — no control here that the contract does not
  //     name. Selection is `aria-pressed` plus the language's own selected pair, the brand
  //     edge over the selected fill.
  //
  //   • THE LIST NAMES ITS OWN SELECTION, ON THE LIST'S OWN VERTICAL. The source prints five
  //     area labels and no heading over them, so a narrowed list arrives with nothing saying
  //     what it was narrowed to. One `h2` at the top of the LIST COLUMN carries that:
  //     `Open positions` unfiltered — the source's own phrase, out of its `View all open
  //     positions` — and `<Area> positions` when an area is chosen. It is unframed because the
  //     grid cell it sits in owns the rule under it. The area rows stay under it while the filter is `All areas`,
  //     because grouping 23 roles is what makes them scannable; choosing an area drops them,
  //     since the heading already prints the one name they would repeat.
  //
  //   • THE POSTINGS ARE A LIST, AND THE WHOLE ROW IS THE TARGET. They were a two-column
  //     grid of cards; a card grid says "browse these", a ruled list says "scan these", and
  //     23 roles beside a facet rail are the second thing. The rows are `Item` under
  //     `Item.List` — the system's own divided list — so the hairlines between them, the
  //     row's density and its hover are the DS's, not this page's.
  //
  //   • `Read more` BECOMES `Learn more`, and it stays. The source's control is a small
  //     uppercase label with an orange arrow under each posting's meta line; ours is the
  //     system's outlined Button at the row's trailing edge. The label is sentence case
  //     because that is the microcopy standard, and the row is clickable in its own right —
  //     the button is the affordance, not the only way in.
  //
  //   • THE POSTINGS OPEN HERE, NOT ON azion.com. Each row routes to this app's own posting
  //     page (`/site/careers/<id>`, the source's own ATS id), which is the page the source
  //     links out to, rebuilt in this language. The source's URL stays in the data as the
  //     posting's identity.
  //
  //   • NO CLOSING CTA. Every other page on this site ends with `CallToAction`. This one does
  //     not: the source states no closing band, and a CTA is a band, a headline, a description
  //     and two labels — four inventions to make the page end the way its siblings do. It ends
  //     on the hatched spacer instead, which is rhythm rather than content.
  //
  // ── THE GROUND ──
  //
  // The band carries NO texture — no pixel field on its floor, no dot backdrop behind the
  // headline. The source's own hero is empty (1200px of column with a 40px headline in it), so
  // there is no art here we are replacing, and a texture under a page whose content is a list of
  // 23 roles is decoration competing with the one thing the reader came for. The headline sits
  // on the bare canvas and the band's `border-b` is the page's one hard event above the list.
  // No brand strip either — this page is not selling to the reader, it is listing roles, and the
  // marks are a proof device the postings do not need.
  import Button from '@aziontech/webkit/button'
  import Chip from '@aziontech/webkit/chip'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import Item from '@aziontech/webkit/item'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { computed, reactive, useId } from 'vue'
  import { useRoute } from 'vue-router'

  import {
    CAREERS_ALL,
    CAREERS_AREAS,
    CAREERS_EMPTY,
    CAREERS_JOBS,
    CAREERS_LABELS,
    CAREERS_LOCATIONS,
    jobId,
    jobLocations
  } from '../data/careers.js'

  /** Where both filters rest, and what `View all open positions` puts them back to. */
  const route = useRoute()
  const requestedArea = CAREERS_AREAS.find((option) => option.value === route.query.area)
  const selection = reactive({
    area: requestedArea?.value ?? CAREERS_ALL,
    location: CAREERS_ALL
  })

  /**
   * THE TWO FILTERS, AS DATA. Same reason every repeating band on this page is a `const` and one
   * `v-for`: the rail is two of the same thing, and writing the second one out by hand is where
   * a label, an option or a selected state silently stops matching its neighbour.
   */
  const FILTERS = [
    { key: 'area', label: CAREERS_LABELS.areas, options: CAREERS_AREAS },
    { key: 'location', label: CAREERS_LABELS.location, options: CAREERS_LOCATIONS }
  ]

  const railId = useId()

  const matches = computed(() =>
    CAREERS_JOBS.filter(
      (job) =>
        (selection.area === CAREERS_ALL || job.area === selection.area) &&
        (selection.location === CAREERS_ALL || jobLocations(job).includes(selection.location))
    )
  )

  /**
   * The matching postings under their area headings, in the FILTER's order rather than the
   * list's, so narrowing to one area and widening back to all never reshuffles the page. An
   * area with nothing in it drops out; when every area drops out the empty state takes over.
   */
  const groups = computed(() =>
    CAREERS_AREAS.filter((option) => option.value !== CAREERS_ALL)
      .map((option) => ({
        area: option.value,
        jobs: matches.value.filter((job) => job.area === option.value)
      }))
      .filter((group) => group.jobs.length > 0)
  )

  /** What the list is showing, said once at its top. `Open positions` is the source's phrase. */
  const heading = computed(() =>
    selection.area === CAREERS_ALL ? 'Open positions' : `${selection.area} positions`
  )

  /** An area label under a heading that already prints that area is the same word twice. */
  const grouped = computed(() => selection.area === CAREERS_ALL)

  function showAllPositions() {
    selection.area = CAREERS_ALL
    selection.location = CAREERS_ALL
  }
</script>

<template>
  <!-- ══ The hero ═══════════════════════════════════════════════════════════════
       Hero owns the full-bleed band and the page's top rule. A `band` rather than a `screen`:
       the headline plus the pixel floor come in under a viewport, so the listing's first area
       is on screen with it. Centred copy over the floor, the way every page here opens. -->
  <Hero
    kind="band"
    max-width="site"
    class="[--banner-offset:3.5rem]"
  >
    <!-- The page's one h1, verbatim, with the trail's first segment over it. No description
         and no actions, because the source states none. -->
    <Hero.Title
      centered
      eyebrow="Careers"
      title="We're hiring!"
    />
  </Hero>

  <!-- ══ The framed column ══════════════════════════════════════════════════════
       One band, two columns: the rail and the list. First module in the column, so
       `:divided="false"` — its top edge is the hero's `border-b` — and `:padded="false"`,
       because every row inside owns its own inset. -->
  <SectionContainer max-width="site">
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <!-- TWO COLUMNS, TWO ROWS, AND ONE VERTICAL FOR EVERYTHING THE LIST SAYS. The heading
             belongs to the list, so it sits in the list's COLUMN rather than across the band:
             `Open positions`, the area labels and every posting's title all open on one line,
             `--careers-inset` — the Item's own 1px frame plus the `--spacing-xl` this page gives it, which is
             where the DS puts a row's first glyph and therefore the only honest vertical for
             the two things set beside it. `--careers-lead` is that same frame on the block
             axis, so the rail opens on the row's first line as well as on its first column.
             THE RAIL IS PUSHED DOWN BY FRAMES, NOT BY PADDING. Its first facet has to land on
             the first POSTING, not on the heading and not on the area label over it — so the
             two things above that posting in the other column are answered here by two
             FrameBoxes used as spacers: one takes the heading's height (the grid stretches it,
             so it is exact and never a number to maintain), the other takes the label row's,
             `--careers-label-row`, built from the same tokens the row itself is built from.
             Below `lg` the grid is one column, both spacers go, and the order reads
             heading → filters → list. -->
        <div
          class="grid [--careers-inset:calc(var(--spacing-xl)+1px)] [--careers-lead:calc(var(--spacing-xl)+1px)] [--careers-label-row:calc(var(--spacing-md)*2+var(--text-overline-md-font-size)*var(--text-overline-md-line-height)+1px)] lg:grid-cols-[var(--container-3xs)_1fr]"
        >
          <FrameBox
            borders="right"
            marks="none"
            class="hidden lg:block"
          />

          <SectionTitle
            kind="left"
            :framed="false"
            :title="heading"
            class="border-b border-(--border-default) px-(--careers-inset) py-(--spacing-xxl)"
          />

          <!-- ── The rail ───────────────────────────────────────────────────────
               The cell stretches to the row's full height, which is what lets its
               `border-r` draw the whole vertical; the sticky box inside is what actually
               follows the reader. `top-14` is the bar's own height, so the first label
               lands one inset under it, and the spacer above stays in flow so the column
               only starts on the first posting while it is unstuck. -->
          <aside class="border-b border-(--border-default) lg:border-r lg:border-b-0">
            <FrameBox
              v-if="grouped && groups.length > 0"
              borders="none"
              marks="none"
              class="hidden h-(--careers-label-row) lg:block"
            />

            <div
              class="flex flex-col gap-(--spacing-xl) p-(--spacing-lg) lg:sticky lg:top-14 lg:px-(--spacing-xl) lg:pt-(--careers-lead) lg:pb-(--spacing-xl)"
            >
              <div
                v-for="filter in FILTERS"
                :key="filter.key"
                role="group"
                :aria-labelledby="`${railId}-${filter.key}`"
                class="flex min-w-0 flex-col gap-(--spacing-sm)"
              >
                <p
                  :id="`${railId}-${filter.key}`"
                  class="m-0 text-overline-md uppercase text-(--text-muted)"
                >
                  {{ filter.label }}
                </p>

                <!-- A chip per option, wrapped. `kind` is the whole selected state:
                     the component's own vocabulary is `filled` for a value that IS
                     applied and `outlined` for one the user COULD apply, which is this
                     rail exactly. `aria-pressed` carries the same fact to a screen
                     reader. No class of ours on a chip. -->
                <div class="flex flex-wrap gap-(--spacing-xs)">
                  <Chip
                    v-for="option in filter.options"
                    :key="option.value"
                    clickable
                    :label="option.label"
                    :kind="selection[filter.key] === option.value ? 'filled' : 'outlined'"
                    :aria-pressed="selection[filter.key] === option.value"
                    @click="selection[filter.key] = option.value"
                  />
                </div>
              </div>
            </div>
          </aside>

          <!-- ── The list ───────────────────────────────────────────────────────
               `min-w-0` so the cards can shrink inside the track instead of pushing it
               wider than its share. -->
          <div class="min-w-0">
            <!-- What the source says when the pair matches nothing. Its own way out: the
                 action resets both fields rather than routing, because on this page
                 `all open positions` IS the unfiltered list. EmptyState owns its own
                 padding on the `size` ramp, so nothing here adds any. -->
            <EmptyState
              v-if="groups.length === 0"
              :title="CAREERS_EMPTY.title"
              :description="CAREERS_EMPTY.description"
            >
              <template #actions>
                <Button
                  :label="CAREERS_EMPTY.action"
                  kind="secondary"
                  size="large"
                  @click="showAllPositions"
                />
              </template>
            </EmptyState>

            <!-- One section per area, in the filter's order. The first hangs off the
                 heading's rule, so only the ones after it draw a top one; the label row
                 owns the rule between itself and its cards. The label is the source's
                 own string, uppercased the way the source uppercases it.

                 Every posting is a `FeatureCard` on the source's own URL: the whole card
                 is the target, so the row needs no trailing control and the reader has
                 one target per posting. The seams are `CardGrid`'s `gap-px`, which is why
                 no card draws a border — the cards fill the canvas and the grid's fill IS
                 the rule. -->
            <template v-else>
              <section
                v-for="(group, index) in groups"
                :key="group.area"
                :class="index > 0 ? 'border-t border-(--border-default)' : ''"
              >
                <div
                  v-if="grouped"
                  class="border-b border-(--border-default) px-(--careers-inset) py-(--spacing-md)"
                >
                  <h3 class="m-0 text-overline-md uppercase text-(--text-muted)">
                    {{ group.area }}
                  </h3>
                </div>

                <Item.List>
                  <!-- THE WHOLE ROW IS THE TARGET, and the row's own link is its TITLE. The
                       title anchor carries the stretched overlay (`after:inset-0` against the
                       row's `relative`), so a pointer anywhere on the row opens the posting
                       while the thing a screen reader announces is the role's name rather than
                       a twenty-third `Learn more`. The trailing Button is a real control on the
                       same route, sitting above that overlay because it paints later — it is
                       the affordance the row's shape promises, not a second kind of target. -->
                  <Item
                    v-for="job in group.jobs"
                    :key="job.href"
                    class="relative px-(--spacing-xl)! py-(--spacing-xl)! hover:bg-(--bg-hover)"
                  >
                    <Item.Content>
                      <Item.Title>
                        <RouterLink
                          :to="`/site/careers/${jobId(job)}`"
                          class="after:absolute after:inset-0 after:content-['']"
                        >
                          {{ job.title }}
                        </RouterLink>
                      </Item.Title>
                      <Item.Description>{{ job.meta }}</Item.Description>
                    </Item.Content>
                    <Item.Actions>
                      <Button
                        label="Learn more"
                        kind="outlined"
                        size="large"
                        @click="$router.push(`/site/careers/${jobId(job)}`)"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </section>
            </template>
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- The rhythm the page closes on, hatched. A bare FrameBox at SectionGap's own `medium`
         height drawing NO rules: the footer below opens with a full-bleed rule, and SectionGap's
         fixed `borders="y"` would land a second hairline on that pixel. -->
    <FrameBox
      borders="none"
      marks="none"
      hatch
      class="h-[calc(var(--spacing-xxl)*2)]"
    />
  </SectionContainer>
</template>
