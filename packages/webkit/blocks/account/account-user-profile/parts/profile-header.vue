<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import type { UserProfileData } from '../user-profile-model'

  export interface ProfileHeaderProps {
    /** The profile shown in the header. */
    profile: UserProfileData
    /** The profile is loading. */
    loading: boolean
  }

  const props = defineProps<ProfileHeaderProps>()

  const initials = computed(() =>
    `${props.profile.firstName.charAt(0)}${props.profile.lastName.charAt(0)}`.toUpperCase()
  )
  const fullName = computed(() => `${props.profile.firstName} ${props.profile.lastName}`.trim())
</script>

<template>
  <header class="flex min-w-0 items-center gap-(--spacing-sm)">
    <Skeleton
      v-if="loading"
      width="3rem"
      height="3rem"
      variant="circle"
    />
    <Avatar
      v-else
      :label="initials"
      :alt="fullName"
      size="large"
    />
    <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
      <Skeleton
        key="skeleton-2"
        v-if="loading"
        width="12rem"
        height="1.25rem"
      />
      <div
        v-else
        class="flex flex-wrap items-center gap-(--spacing-xs)"
      >
        <h1 class="text-heading-sm text-(--text-default)">{{ fullName }}</h1>
        <Tag :label="profile.role" />
      </div>
      <Skeleton
        key="skeleton-3"
        v-if="loading"
        width="16rem"
        height="1rem"
      />
      <p
        v-else
        class="truncate text-body-sm text-(--text-muted)"
      >
        @{{ profile.handle }} · {{ profile.location }} · On Azion since {{ profile.memberSince }}
      </p>
    </div>
  </header>
</template>
