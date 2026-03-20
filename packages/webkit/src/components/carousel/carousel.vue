<script setup>
import Carousel from 'primevue/carousel'

defineOptions({ name: 'Carousel' })

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  page: {
    type: Number,
    default: 0
  },
  numVisible: {
    type: Number,
    default: 1
  },
  numScroll: {
    type: Number,
    default: 1
  },
  responsiveOptions: {
    type: Array,
    default: () => []
  },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (val) => ['horizontal', 'vertical'].includes(val)
  },
  verticalViewPortHeight: {
    type: String,
    default: '300px'
  },
  contentClass: {
    type: String,
    default: ''
  },
  containerClass: {
    type: String,
    default: ''
  },
  indicatorsContentClass: {
    type: String,
    default: ''
  },
  circular: {
    type: Boolean,
    default: false
  },
  autoplayInterval: {
    type: Number,
    default: undefined
  },
  showNavigators: {
    type: Boolean,
    default: true
  },
  showIndicators: {
    type: Boolean,
    default: true
  },
  class: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:page'])
</script>

<template>
  <Carousel
    :value="props.value"
    :page="props.page"
    :numVisible="props.numVisible"
    :numScroll="props.numScroll"
    :responsiveOptions="props.responsiveOptions"
    :orientation="props.orientation"
    :verticalViewPortHeight="props.verticalViewPortHeight"
    :contentClass="props.contentClass"
    :containerClass="props.containerClass"
    :indicatorsContentClass="props.indicatorsContentClass"
    :circular="props.circular"
    :autoplayInterval="props.autoplayInterval"
    :showNavigators="props.showNavigators"
    :showIndicators="props.showIndicators"
    :class="props.class"
    @update:page="emit('update:page', $event)"
  >
    <template v-if="$slides.default" #default="slotProps">
      <slot :data="slotProps.data" :index="slotProps.index" />
    </template>
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
    <template v-if="$slots.previcon" #previcon>
      <slot name="previcon" />
    </template>
    <template v-if="$slots.nexticon" #nexticon>
      <slot name="nexticon" />
    </template>
    <template v-if="$slots.indicator" #indicator="slotProps">
      <slot name="indicator" :index="slotProps.index" />
    </template>
  </Carousel>
</template>
