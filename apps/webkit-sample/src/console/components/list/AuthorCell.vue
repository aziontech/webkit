<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import { computed } from 'vue'

  interface Props {
    author?: string
    avatarSrc?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    author: '',
    avatarSrc: ''
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
</script>

<template>
  <div
    v-if="displayName"
    class="flex min-w-0 items-center gap-(--spacing-xs)"
  >
    <Avatar
      :src="avatarSrc || undefined"
      :alt="displayName"
      :label="displayName"
      size="small"
      kind="square"
      class="shrink-0"
    />
    <span class="truncate text-body-sm text-(--text-default)">{{ displayName }}</span>
  </div>
  <span
    v-else
    class="text-body-sm text-(--text-muted)"
    >—</span
  >
</template>
