<script setup>
  import OverlayPanel from 'primevue/overlaypanel'
  import { ref } from 'vue'

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
    appendTo: {
      type: [String, Object],
      default: 'body'
    },
    class: {
      type: String,
      default: ''
    },
    pt: {
      type: Object,
      default: undefined
    }
  })

  const emit = defineEmits(['show', 'hide'])

  const panelRef = ref(null)

  defineExpose({
    toggle: (...args) => panelRef.value?.toggle(...args),
    show: (...args) => panelRef.value?.show(...args),
    hide: (...args) => panelRef.value?.hide(...args)
  })
</script>

<template>
  <OverlayPanel
    ref="panelRef"
    :dismissable="props.dismissable"
    :showCloseIcon="props.showCloseIcon"
    :appendTo="props.appendTo"
    :class="props.class"
    :pt="props.pt"
    @show="emit('show')"
    @hide="emit('hide')"
  >
    <template
      v-if="$slots.default"
      #default
    >
      <slot />
    </template>
  </OverlayPanel>
</template>
