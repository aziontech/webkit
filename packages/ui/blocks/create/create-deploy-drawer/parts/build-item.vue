<script setup lang="ts">
  import Item from '@aziontech/ui/item'
  import Spinner from '@aziontech/ui/spinner'
  import Tag from '@aziontech/ui/tag'

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
      <Item.Description
        >Building… Project and environment unlock when the build finishes.</Item.Description
      >
    </Item.Content>
    <Item.Actions>
      <span
        class="whitespace-nowrap font-(family-name:--font-code) text-label-sm tabular-nums text-(--text-muted)"
        data-testid="build-item__elapsed"
      >
        {{ build.elapsed }} s
      </span>
      <span class="flex size-4 shrink-0 text-(--text-default)">
        <Spinner class="w-full" />
      </span>
    </Item.Actions>
  </Item>
</template>
