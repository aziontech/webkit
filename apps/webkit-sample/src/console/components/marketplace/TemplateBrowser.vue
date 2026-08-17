<script setup>
  // TemplateBrowser — the reusable "browse templates" module: a section title
  // beside its controls (a two-dimension Filter Dropdown + a Browse link), then a
  // responsive grid of TemplateCards with an EmptyState fallback. Used both by the
  // "Start from Template" tab and the "Recommended Templates" section so the two
  // stay identical. Owns its own filter state, so each instance filters on its own.
  import Button from '@aziontech/webkit/button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

  import TemplateCard from './TemplateCard.vue'

  const props = defineProps({
    title: { type: String, required: true },
    templates: { type: Array, default: () => [] },
    useCaseOptions: { type: Array, default: () => [] },
    technologyOptions: { type: Array, default: () => [] },
    // Grid density — overridable so a narrow column can drop to fewer columns.
    gridClass: {
      type: String,
      default: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6'
    },
    // Keep the module inside its parent's height and scroll the grid instead of
    // the page: the title row and its controls stay pinned, only the cards move.
    // Applied from `lg` up, the breakpoint where the page becomes height-bounded;
    // below that the columns stack and the page scrolls as usual.
    scrollable: { type: Boolean, default: false }
  })

  const emit = defineEmits(['select'])

  // A SegmentedButton at the top of the dropdown switches which dimension's
  // options are listed below.
  const filterSegments = [
    { label: 'Use Cases', value: 'use-cases' },
    { label: 'Technology', value: 'technology' }
  ]
  const filterTab = ref('use-cases')
  const activeOptions = computed(() =>
    filterTab.value === 'use-cases' ? props.useCaseOptions : props.technologyOptions
  )

  // Option values are unique across both groups, so the group a value belongs to
  // is recovered from this set.
  const useCaseValues = computed(() => new Set(props.useCaseOptions.map((o) => o.value)))

  const selectedFilters = reactive([])
  const totalFilters = computed(() => selectedFilters.length)
  const isFilterActive = (value) => selectedFilters.includes(value)

  // Dropdown emits (event, value); toggle that value in/out of the selection.
  const toggleFilter = (_event, value) => {
    const i = selectedFilters.indexOf(value)
    if (i === -1) selectedFilters.push(value)
    else selectedFilters.splice(i, 1)
  }
  const clearFilters = () => {
    selectedFilters.length = 0
  }

  // A template matches when it satisfies every non-empty group (OR within a group).
  const filteredTemplates = computed(() => {
    if (!selectedFilters.length) return props.templates
    const useCases = selectedFilters.filter((v) => useCaseValues.value.has(v))
    const tech = selectedFilters.filter((v) => !useCaseValues.value.has(v))
    return props.templates.filter(
      (t) =>
        (!tech.length || tech.includes(t.tech)) &&
        (!useCases.length || t.useCases.some((c) => useCases.includes(c)))
    )
  })

  // Edge fades on the scrolling catalog (scrollable only), so the grid dissolves
  // into the page instead of ending at a hard line — the cue that content continues
  // past the viewport.
  //
  // Each edge fades only while there is content past it: nothing at rest, a top band
  // once the first row has scrolled under the pinned title row, and a bottom band
  // that shrinks to zero as the last row arrives. Fixed bands would dim the first and
  // last rows permanently and pop off at the ends of the scroll; tracking the actual
  // scroll distance means the fade eases itself in and out as you move.
  //
  // The mask sits on the *wrapper*, not on the ScrollArea: ScrollArea owns its root's
  // attributes (it does not forward `$attrs`), and masking the wrapper covers the
  // scrolled content just the same.
  const MAX_FADE = 64 // px — --spacing-xl at its widest step
  const scrollRef = ref(null)
  const fadeTop = ref(0)
  const fadeBottom = ref(0)

  // The observed element is held outside the ref so teardown still reaches it after
  // v-if has already dropped the ref (filtering down to no results).
  let observedEl = null
  let scrollObserver = null

  const clampFade = (distance) => Math.max(0, Math.min(MAX_FADE, distance))

  // `scrollRef` is a ScrollArea instance when scrollable, a plain element otherwise.
  const viewportEl = () => scrollRef.value?.$el ?? scrollRef.value ?? null

  const updateFade = () => {
    const el = viewportEl()
    if (!el) {
      fadeTop.value = 0
      fadeBottom.value = 0
      return
    }
    fadeTop.value = clampFade(el.scrollTop)
    fadeBottom.value = clampFade(el.scrollHeight - el.clientHeight - el.scrollTop)
  }

  const fadeStyle = computed(() => {
    // No mask at rest: an always-on one costs a compositing layer and would leave the
    // first and last rows permanently half-lit.
    if (!fadeTop.value && !fadeBottom.value) return undefined
    const mask = `linear-gradient(to bottom, transparent 0, #000 ${fadeTop.value}px, #000 calc(100% - ${fadeBottom.value}px), transparent 100%)`
    return { maskImage: mask, WebkitMaskImage: mask }
  })

  const unobserveViewport = () => {
    if (observedEl) observedEl.removeEventListener('scroll', updateFade)
    scrollObserver?.disconnect()
    observedEl = null
    scrollObserver = null
  }

  const observeViewport = () => {
    if (!props.scrollable) return
    const el = viewportEl()
    if (el && el === observedEl) {
      updateFade()
      return
    }
    unobserveViewport()
    if (!el) {
      updateFade()
      return
    }
    observedEl = el
    // Listeners are attached here rather than in the template for the same reason the
    // mask is: ScrollArea does not forward `$attrs`, so a `@scroll` binding on it
    // would never reach the element that actually scrolls.
    el.addEventListener('scroll', updateFade, { passive: true })
    // Catches the viewport resizing; content-height changes come from the filters,
    // which the watch below covers.
    scrollObserver = new ResizeObserver(updateFade)
    scrollObserver.observe(el)
    updateFade()
  }

  onMounted(observeViewport)

  watch(filteredTemplates, async () => {
    await nextTick()
    observeViewport()
  })

  onBeforeUnmount(unobserveViewport)
</script>

<template>
  <section
    class="flex flex-col gap-(--layout-group-gap)"
    :class="{ 'lg:min-h-0': scrollable }"
  >
    <!-- Section title beside its one control: a Filter Dropdown (Use Cases /
         Technology groups). -->
    <div
      class="flex min-h-(--size-8) flex-wrap items-center justify-between gap-(--spacing-md)"
    >
      <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
        {{ title }}
      </p>

      <div class="flex items-center gap-(--spacing-sm)">
        <Dropdown
          placement="bottom-end"
          @select="toggleFilter"
        >
          <Dropdown.Trigger>
            <Button
              :label="totalFilters ? `Filter (${totalFilters})` : 'Filter'"
              kind="text"
              size="medium"
              icon="pi pi-chevron-down"
            />
          </Dropdown.Trigger>

          <!-- Dimension switch pinned above the option list. -->
          <template #top>
            <SegmentedButton
              v-model="filterTab"
              :options="filterSegments"
              aria-label="Filter dimension"
            />
          </template>

          <Dropdown.Group>
            <Dropdown.Option
              v-for="opt in activeOptions"
              :key="opt.value"
              :value="opt.value"
              :label="opt.label"
              :selected="isFilterActive(opt.value)"
            >
              <template #left>
                <i
                  :class="opt.icon"
                  class="text-(--text-muted)"
                  aria-hidden="true"
                />
              </template>
              <template
                v-if="isFilterActive(opt.value)"
                #right
              >
                <i
                  class="pi pi-check text-(--text-default)"
                  aria-hidden="true"
                />
              </template>
            </Dropdown.Option>
          </Dropdown.Group>
        </Dropdown>
      </div>
    </div>

    <!-- Filtered template grid. When scrollable, the grid lives in a ScrollArea —
         the page's only scroll box: it takes the column's slack and the cards
         scroll under the pinned title row, running to the bottom of the viewport
         (the page drops its end boundary). The wrapper carries the edge fades;
         `items-start` keeps every card at its own content height rather than
         stretching it to match the tallest in its row. -->
    <div
      v-if="filteredTemplates.length"
      :class="scrollable ? 'lg:flex lg:min-h-0 lg:flex-1 lg:flex-col' : ''"
      :style="fadeStyle"
    >
      <!-- The height bound is `lg:`-only, like the page's: ScrollArea's root
           carries `min-h-0`, so an unscoped `flex-1` inside an auto-height column
           would resolve to a zero-height (invisible) grid on the stacked layout. -->
      <component
        :is="scrollable ? ScrollArea : 'div'"
        ref="scrollRef"
        :aria-label="scrollable ? `${title} results` : undefined"
        :class="
          scrollable
            ? 'pb-(--spacing-xxs) pr-(--spacing-xxs) lg:min-h-0 lg:flex-1'
            : undefined
        "
      >
        <div
          class="grid items-start gap-(--spacing-md)"
          :class="gridClass"
        >
          <!-- A card's natural height steps with how many lines its description
               wraps to (1–3 across the two-column widths), which left the grid
               visibly ragged. The floor is the tallest of those — 224px, a 3-line
               description at the narrowest two-column card — so every card lands on
               it and the grid reads as one height, while `items-start` still lets a
               longer description grow that one card instead of the whole row. -->
          <TemplateCard
            v-for="(tpl, i) in filteredTemplates"
            :key="`${tpl.title}-${i}`"
            class="min-h-(--size-56)"
            :icon="tpl.icon"
            :title="tpl.title"
            :description="tpl.description"
            :color="tpl.color"
            @select="emit('select', tpl)"
          />
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
