<script setup>
  import ConfirmDialog from 'primevue/confirmdialog'

  defineOptions({ name: 'ConfirmDialog' })

  const props = defineProps({
    group: {
      type: String,
      default: undefined
    },
    breakpoints: {
      type: Object,
      default: undefined
    }
  })
</script>

<template>
  <ConfirmDialog
    :group="props.group"
    :breakpoints="props.breakpoints"
  >
    <template
      v-if="$slots.message"
      #message="slotProps"
    >
      <slot
        name="message"
        v-bind="slotProps"
      />
    </template>
  </ConfirmDialog>
</template>
