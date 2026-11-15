<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { hasRenderedContent } from '../../../../utils/rendered-content'
  import Skeleton from '../../../feedback/skeleton/skeleton.vue'
  import { useKeyValuePairsContext } from '../composables/use-key-value-pairs-context'

  defineOptions({
    name: 'KeyValuePairsItem',
    inheritAttrs: false
  })

  export interface KeyValuePairsItemProps {
    /** The key, rendered in the term. */
    label: string
  }

  defineProps<KeyValuePairsItemProps>()

  defineSlots<{
    /** The value: text or composed components. Shows the empty-value marker when omitted or empty. */
    default(): unknown
    /** Optional affordance after the label text inside the term, such as a Hint. */
    info(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ keyValuePairs: en.keyValuePairs })
  const slots = useSlots()
  const context = useKeyValuePairsContext()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? `${context.testId.value}__item`
  )

  const hasValue = () => hasRenderedContent(slots['default']?.() ?? [])
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="context.kind.value"
    class="flex min-w-0 flex-col gap-(--spacing-2xs) data-[kind=split]:flex-row data-[kind=split]:flex-wrap data-[kind=split]:items-center data-[kind=split]:justify-between data-[kind=split]:gap-x-(--spacing-md)"
  >
    <dt class="flex shrink-0 items-center gap-(--spacing-2xs) text-body-sm text-(--text-muted)">
      <span>{{ label }}</span>
      <slot name="info" />
    </dt>
    <dd
      :data-kind="context.kind.value"
      class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs) break-words text-body-sm text-(--text-default) data-[kind=split]:ms-auto data-[kind=split]:justify-end data-[kind=split]:text-end"
    >
      <Skeleton v-if="context.loading.value" />
      <slot v-else-if="hasValue()" />
      <template v-else>
        <span
          aria-hidden="true"
          class="text-body-sm text-(--text-muted)"
          >—</span
        >
        <span class="sr-only">{{ t('keyValuePairs.notSet') }}</span>
      </template>
    </dd>
  </div>
</template>
