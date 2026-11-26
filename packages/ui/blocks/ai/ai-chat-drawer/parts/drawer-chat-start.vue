<script setup lang="ts">
  import EmptyState from '@aziontech/ui/empty-state'
  import Skeleton from '@aziontech/ui/skeleton'
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/ui/suggestion-group'

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
        width="55%"
        height="2.75rem"
        class="self-end"
      />
      <div class="flex flex-col gap-(--spacing-xs)">
        <Skeleton width="90%" />
        <Skeleton :width="row === 2 ? '40%' : '70%'" />
      </div>
    </template>
  </div>
  <div
    v-else
    class="my-auto flex flex-col gap-(--spacing-lg) py-(--spacing-md)"
  >
    <EmptyState
      title="Ask about storefront"
      description="The assistant reads this workload’s settings and metrics to answer. It cites the documentation it uses."
      icon="az az-ask-azion"
      size="small"
    />
    <SuggestionGroup
      :items="starters"
      orientation="vertical"
      @select="(event, item) => emit('select', event, item)"
    />
  </div>
</template>
