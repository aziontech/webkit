<script setup>
  // Overview WITHOUT its data — the page's own shape, drawn in placeholder fill.
  //
  // Two hosts, one shape, on purpose:
  //   - Overview itself (../Home.vue) shows this on a COLD ARRIVAL. Everything on
  //     that page is read rather than held — usage is metered per tenancy scope and
  //     the resource list is a query — so the page opens as its own wire and settles
  //     once the read lands. A wire, not a spinner: the reader gets the layout they
  //     are about to use on the first frame, so nothing jumps when the numbers
  //     arrive, and the shape itself says which page is coming.
  //   - SessionWire (./SessionWire.vue) shows it for the `home` route family when a
  //     session dies underneath the page.
  //
  // It lives here rather than inside either host because both need the SAME shape:
  // a wire that disagrees with the page it stands in for is worse than no wire, and
  // two copies drift on the first layout change.
  //
  // The measures and steps are the real page's (`--layout-*`, src/styles/
  // layout.css); the fill is `--bg-placeholder` through the DS Skeleton. Nothing in
  // here is a control, and nothing in here is interactive.
  import CardBox from '@aziontech/webkit/card-box'
  import Skeleton from '@aziontech/webkit/skeleton'

  // The left rail: one card per usage metric. The count matters — a wire with the
  // wrong number of cards is a layout that shifts the moment it resolves.
  const METRICS = 4

  // The resource cards, at the count the real page's tenancy-reload skeleton uses —
  // six, which fills a whole number of rows at every column count the grid runs at.
  const CARDS = 6
</script>

<template>
  <div
    class="flex flex-col gap-[var(--layout-boundary-start)] xl:flex-row xl:gap-[var(--layout-section-gap)]"
    aria-hidden="true"
  >
    <!-- Usage: the section title, then one card per metric — 2-up while the rail
         is full width, single column once it narrows at `xl`.
         The split point and the rail's 30%-capped-at-`--container-xs` width are the
         real page's (../Home.vue): a wire that resolves into a different column
         split is a layout that jumps on the first frame of real data. -->
    <div
      class="flex w-full shrink-0 flex-col gap-[var(--layout-group-gap)] xl:w-[30%] xl:max-w-[var(--container-xs)]"
    >
      <Skeleton
        width="4rem"
        height="1rem"
      />
      <div class="grid auto-rows-fr grid-cols-2 gap-[var(--layout-group-gap)] xl:grid-cols-1">
        <CardBox
          v-for="metric in METRICS"
          :key="metric"
        >
          <template #content>
            <div class="flex flex-col gap-[var(--spacing-md)]">
              <Skeleton
                width="60%"
                height="0.875rem"
              />
              <Skeleton
                width="40%"
                height="1.75rem"
              />
            </div>
          </template>
        </CardBox>
      </div>
    </div>

    <!-- Resources: the header band (title, then the type control and the search
         field that stay out of the scroll region on the real page), then the card
         GRID at the real page's column counts. It was a single flush card of rows,
         which stopped being the truth when Recents was folded into the list and the
         block became one grid of cards — a wire whose shape resolves into a
         different one is the layout shift it exists to prevent. -->
    <div class="flex min-w-0 grow flex-col gap-[var(--layout-group-gap)]">
      <div class="flex min-h-[var(--size-8)] items-center gap-[var(--spacing-sm)]">
        <Skeleton
          width="7rem"
          height="1rem"
        />
        <Skeleton
          class="ml-auto"
          width="12rem"
          height="2rem"
        />
      </div>

      <div class="grid grid-cols-1 gap-[var(--layout-group-gap)] lg:grid-cols-2 2xl:grid-cols-3">
        <CardBox
          v-for="card in CARDS"
          :key="card"
          :padded="false"
        >
          <template #content>
            <div class="flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
              <div class="flex items-start gap-[var(--spacing-sm)]">
                <Skeleton
                  width="2rem"
                  height="2rem"
                />
                <div class="flex grow flex-col gap-[var(--spacing-xxs)]">
                  <Skeleton
                    :width="card % 2 ? '58%' : '44%'"
                    height="0.875rem"
                  />
                  <Skeleton
                    :width="card % 2 ? '76%' : '64%'"
                    height="0.75rem"
                  />
                </div>
              </div>
              <Skeleton
                width="9rem"
                height="1.25rem"
              />
            </div>
          </template>
        </CardBox>
      </div>
    </div>
  </div>
</template>
