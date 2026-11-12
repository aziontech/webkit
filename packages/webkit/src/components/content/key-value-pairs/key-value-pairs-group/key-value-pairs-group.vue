<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useKeyValuePairsContext } from '../composables/use-key-value-pairs-context'

  defineOptions({
    name: 'KeyValuePairsGroup',
    inheritAttrs: false
  })

  interface Props {
    /** The group's term, shown above its Items. */
    title: string
  }

  defineProps<Props>()

  defineSlots<{
    /** The group's KeyValuePairs.Item children. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const context = useKeyValuePairsContext()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? `${context.testId.value}-group`
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-w-0 flex-col gap-(--spacing-sm)"
  >
    <dt class="text-heading-xxs text-(--text-default)">{{ title }}</dt>
    <dd class="min-w-0">
      <dl class="flex flex-col gap-(--spacing-sm)">
        <slot />
      </dl>
    </dd>
  </div>
</template>
