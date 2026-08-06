<script setup lang="ts">
  import type { Component } from 'vue'
  import { computed, defineAsyncComponent, provide, shallowRef, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import { resolveIllustrationAsset } from './assets/registry'
  import type { IllustrationSize } from './injection-key'
  import { IllustrationInjectionKey } from './injection-key'

  defineOptions({
    name: 'Illustration',
    inheritAttrs: false
  })

  interface Props {
    /** Key of a registered asset to render; empty renders the composed default slot instead. */
    name?: string
    /** Scale of the whole scene; every part inherits it unless it sets its own. */
    size?: IllustrationSize
    /** Scene-level emphasis; parts inherit it and switch to the brand rim light. */
    active?: boolean
    /** Accessible name; empty keeps the illustration decorative and hidden from assistive tech. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    name: '',
    size: 'medium',
    active: false,
    ariaLabel: ''
  })

  defineSlots<{
    /** The composed anatomy. Rendered when `name` is empty. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const size = computed(() => props.size)
  const active = computed(() => props.active)

  provide(IllustrationInjectionKey, { size, active })

  // One async wrapper per asset name, so two illustrations of the same asset share a
  // single chunk and re-rendering never re-creates the component.
  const wrappers = new Map<string, Component>()

  const asset = shallowRef<Component | null>(null)

  watch(
    () => props.name,
    (name) => {
      if (!name) {
        asset.value = null
        return
      }
      const cached = wrappers.get(name)
      if (cached) {
        asset.value = cached
        return
      }
      const loader = resolveIllustrationAsset(name)
      if (!loader) {
        // An unknown name is an authoring mistake, not a runtime condition: say so and
        // render nothing rather than failing the surrounding page.
        console.warn(`[webkit] <Illustration>: no asset registered under name "${name}".`)
        asset.value = null
        return
      }
      const wrapper = defineAsyncComponent(loader)
      wrappers.set(name, wrapper)
      asset.value = wrapper
    },
    { immediate: true }
  )

  const decorative = computed(() => props.ariaLabel.length === 0)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-illustration'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  const ROOT_CLASS = 'flex items-center justify-center'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))
</script>

<template>
  <div
    :role="decorative ? 'presentation' : 'img'"
    :aria-hidden="decorative || undefined"
    :aria-label="decorative ? undefined : ariaLabel"
    :data-testid="testId"
    :data-size="size"
    :data-active="active || null"
    :class="rootClass"
    v-bind="passthroughAttrs"
  >
    <component
      :is="asset"
      v-if="asset"
      class="motion-safe:animate-fade-in motion-reduce:animate-none"
    />
    <slot v-else />
  </div>
</template>
