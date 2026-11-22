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
    class="flex flex-1 flex-col gap-(--spacing-lg) p-(--spacing-md)"
  >
    <div
      v-for="row in 3"
      :key="row"
      class="flex gap-(--spacing-sm)"
    >
      <Skeleton
        variant="circle"
        width="2rem"
        height="2rem"
      />
      <div class="flex flex-1 flex-col gap-(--spacing-xs)">
        <Skeleton width="25%" />
        <Skeleton :width="row === 2 ? '50%' : '85%'" />
      </div>
    </div>
  </div>
  <div
    v-else
    class="flex flex-1 flex-col justify-center gap-(--spacing-lg) p-(--spacing-md)"
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
