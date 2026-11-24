<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item-root'
  import Sidebar from '@aziontech/webkit/sidebar-root'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import { SIDEBAR_FRAME_CLASS } from '../lib/sidebar-frame'
  import type { QueryEditorTable } from '../types'

  export interface TablesSidebarProps {
    /** The tables of the database. */
    tables: QueryEditorTable[]
    /** The table the pane shows. */
    selected: QueryEditorTable | null
    /** The tables are loading: skeleton lines hold the panel. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<TablesSidebarProps>(), { loading: false })

  const emit = defineEmits<{
    select: [id: string]
    'table-action': [event: Event, value: unknown, table: QueryEditorTable]
    'refresh-tables': [event: MouseEvent]
    'create-table': [event: MouseEvent]
  }>()

  /** The panel width, in pixels. */
  const width = defineModel<number>('width', { required: true })

  /** Whether the panel is open. */
  const open = defineModel<boolean>('open', { required: true })

  const tableSearch = ref('')
  const filteredTables = computed(() => {
    const term = tableSearch.value.trim().toLowerCase()
    if (!term) return props.tables
    return props.tables.filter((table) => table.name.toLowerCase().includes(term))
  })
</script>

<template>
  <div :class="SIDEBAR_FRAME_CLASS">
    <Sidebar
      v-model:width="width"
      v-model:open="open"
      resizable
      collapsible
      aria-label="Tables"
      collapse-aria-label="Hide the tables panel"
      expand-aria-label="Show the tables panel"
      resize-aria-label="Resize the tables panel"
    >
      <template #header>
        <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-xs)">
          <div class="flex items-center justify-between gap-(--spacing-xs)">
            <span class="text-heading-2xs text-(--text-default)">Tables</span>
            <div class="flex items-center gap-(--spacing-2xs)">
              <Tooltip content="Refresh tables">
                <IconButton
                  icon="az az-refresh"
                  variant="outline"
                  size="small"
                  aria-label="Refresh tables"
                  @click="(event: MouseEvent) => emit('refresh-tables', event)"
                />
              </Tooltip>
              <Tooltip content="Create Table">
                <IconButton
                  icon="az az-plus"
                  variant="outline"
                  size="small"
                  aria-label="Create Table"
                  @click="(event: MouseEvent) => emit('create-table', event)"
                />
              </Tooltip>
            </div>
          </div>
          <Input
            v-model="tableSearch"
            size="medium"
            class="w-full"
            placeholder="Search tables"
            aria-label="Search tables"
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
        <div
          v-if="loading"
          class="flex flex-col gap-(--spacing-xs) px-(--spacing-xs) py-(--spacing-sm)"
          role="status"
          aria-busy="true"
          aria-label="Loading tables"
        >
          <Skeleton
            v-for="line in 4"
            :key="line"
            height="1.5rem"
          />
        </div>
        <p
          v-else-if="!tables.length"
          class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
        >
          No tables created yet
        </p>
        <EmptyState
          v-else-if="!filteredTables.length"
          size="small"
          icon="az az-search"
          :title="`No tables match “${tableSearch}”`"
        >
          <template #actions>
            <Button
              label="Clear search"
              variant="outline"
              size="small"
              @click="tableSearch = ''"
            />
          </template>
        </EmptyState>
        <div
          v-else
          class="flex flex-col gap-(--spacing-2xs)"
        >
          <div
            v-for="table in filteredTables"
            :key="table.id"
            class="group flex items-center gap-(--spacing-2xs)"
          >
            <Item
              clickable
              variant="option"
              :aria-pressed="selected?.id === table.id"
              class="min-w-0 flex-1"
              @click="emit('select', table.id)"
            >
              <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                <i
                  class="az az-table shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="min-w-0 truncate text-label-sm">{{ table.name }}</span>
              </span>
            </Item>
            <DropdownMenu
              side="bottom"
              align="end"
              @select="(event, value) => emit('table-action', event, value, table)"
            >
              <DropdownMenu.Trigger>
                <Tooltip :content="`Actions for ${table.name}`">
                  <IconButton
                    icon="az az-ellipsis"
                    variant="ghost"
                    size="small"
                    :aria-label="`Actions for ${table.name}`"
                  />
                </Tooltip>
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Item
                  value="delete"
                  label="Delete table"
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
