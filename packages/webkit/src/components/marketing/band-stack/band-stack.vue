<script setup lang="ts">
  import type { VNode, VNodeArrayChildren } from 'vue'
  import { Comment, computed, createTextVNode, Fragment, Text, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'

  defineOptions({
    name: 'BandStack',
    inheritAttrs: false
  })

  interface Props {
    /** Pin each band under the site header from `lg` up, a step lower than the band before it, so the run piles up as the page scrolls. */
    sticky?: boolean
    /** Drop the first band's top rule, for a stack sitting directly under an element that already draws one. */
    flush?: boolean
  }

  withDefaults(defineProps<Props>(), {
    sticky: false,
    flush: false
  })

  const slots = defineSlots<{
    /** The bands. Each direct child — including every child a `v-for` renders — is wrapped in its own frame and becomes one band; comment nodes are skipped. */
    default?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-band-stack'
  )

  function flatten(nodes: VNodeArrayChildren): VNode[] {
    return nodes.flatMap((node): VNode[] => {
      if (Array.isArray(node)) return flatten(node)
      if (typeof node === 'string' || typeof node === 'number') {
        const text = String(node)
        return text.trim() === '' ? [] : [createTextVNode(text)]
      }
      if (typeof node !== 'object' || node === null) return []
      const vnode = node as VNode
      if (vnode.type === Comment) return []
      if (vnode.type === Text) return String(vnode.children ?? '').trim() === '' ? [] : [vnode]
      if (vnode.type === Fragment) return flatten((vnode.children ?? []) as VNodeArrayChildren)
      return [vnode]
    })
  }

  function bands(): VNode[] {
    return flatten((slots.default?.() ?? []) as VNodeArrayChildren)
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-sticky="sticky || null"
    :data-flush="flush || null"
    class="group/stack"
  >
    <FrameBox
      v-for="(band, index) in bands()"
      :key="band.key ?? index"
      borders="y"
      marks="all"
      :flush="flush && index === 0"
      :data-testid="`${testId}__band`"
      :style="{ '--band-stack-index': index }"
      class="not-first:-mt-px group-data-[sticky]/stack:lg:sticky group-data-[sticky]/stack:lg:top-[calc(var(--size-14)+var(--band-stack-index)*var(--spacing-md))]"
    >
      <component :is="band" />
    </FrameBox>
  </div>
</template>
