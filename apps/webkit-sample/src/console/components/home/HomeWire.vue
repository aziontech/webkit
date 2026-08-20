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
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'

  // Relative, not the `@shared` alias the neighbours use: validate-references.mjs
  // resolves real paths and node_modules, not vite aliases, so the alias form is
  // blocked at write time here.
  import { useAgentOnboarding } from '../../../shared/lib/agent-onboarding'

  // The usage strip at the foot: one cell per reading. The count matters — a wire with
  // the wrong number of cells is a layout that shifts the moment it resolves.
  const METRICS = 4

  // Whether the greeting row still carries the agent pill — the one thing that changes
  // that row's height (37px with it, 25px without), and a persisted per-reader answer.
  const { agentOnboardingVisible } = useAgentOnboarding()

  // The four PANELS the band resolves into — the three things the account owns at the
  // top level (`Applications`, `Workloads`, `Domains`) and `Recents` last
  // (../../pages/home/Home.vue). The count is the column count, so the wire splits the
  // row exactly where the page does, and a wire one column out is a band that re-flows
  // on arrival.
  const PANELS = 4

  // The panels whose rows open with a MARK, by index: `Applications` (the framework
  // logo) and `Recents` (the trail glyph). Both reserve a `--size-4` gutter before their
  // label on the real page, and the heading above them mirrors it — so the wire has to
  // know which two they are or its bars land on a rail the page does not use.
  const MARKED_PANELS = [1, PANELS]

  // The ROWS inside a panel, at the count the real page's tenancy-reload skeleton uses:
  // three, which is a panel and not a page of one.
  // The agent card's logo cluster — four editor marks, the count ProductFirstUse and the
  // strip's own card both draw (`AGENT_TOOLS.slice(0, 4)`).
  const MARKS = 4

  const ROWS = 3
</script>

<template>
  <!-- The page's own stack: the GREETING row, the SEARCH row, the RESOURCE list and
       the USAGE strip under it — the real page's structure
       (../../pages/home/Home.vue), where the search is a page-level row inside `<main>`
       above the list and not a control of the Resources band.
       Both leading rows are here because a wire is only worth drawing if it lands where
       the page lands: without them the blocks opened 62px high (measured) and every
       first frame of real data pushed the whole page down by that much — the exact
       shift this component exists to prevent. The gap between the rows is the page's
       own (`--layout-boundary-start`, which is what `<main>`'s `layout-section-start`
       margin resolves to). -->
  <!-- `xl:flex-1` + `xl:min-h-0`: from `xl` the real page is a FRAME — the list takes
       the height that is left and the usage strip is pinned under it, at the bottom of
       the viewport. A wire that stacks at its own content height puts that strip ~20px
       lower (measured) and it jumps up the moment the data lands, so the wire claims the
       frame the same way the page does. -->
  <div
    class="flex flex-col gap-(--layout-boundary-start) xl:min-h-0 xl:flex-1"
    aria-hidden="true"
  >
    <!-- The greeting, alone on its row. It used to share the row with the agent pill,
         which is what made this the one row on the page whose height depended on a
         persisted answer (37px with the pill, the heading's own 24.75px line box
         without) — the wire had to read the flag just to pick a height. The onboarding
         is a card at the end of the usage strip now (../../pages/home/Home.vue), so
         this row is one height for every reader. -->
    <div class="flex items-center">
      <Skeleton
        width="12rem"
        height="1.5rem"
      />
    </div>

    <div class="flex min-h-(--size-10) items-center">
      <Skeleton
        class="w-full"
        height="var(--size-10)"
      />
    </div>

    <!-- Resources: the four PANELS the real page draws
         (../../pages/home/Home.vue) — `Applications`, `Workloads`, `Domains` and
         `Recents` side by side from `xl`, two-up from `sm` and three-up
         from `lg`, each a muted heading over a flat list of rows. It was one wide list
         under a segmented type control; a wire whose shape resolves into a different
         one is the layout shift it exists to prevent.
         The row is the real row: ONE line and nothing else. It used to draw a 32px
         framed mark too; the real rows carry no mark any more — `Recents` marks its type
         with a bare glyph on the title line, which is inside the same line box the bar
         below stands in for — so a wire that reserves a 32px tile moves every name 40px
         the moment the data lands. -->
    <div
      class="grid grid-cols-1 gap-(--layout-group-gap) sm:grid-cols-2 lg:grid-cols-3 xl:min-h-0 xl:grow xl:grid-cols-5 xl:gap-(--layout-section-gap)"
    >
      <!-- Five tracks with the LAST panel over two of them, the real band's split:
           `Recents` names a type in front of every resource name, so it is the one
           column that carries two fields (../../pages/home/Home.vue). -->
      <div
        v-for="panel in PANELS"
        :key="panel"
        class="flex min-w-0 flex-col gap-(--spacing-xs) xl:min-h-0"
        :class="panel === PANELS ? 'xl:col-span-2' : ''"
      >
        <!-- The heading row, at the `--size-6` the real one reserves so the four
             titles land on one line, and on the real page's LABEL RAIL: the row's own
             inset is `--spacing-md` inside a 1px transparent border (17px, not 16), and
             the two panels whose rows open with a mark — `Applications`' framework logo
             and `Recents`' trail glyph — carry a further `--size-4` gutter plus the
             title's `--spacing-xs` gap before their text starts
             (../../pages/home/Home.vue). A wire heading on the row's edge instead of on
             that rail slides 24px sideways in two of the four columns the moment the
             data lands. -->
        <div
          class="flex min-h-(--size-6) items-center gap-(--spacing-xs) px-[calc(var(--spacing-md)+1px)]"
        >
          <span
            v-if="MARKED_PANELS.includes(panel)"
            class="w-(--size-4) shrink-0"
          />
          <Skeleton
            width="5rem"
            height="0.875rem"
          />
        </div>

        <!-- NO CARD, and `size="small"` rows — the real panel is a flat list on the
             page now (../../pages/home/Home.vue): three bordered boxes stretched to one
             row height left the shorter two as empty framed voids. A wire that still
             draws the box resolves into a page without one. -->
        <div class="xl:min-h-0 xl:flex-1 xl:overflow-hidden">
          <Item.List>
            <Item
              v-for="row in ROWS"
              :key="row"
              role="listitem"
              size="small"
            >
              <!-- Pinned to the 21px line box a real row's `text-label-md` title
                   occupies — a fixed-height Skeleton carries no line-height, so a bar
                   alone leaves every placeholder row short and the list jumps as the
                   data lands. The widths alternate so the column does not read as a
                   printed form. -->
              <Item.Content
                class="h-[21px] justify-center"
                :class="
                  MARKED_PANELS.includes(panel) ? 'pl-[calc(var(--size-4)+var(--spacing-xs))]' : ''
                "
              >
                <Skeleton
                  :width="row % 2 ? '55%' : '42%'"
                  height="0.875rem"
                />
              </Item.Content>
            </Item>
          </Item.List>
        </div>
      </div>
    </div>

    <!-- Usage: the strip at the FOOT, under the list — the real page's shape
         (../../pages/home/Home.vue), where the rail became one divided card of four
         readings and the agent card took the end of that same band. A wire that still
         drew a left rail would resolve into a different page on the first frame of real
         data, which is the one thing this component exists to prevent.
         The cells are the real ones' boxes: the same 2-up / 4-up wrap, the same internal
         hairlines, the same label-over-number stack — plus the trend tag's 20px box on
         the reading's right edge, because a tag that appears on arrival moves the number
         beside it. -->
    <div
      class="flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:flex-row xl:items-stretch xl:gap-(--layout-section-gap)"
    >
      <CardBox
        :padded="false"
        class="min-w-0 xl:flex-1"
      >
        <template #content>
          <div class="grid grow grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <div
              v-for="metric in METRICS"
              :key="metric"
              class="flex min-w-0 flex-col justify-center gap-(--spacing-sm) border-(--border-default) p-(--spacing-md) max-sm:[&:nth-child(n+2)]:border-t sm:max-xl:[&:nth-child(n+3)]:border-t sm:[&:nth-child(even)]:border-l xl:[&:nth-child(n+2)]:border-l"
            >
              <Skeleton
                width="60%"
                height="0.875rem"
              />
              <div class="flex items-center justify-between gap-(--spacing-sm)">
                <Skeleton
                  width="40%"
                  height="1.75rem"
                />
                <Skeleton
                  width="3.25rem"
                  height="1.25rem"
                />
              </div>
            </div>
          </div>
        </template>
      </CardBox>

      <!-- The agent onboarding card at the end of the band, at FirstUsePromo's own
           anatomy (./FirstUsePromo.vue): the 32px logo cluster, then the title over one
           line of copy. Behind the same persisted flag the page binds — a card the reader
           dismissed is not a shape the wire should reserve, and a card they still have is
           width the wire cannot leave unclaimed without the strip resolving wider than it
           opened.
           The cluster stands in as four 32px squares at the real overlap (`-ml-2`), not as
           one wide block: it is the largest thing in the card, and a bar where four marks
           resolve is the shift this file exists to prevent. -->
      <div
        v-if="agentOnboardingVisible"
        class="w-full shrink-0 xl:w-[30%] xl:max-w-(--container-xs)"
      >
        <CardBox :padded="false">
          <template #content>
            <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
              <div class="flex items-center [&>*+*]:-ml-2">
                <Skeleton
                  v-for="mark in MARKS"
                  :key="mark"
                  kind="shape"
                  width="2rem"
                  height="2rem"
                />
              </div>
              <!-- TWO description lines, not one. In the rail the card's line fit on one;
                   at the end of the band it wraps to two at the same 348px, and a wire that
                   draws one resolves 22px short (measured) — which is 22px the resource
                   list above has to give back on the first frame of real data. -->
              <div class="flex flex-col gap-(--spacing-xxs)">
                <Skeleton
                  width="70%"
                  height="1.125rem"
                />
                <Skeleton height="1.0625rem" />
                <Skeleton
                  width="55%"
                  height="1.0625rem"
                />
              </div>
            </div>
          </template>
        </CardBox>
      </div>
    </div>
  </div>
</template>
