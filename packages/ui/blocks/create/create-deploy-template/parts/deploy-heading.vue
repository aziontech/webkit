<script setup lang="ts">
  export interface DeployHeadingProps {
    /** The project deploys once, from uploaded files, instead of on every push of a repository. */
    once?: boolean
  }

  withDefaults(defineProps<DeployHeadingProps>(), { once: false })
</script>

<template>
  <div class="flex flex-col gap-(--spacing-2xs)">
    <h2 class="text-title-sm text-(--text-default)">Deploy your project</h2>
    <p
      v-if="once"
      class="text-body-sm text-pretty text-(--text-muted)"
    >
      These files deploy once. Connect a Git provider later to ship every push automatically.
    </p>
    <p
      v-else
      class="text-body-sm text-pretty text-(--text-muted)"
    >
      This repository deploys on every push, automatically.
    </p>
  </div>
</template>
