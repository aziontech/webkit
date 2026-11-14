<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Loader from '../loader/loader.vue'

  /** @deprecated since 6.0 — use `LoaderKind` from `@aziontech/webkit/loader` instead. Removed in 7.0. */
  export type AiLoadingKind = 'inline' | 'bar'

  /** @deprecated since 6.0 — use `Loader` (`@aziontech/webkit/loader`) instead. Removed in 7.0. */
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

  withDefaults(defineProps<Props>(), {
    label: '',
    kind: 'inline',
    delay: 1000
  })

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-ai-loading'
  )
</script>

<template>
  <Loader
    v-bind="$attrs"
    :data-testid="testId"
    :label="label"
    :kind="kind"
    :delay="delay"
  />
</template>
