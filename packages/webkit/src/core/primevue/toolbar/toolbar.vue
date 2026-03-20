<script setup>
import Toolbar from 'primevue/toolbar'

defineOptions({ name: 'Toolbar' })

const props = defineProps({
  class: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <Toolbar :class="props.class">
    <template v-if="$slots.start" #start>
      <slot name="start" />
    </template>
    <template v-if="$slots.center" #center>
      <slot name="center" />
    </template>
    <template v-if="$slots.end" #end>
      <slot name="end" />
    </template>
  </Toolbar>
</template>
