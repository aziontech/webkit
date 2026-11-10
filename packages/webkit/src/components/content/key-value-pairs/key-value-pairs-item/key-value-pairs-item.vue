<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import { hasRenderedContent } from '../../../../utils/rendered-content'
  import Skeleton from '../../../feedback/skeleton/skeleton.vue'
  import { useKeyValuePairsContext } from '../composables/use-key-value-pairs-context'

  defineOptions({
    name: 'KeyValuePairsItem',
    inheritAttrs: false
  })

  interface Props {
    /** The key, rendered in the term. */
    label: string
  }

  defineProps<Props>()

  defineSlots<{
    /** The value: text or composed components. Shows the empty-value marker when omitted or empty. */
    default(): unknown
    /** Optional affordance after the label text inside the term, such as a Hint. */
    info(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()
  const context = useKeyValuePairsContext()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? `${context.testId.value}-item`
  )

  const hasValue = () => hasRenderedContent(slots['default']?.() ?? [])
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-w-0 flex-col gap-(--spacing-xxs)"
  >
    <dt class="flex items-center gap-(--spacing-xxs) text-body-sm text-(--text-muted)">
      <span>{{ label }}</span>
      <slot name="info" />
    </dt>
    <dd
      class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs) break-words text-body-sm text-(--text-default)"
    >
      <Skeleton v-if="context.loading.value" />
      <slot v-else-if="hasValue()" />
      <template v-else>
        <span
          aria-hidden="true"
          class="text-body-sm text-(--text-muted)"
          >—</span
        >
        <span class="sr-only">Not set</span>
      </template>
    </dd>
  </div>
</template>
