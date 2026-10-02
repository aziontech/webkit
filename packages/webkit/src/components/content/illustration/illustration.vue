<script setup lang="ts">
  import { computed, shallowRef, useAttrs, watch } from 'vue'

  import {
    loadIllustrationPlaceholder,
    resolveIllustrationAsset
  } from '../../../assets/illustrations/registry'

  defineOptions({
    name: 'Illustration',
    inheritAttrs: false
  })

  interface Props {
    /** Name of an official scene in the illustration asset library. */
    name?: string
    /** Accessible name; empty keeps the illustration decorative and hidden from assistive tech. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    name: '',
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const source = shallowRef<string | null>(null)
  const placeheld = shallowRef(false)

  watch(
    () => props.name,
    (name) => {
      const load = name ? resolveIllustrationAsset(name) : null
      if (!load) {
        if (name) {
          console.warn(`[webkit] <Illustration>: no asset registered under name "${name}".`)
        }
        loadIllustrationPlaceholder().then((module) => {
          if (props.name && resolveIllustrationAsset(props.name)) return
          source.value = module.default
          placeheld.value = true
        })
        return
      }
      load().then((module) => {
        if (props.name !== name) return
        source.value = module.default
        placeheld.value = false
      })
    },
    { immediate: true }
  )

  const decorative = computed(() => placeheld.value || props.ariaLabel.length === 0)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-illustration'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest['data-testid']
    return rest
  })
</script>

<template>
  <img
    v-if="source"
    :src="source"
    :alt="decorative ? '' : ariaLabel"
    :aria-hidden="decorative || undefined"
    :data-testid="testId"
    :data-placeholder="placeheld || undefined"
    width="592"
    height="300"
    decoding="async"
    class="block h-auto w-full"
    v-bind="passthroughAttrs"
  />
</template>
