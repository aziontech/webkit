<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { GlobalHeaderInjectionKey } from './injection-key'

  defineOptions({
    name: 'GlobalHeader',
    inheritAttrs: false
  })

  /** Where the bar sits in the app shell. */
  export type GlobalHeaderKind = 'app' | 'content'

  interface Props {
    /** Accessible name for the header landmark. */
    ariaLabel?: string
    /** Where the bar sits: `app` spans the whole window above the navigation rail and insets its regions by the shell's own step; `content` sits inside the content zone beside the rail, full bleed, and insets them by the page boundary instead. */
    kind?: GlobalHeaderKind
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: 'Global header',
    kind: 'app'
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
  <!-- Two placements, one bar, and the only difference is which edge the inset is measured
       from. `app` is the window-wide chrome above the navigation rail: there is no page
       column to answer to, so it takes the shell's own `--spacing-md`. `content` is the bar
       Cloudflare's console uses — it starts where the content zone starts, runs FULL BLEED
       across it, and takes the page's own boundary (`--layout-boundary-inline`), so its
       first region opens on the same vertical as the page's own content beside it.

       Full bleed is the whole point of the variant: the bar spans its zone and its regions
       sit at the page's inset. It does not chase a capped, centred page column — a page that
       narrows its own measure on purpose keeps its heading where it put it, and the bar
       keeps its leading edge where the zone begins. -->
  <header
    v-bind="$attrs"
    role="banner"
    :aria-label="ariaLabel"
    :data-testid="testId"
    :data-kind="kind"
    class="flex h-14 w-full min-w-0 shrink-0 items-center gap-(--spacing-md) border-b border-(--border-default) bg-(--bg-surface) data-[kind=app]:px-(--spacing-md) data-[kind=content]:px-(--layout-boundary-inline)"
  >
    <slot />
  </header>
</template>
