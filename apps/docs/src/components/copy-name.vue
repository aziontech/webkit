<script setup lang="ts">
  import CopyButton from '@aziontech/webkit/copy-button'

  import { format, messages } from '../lib/i18n'

  defineOptions({ name: 'CopyName' })

  defineProps<{ value: string }>()

  const t = messages
</script>

<template>
  <span
    data-docs-copy-name
    class="flex max-w-full min-w-0 items-start gap-(--spacing-2xs)"
  >
    <code
      dir="ltr"
      class="min-w-0 py-(--spacing-2xs) text-label-code-sm wrap-anywhere text-(--text-default)"
      >{{ value }}</code
    >
    <CopyButton
      :value="value"
      :aria-label="format(t.copyName, { value })"
      size="small"
      variant="ghost"
      class="shrink-0"
    />
  </span>
</template>
