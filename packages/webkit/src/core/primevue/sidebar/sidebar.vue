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
    blockScroll: {
      type: Boolean,
      default: false
    },
    class: {
      type: String,
      default: ''
    },
    pt: {
      type: Object,
      default: undefined
    },
    header: {
      type: String,
      default: undefined
    },
    headerContent: {
      type: String,
      default: undefined
    },
    dismissableMask: {
      type: Boolean,
      default: false
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
    :blockScroll="props.blockScroll"
    :class="props.class"
    :pt="props.pt"
    :header="props.header"
    :headerContent="props.headerContent"
    :dismissableMask="props.dismissableMask"
    @update:visible="emit('update:visible', $event)"
    @hide="emit('hide')"
    @show="emit('show')"
  >
    <template
      v-if="$slots.header"
      #header
    >
      <slot name="header" />
    </template>
    <template
      v-if="$slots.default"
      #default
    >
      <slot />
    </template>
    <template
      v-if="$slots.closeicon"
      #closeicon
    >
      <slot name="closeicon" />
    </template>
    <template
      v-if="$slots.container"
      #container
    >
      <slot name="container" />
    </template>
  </Sidebar>
</template>
