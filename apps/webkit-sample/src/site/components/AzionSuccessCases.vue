<script setup>
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import InputText from '@aziontech/webkit/input-text'
  import LogoWall from '@aziontech/webkit/logo-wall'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Select from '@aziontech/webkit/select'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'
  import FilterButton from '@shared/ui/filter/FilterButton.vue'
  import FilterChips from '@shared/ui/filter/FilterChips.vue'
  import { computed, reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  import { FEATURED_CASES, SUCCESS_CASES } from '../data/success-cases.js'
  import MarketLeader from './MarketLeader.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  const LABEL = {
    industry: 'Industry',
    solution: 'Solution',
    product: 'Product',
    search: 'Search by company or story',
    searchShort: 'Search stories',
    searchLabel: 'Search success stories',
    loadMore: 'Load more',
    notFound: 'No results found for these applied filters.',
    reset: 'View all success stories'
  }

  const PAGE_SIZE = 12

  // Their dark-surface files are already coloured lockups; their colour files set the
  // wordmark in black, which vanishes on this canvas.
  const DARK_LOCKUP = new Set(['MadeiraMadeira', 'Mobiauto', 'NZN'])

  // The careers listing's filter model: one value per field, `ALL` as the reset.
  const ALL = 'All'

  const optionsOf = (allLabel, values) => [
    { label: allLabel, value: ALL },
    ...[...new Set(values)].sort((a, b) => a.localeCompare(b)).map((v) => ({ label: v, value: v }))
  ]

  const FILTERS = [
    {
      key: 'industry',
      label: LABEL.industry,
      options: optionsOf('All industries', SUCCESS_CASES.map((story) => story.industry))
    },
    {
      key: 'solution',
      label: LABEL.solution,
      options: optionsOf('All solutions', SUCCESS_CASES.flatMap((story) => story.solutions))
    },
    {
      key: 'product',
      label: LABEL.product,
      options: optionsOf('All products', SUCCESS_CASES.flatMap((story) => story.products))
    }
  ]

  const selection = reactive({ industry: ALL, solution: ALL, product: ALL, query: '' })
  const labelOf = (options, value) => options.find((option) => option.value === value)?.label ?? ''

  // Below `lg` the same selection drives the console's Filter button and its chips. `range`
  // holds one value per field, as the desktop selects do; a chip's × is the `ALL` reset.
  // One array instance: FilterButton and FilterChips key their shared channel off it.
  const fields = FILTERS.map((filter) => ({
    id: filter.key,
    label: filter.label,
    kind: 'range',
    options: filter.options.filter((option) => option.value !== ALL)
  }))
  const applied = computed({
    get: () =>
      Object.fromEntries(
        FILTERS.filter((filter) => selection[filter.key] !== ALL).map((filter) => [
          filter.key,
          [selection[filter.key]]
        ])
      ),
    set: (state) => {
      FILTERS.forEach((filter) => {
        selection[filter.key] = state[filter.key]?.[0] ?? ALL
      })
    }
  })
  const shown = ref(PAGE_SIZE)

  const filtered = computed(() => {
    const query = selection.query.trim().toLowerCase()
    return SUCCESS_CASES.filter(
      (story) =>
        (selection.industry === ALL || story.industry === selection.industry) &&
        (selection.solution === ALL || story.solutions.includes(selection.solution)) &&
        (selection.product === ALL || story.products.includes(selection.product)) &&
        (!query || `${story.client.name} ${story.description}`.toLowerCase().includes(query))
    )
  })
  const visible = computed(() => filtered.value.slice(0, shown.value))
  const hasMore = computed(() => shown.value < filtered.value.length)

  watch(selection, () => {
    shown.value = PAGE_SIZE
  })

  function showAllStories() {
    Object.assign(selection, { industry: ALL, solution: ALL, product: ALL, query: '' })
  }

  // Each featured story is one framed column: its logo tile in the client's brand face,
  // then the story's description below it.
  const featured = FEATURED_CASES.map((story) => ({
    key: story.key,
    description: story.description,
    item: {
      src: story.client.logo,
      alt: story.client.name,
      href: story.href,
      client: story.client,
      ink: story.brand.ink
    },
    face: {
      '--wall-face': [
        `radial-gradient(354px 354px at -15% -15%, ${story.brand.glow}, transparent 70%)`,
        `radial-gradient(354px 354px at 45% 115%, ${story.brand.glow}, transparent 70%)`,
        story.brand.base
      ].join(', '),
      '--wall-ink':
        story.brand.ink === 'dark' ? 'var(--color-base-black)' : 'var(--color-base-white)'
    }
  }))
</script>

<template>
  <Hero
    kind="band"
    max-width="5xl"
    size="large"
    carousel
    carousel-label="Trusted by mission-critical workloads"
    :carousel-marks="CLIENT_STRIP"
  >
    <Hero.Title
      centered
      title="Trusted by Leading Companies"
    >
      <template #actions>
        <Button
          label="See cases"
          kind="secondary"
          size="large"
          href="#cases"
        />
        <Button
          label="Talk to a Specialist"
          kind="outlined"
          size="large"
          href="/site/contact"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </Hero.Title>
  </Hero>

  <SectionContainer max-width="site">
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="none"
      >
        <div class="grid gap-px bg-(--border-default) lg:grid-cols-3">
          <FrameBox
            v-for="column in featured"
            :key="column.key"
            borders="none"
            marks="all"
          >
            <!-- The whole column is the hover target: hovering the description plays the
                 tile's own lift, wash and "Read story" reveal, not only hovering the tile. -->
            <div class="group/card flex h-full flex-col gap-px bg-(--border-default)">
              <!-- One mark per wall, so the wall holds one column and paints its own face. -->
              <LogoWall
                kind="rectangle"
                :aria-label="column.item.alt"
                :items="[column.item]"
                :style="column.face"
                class="[&_[role=list]]:grid-cols-1! [&_a]:[background:var(--wall-face)] [&_a]:[--text-default:var(--wall-ink)] group-hover/card:[&_a]:before:opacity-100 group-hover/card:[&_a>span:first-child]:-translate-y-(--spacing-sm) group-hover/card:[&_a>span:last-child]:translate-y-0 group-hover/card:[&_a>span:last-child]:opacity-100"
              >
                <template #mark="{ item }">
                  <ClientMark
                    :client="item.client"
                    monochrome
                    :knockout="item.ink === 'dark'"
                    mark="h-7 w-auto max-w-full object-contain sm:max-w-40"
                  />
                </template>
              </LogoWall>

              <!-- A pointer target only: the tile above is the one focusable link and carries
                   the accessible name, so this copy is not announced or tabbed twice. -->
              <a
                :href="column.item.href"
                tabindex="-1"
                aria-hidden="true"
                class="relative isolate flex-1 bg-(--bg-canvas) p-(--spacing-lg) before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-moderate-01 before:ease-productive-entrance group-hover/card:before:opacity-100 motion-reduce:before:transition-none"
              >
                <p class="m-0 text-balance text-heading-sm text-(--text-default)">
                  {{ column.description }}
                </p>
              </a>
            </div>
          </FrameBox>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- The hero's "See cases" fragment link lands here, under the sticky bar. -->
    <SectionModule
      id="cases"
      :divided="false"
      :padded="false"
      class="scroll-mt-(--spacing-xxl)"
    >
      <template #header>
        <SectionTitle
          kind="left"
          title="Organizations shaping the future of the web with us"
        />
      </template>

      <!-- From `lg` up, the careers listing's toolbar: search + one select per field. Below
           it, the console's Filter button beside the search, its chips on the row under. -->
      <FrameBox
        flush
        borders="y"
      >
        <div
          role="search"
          class="hidden grid-cols-[minmax(0,4fr)_repeat(3,minmax(0,1fr))] items-center gap-(--spacing-md) px-(--spacing-xl) py-(--spacing-lg) lg:grid"
        >
          <div class="min-w-0">
            <InputText
              v-model="selection.query"
              size="large"
              type="text"
              :placeholder="LABEL.search"
              :aria-label="LABEL.searchLabel"
            >
              <template #iconLeft>
                <i class="pi pi-search text-(--text-muted)" />
              </template>
            </InputText>
          </div>

          <div
            v-for="filter in FILTERS"
            :key="filter.key"
            class="min-w-0"
          >
            <Select
              v-model="selection[filter.key]"
              size="large"
              :display-value="(value) => labelOf(filter.options, value)"
            >
              <Select.Trigger :aria-label="filter.label" />
              <Select.Content>
                <Select.Option
                  v-for="option in filter.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>
          </div>
        </div>

        <div
          role="search"
          class="flex flex-col gap-(--spacing-sm) px-(--spacing-xl) py-(--spacing-lg) lg:hidden"
        >
          <div class="flex items-center gap-(--spacing-sm)">
            <FilterButton
              v-model="applied"
              :fields="fields"
              size="large"
            />
            <div class="min-w-0 flex-1">
              <InputText
                v-model="selection.query"
                size="large"
                type="text"
                :placeholder="LABEL.searchShort"
                :aria-label="LABEL.searchLabel"
              >
                <template #iconLeft>
                  <i class="pi pi-search text-(--text-muted)" />
                </template>
              </InputText>
            </div>
          </div>

          <FilterChips
            v-model="applied"
            :fields="fields"
          />
        </div>
      </FrameBox>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <ul
          v-if="visible.length > 0"
          class="m-0 list-none p-0 max-lg:divide-y max-lg:divide-(--border-default)"
          aria-label="Success stories"
        >
          <li
            v-for="story in visible"
            :key="story.key"
          >
            <a
              :href="story.href"
              target="_blank"
              rel="noopener"
              :aria-label="`Read story: ${story.client.name} (opens in a new tab)`"
              class="group/row grid grid-cols-1 items-center gap-(--spacing-lg) px-(--spacing-xl) py-(--spacing-lg) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none lg:grid-cols-[3fr_6fr_4fr_3fr]"
            >
              <span class="flex h-6 items-center">
                <ClientMark
                  :client="story.client"
                  :colored="!DARK_LOCKUP.has(story.client.name)"
                  mark="h-full w-auto max-w-32 object-contain object-left"
                />
              </span>

              <span class="max-w-md text-balance text-body-sm text-(--text-muted)">
                {{ story.description }}
              </span>

              <span class="hidden text-overline-sm text-(--text-muted) lg:block lg:text-center">
                {{ story.industry }}
              </span>

              <span
                aria-hidden="true"
                class="flex items-center gap-(--spacing-xxs) text-overline-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance group-hover/row:text-(--text-default) motion-reduce:transition-none lg:justify-self-end"
              >
                Read story
                <i
                  class="pi pi-arrow-up-right text-[length:inherit] leading-none transition-[translate] duration-moderate-02 ease-expressive-entrance group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 motion-reduce:transition-none"
                />
              </span>
            </a>
          </li>
        </ul>

        <EmptyState
          v-else
          :title="LABEL.notFound"
          icon="pi pi-search"
          class="p-(--spacing-xxl)"
        >
          <template #actions>
            <Button
              :label="LABEL.reset"
              kind="secondary"
              size="large"
              @click="showAllStories"
            />
          </template>
        </EmptyState>
      </FrameBox>

      <FrameBox
        v-if="hasMore"
        flush
        borders="y"
        marks="bottom"
      >
        <div class="flex justify-center p-(--spacing-xl)">
          <Button
            :label="LABEL.loadMore"
            kind="outlined"
            size="large"
            @click="shown += PAGE_SIZE"
          />
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <MarketLeader />

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <CallToAction
        framed
        kind="split"
        eyebrow="Build"
        title="Build once."
        title-muted="Run everywhere."
        description="Get a faster path to launch, lower latency, and less infrastructure overhead."
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
            href="/site/contact"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </CallToAction>
    </SectionModule>

    <SectionGap hatch />
  </SectionContainer>
</template>
