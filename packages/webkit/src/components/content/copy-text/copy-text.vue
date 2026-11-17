<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import CopyButton from '../../action/copy-button/copy-button.vue'

  defineOptions({
    name: 'CopyText',
    inheritAttrs: false
  })

  /** Size token of CopyText. */
  export type CopyTextSize = 'small' | 'medium'

  export interface CopyTextProps {
    /** The code value shown and copied to the clipboard. */
    value: string
    /** Accessible name of the copy button. Empty uses the locale catalog (`Copy {value}`). */
    ariaLabel?: string
    /** Size token; sets the code typography and the size of the copy button (28 px or 32 px). */
    size?: CopyTextSize
  }

  const props = withDefaults(defineProps<CopyTextProps>(), {
    ariaLabel: '',
    size: 'medium'
  })

  const emit = defineEmits<{
    /** Fired after a successful clipboard write; `value` is the copied text. */
    copy: [event: MouseEvent, value: string]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ copyText: en.copyText })

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'copy-text')

  const copyLabel = computed<string>(
    () => props.ariaLabel || t('copyText.copy', { value: props.value })
  )

  function onCopy(event: MouseEvent, value: string) {
    emit('copy', event, value)
  }
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    class="inline-flex max-w-full min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) ps-(--spacing-xs) align-middle text-(--text-default) data-[size=medium]:text-label-code-md data-[size=small]:text-label-code-sm"
  >
    <span
      dir="ltr"
      :title="value"
      class="min-w-0 truncate text-start"
      :data-testid="`${testId}__value`"
      >{{ value }}</span
    >
    <CopyButton
      :value="value"
      :aria-label="copyLabel"
      :size="size"
      variant="ghost"
      class="shrink-0"
      :data-testid="`${testId}__copy`"
      @copy="onCopy"
    />
  </span>
</template>
