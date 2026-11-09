<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import { computed, ref } from 'vue'

  import { applyFilters } from '../../lib/behavior/filter-bar'
  import FilterButton from '../list/FilterButton.vue'
  import FilterChips from '../list/FilterChips.vue'
  import IntegrationCard from './IntegrationCard.vue'
  import TemplateCard from './TemplateCard.vue'

  interface TemplateItem {
    slug: string
    title: string
    description?: string
    vendor?: string
    icon?: string
    markClass?: string
    color?: string
    kind?: string
    tech?: string
    useCases?: string[]
  }

  interface TemplateSection {
    id: string
    label: string
    kind?: string
    items?: TemplateItem[]
  }

  interface FilterOption {
    value: string
    label: string
  }

  interface FilterField {
    id: string
    label: string
    kind: 'options'
    options: FilterOption[]
    match: (template: TemplateItem, values: string[]) => boolean
  }

  interface Props {
    title: string
    sections?: TemplateSection[]
    useCaseOptions?: FilterOption[]
    technologyOptions?: FilterOption[]
    kindOptions?: FilterOption[]
    gridClass?: string
    listGridClass?: string
    scrollable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    sections: () => [],
    useCaseOptions: () => [],
    technologyOptions: () => [],
    kindOptions: () => [],
    gridClass: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    listGridClass: 'grid-cols-1 sm:grid-cols-2',
    scrollable: false
  })

  const emit = defineEmits<{
    select: [event: Event, item: TemplateItem]
  }>()

  const fields = computed<FilterField[]>(() =>
    [
      {
        id: 'kind',
        label: 'Type',
        kind: 'options' as const,
        options: props.kindOptions,
        match: (template: TemplateItem, values: string[]) => values.includes(template.kind ?? '')
      },
      {
        id: 'useCases',
        label: 'Use Case',
        kind: 'options' as const,
        options: props.useCaseOptions,
        match: (template: TemplateItem, values: string[]) =>
          (template.useCases ?? []).some((useCase) => values.includes(useCase))
      },
      {
        id: 'tech',
        label: 'Technology',
        kind: 'options' as const,
        options: props.technologyOptions,
        match: (template: TemplateItem, values: string[]) => values.includes(template.tech ?? '')
      }
    ].filter((field) => field.options.length > 0)
  )

  const filters = ref<Record<string, unknown>>({})
  const clearFilters = () => {
    filters.value = {}
  }

  const visibleSections = computed(() =>
    props.sections
      .map((section) => ({
        ...section,
        items: applyFilters(section.items ?? [], fields.value, filters.value) as TemplateItem[]
      }))
      .filter((section) => section.items.length)
  )

  const hasResults = computed(() => visibleSections.value.length > 0)
</script>

<template>
  <section
    class="flex flex-col gap-(--layout-group-gap)"
    :class="{ 'lg:min-h-0': scrollable }"
  >
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

    <div
      v-if="hasResults"
      :class="scrollable ? 'lg:flex lg:min-h-0 lg:flex-1 lg:flex-col' : ''"
    >
      <component
        :is="scrollable ? ScrollArea : 'div'"
        v-bind="scrollable ? { fade: true, ariaLabel: `${title} results` } : {}"
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
            <p class="px-(--spacing-xs) text-label-sm text-(--text-muted)">
              {{ section.label }}
            </p>

            <div
              v-if="section.kind === 'list'"
              class="grid gap-(--spacing-md)"
              :class="listGridClass"
            >
              <IntegrationCard
                v-for="item in section.items"
                :key="item.slug"
                :title="item.title"
                :description="item.description"
                :vendor="item.vendor"
                :icon="item.icon"
                :mark-class="item.markClass"
                badge=""
                @select="(event: Event) => emit('select', event, item)"
              />
            </div>

            <div
              v-else
              class="grid gap-(--spacing-md)"
              :class="gridClass"
            >
              <TemplateCard
                v-for="item in section.items"
                :key="item.slug"
                class="min-h-(--size-44)"
                :icon="item.icon ?? ''"
                :mark-class="item.markClass"
                :title="item.title"
                :description="item.description"
                :color="item.color"
                @select="(event: Event) => emit('select', event, item)"
              />
            </div>
          </section>
        </div>
      </component>
    </div>
    <div
      v-else
      :class="scrollable ? 'lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:justify-center' : ''"
    >
      <EmptyState
        size="medium"
        title="No templates match your filters"
        description="Try removing a filter to widen the results."
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
    </div>
  </section>
</template>
