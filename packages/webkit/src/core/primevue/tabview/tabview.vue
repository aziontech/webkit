<script setup>
  import TabView from 'primevue/tabview'

  defineOptions({
    name: 'TabView',
    inheritAttrs: false
  })

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
    }
  })

  const emit = defineEmits(['tab-change', 'tab-click'])
</script>

<template>
  <TabView
    v-bind="$attrs"
    :active-index="props.activeIndex"
    :lazy="props.lazy"
    :scrollable="props.scrollable"
    @tab-change="emit('tab-change', $event)"
    @tab-click="emit('tab-click', $event)"
  >
    <template
      v-if="$slots.default"
      #default
    >
      <slot />
    </template>
  </TabView>
</template>
