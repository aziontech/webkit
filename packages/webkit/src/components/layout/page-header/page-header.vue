<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  /** Heading scale of the page title: small for detail tabs and settings sub-pages, medium for first-level pages, large for a creation hub headline. */
  export type PageHeaderSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'PageHeader',
    inheritAttrs: false
  })

  interface Props {
    /** The page title, rendered as the page h1. */
    title: string
    /** One sentence under the title that says what the page is for. */
    description?: string
    /** Heading scale of the title. */
    size?: PageHeaderSize
    /** Id set on the h1, so a landmark or form can name itself with aria-labelledby. */
    titleId?: string
  }

  withDefaults(defineProps<Props>(), {
    description: '',
    size: 'medium',
    titleId: ''
  })

  defineSlots<{
    /** Rich description content (links, inline buttons); replaces the description prop. */
    description(): unknown
    /** The actions the page owns, Documentation first and the create action on the outer edge. */
    actions(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'layout-page-header'
  )
</script>

<template>
  <header
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    class="flex flex-wrap items-start justify-between gap-(--spacing-md)"
  >
    <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
        <h1
          :id="titleId || undefined"
          :data-testid="`${testId}__title`"
          :data-size="size"
          class="text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg"
        >
          {{ title }}
        </h1>
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
      class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) md:w-auto md:max-w-full max-md:*:w-full"
    >
      <slot name="actions" />
    </div>
  </header>
</template>
