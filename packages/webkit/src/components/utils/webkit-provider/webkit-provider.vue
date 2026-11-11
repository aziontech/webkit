<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import {
    type DirectionSetting,
    type PartialMessages,
    provideLocale
  } from '../../../composables/use-locale'
  import { BUILT_IN_CATALOGS } from '../../../i18n/catalogs'

  defineOptions({
    name: 'WebkitProvider',
    inheritAttrs: false
  })

  interface Props {
    /** BCP 47 locale of everything below the provider; picks the built-in catalog (`en`, `pt-BR`, `es`) and the `Intl` formats. */
    locale?: string
    /** Partial catalog deep-merged over the built-in one, keyed by component group (`{ pagination: { next: 'Seguinte' } }`). */
    messages?: PartialMessages
    /** Text direction of the subtree; `auto` derives it from the locale (`ar`, `he`, `fa`, `ur` are right-to-left). */
    dir?: DirectionSetting
  }

  const props = withDefaults(defineProps<Props>(), {
    locale: 'en',
    messages: undefined,
    dir: 'auto'
  })

  defineSlots<{
    /** The app, or the part of it that shares this locale. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const context = provideLocale({
    locale: () => props.locale,
    messages: () => props.messages,
    dir: () => props.dir,
    catalogs: BUILT_IN_CATALOGS
  })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'utils-webkit-provider'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :lang="context.locale.value"
    :dir="context.dir.value"
    :data-testid="testId"
  >
    <slot />
  </div>
</template>
