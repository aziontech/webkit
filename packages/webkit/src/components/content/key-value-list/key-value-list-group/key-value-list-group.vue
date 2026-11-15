<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useKeyValueListContext } from '../composables/use-key-value-list-context'

  defineOptions({
    name: 'KeyValueListGroup',
    inheritAttrs: false
  })

  export interface KeyValueListGroupProps {
    /** The group's term, shown above its Items. */
    title: string
  }

  defineProps<KeyValueListGroupProps>()

  defineSlots<{
    /** The group's KeyValueList.Item children. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  useKeyValueListContext()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'key-value-list-group'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-w-0 flex-col gap-(--spacing-sm)"
  >
    <dt class="text-heading-2xs text-(--text-default)">{{ title }}</dt>
    <dd class="min-w-0">
      <dl class="flex flex-col gap-(--spacing-sm)">
        <slot />
      </dl>
    </dd>
  </div>
</template>
