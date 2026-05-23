<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useDataTableContext } from './composables/use-data-table-context'

  defineOptions({
    name: 'DataTableLastModifiedPopup',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Controls popup visibility. */
      visible?: boolean
      /** Last editor display name. */
      lastEditor?: string
      /** Last modified timestamp string. */
      lastModified?: string
      /** Popup horizontal position in px. */
      position?: number
    }>(),
    {
      visible: false,
      lastEditor: '',
      lastModified: '',
      position: 0
    }
  )

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__last-modified-popup`
  )
</script>

<template>
  <div
    v-if="visible"
    v-bind="attrs"
    class="absolute z-20 rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-3)] text-body-xs text-[var(--text-default)]"
    :style="{ left: `${position}px` }"
    role="tooltip"
    :data-testid="testId"
  >
    <p
      v-if="lastEditor"
      :data-testid="`${testId}__editor`"
    >
      {{ lastEditor }}
    </p>
    <p
      v-if="lastModified"
      class="text-[var(--text-muted)]"
      :data-testid="`${testId}__modified`"
    >
      {{ lastModified }}
    </p>
  </div>
</template>
