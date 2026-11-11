<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useHeadingNav } from '../../../composables/use-heading-nav'

  defineOptions({ name: 'DocHeading', inheritAttrs: false })

  interface Props {
    /** Heading level; drives the tag and the prose type scale. */
    level?: 1 | 2 | 3 | 4
    /** Anchor id: what the page rail's entry and the copied URL point at. */
    id?: string
    /** Fallback text when the default slot is empty. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    level: 2,
    id: '',
    label: ''
  })

  defineSlots<{
    /** The heading text. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const nav = useHeadingNav()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'documentation-doc-heading'
  )
</script>

<template>
  <component
    :is="`h${level}`"
    v-bind="$attrs"
    :id="id || undefined"
    :data-doc-heading="level"
    :data-testid="testId"
    class="scroll-mt-(--spacing-lg)"
  >
    <a
      v-if="id"
      :href="`#${id}`"
      data-doc-anchor
      class="group/anchor rounded-(--shape-flat) text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
      @click="nav($event, { id: props.id })"
    >
      <span class="decoration-(--border-strong) underline-offset-4 group-hover/anchor:underline">
        <slot>{{ label }}</slot>
      </span>
      <i
        class="pi pi-link ms-(--spacing-xs) align-middle text-label-md text-(--text-muted) opacity-0 transition-opacity duration-150 ease-out group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </a>
    <template v-else>
      <slot>{{ label }}</slot>
    </template>
  </component>
</template>
