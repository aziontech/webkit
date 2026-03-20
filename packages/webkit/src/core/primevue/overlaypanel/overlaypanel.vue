<script setup>
import OverlayPanel from 'primevue/overlaypanel'

defineOptions({ name: 'OverlayPanel' })

const props = defineProps({
  dismissable: {
    type: Boolean,
    default: true
  },
  showCloseIcon: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['show', 'hide'])
</script>

<template>
  <OverlayPanel
    :dismissable="props.dismissable"
    :showCloseIcon="props.showCloseIcon"
    :class="props.class"
    @show="emit('show')"
    @hide="emit('hide')"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </OverlayPanel>
</template>
