<script setup>
  import Divider from 'primevue/divider'

  defineOptions({ name: 'Divider' })

  const props = defineProps({
    align: {
      type: String,
      default: undefined,
      validator: (val) => ['left', 'center', 'right'].includes(val)
    },
    layout: {
      type: String,
      default: 'horizontal',
      validator: (val) => ['horizontal', 'vertical'].includes(val)
    },
    type: {
      type: String,
      default: 'solid',
      validator: (val) => ['solid', 'dashed', 'dotted'].includes(val)
    },
    class: {
      type: String,
      default: ''
    }
  })
</script>

<template>
  <Divider
    :align="props.align"
    :layout="props.layout"
    :type="props.type"
    :class="props.class"
  >
    <template
      v-if="$slots.default"
      #default
    >
      <slot />
    </template>
  </Divider>
</template>
