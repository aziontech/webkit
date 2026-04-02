<script setup>
import TabMenu from 'primevue/tabmenu'

defineOptions({ name: 'TabMenu' })

const props = defineProps({
  model: {
    type: Array,
    default: () => []
  },
  activeIndex: {
    type: Number,
    default: undefined
  },
  exact: {
    type: Boolean,
    default: true
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

const emit = defineEmits(['tab-change'])
</script>

<template>
  <TabMenu
    :model="props.model"
    :activeIndex="props.activeIndex"
    :exact="props.exact"
    :class="props.class"
    :pt="props.pt"
    @tab-change="emit('tab-change', $event)"
  >
    <template v-if="$slots.item" #item="slotProps">
      <slot name="item" :item="slotProps.item" :index="slotProps.index" />
    </template>
  </TabMenu>
</template>
