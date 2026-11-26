<script setup lang="ts">
  import Button from '../../../action/button/button.vue'
  import Eyebrow from '../../../content/eyebrow/eyebrow.vue'
  import type { JobPostingSectionFacet } from '../job-posting-section.vue'

  defineOptions({ name: 'JobPostingSectionRail', inheritAttrs: false })

  defineProps<{
    testId: string
    area: string
    title: string
    facets: JobPostingSectionFacet[]
    applyLabel: string
    applyHref: string
  }>()
</script>

<template>
  <div
    :data-testid="`${testId}__rail`"
    class="border-b border-(--border-default) lg:col-start-2 lg:row-start-1 lg:border-s lg:border-b-0"
  >
    <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-xl) lg:sticky lg:top-14">
      <div class="flex flex-col gap-(--spacing-xs)">
        <Eyebrow v-if="area">{{ area }}</Eyebrow>
        <p class="m-0 text-pretty text-heading-sm text-(--text-default)">
          {{ title }}
        </p>
      </div>

      <ul
        v-if="facets.length > 0"
        class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0"
      >
        <li
          v-for="facet in facets"
          :key="facet.label"
          class="flex items-start gap-(--spacing-xs) text-body-sm text-(--text-muted)"
        >
          <i
            v-if="facet.icon"
            :class="facet.icon"
            class="mt-(--spacing-2xs) shrink-0 text-body-sm text-(--text-muted)"
            aria-hidden="true"
          />
          {{ facet.label }}
        </li>
      </ul>

      <Button
        v-if="applyLabel"
        :label="applyLabel"
        variant="secondary"
        size="large"
        :href="applyHref"
        icon="az az-chevron-right"
        icon-position="trailing"
        animated
        class="w-full"
      />
    </div>
  </div>
</template>
