<script setup lang="ts">
  import CopyButton from '@aziontech/webkit/copy-button'

  import ResourceLink from '../resource/ResourceLink.vue'
  import DomainOverflowPopover from './DomainOverflowPopover.vue'

  interface Props {
    value?: string
    domains?: unknown[]
    count?: number
  }

  withDefaults(defineProps<Props>(), {
    value: '',
    domains: () => [],
    count: 0
  })
</script>

<template>
  <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
    <ResourceLink
      :label="value"
      :href="`https://${value}`"
    />
    <DomainOverflowPopover
      v-if="count"
      :domains="domains"
      :count="count"
    />
    <CopyButton
      kind="outlined"
      :value="value"
      aria-label="Copy domain name"
      class="ml-auto shrink-0"
    />
  </div>
</template>
