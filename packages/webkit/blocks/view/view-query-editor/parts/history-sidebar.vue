<script setup lang="ts">
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item-root'
  import Sidebar from '@aziontech/webkit/sidebar-root'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import { SIDEBAR_FRAME_CLASS } from '../lib/sidebar-frame'
  import type { QueryEditorHistoryEntry } from '../types'

  export interface HistorySidebarProps {
    /** Past queries, newest first. */
    history: QueryEditorHistoryEntry[]
  }

  const props = defineProps<HistorySidebarProps>()

  const emit = defineEmits<{
    load: [item: QueryEditorHistoryEntry]
    'history-action': [event: Event, value: unknown, item: QueryEditorHistoryEntry]
  }>()

  /** The panel width, in pixels. */
  const width = defineModel<number>('width', { required: true })

  /** Whether the panel is open. */
  const open = defineModel<boolean>('open', { required: true })

  const historySearch = ref('')
  const filteredHistory = computed(() => {
    const term = historySearch.value.trim().toLowerCase()
    if (!term) return props.history
    return props.history.filter((item) => item.sql.toLowerCase().includes(term))
  })
  const oneLine = (sql: string) => sql.replace(/\s+/g, ' ').trim()
</script>

<template>
  <div :class="SIDEBAR_FRAME_CLASS">
    <Sidebar
      v-model:width="width"
      v-model:open="open"
      resizable
      collapsible
      aria-label="Query history"
      collapse-aria-label="Hide the query history"
      expand-aria-label="Show the query history"
      resize-aria-label="Resize the query history panel"
    >
      <template #header>
        <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-xs)">
          <span class="text-heading-2xs text-(--text-default)">Query history</span>
          <Input
            v-model="historySearch"
            size="medium"
            class="w-full"
            placeholder="Search queries"
            aria-label="Search queries"
          >
            <template #leading>
              <i
                class="az az-search"
                aria-hidden="true"
              />
            </template>
          </Input>
        </div>
      </template>
      <div>
        <p
          v-if="!filteredHistory.length"
          class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
        >
          No queries yet
        </p>
        <div
          v-else
          class="flex flex-col gap-(--spacing-2xs)"
        >
          <div
            v-for="item in filteredHistory"
            :key="item.id"
            class="flex items-center gap-(--spacing-2xs)"
          >
            <Item
              clickable
              variant="option"
              class="min-w-0 flex-1"
              :title="oneLine(item.sql)"
              @click="emit('load', item)"
            >
              <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                <span class="min-w-0 truncate font-code text-label-code-sm">{{
                  oneLine(item.sql)
                }}</span>
              </span>
            </Item>
            <DropdownMenu
              side="bottom"
              align="end"
              @select="(event, value) => emit('history-action', event, value, item)"
            >
              <DropdownMenu.Trigger>
                <Tooltip :content="`Actions for ${oneLine(item.sql)}`">
                  <IconButton
                    icon="az az-ellipsis"
                    variant="ghost"
                    size="small"
                    :aria-label="`Actions for ${oneLine(item.sql)}`"
                  />
                </Tooltip>
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Item
                  value="run"
                  label="Run query"
                >
                  <template #leading
                    ><i
                      class="az az-play"
                      aria-hidden="true"
                  /></template>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  value="delete"
                  label="Delete query"
                  severity="danger"
                >
                  <template #leading
                    ><i
                      class="az az-trash"
                      aria-hidden="true"
                  /></template>
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Sidebar>
  </div>
</template>
