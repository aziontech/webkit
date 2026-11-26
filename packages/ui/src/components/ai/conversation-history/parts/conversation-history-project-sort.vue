<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import DropdownMenu from '../../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuGroup from '../../../navigation/dropdown-menu/dropdown-menu-group/dropdown-menu-group.vue'
  import DropdownMenuItem from '../../../navigation/dropdown-menu/dropdown-menu-item/dropdown-menu-item.vue'
  import DropdownMenuTrigger from '../../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'

  defineOptions({
    name: 'ConversationHistoryProjectSort',
    inheritAttrs: false
  })

  const model = defineModel<'recent' | 'name'>({ default: 'recent' })

  const attrs = useAttrs()
  const { t } = useTranslate({ conversationHistory: en.conversationHistory })

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'conversation-history-project-sort'
  })

  const onSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'recent' || value === 'name') model.value = value
  }
</script>

<template>
  <DropdownMenu
    align="end"
    @select="onSelect"
  >
    <DropdownMenuTrigger>
      <IconButton
        icon="az az-sliders-horizontal"
        :ariaLabel="t('conversationHistory.organizeProjects')"
        variant="ghost"
        size="small"
        :data-testid="testId"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup :label="t('conversationHistory.sortBy')">
      <DropdownMenuItem
        type="radio"
        value="recent"
        :label="t('conversationHistory.sortRecent')"
        :selected="model === 'recent'"
      />
      <DropdownMenuItem
        type="radio"
        value="name"
        :label="t('conversationHistory.sortName')"
        :selected="model === 'name'"
      />
    </DropdownMenuGroup>
  </DropdownMenu>
</template>
