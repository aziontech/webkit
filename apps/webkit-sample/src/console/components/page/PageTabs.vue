<script setup>
  // Reusable SECOND-LEVEL NAV BAR — the tab row that forms the bottom edge of the
  // page header on a module or detail page (Applications, Workloads, Settings,
  // Edge DNS zone, SQL database). It is NAVIGATION, not a heading: each tab is its
  // own page, so the bar carries no <h1> and pairs with `:padded="false"` on
  // AppLayout as the first, non-scrolling child of a `flex h-full flex-col` <main>.
  //
  // Why this is NOT a PageHeading variant: PageHeading is a title block (<h1> +
  // description + actions) that sits in the content flow of a padded layout. This
  // bar is a tablist that is full-bleed — it owns the bottom border and the
  // horizontal inset that let it span the whole content zone while the region below
  // it scrolls. Every page that renders this bar renders NO PageHeading (the page is
  // already named by the header breadcrumb, and each tab's own heading lives inside
  // that tab's view), so the two never compose: folding them together would produce
  // a PageHeading that renders no heading. Where a page does show both — a
  // first-level list like Deployments — the tabs are in-content BELOW the heading
  // with no border and no full-bleed inset, which is a different element, not this
  // bar with a flag flipped.
  //
  // The row is `items-center`, not `items-end`: a 32px `size="medium"` Button in the
  // `actions` slot centres against the 30px tab items. Aligning their bottoms instead
  // makes the button overhang the tabs by 2px, which is why the one page that tried
  // it had to nudge its button back with a hand-written `mb-*`.
  //
  // `min-w-0 flex-1` on the TabView is what lets the tab list — which scrolls
  // horizontally on narrow viewports and fades its own edges — shrink instead of
  // pushing the actions off the row.
  import TabView from '@aziontech/webkit/tab-view'

  defineProps({
    // The tabs, in display order. Each entry needs `value` (the id the page carries
    // in `?tab=`) and `label`. Extra keys a page uses to resolve what to mount
    // (`component`, `props`) are ignored here — this bar only navigates.
    tabs: { type: Array, required: true }
  })

  // The active tab (`v-model:value`), forwarded straight to TabView so a page can
  // back it with a router-driven computed and keep `?tab=` as the source of truth.
  const activeTab = defineModel('value', { type: [String, Number], default: null })
</script>

<template>
  <div
    class="border-b border-(--border-default) pr-(--spacing-lg) pl-(--spacing-sm)"
  >
    <div class="flex items-center gap-(--spacing-sm) py-(--spacing-sm)">
      <TabView
        v-model:value="activeTab"
        class="min-w-0 flex-1"
      >
        <TabView.List>
          <TabView.Item
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
            :label="tab.label"
          />
        </TabView.List>
      </TabView>
      <!-- The page's own controls, trailing on the tab row. The wrapper is skipped
           entirely when no `actions` slot is passed — a page with no page-level actions
           keeps the bar at its natural height.
           `min-h-8` RESERVES a `size="medium"` action's 32px for the case where the slot
           IS passed but the ACTIVE TAB renders nothing into it (ApplicationDetail: Build
           has a create action, Main Settings does not). Without the reservation the row
           is content-sized — 30px from the tab list alone, 32px with a button — so every
           switch between those two tabs nudged the tabs and the whole page below them by
           2px, which reads as a glitch on the tab that is standing still. The floor is on
           this wrapper rather than on the row because the row's `box-sizing: border-box`
           counts its own 12px padding against a min-height, so a 32px floor there would
           never bind. -->
      <div
        v-if="$slots.actions"
        class="flex min-h-8 shrink-0 items-center gap-(--spacing-xs)"
      >
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
