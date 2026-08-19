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

  // The left rail: one card per usage metric. The count matters — a wire with the
  // wrong number of cards is a layout that shifts the moment it resolves.
  const METRICS = 4

  // Whether the greeting row still carries the agent pill — the one thing that changes
  // that row's height (37px with it, 25px without), and a persisted per-reader answer.
  const { agentOnboardingVisible } = useAgentOnboarding()

  // The resource ROWS, at the count the real page's tenancy-reload skeleton uses.
  // Six is also `RECENT_COUNT` there, so the wire's single block resolves into the
  // `Recents` block exactly, and the `Older` one arrives below the fold it was
  // already below.
  // The agent card's logo cluster — four editor marks, the count ProductFirstUse and the
  // rail's own card both draw (`AGENT_TOOLS.slice(0, 4)`).
  const MARKS = 4

  const ROWS = 6
</script>

<template>
  <!-- The page's own stack: the GREETING row, the SEARCH row, then the two columns —
       the real page's structure (../../pages/home/Home.vue), where the search is a
       page-level row inside `<main>` above both columns and not a control of the
       Resources band.
       Both leading rows are here because a wire is only worth drawing if it lands where
       the page lands: without them the columns opened 62px high (measured) and every
       first frame of real data pushed the whole page down by that much — the exact
       shift this component exists to prevent. The gap between the rows is the page's
       own (`--layout-boundary-start`, which is what `<main>`'s `layout-section-start`
       margin resolves to). -->
  <div
    class="flex flex-col gap-(--layout-boundary-start)"
    aria-hidden="true"
  >
    <!-- The greeting, alone on its row. It used to share the row with the agent pill,
         which is what made this the one row on the page whose height depended on a
         persisted answer (37px with the pill, the heading's own 24.75px line box
         without) — the wire had to read the flag just to pick a height. The onboarding
         is a card at the foot of the usage rail now (../../pages/home/Home.vue), so
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

    <div
      class="flex flex-col gap-(--layout-boundary-start) xl:flex-row xl:gap-(--layout-section-gap)"
    >
      <!-- Usage: the section title, then one card per metric — 2-up while the rail
         is full width, single column once it narrows at `xl`.
         The split point and the rail's 30%-capped-at-`--container-xs` width are the
         real page's (../Home.vue): a wire that resolves into a different column
         split is a layout that jumps on the first frame of real data. -->
      <div
        class="flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:w-[30%] xl:max-w-(--container-xs)"
      >
        <Skeleton
          width="4rem"
          height="1rem"
        />
        <div class="grid auto-rows-fr grid-cols-2 gap-(--layout-group-gap) xl:grid-cols-1">
          <CardBox
            v-for="metric in METRICS"
            :key="metric"
          >
            <template #content>
              <div class="flex flex-col gap-(--spacing-md)">
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

        <!-- The agent onboarding card at the foot of the rail, at FirstUsePromo's own
             anatomy (./FirstUsePromo.vue): the 32px logo cluster, then the title over one
             line of copy. Behind the same persisted flag the page binds — a card the
             reader dismissed is not a shape the wire should reserve, and a card they still
             have is rail the wire cannot leave short without the column jumping on
             arrival.
             The cluster stands in as four 32px squares at the real overlap (`-ml-2`), not
             as one wide block: it is the largest thing in the card, and a bar where four
             marks resolve is the shift this file exists to prevent. -->
        <!-- The rule the real rail draws above the card (a DS `Divider` there; a hairline
             on the same border token here, since nothing about a 1px rule is a
             placeholder to fill). -->
        <div
          v-if="agentOnboardingVisible"
          class="my-(--spacing-sm) w-full border-t border-(--border-default)"
        />

        <div
          v-if="agentOnboardingVisible"
          class="shrink-0"
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
                <div class="flex flex-col gap-(--spacing-xxs)">
                  <Skeleton
                    width="70%"
                    height="1.125rem"
                  />
                  <Skeleton height="1.0625rem" />
                </div>
              </div>
            </template>
          </CardBox>
        </div>
      </div>

      <!-- Resources: the header band (the title, and the type control on its far edge —
         both stay out of the scroll region on the real page), then ONE flush card of
         divided rows.
         It was a 1/2/3-up grid of cards; the band is now an `Item.List` in a flush
         CardBox, and a wire whose shape resolves into a different one is the layout
         shift it exists to prevent. The header reserves `--size-10` because the real
         one does — it carries a 36px segmented control and is matched by the Usage
         heading opposite it. -->
      <div class="flex min-w-0 grow flex-col gap-(--layout-group-gap)">
        <div class="flex min-h-(--size-10) items-center gap-(--spacing-sm)">
          <Skeleton
            width="7rem"
            height="1rem"
          />
          <Skeleton
            class="ml-auto"
            width="26rem"
            height="var(--size-9)"
          />
        </div>

        <!-- The group label above the block, at the width of `Recents` and inside the
             18px line box that label's `text-label-sm` actually occupies — measured, and
             the same reason the rows pin their content height. -->
        <div class="flex flex-col gap-(--spacing-xs)">
          <div class="flex h-[18px] items-center px-(--spacing-xs)">
            <Skeleton
              width="3.5rem"
              height="0.875rem"
            />
          </div>

          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <Item
                  v-for="row in ROWS"
                  :key="row"
                  role="listitem"
                >
                  <Item.Media>
                    <Skeleton
                      kind="shape"
                      width="2rem"
                      height="2rem"
                    />
                  </Item.Media>
                  <!-- Pinned to what a real row's two lines MEASURE — 37.5px: a 21px
                       title line box (`text-label-md`) over a 16.5px description one
                       (`text-body-xs`) — with the bars pushed to its ends. A fixed-height
                       Skeleton carries no line-height, so two bars and a gap come to 34px
                       and every placeholder row is 4px short, which is 24px of drift over
                       six of them. The widths alternate so the column does not read as a
                       printed form. -->
                  <Item.Content class="h-[37.5px] justify-between">
                    <Skeleton
                      :width="row % 2 ? '35%' : '28%'"
                      height="0.875rem"
                    />
                    <Skeleton
                      :width="row % 2 ? '55%' : '44%'"
                      height="0.75rem"
                    />
                  </Item.Content>
                  <Item.Actions>
                    <Skeleton
                      width="4rem"
                      height="1.5rem"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>
        </div>
      </div>
    </div>
  </div>
</template>
