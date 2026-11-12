<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'FeatureList',
    inheritAttrs: false
  })

  /** One included feature: a short label and an optional one-line description. */
  export interface FeatureListItem {
    /** The feature, a few words. */
    label: string
    /** One line under the label with the detail. */
    description?: string
  }

  /** Columns when the list's own box is at least the md container. */
  export type FeatureListColumns = 1 | 2

  interface Props {
    /** The features, in order; each item is a label with an optional description. */
    items?: FeatureListItem[]
    /** Columns when the list's own box is at least the md container; a narrower box always shows one column. */
    columns?: FeatureListColumns
    /** Accessible name of the list when no visible heading names it. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    items: () => [],
    columns: 1,
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-feature-list'
  )
</script>

<template>
  <div
    v-if="items.length > 0"
    v-bind="$attrs"
    :data-testid="testId"
    class="@container/feature-list min-w-0"
  >
    <ul
      role="list"
      :data-columns="columns"
      :aria-label="ariaLabel || undefined"
      class="m-0 grid min-w-0 list-none grid-cols-1 gap-x-(--spacing-lg) gap-y-(--spacing-sm) p-0 @md/feature-list:data-[columns=2]:grid-cols-2"
    >
      <li
        v-for="(item, index) in items"
        :key="`${index}-${item.label}`"
        :data-testid="`${testId}__item`"
        class="flex min-w-0 items-start gap-(--spacing-xs)"
      >
        <i
          class="pi pi-check mt-0.5 shrink-0 text-body-sm text-(--success-contrast)"
          aria-hidden="true"
        />
        <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span
            dir="auto"
            class="break-words text-label-sm text-(--text-default)"
            >{{ item.label }}</span
          >
          <span
            v-if="item.description"
            dir="auto"
            class="break-words text-body-xs text-(--text-muted)"
            >{{ item.description }}</span
          >
        </span>
      </li>
    </ul>
  </div>
</template>
