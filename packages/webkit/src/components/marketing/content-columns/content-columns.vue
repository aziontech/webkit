<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import CardGrid from '../card-grid/card-grid.vue'
  import SectionTitle from '../section-title/section-title.vue'

  defineOptions({
    name: 'ContentColumns',
    inheritAttrs: false
  })

  /** One column of the band: a short title and the sentence that develops it. */
  export type ContentColumnItem = {
    /** The point itself, rendered as the column's `h3`. */
    title: string
    /** One or two sentences developing the point, rendered under the column title. */
    description: string
  }

  /** How many columns the grid holds from the medium breakpoint up. */
  export type ContentColumnsCount = 2 | 3

  interface Props {
    /** The columns, in reading order; each item is a title and a description. */
    items?: ContentColumnItem[]
    /** Headline of the band, rendered as its h2 above the columns. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /** Short uppercase overline rendered above the headline. */
    eyebrow?: string
    /** How many columns the grid holds from the medium breakpoint up; below it the columns stack. */
    columns?: ContentColumnsCount
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    title: '',
    description: '',
    eyebrow: '',
    columns: 3
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-content-columns'
  )

  const hasItems = computed(() => props.items.length > 0)

  const hasHeader = computed(
    () => props.title.length > 0 || props.description.length > 0 || props.eyebrow.length > 0
  )
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-columns="columns"
    :aria-label="title || undefined"
    class="group flex flex-col gap-(--spacing-xxl)"
  >
    <SectionTitle
      v-if="hasHeader"
      :framed="false"
      kind="left"
      :title="title"
      :eyebrow="eyebrow"
      :description="description"
    />

    <CardGrid
      v-if="hasItems"
      kind="divider"
      :columns="columns"
    >
      <div
        v-for="(item, index) in items"
        :key="`${item.title}-${index}`"
        class="flex h-full flex-col gap-(--spacing-sm) bg-(--bg-canvas) p-(--spacing-xl)"
      >
        <h3 class="m-0 text-balance text-heading-sm text-(--text-default)">{{ item.title }}</h3>
        <p class="m-0 text-pretty text-body-sm text-(--text-muted)">{{ item.description }}</p>
      </div>
    </CardGrid>
  </section>
</template>
