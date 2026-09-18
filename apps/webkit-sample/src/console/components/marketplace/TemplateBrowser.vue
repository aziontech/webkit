<script setup>
  // TemplateBrowser — the reusable "browse templates" module: a section title beside its
  // Filter button, the applied cuts as chips on the row under it, then the catalog in
  // BANDS, and an EmptyState when a cut leaves nothing. Used by the Creation Center's
  // template pane; owns its own filter state, so each instance filters on its own.
  //
  // ── TWO SHAPES, BECAUSE THERE ARE TWO KINDS OF TEMPLATE ──
  //
  // A band declares `kind`, and it decides how the reader picks from it:
  //
  //   `cards`  the framework starter as a COLUMN (./TemplateCard.vue): the framed brand
  //            mark, then the title, then the sentence. Its mark is grayscale until
  //            hover, because a framework IS chosen by its mark — "I use Nuxt" is the
  //            whole decision, and a column packs three marks across where a row packs
  //            two.
  //   `list`   the Marketplace's own catalog ROW (./IntegrationCard.vue): the same framed
  //            mark, laid sideways, plus who publishes it. For the templates Azion and
  //            its partners PUBLISH, which are chosen by WHAT THEY DO — three of them
  //            wear the same Next.js logo, so the publisher is the fact their mark
  //            cannot carry.
  //
  // ONE MARK TREATMENT, TWO ARRANGEMENTS: both frame the mark in the same 40px tile, so
  // the bands read as one catalog even where they stack differently.
  //
  // The bands share ONE filter. A band left empty by a cut is dropped whole — an
  // empty heading is a heading for nothing — and when every band empties, the
  // EmptyState replaces the lot with the one control that undoes it.
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import { computed, ref } from 'vue'

  import { applyFilters } from '../../lib/behavior/filter-bar'
  import { useScrollFade } from '../../lib/behavior/scroll-fade'
  import FilterButton from '../list/FilterButton.vue'
  import FilterChips from '../list/FilterChips.vue'
  import IntegrationCard from './IntegrationCard.vue'
  import TemplateCard from './TemplateCard.vue'

  const props = defineProps({
    title: { type: String, required: true },
    // The bands, in reading order: `{ id, label, kind: 'cards' | 'list', items }`.
    // Data describing WHICH catalog goes where, not a config array standing in for UI:
    // each band renders through a real card component below, and a band that needed
    // markup of its own would be a band in the page rather than a row in here.
    sections: { type: Array, default: () => [] },
    useCaseOptions: { type: Array, default: () => [] },
    technologyOptions: { type: Array, default: () => [] },
    kindOptions: { type: Array, default: () => [] },
    // Grid density for a `cards` band — overridable so a narrow column can drop to
    // fewer columns. A card stacks its mark ABOVE its text, so the text gets the whole
    // card width and three across is legible where a row would not be.
    gridClass: {
      type: String,
      default: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    },
    // Grid density for a `list` band, which is NOT the cards' — a row is horizontal
    // (mark, then a text column beside it), so a third column takes its width from the
    // half that has to be read: measured at 1440 in the Creation Center's column, three
    // up leaves a row 212px wide and ~130px of text, where "Dynamic and Static File
    // Optimization" wraps to three lines and the sentence under it runs two words a
    // line. Two up is 326px, which holds the title on one line.
    listGridClass: {
      type: String,
      default: 'grid-cols-1 sm:grid-cols-2'
    },
    // Keep the module inside its parent's height and scroll the catalog instead of
    // the page: the title row and its controls stay pinned, only the bands move.
    // Applied from `lg` up, the breakpoint where the page becomes height-bounded;
    // below that the columns stack and the page scrolls as usual.
    scrollable: { type: Boolean, default: false }
  })

  const emit = defineEmits(['select'])

  // ── THE FILTER ───────────────────────────────────────────────────────────────
  //
  // THE SAME CONTROL EVERY LIST IN THE CONSOLE NARROWS WITH — the Filter button and
  // its chips (../list/FilterButton.vue, ../list/FilterChips.vue), over the field
  // catalog in ../../lib/behavior/filter-bar.js.
  //
  // What it replaces was this module's own invention: one Dropdown whose first row was
  // a SegmentedButton switching the option list underneath between Use Cases and
  // Technology. Two problems, both structural. The panel showed ONE axis at a time, so
  // a reader who came to narrow by use case had to discover that the axis they wanted
  // was behind a segment of a dropdown they had already opened; and what was applied
  // was legible only as a number in the trigger's label — "Filter (2)" names neither
  // cut and offers no way to undo one of them. A card grid narrows by exactly the
  // membership rule a table does ("is this template's use case one of these"), which is
  // what the shared control is, so it takes it: the panel lists the axes, the chips say
  // which cuts are applied, and each chip carries the × that drops its own.
  //
  // A field is declared only when its options were passed, so a surface that offers one
  // axis gets a one-row panel rather than a dead row.
  const fields = computed(() =>
    [
      props.kindOptions.length && {
        id: 'kind',
        label: 'Type',
        kind: 'options',
        options: props.kindOptions,
        match: (template, values) => values.includes(template.kind)
      },
      props.useCaseOptions.length && {
        id: 'useCases',
        label: 'Use Case',
        kind: 'options',
        options: props.useCaseOptions,
        // A template answers for SEVERAL — Next.js is an AI, an ecommerce and a
        // marketing starter — so it survives if any of its own is picked.
        match: (template, values) =>
          (template.useCases ?? []).some((useCase) => values.includes(useCase))
      },
      props.technologyOptions.length && {
        id: 'tech',
        label: 'Technology',
        kind: 'options',
        options: props.technologyOptions,
        match: (template, values) => values.includes(template.tech)
      }
    ].filter(Boolean)
  )

  // Applied state: `{ [fieldId]: values[] }` — an empty entry is not a filter.
  const filters = ref({})
  const clearFilters = () => {
    filters.value = {}
  }

  // Fields intersect, values inside a field union — `applyFilters` is where that is
  // stated once for all 29 lists, so it is not re-derived here.
  const visibleSections = computed(() =>
    props.sections
      .map((section) => ({
        ...section,
        items: applyFilters(section.items ?? [], fields.value, filters.value)
      }))
      .filter((section) => section.items.length)
  )

  const hasResults = computed(() => visibleSections.value.length > 0)

  // Edge fades on the scrolling catalog, so it dissolves into the page instead of
  // ending at a hard line — the cue that content continues past the viewport. The
  // behaviour is shared with the wizard's own scroll boxes
  // (../../lib/behavior/scroll-fade.js), which is where the reasoning lives; here it
  // only has to be pointed at the box.
  //
  // `scroller` goes on the ScrollArea and `fadeStyle` on the WRAPPER around it:
  // ScrollArea owns its root's attributes (it does not forward `$attrs`), so a style
  // bound to it would never land, and masking the wrapper covers the scrolled content
  // just the same. Nothing gates this on `scrollable` — an unbounded catalog has no
  // overflow, so it measures no distance past either edge and gets no mask.
  const { scroller, fadeStyle } = useScrollFade()
</script>

<template>
  <section
    class="flex flex-col gap-(--layout-group-gap)"
    :class="{ 'lg:min-h-0': scrollable }"
  >
    <!-- Section title beside its one control, then the applied cuts on the row under
         it — the console's filter shape (../list/FilterButton.vue). The button is a
         control of fixed width so it shares the title's row; a chip's width is DATA, so
         the chips take a row of their own and that row does not exist until something is
         applied. -->
    <div class="flex flex-col gap-(--spacing-sm)">
      <div class="flex min-h-(--size-8) flex-wrap items-center justify-between gap-(--spacing-md)">
        <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
          {{ title }}
        </p>

        <FilterButton
          v-model="filters"
          :fields="fields"
        />
      </div>

      <FilterChips
        v-model="filters"
        :fields="fields"
      />
    </div>

    <!-- The catalog. When scrollable, the bands live in a ScrollArea — the page's only
         scroll box: it takes the column's slack and the catalog scrolls under the pinned
         title row, running to the bottom of the viewport (the page drops its end
         boundary). The wrapper carries the edge fades. -->
    <div
      v-if="hasResults"
      :class="scrollable ? 'lg:flex lg:min-h-0 lg:flex-1 lg:flex-col' : ''"
      :style="fadeStyle"
    >
      <!-- The height bound is `lg:`-only, like the page's: ScrollArea's root
           carries `min-h-0`, so an unscoped `flex-1` inside an auto-height column
           would resolve to a zero-height (invisible) catalog on the stacked layout. -->
      <component
        :is="scrollable ? ScrollArea : 'div'"
        ref="scroller"
        :aria-label="scrollable ? `${title} results` : undefined"
        :class="
          scrollable ? 'pb-(--spacing-xxs) pr-(--spacing-xxs) lg:min-h-0 lg:flex-1' : undefined
        "
      >
        <div class="flex flex-col gap-(--layout-section-gap)">
          <section
            v-for="section in visibleSections"
            :key="section.id"
            class="flex flex-col gap-(--layout-group-gap)"
          >
            <!-- The band label, one level under the pane's own title and muted with it:
                 the same treatment the wizard gives these very groups, so the reader
                 meets one vocabulary across the two surfaces that offer this catalog. -->
            <p class="px-(--spacing-xs) text-label-sm text-(--text-muted)">
              {{ section.label }}
            </p>

            <!-- ── A `list` band: the Marketplace's catalog row ── -->
            <div
              v-if="section.kind === 'list'"
              class="grid gap-(--spacing-md)"
              :class="listGridClass"
            >
              <!-- No `badge`: the corner Tag is for a TYPE, and a band already headed
                   "Azion Templates" does not need every row to repeat it. -->
              <IntegrationCard
                v-for="item in section.items"
                :key="item.slug"
                :title="item.title"
                :description="item.description"
                :vendor="item.vendor"
                :icon="item.icon"
                :mark-class="item.markClass"
                badge=""
                @select="emit('select', item)"
              />
            </div>

            <!-- ── A `cards` band: the framework grid ── -->
            <!-- A card's natural height steps with how many lines its description wraps
                 to. The floor (176px, `--size-44`) puts every card on the same base, and
                 the grid STRETCHES the rest: a row is as tall as its tallest card, so
                 neighbours share a bottom edge instead of ending 14px apart. The card
                 anchors its column to the top (./TemplateCard.vue), so the slack falls
                 below the sentence and every mark along the row shares a line. -->
            <div
              v-else
              class="grid gap-(--spacing-md)"
              :class="gridClass"
            >
              <TemplateCard
                v-for="item in section.items"
                :key="item.slug"
                class="min-h-(--size-44)"
                :icon="item.icon"
                :mark-class="item.markClass"
                :title="item.title"
                :description="item.description"
                :color="item.color"
                @select="emit('select', item)"
              />
            </div>
          </section>
        </div>
      </component>
    </div>
    <EmptyState
      v-else
      size="medium"
      title="No templates match your filters"
      description="Try removing a filter to widen the results."
      :class="{ 'lg:min-h-0 lg:flex-1': scrollable }"
    >
      <template #actions>
        <Button
          label="Clear filters"
          kind="outlined"
          size="medium"
          @click="clearFilters"
        />
      </template>
    </EmptyState>
  </section>
</template>
