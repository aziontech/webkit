<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import type { ConversationHistoryItem } from '../conversation-history.vue'
  import { titleWhenTruncated } from '../lib/truncated-title'

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

  const ITEM_CLASS = 'group/item relative w-full min-w-0 shrink-0'

  const BUTTON_CLASS =
    'relative flex h-8 pointer-coarse:min-h-11 w-full min-w-0 shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-control) border-y border-transparent bg-clip-padding ' +
    'forced-colors:border-y-0 pe-(--spacing-xs) py-(--spacing-2xs) ps-(--spacing-sm) text-start text-label-md ' +
    'text-(--text-default) transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-(--bg-canvas) ' +
    'not-data-[active]:group-hover/item:bg-(--bg-hover) not-data-[active]:group-has-[:focus-visible]/item:bg-(--bg-hover) data-[active]:bg-(--bg-selected) ' +
    'pointer-coarse:group-data-[removable]/item:pe-10 ' +
    'pointer-fine:group-data-[removable]/item:group-hover/item:pe-10 ' +
    'pointer-fine:group-data-[removable]/item:group-focus-within/item:pe-10 ' +
    'pointer-fine:group-data-[removable]/item:group-data-[active]/item:pe-10'

  const REMOVE_CLASS =
    'absolute end-(--spacing-2xs) top-1/2 -translate-y-1/2 transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none ' +
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
      :data-active="active || null"
      :aria-current="active ? 'page' : undefined"
      :class="BUTTON_CLASS"
      @pointerenter="titleWhenTruncated"
      @click="(event: MouseEvent) => emit('select', event)"
    >
      <bdi
        dir="auto"
        class="min-w-0 flex-1 truncate"
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
