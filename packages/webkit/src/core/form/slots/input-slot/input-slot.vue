<script setup>
  defineOptions({ name: 'InputSlot' })
</script>
<template>
  <div class="flex flex-col sm:max-w-lg w-full gap-2">
    <slot />
  </div>
</template>
