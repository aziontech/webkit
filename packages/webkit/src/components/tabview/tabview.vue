<script setup>
import TabView from 'primevue/tabview'

defineOptions({ name: 'TabView' })

const props = defineProps({
  activeIndex: {
    type: Number,
    default: 0
  },
  lazy: {
    type: Boolean,
    default: false
  },
  scrollable: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['tab-change', 'tab-click'])
</script>

<template>
  <TabView
    :activeIndex="props.activeIndex"
    :lazy="props.lazy"
    :scrollable="props.scrollable"
    :class="props.class"
    @tab-change="emit('tab-change', $event)"
    @tab-click="emit('tab-click', $event)"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </TabView>
</template>
