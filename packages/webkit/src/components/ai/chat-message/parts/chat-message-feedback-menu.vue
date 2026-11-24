<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import DropdownMenu from '../../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuGroup from '../../../navigation/dropdown-menu/dropdown-menu-group/dropdown-menu-group.vue'
  import DropdownMenuItem from '../../../navigation/dropdown-menu/dropdown-menu-item/dropdown-menu-item.vue'
  import DropdownMenuTrigger from '../../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import type { ChatMessageFeedbackValue } from '../injection-key'
  import { feedbackIcon } from '../lib/feedback-icon'

  defineOptions({
    name: 'ChatMessageFeedbackMenu',
    inheritAttrs: false
  })

  export interface ChatMessageFeedbackMenuProps {
    /** The thumb chosen: shown filled on the trigger and checked in the menu. */
    feedback?: ChatMessageFeedbackValue | null
    /** The choice is being sent: the trigger shows a spinner and the menu stays shut. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<ChatMessageFeedbackMenuProps>(), {
    feedback: null,
    loading: false
  })

  const emit = defineEmits<{
    /** A thumb was chosen in the menu. */
    select: [event: MouseEvent | KeyboardEvent, value: ChatMessageFeedbackValue]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ chatMessage: en.chatMessage })

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'chat-message-feedback-menu'
  })

  function onSelect(event: MouseEvent | KeyboardEvent, value: string | number): void {
    if (value === 'up' || value === 'down') emit('select', event, value)
  }
</script>

<template>
  <DropdownMenu
    side="bottom"
    align="start"
    :disabled="loading"
    @select="onSelect"
  >
    <DropdownMenuTrigger>
      <IconButton
        :icon="feedbackIcon(props.feedback)"
        :aria-label="t('chatMessage.feedback')"
        variant="ghost"
        size="medium"
        :loading="loading"
        :data-selected="props.feedback !== null || null"
        :data-testid="`${testId}__trigger`"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup>
      <DropdownMenuItem
        value="up"
        :label="t('chatMessage.goodResponse')"
        :selected="props.feedback === 'up'"
        :data-testid="`${testId}__up`"
      >
        <template #leading>
          <i
            :class="props.feedback === 'up' ? 'az az-thumbs-up-fill' : 'az az-thumbs-up'"
            aria-hidden="true"
          />
        </template>
      </DropdownMenuItem>
      <DropdownMenuItem
        key="dropdown-menu-item-2"
        value="down"
        :label="t('chatMessage.badResponse')"
        :selected="props.feedback === 'down'"
        :data-testid="`${testId}__down`"
      >
        <template #leading>
          <i
            :class="props.feedback === 'down' ? 'az az-thumbs-down-fill' : 'az az-thumbs-down'"
            aria-hidden="true"
          />
        </template>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenu>
</template>
