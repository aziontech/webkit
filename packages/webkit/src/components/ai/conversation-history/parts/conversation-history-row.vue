<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import type { ConversationHistoryItem } from '../conversation-history.vue'

  defineOptions({
    name: 'ConversationHistoryRow',
    inheritAttrs: false
  })

  export interface ConversationHistoryRowProps {
    /** The conversation the row shows. */
    item: ConversationHistoryItem
    /** Marks the row as the open conversation. */
    active?: boolean
    /** Shows the Delete button. */
    removable?: boolean
  }

  withDefaults(defineProps<ConversationHistoryRowProps>(), {
    active: false,
    removable: false
  })

  const emit = defineEmits<{
    select: [event: MouseEvent]
    remove: [event: MouseEvent]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ conversationHistory: en.conversationHistory })

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'conversation-history-row'
  })

  const ITEM_CLASS =
    'group/item relative flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-control) pe-(--spacing-2xs) pointer-fine:pe-0 transition-colors duration-fast-02 ease-productive-entrance ' +
    'hover:bg-(--bg-hover) ' +
    'data-[active]:bg-(--bg-selected) ' +
    'motion-reduce:transition-none'

  const BUTTON_CLASS =
    'flex h-11 min-w-0 flex-1 items-center gap-(--spacing-xs) rounded-(--shape-control) px-(--spacing-sm) text-start text-label-lg text-(--text-default) outline-none ' +
    'pointer-fine:h-9 pointer-fine:text-label-md ' +
    'pointer-fine:group-data-[removable]/item:group-hover/item:pe-10 ' +
    'pointer-fine:group-data-[removable]/item:group-focus-within/item:pe-10 ' +
    'pointer-fine:group-data-[removable]/item:group-data-[active]/item:pe-10 ' +
    'focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset'

  const REMOVE_CLASS =
    'transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none ' +
    'pointer-fine:absolute pointer-fine:end-(--spacing-2xs) pointer-fine:top-1/2 pointer-fine:-translate-y-1/2 ' +
    'pointer-fine:opacity-0 pointer-fine:group-hover/item:opacity-100 pointer-fine:group-focus-within/item:opacity-100 pointer-fine:group-data-[active]/item:opacity-100'
</script>

<template>
  <li
    v-bind="$attrs"
    :data-active="active || null"
    :data-removable="removable || null"
    :data-testid="testId"
    :class="ITEM_CLASS"
  >
    <button
      type="button"
      data-slot="conversation-history-item"
      :aria-current="active ? 'page' : undefined"
      :title="item.title"
      :class="BUTTON_CLASS"
      @click="(event: MouseEvent) => emit('select', event)"
    >
      <bdi
        dir="auto"
        class="truncate"
        >{{ item.title }}</bdi
      >
    </button>
    <IconButton
      v-if="removable"
      icon="az az-trash"
      :ariaLabel="t('conversationHistory.delete', { title: item.title })"
      variant="ghost"
      size="small"
      :class="REMOVE_CLASS"
      :data-testid="`${testId}__remove`"
      @click="(event: MouseEvent) => emit('remove', event)"
    />
  </li>
</template>
