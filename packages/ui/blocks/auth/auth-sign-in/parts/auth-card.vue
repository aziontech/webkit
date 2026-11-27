<script setup lang="ts">
  import Card from '@aziontech/ui/card'

  defineSlots<{
    /** What the card holds, padding included. */
    default(): unknown
  }>()
</script>

<template>
  <div class="flex w-full flex-col items-center">
    <Card
      class="w-full max-w-(--container-sm)"
      :padded="false"
    >
      <template #default>
        <slot />
      </template>
    </Card>
  </div>
</template>
