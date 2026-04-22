<script setup>
  import Breadcrumb from 'primevue/breadcrumb'

  defineOptions({ name: 'Breadcrumb' })

  const props = defineProps({
    model: {
      type: Array,
      default: () => []
    },
    home: {
      type: Object,
      default: undefined
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
  <Breadcrumb
    :model="props.model"
    :home="props.home"
    :class="props.class"
    :pt="props.pt"
  >
    <template
      v-if="$slots.item"
      #item="slotProps"
    >
      <slot
        name="item"
        :item="slotProps.item"
        :label="slotProps.label"
        :props="slotProps.props"
      />
    </template>
  </Breadcrumb>
</template>
