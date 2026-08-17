<script setup>
  // Overview's FIRST ACCESS without its data — the hero's own shape, in placeholder
  // fill. The counterpart of ./HomeWire.vue, which draws the populated Overview.
  //
  // ── WHY THIS EXISTS AT ALL ──
  //
  // /home is read on arrival in BOTH versions: usage is metered per tenancy scope and
  // the resource list is a query, and it is precisely that read coming back empty
  // that decides the reader gets a hero instead of a table. So the first access has
  // the same cold arrival as the populated Overview — the page lands, THEN its
  // content settles.
  //
  // It is also what makes the two versions move identically. Without it the hero's
  // `animate-content-enter` fired on mount, which is while the route transition is still
  // travelling: measured, the cards were at opacity 0.08 rising through 7px while the
  // page itself was still at 0.53 and −11px. Two moves on two axes at once, where the
  // populated Overview does them in sequence. A page cannot arrive twice.
  //
  // ── WHY IT IS ITS OWN WIRE AND NOT HomeWire ──
  //
  // A wire's whole job is that nothing shifts when it resolves. HomeWire draws a usage
  // rail beside a table; showing that and then resolving to a centred hero would be
  // the exact layout jump the wire exists to prevent. Same rule, two shapes.
  //
  // The measures are the real block's, copied from the elements they stand in for
  // (../HomeEmptyState.vue's hero, ./FirstUseCard.vue's anatomy) rather than
  // hand-tuned: same column, same gaps, same 4/3 stage, so the heights agree by
  // construction instead of by a pixel someone measured once.
  import CardBox from '@aziontech/webkit/card-box'
  import Skeleton from '@aziontech/webkit/skeleton'

  // The three doors. The count matters — a wire with the wrong number of cards is a
  // layout that shifts the moment it resolves.
  const DOORS = 3
</script>

<template>
  <div
    class="flex min-h-full flex-col justify-center gap-(--layout-section-gap) py-(--spacing-xl)"
    aria-hidden="true"
  >
    <!-- The hero: the line, then the ⌘K field at its real width. -->
    <div class="flex flex-col items-center gap-(--spacing-lg)">
      <Skeleton
        width="19rem"
        height="2.375rem"
      />
      <div class="flex w-full max-w-(--container-2xl) flex-col items-stretch">
        <Skeleton height="2.5rem" />
      </div>
    </div>

    <!-- The card row, at FirstUseCard's own anatomy: the 4/3 stage, then the text
         block, then the line the action sits on. -->
    <div class="grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-3">
      <CardBox
        v-for="door in DOORS"
        :key="door"
        :padded="false"
      >
        <template #content>
          <div class="flex h-full flex-col p-(--spacing-sm)">
            <!-- The stage is REAL — same frame, same fill, same 4/3 — and only the art
                 inside it is standing in, at the 170×128 canvas every scene is drawn
                 on. Leaving the stage blank made the largest region of the wire the
                 one region that said nothing. -->
            <div
              class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
            >
              <Skeleton
                width="170px"
                height="128px"
              />
            </div>
            <div
              class="flex flex-1 flex-col gap-(--spacing-md) px-(--spacing-sm) pb-(--spacing-sm) pt-(--spacing-md)"
            >
              <!-- One line of title over two of description, each at the line-height
                   of the type it stands in for, and an action at the height of the
                   TALLEST of the three (the domain card's input, not a button) —
                   equal-height grid tracks mean that card sets the row. -->
              <div class="flex flex-1 flex-col gap-(--spacing-xs)">
                <Skeleton
                  width="55%"
                  height="1.25rem"
                />
                <Skeleton height="1.25rem" />
                <Skeleton
                  width="70%"
                  height="1.25rem"
                />
              </div>
              <div class="flex items-center">
                <Skeleton
                  width="8rem"
                  height="2.5rem"
                />
              </div>
            </div>
          </div>
        </template>
      </CardBox>
    </div>
  </div>
</template>
