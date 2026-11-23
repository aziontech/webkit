<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'

  import type { ExecutiveSummaryDashboardNote } from '../dashboard-executive-summary.vue'

  export interface CommentaryCardProps {
    /** The quarter the notes belong to. */
    quarter: string
    /** The notes from the leads, newest first. */
    notes: ExecutiveSummaryDashboardNote[]
    /** The notes are loading. */
    loading: boolean
    /** Why the notes could not load. */
    error: string
  }

  defineProps<CommentaryCardProps>()
</script>

<template>
  <Card
    title="Commentary"
    :padded="error !== ''"
  >
    <template #default>
      <p
        v-if="error"
        class="text-body-sm text-(--text-muted)"
      >
        Not available.
      </p>
      <Item.List
        v-else-if="loading"
        key="item.list-1"
        aria-busy="true"
      >
        <Item
          v-for="index in 3"
          :key="index"
          size="small"
          role="listitem"
        >
          <Item.Media>
            <Skeleton
              variant="circle"
              width="2rem"
              height="2rem"
            />
          </Item.Media>
          <Item.Content>
            <div class="flex flex-col gap-(--spacing-xs)">
              <Skeleton
                width="45%"
                height="1rem"
              />
              <Skeleton height="2.5rem" />
            </div>
          </Item.Content>
        </Item>
      </Item.List>
      <Item.List
        key="item.list-2"
        v-else-if="notes.length"
      >
        <Item
          v-for="note in notes"
          :key="note.id"
          size="small"
          role="listitem"
        >
          <Item.Media>
            <Avatar
              :label="note.initials"
              size="medium"
            />
          </Item.Media>
          <Item.Content>
            <Item.Title>{{ note.author }}</Item.Title>
            <Item.Description>
              {{ note.role }} · <time :datetime="note.date">{{ note.dateLabel }}</time>
            </Item.Description>
            <p class="mt-(--spacing-xs) text-pretty text-body-sm text-(--text-default)">
              {{ note.body }}
            </p>
          </Item.Content>
        </Item>
      </Item.List>
      <EmptyState
        v-else
        size="small"
        icon="az az-comment"
        :title="'No notes for ' + quarter"
        description="Leads add notes here when they review the quarter."
      />
    </template>
  </Card>
</template>
