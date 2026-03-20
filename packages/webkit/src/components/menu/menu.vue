<script setup>
import Menu from 'primevue/menu'

defineOptions({ name: 'Menu' })

const props = defineProps({
  model: {
    type: Array,
    default: () => []
  },
  popup: {
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
  <Menu
    :model="props.model"
    :popup="props.popup"
    :class="props.class"
    @show="emit('show')"
    @hide="emit('hide')"
  >
    <template v-if="$slots.start" #start>
      <slot name="start" />
    </template>
    <template v-if="$slots.end" #end>
      <slot name="end" />
    </template>
    <template v-if="$slots.item" #item="slotProps">
      <slot name="item" :item="slotProps.item" />
    </template>
    <template v-if="$slots.submenuheader" #submenuheader="slotProps">
      <slot name="submenuheader" :item="slotProps.item" />
    </template>
  </Menu>
</template>
