<script setup>
import Sidebar from 'primevue/sidebar'

defineOptions({ name: 'Sidebar' })

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'left',
    validator: (val) => ['left', 'right', 'top', 'bottom'].includes(val)
  },
  baseZIndex: {
    type: Number,
    default: 0
  },
  autoZIndex: {
    type: Boolean,
    default: true
  },
  dismissable: {
    type: Boolean,
    default: true
  },
  showCloseIcon: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  class: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:visible', 'hide', 'show'])
</script>

<template>
  <Sidebar
    :visible="props.visible"
    :position="props.position"
    :baseZIndex="props.baseZIndex"
    :autoZIndex="props.autoZIndex"
    :dismissable="props.dismissable"
    :showCloseIcon="props.showCloseIcon"
    :closeOnEscape="props.closeOnEscape"
    :class="props.class"
    @update:visible="emit('update:visible', $event)"
    @hide="emit('hide')"
    @show="emit('show')"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots.default" #default>
      <slot />
    </template>
    <template v-if="$slots.closeicon" #closeicon>
      <slot name="closeicon" />
    </template>
  </Sidebar>
</template>
