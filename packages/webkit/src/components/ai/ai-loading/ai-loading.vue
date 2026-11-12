<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Progress from '../../feedback/progress/progress.vue'

  export type AiLoadingKind = 'inline' | 'bar'

  defineOptions({
    name: 'AiLoading',
    inheritAttrs: false
  })

  interface Props {
    /** Visible loading text, `[Generating|Loading] <what>` with no end punctuation. Empty uses the locale catalog (`Generating a response`). */
    label?: string
    /** `inline` pulses three dots beside the text (text responses); `bar` draws an indeterminate bar under it, where a table, list or code block is about to appear. */
    kind?: AiLoadingKind
    /** Milliseconds to wait before showing anything, so a fast response never flickers a loading state. */
    delay?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    kind: 'inline',
    delay: 1000
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ aiLoading: en.aiLoading })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-ai-loading'
  )
  const text = computed<string>(() => props.label || t('aiLoading.generating'))

  const visible = ref<boolean>(props.delay <= 0)
  let timer: ReturnType<typeof setTimeout> | undefined

  function schedule(): void {
    if (timer) clearTimeout(timer)
    if (props.delay <= 0) {
      visible.value = true
      return
    }
    visible.value = false
    timer = setTimeout(() => {
      visible.value = true
    }, props.delay)
  }

  onMounted(schedule)
  watch(() => props.delay, schedule)
  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer)
  })
</script>

<template>
  <div
    v-bind="$attrs"
    role="status"
    :data-testid="testId"
    :data-kind="kind"
    :data-visible="visible || null"
    class="flex w-full min-w-0 flex-col gap-(--spacing-xs) data-[kind=inline]:flex-row data-[kind=inline]:items-center"
  >
    <template v-if="visible">
      <span
        v-if="kind === 'inline'"
        aria-hidden="true"
        :data-testid="`${testId}__dots`"
        class="inline-flex shrink-0 items-center gap-(--spacing-xxs)"
      >
        <span
          class="size-1.5 rounded-(--radius-full) bg-(--text-muted) animate-pulse motion-reduce:animate-none"
        />
        <span
          class="size-1.5 rounded-(--radius-full) bg-(--text-muted) animate-pulse [animation-delay:200ms] motion-reduce:animate-none"
        />
        <span
          class="size-1.5 rounded-(--radius-full) bg-(--text-muted) animate-pulse [animation-delay:400ms] motion-reduce:animate-none"
        />
      </span>
      <span class="text-body-sm text-(--text-muted)">{{ text }}</span>
      <Progress
        v-if="kind === 'bar'"
        indeterminate
        shape="rounded"
        size="small"
        aria-hidden="true"
        :data-testid="`${testId}__bar`"
        class="max-w-(--container-xs)"
      />
    </template>
  </div>
</template>
