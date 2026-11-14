<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { CommandPageKey, useCommandMenuContext } from '../injection-key'

  defineOptions({
    name: 'CommandSeparator',
    inheritAttrs: false
  })

  const attrs = useAttrs()
  const ctx = useCommandMenuContext()
  const separatorPage = inject(CommandPageKey, '')

  const isVisible = computed(() => !ctx.ranking.value && ctx.page.value === separatorPage)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__separator`
  )
</script>

<template>
  <div
    v-show="isVisible"
    v-bind="attrs"
    role="separator"
    aria-hidden="true"
    :data-testid="testId"
    class="mt-(--spacing-sm) mb-(--spacing-xs) border-t border-(--border-default)"
  />
</template>
