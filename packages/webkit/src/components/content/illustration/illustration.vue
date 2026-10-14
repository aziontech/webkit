<script setup lang="ts">
  import { computed, defineAsyncComponent, defineComponent, h, useAttrs, useId, watch } from 'vue'

  import {
    loadIllustrationPlaceholder,
    resolveIllustrationAsset
  } from '../../../assets/illustrations/registry'
  import { loadIllustrationScene } from '../../../assets/illustrations/scene'

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

  const asset = computed(() => (props.name ? resolveIllustrationAsset(props.name) : null))

  const placeheld = computed(() => asset.value === null)

  const Canvas = computed(() => {
    const key = placeheld.value ? '' : props.name
    const load = asset.value ?? loadIllustrationPlaceholder
    return defineAsyncComponent(() =>
      loadIllustrationScene(key, load)
        .then((scene) =>
          defineComponent({
            inheritAttrs: false,
            setup: (_, context) => () =>
              h('svg', { ...context.attrs, viewBox: scene.viewBox, innerHTML: scene.draw(scope) })
          })
        )
        .catch((error: unknown) => {
          console.warn(`[webkit] <Illustration>: could not load "${props.name}".`, error)
          return defineComponent({ render: () => null })
        })
    )
  })

  watch(
    () => props.name,
    (name) => {
      if (name && !resolveIllustrationAsset(name)) {
        console.warn(`[webkit] <Illustration>: no asset registered under name "${name}".`)
      }
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
  <component
    :is="Canvas"
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
