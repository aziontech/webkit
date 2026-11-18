<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import StatusIndicator from '../../../feedback/status-indicator/status-indicator.vue'
  import type { NodeDiagramSeverity } from '../types'

  defineOptions({
    name: 'NodeDiagramHeader',
    inheritAttrs: false
  })

  export interface NodeDiagramHeaderProps {
    /** Icon class shown before the eyebrow. */
    icon?: string
    /** Short label above the title, e.g. the resource type. */
    eyebrow?: string
    /** Status text shown with a coloured dot at the end of the row. */
    status?: string
    /** Colour of the status dot. */
    severity?: NodeDiagramSeverity
  }

  withDefaults(defineProps<NodeDiagramHeaderProps>(), {
    icon: '',
    eyebrow: '',
    status: '',
    severity: 'neutral'
  })

  defineSlots<{
    /** Extra content at the end of the row, after the status. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'node-diagram-header'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="node-diagram-header"
    :data-testid="testId"
    class="flex min-h-8 min-w-0 items-center gap-(--spacing-2xs) px-(--spacing-md) pt-(--spacing-sm)"
  >
    <i
      v-if="icon"
      :class="icon"
      class="shrink-0 text-body-xs leading-none text-(--text-muted)"
      aria-hidden="true"
    />
    <span
      v-if="eyebrow"
      class="min-w-0 truncate text-label-sm text-(--text-muted)"
      >{{ eyebrow }}</span
    >
    <span
      v-if="status || $slots['default']"
      class="ms-auto flex shrink-0 items-center gap-(--spacing-2xs)"
    >
      <StatusIndicator
        v-if="status"
        :severity="severity"
        :label="status"
        :data-testid="`${testId}__status`"
      />
      <slot />
    </span>
  </div>
</template>
