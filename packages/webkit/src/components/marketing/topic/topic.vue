<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'Topic',
    inheritAttrs: false
  })

  /** Level of the heading element. */
  export type TopicHeadingLevel = 2 | 3 | 4

  interface Props {
    /** The claim, rendered as the topic's heading. */
    title: string
    /** One sentence explaining the claim; overridden by the default slot. */
    description?: string
    /** Icon class for the glyph above the copy. */
    icon?: string
    /** Level of the heading element. Keep 2 when the band has no headline of its own; drop it to 3 when a section-title has already opened the section, so the document outline stays in order. */
    headingLevel?: TopicHeadingLevel
  }

  const props = withDefaults(defineProps<Props>(), {
    description: '',
    icon: '',
    headingLevel: 2
  })

  const slots = defineSlots<{
    /** Description body; replaces the `description` prop when provided. */
    default?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'marketing-topic')

  const hasDescription = computed<boolean>(
    () => Boolean(slots.default) || props.description.length > 0
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-icon="icon ? true : null"
    :data-described="hasDescription || null"
    class="flex flex-col gap-(--spacing-md)"
  >
    <i
      v-if="icon"
      :class="icon"
      aria-hidden="true"
      class="text-heading-sm text-(--primary)"
    />
    <component
      :is="`h${headingLevel}`"
      class="m-0 text-balance text-heading-xs text-(--text-default)"
    >
      {{ title }}
    </component>
    <p
      v-if="hasDescription"
      class="m-0 text-pretty text-body-sm text-(--text-muted)"
    >
      <slot>{{ description }}</slot>
    </p>
  </div>
</template>
