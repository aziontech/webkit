<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { GlobalHeaderInjectionKey } from './injection-key'

  defineOptions({
    name: 'GlobalHeader',
    inheritAttrs: false
  })

  /** Where the bar sits in the app shell. */
  export type GlobalHeaderKind = 'app' | 'content' | 'site'

  interface Props {
    /** Accessible name for the header landmark. */
    ariaLabel?: string
    /** Where the bar sits: `app` spans the whole window above the navigation rail and insets its regions by the shell's own step; `content` sits inside the content zone beside the rail, full bleed, and insets them by the page boundary instead; `site` keeps that full-bleed surface on a framed marketing page but caps the regions at the site measure and centres them, so they land on the page's own column. */
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
  <!-- Three placements, one bar, and the only difference is where the inset is measured
       from. `app` is the window-wide chrome above the navigation rail: there is no page
       column to answer to, so it takes the shell's own `--spacing-md`. `content` is the bar
       Cloudflare's console uses — it starts where the content zone starts, runs FULL BLEED
       across it, and takes the page's own boundary (`--layout-boundary-inline`), so its
       first region opens on the same vertical as the page's own content beside it.

       Full bleed is the whole point of `content`: the bar spans its zone and its regions sit
       at the page's inset. It does not chase a capped, centred page column — an app page that
       narrows its own measure on purpose keeps its heading where it put it, and the bar keeps
       its leading edge where the zone begins.

       `site` IS THE PLACEMENT FOR A PAGE THAT IS A FRAME, not a zone. A marketing page is one
       centred column — hero, sections, footer all on `--container-site` — and a bar that
       ignored that cap comes apart exactly where the column stops growing: on a 2560px window
       the logo sat 684px to the left of the headline under it, the navigation drifting away
       from the content it navigates. So the SURFACE stays full bleed (the fill and the
       hairline run to the window edges — a bar is still chrome, and it draws no side rule that
       would make it a piece of the page's frame) while the REGIONS are capped and centred.

       One declaration does it, on this element: `max(boundary, (100% - measure) / 2 +
       boundary)`. Above the measure the second term centres the content box on the page's
       column; below it the term goes negative, `max` picks the boundary, and the placement
       collapses to exactly `content` — so there is no breakpoint, and no sub-component or
       per-page `measure` prop (both were tried on `content` and rejected: they cost an
       element and a prop for a column an app page does not have). -->
  <header
    v-bind="$attrs"
    role="banner"
    :aria-label="ariaLabel"
    :data-testid="testId"
    :data-kind="kind"
    class="flex h-14 w-full min-w-0 shrink-0 items-center gap-(--spacing-md) border-b border-(--border-default) bg-(--bg-surface) data-[kind=app]:px-(--spacing-md) data-[kind=content]:px-(--layout-boundary-inline) data-[kind=site]:px-[max(var(--layout-boundary-inline),calc((100%_-_var(--container-site))_/_2_+_var(--layout-boundary-inline)))]"
  >
    <slot />
  </header>
</template>
