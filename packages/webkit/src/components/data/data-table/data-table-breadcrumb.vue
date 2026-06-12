<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useDataTableContext } from './composables/use-data-table-context'

  defineOptions({
    name: 'DataTableBreadcrumb',
    inheritAttrs: false
  })

  export interface BreadcrumbSegment {
    label: string
    path: string
  }

  withDefaults(
    defineProps<{
      /** Breadcrumb path segments. */
      segments?: BreadcrumbSegment[]
    }>(),
    {
      segments: () => []
    }
  )

  const emit = defineEmits<{
    navigate: [path: string]
  }>()

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__breadcrumb`
  )
</script>

<template>
  <nav
    v-bind="attrs"
    class="flex flex-wrap items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--text-muted)]"
    :data-testid="testId"
    aria-label="Breadcrumb"
  >
    <template
      v-for="(segment, index) in segments"
      :key="segment.path"
    >
      <button
        type="button"
        class="transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
        :class="
          index === segments.length - 1 ? 'text-[var(--text-default)]' : 'text-[var(--text-muted)]'
        "
        :data-testid="`${testId}__segment-${index}`"
        @click="emit('navigate', segment.path)"
      >
        {{ segment.label }}
      </button>
      <span
        v-if="index < segments.length - 1"
        aria-hidden="true"
        >/</span
      >
    </template>
  </nav>
</template>
