<script setup>
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import LogoWall from '@aziontech/webkit/logo-wall'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'
  import { computed, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  import { FEATURED_CASES, SUCCESS_CASES } from '../data/success-cases.js'
  import MarketLeader from './MarketLeader.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  const LABEL = {
    all: 'All',
    industry: 'Industry',
    products: 'Products',
    solutions: 'Solutions',
    filteredBy: 'Filtered by',
    loadMore: 'Load more',
    notFound: 'No results found for these applied filters.'
  }

  const PAGE_SIZE = 12

  const options = (values) => [
    { label: LABEL.all, value: '' },
    ...[...new Set(values)].sort((a, b) => a.localeCompare(b)).map((v) => ({ label: v, value: v }))
  ]

  const industryOptions = computed(() => options(SUCCESS_CASES.map((story) => story.industry)))
  const solutionOptions = computed(() => options(SUCCESS_CASES.flatMap((story) => story.solutions)))
  const productOptions = computed(() => options(SUCCESS_CASES.flatMap((story) => story.products)))

  const industry = ref('')
  const solution = ref('')
  const product = ref('')
  const shown = ref(PAGE_SIZE)

  const filtered = computed(() =>
    SUCCESS_CASES.filter(
      (story) =>
        (industry.value === '' || story.industry === industry.value) &&
        (solution.value === '' || story.solutions.includes(solution.value)) &&
        (product.value === '' || story.products.includes(product.value))
    )
  )

  const visible = computed(() => filtered.value.slice(0, shown.value))
  const hasMore = computed(() => shown.value < filtered.value.length)

  const applied = computed(() => {
    const picked = [industry.value, solution.value, product.value].filter(Boolean)
    return picked.length > 0 ? picked : [LABEL.all]
  })

  watch([industry, solution, product], () => {
    shown.value = PAGE_SIZE
  })

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
            <div class="flex h-full flex-col gap-px bg-(--border-default)">
              <!-- One mark per wall, so the wall holds one column and paints its own face. -->
              <LogoWall
                kind="rectangle"
                :aria-label="column.item.alt"
                :items="[column.item]"
                :style="column.face"
                class="[&_[role=list]]:grid-cols-1! [&_a]:[background:var(--wall-face)] [&_a]:[--text-default:var(--wall-ink)]"
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

              <div class="flex-1 bg-(--bg-canvas) p-(--spacing-lg)">
                <p class="m-0 text-balance text-heading-sm text-(--text-default)">
                  {{ column.description }}
                </p>
              </div>
            </div>
          </FrameBox>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- The hero's "See cases" fragment link lands here, under the sticky bar. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          kind="left"
          title="Organizations shaping the future of the web with us"
        />
      </template>

      <FrameBox
        flush
        borders="y"
      >
        <div
          class="flex flex-col gap-(--spacing-lg) p-(--spacing-xl)"
          role="group"
          aria-label="Filter the success-case library"
        >
          <div class="flex flex-wrap gap-(--spacing-md)">
            <Select
              v-model="industry"
              :placeholder="LABEL.industry"
              size="medium"
              class="w-full sm:w-56"
            >
              <Select.Trigger :aria-label="LABEL.industry" />
              <Select.Content>
                <Select.Option
                  v-for="option in industryOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>

            <Select
              v-model="solution"
              :placeholder="LABEL.solutions"
              size="medium"
              class="w-full sm:w-56"
            >
              <Select.Trigger :aria-label="LABEL.solutions" />
              <Select.Content>
                <Select.Option
                  v-for="option in solutionOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>

            <Select
              v-model="product"
              :placeholder="LABEL.products"
              size="medium"
              class="w-full sm:w-56"
            >
              <Select.Trigger :aria-label="LABEL.products" />
              <Select.Content>
                <Select.Option
                  v-for="option in productOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>
          </div>

          <p
            aria-live="polite"
            class="m-0 flex flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)"
          >
            {{ LABEL.filteredBy }}:
            <Tag
              v-for="value in applied"
              :key="value"
              severity="secondary"
              size="small"
              >{{ value }}</Tag
            >
          </p>
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
              class="group/row grid grid-cols-1 items-center gap-(--spacing-sm) px-(--spacing-xl) py-(--spacing-lg) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none lg:grid-cols-[3fr_6fr_4fr_3fr] lg:gap-(--spacing-lg)"
            >
              <span class="flex h-6 items-center">
                <ClientMark
                  :client="story.client"
                  monochrome
                  mark="h-full w-auto max-w-32 object-contain object-left opacity-70"
                />
              </span>

              <span class="max-w-md text-balance text-body-sm text-(--text-muted)">
                {{ story.description }}
              </span>

              <span
                class="hidden text-label-code-sm uppercase text-(--text-muted) lg:block lg:text-center"
              >
                {{ story.industry }}
              </span>

              <span
                aria-hidden="true"
                class="flex items-center gap-(--spacing-xxs) text-label-code-sm uppercase text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance group-hover/row:text-(--text-default) motion-reduce:transition-none lg:justify-self-end"
              >
                Read story
                <i class="pi pi-arrow-right text-[length:inherit] leading-none" />
              </span>
            </a>
          </li>
        </ul>

        <EmptyState
          v-else
          :title="LABEL.notFound"
          icon="pi pi-search"
          class="p-(--spacing-xxl)"
        />
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
