<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { AppHeaderInjectionKey } from './injection-key'

  defineOptions({
    name: 'AppHeader',
    inheritAttrs: false
  })

  /** Where the bar sits in the app shell. */
  export type AppHeaderVariant = 'content' | 'site'

  export interface AppHeaderProps {
    /** Accessible name for the header landmark. Empty uses the locale catalog (`Global header`). */
    ariaLabel?: string
    /**
     * Where the bar sits: `content` is the default — full bleed across whatever zone holds it,
     * insetting its regions by the page boundary so the first region opens on the same vertical as
     * the page content under or beside it; `site` keeps that full-bleed surface on a framed
     * marketing page but caps the regions at the site header measure and centres them, so they
     * land on the bar's own column, one rung wider than the page frame under it.
     */
    variant?: AppHeaderVariant
  }

  withDefaults(defineProps<AppHeaderProps>(), {
    ariaLabel: '',
    variant: 'content'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ appHeader: en.appHeader })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'app-header')

  provide(AppHeaderInjectionKey, {
    testId: testId.value
  })

  const ROOT_CLASS =
    'flex h-(--layout-header-height) w-full min-w-0 shrink-0 items-center gap-(--spacing-md) border-b border-(--border-default) bg-(--bg-surface) ' +
    'data-[variant=content]:px-(--layout-boundary-inline) ' +
    'data-[variant=site]:px-[max(var(--layout-boundary-inline),calc((100%_-_var(--layout-measure-site-header))_/_2_+_var(--layout-boundary-inline)))]'
</script>

<template>
  <header
    v-bind="$attrs"
    role="banner"
    :aria-label="ariaLabel || t('appHeader.label')"
    :data-testid="testId"
    :data-variant="variant"
    :class="ROOT_CLASS"
  >
    <slot />
  </header>
</template>
