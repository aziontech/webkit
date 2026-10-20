<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import { relativeTime } from '../../lib/format/relative-time'

  interface Props {
    author?: string
    avatarSrc?: string
    date?: string | Date
  }

  const props = withDefaults(defineProps<Props>(), {
    author: '',
    avatarSrc: '',
    date: ''
  })

  const displayName = computed(() => {
    const raw = props.author.trim()
    if (!raw) return ''
    const local = raw.includes('@') ? raw.slice(0, raw.indexOf('@')) : raw
    return local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  })

  const relative = computed(() => relativeTime(props.date))
</script>

<template>
  <div
    v-if="displayName || relative"
    class="flex min-w-0 items-center gap-(--spacing-xs)"
  >
    <Tooltip
      v-if="displayName"
      :text="displayName"
    >
      <Avatar
        :src="avatarSrc || undefined"
        :alt="displayName"
        :label="displayName"
        size="small"
        kind="square"
      />
    </Tooltip>
    <span class="truncate text-body-sm text-(--text-muted)">{{ relative }}</span>
  </div>
</template>
