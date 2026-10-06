<script setup lang="ts">
  import { computed, shallowRef, useAttrs, useId, useTemplateRef, watch } from 'vue'

  import {
    type IllustrationAssetLoader,
    loadIllustrationPlaceholder,
    resolveIllustrationAsset
  } from '../../../assets/illustrations/registry'
  import type { IllustrationScene } from '../../../assets/illustrations/scene'

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
  const scope = useId()
  const root = useTemplateRef<globalThis.SVGSVGElement>('root')

  const scene = shallowRef<IllustrationScene | null>(null)
  const placeheld = shallowRef(false)

  const paint = (load: IllustrationAssetLoader) =>
    Promise.all([load(), import('../../../assets/illustrations/scene')]).then(
      ([asset, { loadIllustrationScene }]) => loadIllustrationScene(asset.default)
    )

  const warnUnloaded = (error: unknown) => {
    console.warn(`[webkit] <Illustration>: could not load "${props.name}".`, error)
  }

  watch(
    () => props.name,
    (name) => {
      const load = name ? resolveIllustrationAsset(name) : null
      if (!load) {
        if (name) {
          console.warn(`[webkit] <Illustration>: no asset registered under name "${name}".`)
        }
        paint(loadIllustrationPlaceholder)
          .then((painted) => {
            if (props.name && resolveIllustrationAsset(props.name)) return
            scene.value = painted
            placeheld.value = true
          })
          .catch(warnUnloaded)
        return
      }
      paint(load)
        .then((painted) => {
          if (props.name !== name) return
          scene.value = painted
          placeheld.value = false
        })
        .catch(warnUnloaded)
    },
    { immediate: true }
  )

  watch(
    [root, scene],
    ([element, painted]) => {
      if (element && painted) {
        element.replaceChildren(...painted.draw(scope))
      }
    },
    { flush: 'post' }
  )

  const viewBox = computed(() => scene.value?.viewBox || '0 0 592 300')

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
  <svg
    v-if="scene"
    ref="root"
    :viewBox="viewBox"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : ariaLabel"
    :aria-hidden="decorative || undefined"
    :data-testid="testId"
    :data-placeholder="placeheld || undefined"
    width="592"
    height="300"
    fill="none"
    class="block h-auto w-full"
    v-bind="passthroughAttrs"
  />
</template>
