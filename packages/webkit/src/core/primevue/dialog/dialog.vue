<script setup>
import Dialog from 'primevue/dialog'

defineOptions({ name: 'Dialog' })

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  header: {
    type: String,
    default: undefined
  },
  modal: {
    type: Boolean,
    default: false
  },
  contentClass: {
    type: String,
    default: undefined
  },
  rtl: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  breakpoints: {
    type: Object,
    default: undefined
  },
  class: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:visible', 'hide', 'show', 'maximize', 'unmaximize'])
</script>

<template>
  <Dialog
    :visible="props.visible"
    :header="props.header"
    :modal="props.modal"
    :contentClass="props.contentClass"
    :rtl="props.rtl"
    :closable="props.closable"
    :closeOnEscape="props.closeOnEscape"
    :showHeader="props.showHeader"
    :breakpoints="props.breakpoints"
    :class="props.class"
    @update:visible="emit('update:visible', $event)"
    @hide="emit('hide')"
    @show="emit('show')"
    @maximize="emit('maximize', $event)"
    @unmaximize="emit('unmaximize', $event)"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots.default" #default>
      <slot />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
    <template v-if="$slots.maximizeicon" #maximizeicon>
      <slot name="maximizeicon" />
    </template>
    <template v-if="$slots.closeicon" #closeicon>
      <slot name="closeicon" />
    </template>
  </Dialog>
</template>
