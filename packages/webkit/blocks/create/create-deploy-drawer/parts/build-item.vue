<script setup lang="ts">
  import Item from '@aziontech/webkit/item'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'

  import type { DeployDrawerBuild } from '../types'

  export interface BuildItemProps {
    /** The build in progress. */
    build: DeployDrawerBuild
  }

  defineProps<BuildItemProps>()
</script>

<template>
  <Item
    variant="outline"
    size="small"
    aria-live="polite"
  >
    <Item.Media>
      <span
        class="flex size-7 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
      >
        <i
          class="az az-server text-body-xs text-(--text-default)"
          aria-hidden="true"
        />
      </span>
    </Item.Media>
    <Item.Content>
      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
        <Item.Title>{{ build.name }}</Item.Title>
        <Tag
          :label="build.version"
          severity="neutral"
          size="small"
          class="shrink-0"
        />
      </span>
      <Item.Description>Building…</Item.Description>
    </Item.Content>
    <Item.Actions>
      <span class="font-(family-name:--font-code) text-label-sm tabular-nums text-(--text-muted)">
        {{ build.elapsed }} s
      </span>
      <div class="contents text-(--text-default)">
        <Spinner class="shrink-0" />
      </div>
    </Item.Actions>
  </Item>
</template>
