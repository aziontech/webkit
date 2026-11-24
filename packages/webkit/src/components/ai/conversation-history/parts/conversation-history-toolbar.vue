<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import IconButton from '../../../action/icon-button/icon-button.vue'
  import SearchTrigger from '../../../action/search-trigger/search-trigger.vue'
  import { useConversationHistoryContext } from '../composables/use-conversation-history-context'

  defineOptions({
    name: 'ConversationHistoryToolbar',
    inheritAttrs: false
  })

  export interface ConversationHistoryToolbarProps {
    /** Shows the New chat button. */
    creatable?: boolean
    /** Shows the New project button. */
    projectCreatable?: boolean
  }

  withDefaults(defineProps<ConversationHistoryToolbarProps>(), {
    creatable: false,
    projectCreatable: false
  })

  const emit = defineEmits<{
    'search-open': [event: MouseEvent | KeyboardEvent]
    create: [event: MouseEvent]
    'project-create': [event: MouseEvent]
  }>()

  const attrs = useAttrs()
  const ctx = useConversationHistoryContext()

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'conversation-history-toolbar'
  })
</script>

<template>
  <div
    v-bind="$attrs"
    class="flex min-w-0 items-center gap-(--spacing-2xs)"
    :data-testid="testId"
  >
    <SearchTrigger
      :label="ctx.t('conversationHistory.searchChats')"
      class="min-w-0 flex-1"
      :data-testid="`${testId}__search`"
      @open="(event: MouseEvent | KeyboardEvent) => emit('search-open', event)"
    />
    <IconButton
      v-if="projectCreatable"
      icon="az az-folder-plus"
      :ariaLabel="ctx.t('conversationHistory.newProject')"
      variant="ghost"
      size="medium"
      :data-testid="`${testId}__project-create`"
      @click="(event: MouseEvent) => emit('project-create', event)"
    />
    <IconButton
      key="create"
      v-if="creatable"
      icon="az az-square-pen"
      :ariaLabel="ctx.t('conversationHistory.newChat')"
      variant="ghost"
      size="medium"
      :data-testid="`${testId}__create`"
      @click="(event: MouseEvent) => emit('create', event)"
    />
  </div>
</template>
