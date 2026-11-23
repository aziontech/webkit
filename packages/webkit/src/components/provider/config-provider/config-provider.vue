<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import {
    type DirectionSetting,
    type Messages,
    type PartialMessages,
    provideLocale
  } from '../../../composables/use-locale'
  import { en } from '../../../locales/en'

  defineOptions({
    name: 'ConfigProvider',
    inheritAttrs: false
  })

  export interface ConfigProviderProps {
    /**
     * BCP 47 locale of everything below the provider; picks the catalog from `catalogs` (English
     * is built in) and the `Intl` formats. Empty follows the device locale, `en-US` on the server
     * and until mount.
     */
    locale?: string
    /** Extra catalogs keyed by locale tag, imported from `@aziontech/webkit/locales/<tag>` (`{ 'pt-BR': ptBR, es }`); a locale with no catalog falls back to English. */
    catalogs?: Record<string, Messages>
    /** Partial catalog deep-merged over the built-in one, keyed by component group (`{ pagination: { next: 'Seguinte' } }`). */
    messages?: PartialMessages
    /** Text direction of the subtree; `auto` derives it from `locale` (`ar`, `he`, `fa`, `ur` are right-to-left), and with no `locale` inherits the direction around the provider. */
    dir?: DirectionSetting
    /** Reference time for every relative time below the provider (`TableCellTime`, `useLocale().formatRelativeTime`); unset reads the real clock, ticking each minute. */
    now?: string | number | Date
    /**
     * IANA time zone every `Timestamp` below the provider shows its local time in, and every
     * `DateRangePicker` with no `v-model:time-zone` formats in (`America/New_York`, `UTC`), for an
     * app-wide time zone picker; empty reads the browser's zone.
     */
    timeZone?: string
  }

  const props = withDefaults(defineProps<ConfigProviderProps>(), {
    locale: '',
    catalogs: undefined,
    messages: undefined,
    dir: 'auto',
    now: undefined,
    timeZone: ''
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
    now: () => props.now,
    timeZone: () => props.timeZone
  })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'config-provider')
</script>

<template>
  <div
    v-bind="$attrs"
    :lang="context.locale.value"
    :dir="context.ownDir.value"
    :data-testid="testId"
  >
    <slot />
  </div>
</template>
