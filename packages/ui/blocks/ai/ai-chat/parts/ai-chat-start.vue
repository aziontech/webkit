<script setup lang="ts">
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/ui/suggestion-group'

  defineProps<{ starters: SuggestionGroupItem[] }>()

  const emit = defineEmits<{
    select: [event: MouseEvent | KeyboardEvent, item: SuggestionGroupItem]
  }>()

  defineSlots<{ default(): unknown }>()

  const START_CLASS =
    'flex min-h-0 flex-1 flex-col overflow-y-auto px-(--spacing-md) pt-(--spacing-2xl) ' +
    'pb-[max(var(--spacing-md),env(safe-area-inset-bottom))] md:justify-center md:pb-(--spacing-2xl)'
</script>

<template>
  <div :class="START_CLASS">
    <div
      class="mx-auto flex w-full max-w-(--container-2xl) flex-col gap-(--spacing-md) max-md:flex-1"
    >
      <div class="flex items-center justify-center max-md:flex-1 md:pb-(--spacing-sm)">
        <h2 class="text-center text-title-md text-(--text-default)">What can I help with?</h2>
      </div>
      <div class="flex md:order-last md:justify-center">
        <SuggestionGroup
          :items="starters"
          @select="(event, item) => emit('select', event, item)"
        />
      </div>
      <div class="flex flex-col gap-(--spacing-xs)">
        <slot />
      </div>
    </div>
  </div>
</template>
