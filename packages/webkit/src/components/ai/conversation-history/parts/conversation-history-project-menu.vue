<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import IconButton from '../../../action/icon-button/icon-button.vue'
  import DropdownMenu from '../../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuGroup from '../../../navigation/dropdown-menu/dropdown-menu-group/dropdown-menu-group.vue'
  import DropdownMenuItem from '../../../navigation/dropdown-menu/dropdown-menu-item/dropdown-menu-item.vue'
  import DropdownMenuTrigger from '../../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import { useConversationHistoryContext } from '../composables/use-conversation-history-context'
  import type { ConversationHistoryProject, ConversationHistoryProjectAction } from '../lib/types'

  defineOptions({
    name: 'ConversationHistoryProjectMenu',
    inheritAttrs: false
  })

  export interface ConversationHistoryProjectMenuProps {
    /** The project the menu acts on. */
    project: ConversationHistoryProject
  }

  const props = defineProps<ConversationHistoryProjectMenuProps>()

  const attrs = useAttrs()
  const ctx = useConversationHistoryContext()
  const open = ref(false)

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'conversation-history-project-menu'
  })

  const has = (action: ConversationHistoryProjectAction): boolean =>
    ctx.projectActions.value.includes(action)

  const onSelect = (event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'pin' || value === 'settings' || value === 'remove')
      ctx.actProject(event, value, props.project)
  }

  const DANGER_CLASS = 'text-(--text-danger)'
</script>

<template>
  <DropdownMenu
    v-model:open="open"
    align="end"
    @select="onSelect"
  >
    <DropdownMenuTrigger>
      <IconButton
        icon="az az-ellipsis"
        :ariaLabel="ctx.t('conversationHistory.moreActions', { title: project.title })"
        variant="ghost"
        size="small"
        :data-testid="testId"
      />
    </DropdownMenuTrigger>
    <template v-if="open">
      <DropdownMenuGroup v-if="has('pin') || has('settings')">
        <DropdownMenuItem
          v-if="has('pin')"
          value="pin"
          :label="
            ctx.t(
              project.pinned ? 'conversationHistory.unpinProject' : 'conversationHistory.pinProject'
            )
          "
        >
          <template #leading><i class="az az-pin" /></template>
        </DropdownMenuItem>
        <DropdownMenuItem
          key="settings"
          v-if="has('settings')"
          value="settings"
          :label="ctx.t('conversationHistory.projectSettings')"
        >
          <template #leading><i class="az az-settings" /></template>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuGroup
        key="danger"
        v-if="has('remove')"
      >
        <DropdownMenuItem value="remove">
          <template #leading
            ><i
              :class="DANGER_CLASS"
              class="az az-trash"
          /></template>
          <span :class="DANGER_CLASS">{{ ctx.t('conversationHistory.removeProject') }}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </template>
  </DropdownMenu>
</template>
