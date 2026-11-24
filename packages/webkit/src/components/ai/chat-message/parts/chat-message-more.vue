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

  defineOptions({
    name: 'ChatMessageMore',
    inheritAttrs: false
  })

  export interface ChatMessageMoreProps {
    /** Holds Good response and Bad response. */
    showFeedback?: boolean
    /** The thumb chosen, checked in the menu. */
    feedback?: ChatMessageFeedbackValue | null
    /** Holds Try again. */
    retryable?: boolean
    /** Holds Branch in new chat. */
    branchable?: boolean
    /** Locks Try again and Branch in new chat. */
    disabled?: boolean
  }

  withDefaults(defineProps<ChatMessageMoreProps>(), {
    showFeedback: false,
    feedback: null,
    retryable: false,
    branchable: false,
    disabled: false
  })

  const emit = defineEmits<{
    /** An item was chosen: `up`, `down`, `retry` or `branch`. */
    select: [event: MouseEvent | KeyboardEvent, value: string | number]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ chatMessage: en.chatMessage })

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'chat-message-more'
  })
</script>

<template>
  <DropdownMenu
    align="start"
    @select="(event, value) => emit('select', event, value)"
  >
    <DropdownMenuTrigger>
      <IconButton
        icon="az az-ellipsis"
        :aria-label="t('chatMessage.more')"
        variant="ghost"
        size="large"
        :data-testid="testId"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup>
      <DropdownMenuItem
        v-if="showFeedback"
        value="up"
        :label="t('chatMessage.goodResponse')"
        :selected="feedback === 'up'"
      >
        <template #leading>
          <i
            :class="feedback === 'up' ? 'az az-thumbs-up-fill' : 'az az-thumbs-up'"
            aria-hidden="true"
          />
        </template>
      </DropdownMenuItem>
      <DropdownMenuItem
        key="dropdown-menu-item-2"
        v-if="showFeedback"
        value="down"
        :label="t('chatMessage.badResponse')"
        :selected="feedback === 'down'"
      >
        <template #leading>
          <i
            :class="feedback === 'down' ? 'az az-thumbs-down-fill' : 'az az-thumbs-down'"
            aria-hidden="true"
          />
        </template>
      </DropdownMenuItem>
      <DropdownMenuItem
        key="dropdown-menu-item-3"
        v-if="retryable"
        value="retry"
        :label="t('chatMessage.retry')"
        :disabled="disabled"
      >
        <template #leading>
          <i
            class="az az-refresh"
            aria-hidden="true"
          />
        </template>
      </DropdownMenuItem>
      <DropdownMenuItem
        key="dropdown-menu-item-4"
        v-if="branchable"
        value="branch"
        :label="t('chatMessage.branch')"
        :disabled="disabled"
      >
        <template #leading>
          <i
            class="az az-git-branch"
            aria-hidden="true"
          />
        </template>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenu>
</template>
