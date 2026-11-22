<script setup lang="ts">
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Skeleton from '@aziontech/webkit/skeleton'
</script>

<template>
  <div
    class="flex min-w-0 flex-col"
    aria-busy="true"
  >
    <SettingsGroup
      label="Resources"
      hint="The service version this deployment sends live, and the version of every module and integration it references."
    >
      <div aria-hidden="true">
        <Skeleton height="var(--size-40)" />
      </div>
    </SettingsGroup>

    <SettingsGroup
      label="Environment"
      hint="Where the deployment goes live, from the environments this project serves. Each one goes live with the Deployment Settings set on the project."
    >
      <div
        class="flex min-w-0 flex-col gap-(--spacing-xs)"
        aria-hidden="true"
      >
        <Skeleton
          v-for="row in 2"
          :key="row"
          height="var(--size-16)"
        />
      </div>
    </SettingsGroup>

    <span
      class="sr-only"
      role="status"
    >
      Loading the resources and environments for this deployment.
    </span>
  </div>
</template>
