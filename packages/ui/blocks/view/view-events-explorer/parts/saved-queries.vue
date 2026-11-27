<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import IconButton from '@aziontech/ui/icon-button'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item-root'
  import Popover from '@aziontech/ui/popover'
  import Tooltip from '@aziontech/ui/tooltip'

  import type { SavedQuery } from '../lib/event-query'

  export interface SavedQueriesProps {
    /** The saved queries, in order. */
    entries: SavedQuery[]
    /** What the last action did. */
    status: string
    /** A name is typed and a query is applied. */
    canSave: boolean
  }

  defineProps<SavedQueriesProps>()

  const emit = defineEmits<{
    apply: [entry: SavedQuery]
    delete: [entry: SavedQuery]
    save: []
  }>()

  const open = defineModel<boolean>('open', { required: true })
  const name = defineModel<string>('name', { required: true })
</script>

<template>
  <Popover
    v-model:open="open"
    side="bottom"
    align="end"
    size="small"
  >
    <Popover.Trigger>
      <Tooltip content="Saved queries">
        <IconButton
          icon="az az-bookmark"
          variant="outline"
          size="medium"
          aria-label="Saved queries"
          data-testid="saved-queries__trigger"
        />
      </Tooltip>
    </Popover.Trigger>
    <Popover.Content>
      <div
        class="flex flex-col gap-(--spacing-xs) p-(--spacing-2xs)"
        data-testid="saved-queries"
      >
        <h2 class="px-(--spacing-xs) pt-(--spacing-2xs) text-label-sm text-(--text-muted)">
          Saved queries
        </h2>
        <ul
          v-if="entries.length"
          class="flex flex-col"
          aria-label="Saved queries"
        >
          <li
            v-for="entry in entries"
            :key="entry.id"
            class="flex min-w-0 items-center gap-(--spacing-2xs)"
          >
            <Item
              clickable
              variant="option"
              class="min-w-0 flex-1"
              data-testid="saved-queries__apply"
              @click="emit('apply', entry)"
            >
              <span class="flex min-w-0 flex-1 flex-col items-start">
                <span class="max-w-full truncate text-label-sm text-(--text-default)">
                  {{ entry.name }}
                </span>
                <span class="max-w-full truncate text-label-code-sm text-(--text-muted)">
                  {{ entry.text }}
                </span>
              </span>
            </Item>
            <Tooltip content="Delete">
              <IconButton
                icon="az az-trash"
                variant="ghost"
                size="small"
                :aria-label="`Delete ${entry.name}`"
                data-testid="saved-queries__delete"
                @click="emit('delete', entry)"
              />
            </Tooltip>
          </li>
        </ul>
        <p
          v-else
          class="px-(--spacing-xs) text-body-sm text-(--text-muted)"
        >
          No saved queries yet. Name the current query to keep it.
        </p>
        <div
          class="flex items-center gap-(--spacing-xs) border-t border-(--border-default) px-(--spacing-2xs) pt-(--spacing-xs)"
        >
          <div class="min-w-0 flex-1">
            <Input
              v-model="name"
              size="small"
              placeholder="Name the current query"
              aria-label="Name for the current query"
              class="w-full"
              data-testid="saved-queries__name"
              @keydown.enter.prevent="emit('save')"
            />
          </div>
          <Button
            label="Save"
            variant="secondary"
            size="small"
            :disabled="!canSave"
            data-testid="saved-queries__save"
            @click="emit('save')"
          />
        </div>
        <p
          role="status"
          class="sr-only"
        >
          {{ status }}
        </p>
      </div>
    </Popover.Content>
  </Popover>
</template>
