<script setup lang="ts">
  import { useAuthEntrance } from '../../lib/behavior/auth-entrance'
  import AuthShell from './AuthShell.vue'

  defineSlots<{
    default(): unknown
  }>()

  const { entered, leadStyle } = useAuthEntrance()
</script>

<template>
  <AuthShell>
    <div class="layout-column-site flex flex-1 flex-col lg:min-h-0">
      <div class="flex flex-1 flex-col py-(--spacing-xl) lg:min-h-0 lg:overflow-y-auto">
        <div
          :data-entered="entered || null"
          :style="leadStyle"
          class="m-auto flex w-full -translate-x-6 flex-col items-center gap-(--spacing-md) opacity-0 data-entered:translate-x-0 data-entered:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none"
        >
          <slot />
        </div>
      </div>
    </div>
  </AuthShell>
</template>
