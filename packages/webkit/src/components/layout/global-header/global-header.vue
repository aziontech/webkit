<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { GlobalHeaderInjectionKey } from './injection-key'

  defineOptions({
    name: 'GlobalHeader',
    inheritAttrs: false
  })

  /** Where the bar sits in the app shell. */
  export type GlobalHeaderKind = 'content' | 'site'

  interface Props {
    /** Accessible name for the header landmark. Empty uses the locale catalog (`Global header`). */
    ariaLabel?: string
    /** Where the bar sits: `content` is the default — full bleed across whatever zone holds it, insetting its regions by the page boundary so the first region opens on the same vertical as the page content under or beside it; `site` keeps that full-bleed surface on a framed marketing page but caps the regions at the site header measure and centres them, so they land on the bar's own column, one rung wider than the page frame under it. */
    kind?: GlobalHeaderKind
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: '',
    kind: 'content'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ globalHeader: en.globalHeader })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'layout-global-header'
  )

  provide(GlobalHeaderInjectionKey, {
    testId: testId.value
  })
</script>

<template>
  <header
    v-bind="$attrs"
    role="banner"
    :aria-label="ariaLabel || t('globalHeader.label')"
    :data-testid="testId"
    :data-kind="kind"
    class="flex h-(--layout-header-height) w-full min-w-0 shrink-0 items-center gap-(--spacing-md) border-b border-(--border-default) bg-(--bg-surface) data-[kind=content]:px-(--layout-boundary-inline) data-[kind=site]:px-[max(var(--layout-boundary-inline),calc((100%_-_var(--layout-measure-site-header))_/_2_+_var(--layout-boundary-inline)))]"
  >
    <slot />
  </header>
</template>
