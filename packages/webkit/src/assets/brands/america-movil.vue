<script setup lang="ts">
  import { h, type VNode } from 'vue'

  import { AMERICA_MOVIL_NODES, type AmericaMovilNode } from './america-movil-data'

  defineOptions({ name: 'BrandMarkAmericaMovil', inheritAttrs: false })

  const toVNode = ([tag, attrs, children]: AmericaMovilNode): VNode =>
    h(tag, attrs, children?.map(toVNode))

  const AmericaMovilShapes = () => AMERICA_MOVIL_NODES.map(toVNode)
</script>

<template>
  <svg
    v-bind="$attrs"
    viewBox="0 0 3798.698 1080"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
  >
    <AmericaMovilShapes />
  </svg>
</template>
