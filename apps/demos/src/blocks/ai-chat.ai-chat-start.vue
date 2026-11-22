<script setup lang="ts">
  import EmptyState from '@aziontech/webkit/empty-state'
  import Skeleton from '@aziontech/webkit/skeleton'
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'

  defineProps<{ hydrating: boolean; starters: SuggestionGroupItem[] }>()

  const emit = defineEmits<{
    select: [event: MouseEvent | KeyboardEvent, item: SuggestionGroupItem]
  }>()
</script>

<template>
  <div
    v-if="hydrating"
    role="status"
    aria-label="Loading the conversation"
    class="flex flex-col gap-(--spacing-xl)"
  >
    <template
      v-for="row in 2"
      :key="row"
    >
      <Skeleton
        width="45%"
        height="2.75rem"
        class="self-end"
      />
      <div class="flex flex-col gap-(--spacing-xs)">
        <Skeleton width="90%" />
        <Skeleton width="80%" />
        <Skeleton :width="row === 2 ? '40%' : '60%'" />
      </div>
    </template>
  </div>
  <div
    v-else
    class="my-auto flex flex-col gap-(--spacing-lg) py-(--spacing-md)"
  >
    <EmptyState
      title="How can I help with your Azion account?"
      description="Ask about your workloads, cache, security rules and deployments. Answers cite the documentation they come from."
      icon="az az-ask-azion"
    />
    <SuggestionGroup
      :items="starters"
      orientation="vertical"
      @select="(event, item) => emit('select', event, item)"
    />
  </div>
</template>
