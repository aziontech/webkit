<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import Tag, { type TagSeverity } from '../../../content/tag/tag.vue'
  import { TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableCellStatus',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** The status text. Empty renders a muted dash. */
      label?: string
      /** Semantic colour of the status; keep it from one shared helper per status set. */
      severity?: TagSeverity
      /** PrimeIcons class for a leading glyph. */
      icon?: string
    }>(),
    {
      label: '',
      severity: 'secondary',
      icon: undefined
    }
  )

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)
  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__cell-status` : 'data-table__cell-status')
  )
</script>

<template>
  <Tag
    v-if="label"
    v-bind="$attrs"
    :data-testid="testId"
    :severity="severity"
    :icon="icon"
    size="medium"
    class="max-w-full min-w-0"
  >
    <span class="min-w-0 truncate">{{ label }}</span>
  </Tag>
  <span
    v-else
    v-bind="$attrs"
    :data-testid="testId"
    class="text-body-sm text-(--text-muted)"
    >—</span
  >
</template>
