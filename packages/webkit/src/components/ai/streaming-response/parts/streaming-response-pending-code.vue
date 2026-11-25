<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { languageName } from '../../../code/code-block/lib/language-name'

  defineOptions({ name: 'StreamingResponsePendingCode', inheritAttrs: false })

  export interface StreamingResponsePendingCodeProps {
    /** The code of the fence so far. */
    code?: string
    /** Language of the fence, named in the header. */
    language?: string
  }

  withDefaults(defineProps<StreamingResponsePendingCodeProps>(), {
    code: '',
    language: ''
  })

  const attrs = useAttrs()
  const testId = computed<string | undefined>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : undefined
  })
</script>

<template>
  <div
    dir="ltr"
    :data-testid="testId"
    class="flex flex-col overflow-clip rounded-(--shape-card) bg-(--bg-surface-raised)"
  >
    <div
      class="flex h-10 shrink-0 items-center gap-(--spacing-xs) ps-(--spacing-lg) pe-(--spacing-sm) text-(--text-muted)"
    >
      <i
        class="az az-code text-label-code-sm shrink-0"
        aria-hidden="true"
      />
      <span class="text-label-code-sm min-w-0 flex-1 truncate">{{ languageName(language) }}</span>
    </div>
    <pre
      tabindex="0"
      class="m-0 overflow-x-auto px-(--spacing-lg) pb-(--spacing-sm) text-label-code-sm text-(--text-default) focus-visible:outline-none focus-visible:inset-ring-1 focus-visible:inset-ring-(--ring-color)"
      >{{ code }}</pre>
  </div>
</template>
