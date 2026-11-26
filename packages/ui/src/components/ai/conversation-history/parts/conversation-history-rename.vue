<script setup lang="ts">
  import { computed, onMounted, ref, useAttrs } from 'vue'

  import Input from '../../../input/input/input.vue'
  import { useConversationHistoryContext } from '../composables/use-conversation-history-context'
  import type { ConversationHistoryItem } from '../lib/types'

  defineOptions({
    name: 'ConversationHistoryRename',
    inheritAttrs: false
  })

  export interface ConversationHistoryRenameProps {
    /** The conversation renamed. */
    item: ConversationHistoryItem
  }

  const props = defineProps<ConversationHistoryRenameProps>()

  const emit = defineEmits<{
    complete: [refocus: boolean]
  }>()

  const attrs = useAttrs()
  const ctx = useConversationHistoryContext()
  const draft = ref(props.item.title)
  const inputEl = ref<InstanceType<typeof Input> | null>(null)
  let finished = false

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'conversation-history-rename'
  })

  const finish = (event: KeyboardEvent | FocusEvent, save: boolean) => {
    if (finished) return
    finished = true
    const title = draft.value.trim()
    if (save && title && title !== props.item.title) ctx.saveRename(event, props.item, title)
    emit('complete', event.type === 'keydown')
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      finish(event, true)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      finish(event, false)
    }
  }

  onMounted(() => {
    requestAnimationFrame(() => {
      inputEl.value?.focus()
      const field = document.activeElement
      if (field instanceof HTMLInputElement) field.select()
    })
  })
</script>

<template>
  <li
    v-bind="$attrs"
    class="flex min-h-8 w-full min-w-0 shrink-0 items-center py-(--spacing-2xs)"
    :data-testid="testId"
  >
    <Input
      ref="inputEl"
      v-model="draft"
      size="small"
      class="w-full"
      autocomplete="off"
      :aria-label="ctx.t('conversationHistory.renameTitle', { title: item.title })"
      :data-testid="`${testId}__input`"
      @keydown="onKeydown"
      @blur="(event: FocusEvent) => finish(event, true)"
    />
  </li>
</template>
