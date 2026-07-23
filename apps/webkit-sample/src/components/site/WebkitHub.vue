<script setup>
  // Landing-page example: the Home of the "Webkit Hub" — an interactive banner
  // that showcases the @aziontech/webkit component library as a 3D-tilted
  // "Component Grid" (a recreation of the Figma "Grid 3D Transform" frame).
  // Rendered inside the segregated marketing shell (website nav + footer, dark
  // theme), mirroring how LandingAzion pairs SiteLayout with a content component.
  import ComponentGrid from './ComponentGrid.vue'
  import SiteLayout from './SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <section class="relative overflow-hidden border-b border-[var(--border-muted)]">
      <div class="relative z-10 mx-auto w-full max-w-[var(--container-7xl)] px-[var(--spacing-md)]">
        <!-- Hero copy. -->
        <div class="flex flex-col items-start gap-[var(--spacing-md)] pb-[var(--spacing-lg)] pt-[var(--spacing-xxl)]">
          <div class="flex items-center gap-[var(--spacing-xs)]">
            <span
              aria-hidden="true"
              class="size-2.5 rounded-[var(--shape-elements)] bg-[var(--color-orange-500)]"
            />
            <span class="text-overline-sm uppercase tracking-widest text-[var(--text-muted)]">
              Webkit Hub
            </span>
          </div>
          <h1 class="max-w-[var(--container-4xl)] text-balance text-left text-heading-2xl text-[var(--text-default)]">
            One design system. Every component, ready to compose.
          </h1>
          <p class="max-w-[var(--container-2xl)] text-pretty text-body-lg text-[var(--text-muted)]">
            Explore the @aziontech/webkit library. Hover any component in the grid to highlight it — tokens, accessibility, and dark mode built in.
          </p>
        </div>
      </div>

      <!-- Component Grid layer — the 3D showcase plane. Extra bottom padding gives
           the cells room to lift toward the viewer on hover without clipping. -->
      <div class="mx-auto w-full max-w-[var(--container-7xl)] px-[var(--spacing-md)] pb-[var(--spacing-xxl)] pt-[var(--spacing-lg)]">
        <ComponentGrid />
      </div>
    </section>
  </SiteLayout>
</template>
