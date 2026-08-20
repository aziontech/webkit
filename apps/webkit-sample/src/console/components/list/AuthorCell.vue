<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import { computed } from 'vue'

  // The LAST EDITOR cell — the person who last changed the record, as a face and a
  // name on one line.
  //
  // This column exists because the console (azion-console-kit) ships `Last Editor` as
  // its own column on every module list, and a reader scanning for "who touched this"
  // should not have to hover a row to find out. Before it, the person was folded into
  // the Last Modified cell as an avatar whose only label was a tooltip — legible when
  // you already suspected it was there, invisible when you were scanning for it, and
  // unreachable for anyone not using a pointer.
  //
  // The two halves are now split the way the console splits them: this cell says WHO,
  // ./LastModifiedCell.vue says WHEN. That is also why LastModifiedCell is no longer
  // passed an `author` — with both on the row, the same face rendered twice, once
  // labelled and once not.
  //
  // The name is rendered as text, not as a tooltip, so it survives a keyboard reader
  // and a text search of the page. The avatar keeps its initials fallback for the rows
  // whose person has no photo.
  const props = defineProps({
    /** Person who last changed the record — a name ("Maria Silva") or email ("maria.silva@azion.com"). */
    author: { type: String, default: '' },
    /** Optional avatar photo URL. Falls back to the author's initials when unset or the image fails to load. */
    avatarSrc: { type: String, default: '' }
  })

  // Emails and dotted handles → a readable name ("maria.silva@azion.com" → "Maria Silva").
  // Same normalization as ./LastModifiedCell.vue, so a row that shows a person in one
  // column cannot spell them differently in the other.
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
