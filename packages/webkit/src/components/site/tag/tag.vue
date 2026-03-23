<template>
  <div
    class="rounded-md w-fit font-sora bg-neutral-800 flex justify-between items-center py-2 px-4 gap-2"
  >
    <slot
      name="icon"
      v-if="!icon"
    >
      <i
        class="pi pi-check"
        v-if="!$slots.icon"
      ></i>
    </slot>

    <span
      v-if="icon"
      :class="icon"
    ></span>

    <p class="text-white font-sora text-xs">{{ label }}</p>
  </div>
</template>

<script setup>
  defineProps({
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ''
    }
  })
</script>
