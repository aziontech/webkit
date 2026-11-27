<script setup lang="ts">
  import type { VNode, VNodeArrayChildren } from 'vue'
  import { Comment, computed, createTextVNode, Fragment, provide, Text, useAttrs } from 'vue'

  import RegistrationFrame from '../registration-frame/registration-frame.vue'
  import { SplitStackInjectionKey } from './injection-key'

  defineOptions({
    name: 'SplitStack',
    inheritAttrs: false
  })

  export interface SplitStackProps {
    /** Pin each band under the site header from `lg` up, a step lower than the band before it, so the run piles up as the page scrolls. */
    sticky?: boolean
    /** Drop the first band's top rule, for a stack sitting directly under an element that already draws one. */
    flush?: boolean
  }

  withDefaults(defineProps<SplitStackProps>(), {
    sticky: false,
    flush: false
  })

  const slots = defineSlots<{
    /** The bands. Each direct child — including every child a `v-for` renders — is wrapped in its own frame and becomes one band; comment nodes are skipped. */
    default?(): unknown
  }>()

  provide(SplitStackInjectionKey, { framesCells: true })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'split-stack')

  function flatten(nodes: VNodeArrayChildren): VNode[] {
    return nodes.flatMap((node): VNode[] => {
      if (Array.isArray(node)) return flatten(node)
      if (typeof node === 'string' || typeof node === 'number') {
        const text = String(node)
        return text.trim() === '' ? [] : [createTextVNode(text)]
      }
      if (typeof node !== 'object' || node === null) return []
      return flattenVNode(node as VNode)
    })
  }

  function flattenVNode(vnode: VNode): VNode[] {
    if (vnode.type === Comment) return []
    if (vnode.type === Text) return String(vnode.children ?? '').trim() === '' ? [] : [vnode]
    if (vnode.type === Fragment) return flatten((vnode.children ?? []) as VNodeArrayChildren)
    return [vnode]
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
    <RegistrationFrame
      v-for="(band, index) in bands()"
      :key="band.key ?? index"
      borders="y"
      marks="none"
      :flush="flush && index === 0"
      :data-testid="`${testId}__band`"
      :style="{ '--split-stack-index': index }"
      class="not-first:-mt-px group-data-[sticky]/stack:lg:sticky group-data-[sticky]/stack:lg:top-[calc(var(--size-14)+var(--split-stack-index)*var(--spacing-md))]"
    >
      <component :is="band" />
    </RegistrationFrame>
  </div>
</template>
