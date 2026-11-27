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
    /** Wraps a long value onto more lines, breaking anywhere, instead of truncating it in the middle. */
    wrapLines?: boolean
  }

  const props = withDefaults(defineProps<CopyTextProps>(), {
    ariaLabel: '',
    size: 'medium',
    wrapLines: false
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

  const tailLength = computed(() => Math.min(12, Math.floor(props.value.length / 3)))
  const head = computed(() => props.value.slice(0, props.value.length - tailLength.value))
  const tail = computed(() => props.value.slice(props.value.length - tailLength.value))

  function onCopy(event: MouseEvent, value: string) {
    emit('copy', event, value)
  }

  const ROOT_CLASS =
    'inline-flex max-w-full min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) ps-(--spacing-xs) align-middle ' +
    'text-(--text-default) data-[wrap]:items-start ' +
    'data-[size=medium]:text-label-code-md data-[size=small]:text-label-code-sm'
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-wrap="wrapLines || null"
    :class="ROOT_CLASS"
  >
    <span
      v-if="wrapLines"
      dir="ltr"
      class="min-w-0 py-0.5 text-start wrap-anywhere"
      :data-testid="`${testId}__value`"
      >{{ value }}</span
    >
    <span
      v-else
      dir="ltr"
      :title="value"
      class="flex min-w-0 whitespace-nowrap text-start"
      :data-testid="`${testId}__value`"
      ><span class="min-w-0 truncate py-0.5">{{ head }}</span
      ><span
        v-if="tail"
        class="shrink-0 py-0.5"
        >{{ tail }}</span
      ></span
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
