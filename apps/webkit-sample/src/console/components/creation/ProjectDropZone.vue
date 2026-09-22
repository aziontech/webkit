<script setup>
  // THE CONTENT AREA IS THE TARGET, NOT A LAYER OVER IT.
  //
  // This was a full-screen overlay teleported to `body`: a scrim over the whole viewport
  // with a card floating in the middle of it. It said "somewhere on this screen" and
  // pointed at nothing — the rail, the header and the breadcrumb went under it too, and
  // the card's edges had no relationship to any region of the page.
  //
  // It fills its positioned ancestor instead, which every consumer makes `<main>`. The
  // content zone itself becomes the dashed box, so what the reader is aiming at is a
  // region of the page they were already reading rather than a shape that arrived on top
  // of it.
  //
  // `pointer-events-none` is what keeps it a drawing. The drop is read off WINDOW
  // listeners (../../lib/behavior/project-upload.js), so a release anywhere on the page
  // still lands — this only has to say where the project is going.
  //
  // `--drop-zone-inset` is how far the dashed boundary sits inside the region, and it
  // is read off the ANCESTOR rather than declared here, so a consumer whose `<main>` runs
  // to the viewport edge can pull it in to the page's own boundary. It is written as a
  // `var()` fallback for that reason — a default declared on this element would beat the
  // inherited value instead of yielding to it. Zero where nobody sets it: a region that
  // already carries the page inset (Overview) wants the box on its real edges.
  //
  // `z-40` because page content underneath carries its own stacking: a row's action
  // button sits at `z-10` and an overhanging chart card at `z-30`, and at an equal
  // z-index the LATER element in the DOM wins — which was every one of them, since this
  // is the region's first child. Teleported overlays live on `body` at `z-50` and above,
  // outside this stacking context entirely, so they are not what this has to clear.
  defineProps({
    /** Whether a file drag is currently over the window. */
    active: { type: Boolean, default: false },
    /** Heading shown on the drop surface. */
    title: { type: String, default: 'Drop your project to deploy it' },
    /** One line under it. */
    description: {
      type: String,
      default: 'A project folder, or the files inside one. Azion reads what it is built with.'
    }
  })
</script>

<template>
  <Transition
    enter-active-class="animate-fade-in motion-reduce:animate-none"
    leave-active-class="animate-fade-out motion-reduce:animate-none"
  >
    <div
      v-if="active"
      aria-hidden="true"
      class="pointer-events-none absolute inset-[var(--drop-zone-inset,0)] z-40 overflow-hidden rounded-(--shape-card) border-2 border-dashed border-(--border-selected) bg-(--bg-canvas)"
    >
      <!-- The dashed border marks the whole region, which on a long page is taller than
           the viewport — so the message rides the scroll position rather than sitting at
           the region's midpoint, where a reader scrolled halfway down would never see it.
           `max-h-full` keeps it from overflowing a region shorter than the viewport. -->
      <div
        class="sticky top-0 flex h-dvh max-h-full flex-col items-center justify-center gap-(--spacing-md) p-(--spacing-lg) text-center"
      >
        <span
          class="flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised)"
        >
          <i
            class="pi pi-cloud-upload text-[1.25rem] leading-none text-(--text-default)"
            aria-hidden="true"
          />
        </span>
        <div class="flex max-w-(--container-md) flex-col gap-(--spacing-xxs)">
          <p class="text-heading-xs text-(--text-default)">{{ title }}</p>
          <p class="text-pretty text-body-sm text-(--text-muted)">{{ description }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>
