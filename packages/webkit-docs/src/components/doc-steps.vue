<script setup lang="ts">
  import { cloneVNode, computed, useSlots } from 'vue'

  import { flattenSlot } from '../lib/slot'

  /**
   * The ordered walkthrough from the docs frame: a column of `DocStep`s joined
   * by a rail. It reads its own children to number them and to mark the last
   * one, so the numbering is a fact of the document order.
   */
  defineOptions({ name: 'DocSteps' })

  defineSlots<{
    /** The `DocStep` children, in the order they should be numbered. */
    default(): unknown
  }>()

  const slots = useSlots()

  const steps = computed(() => {
    const children = flattenSlot(slots.default?.() ?? [])
    return children.map((child, position) =>
      cloneVNode(child, { index: position + 1, last: position === children.length - 1 })
    )
  })
</script>

<template>
  <div
    data-doc-block
    data-testid="doc-steps"
    class="flex w-full flex-col items-start"
  >
    <component
      :is="step"
      v-for="(step, position) in steps"
      :key="position"
    />
  </div>
</template>
