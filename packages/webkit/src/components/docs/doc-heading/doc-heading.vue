<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useHeadingNavigation } from '../../../composables/use-heading-navigation'

  defineOptions({ name: 'DocHeading', inheritAttrs: false })

  export interface DocHeadingProps {
    /** Heading level; drives the tag and the prose type scale. */
    level?: 1 | 2 | 3 | 4
    /** In-page anchor: the heading's id, what the page rail's entry and the copied URL point at. */
    anchor?: string
    /** Fallback text when the default slot is empty. */
    label?: string
  }

  const props = withDefaults(defineProps<DocHeadingProps>(), {
    level: 2,
    anchor: '',
    label: ''
  })

  defineSlots<{
    /** The heading text. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const nav = useHeadingNavigation()

  const target = computed(() => props.anchor)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'doc-heading')
</script>

<template>
  <component
    :is="`h${level}`"
    v-bind="$attrs"
    :id="target || undefined"
    :data-doc-heading="level"
    :data-testid="testId"
    class="scroll-mt-(--spacing-lg)"
  >
    <a
      v-if="target"
      :href="`#${target}`"
      data-doc-anchor
      class="group/anchor rounded-(--shape-flat) text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
      @click="nav($event, { id: target })"
    >
      <span class="decoration-(--border-strong) underline-offset-4 group-hover/anchor:underline">
        <slot>{{ label }}</slot>
      </span>
      <i
        class="ai ai-link ms-(--spacing-xs) align-middle text-label-md text-(--text-muted) opacity-0 transition-opacity duration-150 ease-out group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </a>
    <template v-else>
      <slot>{{ label }}</slot>
    </template>
  </component>
</template>
