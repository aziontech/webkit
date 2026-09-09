<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { GlobalHeaderInjectionKey } from './injection-key'

  defineOptions({
    name: 'GlobalHeader',
    inheritAttrs: false
  })

  /** Where the bar sits in the app shell. */
  export type GlobalHeaderKind = 'content' | 'site'

  interface Props {
    /** Accessible name for the header landmark. */
    ariaLabel?: string
    /** Where the bar sits: `content` is the default — full bleed across whatever zone holds it, insetting its regions by the page boundary so the first region opens on the same vertical as the page content under or beside it; `site` keeps that full-bleed surface on a framed marketing page but caps the regions at the site header measure and centres them, so they land on the bar's own column, one rung wider than the page frame under it. */
    kind?: GlobalHeaderKind
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: 'Global header',
    kind: 'content'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'layout-global-header'
  )

  provide(GlobalHeaderInjectionKey, {
    testId: testId.value
  })
</script>

<template>
  <!-- Two placements, one bar. `content` (default) runs full bleed across its zone and insets
       the regions by the page boundary token, so the first region opens on the page's own
       vertical. `site` keeps the full-bleed surface but caps and centres the regions on the
       header's own measure token, one rung wider than the page frame. One declaration does it:
       max(boundary, (100% - measure) / 2 + boundary) collapses to `content` below the measure. -->
  <header
    v-bind="$attrs"
    role="banner"
    :aria-label="ariaLabel"
    :data-testid="testId"
    :data-kind="kind"
    class="flex h-14 w-full min-w-0 shrink-0 items-center gap-(--spacing-md) border-b border-(--border-default) bg-(--bg-surface) data-[kind=content]:px-(--layout-boundary-inline) data-[kind=site]:px-[max(var(--layout-boundary-inline),calc((100%_-_var(--layout-measure-site-header))_/_2_+_var(--layout-boundary-inline)))]"
  >
    <slot />
  </header>
</template>
