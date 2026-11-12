<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'DocHero', inheritAttrs: false })

  interface Props {
    /** The page title, set at display size as the page's `h1`. */
    title?: string
    /** The deck under the title: what the docs cover, in one or two sentences. */
    description?: string
  }

  withDefaults(defineProps<Props>(), {
    title: '',
    description: ''
  })

  defineSlots<{
    /** Replaces the title text, for a title that is more than a string. */
    title?(): unknown
    /** Replaces the description text. */
    default?(): unknown
    /** The action row: the primary `Button` first, then `CopyPromptButton`. */
    actions?(): unknown
    /** One muted line under the actions that says what the prompt does. */
    note?(): unknown
  }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'documentation-doc-hero'
  )
</script>

<template>
  <header
    v-bind="$attrs"
    :data-testid="testId"
    data-doc-chrome
    class="flex w-full flex-col pt-(--spacing-xl) pb-(--spacing-xxl) sm:pt-(--spacing-xxl)"
  >
    <h1
      :data-testid="`${testId}__title`"
      class="m-0 text-heading-2xl text-(--text-default)"
    >
      <slot name="title">{{ title }}</slot>
    </h1>
    <p
      v-if="description || $slots['default']"
      :data-testid="`${testId}__description`"
      class="m-0 mt-(--spacing-md) max-w-(--container-xl) text-body-lg text-(--text-muted)"
    >
      <slot>{{ description }}</slot>
    </p>
    <div
      v-if="$slots['actions']"
      :data-testid="`${testId}__actions`"
      class="mt-(--spacing-xl) flex flex-wrap items-center gap-(--spacing-sm)"
    >
      <slot name="actions" />
    </div>
    <p
      v-if="$slots['note']"
      :data-testid="`${testId}__note`"
      class="m-0 mt-(--spacing-lg) text-body-sm text-(--text-muted)"
    >
      <slot name="note" />
    </p>
  </header>
</template>
