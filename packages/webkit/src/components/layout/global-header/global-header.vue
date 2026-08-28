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
  <!-- Two placements, one bar, and the only difference is where the inset is measured
       from. `content` is the DEFAULT and the one every app shell wants: the bar runs FULL
       BLEED across whatever zone holds it — a content zone beside a rail, or the whole
       window when nothing sits beside it — and takes the page's own boundary
       (`--layout-boundary-inline`), so its first region opens on the same vertical as the
       page's own content. Retune the boundary and the bar moves with the page, because it
       reads the token the page reads.

       Full bleed is the whole point of `content`: the bar spans its zone and its regions sit
       at the page's inset. It does not chase a capped, centred page column — an app page that
       narrows its own measure on purpose keeps its heading where it put it, and the bar keeps
       its leading edge where the zone begins.

       THERE WAS A THIRD, `app`, AND IT IS GONE. It insetted by a flat `--spacing-md` (16 at
       every width) on the theory that window-wide chrome above a navigation rail has no page
       column to answer to. In practice every shell that was placed deliberately chose
       `content` instead — including the two bars that DO span the whole window with no zone
       beside them — because a flat 16 disagrees with the page's 16-then-24 boundary at exactly
       the widths where nothing sits between the bar and the page, which put the brand on a
       different vertical from the title under it. Nothing selected `app` on purpose; the only
       bars on it had inherited it as the default. A placement nobody picks is a decision every
       consumer has to make and cannot make correctly, so the bar now has one placement for an
       app and one for the marketing site.

       `site` IS THE PLACEMENT FOR A PAGE THAT IS A FRAME, not a zone. A marketing page is one
       centred column — hero, sections, footer all on `--layout-measure-site` — and a bar that
       answered to nothing comes apart exactly where that column stops growing: on a 2560px
       window the logo sat 684px to the left of the headline under it, the navigation drifting
       away from the content it navigates. So the SURFACE stays full bleed (the fill and the
       hairline run to the window edges — a bar is still chrome, and it draws no side rule that
       would make it a piece of the page's frame) while the REGIONS are capped and centred.

       THE CAP IS THE BAR'S OWN — `--layout-measure-site-header`, one rung wider than the
       page's frame, and the theme is where that decision lives (semantic/layouts). The bar is
       chrome: its payload is the brand at one end and the account actions at the other, held
       apart by a navigation region in the middle, so it wants the room the reading frame
       deliberately refuses. Tied to the page's own measure the middle region ran out of room on
       a laptop long before the page did. It is the one band allowed outside the frame, and the
       separate token is what keeps that exception deliberate: nobody widens the bar by retuning
       the page, and nobody widens the page by retuning the bar.

       One declaration does it, on this element: `max(boundary, (100% - measure) / 2 +
       boundary)`. Above the measure the second term centres the content box on the bar's
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
    class="flex h-14 w-full min-w-0 shrink-0 items-center gap-(--spacing-md) border-b border-(--border-default) bg-(--bg-surface) data-[kind=content]:px-(--layout-boundary-inline) data-[kind=site]:px-[max(var(--layout-boundary-inline),calc((100%_-_var(--layout-measure-site-header))_/_2_+_var(--layout-boundary-inline)))]"
  >
    <slot />
  </header>
</template>
