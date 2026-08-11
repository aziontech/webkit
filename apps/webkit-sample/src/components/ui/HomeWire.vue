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

  // The resources card, at the row count the real table's skeleton uses.
  const ROWS = 6
</script>

<template>
  <div
    class="flex flex-col gap-[var(--layout-boundary-start)] lg:flex-row lg:gap-[var(--layout-section-gap)]"
    aria-hidden="true"
  >
    <!-- Usage: the section title, then one card per metric — 2-up while the rail
         is full width, single column once it narrows at `lg`. -->
    <div
      class="flex w-full shrink-0 flex-col gap-[var(--layout-group-gap)] lg:max-w-[var(--container-xs)]"
    >
      <Skeleton
        width="4rem"
        height="1rem"
      />
      <div class="grid auto-rows-fr grid-cols-2 gap-[var(--layout-group-gap)] lg:grid-cols-1">
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

    <!-- Resources: the section title, then the flush card whose rows are the
         table's. Alternating widths so the block reads as text rather than as a
         column of identical bars. -->
    <div class="flex min-w-0 grow flex-col gap-[var(--layout-group-gap)]">
      <Skeleton
        width="7rem"
        height="1rem"
      />
      <CardBox :padded="false">
        <template #content>
          <div
            v-for="row in ROWS"
            :key="row"
            class="flex items-center gap-[var(--spacing-md)] px-[var(--spacing-md)] py-[var(--spacing-md)]"
            :class="
              row > 1
                ? 'border-t-[length:var(--border-width-default)] border-[var(--border-default)]'
                : ''
            "
          >
            <Skeleton
              width="1.5rem"
              height="1.5rem"
            />
            <Skeleton
              :width="row % 2 ? '38%' : '28%'"
              height="0.875rem"
            />
            <Skeleton
              class="ml-auto"
              width="4rem"
              height="0.75rem"
            />
          </div>
        </template>
      </CardBox>
    </div>
  </div>
</template>
