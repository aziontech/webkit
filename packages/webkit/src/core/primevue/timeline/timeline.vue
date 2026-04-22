<script setup>
  import Timeline from 'primevue/timeline'

  defineOptions({ name: 'Timeline' })

  const props = defineProps({
    value: {
      type: Array,
      default: () => []
    },
    align: {
      type: String,
      default: 'left',
      validator: (val) => ['left', 'right', 'alternate'].includes(val)
    },
    layout: {
      type: String,
      default: 'vertical',
      validator: (val) => ['vertical', 'horizontal'].includes(val)
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
</script>

<template>
  <Timeline
    :value="props.value"
    :align="props.align"
    :layout="props.layout"
    :class="props.class"
    :pt="props.pt"
  >
    <template
      v-if="$slots.content"
      #content="slotProps"
    >
      <slot
        name="content"
        :item="slotProps.item"
        :index="slotProps.index"
      />
    </template>
    <template
      v-if="$slots.opposite"
      #opposite="slotProps"
    >
      <slot
        name="opposite"
        :item="slotProps.item"
        :index="slotProps.index"
      />
    </template>
    <template
      v-if="$slots.marker"
      #marker="slotProps"
    >
      <slot
        name="marker"
        :item="slotProps.item"
        :index="slotProps.index"
      />
    </template>
    <template
      v-if="$slots.connector"
      #connector="slotProps"
    >
      <slot
        name="connector"
        :item="slotProps.item"
        :index="slotProps.index"
      />
    </template>
  </Timeline>
</template>
