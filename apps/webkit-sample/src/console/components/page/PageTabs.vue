<script setup>
  // Reusable SECOND-LEVEL NAV BAR — the tab row that forms the bottom edge of the
  // page header on a module or detail page (Applications, Workloads, Settings,
  // Edge DNS zone, SQL database). It is NAVIGATION, not a heading: each tab is its
  // own page, so the bar carries no <h1> and pairs with `:padded="false"` on
  // AppLayout as the first, non-scrolling child of a `flex h-full flex-col` <main>.
  //
  // Why this is NOT a PageHeading variant: PageHeading is a title block (<h1> +
  // description + actions) that sits in the content flow of a padded layout. This bar
  // is a tablist that is full-bleed — it owns the bottom border and spans the whole
  // content zone while the region below it scrolls. Folding them together would
  // produce a PageHeading that renders no heading on the pages that show only the bar
  // (most of them: the page is already named by the header breadcrumb, and each tab's
  // own heading lives inside that tab's view).
  //
  // A page MAY carry both, stacked — Settings › Billing opens with a `large`
  // PageHeading and then this bar, which is the header's edge under it. The BAR is
  // full bleed; what sits IN it is not, and `column` is how a page says which measure
  // its content takes so the first tab lands on the same edge as the heading above it
  // and the bands below it.
  // Deployments shows a third arrangement — in-content tabs below the heading, no
  // border, no full bleed — which is a different element, not this bar with a flag
  // flipped.
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

  // The page column the bar's CONTENT sits on, keyed to the layout utility the page's
  // own views take. The bar itself is always full bleed; this only decides where the
  // first tab's label and the trailing actions land inside it.
  //
  // `full` is the inset-only shape this bar shipped with: content pinned at
  // --layout-boundary-inline from the content zone's edge. That reads as correct only
  // while the page column is UNCAPPED — below 1436px a `layout-column` page's content
  // starts at exactly that inset, so the two agree by coincidence. Above it the column
  // caps at its measure and centres, and the bar stays at the edge: measured on
  // Billing at 1920, the first tab sat 100px left of the "Billing" heading directly
  // above it, and on Applications 282px left of its views. Naming the measure is what
  // makes the bar track the column at EVERY width instead of at one.
  const COLUMN_CLASS = {
    full: '',
    data: 'layout-column',
    form: 'layout-column-form',
    focused: 'layout-column-focused'
  }

  defineProps({
    // The tabs, in display order. Each entry needs `value` (the id the page carries
    // in `?tab=`) and `label`. Extra keys a page uses to resolve what to mount
    // (`component`, `props`) are ignored here — this bar only navigates.
    tabs: { type: Array, required: true },
    // Which measure the page under the bar takes: 'data' (--layout-measure, the
    // standard page container), 'form', 'focused', or 'full' for no column at all.
    // Defaults to `full` so a page that has not declared its measure keeps the shape
    // it shipped with rather than silently moving.
    // The literal set is repeated here rather than derived from COLUMN_CLASS because
    // `defineProps` is hoisted out of setup() and cannot reference a local binding.
    column: {
      type: String,
      default: 'full',
      validator: (v) => ['full', 'data', 'form', 'focused'].includes(v)
    }
  })

  // The active tab (`v-model:value`), forwarded straight to TabView so a page can
  // back it with a router-driven computed and keep `?tab=` as the source of truth.
  const activeTab = defineModel('value', { type: [String, Number], default: null })
</script>

<template>
  <!-- The bar is FULL BLEED — it spans the content zone and its border is the header's
       edge — but what sits IN it still has to line up with the page under it. Hence the
       split: the BORDER is on this element, which is uncapped and uninset, and the ROW
       carries the page column plus the boundary's inline half. The trailing action's box
       lands on the page's right edge, and the first tab's LABEL lands on its left edge
       once the tab item's own 8px of optical padding is pulled back below. It was
       `pl-(--spacing-sm)` (12px) + that 8px = 20px, which put every first tab 4px left of
       the heading it sits under — measured on Billing, and the kind of near-miss that
       reads as a mistake rather than a margin.

       The inset alone is NOT enough once the column caps: `layout-column` widens its own
       max-width by the boundary it carries (see semantic/layouts), so a row carrying both
       resolves to exactly the content column of a page carrying both — at every width,
       capped or not. With `column="full"` the row keeps the inset and no cap, which is
       byte-identical to what this bar rendered before the prop existed. -->
  <div class="border-b border-(--border-default)">
    <div
      :class="[
        'layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm)',
        COLUMN_CLASS[column]
      ]"
    >
      <!-- `-ml-(--spacing-xs)` cancels the tab item's own horizontal padding, so the
           first LABEL — not the item's hover box — sits on the page's content edge. The
           box is meant to overhang: it is the hover/active fill, and a fill that stopped
           at the text would read as clipped. -->
      <TabView
        v-model:value="activeTab"
        class="-ml-(--spacing-xs) min-w-0 flex-1"
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
