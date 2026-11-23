<script setup lang="ts">
  import ChartCard from '@aziontech/webkit/chart-card'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'

  import type { SecurityAttentionEntry } from '../dashboard-security.vue'

  export interface AttentionCardProps {
    /** The entries that need a decision. */
    attention: SecurityAttentionEntry[]
    /** The period is loading or failed; the open count is hidden. */
    blocked: boolean
    /** The period is loading. */
    loading: boolean
    /** Why the period could not load; shows a danger alert with Retry. */
    error: string
  }

  defineProps<AttentionCardProps>()
</script>

<template>
  <ChartCard :span="4">
    <ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
        <ChartCard.Title>Needs attention</ChartCard.Title>
        <Hint content="Settings and traffic on your services that ask for a decision." />
      </span>
      <ChartCard.Action v-if="!blocked">
        <Tag
          :label="`${attention.length} open`"
          severity="neutral"
          size="small"
        />
      </ChartCard.Action>
    </ChartCard.Header>
    <ChartCard.Content>
      <p
        v-if="error"
        class="text-body-sm text-(--text-muted)"
      >
        Not available.
      </p>
      <div
        v-else-if="loading"
        class="flex flex-col gap-(--spacing-md)"
      >
        <div
          v-for="row in 3"
          :key="row"
          class="flex flex-col gap-(--spacing-xs)"
        >
          <Skeleton
            width="60%"
            height="0.875rem"
          />
          <Skeleton
            width="90%"
            height="0.75rem"
          />
        </div>
      </div>
      <Item.List v-else>
        <Item
          v-for="entry in attention"
          :key="entry.id"
          role="listitem"
          variant="inline"
          size="small"
        >
          <Item.Media>
            <i
              :class="entry.icon"
              class="text-body-sm leading-none text-(--text-muted)"
              aria-hidden="true"
            />
          </Item.Media>
          <Item.Content>
            <Item.Title>{{ entry.title }}</Item.Title>
            <Item.Description>{{ entry.description }}</Item.Description>
            <span class="flex flex-wrap items-center gap-(--spacing-xs)">
              <Tag
                :label="entry.tag"
                :severity="entry.severity"
                size="small"
              />
              <Link
                :label="entry.action.label"
                :href="entry.action.href"
                size="small"
              />
            </span>
          </Item.Content>
        </Item>
      </Item.List>
    </ChartCard.Content>
  </ChartCard>
</template>
