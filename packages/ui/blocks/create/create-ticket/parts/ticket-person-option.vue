<script setup lang="ts">
  import Avatar, { type AvatarPresence } from '@aziontech/ui/avatar'

  export interface TicketPersonOptionProps {
    /** The person's or the team's name. */
    name: string
    /** A muted second line, such as an email address or the agent's groups. */
    detail?: string
    /** Whether the person is reachable now; empty when unknown or for a team. */
    presence?: AvatarPresence | ''
    /** Draws a square mark, for a team rather than a person. */
    team?: boolean
  }

  withDefaults(defineProps<TicketPersonOptionProps>(), {
    detail: '',
    presence: '',
    team: false
  })
</script>

<template>
  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
    <Avatar
      :label="name"
      :alt="name"
      :presence="presence"
      :variant="team ? 'square' : 'circle'"
      size="small"
    />
    <span class="flex min-w-0 flex-col">
      <span
        class="truncate text-label-sm text-(--text-default)"
        dir="auto"
        >{{ name }}</span
      >
      <span
        v-if="detail"
        class="truncate text-body-sm text-(--text-muted)"
        dir="auto"
        >{{ detail }}</span
      >
    </span>
  </span>
</template>
