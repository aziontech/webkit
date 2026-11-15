<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  /** Heading scale of the page title: small for detail tabs and settings sub-pages, medium for first-level pages, large for a creation hub headline. */
  export type PageHeaderSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'PageHeader',
    inheritAttrs: false
  })

  export interface PageHeaderProps {
    /** The page title, rendered as the page h1. */
    title: string
    /** One sentence under the title that says what the page is for. */
    description?: string
    /** Heading scale of the title. */
    size?: PageHeaderSize
    /** Id set on the h1, so a landmark or form can name itself with aria-labelledby. */
    titleId?: string
  }

  withDefaults(defineProps<PageHeaderProps>(), {
    description: '',
    size: 'medium',
    titleId: ''
  })

  defineSlots<{
    /** Rich description content (links, inline buttons); replaces the description prop. */
    description(): unknown
    /** The actions the page owns, Documentation first and the create action on the outer edge. */
    actions(): unknown
    /** The trail back to the parent pages, above the title row. */
    breadcrumbs(): unknown
    /** A decorative leading glyph or square avatar before the title. */
    icon(): unknown
    /** Short facts beside the title, such as a status tag. */
    meta(): unknown
    /** The tabs of the page's sections, across the full width under the header. */
    tabs(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'page-header')
</script>

<template>
  <header
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    class="@container/page-header flex flex-wrap items-start justify-between gap-(--spacing-md)"
  >
    <div
      v-if="$slots['breadcrumbs']"
      :data-testid="`${testId}__breadcrumbs`"
      class="flex min-w-0 basis-full"
    >
      <slot name="breadcrumbs" />
    </div>
    <div class="flex min-w-0 grow flex-col gap-(--spacing-2xs)">
      <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
        <span
          v-if="$slots['icon']"
          :data-testid="`${testId}__icon`"
          aria-hidden="true"
          class="inline-flex shrink-0 items-center text-heading-sm text-(--text-muted)"
        >
          <slot name="icon" />
        </span>
        <h1
          :id="titleId || undefined"
          :data-testid="`${testId}__title`"
          :data-size="size"
          class="text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg"
        >
          {{ title }}
        </h1>
        <div
          v-if="$slots['meta']"
          :data-testid="`${testId}__meta`"
          class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
        >
          <slot name="meta" />
        </div>
      </div>
      <p
        v-if="$slots['description'] || description"
        :data-testid="`${testId}__description`"
        class="text-pretty text-body-sm text-(--text-muted)"
      >
        <slot name="description">{{ description }}</slot>
      </p>
    </div>
    <div
      v-if="$slots['actions']"
      :data-testid="`${testId}__actions`"
      class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) @md/page-header:w-auto @md/page-header:max-w-full @max-md/page-header:*:w-full"
    >
      <slot name="actions" />
    </div>
    <div
      v-if="$slots['tabs']"
      :data-testid="`${testId}__tabs`"
      class="min-w-0 basis-full"
    >
      <slot name="tabs" />
    </div>
  </header>
</template>
