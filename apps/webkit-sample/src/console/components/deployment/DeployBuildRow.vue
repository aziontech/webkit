<script setup lang="ts">
  import Item from '@aziontech/webkit/item'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'

  interface Props {
    name?: string
    version?: string
    elapsed?: number
  }

  withDefaults(defineProps<Props>(), {
    name: '',
    version: '',
    elapsed: 0
  })
</script>

<template>
  <Item
    kind="outline"
    size="small"
    aria-live="polite"
  >
    <Item.Media>
      <span
        class="flex size-7 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
      >
        <i
          class="ai ai-edge-application text-body-xs text-(--text-default)"
          aria-hidden="true"
        />
      </span>
    </Item.Media>
    <Item.Content>
      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
        <Item.Title class="truncate">{{ name }}</Item.Title>
        <Tag
          v-if="version"
          :label="version"
          severity="secondary"
          size="small"
          class="shrink-0"
        />
      </span>
      <Item.Description>Building…</Item.Description>
    </Item.Content>
    <Item.Actions class="gap-(--spacing-xs)">
      <span class="font-(family-name:--font-code) text-label-sm tabular-nums text-(--text-muted)">
        {{ elapsed }} s
      </span>
      <Spinner class="size-6 shrink-0 text-(--text-default)" />
    </Item.Actions>
  </Item>
</template>
