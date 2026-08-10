<script setup>
  // The page, WITHOUT its data — what the console shows for a beat when the
  // session token expires under it (see ../../lib/session.js for the sequence).
  //
  // Why a wire and not a spinner or a modal: every value on the screen at that
  // moment — the org in the header, the rows in the table, the name of the
  // resource — arrived through a request the dead token authorised. None of it is
  // backed by anything any more. A spinner on top would claim the page is still
  // coming back, and a modal would claim the page underneath is still yours. The
  // wire says the true thing: the shape of where you were is still there, the
  // content is gone, and you are about to be signed out of it.
  //
  // It is a wire of the CURRENT route, not one generic loading screen, and it gets
  // there two different ways:
  //
  //   - THE SHELL IS MEASURED, not guessed. The header's height and the rail's
  //     width are read off the live DOM on mount (the page is still mounted
  //     underneath at that point), so the wire inherits the reader's own console:
  //     a rail they dragged wider, a rail they collapsed to icons, and below `md`
  //     no rail at all — all correct from one measurement, instead of a copy of
  //     AppLayout's breakpoints that would drift from it.
  //   - THE CONTENT SHAPE comes from the route family, and each family is drawn as
  //     that family really is in this app:
  //       list   → controls row, borderless table in a flush card, pager. No page
  //                heading: a first-level module list has none (the module name is
  //                the header's crumb).
  //       detail → the full-bleed tab bar that forms the bottom of the header,
  //                then the open tab's cards inside their own boundary.
  //       form   → the create flow: PageHeading, section-titled cards of two-column
  //                field rows, sticky action bar.
  //       home   → the narrow usage rail beside the resources card, centred.
  //     Four shapes cover ~50 routes; the fallback is the list, which is what most
  //     of the console is.
  //
  // Everything is `--bg-placeholder` through the DS Skeleton, the same fill the
  // onboarding preview uses for the parts it does not own (see OnboardingWire.vue),
  // and the same boundary / measure classes the real pages use (src/styles/
  // layout.css) so the wire's column sits exactly where the content it replaces
  // sat. Nothing here is a real control: the wire must never look like a screen you
  // can use, and it deliberately eats pointer events, because the session behind it
  // is already gone.
  import CardBox from '@aziontech/webkit/card-box'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  // Fallbacks are only ever used if the shell is somehow not on screen when the
  // wire mounts; in practice both are measured on the first frame.
  const HEADER_FALLBACK = 56
  const headerHeight = ref(HEADER_FALLBACK)
  const railWidth = ref(0)

  // The rail is either absent or full-width — there is no narrow variant to wire.
  // Measured in the real shell: expanded it is 300px, the drag clamps to 256 at the
  // low end (`Sidebar`'s min container token), and COLLAPSED it is 0 — the rail
  // stays mounted and animates its width to nothing (see AppLayout.vue), so the
  // page genuinely has no rail on screen and neither does the wire.
  onMounted(() => {
    const header = document.querySelector('[data-testid="layout-global-header"]')
    if (header) headerHeight.value = Math.round(header.getBoundingClientRect().height)

    // Two rails can be mounted at once — the fixed one and the copy inside the
    // mobile nav Drawer — so take the one on the LEFT edge, and only if it is
    // actually visible (below `md` the fixed rail is `display:none`, which reports
    // a width of 0 and correctly wires a shell with no rail).
    const rail = [...document.querySelectorAll('[data-testid="layout-sidebar"]')]
      .map((node) => node.getBoundingClientRect())
      .find((rect) => rect.width > 0 && rect.left < 100)
    if (rail) railWidth.value = Math.round(rail.width)
  })

  // Route → content shape. Ordered: the first pattern that matches wins.
  const FAMILIES = [
    [/^(home|dashboard)$/, 'home'],
    [/(-new|-edit)$|^(create|deploy|release-composer|forms-.*)$/, 'form'],
    [/(-detail)$|^(bucket-browser|account|account-.*|resources)$/, 'detail']
  ]

  const family = computed(() => {
    const name = String(route.name ?? '')
    return FAMILIES.find(([pattern]) => pattern.test(name))?.[1] ?? 'list'
  })

  // The page column each family is capped at, matching src/styles/layout.css: data
  // pages get the wide measure, home the focused one, create flows their own.
  const columnClass = computed(
    () =>
      ({
        home: 'layout-column-focused',
        form: 'layout-form-create',
        detail: 'layout-column',
        list: 'layout-column'
      })[family.value]
  )

  // Nav rows read like the real rail — a first group with no overline, then product
  // areas under one each — and the widths vary the way real labels do instead of
  // stacking as identical blocks (same vocabulary as OnboardingWire). Four groups,
  // because the real rail's items run the full height of the viewport.
  const NAV_GROUPS = [
    { id: 'top', labelled: false, items: ['40%', '52%', '58%', '56%'] },
    { id: 'build', labelled: true, items: ['62%', '46%', '48%', '54%', '66%'] },
    { id: 'store', labelled: true, items: ['64%', '58%'] },
    { id: 'secure', labelled: true, items: ['42%', '50%', '54%', '72%', '60%'] }
  ]

  // A table row's cells, in the proportions the module lists actually use: a wide
  // principal column, then values, then a short status. Eight rows — the page size
  // every list in this app is paginated at.
  const TABLE_CELLS = ['18%', '15%', '9%', '17%', '11%', '8%']
  const TABLE_ROWS = 8

  // Two sections of three field rows, which is the shape of every create page AND
  // every resource tab here: a section title over a card whose rows are
  // name-and-guidance on the left, the control on the right
  // (`.layout-field-control`).
  const FORM_SECTIONS = 2
  const FORM_ROWS = ['58%', '44%', '66%']

  // A resource page's tabs, at the widths real tab labels run to.
  const DETAIL_TABS = ['6rem', '3rem', '7.5rem', '8rem', '9rem', '6.5rem']

  // Home's left rail: one card per usage metric.
  const HOME_METRICS = 4
</script>

<template>
  <!-- Above every overlay in the app (the DS tops out at 1100 for an input popup
       over a panel): if the token dies while a Drawer or a Select is open, the wire
       has to cover those too — they belong to the session that just ended.

       `role="status"` + one sr-only line, because to a screen reader the skeletons
       are nothing (each one is `aria-hidden`) and the announcement IS the event. -->
  <div
    role="status"
    aria-live="polite"
    aria-busy="true"
    data-testid="session-wire"
    class="fixed inset-0 z-[1200] flex flex-col overflow-hidden bg-[var(--bg-canvas)] animate-fade-in motion-reduce:animate-none"
  >
    <span class="sr-only">Session expired. Signing you out.</span>

    <!-- The header, at its measured height: the mark, the tenancy chain, the
         breadcrumb, then the actions and the avatar on the right. -->
    <div
      class="flex shrink-0 items-center gap-[var(--spacing-xs)] border-b-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)] px-[var(--spacing-md)]"
      :style="{ height: `${headerHeight}px` }"
    >
      <Skeleton
        width="1.25rem"
        height="1.25rem"
      />
      <Skeleton
        width="5rem"
        height="0.875rem"
      />
      <Skeleton
        width="4.5rem"
        height="0.875rem"
      />
      <Skeleton
        class="hidden md:block"
        width="6rem"
        height="0.875rem"
      />
      <Skeleton
        class="hidden lg:block"
        width="8rem"
        height="0.875rem"
      />

      <div class="ml-auto flex items-center gap-[var(--spacing-xs)]">
        <Skeleton
          width="5.5rem"
          height="2rem"
        />
        <Skeleton
          class="hidden md:block"
          width="4.5rem"
          height="2rem"
        />
        <Skeleton
          kind="circle"
          width="2rem"
          height="2rem"
        />
      </div>
    </div>

    <div class="flex min-h-0 flex-1">
      <!-- The rail, at exactly the width the reader has it: the search field, the
           nav groups, and the signed-in user pinned to the bottom. Absent entirely
           when the page had no rail on screen — a create flow, a collapsed rail, or
           below `md`. -->
      <div
        v-if="railWidth > 0"
        class="flex shrink-0 flex-col gap-[var(--spacing-lg)] overflow-hidden border-r-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)] p-[var(--spacing-sm)]"
        :style="{ width: `${railWidth}px` }"
      >
        <Skeleton height="2.5rem" />

        <div
          v-for="group in NAV_GROUPS"
          :key="group.id"
          class="flex flex-col gap-[var(--spacing-md)]"
        >
          <Skeleton
            v-if="group.labelled"
            width="30%"
            height="0.5rem"
          />
          <Skeleton
            v-for="(item, index) in group.items"
            :key="index"
            :width="item"
            height="0.875rem"
          />
        </div>

        <!-- The rail's footer: the signed-in user, which is precisely what the
             expired token stopped identifying. -->
        <div class="mt-auto flex items-center gap-[var(--spacing-xs)]">
          <Skeleton
            width="1.5rem"
            height="1.5rem"
          />
          <Skeleton
            width="50%"
            height="0.75rem"
          />
        </div>
      </div>

      <div class="flex min-w-0 flex-1 flex-col">
        <!-- DETAIL — the tab bar is the bottom of the header on a resource page:
             full-bleed, with its own border across the whole content zone. So it
             sits OUTSIDE the boundary, exactly as PageTabs does. -->
        <div
          v-if="family === 'detail'"
          class="layout-boundary-inline flex h-14 shrink-0 items-center gap-[var(--spacing-lg)] border-b-[length:var(--border-width-default)] border-[var(--border-muted)]"
        >
          <Skeleton
            v-for="(tab, index) in DETAIL_TABS"
            :key="index"
            :width="tab"
            height="0.875rem"
          />
        </div>

        <div class="layout-boundary min-h-0 flex-1 overflow-hidden">
          <!-- LIST — the controls row that narrows the table, then the table. One
               band: the group step joins them, as on the real module lists. -->
          <div
            v-if="family === 'list'"
            :class="columnClass"
            class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]"
          >
            <div class="flex items-center gap-[var(--spacing-sm)]">
              <Skeleton
                width="2.5rem"
                height="2.5rem"
              />
              <Skeleton
                class="grow"
                height="2.5rem"
              />
              <Skeleton
                width="10rem"
                height="2.5rem"
              />
            </div>

            <CardBox :padded="false">
              <template #content>
                <div
                  class="flex items-center gap-[var(--spacing-md)] border-b-[length:var(--border-width-default)] border-[var(--border-default)] px-[var(--spacing-md)] py-[var(--spacing-md)]"
                >
                  <Skeleton
                    v-for="(cell, index) in TABLE_CELLS"
                    :key="index"
                    :width="cell"
                    height="0.75rem"
                  />
                </div>
                <div
                  v-for="row in TABLE_ROWS"
                  :key="row"
                  class="flex items-center gap-[var(--spacing-md)] px-[var(--spacing-md)] py-[var(--spacing-md)]"
                >
                  <Skeleton
                    v-for="(cell, index) in TABLE_CELLS"
                    :key="index"
                    :width="cell"
                    height="0.875rem"
                  />
                </div>
                <!-- The pager: the count on the left, the controls on the right.
                     Without it the card stops where the reader knows a footer
                     was. -->
                <div
                  class="flex items-center justify-between gap-[var(--spacing-md)] border-t-[length:var(--border-width-default)] border-[var(--border-default)] px-[var(--spacing-md)] py-[var(--spacing-sm)]"
                >
                  <Skeleton
                    width="11rem"
                    height="0.75rem"
                  />
                  <div class="flex items-center gap-[var(--spacing-xs)]">
                    <Skeleton
                      v-for="index in 4"
                      :key="index"
                      width="2rem"
                      height="2rem"
                    />
                  </div>
                </div>
              </template>
            </CardBox>
          </div>

          <!-- DETAIL body — the open tab's cards. -->
          <!-- FORM and DETAIL share one body, because in this app they ARE the same
               shape: a heading, then section-titled cards of two-column field rows
               (name and guidance on the left, the control on the right). A create
               page adds the sticky action bar below; a resource page adds the tab
               bar above. Only the measure differs, and that comes from
               `columnClass`. -->
          <div
            v-else-if="family === 'form' || family === 'detail'"
            :class="columnClass"
            class="flex min-w-0 flex-col"
          >
            <div class="flex flex-col gap-[var(--spacing-xs)]">
              <Skeleton
                width="14rem"
                height="1.5rem"
              />
              <Skeleton
                width="26rem"
                height="0.875rem"
              />
            </div>

            <div
              class="layout-section-start flex flex-col gap-[var(--layout-section-gap)]"
            >
              <div
                v-for="section in FORM_SECTIONS"
                :key="section"
                class="flex flex-col gap-[var(--layout-group-gap)]"
              >
                <Skeleton
                  width="7rem"
                  height="1rem"
                />
                <CardBox :padded="false">
                  <template #content>
                    <div
                      v-for="(field, index) in FORM_ROWS"
                      :key="index"
                      class="flex items-center gap-[var(--spacing-md)] px-[var(--spacing-md)] py-[var(--spacing-md)]"
                      :class="
                        index > 0
                          ? 'border-t-[length:var(--border-width-default)] border-[var(--border-default)]'
                          : ''
                      "
                    >
                      <div class="flex min-w-0 flex-1 flex-col gap-[var(--spacing-xs)]">
                        <Skeleton
                          width="6rem"
                          height="0.875rem"
                        />
                        <Skeleton
                          :width="field"
                          height="0.75rem"
                        />
                      </div>
                      <div class="layout-field-control">
                        <Skeleton height="2.5rem" />
                      </div>
                    </div>
                  </template>
                </CardBox>
              </div>
            </div>
          </div>

          <!-- HOME — the narrow usage rail beside the resources card, centred in
               the scroll area the way the real page centres itself. -->
          <div
            v-else
            :class="columnClass"
            class="flex min-h-full min-w-0 flex-col justify-center"
          >
            <div
              class="flex flex-col gap-[var(--layout-boundary-start)] lg:flex-row lg:gap-[var(--layout-section-gap)]"
            >
              <div
                class="flex w-full shrink-0 flex-col gap-[var(--layout-group-gap)] lg:max-w-[var(--container-xs)]"
              >
                <Skeleton
                  width="4rem"
                  height="1rem"
                />
                <div
                  class="grid auto-rows-fr grid-cols-2 gap-[var(--layout-group-gap)] lg:grid-cols-1"
                >
                  <CardBox
                    v-for="metric in HOME_METRICS"
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

              <div class="flex min-w-0 grow flex-col gap-[var(--layout-group-gap)]">
                <Skeleton
                  width="7rem"
                  height="1rem"
                />
                <CardBox :padded="false">
                  <template #content>
                    <div
                      v-for="row in 6"
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
          </div>
        </div>

        <!-- The create/edit flows end in a sticky bar, so their wire does too. -->
        <div
          v-if="family === 'form'"
          class="layout-boundary-inline flex shrink-0 items-center justify-end gap-[var(--spacing-sm)] border-t-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)] py-[var(--spacing-sm)]"
        >
          <Skeleton
            width="5.5rem"
            height="2.5rem"
          />
          <Skeleton
            width="7rem"
            height="2.5rem"
          />
        </div>
      </div>
    </div>
  </div>
</template>
