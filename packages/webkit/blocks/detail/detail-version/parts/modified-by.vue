<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Tooltip from '@aziontech/webkit/tooltip'

  export interface ModifiedByProps {
    /** Who made the last change; the avatar names them in a tooltip. */
    author: string
    /** When the last change was made, already formatted. */
    modifiedAgo: string
  }

  defineProps<ModifiedByProps>()
</script>

<template>
  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
    <Tooltip :content="author">
      <Avatar
        :alt="author"
        :label="author"
        size="small"
        variant="square"
      />
    </Tooltip>
    <span class="truncate text-body-sm text-(--text-muted)">{{ modifiedAgo }}</span>
  </div>
</template>
