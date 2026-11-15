<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { hasRenderedContent } from '../../../../utils/rendered-content'
  import Skeleton from '../../../feedback/skeleton/skeleton.vue'
  import { useKeyValueListContext } from '../composables/use-key-value-list-context'

  defineOptions({
    name: 'KeyValueListItem',
    inheritAttrs: false
  })

  export interface KeyValueListItemProps {
    /** The key, rendered in the term. */
    label: string
  }

  defineProps<KeyValueListItemProps>()

  defineSlots<{
    /** The value: text or composed components. Shows the empty-value marker when omitted or empty. */
    default(): unknown
    /** Optional affordance after the label text inside the term, such as a Hint. */
    info(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ keyValueList: en.keyValueList })
  const slots = useSlots()
  const context = useKeyValueListContext()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? `${context.testId.value}__item`
  )

  const hasValue = () => hasRenderedContent(slots['default']?.() ?? [])
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-variant="context.variant.value"
    class="flex min-w-0 flex-col gap-(--spacing-2xs) data-[variant=split]:flex-row data-[variant=split]:flex-wrap data-[variant=split]:items-center data-[variant=split]:justify-between data-[variant=split]:gap-x-(--spacing-md)"
  >
    <dt class="flex shrink-0 items-center gap-(--spacing-2xs) text-body-sm text-(--text-muted)">
      <span>{{ label }}</span>
      <slot name="info" />
    </dt>
    <dd
      :data-variant="context.variant.value"
      class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs) break-words text-body-sm text-(--text-default) data-[variant=split]:ms-auto data-[variant=split]:justify-end data-[variant=split]:text-end"
    >
      <Skeleton v-if="context.loading.value" />
      <slot v-else-if="hasValue()" />
      <template v-else>
        <span
          aria-hidden="true"
          class="text-body-sm text-(--text-muted)"
          >—</span
        >
        <span class="sr-only">{{ t('keyValueList.notSet') }}</span>
      </template>
    </dd>
  </div>
</template>
