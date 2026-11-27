<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import type { UserProfileData } from './account-user-profile.user-profile-model'

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
  const details = computed(() =>
    [
      props.profile.handle && `@${props.profile.handle}`,
      props.profile.location,
      props.profile.memberSince && `On Azion since ${props.profile.memberSince}`
    ].filter((detail): detail is string => Boolean(detail))
  )
</script>

<template>
  <header
    class="flex min-w-0 items-center gap-(--spacing-sm) @5xl/profile:flex-col @5xl/profile:items-start"
  >
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
        <h1 class="text-heading-sm text-(--text-default) @5xl/profile:text-heading-md">
          {{ fullName }}
        </h1>
        <Tag :label="profile.role" />
      </div>
      <Skeleton
        key="skeleton-3"
        v-if="loading"
        width="16rem"
        height="1rem"
      />
      <ul
        v-else
        class="flex min-w-0 flex-wrap text-body-sm text-(--text-muted) @5xl/profile:flex-col @5xl/profile:gap-(--spacing-2xs)"
      >
        <li
          v-for="(detail, index) in details"
          :key="detail"
          :data-listed="index > 0 || null"
          class="not-last:after:px-(--spacing-2xs) not-last:after:content-['·'_/_''] @5xl/profile:not-last:after:hidden @5xl/profile:data-[listed]:hidden"
        >
          {{ detail }}
        </li>
      </ul>
      <p
        v-if="!loading && profile.bio"
        class="hidden text-body-sm text-(--text-default) @5xl/profile:block"
      >
        {{ profile.bio }}
      </p>
    </div>
  </header>
</template>
