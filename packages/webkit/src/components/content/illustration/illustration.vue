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

  // One resolved URL per scene. The loader is a dynamic import, so a consumer's bundle
  // carries only the scenes its pages name.
  const source = shallowRef<string | null>(null)
  const placeheld = shallowRef(false)

  watch(
    () => props.name,
    (name) => {
      const load = name ? resolveIllustrationAsset(name) : null
      if (!load) {
        // An unregistered name is an authoring mistake, not a runtime condition: say so,
        // and hold the frame with the placeholder instead of failing the page around it.
        if (name) {
          console.warn(`[webkit] <Illustration>: no asset registered under name "${name}".`)
        }
        loadIllustrationPlaceholder().then((module) => {
          // Re-read the current name: a real scene named while the frame loaded wins.
          if (props.name && resolveIllustrationAsset(props.name)) return
          source.value = module.default
          placeheld.value = true
        })
        return
      }
      load().then((module) => {
        // A name that changed while the scene was loading wins: drop the stale resolve.
        if (props.name !== name) return
        source.value = module.default
        placeheld.value = false
      })
    },
    { immediate: true }
  )

  // The placeholder draws no scene, so it is never announced: an ariaLabel written for the
  // missing artwork would describe something that is not on the page.
  const decorative = computed(() => placeheld.value || props.ariaLabel.length === 0)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-illustration'
  )

  // `$attrs` carries the consumer's class straight to the root, which Vue merges with the
  // one below. No `cn`: tailwind-merge is ~10KB gzip, and with a two-utility base there is
  // nothing for it to de-conflict — the scene's size is the call site's to set.
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
