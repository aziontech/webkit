<script setup lang="ts">
  import Avatar from '@aziontech/ui/avatar'
  import Tooltip from '@aziontech/ui/tooltip'
  import { useLocale } from '@aziontech/ui/use-locale'
  import { computed } from 'vue'

  export interface ModifiedByProps {
    /** Who made the last change; the avatar names them in a tooltip. */
    author: string
    /** When the last change was made, as an ISO 8601 string; shown as a relative time. */
    modifiedAt: string
  }

  const props = defineProps<ModifiedByProps>()

  const { formatRelativeTime } = useLocale()
  const modifiedAgo = computed(() =>
    props.modifiedAt ? formatRelativeTime(new Date(props.modifiedAt)) : ''
  )
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
