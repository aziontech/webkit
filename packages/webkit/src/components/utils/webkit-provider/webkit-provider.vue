<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import {
    type DirectionSetting,
    type Messages,
    type PartialMessages,
    provideLocale
  } from '../../../composables/use-locale'
  import { en } from '../../../i18n/messages/en'

  defineOptions({
    name: 'WebkitProvider',
    inheritAttrs: false
  })

  interface Props {
    /** BCP 47 locale of everything below the provider; picks the catalog from `catalogs` (English is built in) and the `Intl` formats. */
    locale?: string
    /** Extra catalogs keyed by locale tag, imported from `@aziontech/webkit/locales/<tag>` (`{ 'pt-BR': ptBR, es }`); a locale with no catalog falls back to English. */
    catalogs?: Record<string, Messages>
    /** Partial catalog deep-merged over the built-in one, keyed by component group (`{ pagination: { next: 'Seguinte' } }`). */
    messages?: PartialMessages
    /** Text direction of the subtree; `auto` derives it from the locale (`ar`, `he`, `fa`, `ur` are right-to-left). */
    dir?: DirectionSetting
    /** Reference time for every relative time below the provider (`Table.CellTime`, `useLocale().formatRelativeTime`); unset reads the real clock, ticking each minute. */
    now?: string | number | Date
  }

  const props = withDefaults(defineProps<Props>(), {
    locale: 'en',
    catalogs: undefined,
    messages: undefined,
    dir: 'auto',
    now: undefined
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
    catalogs: () => ({ en, ...props.catalogs }),
    now: () => props.now
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
