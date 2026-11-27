<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import IconButton from '@aziontech/ui/icon-button'
  import Item from '@aziontech/ui/item-root'
  import Popover from '@aziontech/ui/popover'
  import Tooltip from '@aziontech/ui/tooltip'

  import type { QueryEntry } from '../lib/event-query'

  export interface RecentQueriesProps {
    /** The last queries run, newest first. */
    entries: QueryEntry[]
  }

  defineProps<RecentQueriesProps>()

  const emit = defineEmits<{
    apply: [entry: QueryEntry]
    clear: []
  }>()

  const open = defineModel<boolean>('open', { required: true })
</script>

<template>
  <Popover
    v-model:open="open"
    side="bottom"
    align="end"
    size="small"
  >
    <Popover.Trigger>
      <Tooltip content="Recent queries">
        <IconButton
          icon="az az-history"
          variant="outline"
          size="medium"
          aria-label="Recent queries"
          data-testid="recent-queries__trigger"
        />
      </Tooltip>
    </Popover.Trigger>
    <Popover.Content>
      <div
        class="flex flex-col gap-(--spacing-xs) p-(--spacing-2xs)"
        data-testid="recent-queries"
      >
        <h2 class="px-(--spacing-xs) pt-(--spacing-2xs) text-label-sm text-(--text-muted)">
          Recent queries
        </h2>
        <ul
          v-if="entries.length"
          class="flex flex-col"
          aria-label="Recent queries"
        >
          <li
            v-for="entry in entries"
            :key="entry.text"
          >
            <Item
              clickable
              variant="option"
              data-testid="recent-queries__apply"
              @click="emit('apply', entry)"
            >
              <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                <i
                  class="az az-history shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="min-w-0 flex-1 truncate text-label-code-sm text-(--text-default)">
                  {{ entry.text }}
                </span>
              </span>
            </Item>
          </li>
        </ul>
        <p
          v-else
          class="px-(--spacing-xs) text-body-sm text-(--text-muted)"
        >
          Queries you run appear here.
        </p>
        <div
          v-if="entries.length"
          class="border-t border-(--border-default) pt-(--spacing-2xs)"
        >
          <Button
            label="Clear history"
            variant="ghost"
            size="small"
            data-testid="recent-queries__clear"
            @click="emit('clear')"
          />
        </div>
      </div>
    </Popover.Content>
  </Popover>
</template>
