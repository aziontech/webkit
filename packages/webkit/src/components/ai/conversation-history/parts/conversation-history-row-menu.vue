<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import IconButton from '../../../action/icon-button/icon-button.vue'
  import DropdownMenu from '../../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuGroup from '../../../navigation/dropdown-menu/dropdown-menu-group/dropdown-menu-group.vue'
  import DropdownMenuItem from '../../../navigation/dropdown-menu/dropdown-menu-item/dropdown-menu-item.vue'
  import DropdownMenuSub from '../../../navigation/dropdown-menu/dropdown-menu-sub/dropdown-menu-sub.vue'
  import DropdownMenuSubContent from '../../../navigation/dropdown-menu/dropdown-menu-sub-content/dropdown-menu-sub-content.vue'
  import DropdownMenuSubTrigger from '../../../navigation/dropdown-menu/dropdown-menu-sub-trigger/dropdown-menu-sub-trigger.vue'
  import DropdownMenuTrigger from '../../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import { useConversationHistoryContext } from '../composables/use-conversation-history-context'
  import type { ConversationHistoryItem, ConversationHistoryItemAction } from '../lib/types'

  defineOptions({
    name: 'ConversationHistoryRowMenu',
    inheritAttrs: false
  })

  export interface ConversationHistoryRowMenuProps {
    /** The conversation the menu acts on. */
    item: ConversationHistoryItem
  }

  const props = defineProps<ConversationHistoryRowMenuProps>()

  const attrs = useAttrs()
  const ctx = useConversationHistoryContext()
  const open = ref(false)
  const menuEl = ref<{ $el?: Element } | null>(null)

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'conversation-history-row-menu'
  })

  const has = (action: ConversationHistoryItemAction): boolean =>
    ctx.itemActions.value.includes(action)
  const targets = computed(() =>
    ctx.projects.value.filter((project) => project.id !== props.item.projectId)
  )
  const movable = computed<boolean>(() => has('move') && targets.value.length > 0)
  const ACTIONS = ['pin', 'rename', 'share', 'lock', 'archive'] as const
  const hasFirstGroup = computed<boolean>(
    () => movable.value || ACTIONS.some((action) => has(action))
  )
  const label = (on: boolean, yes: string, no: string): string =>
    ctx.t(`conversationHistory.${on ? yes : no}` as 'conversationHistory.pin')

  const onSelect = (event: MouseEvent | KeyboardEvent, value: string | number) => {
    const key = String(value)
    if (key === 'remove') ctx.remove(event, props.item.id, menuEl.value?.$el ?? null)
    else if (key === 'rename') ctx.startRename(props.item.id)
    else if (key.startsWith('move:')) {
      const project = targets.value.find((target) => `move:${target.id}` === key)
      if (project) ctx.act(event, 'move', props.item, project)
    } else ctx.act(event, key as ConversationHistoryItemAction, props.item)
  }

  const DANGER_CLASS = 'text-(--text-danger)'
</script>

<template>
  <DropdownMenu
    ref="menuEl"
    v-model:open="open"
    align="end"
    @select="onSelect"
  >
    <DropdownMenuTrigger>
      <IconButton
        icon="az az-ellipsis"
        :ariaLabel="ctx.t('conversationHistory.moreActions', { title: item.title })"
        variant="ghost"
        size="small"
        :data-testid="testId"
      />
    </DropdownMenuTrigger>
    <template v-if="open">
      <DropdownMenuGroup v-if="hasFirstGroup">
        <DropdownMenuItem
          v-if="has('pin')"
          value="pin"
          command="P"
          :label="label(Boolean(item.pinned), 'unpin', 'pin')"
        >
          <template #leading><i class="az az-pin" /></template>
        </DropdownMenuItem>
        <DropdownMenuItem
          key="rename"
          v-if="has('rename')"
          value="rename"
          command="R"
          :label="ctx.t('conversationHistory.rename')"
        >
          <template #leading><i class="az az-pencil" /></template>
        </DropdownMenuItem>
        <DropdownMenuItem
          key="share"
          v-if="has('share')"
          value="share"
          :label="ctx.t('conversationHistory.share')"
        >
          <template #leading><i class="az az-share" /></template>
        </DropdownMenuItem>
        <DropdownMenuItem
          key="lock"
          v-if="has('lock')"
          value="lock"
          :label="label(Boolean(item.locked), 'unlock', 'lock')"
        >
          <template #leading
            ><i :class="item.locked ? 'az az-lock-open' : 'az az-lock'"
          /></template>
        </DropdownMenuItem>
        <DropdownMenuSub v-if="movable">
          <DropdownMenuSubTrigger :label="ctx.t('conversationHistory.moveToProject')">
            <template #leading><i class="az az-folder" /></template>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuGroup>
              <DropdownMenuItem
                v-for="project in targets"
                :key="project.id"
                :value="`move:${project.id}`"
              >
                <template #leading><i class="az az-folder" /></template>
                <bdi dir="auto">{{ project.title }}</bdi>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem
          key="archive"
          v-if="has('archive')"
          value="archive"
          command="A"
          :label="label(Boolean(item.archived), 'unarchive', 'archive')"
        >
          <template #leading><i class="az az-inbox" /></template>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuGroup
        key="danger"
        v-if="ctx.removable.value"
      >
        <DropdownMenuItem value="remove">
          <template #leading
            ><i
              :class="DANGER_CLASS"
              class="az az-trash"
          /></template>
          <span :class="DANGER_CLASS">{{ ctx.t('conversationHistory.remove') }}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </template>
  </DropdownMenu>
</template>
